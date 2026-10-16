import type { BattleEvent } from '../../domain/combat/engine';
export interface BossPropPose {
  readonly phase: 'rest' | 'anticipation' | 'cast' | 'impact' | 'fallen';
  readonly activity: number;
  readonly fall: number;
}
const ease = (t: number) => 1 - (1 - t) ** 3;
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
