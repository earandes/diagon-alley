const id = { type: 'string', minLength: 1, maxLength: 120, pattern: '^[a-zA-Z0-9_:-]+$' };
const version = { type: 'integer', minimum: 1, maximum: Number.MAX_SAFE_INTEGER };
const object = (properties: Record<string, unknown>) => ({
  type: 'object',
  additionalProperties: false,
  required: Object.keys(properties),
  properties,
});
const command = (request: Record<string, unknown>, optional: Record<string, unknown> = {}) =>
  object({
    key: { ...id, maxLength: 100 },
    expectedRevision: version,
    request: { ...object(request), properties: { ...request, ...optional } },
  });
export const purchaseSchema = command({
  product: { type: 'string', enum: ['cacao-toad', 'random-beans'] },
  quantity: { type: 'integer', minimum: 1, maximum: 1000 },
  priceVersion: version,
});
export const buyOpeningSchema = command({
  priceVersion: version,
  catalogVersion: version,
  tableVersion: version,
});
export const openingSchema = command({
  unitId: id,
  catalogVersion: version,
  tableVersion: version,
});
export const startRunSchema = command(
  {
    zoneId: id,
    campaignVersion: version,
    copyIds: { type: 'array', minItems: 1, maxItems: 5, uniqueItems: true, items: id },
  },
  { challenge: { type: 'string', enum: ['discovery', 'tactical', 'mastery'] } },
);
export const advanceNodeSchema = command(
  {
    runId: id,
    nodeId: id,
    campaignVersion: version,
    assignments: {
      type: 'array',
      maxItems: 5,
      uniqueItems: true,
      items: object({ unitId: id, beanId: id }),
    },
  },
  {
    // Optional choices are validated by kind and formation in authority.

    refugeAction: { type: 'string', enum: ['heal', 'focus'] },
    pactAction: { type: 'string', enum: ['recruit', 'pass'] },
    recruitId: id,
    replaceUnitId: id,
    encounterAction: { type: 'string', enum: ['risk', 'pass', 'trade'] },
    encounterChoiceId: id,
    encounterUnitId: id,
  },
);
export const operationParams = object({ id });
export const noQuery = object({});
export const setTeamSchema = command({
  copyIds: { type: 'array', maxItems: 5, uniqueItems: true, items: id },
});
export const equipEquipmentSchema = command({
  copyId: id,
  slot: { type: 'string', enum: ['wand', 'broom'] },
  equipmentId: { anyOf: [id, { type: 'null' }] },
});

export const forgeWandSchema = command({ recipeId: id, catalogVersion: version });
export const openVaultSchema = command({ tableVersion: version });
export const setIntentionSchema = command({
  afterRunId: id,
  choice: {
    anyOf: [
      { type: 'null' },
      object({ kind: { const: 'bean' } }),
      object({ kind: { const: 'new-companion' }, wizardId: id }),
      object({ kind: { const: 'synergy' }, affinity: { enum: ['alchemy', 'fire', 'shadows'] } }),
    ],
  },
});
