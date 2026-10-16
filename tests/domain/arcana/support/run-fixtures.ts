import type { CampaignConfiguration } from '../../../../src/arcana/application/run-use-cases';
import type { GameState } from '../../../../src/arcana/application/game';
import { createInventory } from '../../../../src/arcana/domain/economy/inventory';
import type { CombatUnitInput } from '../../../../src/arcana/domain/combat/engine';
import { catalogFixture } from './fixtures';
// Mechanics fixtures only: not an approved starter team, campaign or economy configuration.
const enemy = (id: string): CombatUnitInput => ({
  id,
  wizardId: 'rival',
  level: 1,
  affinity: 'neutral',
  hp: 1,
  maxHp: 1,
  mana: 20,
  maxMana: 20,
  power: 0,
  speed: 0,
  wandPowerBonus: 0,
  wandMultiplier: 1,
  broomInitiative: 0,
});
export const campaignFixture = (): CampaignConfiguration => ({
  version: 1,
  zoneId: 'bulevar',
  nextZoneId: 'pasaje',
  graph: {
    version: 1,
    nodes: ['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss'].map((kind, row, list) => ({
      id: kind,
      kind: kind as 'duel' | 'refuge' | 'chest' | 'pact' | 'encounter' | 'boss',
      row,
      next: row + 1 < list.length ? [list[row + 1]] : [],
    })),
  },
  combatRules: {
    version: 1,
    maxRounds: 30,
    spellManaCost: 1,
    fireBurnDamage: 0,
    alchemyHealing: 0,
    shadowInitiative: 0,
    beans: { version: 1, entries: [{ flavour: 'mint', weight: 1 }] },
  },
  rounding: 'floor',
  nodes: [
    {
      nodeId: 'duel',
      kind: 'duel',
      levelId: 'level1',
      opponents: [enemy('r0'), enemy('r1'), enemy('r2')],
      reward: { crowns: 100, goldKeys: 0, products: ['random-beans'] },
    },
    { nodeId: 'refuge', kind: 'refuge' },
    {
      nodeId: 'chest',
      kind: 'chest',
      reward: { crowns: 20, goldKeys: 0, products: ['cacao-toad'] },
    },
    {
      nodeId: 'pact',
      kind: 'pact',
      recruit: { ...enemy('temporary'), wizardId: 'circe', maxHp: 80, hp: 80 },
    },
    {
      nodeId: 'encounter',
      kind: 'encounter',
      choices: [
        { weight: 1, effect: { kind: 'reward', reward: { crowns: 5, goldKeys: 0, products: [] } } },
      ],
    },
    {
      nodeId: 'boss',
      kind: 'boss',
      levelId: 'boss1',
      opponents: [enemy('b0'), enemy('b1'), enemy('b2')],
      reward: { crowns: 100, goldKeys: 1, products: [] },
    },
  ],
  prepareOwned: (copy) => ({
    ...enemy(copy.copyId),
    wizardId: copy.wizard.id,
    hp: copy.wizard.stats.maxHp,
    maxHp: copy.wizard.stats.maxHp,
    mana: copy.wizard.stats.maxMana,
    maxMana: copy.wizard.stats.maxMana,
    power: copy.wizard.stats.power,
    speed: copy.wizard.stats.speed,
  }),
});
export const runInitial = (playerId = 'player'): GameState => ({
  schemaVersion: 1,
  playerId,
  revision: 1,
  inventory: createInventory(0),
  copies: [0, 1, 2].map((i) => ({
    copyId: `copy${i}`,
    wizard: catalogFixture.wizards[0],
    catalogVersion: 1,
    sourceId: 'test-starter',
    origin: 'starter' as const,
  })),
  receipts: [],
});
