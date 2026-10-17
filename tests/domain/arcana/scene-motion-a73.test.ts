import { expect, it } from 'vitest';
import { sceneNeedsContinuousFrames } from '../../../src/arcana/presentation/scenes/scene-motion';
import type { SceneData } from '../../../src/arcana/presentation/scenes/pixi-scenes';
import { ReplayClock } from '../../../src/arcana/presentation/motion/replay-clock';
const arena = (clock: ReplayClock): Extract<SceneData, { kind: 'arena' }> => ({
  kind: 'arena',
  frame: { cursor: 1, round: 1, event: null, outcome: null, player: [], rival: [], synergies: [] },
  next: {
    kind: 'turn-started',
    actorId: 'a',
    round: 1,
    sequence: 1,
    team: 'player',
    initiative: 1,
  },
  playing: true,
  speed: 1,
  clock,
});
it('keeps presentation time moving through static events without requiring GPU frames', () => {
  const clock = new ReplayClock([100, 200, 300]);
  clock.play(0);
  clock.tick(100);
  expect(sceneNeedsContinuousFrames(arena(clock))).toBe(false);
  clock.tick(300);
  expect(clock.snapshot().cursor).toBe(2);
});
it('keeps the entry, spell flight/contact, healing and burn animation available', () => {
  const clock = new ReplayClock([100, 200]);
  clock.play(0);
  expect(sceneNeedsContinuousFrames(arena(clock))).toBe(true);
  clock.tick(100);
  for (const next of [
    {
      kind: 'spell-cast',
      actorId: 'a',
      targetId: 'b',
      damage: 3,
      missed: false,
      mana: 1,
      targetHp: 10,
      round: 1,
      sequence: 2,
    },
    { kind: 'healed', actorId: 'a', amount: 3, hp: 10, source: 'alchemy', round: 1, sequence: 2 },
    { kind: 'burn-tick', actorId: 'a', damage: 3, hp: 10, round: 1, sequence: 2 },
  ] as const)
    expect(sceneNeedsContinuousFrames({ ...arena(clock), next })).toBe(true);
});
