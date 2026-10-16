// Explicit mechanics fixture; does not constitute approved production balance.
export const commerceFixture = {
  forge: {
    version: 1,
    recipes: [
      {
        id: 'birch-dragon',
        crowns: 15,
        wood: 'birch',
        core: 'dragon',
        powerBonus: 2,
        multiplier: 1.2,
      },
    ],
  },
  vault: {
    version: 1,
    entries: [
      {
        id: 'wand',
        weight: 1,
        loot: {
          crowns: 50,
          products: ['cacao-toad', 'cacao-toad'],
          equipment: [
            { kind: 'wand', wood: 'elder', core: 'dragon', powerBonus: 4, multiplier: 1.3 },
          ],
        },
      },
      {
        id: 'broom',
        weight: 1,
        loot: {
          crowns: 75,
          products: ['random-beans', 'random-beans'],
          equipment: [{ kind: 'broom', model: 'zephyr-2000', initiative: 8 }],
        },
      },
    ],
  },
} as const;
