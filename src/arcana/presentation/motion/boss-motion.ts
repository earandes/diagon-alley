import type { BattleEvent } from '../../domain/combat/engine';
export interface BossPropPose {
  readonly phase: 'rest' | 'anticipation' | 'cast' | 'impact' | 'fallen';
  readonly activity: number;
  readonly fall: number;
}
const ease = (t: number) => 1 - (1 - t) ** 3;

export interface BossActorPose extends BossPropPose {
  /** Signed local limb gesture: collect behind the joint, then extend the prop. */
  readonly arm: number;
  readonly recoil: number;
}

/** A71 cut-paper gesture. Pure sampling keeps pause, 2x, hidden and skip equivalent. */
export function bossActorPose(
  event: BattleEvent | null,
  progress: number,
  leaderId: string,
  alive: boolean,
  reduced: boolean,
): BossActorPose {
  const rest = {
    phase: alive ? 'rest' : 'fallen',
    activity: 0,
    arm: 0,
    recoil: 0,
    fall: alive ? 0 : 1,
  } as const;
  if (reduced || !event) return rest;
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(progress, 1)) : 0;
  if (event.kind === 'spell-cast' && !event.missed && event.targetId === leaderId && p >= 0.78) {
    const contact = (p - 0.78) / 0.22;
    return {
      ...rest,
      phase: 'impact',
      recoil: Math.sin(contact * Math.PI),
      fall: event.targetHp === 0 ? ease(contact) : rest.fall,
    };
  }
  if (event.kind !== 'spell-cast' || event.actorId !== leaderId || p === 1) return rest;
  const arm =
    p < 0.18
      ? -0.25 * ease(p / 0.18)
      : p < 0.42
        ? -0.25 + 1.25 * ease((p - 0.18) / 0.24)
        : p < 0.78
          ? 1 - 0.15 * ((p - 0.42) / 0.36)
          : 0.85 * (1 - ease((p - 0.78) / 0.22));
  return {
    ...rest,
    phase: p < 0.18 ? 'anticipation' : 'cast',
    arm: arm || 0,
    activity: Math.abs(arm),
  };
}
/** Presentation only: a pose is a pure sample of the shared A69 replay clock. */
export function bossPropPose(
  event: BattleEvent | null,
  progress: number,
  leaderId: string,
  alive: boolean,
  reduced: boolean,
): BossPropPose {
  const rest = { phase: alive ? 'rest' : 'fallen', activity: 0, fall: alive ? 0 : 1 } as const;
  if (reduced || !event) return rest;
  const p = Math.max(0, Math.min(progress, 1));
  if (event.kind === 'spell-cast' && !event.missed && event.targetId === leaderId && p >= 0.78) {
    const contact = ease((p - 0.78) / 0.22);
    return { phase: 'impact', activity: 0, fall: event.targetHp === 0 ? contact : rest.fall };
  }
  if (event.kind !== 'spell-cast' || event.actorId !== leaderId || p === 1) return rest;
  return {
    phase: p < 0.18 ? 'anticipation' : 'cast',
    activity: p < 0.18 ? ease(p / 0.18) : 1 - ease((p - 0.18) / 0.82),
    fall: rest.fall,
  };
}
