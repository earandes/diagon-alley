import { expect, it } from 'vitest';
import { matchesClassification } from '../../../src/arcana/domain/collection/classification';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
it('filters biography independently from power, counting all matching identities without assigning false houses', () => {
  const catalog = trialConfiguration('a87').opening.catalog;
  for (const [filter, count] of [
    ['all', 34],
    ['creatures', 4],
    ['order', 14],
    ['death', 4],
    ['army', 9],
    ['gryffindor', 14],
    ['hufflepuff', 4],
  ] as const)
    expect(catalog.wizards.filter((w) => matchesClassification(w.traits, filter))).toHaveLength(
      count,
    );
  expect(
    matchesClassification(
      catalog.wizards.find((w) => w.id === 'night-forger')!.traits,
      'creatures',
    ),
  ).toBe(false);
  expect(
    matchesClassification(
      catalog.wizards.find((w) => w.id === 'phoenix-companion')!.traits,
      'gryffindor',
    ),
  ).toBe(false);
  expect(matchesClassification(undefined, 'all')).toBe(true);
});
