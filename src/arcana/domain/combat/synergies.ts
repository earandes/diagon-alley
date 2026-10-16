export type Affinity = 'neutral' | 'alchemy' | 'fire' | 'shadows';
export interface ActiveSynergy {
  readonly affinity: Exclude<Affinity, 'neutral'>;
  readonly members: number;
  readonly threshold: number;
}
export interface SynergyProgress extends ActiveSynergy {
  readonly active: boolean;
}
/** Shared MVP thresholds; fallen units do not activate a coven when a battle starts. */
export function synergyProgress(
  units: readonly { readonly hp: number; readonly affinity: Affinity }[],
): readonly SynergyProgress[] {
  const counts = { fire: 0, alchemy: 0, shadows: 0 },
    thresholds = { fire: 2, alchemy: 3, shadows: 1 };
  for (const unit of units) if (unit.hp > 0 && unit.affinity !== 'neutral') counts[unit.affinity]++;
  return Object.freeze(
    (['fire', 'alchemy', 'shadows'] as const).map((affinity) =>
      Object.freeze({
        affinity,
        members: counts[affinity],
        threshold: thresholds[affinity],
        active: counts[affinity] >= thresholds[affinity],
      }),
    ),
  );
}
export function activeSynergies(
  units: readonly { readonly hp: number; readonly affinity: Affinity }[],
): readonly ActiveSynergy[] {
  return Object.freeze(
    synergyProgress(units)
      .filter((synergy) => synergy.active)
      .map(({ affinity, members, threshold }) => Object.freeze({ affinity, members, threshold })),
  );
}
