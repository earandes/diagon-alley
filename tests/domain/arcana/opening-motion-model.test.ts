import { describe, expect, it } from 'vitest';
import {
  openingMotionRecipe,
  openingPhaseAt,
} from '../../../src/arcana/presentation/opening-motion-model';
const timings = { sealMs: 250, lidMs: 400, subjectMs: 650, cardMs: 500, holdMs: 150 };
const rarities = ['common', 'unusual', 'epic', 'arcane-legendary'] as const;
describe('A69 confirmed opening presentation recipe', () => {
  it('derives ordered named phases from pack timings and ends within a finite budget', () => {
    for (const rarity of rarities)
      for (const isNew of [true, false]) {
        const recipe = openingMotionRecipe(timings, rarity, isNew);
        const { labels } = recipe;
        expect(labels.anticipation).toBe(0);
        expect(labels.seal).toBeGreaterThan(0);
        expect(labels.lid).toBeGreaterThan(labels.seal);
        expect(labels.hop).toBeGreaterThan(labels.lid);
        expect(labels.escape).toBeGreaterThan(labels.hop);
        expect(labels.card).toBeGreaterThan(labels.escape);
        expect(labels.flip).toBeGreaterThan(labels.card);
        expect(labels.reveal).toBeGreaterThan(labels.flip);
        expect(labels.resolve).toBeGreaterThan(labels.reveal);
        expect(labels.finish).toBe(recipe.durationMs);
        expect(recipe.durationMs).toBeGreaterThanOrEqual(1800);
        expect(recipe.durationMs).toBeLessThanOrEqual(3800);
        expect(recipe.sparkCount).toBeLessThanOrEqual(24);
        expect(recipe.magicMs).toBeLessThanOrEqual(3200);
      }
  });
  it('gives repeated copies a shorter subdued closure at all four existing rarities', () => {
    for (const rarity of rarities) {
      const fresh = openingMotionRecipe(timings, rarity, true),
        repeat = openingMotionRecipe(timings, rarity, false);
      expect(repeat.durationMs).toBeLessThan(fresh.durationMs);
      expect(repeat.sparkCount).toBeLessThan(fresh.sparkCount);
      expect(repeat.intensity).toBeLessThan(fresh.intensity);
    }
    const fresh = rarities.map((r) => openingMotionRecipe(timings, r, true));
    expect(fresh.map((r) => r.sparkCount)).toEqual([6, 10, 16, 24]);
    expect(fresh[3].durationMs).toBeGreaterThan(fresh[0].durationMs);
  });
  it('changes phase boundaries with the actual pack and cannot be made an unbounded wait', () => {
    const a = openingMotionRecipe(timings, 'epic', true),
      b = openingMotionRecipe({ ...timings, subjectMs: 850 }, 'epic', true);
    expect(b.labels.escape).toBeGreaterThan(a.labels.escape);
    expect(
      openingMotionRecipe({ ...timings, cardMs: 999999 }, 'epic', true).durationMs,
    ).toBeLessThanOrEqual(3800);
    expect(
      openingMotionRecipe({ ...timings, sealMs: NaN }, 'common', true).durationMs,
    ).toBeGreaterThan(0);
  });
  it('maps boundaries to a stable phase and the finite confirmed-result endpoint', () => {
    const r = openingMotionRecipe(timings, 'unusual', true);
    expect(openingPhaseAt(r, r.labels.hop - 1)).toBe('lid');
    expect(openingPhaseAt(r, r.labels.hop)).toBe('hop');
    expect(openingPhaseAt(r, r.labels.reveal)).toBe('reveal');
    expect(openingPhaseAt(r, r.durationMs)).toBe('finish');
    expect(openingPhaseAt(r, -1)).toBe('anticipation');
    expect(Object.isFrozen(r)).toBe(true);
    expect(Object.isFrozen(r.labels)).toBe(true);
  });
});
