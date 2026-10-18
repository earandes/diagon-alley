import { ArcanaError } from '../errors';
import { validDomainId } from '../identifiers';
import { houseProgress, type HouseMember } from './houses';

export const BOND_GROUPS = ['order', 'death', 'creatures'] as const;
export type BondGroup = (typeof BOND_GROUPS)[number];
export type BondFocus = 'houses' | BondGroup;
export type BondMode = 'auto' | BondFocus;
export const BOND_MODES: readonly BondMode[] = ['auto', 'houses', ...BOND_GROUPS];
export interface BondRules {
  readonly version: 1;
  readonly orderHealing: readonly [number, number];
  readonly deathDamage: readonly [number, number];
  readonly creatureGuard: readonly [number, number];
  readonly members: Readonly<Record<BondGroup, readonly string[]>>;
}
export function validBondMode(value: unknown): value is BondMode {
  return BOND_MODES.includes(value as BondMode);
}
/** Fixed behaviours, small versioned values; not an extensible scripting engine. */
export function bondRulesSnapshot(value: BondRules): BondRules {
  try {
    if (value.version !== 1) throw Error();
    for (const pair of [value.orderHealing, value.deathDamage, value.creatureGuard])
      if (
        !Array.isArray(pair) ||
        pair.length !== 2 ||
        pair.some((v) => !Number.isSafeInteger(v) || v < 1 || v > 10) ||
        pair[1] < pair[0]
      )
        throw Error();
    for (const group of BOND_GROUPS) {
      const ids = value.members[group];
      if (
        !Array.isArray(ids) ||
        ids.length < 3 ||
        ids.length > 200 ||
        new Set(ids).size !== ids.length ||
        ids.some((id) => !validDomainId(id))
      )
        throw Error();
    }
    return Object.freeze({
      version: 1,
      orderHealing: Object.freeze([...value.orderHealing]) as readonly [number, number],
      deathDamage: Object.freeze([...value.deathDamage]) as readonly [number, number],
      creatureGuard: Object.freeze([...value.creatureGuard]) as readonly [number, number],
      members: Object.freeze(
        Object.fromEntries(BOND_GROUPS.map((g) => [g, Object.freeze([...value.members[g]])])),
      ) as BondRules['members'],
    });
  } catch {
    throw new ArcanaError('INVALID_COMBAT');
  }
}
export function bondProgress(units: readonly HouseMember[], rules: BondRules, group: BondGroup) {
  const contributors = units.filter((u) => u.hp > 0 && rules.members[group].includes(u.wizardId));
  const count = new Set(contributors.map((u) => u.wizardId)).size;
  const tier: 0 | 1 | 2 = count >= 4 ? 2 : count >= 3 ? 1 : 0;
  const values =
    group === 'order'
      ? rules.orderHealing
      : group === 'death'
        ? rules.deathDamage
        : rules.creatureGuard;
  return Object.freeze({
    group,
    count,
    tier,
    value: tier ? values[tier - 1] : 0,
    next: count < 3 ? 3 : count < 4 ? 4 : null,
    contributorIds: Object.freeze(contributors.map((u) => u.id)),
  });
}
export type BondProgress = ReturnType<typeof bondProgress>;
/** Auto is deterministic from frozen rules/formation. The effective choice is saved before RNG. */
export function effectiveBondFocus(
  units: readonly HouseMember[],
  rules: BondRules | undefined,
  mode: BondMode = 'auto',
): BondFocus {
  if (!rules) return 'houses';
  if (mode !== 'auto') return mode;
  if (houseProgress(units).some((h) => h.tier > 0)) return 'houses';
  return BOND_GROUPS.find((g) => bondProgress(units, rules, g).tier > 0) ?? 'houses';
}
