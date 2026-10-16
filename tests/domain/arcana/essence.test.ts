import { describe, expect, it } from 'vitest';
import {
  createEssence,
  regenerateEssence,
  spendCombatEssence,
} from '../../../src/arcana/domain/economy/essence';
const minute = 60_000;
describe('ARCANA EN01–05 specified Essence rules', () => {
  it('spends exactly 5 without changing its input', () => {
    const source = createEssence(50, 0);
    expect(spendCombatEssence(source, 0).points).toBe(45);
    expect(source.points).toBe(50);
  });
  it('rejects a combat below 5 and allows spending exactly 5', () => {
    expect(() => spendCombatEssence(createEssence(4, 0), 0)).toThrow('INSUFFICIENT_ESSENCE');
    expect(spendCombatEssence(createEssence(5, 0), 0).points).toBe(0);
  });
  it.each([
    [12 * minute - 1, 0],
    [12 * minute, 1],
    [24 * minute, 2],
  ])('regenerates only complete intervals at %i ms', (now, expected) => {
    expect(regenerateEssence(createEssence(0, 0), now).points).toBe(expected);
  });
  it('keeps an incomplete interval when below capacity', () => {
    const after = regenerateEssence(createEssence(0, 0), 13 * minute);
    expect(after).toEqual({ points: 1, cursor: 12 * minute });
    expect(regenerateEssence(after, 24 * minute).points).toBe(2);
  });
  it('never banks capacity overflow for use after spending', () => {
    const full = regenerateEssence(createEssence(49, 0), 25 * minute);
    expect(full).toEqual({ points: 50, cursor: 25 * minute });
    const spent = spendCombatEssence(full, 25 * minute);
    expect(regenerateEssence(spent, 25 * minute).points).toBe(45);
    expect(regenerateEssence(spent, 37 * minute).points).toBe(46);
  });
  it('starts counting from spending time when already full', () => {
    const spent = spendCombatEssence(createEssence(50, 0), 10 * minute);
    expect(regenerateEssence(spent, 21 * minute).points).toBe(45);
    expect(regenerateEssence(spent, 22 * minute).points).toBe(46);
  });
  it('does not credit or move its cursor backwards', () => {
    const source = createEssence(10, 50 * minute);
    expect(regenerateEssence(source, 20 * minute)).toEqual(source);
  });
  it.each([-1, 51, 0.5, NaN, Infinity])('rejects invalid points %s', (points) => {
    expect(() => createEssence(points, 0)).toThrow('INVALID_ESSENCE');
  });
  it('rejects invalid timestamps instead of propagating NaN', () => {
    expect(() => createEssence(5, NaN)).toThrow('INVALID_TIME');
    expect(() => regenerateEssence(createEssence(5, 0), Infinity)).toThrow('INVALID_TIME');
  });
});
