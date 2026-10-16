import { it, expect } from 'vitest';
import { activeSynergies, synergyProgress } from '../../../src/arcana/domain/combat/synergies';
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
it('projects incomplete covens with the exact battle thresholds and no state mutation', () => {
  const units = [
    { hp: 1, affinity: 'alchemy' as const },
    { hp: 1, affinity: 'alchemy' as const },
    { hp: 0, affinity: 'alchemy' as const },
    { hp: 1, affinity: 'neutral' as const },
  ];
  const before = structuredClone(units);
  const incomplete = synergyProgress(units);
  expect(incomplete).toEqual([
    { affinity: 'fire', members: 0, threshold: 2, active: false },
    { affinity: 'alchemy', members: 2, threshold: 3, active: false },
    { affinity: 'shadows', members: 0, threshold: 1, active: false },
  ]);
  const proposed = [...units, { hp: 1, affinity: 'alchemy' as const }];
  expect(synergyProgress(proposed).find((s) => s.affinity === 'alchemy')).toEqual({
    affinity: 'alchemy',
    members: 3,
    threshold: 3,
    active: true,
  });
  expect(activeSynergies(proposed)).toEqual([{ affinity: 'alchemy', members: 3, threshold: 3 }]);
  expect(Object.isFrozen(incomplete)).toBe(true);
  expect(Object.isFrozen(incomplete[0])).toBe(true);
  expect(units).toEqual(before);
});
