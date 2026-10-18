import { HOUSES, type House } from '../collection/traits';
export interface HouseMember {
  readonly id: string;
  readonly wizardId: string;
  readonly hp: number;
  readonly house?: House;
}
/** A85 v1: three distinct living identities; cap four is attainable in every current house. */
export function houseProgress(units: readonly HouseMember[]) {
  return HOUSES.map((house) => {
    const contributors = units.filter((u) => u.hp > 0 && u.house === house);
    const count = new Set(contributors.map((u) => u.wizardId)).size;
    const tier: 0 | 1 | 2 = count >= 4 ? 2 : count >= 3 ? 1 : 0;
    return Object.freeze({
      house,
      count,
      tier,
      next: count < 3 ? 3 : count < 4 ? 4 : null,
      value: tier ? (house === 'gryffindor' ? tier + 1 : tier) : 0,
      contributorIds: Object.freeze(contributors.map((u) => u.id)),
    });
  });
}
export type HouseProgress = ReturnType<typeof houseProgress>[number];
/** Pure shared values: no visual multiplier and no catalogue lookup during a replay. */
export function houseBonus(units: readonly HouseMember[], id: string): HouseProgress | undefined {
  return houseProgress(units).find((h) => h.tier > 0 && h.contributorIds.includes(id));
}
