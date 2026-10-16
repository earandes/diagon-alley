import { describe, expect, it } from 'vitest';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
describe('ARCANA CE01 deterministic random port', () => {
  it('reproduces the complete ticket sequence, including seed zero', () => {
    for (const seed of [0, 1, 42, 0xffffffff]) {
      const a = new SeededRandom(seed),
        b = new SeededRandom(seed);
      expect(Array.from({ length: 100 }, () => a.ticket(40))).toEqual(
        Array.from({ length: 100 }, () => b.ticket(40)),
      );
    }
  });
  it('produces bounded tickets and distinct sequences for different seeds', () => {
    const a = new SeededRandom(42),
      b = new SeededRandom(43);
    const sequence = Array.from({ length: 100 }, () => a.ticket(7));
    expect(sequence.every((n) => Number.isInteger(n) && n >= 0 && n < 7)).toBe(true);
    expect(sequence).not.toEqual(Array.from({ length: 100 }, () => b.ticket(7)));
  });
  it.each([-1, 0.5, NaN, Infinity, 0x100000000])('rejects invalid seed %s', (seed) => {
    expect(() => new SeededRandom(seed)).toThrow('INVALID_SEED');
  });
  it.each([0, -1, 0.5, Infinity, 0x100000001])('rejects invalid maximum %s', (max) => {
    expect(() => new SeededRandom(42).ticket(max)).toThrow('INVALID_RANDOM_BOUND');
  });
});
