export type Affinity = 'neutral' | 'alchemy' | 'fire' | 'shadows';
export interface ActiveSynergy {
  readonly affinity: Exclude<Affinity, 'neutral'>;
  readonly members: number;
  readonly threshold: number;
}
/** Shared MVP thresholds; fallen units do not activate a coven when a battle starts. */
export function activeSynergies(
  units: readonly { readonly hp: number; readonly affinity: Affinity }[],
): readonly ActiveSynergy[] {
  const counts = { fire: 0, alchemy: 0, shadows: 0 },
    thresholds = { fire: 2, alchemy: 3, shadows: 1 };
  for (const unit of units) if (unit.hp > 0 && unit.affinity !== 'neutral') counts[unit.affinity]++;
  return Object.freeze(
    (['fire', 'alchemy', 'shadows'] as const)
      .filter((affinity) => counts[affinity] >= thresholds[affinity])
      .map((affinity) =>
        Object.freeze({ affinity, members: counts[affinity], threshold: thresholds[affinity] }),
      ),
  );
}
