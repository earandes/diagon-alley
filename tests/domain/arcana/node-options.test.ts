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
it('recovers A67 choice and target exactly and rejects mixed or incomplete trade intent', () => {
  const options = {
    encounterAction: 'trade',
    encounterChoiceId: 'mend-one',
    encounterUnitId: 'owned-copy',
  };
  expect(pendingSnapshot(operation(options))).toEqual(operation(options));
  for (const invalid of [
    { encounterAction: 'trade' },
    { ...options, encounterAction: 'pass' },
    { ...options, refugeAction: 'heal' },
  ])
    expect(() => pendingSnapshot(operation(invalid))).toThrow('INVALID_PENDING');
  const start = {
    schemaVersion: 1,
    playerId: 'player',
    kind: 'start-run',
    command: {
      key: 'run',
      expectedRevision: 1,
      request: { zoneId: 'zone', campaignVersion: 1, copyIds: ['copy'], challenge: 'mastery' },
    },
  };
  expect(pendingSnapshot(start)).toEqual(start);
  expect(() =>
    pendingSnapshot({
      ...start,
      command: { ...start.command, request: { ...start.command.request, challenge: 'forged' } },
    }),
  ).toThrow('INVALID_PENDING');
});
