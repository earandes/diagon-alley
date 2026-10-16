import { expect, it } from 'vitest';
import {
  celebrationPreset,
  createCelebrationHistory,
} from '../../../src/arcana/presentation/celebration-model';

it('scales four rarity tiers with distinct shapes and bounded particle costs', () => {
  const tiers = ['common', 'unusual', 'epic', 'arcane-legendary'] as const;
  const presets = tiers.map((rarity) => celebrationPreset(rarity, { count: 64, durationMs: 1200 }));
  expect(presets.map((p) => p.count)).toEqual([8, 14, 20, 28]);
  expect(new Set(presets.map((p) => p.shape)).size).toBe(4);
  expect(new Set(presets.map((p) => p.color)).size).toBe(4);
  expect(presets.every((p) => p.durationMs > 0 && p.durationMs <= 1800 && p.count <= 28)).toBe(
    true,
  );
  expect(presets[0].durationMs).toBeLessThan(presets[3].durationMs);
});
it('honours lower animation budgets and zero-duration presentation settings', () => {
  expect(celebrationPreset('arcane-legendary', { count: 4, durationMs: 300 }).count).toBe(4);
  expect(celebrationPreset('epic', { count: 0, durationMs: 0 }).durationMs).toBe(0);
});
it('claims a receipt once across language, skin changes and remounts', () => {
  const history = createCelebrationHistory();
  expect(history.claim('confirmed-receipt-1', { enabled: true, reduced: false })).toBe(true);
  expect(history.claim('confirmed-receipt-1', { enabled: true, reduced: false })).toBe(false);
  expect(history.claim('confirmed-receipt-2', { enabled: true, reduced: false })).toBe(true);
});
it('never celebrates a skipped, reduced or disabled receipt when preferences later change', () => {
  for (const flags of [
    { enabled: false, reduced: false },
    { enabled: true, reduced: true },
  ]) {
    const history = createCelebrationHistory();
    expect(history.claim('receipt', flags)).toBe(false);
    expect(history.claim('receipt', { enabled: true, reduced: false })).toBe(false);
  }
});
