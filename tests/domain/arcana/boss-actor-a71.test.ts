import { describe, expect, it } from 'vitest';
import type { BattleEvent } from '../../../src/arcana/domain/combat/engine';
import { bossActorPose } from '../../../src/arcana/presentation/motion/boss-motion';
import { bossArt } from '../../../src/arcana/presentation/boss-art';

const cast = {
  kind: 'spell-cast',
  actorId: 'leader',
  targetId: 'ally',
  damage: 12,
  targetHp: 20,
  missed: false,
} as BattleEvent;

describe('A71 painted actor is sampled only from the confirmed replay event', () => {
  it('has an independently painted limb and a registered static fallback in both presentations', () => {
    for (const pack of ['diagon-alley', 'arcana'] as const) {
      const actor = bossArt(pack, 'circe')!.actor!;
      expect(actor.baseUrl).not.toBe(actor.armUrl);
      expect(actor.staticUrl).not.toBe(actor.baseUrl);
      expect(actor.frameSize).toEqual([384, 512]);
      expect(actor.armAngle).toBeGreaterThan(0.15);
      for (const coordinate of [...actor.armPivot, ...actor.origin, actor.baseline])
        expect(coordinate).toBeGreaterThan(0);
      for (const coordinate of [...actor.armPivot, ...actor.origin, actor.baseline])
        expect(coordinate).toBeLessThan(1);
      expect(bossArt(pack, 'apprentice')).toBeNull();
    }
  });
  it('collects the limb, extends the object, and settles without another clock', () => {
    const sample = (p: number) => bossActorPose(cast, p, 'leader', true, false);
    expect(sample(0).arm).toBe(0);
    expect(sample(0.12).arm).toBeLessThan(0);
    expect(sample(0.42).arm).toBeGreaterThan(0.9);
    expect(sample(0.42).phase).toBe('cast');
    expect(sample(1).arm).toBe(0);
    expect(sample(0.42)).toEqual(sample(0.42));
  });
  it('reacts only to a confirmed contact with the leader and retains a fallen result', () => {
    const hit = { ...cast, actorId: 'ally', targetId: 'leader', targetHp: 0 } as BattleEvent;
    expect(bossActorPose(hit, 0.9, 'leader', true, false).recoil).toBeGreaterThan(0);
    expect(bossActorPose(hit, 0.9, 'leader', true, false).fall).toBeGreaterThan(0);
    expect(
      bossActorPose({ ...hit, missed: true } as BattleEvent, 0.9, 'leader', true, false).recoil,
    ).toBe(0);
    expect(bossActorPose(null, 1, 'leader', false, false).phase).toBe('fallen');
  });
  it('reduced motion, skip, unrelated actors and out-of-range progress remain finite and static', () => {
    expect(bossActorPose(cast, 0.42, 'leader', true, true)).toMatchObject({
      arm: 0,
      recoil: 0,
      fall: 0,
    });
    expect(bossActorPose(null, 1, 'leader', true, false).arm).toBe(0);
    expect(bossActorPose(cast, 0.42, 'someone-else', true, false).arm).toBe(0);
    expect(bossActorPose(cast, -10, 'leader', true, false).arm).toBe(0);
    expect(bossActorPose(cast, 10, 'leader', true, false).arm).toBe(0);
    expect(bossActorPose(cast, Number.NaN, 'leader', true, false).arm).toBe(0);
  });
});
