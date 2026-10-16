import { describe, expect, it } from 'vitest';
import {
  acquireWizard,
  countDiscoveries,
  validateCatalog,
  validateToadTable,
  drawWizard,
  type WizardCatalog,
  type ToadTable,
} from '../../../src/arcana/domain/collection/wizards';
const wizard = {
  id: 'merlin',
  rarity: 'common' as const,
  name: { es: 'Merlín', en: 'Merlin' },
  context: { es: 'Sabio del folclore artúrico.', en: 'A sage from Arthurian folklore.' },
  stats: { maxHp: 100, maxMana: 20, power: 10, speed: 5 },
};
// Test-only catalogue/table; not the 30-card production catalogue or its balance.
export const catalogFixture: WizardCatalog = {
  version: 1,
  wizards: [
    wizard,
    { ...wizard, id: 'circe', rarity: 'arcane-legendary', name: { es: 'Circe', en: 'Circe' } },
  ],
};
export const toadFixture: ToadTable = {
  version: 1,
  catalogVersion: 1,
  entries: [
    { wizardId: 'merlin', weight: 3 },
    { wizardId: 'circe', weight: 1 },
  ],
};
describe('ARCANA Collection snapshots and lottery invariants', () => {
  it('preserves each permanent copy and discovers an identity only once', () => {
    const first = acquireWizard([], 'copy-a', wizard, 1, 'op-a', 'toad');
    const second = acquireWizard(first, 'copy-b', wizard, 1, 'op-b', 'toad');
    expect(countDiscoveries(second)).toBe(1);
    expect(second).toHaveLength(2);
    expect(first).toHaveLength(1);
    expect(() => acquireWizard(second, 'copy-b', wizard, 1, 'op-c', 'toad')).toThrow(
      'DUPLICATE_COPY',
    );
  });
  it('keeps the original rarity, stats and bilingual text when source configuration changes', () => {
    const mutable = structuredClone(wizard);
    const copies = acquireWizard([], 'copy-a', mutable, 1, 'op-a', 'toad');
    mutable.stats.power = 99;
    mutable.name.es = 'Cambio';
    expect(copies[0].wizard.stats.power).toBe(10);
    expect(copies[0].wizard.name.es).toBe('Merlín');
    expect(Object.isFrozen(copies[0].wizard.stats)).toBe(true);
  });
  it('draws from the exact configured weights for every controlled ticket', () => {
    const results = Array.from(
      { length: 4 },
      (_, ticket) => drawWizard(catalogFixture, toadFixture, { ticket: () => ticket }).id,
    );
    expect(results).toEqual(['merlin', 'merlin', 'merlin', 'circe']);
  });
  it('validates all four rarity IDs without inventing names or reallocating weights', () => {
    for (const rarity of ['common', 'unusual', 'epic', 'arcane-legendary'] as const) {
      expect(() => validateCatalog({ version: 1, wizards: [{ ...wizard, rarity }] })).not.toThrow();
    }
    expect(() =>
      validateCatalog({ version: 1, wizards: [{ ...wizard, rarity: 'other' as 'common' }] }),
    ).toThrow('INVALID_CATALOG');
  });
  it('rejects duplicate IDs, missing language and invalid stats', () => {
    for (const wizards of [
      [wizard, wizard],
      [{ ...wizard, name: { es: '', en: 'Merlin' } }],
      [{ ...wizard, context: { es: 'Texto', en: '' } }],
      [{ ...wizard, stats: { ...wizard.stats, maxHp: 0 } }],
      [{ ...wizard, stats: { ...wizard.stats, power: NaN } }],
    ])
      expect(() => validateCatalog({ version: 1, wizards })).toThrow('INVALID_CATALOG');
  });
  it('rejects invalid tables before asking for random', () => {
    for (const table of [
      { ...toadFixture, version: 0 },
      { ...toadFixture, catalogVersion: 2 },
      { ...toadFixture, entries: [] },
      { ...toadFixture, entries: [{ wizardId: 'unknown', weight: 1 }] },
      { ...toadFixture, entries: [{ wizardId: 'merlin', weight: 0 }] },
      { ...toadFixture, entries: [toadFixture.entries[0], toadFixture.entries[0]] },
    ]) {
      expect(() =>
        drawWizard(catalogFixture, table, {
          ticket: () => {
            throw Error('must not draw');
          },
        }),
      ).toThrow('INVALID_TOAD_TABLE');
    }
  });
  it('rejects invalid tickets instead of returning undefined or changing odds', () => {
    for (const ticket of [-1, 0.5, 4, NaN])
      expect(() => drawWizard(catalogFixture, toadFixture, { ticket: () => ticket })).toThrow(
        'INVALID_RANDOM_TICKET',
      );
  });
  it('separately validates table/catalog version references', () => {
    expect(() => validateToadTable(catalogFixture, toadFixture)).not.toThrow();
    expect(() => validateCatalog({ ...catalogFixture, version: 0 })).toThrow('INVALID_CATALOG');
  });
});
