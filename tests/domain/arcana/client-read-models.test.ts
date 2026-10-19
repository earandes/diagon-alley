import { commerceFixture } from './support/commerce-fixtures';
import { gameSnapshot, type GameState } from '../../../src/arcana/application/game';
import {
  StartRunUseCase,
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
} from '../../../src/arcana/application/run-use-cases';
import { SetTeamUseCase } from '../../../src/arcana/application/team-use-cases';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { campaignFixture, runInitial } from './support/run-fixtures';
import { it, expect } from 'vitest';
import {
  cromodex,
  commerceOffers,
  latestNodeReceipt,
  routeOptions,
  toadProbabilities,
} from '../../../src/arcana/application/client/read-models';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { acquireWizard } from '../../../src/arcana/domain/collection/wizards';
import { createRoute, advanceRoute } from '../../../src/arcana/domain/exploration/route';
it('preserves discovery snapshots and copies rather than silently reclassifying cards', () => {
  const { opening } = trialConfiguration(),
    prior = { ...opening.catalog.wizards[1], rarity: 'common' as const };
  const copies = acquireWizard(
    acquireWizard([], 'first', prior, 1, 'one', 'toad'),
    'second',
    prior,
    1,
    'two',
    'toad',
  );
  const updated = {
    ...opening.catalog,
    version: opening.catalog.version + 1,
    wizards: opening.catalog.wizards.map((w) =>
      w.id === prior.id ? { ...w, rarity: 'epic' as const } : w,
    ),
  };
  const entries = cromodex(updated, copies);
  expect(entries).toHaveLength(34);
  expect(entries.find((e) => e.wizard.id === prior.id)).toMatchObject({
    discovered: true,
    wizard: { rarity: 'common' },
    catalogVersion: 1,
  });
  expect(entries.find((e) => e.wizard.id === prior.id)?.copies).toHaveLength(2);
  expect(Object.isFrozen(entries[0])).toBe(true);
});
it('retains owned cards outside current catalogue and locks undiscovered identities', () => {
  const { opening } = trialConfiguration(),
    wizard = opening.catalog.wizards[1],
    copies = acquireWizard([], 'old', wizard, 1, 'one', 'toad');
  const entries = cromodex(
    { ...opening.catalog, wizards: opening.catalog.wizards.filter((w) => w.id !== wizard.id) },
    copies,
  );
  expect(entries.find((e) => e.wizard.id === wizard.id)).toMatchObject({
    historical: true,
    discovered: true,
  });
  expect(entries.find((e) => e.wizard.id === 'circe')?.discovered).toBe(false);
});
it('derives exact per-identity probabilities from supplied positive versioned weights', () => {
  const { opening } = trialConfiguration(),
    probabilities = toadProbabilities(opening.catalog, opening.table);
  expect(probabilities).toHaveLength(33);
  expect(probabilities.reduce((n, p) => n + p.probability, 0)).toBeCloseTo(1);
  expect(probabilities[0].probability).toBe(1 / 33);
});
it('projects only adjacent choices and leaves the run unchanged', () => {
  const { campaign } = trialConfiguration(),
    start = createRoute('run', campaign.graph),
    advanced = advanceRoute(start, campaign.graph, 'pasaje:0:0');
  expect(routeOptions(start, campaign.graph)).toEqual(['pasaje:0:0']);
  expect(routeOptions(advanced, campaign.graph)).toEqual(['pasaje:1:0', 'pasaje:1:1']);
  expect(advanced.visited).toEqual(['pasaje:0:0']);
});
it('recovers the receipt for the last visit of the current run regardless of later team operations', async () => {
  let state = gameSnapshot(runInitial());
  const games = {
    read: async () => state,
    transact: async (_id: string, change: (state: GameState) => GameState) =>
      (state = gameSnapshot(change(state))),
  };
  const start = new StartRunUseCase(games, campaignFixture);
  const seeds = { next: () => 42 },
    random = { fromSeed: (seed: number) => new SeededRandom(seed) };
  const advance = new AdvanceNodeUseCase(
    games,
    campaignFixture,
    new ResolveCombatUseCase(new CombatEngine(random), seeds),
    { now: async () => 0 },
    random,
    seeds,
  );
  const request = { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0', 'copy1', 'copy2'] };
  await start.execute('player', { key: 'start', expectedRevision: state.revision, request });
  expect(latestNodeReceipt(state)).toBe(null);
  for (const nodeId of ['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss'])
    await advance.execute('player', {
      key: nodeId,
      expectedRevision: state.revision,
      request: { runId: 'start', nodeId, campaignVersion: 1, assignments: [] },
    });
  await new SetTeamUseCase(games, campaignFixture).execute('player', {
    key: 'team',
    expectedRevision: state.revision,
    request: { copyIds: request.copyIds },
  });
  expect(latestNodeReceipt(state)?.id).toBe('boss');
  expect(state.receipts.at(-1)?.id).toBe('team');
  await start.execute('player', { key: 'next-run', expectedRevision: state.revision, request });
  expect(latestNodeReceipt(state)).toBe(null);
});
it('projects recipe affordability and vault availability through shared domain gates', () => {
  const inventory = { ...runInitial().inventory, crowns: 14, goldKeys: 0 };
  expect(commerceOffers(inventory, commerceFixture)).toMatchObject({
    canOpenVault: false,
    recipes: [{ affordable: false }],
  });
  expect(commerceOffers({ ...inventory, crowns: 15, goldKeys: 1 }, commerceFixture)).toMatchObject({
    canOpenVault: true,
    recipes: [{ affordable: true }],
  });
  expect(inventory.crowns).toBe(14);
});
it('derives public vault probabilities from the active weighted table without replacing loot', () => {
  const table = {
    ...commerceFixture,
    vault: {
      ...commerceFixture.vault,
      entries: commerceFixture.vault.entries.map((entry, index) => ({
        ...entry,
        weight: index === 0 ? 3 : 1,
      })),
    },
  };
  const offers = commerceOffers(runInitial().inventory, table);
  expect(offers.vaultRewards.map((entry) => entry.probability)).toEqual([0.75, 0.25]);
  expect(offers.vaultRewards[0].loot.equipment[0]).toMatchObject({ kind: 'wand', multiplier: 1.3 });
});
