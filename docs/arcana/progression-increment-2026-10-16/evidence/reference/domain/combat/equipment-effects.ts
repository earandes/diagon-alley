import type { CombatUnitInput } from './engine';

/** Equipment-only values before bean effects. Shared with preparation; never a victory forecast. */
export function equipmentSpellPower(unit: Pick<CombatUnitInput, 'power' | 'wandPowerBonus' | 'wandMultiplier'>) {
  return (unit.power + unit.wandPowerBonus) * unit.wandMultiplier;
}
export function equipmentInitiative(unit: Pick<CombatUnitInput, 'speed' | 'broomInitiative'>, shadowBonus = 0) {
  return unit.speed + unit.broomInitiative + shadowBonus;
}
