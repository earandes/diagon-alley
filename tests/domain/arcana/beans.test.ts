import { describe, expect, it } from 'vitest';
import {
  activateBean,
  finishTurn,
  initiativeWithBean,
  spellWithBean,
  drawBean,
  type BeanCarrier,
  type BeanTable,
} from '../../../src/arcana/domain/combat/beans';
const carrier = (hp = 40): BeanCarrier => ({ hp, maxHp: 100, effect: null });
// Controlled fixture only; no production probability table.
const table: BeanTable = {
  version: 1,
  entries: [
    { flavour: 'mint', weight: 1 },
    { flavour: 'pepper', weight: 1 },
    { flavour: 'earth', weight: 1 },
    { flavour: 'soap', weight: 1 },
  ],
};
describe('ARCANA CE03–07 exact tactical effects', () => {
  it('mint restores 25% max HP, capped at max without mutating input', () => {
    const source = carrier();
    expect(activateBean(source, 'mint').hp).toBe(65);
    expect(activateBean(carrier(90), 'mint').hp).toBe(100);
    expect(source.hp).toBe(40);
  });
  it('keeps fractional percentages exact until a presentation policy formats them', () => {
    expect(activateBean({ ...carrier(), maxHp: 99 }, 'mint').hp).toBe(64.75);
  });
  it('pepper changes every spell in the first turn by 30%, then expires', () => {
    const first = spellWithBean(activateBean(carrier(), 'pepper'), 10);
    expect(first.damage).toBe(13);
    expect(first.missed).toBe(false);
    expect(spellWithBean(first.carrier, 10).damage).toBe(13);
    expect(spellWithBean(finishTurn(first.carrier), 10).damage).toBe(10);
  });
  it('earth reduces initiative for two completed turns and then expires', () => {
    const first = activateBean(carrier(), 'earth');
    expect(initiativeWithBean(first, 100)).toBe(85);
    const second = finishTurn(first);
    expect(initiativeWithBean(second, 100)).toBe(85);
    expect(initiativeWithBean(finishTurn(second), 100)).toBe(100);
    expect(initiativeWithBean(first, 100)).toBe(85);
  });
  it('soap misses only the first spell, even without damaging a target', () => {
    const first = spellWithBean(activateBean(carrier(), 'soap'), 10);
    expect(first).toMatchObject({ damage: 0, missed: true });
    expect(spellWithBean(first.carrier, 10)).toMatchObject({ damage: 10, missed: false });
  });
  it('turn completion does not cancel soap before its first spell', () => {
    const soap = finishTurn(finishTurn(activateBean(carrier(), 'soap')));
    expect(spellWithBean(soap, 10).missed).toBe(true);
  });
  it.each(['mint', 'pepper', 'earth', 'soap'] as const)(
    'draws each fixture flavour with its exact ticket: %s',
    (flavour) => {
      const ticket = table.entries.findIndex((e) => e.flavour === flavour);
      expect(
        drawBean(table, {
          ticket: (max) => {
            expect(max).toBe(4);
            return ticket;
          },
        }),
      ).toBe(flavour);
    },
  );
  it('rejects invalid tables before requesting a random ticket', () => {
    for (const invalid of [
      { ...table, version: 0 },
      { ...table, entries: [] },
      { ...table, entries: [{ flavour: 'mint' as const, weight: 0 }] },
      { ...table, entries: [table.entries[0], table.entries[0]] },
      { ...table, entries: [{ flavour: 'unknown' as 'mint', weight: 1 }] },
    ]) {
      expect(() =>
        drawBean(invalid, {
          ticket: () => {
            throw Error('random must not be used');
          },
        }),
      ).toThrow('INVALID_BEAN_TABLE');
    }
  });
  it.each([-1, 4, 0.5, NaN])('rejects invalid ticket %s', (ticket) => {
    expect(() => drawBean(table, { ticket: () => ticket })).toThrow('INVALID_RANDOM_TICKET');
  });
  it('rejects another activation instead of overwriting an existing first-spell effect', () => {
    expect(() => activateBean(activateBean(carrier(), 'pepper'), 'soap')).toThrow(
      'BEAN_ALREADY_ACTIVE',
    );
  });
  it.each([
    { hp: -1, maxHp: 100, effect: null },
    { hp: 101, maxHp: 100, effect: null },
    { hp: NaN, maxHp: 100, effect: null },
    { hp: 40, maxHp: 0, effect: null },
  ])('validates HP at the domain boundary', (invalid) => {
    expect(() => activateBean(invalid, 'mint')).toThrow('INVALID_COMBATANT');
  });
  it('rejects invalid damage and initiative before applying effects', () => {
    expect(() => spellWithBean(carrier(), Infinity)).toThrow('INVALID_DAMAGE');
    expect(() => initiativeWithBean(carrier(), -1)).toThrow('INVALID_INITIATIVE');
  });
});
