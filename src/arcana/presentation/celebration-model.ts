import type { Rarity } from '../domain/collection/rarity';

const presets = {
  common: { count: 8, factor: 0.6, color: '#f4ddb0', accent: '#d8b66a', shape: 'foil' },
  unusual: { count: 14, factor: 0.8, color: '#81dfd0', accent: '#ddf8e9', shape: 'leaf' },
  epic: { count: 20, factor: 1, color: '#c7a4f0', accent: '#f4dcff', shape: 'star' },
  'arcane-legendary': {
    count: 28,
    factor: 1.25,
    color: '#f2c65e',
    accent: '#fff2c2',
    shape: 'sun',
  },
} as const;

/** Presentation budgets only. This never reads or recalculates rarity odds or game results. */
export function celebrationPreset(
  rarity: Rarity,
  budget: { readonly count: number; readonly durationMs: number },
) {
  const preset = presets[rarity];
  return {
    ...preset,
    count: Math.max(0, Math.min(preset.count, Math.floor(budget.count))),
    durationMs: Math.max(0, Math.min(1800, Math.round(budget.durationMs * preset.factor))),
  };
}

/** Shared across remounts; even omitted/reduced results are handled, never deferred celebrations. */
export function createCelebrationHistory() {
  const presented = new Set<string>();
  return {
    claim(receiptId: string, flags: { readonly enabled: boolean; readonly reduced: boolean }) {
      if (presented.has(receiptId)) return false;
      presented.add(receiptId);
      return flags.enabled && !flags.reduced;
    },
  };
}
