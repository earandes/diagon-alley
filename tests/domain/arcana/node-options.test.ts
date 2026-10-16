import { it, expect } from 'vitest';
import { pendingSnapshot } from '../../../src/arcana/application/client/ports';
const operation = (options: Record<string, unknown>) => ({
  schemaVersion: 1,
  playerId: 'player',
  kind: 'advance-node',
  command: {
    key: 'key',
    expectedRevision: 1,
    request: { runId: 'run', nodeId: 'node', campaignVersion: 1, assignments: [], ...options },
  },
});
it('keeps visual choices in durable client intent and rejects unknown/invalid fields', () => {
  for (const options of [
    {},
    { refugeAction: 'focus' },
    { pactAction: 'pass' },
    { pactAction: 'recruit', replaceUnitId: 'temporary' },
    { encounterAction: 'pass' },
  ])
    expect(pendingSnapshot(operation(options))).toEqual(operation(options));
  for (const options of [
    { refugeAction: 'invalid' },
    { replaceUnitId: '' },
    { encounterAction: 7 },
    { stats: {} },
    { pactAction: 'pass', replaceUnitId: 'copy' },
  ])
    expect(() => pendingSnapshot(operation(options))).toThrow('INVALID_PENDING');
});
