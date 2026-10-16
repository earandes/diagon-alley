import { it, expect } from 'vitest';
import { activeSynergies } from '../../../src/arcana/domain/combat/synergies';
it('uses the same alive affinity thresholds for preview and battle', () => {
  const units = [
    ...Array.from({ length: 3 }, () => ({ hp: 1, affinity: 'alchemy' as const })),
    ...Array.from({ length: 2 }, () => ({ hp: 1, affinity: 'fire' as const })),
    { hp: 1, affinity: 'shadows' as const },
    { hp: 0, affinity: 'fire' as const },
  ];
  expect(activeSynergies(units)).toEqual([
    { affinity: 'fire', members: 2, threshold: 2 },
    { affinity: 'alchemy', members: 3, threshold: 3 },
    { affinity: 'shadows', members: 1, threshold: 1 },
  ]);
  expect(units.at(-1)?.hp).toBe(0);
  expect(Object.isFrozen(activeSynergies(units))).toBe(true);
});
it('excludes neutral, fallen and below-threshold units', () => {
  expect(
    activeSynergies([
      { hp: 1, affinity: 'neutral' },
      { hp: 1, affinity: 'fire' },
      { hp: 1, affinity: 'alchemy' },
      { hp: 0, affinity: 'shadows' },
    ]),
  ).toEqual([]);
});
