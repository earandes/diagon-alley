import { it, expect } from 'vitest';
import {
  acquireWizard,
  validateCatalog,
  wizardSnapshot,
} from '../../../src/arcana/domain/collection/wizards';
import { catalogFixture } from './support/fixtures';
import { cromodex } from '../../../src/arcana/application/client/read-models';
import { projectPublicContent } from '../../../src/arcana/application/public-content';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';

it('rejects invalid star counts rather than stripping corrupt catalogue data', () => {
  for (const stars of [0, 6, -1, 2.5, '3', null, NaN, Infinity])
    expect(() =>
      validateCatalog({ ...catalogFixture, wizards: [{ ...catalogFixture.wizards[0], stars }] }),
    ).toThrow('INVALID_CATALOG');
});
it('keeps 1–5 stars in immutable acquisition snapshots with no effect on statistics', () => {
  for (const stars of [1, 2, 3, 4, 5] as const) {
    const wizard = { ...catalogFixture.wizards[0], stars };
    const copy = acquireWizard([], 'copy', wizard, 1, 'source', 'toad')[0];
    expect(copy.wizard).toEqual(wizard);
    expect(wizardSnapshot(wizard)).toEqual(wizard);
    expect(Object.isFrozen(copy.wizard)).toBe(true);
  }
});
it('does not infer stars for prior copies and keeps separate acquisition metadata across catalogue changes', () => {
  const prior = catalogFixture.wizards[0];
  const next = { ...prior, stars: 5 as const };
  const copies = acquireWizard(
    acquireWizard([], 'old', prior, 1, 'first', 'toad'),
    'new',
    next,
    2,
    'second',
    'toad',
  );
  const entry = cromodex({ version: 2, wizards: [next] }, copies)[0];
  expect(entry.wizard.stars).toBeUndefined();
  expect(entry.copies[0].wizard.stars).toBeUndefined();
  expect(entry.copies[1].wizard.stars).toBe(5);
  expect(entry.copies.map((copy) => copy.catalogVersion)).toEqual([1, 2]);
});
it('publishes stars for all 30 current trial cards with five values and four rarity IDs in version 2', () => {
  const { opening, campaign } = trialConfiguration('a84');
  const content = projectPublicContent(opening, campaign);
  expect(content.catalog.version).toBe(2);
  expect(content.toadTable).toMatchObject({ version: 2, catalogVersion: 2 });
  expect(content.catalog.wizards.every((wizard) => wizard.stars !== undefined)).toBe(true);
  expect([...new Set(content.catalog.wizards.map((wizard) => wizard.stars))].sort()).toEqual([
    1, 2, 3, 4, 5,
  ]);
  expect(new Set(content.catalog.wizards.map((wizard) => wizard.rarity)).size).toBe(4);
});
