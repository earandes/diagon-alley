import { ArcanaError } from '../errors';
import { validDomainId } from '../identifiers';
export interface Loadout {
  readonly copyId: string;
  readonly wandId: string | null;
  readonly broomId: string | null;
}
export interface Team {
  readonly copyIds: readonly string[];
  readonly loadouts: readonly Loadout[];
}
export interface EquipmentReference {
  readonly id: string;
  readonly kind: 'wand' | 'broom';
}
export const EMPTY_TEAM: Team = Object.freeze({
  copyIds: Object.freeze([]),
  loadouts: Object.freeze([]),
});
export function validateTeam(
  team: Team,
  owned: readonly string[],
  equipment: readonly EquipmentReference[],
): void {
  if (
    !team ||
    !Array.isArray(team.copyIds) ||
    !Array.isArray(team.loadouts) ||
    team.copyIds.length > 5 ||
    new Set(team.copyIds).size !== team.copyIds.length ||
    team.copyIds.some((id) => !validDomainId(id) || !owned.includes(id)) ||
    new Set(team.loadouts.map((l) => l.copyId)).size !== team.loadouts.length
  )
    throw new ArcanaError('INVALID_FORMATION');
  const used = new Set<string>();
  for (const loadout of team.loadouts) {
    if (!validDomainId(loadout.copyId) || !owned.includes(loadout.copyId))
      throw new ArcanaError('INVALID_FORMATION');
    for (const slot of ['wand', 'broom'] as const) {
      const id = slot === 'wand' ? loadout.wandId : loadout.broomId;
      if (
        id !== null &&
        (!validDomainId(id) ||
          used.has(id) ||
          !equipment.some((item) => item.id === id && item.kind === slot))
      )
        throw new ArcanaError('INVALID_FORMATION');
      if (id !== null) used.add(id);
    }
  }
}
export function teamSnapshot(team: Team): Team {
  return Object.freeze({
    copyIds: Object.freeze([...team.copyIds]),
    loadouts: Object.freeze(
      team.loadouts.map((l) =>
        Object.freeze({ copyId: l.copyId, wandId: l.wandId, broomId: l.broomId }),
      ),
    ),
  });
}
export function selectTeam(
  team: Team,
  copyIds: readonly string[],
  owned: readonly string[],
  equipment: readonly EquipmentReference[],
): Team {
  const selected = { copyIds, loadouts: team.loadouts };
  validateTeam(selected, owned, equipment);
  return teamSnapshot(selected);
}
export function equipItem(
  team: Team,
  copyId: string,
  slot: 'wand' | 'broom',
  equipmentId: string | null,
  owned: readonly string[],
  equipment: readonly EquipmentReference[],
): Team {
  validateTeam(team, owned, equipment);
  if (!owned.includes(copyId) || !['wand', 'broom'].includes(slot))
    throw new ArcanaError('INVALID_FORMATION');
  if (
    equipmentId !== null &&
    !equipment.some((item) => item.id === equipmentId && item.kind === slot)
  )
    throw new ArcanaError('EQUIPMENT_UNAVAILABLE');
  const key = slot === 'wand' ? 'wandId' : 'broomId';
  const loadouts: Loadout[] = team.loadouts.map((l) => ({
    ...l,
    ...(l[key] === equipmentId ? { [key]: null } : {}),
  }));
  const index = loadouts.findIndex((l) => l.copyId === copyId);
  if (index < 0) loadouts.push({ copyId, wandId: null, broomId: null, [key]: equipmentId });
  else loadouts[index] = { ...loadouts[index], [key]: equipmentId };
  const updated = { copyIds: team.copyIds, loadouts };
  validateTeam(updated, owned, equipment);
  return teamSnapshot(updated);
}
