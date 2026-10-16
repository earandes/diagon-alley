import { it, expect } from 'vitest';
import {
  projectPlayerStatus,
  playerStatusSnapshot,
} from '../../../src/arcana/application/player-status';
import { runInitial } from './support/run-fixtures';
import { gameSnapshot } from '../../../src/arcana/application/game';
const state = (points: number, cursor = 0) =>
  gameSnapshot({
    ...runInitial(),
    inventory: { ...runInitial().inventory, essence: { points, cursor } },
  });
it('projects regenerated points and the next authority deadline without modifying stored state', () => {
  const before = state(4),
    view = projectPlayerStatus(before, 720_001);
  expect(view.energy).toEqual({ points: 5, maximum: 50, combatCost: 5, nextPointAt: 1_440_000 });
  expect(view.state).toEqual(before);
  expect(before.inventory.essence).toEqual({ points: 4, cursor: 0 });
  expect(view.state.revision).toBe(before.revision);
  expect(Object.isFrozen(view.energy)).toBe(true);
});
it('preserves fractional intervals, caps points and handles an authority clock behind the cursor', () => {
  expect(projectPlayerStatus(state(4), 719_999).energy.points).toBe(4);
  expect(projectPlayerStatus(state(49), 9_000_000).energy).toMatchObject({
    points: 50,
    nextPointAt: null,
  });
  expect(projectPlayerStatus(state(4, 900_000), 1).energy).toMatchObject({
    points: 4,
    nextPointAt: 1_620_000,
  });
});
it('requires complete bounded authority energy data in transport without recomputing it', () => {
  const view = projectPlayerStatus(state(4), 0);
  expect(playerStatusSnapshot(view)).toEqual(view);
  for (const value of [
    { ...view, energy: undefined },
    { ...view, energy: { ...view.energy, points: 51 } },
    { ...view, energy: { ...view.energy, maximum: 100 } },
    { ...view, energy: { ...view.energy, points: 3 } },
    { ...view, energy: { ...view.energy, nextPointAt: 0 } },
  ])
    expect(() => playerStatusSnapshot(value)).toThrow();
});
