import { expect, it } from 'vitest';
import { selectTeam, equipItem, teamSnapshot } from '../../../src/arcana/domain/collection/team';
import { pendingSnapshot } from '../../../src/arcana/application/client/ports';
it('saves the deliberate bond with formation, preserves it through equipment and rejects invalid choices', () => {
  const team = selectTeam({ copyIds: ['a'], loadouts: [] }, ['a'], ['a'], [], 'creatures');
  expect(team.bondFocus).toBe('creatures');
  expect(equipItem(team, 'a', 'wand', null, ['a'], []).bondFocus).toBe('creatures');
  expect(selectTeam(team, [], ['a'], []).bondFocus).toBe('creatures');
  expect(() => teamSnapshot({ ...team, bondFocus: 'unknown' as 'houses' })).toThrow();
  expect(teamSnapshot({ copyIds: [], loadouts: [] })).toEqual({ copyIds: [], loadouts: [] });
});
it('keeps mode, owner and exact request in durable pending commands for both entry points', () => {
  for (const kind of ['set-team', 'start-run'] as const) {
    const request = {
      copyIds: ['a'],
      bondFocus: 'order' as const,
      ...(kind === 'start-run' ? { zoneId: 'zone', campaignVersion: 1 } : {}),
    };
    const p = {
      schemaVersion: 1 as const,
      playerId: 'owner',
      kind,
      command: { key: 'key', expectedRevision: 1, request },
    };
    expect(pendingSnapshot(p)).toEqual(p);
    expect(() =>
      pendingSnapshot({
        ...p,
        command: { ...p.command, request: { ...request, bondFocus: 'unknown' } },
      }),
    ).toThrow();
  }
});
