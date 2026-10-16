import { expect, it } from 'vitest';
import { battleVisualChanges } from '../../../src/arcana/presentation/motion/battle-deltas';
import type { BattleEvent } from '../../../src/arcana/domain/combat/engine';
it('keeps the same change identity through non-impact events so its finite label can finish', () => {
  const events = [
    { kind: 'healed', sequence: 0, actorId: 'u', amount: 5 },
    { kind: 'turn-started', sequence: 1, actorId: 'v' },
    { kind: 'burn-tick', sequence: 2, actorId: 'u', damage: 2 },
  ] as BattleEvent[];
  expect(battleVisualChanges(events, 0).size).toBe(0);
  expect(battleVisualChanges(events, 1).get('u')).toBe(events[0]);
  expect(battleVisualChanges(events, 2).get('u')).toBe(events[0]);
  expect(battleVisualChanges(events, 3).get('u')).toBe(events[2]);
});
