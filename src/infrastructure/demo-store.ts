import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import {
  DemoError,
  tokenOf,
  type Configuration,
  type DemoState,
  type ExportedDemo,
  type Language,
  type OpeningRequest,
  type StoredDemo,
  type Token,
} from '../domain/model';
import { initialize, openFrog } from '../domain/opening';
import { parseExport, validateConfiguration } from '../domain/validation';
interface Database extends DBSchema {
  records: { key: string; value: StoredDemo };
}
interface TestFaults {
  afterWrite?: () => void;
  afterCommit?: () => void;
}
function mergeConfiguration(configs: Configuration[], candidate: Configuration): Configuration[] {
  for (const c of configs) {
    if (
      (c.catalog.version === candidate.catalog.version &&
        JSON.stringify(c.catalog) !== JSON.stringify(candidate.catalog)) ||
      (c.table.version === candidate.table.version &&
        JSON.stringify(c.table) !== JSON.stringify(candidate.table))
    )
      throw new DemoError('CONFLICT');
  }
  if (
    configs.some(
      (c) =>
        c.catalog.version === candidate.catalog.version &&
        c.table.version === candidate.table.version,
    )
  )
    return configs;
  return [...configs, candidate];
}
function checkToken(stored: StoredDemo, expected: Token, revision = false) {
  if (
    stored.generation !== expected.generation ||
    stored.state.runId !== expected.runId ||
    (revision && stored.state.revision !== expected.revision)
  )
    throw new DemoError('STALE_STATE');
}
export function randomTicket(max: number): number {
  // Rejection sampling avoids modulo bias; animation has no access to this function.
  const limit = Math.floor(0x100000000 / max) * max,
    a = new Uint32Array(1);
  do {
    crypto.getRandomValues(a);
  } while (a[0] >= limit);
  return a[0] % max;
}
export class DemoStore {
  private connection: Promise<IDBPDatabase<Database>> | undefined;
  constructor(
    private name = 'magic-i1',
    private ticket = randomTicket,
    private faults: TestFaults = {},
  ) {}
  private database(): Promise<IDBPDatabase<Database>> {
    if (!this.connection) {
      const connection = Promise.resolve().then(() =>
        openDB<Database>(this.name, 1, {
          upgrade(db) {
            db.createObjectStore('records');
          },
          blocking: () => {
            void connection.then((db) => db.close());
            this.connection = undefined;
          },
          terminated: () => {
            this.connection = undefined;
          },
        }),
      );
      this.connection = connection;
      // A synchronous denial also becomes a recoverable promise rejection.
      void connection.catch(() => {
        if (this.connection === connection) this.connection = undefined;
      });
    }
    return this.connection;
  }
  async close() {
    (await this.database()).close();
  }
  private async transaction(
    update: (current: StoredDemo | undefined) => StoredDemo,
  ): Promise<StoredDemo> {
    const db = await this.database(),
      tx = db.transaction('records', 'readwrite', { durability: 'strict' });
    // Observe completion from creation, including rejected completion after explicit abort.
    const completion = tx.done.then(
      () => true,
      () => false,
    );
    let next: StoredDemo | undefined;
    try {
      const current = await tx.store.get('current');
      if (current)
        parseExport(
          JSON.stringify({
            format: 'magic-i1',
            schemaVersion: 1,
            state: current.state,
            configurations: current.configurations,
          }),
        );
      next = update(current);
      if (next !== current) {
        if (!Number.isSafeInteger(next.generation) || next.generation < 1)
          throw new DemoError('STALE_STATE');
        parseExport(
          JSON.stringify({
            format: 'magic-i1',
            schemaVersion: 1,
            state: next.state,
            configurations: next.configurations,
          }),
        );
        await tx.store.put(next, 'current');
        this.faults.afterWrite?.();
      }
      if (!(await completion)) throw new DemoError('STORAGE');
      this.faults.afterCommit?.();
      return next;
    } catch (error) {
      try {
        tx.abort();
      } catch {
        /* A completed transaction cannot be rolled back. */
      }
      const committed = await completion;
      if (committed) throw new DemoError('UNKNOWN');
      if (error instanceof DemoError) throw error;
      throw new DemoError('STORAGE');
    }
  }
  async start(config: unknown, language: Language): Promise<StoredDemo> {
    const valid = validateConfiguration(config);
    return this.transaction((current) => {
      if (!current)
        return {
          generation: 1,
          state: initialize(crypto.randomUUID(), language, valid),
          active: valid,
          configurations: [valid],
        };
      const configurations = mergeConfiguration(current.configurations, valid);
      if (
        valid.catalog.version < current.active.catalog.version ||
        valid.table.version < current.active.table.version
      )
        return current;
      if (
        valid.catalog.version === current.active.catalog.version &&
        valid.table.version === current.active.table.version
      )
        return current;
      return {
        ...current,
        active: valid,
        configurations,
        state: { ...current.state, revision: current.state.revision + 1 },
      };
    });
  }
  async read(): Promise<StoredDemo> {
    const stored = await (await this.database()).get('records', 'current');
    if (!stored) throw new DemoError('STORAGE');
    parseExport(
      JSON.stringify({
        format: 'magic-i1',
        schemaVersion: 1,
        state: stored.state,
        configurations: stored.configurations,
      }),
    );
    return stored;
  }
  async open(key: string, request: OpeningRequest, expected: Token): Promise<StoredDemo> {
    return this.transaction((current) => {
      if (!current) throw new DemoError('STORAGE');
      checkToken(current, expected);
      const state = openFrog(current.state, key, request, current.active, this.ticket);
      return state === current.state ? current : { ...current, state };
    });
  }
  async preferences(
    values: Partial<Pick<DemoState, 'language' | 'ambient' | 'reducedMotion'>>,
    expected: Token,
  ): Promise<StoredDemo> {
    return this.transaction((current) => {
      if (!current) throw new DemoError('STORAGE');
      checkToken(current, expected);
      return {
        ...current,
        state: { ...current.state, ...values, revision: current.state.revision + 1 },
      };
    });
  }
  async seen(id: string, expected: Token): Promise<StoredDemo> {
    return this.transaction((current) => {
      if (!current) throw new DemoError('STORAGE');
      checkToken(current, expected);
      if (!current.state.operations.some((o) => o.id === id)) throw new DemoError('CONFLICT');
      if (current.state.seenOperationId === id) return current;
      return {
        ...current,
        state: { ...current.state, seenOperationId: id, revision: current.state.revision + 1 },
      };
    });
  }
  async export(): Promise<string> {
    const s = await this.read();
    return JSON.stringify(
      {
        format: 'magic-i1',
        schemaVersion: 1,
        state: s.state,
        configurations: s.configurations,
      } satisfies ExportedDemo,
      null,
      2,
    );
  }
  async replace(imported: ExportedDemo | null, expected: Token): Promise<StoredDemo> {
    const validated = imported ? parseExport(JSON.stringify(imported)) : null;
    return this.transaction((current) => {
      if (!current) throw new DemoError('STORAGE');
      checkToken(current, expected, true);
      const configurations = validated
        ? validated.configurations.reduce(mergeConfiguration, current.configurations)
        : current.configurations;
      return {
        ...current,
        generation: current.generation + 1,
        configurations,
        state: validated
          ? { ...validated.state, revision: 1 }
          : initialize(crypto.randomUUID(), current.state.language, current.active),
      };
    });
  }
  async activate(config: Configuration): Promise<StoredDemo> {
    return this.start(config, (await this.read()).state.language);
  }
}
export function openingRequest(s: StoredDemo): OpeningRequest {
  return {
    runId: s.state.runId,
    unitId: s.state.runId + ':frog',
    kind: 'welcome-frog',
    catalogVersion: s.active.catalog.version,
    tableVersion: s.active.table.version,
  };
}
export { tokenOf };
