import { randomUUID, createHash } from 'node:crypto';
import { access, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { performance } from 'node:perf_hooks';
import { Pool, type PoolClient } from 'pg';
import { expect, it } from 'vitest';
import {
  PostgresGameTransactions,
  applyGameSchema,
} from '../../src/arcana/infrastructure/postgres/game-transactions';
import type { GameState, OperationReceipt } from '../../src/arcana/application/game';
import { createInventory } from '../../src/arcana/domain/economy/inventory';

interface QueryMeasures {
  count: number;
  rowsReturned: number;
  rowsAffected: number;
  clientSqlMs: number;
}
const fresh = (): QueryMeasures => ({ count: 0, rowsReturned: 0, rowsAffected: 0, clientSqlMs: 0 });
const receipt = (index: number): OperationReceipt => ({
  id: `team-${index}`,
  kind: 'set-team',
  request: { copyIds: [] },
  team: { copyIds: [], loadouts: [] },
  run: null,
});

it('measures four bounded histories in its own disposable PostgreSQL schema', async () => {
  const label = process.env.ARCANA_PERSISTENCE_LABEL;
  if (label !== 'before' && label !== 'after')
    throw Error('Set ARCANA_PERSISTENCE_LABEL=before|after explicitly');
  const reportPath = resolve(
    process.env.ARCANA_PERSISTENCE_REPORT ??
      `docs/arcana/priority-increment-2026-10-19/persistence-${label}.json`,
  );
  const reportWithinDocs = relative(resolve('docs/arcana'), reportPath);
  if (reportWithinDocs.startsWith('..') || !reportWithinDocs.endsWith('.json'))
    throw Error('Report must be a new JSON file under docs/arcana');
  try {
    await access(reportPath);
    throw Error('Evidence exists; set ARCANA_PERSISTENCE_REPORT to a new evidence path');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  const connection = {
    host: '127.0.0.1',
    port: 55432,
    user: 'arcana_dev',
    password: 'arcana-local-development',
    database: 'arcana_dev',
    max: 1,
    connectionTimeoutMillis: 3000,
  };
  const schema = 'measurement_' + randomUUID().replaceAll('-', '');
  const admin = new Pool(connection);
  let pool: Pool | undefined;
  let stats = fresh();
  let recording = false;
  const samples: unknown[] = [];
  try {
    await admin.query(`CREATE SCHEMA ${schema}`);
    pool = new Pool({ ...connection, options: `-c search_path=${schema}` });
    await applyGameSchema(pool);
    const actual = pool;
    const measured = new Proxy(actual, {
      get(target, name) {
        if (name !== 'connect') return Reflect.get(target, name);
        return async () => {
          const client = await target.connect();
          return new Proxy(client, {
            get(c, key) {
              if (key === 'release') return c.release.bind(c);
              if (key !== 'query') return Reflect.get(c, key);
              return async (text: string, values?: unknown[]) => {
                const start = performance.now();
                const result = await c.query(text, values);
                if (recording) {
                  stats.count++;
                  stats.clientSqlMs += performance.now() - start;
                  if (/^SELECT/i.test(text)) stats.rowsReturned += result.rowCount ?? 0;
                  else stats.rowsAffected += result.rowCount ?? 0;
                }
                return result;
              };
            },
          }) as PoolClient;
        };
      },
    });
    const store = new PostgresGameTransactions(measured);
    for (const count of [0, 100, 1000, 5000]) {
      const initial: GameState = {
        schemaVersion: 1,
        playerId: `measurement-${count}`,
        revision: 1,
        inventory: createInventory(0),
        copies: [],
        receipts: Array.from({ length: count }, (_, i) => receipt(i)),
      };
      await store.create(initial);
      for (let sample = 0; sample < 3; sample++) {
        stats = fresh();
        recording = true;
        const readStart = performance.now();
        const state = await store.read(initial.playerId);
        const readMs = performance.now() - readStart;
        recording = false;
        const readQueries = { ...stats };
        const serializeStart = performance.now();
        const serialized = JSON.stringify(state);
        const serializeMs = performance.now() - serializeStart;
        const heapBefore = process.memoryUsage().heapUsed;
        stats = fresh();
        recording = true;
        const writeStart = performance.now();
        const updated = await store.transact(initial.playerId, (current) => ({
          ...current,
          revision: current.revision + 1,
          receipts: [...current.receipts, receipt(current.receipts.length)],
        }));
        const writeMs = performance.now() - writeStart;
        recording = false;
        const writeQueries = { ...stats };
        const heapDeltaBytes = process.memoryUsage().heapUsed - heapBefore;
        const recoveryStart = performance.now();
        const recovered = await store.read(initial.playerId);
        expect(recovered.receipts.find((r) => r.id === 'team-0')).toEqual(receipt(0));
        expect(recovered.receipts).toEqual(updated.receipts);
        samples.push({
          initialCount: count,
          actualCount: state.receipts.length,
          sample,
          readMs,
          readQueries,
          serializeMs,
          stateBytes: Buffer.byteLength(serialized),
          writeMs,
          writeQueries,
          recoveryMs: performance.now() - recoveryStart,
          heapDeltaBytes,
        });
      }
    }
    const implementation = await readFile(
      'src/arcana/infrastructure/postgres/game-transactions.ts',
    );
    await writeFile(
      reportPath,
      JSON.stringify(
        {
          schemaVersion: 1,
          label,
          measuredAt: new Date().toISOString(),
          node: process.version,
          platform: process.platform,
          fixture: 'set-team empty roster, history only; 3 bounded observations per scale',
          implementationSha256: createHash('sha256').update(implementation).digest('hex'),
          notes: [
            'clientSqlMs includes driver and loopback, not PostgreSQL CPU',
            'heap delta is noisy process heap with GC, not resident memory or leak proof',
            'recoveryMs includes full aggregate read and an equality assertion',
            'ordinary accounts/schema excluded by search_path; schema removed in finally',
          ],
          samples,
        },
        null,
        2,
      ) + '\n',
      { flag: 'wx' },
    );
  } finally {
    await pool?.end();
    await admin.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
    await admin.end();
  }
});
