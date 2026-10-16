import { describe, expect, it } from 'vitest';
import { pendingSnapshot } from '../../../src/arcana/application/client/ports';
import { ArcanaHttpClient } from '../../../src/arcana/infrastructure/http/client';

const pending = (request: unknown) => ({
  schemaVersion: 1,
  playerId: 'seasonal-test',
  kind: 'seasonal-event',
  command: { key: 'seasonal-key', expectedRevision: 1, request },
});
describe('A68 seasonal transport boundary', () => {
  it('journals the exact intent for recovery without progress or a client clock', () => {
    const request = { editionId: 'halloween-2026', version: 1, action: 'join' };
    expect(pendingSnapshot(pending(request)).command.request).toEqual(request);
  });
  it.each([
    { editionId: ['halloween-2026'], version: 1, action: 'join' },
    { editionId: 'halloween-2026', version: '1', action: 'join' },
    { editionId: 'halloween-2026', version: 1, action: 'grant' },
    { editionId: 'halloween-2026', version: 1, action: 'join', completed: 3 },
    { editionId: 'halloween-2026', version: 1, action: 'dispel' },
  ])('rejects malformed or fabricated progress %j', (request) => {
    expect(() => pendingSnapshot(pending(request))).toThrow();
  });
  it('has a dedicated command transport rather than client-side grants', () => {
    const client = new ArcanaHttpClient('/api', () => 'test');
    expect(typeof (client as unknown as { seasonalEvent: unknown }).seasonalEvent).toBe('function');
  });
});
