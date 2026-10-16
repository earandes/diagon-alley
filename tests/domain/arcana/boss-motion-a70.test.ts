import { describe, expect, it } from 'vitest';
import { bossPropPose } from '../../../src/arcana/presentation/motion/boss-motion';
import type { BattleEvent } from '../../../src/arcana/domain/combat/engine';
const cast = {
  kind: 'spell-cast',
  actorId: 'boss',
  targetId: 'ally',
  damage: 12,
  targetHp: 20,
  missed: false,
} as BattleEvent;
describe('A70 boss prop choreography follows the saved event and shared progress', () => {
  it('opens at anticipation, releases at cast and returns the prop to rest without another clock', () => {
    const pose = (progress: number) => bossPropPose(cast, progress, 'boss', true, false);
    expect(pose(0).activity).toBe(0);
    expect(pose(0.12).phase).toBe('anticipation');
    expect(pose(0.45).phase).toBe('cast');
    expect(pose(0.45).activity).toBeGreaterThan(0);
    expect(pose(1).activity).toBe(0);
    expect(pose(0.45)).toEqual(pose(0.45));
  });
  it('reacts only to contact with this leader and never to a missed spell', () => {
    const hit = { ...cast, actorId: 'ally', targetId: 'boss', targetHp: 0 } as BattleEvent;
    expect(bossPropPose(hit, 0.9, 'boss', true, false).fall).toBeGreaterThan(0);
    expect(
      bossPropPose({ ...hit, missed: true } as BattleEvent, 0.9, 'boss', true, false).fall,
    ).toBe(0);
    expect(bossPropPose(cast, 0.9, 'someone-else', true, false).activity).toBe(0);
  });
  it('reduced, skipped and unrelated events preserve static presence with no visual effect', () => {
    expect(bossPropPose(cast, 0.5, 'boss', true, true).activity).toBe(0);
    expect(bossPropPose(null, 1, 'boss', false, false)).toMatchObject({
      phase: 'fallen',
      fall: 1,
      activity: 0,
    });
    expect(bossPropPose(null, 0.2, 'boss', true, false)).toMatchObject({
      phase: 'rest',
      activity: 0,
    });
  });
});
