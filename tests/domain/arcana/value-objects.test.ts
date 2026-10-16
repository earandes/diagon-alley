import { describe, expect, it } from 'vitest';
import { createManaPoints, spendMana } from '../../../src/arcana/domain/combat/mana';
import { createSeed } from '../../../src/arcana/domain/combat/seed';
import { createNodeCoordinate } from '../../../src/arcana/domain/exploration/coordinate';
import { createRarity } from '../../../src/arcana/domain/collection/rarity';
describe('ARCANA explicit immutable Value Objects', () => {
  it('validates bounded mana and spends without altering input', () => {
    const mana = createManaPoints(10, 20);
    expect(spendMana(mana, 3)).toEqual({ current: 7, maximum: 20 });
    expect(mana.current).toBe(10);
    expect(Object.isFrozen(mana)).toBe(true);
    expect(() => spendMana(mana, 11)).toThrow('INSUFFICIENT_MANA');
  });
  it.each([
    [-1, 20],
    [21, 20],
    [NaN, 20],
    [0, Infinity],
  ])('rejects invalid mana %s/%s', (current, maximum) => {
    expect(() => createManaPoints(current, maximum)).toThrow('INVALID_MANA');
  });
  it('preserves exact finite mana values without deciding an unprovided rounding policy', () => {
    expect(spendMana(createManaPoints(1.5, 2), 0.5).current).toBe(1);
    expect(() => spendMana(createManaPoints(1, 2), NaN)).toThrow('INVALID_MANA');
  });
  it('validates row and column as a stable coordinate', () => {
    expect(createNodeCoordinate(0, 1)).toEqual({ row: 0, column: 1 });
    expect(Object.isFrozen(createNodeCoordinate(0, 1))).toBe(true);
    expect(() => createNodeCoordinate(-1, 0)).toThrow('INVALID_COORDINATE');
    expect(() => createNodeCoordinate(0, 0.5)).toThrow('INVALID_COORDINATE');
  });
  it('validates uint32 seeds including zero', () => {
    expect(createSeed(0)).toBe(0);
    expect(createSeed(0xffffffff)).toBe(0xffffffff);
    expect(() => createSeed(0x100000000)).toThrow('INVALID_SEED');
    expect(() => createSeed(NaN)).toThrow('INVALID_SEED');
  });
  it('validates four current rarities without guessing their 1–5 star mapping', () => {
    for (const id of ['common', 'unusual', 'epic', 'arcane-legendary'])
      expect(createRarity(id)).toBe(id);
    expect(() => createRarity(['common'])).toThrow('INVALID_RARITY');
    expect(() => createRarity('five-stars')).toThrow('INVALID_RARITY');
  });
});
