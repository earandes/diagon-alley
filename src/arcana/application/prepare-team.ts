import { validateCombatUnit, type CombatUnitInput } from '../domain/combat/engine';
import { EMPTY_TEAM, type Team } from '../domain/collection/team';
import type { OwnedWizard } from '../domain/collection/wizards';
import type { Inventory } from '../domain/economy/inventory';
import { runSnapshot, type Run } from '../domain/exploration/run';
import { ArcanaError } from '../domain/errors';
import type { GameState } from './game';
import type { CampaignConfiguration } from './run-use-cases';
/** Cross-context coordination reads only owned equipment referenced by the team's loadout. */
export function equipmentBonuses(
  inventory: Inventory,
  team: Team,
  copyId: string,
  specialized = true,
) {
  const loadout = team.loadouts.find((l) => l.copyId === copyId),
    items = inventory.equipment ?? [];
  const wand = items.find((item) => item.id === loadout?.wandId && item.kind === 'wand');
  const broom = items.find((item) => item.id === loadout?.broomId && item.kind === 'broom');
  return {
    wandPowerBonus: wand?.kind === 'wand' ? wand.powerBonus : 0,
    wandMultiplier: wand?.kind === 'wand' ? wand.multiplier : 1,
    broomInitiative: broom?.kind === 'broom' ? broom.initiative : 0,
    ...(specialized && wand?.kind === 'wand' && wand.initiativeBonus !== undefined
      ? { wandInitiativeBonus: wand.initiativeBonus }
      : {}),
    ...(specialized && wand?.kind === 'wand' && wand.healing !== undefined
      ? { wandHealing: wand.healing }
      : {}),
  };
}
export function prepareOwnedUnit(
  copy: OwnedWizard,
  configuration: CampaignConfiguration,
  state: GameState,
): CombatUnitInput {
  const supplied = configuration.prepareOwned(copy),
    stats = copy.wizard.stats;
  validateCombatUnit(supplied);
  if (
    supplied.id !== copy.copyId ||
    supplied.wizardId !== copy.wizard.id ||
    supplied.maxHp !== stats.maxHp ||
    supplied.maxMana !== stats.maxMana ||
    supplied.hp !== stats.maxHp ||
    supplied.mana !== stats.maxMana ||
    supplied.power !== stats.power ||
    supplied.speed !== stats.speed ||
    supplied.beanUnitId !== undefined ||
    (copy.sourceId === 'starter-kit' && supplied.level !== 1)
  )
    throw new ArcanaError('INVALID_FORMATION');
  const unit = {
    ...supplied,
    ...equipmentBonuses(state.inventory, state.team ?? EMPTY_TEAM, copy.copyId),
  };
  validateCombatUnit(unit, configuration.combatRules.shadowInitiative);
  return unit;
}
export function refreshRunEquipment(run: Run, state: GameState, team: Team): Run {
  const refresh = (member: Run['members'][number]) =>
    member.source === 'temporary'
      ? member
      : {
          ...member,
          unit: {
            ...member.unit,
            wandInitiativeBonus: undefined,
            wandHealing: undefined,
            ...equipmentBonuses(
              state.inventory,
              team,
              member.unit.id,
              run.equipmentRulesVersion === 2,
            ),
          },
        };
  return runSnapshot({
    ...run,
    members: run.members.map(refresh),
    reserves: (run.reserves ?? []).map(refresh),
  });
}
