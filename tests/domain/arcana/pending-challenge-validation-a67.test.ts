import { it, expect } from 'vitest';
import { pendingSnapshot } from '../../../src/arcana/application/client/ports';
it('rejects a cached challenge array instead of coercing it into an accepted profile name', () => {
  const pending = {
    schemaVersion: 1,
    playerId: 'test',
    kind: 'start-run',
    command: {
      key: 'run',
      expectedRevision: 1,
      request: {
        zoneId: 'bulevar',
        campaignVersion: 1,
        copyIds: ['copy0'],
        challenge: ['mastery'],
      },
    },
  };
  expect(() => pendingSnapshot(pending)).toThrow('INVALID_PENDING');
});
