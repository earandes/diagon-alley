import {
  matchesClassification,
  type ClassificationFilter,
} from '../domain/collection/classification';
import type { House } from '../domain/collection/traits';
import type { GameState } from '../application/game';
import type { PublicContent } from '../application/public-content';
import type { BeanAssignment } from '../application/run-contracts';
import { equipmentBonuses } from '../application/prepare-team';
import { EMPTY_TEAM, equipItem } from '../domain/collection/team';
import type { OwnedWizard } from '../domain/collection/wizards';
import type { Affinity, CombatRules, CombatUnitInput } from '../domain/combat/engine';
import { equipmentSpellPower, equipmentInitiative } from '../domain/combat/equipment-effects';
import { activeSynergies } from '../domain/combat/synergies';
import type { EquipmentSlot } from '../domain/economy/equipment';
import type { Run } from '../domain/exploration/run';

/** An active run owns its rules. Legacy runs without a snapshot explicitly retain the live fallback. */
export function effectivePreparationRules(
  run: Run | null | undefined,
  live: CombatRules,
): CombatRules {
  return run?.status === 'active'
    ? (run.campaignSnapshot?.combatRules ?? {
        ...live,
        houseSynergies: undefined,
        bonds: undefined,
      })
    : live;
}

export interface PreparationFilter {
  readonly classification?: ClassificationFilter;
  readonly house?: House;
  readonly affinity?: Affinity | 'unknown';
  readonly wizardId?: string;
}
/** Filtering never groups away instance identity, equipment, condition or the selection draft. */
export function filterPreparationCopies(
  game: GameState,
  content: PublicContent | undefined,
  filter: PreparationFilter,
): readonly OwnedWizard[] {
  return game.copies.filter(
    (copy) =>
      (!filter.wizardId || copy.wizard.id === filter.wizardId) &&
      (!filter.classification ||
        matchesClassification(
          content?.catalog.wizards.find((w) => w.id === copy.wizard.id)?.traits ??
            copy.wizard.traits,
          filter.classification,
        )) &&
      (!filter.house || preparationUnit(game, copy, content).house === filter.house) &&
      (!filter.affinity ||
        (preparationUnit(game, copy, content).affinity ?? 'unknown') === filter.affinity),
  );
}

export type PreparationUnit = Omit<CombatUnitInput, 'affinity'> & {
  readonly affinity: Affinity | null;
};
export type PreparationMember = {
  readonly source: 'owned' | 'temporary';
  readonly unit: PreparationUnit;
};

/** Recorded route condition wins over catalog defaults. This projection cannot heal or equip. */
export function preparationUnit(
  game: GameState,
  copy: OwnedWizard,
  content?: PublicContent,
): PreparationUnit {
  const run = game.exploration?.run?.status === 'active' ? game.exploration.run : null;
  const recorded = [...(run?.members ?? []), ...(run?.reserves ?? [])].find(
    (m) => m.source === 'owned' && m.unit.id === copy.copyId,
  )?.unit;
  const stats = copy.wizard.stats;
  const bonuses = equipmentBonuses(
    game.inventory,
    game.team ?? EMPTY_TEAM,
    copy.copyId,
    !run || run.equipmentRulesVersion === 2,
  );
  if (recorded)
    return { ...recorded, wandInitiativeBonus: undefined, wandHealing: undefined, ...bonuses };
  return {
    id: copy.copyId,
    wizardId: copy.wizard.id,
    house: run
      ? run.campaignSnapshot?.combatRules.houseMembers?.[copy.wizard.id]
      : content?.combatRules.houseMembers?.[copy.wizard.id],
    level: 1,
    affinity: content?.campaign.ownedAffinities?.[copy.wizard.id] ?? null,
    hp: stats.maxHp,
    maxHp: stats.maxHp,
    mana: stats.maxMana,
    maxMana: stats.maxMana,
    power: stats.power,
    speed: stats.speed,
    ...bonuses,
  };
}
export function preparationFormation(
  game: GameState,
  copyIds: readonly string[],
  content?: PublicContent,
): readonly PreparationMember[] {
  const own = copyIds.flatMap((id) => {
    const copy = game.copies.find((c) => c.copyId === id);
    return copy ? [{ source: 'owned' as const, unit: preparationUnit(game, copy, content) }] : [];
  });
  const run = game.exploration?.run;
  return [
    ...own,
    ...(run?.status === 'active' ? run.members.filter((m) => m.source === 'temporary') : []),
  ];
}
export function preparationSynergies(members: readonly PreparationMember[], rules: CombatRules) {
  const known = members.flatMap(({ unit }) =>
    unit.affinity === null ? [] : [{ hp: unit.hp, affinity: unit.affinity }],
  );
  return activeSynergies(known).map((synergy) => ({
    ...synergy,
    value:
      synergy.affinity === 'alchemy'
        ? rules.alchemyHealing
        : synergy.affinity === 'fire'
          ? rules.fireBurnDamage
          : rules.shadowInitiative,
  }));
}
export function previewEquipment(
  game: GameState,
  copy: OwnedWizard,
  slot: EquipmentSlot,
  equipmentId: string | null,
  content?: PublicContent,
) {
  const before = preparationUnit(game, copy, content);
  const next = equipItem(
    game.team ?? EMPTY_TEAM,
    copy.copyId,
    slot,
    equipmentId,
    game.copies.map((c) => c.copyId),
    game.inventory.equipment ?? [],
  );
  const after = preparationUnit({ ...game, team: next }, copy, content);
  return {
    before,
    after,
    powerBefore: equipmentSpellPower(before),
    powerAfter: equipmentSpellPower(after),
    initiativeBefore: equipmentInitiative(before),
    initiativeAfter: equipmentInitiative(after),
    healingBefore: before.wandHealing ?? 0,
    healingAfter: after.wandHealing ?? 0,
  };
}
/** Selecting an occupied portrait removes that jar; selecting another moves it without consumption. */
export function assignBean(
  assignments: readonly BeanAssignment[],
  beanId: string,
  unitId: string,
): readonly BeanAssignment[] {
  const assigned = assignments.some((a) => a.beanId === beanId && a.unitId === unitId);
  return [
    ...assignments.filter((a) => a.beanId !== beanId && a.unitId !== unitId),
    ...(assigned ? [] : [{ unitId, beanId }]),
  ];
}
export function validBeanAssignments(
  assignments: readonly BeanAssignment[],
  run: Run,
  game: GameState,
): readonly BeanAssignment[] {
  const usedUnits = new Set<string>(),
    usedBeans = new Set<string>();
  return assignments.filter((a) => {
    if (
      usedUnits.has(a.unitId) ||
      usedBeans.has(a.beanId) ||
      !run.members.some((m) => m.unit.id === a.unitId && m.unit.hp > 0) ||
      !game.inventory.products.some(
        (p) => p.id === a.beanId && p.kind === 'random-beans' && p.status === 'available',
      )
    )
      return false;
    usedUnits.add(a.unitId);
    usedBeans.add(a.beanId);
    return true;
  });
}
