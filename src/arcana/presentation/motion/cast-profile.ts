import type { Combat } from '../../domain/combat/engine';
import type { BondGroup } from '../../domain/combat/bonds';
export const creatureProfiles = {
  'phoenix-companion': { species: 'phoenix', origin: [0.9, 0.34] },
  'hippogriff-companion': { species: 'hippogriff', origin: [0.9, 0.56] },
  'forest-unicorn': { species: 'unicorn', origin: [0.93, 0.35] },
  'green-dragon': { species: 'dragon', origin: [0.91, 0.31] },
} as const;
export function creatureProfile(id: string) {
  return creatureProfiles[id as keyof typeof creatureProfiles] ?? null;
}
export type CastProfile =
  | BondGroup
  | (typeof creatureProfiles)[keyof typeof creatureProfiles]['species'];
export function confirmedBondFor(combat: Combat, actorId: string): BondGroup | undefined {
  const event = combat.events.find(
    (e) => e.kind === 'bond-activated' && e.contributorIds.includes(actorId),
  );
  return event?.kind === 'bond-activated' ? event.group : undefined;
}
export function castProfile(wizardId: string, group?: BondGroup): CastProfile | undefined {
  return creatureProfile(wizardId)?.species ?? group;
}
/** Cosmetic paths have fixed endpoints and use the existing replay progress only. */
export function bondCastOffset(profile: CastProfile | undefined, progress: number): number {
  const p = Math.max(0, Math.min(1, progress));
  if (!profile) return 0;
  const height = {
    order: 15,
    death: -8,
    creatures: 7,
    phoenix: 21,
    hippogriff: 5,
    unicorn: 12,
    dragon: 3,
  }[profile];
  return Math.sin(p * Math.PI) * height;
}
export const castColors: Record<CastProfile, number> = {
  order: 0xf5dca1,
  death: 0x82b5a2,
  creatures: 0xd8bd83,
  phoenix: 0xffc65b,
  hippogriff: 0xddd9bd,
  unicorn: 0xc9e8ef,
  dragon: 0xd7a451,
};
