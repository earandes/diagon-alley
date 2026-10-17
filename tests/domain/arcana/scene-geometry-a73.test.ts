import { describe, expect, it } from 'vitest';
import type { SceneData } from '../../../src/arcana/presentation/scenes/pixi-scenes';
import { sameSceneGeometry } from '../../../src/arcana/presentation/scenes/scene-geometry';
import type { ReplayUnit } from '../../../src/arcana/application/client/battle-replay';
const unit = (id: string, hp = 20): ReplayUnit => ({
  id,
  wizardId: 'apprentice',
  affinity: 'neutral',
  level: 1,
  hp,
  maxHp: 30,
  mana: 10,
  maxMana: 10,
  power: 1,
  speed: 1,
  wandPowerBonus: 0,
  wandMultiplier: 1,
  broomInitiative: 0,
  bean: null,
  passives: [],
});
const scene = (): Extract<SceneData, { kind: 'arena' }> => ({
  kind: 'arena',
  frame: {
    cursor: 1,
    round: 1,
    event: null,
    outcome: null,
    player: [unit('a')],
    rival: [unit('b')],
    synergies: [],
  },
  next: null,
  playing: true,
  speed: 1,
  positions: [
    { id: 'a', x: 20, y: 40, figureHeight: 100 },
    { id: 'b', x: 80, y: 40, figureHeight: 100 },
  ],
});
describe('retained illustrated geometry', () => {
  it('keeps painted geometry through phase, mana, nonfatal damage, pause and speed changes', () => {
    const before = scene();
    const after = {
      ...before,
      playing: false,
      speed: 2 as const,
      frame: {
        ...before.frame,
        cursor: 2,
        player: [{ ...before.frame.player[0], hp: 10, mana: 2 }],
      },
    };
    expect(sameSceneGeometry(before, after)).toBe(true);
  });
  it('invalidates a fall, a different actor or an artwork change', () => {
    const before = scene();
    expect(
      sameSceneGeometry(before, { ...before, frame: { ...before.frame, player: [unit('a', 0)] } }),
    ).toBe(false);
    expect(
      sameSceneGeometry(before, { ...before, frame: { ...before.frame, player: [unit('c')] } }),
    ).toBe(false);
    expect(sameSceneGeometry(before, { ...before, appearances: { a: 'other.figure' } })).toBe(
      false,
    );
  });
  it('invalidates measured position, framing and order, even with the same cursor', () => {
    const before = scene();
    for (const changed of [
      { ...before.positions![0], x: 21 },
      { ...before.positions![0], figureHeight: 101 },
    ])
      expect(
        sameSceneGeometry(before, { ...before, positions: [changed, before.positions![1]] }),
      ).toBe(false);
    expect(
      sameSceneGeometry(before, {
        ...before,
        frame: { ...before.frame, player: [unit('a'), unit('c')] },
      }),
    ).toBe(false);
  });
});
