import { it, expect } from 'vitest';
import {
  resolveEncounter,
  encounterResolutionSnapshot,
  encounterChoiceSnapshot,
} from '../../../src/arcana/domain/exploration/encounters';
import { campaignFixture, runInitial } from './support/run-fixtures';
import { NO_REWARD } from '../../../src/arcana/domain/economy/rewards';
const members = runInitial().copies.map((copy, index) => ({
  source: 'owned' as const,
  unit: { ...campaignFixture().prepareOwned(copy), hp: index === 0 ? 10 : 100 },
}));
const narrative = {
  version: 1,
  text: { es: 'Un manantial entre piedras.', en: 'A spring among stones.' },
};
it('resolves reward, capped healing and lethal damage with immutable before/after health and no input mutation', () => {
  const heal = resolveEncounter(members, {
    weight: 1,
    effect: { kind: 'heal', fraction: 0.25 },
    narrative,
  });
  expect(heal.members.map((m) => m.unit.hp)).toEqual([35, 100, 100]);
  expect(heal.resolution.vitals[0]).toEqual({ unitId: 'copy0', beforeHp: 10, afterHp: 35 });
  expect(heal.reward).toEqual(NO_REWARD);
  expect(Object.isFrozen(heal.resolution.narrative?.text)).toBe(true);
  expect(Object.isFrozen(heal.resolution.vitals[0])).toBe(true);
  expect(members[0].unit.hp).toBe(10);
  const reward = { crowns: 10, goldKeys: 0, products: ['random-beans'] as const };
  expect(
    resolveEncounter(members, { weight: 1, effect: { kind: 'reward', reward } }).reward,
  ).toEqual(reward);
  expect(
    resolveEncounter(members, { weight: 1, effect: { kind: 'damage', fraction: 1 } }).members.every(
      (m) => m.unit.hp === 0,
    ),
  ).toBe(true);
});
it('validates stored effects against resulting health and reward using the same domain rules', () => {
  const resolved = resolveEncounter(members, {
    weight: 1,
    effect: { kind: 'damage', fraction: 0.1 },
    narrative,
  });
  expect(
    encounterResolutionSnapshot(resolved.resolution, resolved.members, resolved.reward),
  ).toEqual(resolved.resolution);
  for (const change of [
    { ...resolved.resolution, vitals: resolved.resolution.vitals.slice(1) },
    {
      ...resolved.resolution,
      vitals: resolved.resolution.vitals.map((v, i) => (i === 0 ? { ...v, beforeHp: 99 } : v)),
    },
    { ...resolved.resolution, effect: { kind: 'heal', fraction: 0.1 } },
    { ...resolved.resolution, narrative: { ...narrative, text: { es: '', en: 'Text' } } },
  ])
    expect(() => encounterResolutionSnapshot(change, resolved.members, resolved.reward)).toThrow();
  expect(() =>
    encounterResolutionSnapshot(resolved.resolution, resolved.members, { ...NO_REWARD, crowns: 1 }),
  ).toThrow();
});
it('rejects malformed narrative/effects and projects only named versioned bilingual metadata', () => {
  for (const invalid of [
    null,
    { version: 0, text: narrative.text },
    { version: 1, text: { es: 'Texto' } },
  ])
    expect(() =>
      encounterChoiceSnapshot({
        weight: 1,
        effect: { kind: 'heal', fraction: 0.1 },
        narrative: invalid,
      }),
    ).toThrow('INVALID_CAMPAIGN');
  expect(() =>
    encounterChoiceSnapshot({ weight: 1, effect: { kind: 'damage', fraction: 1.1 } }),
  ).toThrow('INVALID_CAMPAIGN');
  const snapshot = encounterChoiceSnapshot({
    weight: 1,
    effect: { kind: 'heal', fraction: 0.1 },
    narrative: { ...narrative, private: 'omit' },
    private: 'omit',
  });
  expect(JSON.stringify(snapshot)).not.toContain('private');
  expect(Object.isFrozen(snapshot.effect)).toBe(true);
});
