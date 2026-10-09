import {
  DemoError,
  gifts,
  type Configuration,
  type DemoState,
  type ExportedDemo,
  type Identity,
  type Localized,
  type OpeningRequest,
} from './model';
const invalid = (): never => {
  throw new DemoError('INVALID_CONFIG');
};
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalid();
  return value as Record<string, unknown>;
}
function list(value: unknown): unknown[] {
  if (!Array.isArray(value) || value.length > 100) return invalid();
  return value;
}
function text(value: unknown): string {
  if (typeof value !== 'string' || !value.trim() || value.length > 1000) return invalid();
  return value;
}
function integer(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) return invalid();
  return value;
}
function bool(value: unknown): boolean {
  if (typeof value !== 'boolean') return invalid();
  return value;
}
function localized(value: unknown): Localized {
  const v = record(value);
  return { es: text(v.es), en: text(v.en) };
}
function identity(value: unknown): Identity {
  const v = record(value),
    id = text(v.id),
    family = v.family,
    rarityId = v.rarityId;
  if (
    !/^[COS]0[1-4]$/.test(id) ||
    !['person', 'object', 'flavour'].includes(String(family)) ||
    !['R01', 'R02', 'R03'].includes(String(rarityId))
  )
    return invalid();
  if (
    (id[0] === 'C' && family !== 'person') ||
    (id[0] === 'O' && family !== 'object') ||
    (id[0] === 'S' && family !== 'flavour')
  )
    return invalid();
  return {
    id,
    family: family as Identity['family'],
    rarityId: rarityId as Identity['rarityId'],
    name: localized(v.name),
    context: localized(v.context),
    assetId: text(v.assetId),
  };
}
function unique(ids: string[]) {
  if (new Set(ids).size !== ids.length) invalid();
}
export function validateConfiguration(value: unknown): Configuration {
  const v = record(value),
    c = record(v.catalog),
    t = record(v.table);
  if (c.shopId !== 'weasley') return invalid();
  const identities = list(c.identities).map(identity);
  unique(identities.map((i) => i.id));
  if (identities.length !== 12) return invalid();
  const catalog = { version: integer(c.version), shopId: 'weasley' as const, identities };
  const entries = list(t.entries).map((x) => {
    const e = record(x);
    return { identityId: text(e.identityId), weight: integer(e.weight) };
  });
  unique(entries.map((e) => e.identityId));
  if (
    !entries.length ||
    entries.some(
      (e) =>
        !identities.some((i) => i.id === e.identityId && i.family !== 'flavour') ||
        gifts.includes(e.identityId),
    )
  )
    return invalid();
  const sum = entries.reduce((n, e) => n + e.weight, 0);
  if (!Number.isSafeInteger(sum) || sum > 1000000) return invalid();
  const table = { version: integer(t.version), catalogVersion: integer(t.catalogVersion), entries };
  if (table.catalogVersion !== catalog.version) return invalid();
  return { catalog, table, assetVersion: integer(v.assetVersion) };
}
function request(value: unknown): OpeningRequest {
  const v = record(value);
  if (v.kind !== 'welcome-frog') return invalid();
  return {
    runId: text(v.runId),
    unitId: text(v.unitId),
    kind: 'welcome-frog',
    catalogVersion: integer(v.catalogVersion),
    tableVersion: integer(v.tableVersion),
  };
}
function state(value: unknown): DemoState {
  const v = record(value);
  if (v.schemaVersion !== 1 || (v.language !== 'es' && v.language !== 'en')) return invalid();
  const units = list(v.units).map((x) => {
    const u = record(x);
    if (
      (u.kind !== 'frog' && u.kind !== 'beans') ||
      (u.status !== 'available' && u.status !== 'consumed')
    )
      return invalid();
    return {
      id: text(u.id),
      kind: u.kind,
      status: u.status,
      ...(u.operationId === undefined ? {} : { operationId: text(u.operationId) }),
    };
  });
  const copies = list(v.copies).map((x) => {
    const c = record(x);
    if ((c.origin !== 'gift' && c.origin !== 'opening') || c.shopId !== 'weasley') return invalid();
    return {
      id: text(c.id),
      identity: identity(c.identity),
      origin: c.origin,
      sourceId: text(c.sourceId),
      catalogVersion: integer(c.catalogVersion),
      assetVersion: integer(c.assetVersion),
      shopId: 'weasley' as const,
    };
  });
  const operations = list(v.operations).map((x) => {
    const o = record(x);
    return {
      id: text(o.id),
      request: request(o.request),
      identity: identity(o.identity),
      copyId: text(o.copyId),
      isNew: bool(o.isNew),
      catalogVersion: integer(o.catalogVersion),
      tableVersion: integer(o.tableVersion),
      assetVersion: integer(o.assetVersion),
    };
  });
  if (v.seenOperationId !== null && typeof v.seenOperationId !== 'string') return invalid();
  return {
    schemaVersion: 1,
    runId: text(v.runId),
    revision: integer(v.revision),
    language: v.language,
    reducedMotion: bool(v.reducedMotion),
    ambient: bool(v.ambient),
    units: units as DemoState['units'],
    copies: copies as DemoState['copies'],
    operations,
    seenOperationId: v.seenOperationId,
  };
}
export function validateState(s: DemoState, configurations: Configuration[]) {
  unique(s.units.map((u) => u.id));
  unique(s.copies.map((c) => c.id));
  unique(s.operations.map((o) => o.id));
  if (
    s.units.length !== 2 ||
    s.operations.length > 1 ||
    s.copies.length !== 4 + s.operations.length
  )
    invalid();
  const frog = s.units.find((u) => u.kind === 'frog'),
    beans = s.units.find((u) => u.kind === 'beans');
  if (!frog || !beans) return invalid();
  if (
    frog.id !== s.runId + ':frog' ||
    beans.id !== s.runId + ':beans' ||
    beans.status !== 'available' ||
    beans.operationId
  )
    invalid();
  const known = s.copies.filter((c) => c.origin === 'gift');
  if (
    known.length !== 4 ||
    gifts.some((id) => known.filter((c) => c.identity.id === id).length !== 1) ||
    known.some((c) => c.sourceId !== 'welcome:' + s.runId)
  )
    invalid();
  for (const c of s.copies) {
    const config = configurations.find((x) => x.catalog.version === c.catalogVersion);
    if (
      !config ||
      config.assetVersion !== c.assetVersion ||
      JSON.stringify(config.catalog.identities.find((i) => i.id === c.identity.id)) !==
        JSON.stringify(c.identity)
    )
      invalid();
  }
  if (!s.operations.length) {
    if (frog.status !== 'available' || frog.operationId || s.seenOperationId) invalid();
  }
  for (const o of s.operations) {
    const config = configurations.find(
      (c) => c.catalog.version === o.catalogVersion && c.table.version === o.tableVersion,
    );
    const c = s.copies.find((c) => c.id === o.copyId);
    if (
      !config ||
      !c ||
      c.origin !== 'opening' ||
      c.sourceId !== o.id ||
      c.catalogVersion !== o.catalogVersion ||
      c.assetVersion !== o.assetVersion ||
      o.request.runId !== s.runId ||
      o.request.unitId !== frog.id ||
      o.request.catalogVersion !== o.catalogVersion ||
      o.request.tableVersion !== o.tableVersion ||
      o.assetVersion !== config.assetVersion ||
      !config.table.entries.some((e) => e.identityId === o.identity.id) ||
      gifts.includes(o.identity.id) ||
      !o.isNew ||
      JSON.stringify(c.identity) !== JSON.stringify(o.identity) ||
      frog.status !== 'consumed' ||
      frog.operationId !== o.id
    )
      invalid();
  }
  if (s.seenOperationId && !s.operations.some((o) => o.id === s.seenOperationId)) invalid();
}
export function parseExport(input: string): ExportedDemo {
  try {
    if (input.length > 262144) invalid();
    const v = record(JSON.parse(input));
    if (v.format !== 'magic-i1' || v.schemaVersion !== 1) invalid();
    const configurations = list(v.configurations).map(validateConfiguration);
    if (!configurations.length) invalid();
    unique(configurations.map((c) => String(c.catalog.version) + ':' + c.table.version));
    for (const c of configurations)
      for (const other of configurations)
        if (
          c.catalog.version === other.catalog.version &&
          JSON.stringify(c.catalog) !== JSON.stringify(other.catalog)
        )
          invalid();
    const parsed = state(v.state);
    validateState(parsed, configurations);
    return { format: 'magic-i1', schemaVersion: 1, state: parsed, configurations };
  } catch {
    throw new DemoError('INVALID_IMPORT');
  }
}
