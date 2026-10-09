import {
  DemoError,
  gifts,
  type Configuration,
  type DemoState,
  type Identity,
  type Language,
  type OpeningRequest,
} from './model';
import { validateConfiguration } from './validation';
export function initialize(runId: string, language: Language, config: Configuration): DemoState {
  validateConfiguration(config);
  let s: DemoState = {
    schemaVersion: 1,
    runId,
    revision: 1,
    language,
    reducedMotion: false,
    ambient: true,
    units: [
      { id: runId + ':frog', kind: 'frog', status: 'available' },
      { id: runId + ':beans', kind: 'beans', status: 'available' },
    ],
    copies: [],
    operations: [],
    seenOperationId: null,
  };
  for (const id of gifts)
    s = addCopy(
      s,
      config.catalog.identities.find((i) => i.id === id)!,
      'welcome:' + runId,
      'gift',
      config.catalog.version,
      config.assetVersion,
    );
  return s;
}
export function addCopy(
  s: DemoState,
  identity: Identity,
  sourceId: string,
  origin: 'gift' | 'opening' | 'test',
  catalogVersion = 1,
  assetVersion = 1,
): DemoState {
  return {
    ...s,
    copies: [
      ...s.copies,
      {
        id: sourceId + ':' + identity.id,
        identity: structuredClone(identity),
        sourceId,
        origin,
        catalogVersion,
        assetVersion,
        shopId: 'weasley',
      },
    ],
  };
}
export function selectIdentity(config: Configuration, ticket: number): Identity {
  const total = config.table.entries.reduce((sum, e) => sum + e.weight, 0);
  if (!Number.isSafeInteger(ticket) || ticket < 0 || ticket >= total)
    throw new DemoError('INVALID_RANDOM');
  let remaining = ticket;
  for (const e of config.table.entries) {
    if (remaining < e.weight) return config.catalog.identities.find((i) => i.id === e.identityId)!;
    remaining -= e.weight;
  }
  throw new DemoError('INVALID_CONFIG');
}
export function openFrog(
  s: DemoState,
  key: string,
  r: OpeningRequest,
  config: Configuration,
  ticket: (max: number) => number,
): DemoState {
  const prior = s.operations.find((o) => o.id === key);
  if (prior) {
    if (
      ['runId', 'unitId', 'kind', 'catalogVersion', 'tableVersion'].some(
        (k) => prior.request[k as keyof OpeningRequest] !== r[k as keyof OpeningRequest],
      )
    )
      throw new DemoError('CONFLICT');
    return s;
  }
  if (s.runId !== r.runId) throw new DemoError('STALE_STATE');
  const unit = s.units.find((u) => u.id === r.unitId && u.kind === 'frog');
  if (!unit || unit.status !== 'available' || s.operations.length) throw new DemoError('EXHAUSTED');
  validateConfiguration(config);
  if (config.catalog.version !== r.catalogVersion || config.table.version !== r.tableVersion)
    throw new DemoError('STALE_CONFIG');
  // Do not silently renormalize an incompatible welcome table: the shown odds must remain exact.
  if (config.table.entries.some((e) => s.copies.some((c) => c.identity.id === e.identityId)))
    throw new DemoError('NO_NEW_CANDIDATES');
  const result = selectIdentity(
    config,
    ticket(config.table.entries.reduce((sum, e) => sum + e.weight, 0)),
  );
  const next = addCopy(s, result, key, 'opening', config.catalog.version, config.assetVersion);
  const operation = {
    id: key,
    request: structuredClone(r),
    identity: structuredClone(result),
    copyId: key + ':' + result.id,
    isNew: !s.copies.some((c) => c.identity.id === result.id),
    catalogVersion: config.catalog.version,
    tableVersion: config.table.version,
    assetVersion: config.assetVersion,
  };
  return {
    ...next,
    revision: s.revision + 1,
    units: s.units.map((u) =>
      u.id === unit.id ? { ...u, status: 'consumed', operationId: key } : u,
    ),
    operations: [...s.operations, operation],
  };
}
