import type { WizardCatalog, ToadTable } from '../../../../src/arcana/domain/collection/wizards';
import type { ShopCatalog } from '../../../../src/arcana/domain/economy/inventory';
// Explicit test-only values. They do not define the 30-card catalogue or approved prices/weights.
export const catalogFixture: WizardCatalog = {
  version: 1,
  wizards: [
    {
      id: 'merlin',
      rarity: 'common',
      name: { es: 'Merlín', en: 'Merlin' },
      context: { es: 'Sabio del folclore artúrico.', en: 'A sage from Arthurian folklore.' },
      stats: { maxHp: 100, maxMana: 20, power: 10, speed: 5 },
    },
    {
      id: 'circe',
      rarity: 'arcane-legendary',
      name: { es: 'Circe', en: 'Circe' },
      context: { es: 'Hechicera de la mitología griega.', en: 'A sorceress from Greek mythology.' },
      stats: { maxHp: 80, maxMana: 30, power: 12, speed: 6 },
    },
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
export const shopFixture: ShopCatalog = {
  version: 1,
  products: [
    { kind: 'cacao-toad', crowns: 10 },
    { kind: 'random-beans', crowns: 5 },
  ],
};
