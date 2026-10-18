import { expect, it } from 'vitest';
import {
  bondProgress,
  effectiveBondFocus,
  bondRulesSnapshot,
} from '../../../src/arcana/domain/combat/bonds';
const rules = {
  version: 1 as const,
  orderHealing: [1, 2] as const,
  deathDamage: [1, 2] as const,
  creatureGuard: [2, 3] as const,
  members: {
    order: ['a', 'b', 'c', 'd'],
    death: ['a', 'b', 'c', 'd'],
    creatures: ['a', 'b', 'c', 'd'],
  },
};
const units = ['a', 'b', 'c', 'd'].map((wizardId, i) => ({ id: `copy${i}`, wizardId, hp: 60 }));
it('counts living distinct identities, including temporary copies, without cosmetic multipliers', () => {
  for (const group of ['order', 'death', 'creatures'] as const) {
    for (const [count, tier] of [
      [2, 0],
      [3, 1],
      [4, 2],
    ] as const)
      expect(bondProgress(units.slice(0, count), rules, group).tier).toBe(tier);
    expect(
      bondProgress([...units.slice(0, 2), { ...units[0], id: 'enchanted' }], rules, group).tier,
    ).toBe(0);
    expect(
      bondProgress(
        units.map((u, i) => ({ ...u, hp: i < 2 ? 0 : 60 })),
        rules,
        group,
      ).count,
    ).toBe(2);
  }
});
it('Auto prefers an active house, otherwise uses a published stable priority; an explicit choice is respected', () => {
  expect(effectiveBondFocus(units, rules, 'auto')).toBe('order');
  const housed = units.map((u) => ({ ...u, house: 'hufflepuff' as const }));
  expect(effectiveBondFocus(housed, rules, 'auto')).toBe('houses');
  expect(effectiveBondFocus(housed, rules, 'creatures')).toBe('creatures');
  expect(effectiveBondFocus(units.slice(0, 2), rules, 'auto')).toBe('houses');
  expect(effectiveBondFocus(units, undefined, 'auto')).toBe('houses');
});
it('freezes validated parameters/membership, rejecting duplicated, malformed or unbounded rules', () => {
  const frozen = bondRulesSnapshot(rules);
  expect(Object.isFrozen(frozen.members.order)).toBe(true);
  expect(() =>
    bondRulesSnapshot({ ...rules, members: { ...rules.members, order: ['a', 'a'] } }),
  ).toThrow();
  expect(() => bondRulesSnapshot({ ...rules, creatureGuard: [2, 500] })).toThrow();
  expect(() => bondRulesSnapshot({ ...rules, orderHealing: [2, 1] })).toThrow();
  expect(() => bondRulesSnapshot({ ...rules, orderHealing: [0, 2] })).toThrow();
});
