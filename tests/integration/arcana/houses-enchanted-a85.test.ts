import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';
import {
  applyGameSchema,
  PostgresGameTransactions,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { BuyAndOpenCocoaToadUseCase } from '../../../src/arcana/application/shop-use-cases';
import { InitializePlayerUseCase } from '../../../src/arcana/application/team-use-cases';
import { StartRunUseCase } from '../../../src/arcana/application/run-use-cases';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { validateGame } from '../../../src/arcana/application/game';
const pool = new Pool({
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  max: 2,
  connectionTimeoutMillis: 3000,
});
const ids: string[] = [];
const clock = { now: async () => 0 };
beforeAll(() => applyGameSchema(pool));
afterAll(async () => {
  if (ids.length)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [ids]);
  await pool.end();
});
async function setup(legacy = false) {
  const id = `a85-${randomUUID()}`;
  ids.push(id);
  const c = trialConfiguration(legacy ? 'a84' : 'a85'),
    store = new PostgresGameTransactions(pool);
  await new InitializePlayerUseCase(store, () => c.starter, clock).execute(id);
  return { id, c, store };
}
it('stores an enchanted acquisition once, recovers a lost response without config/RNG, and rejects mismatched provenance', async () => {
  const { id, c, store } = await setup();
  const key = 'enchanted';
  const command = {
    key,
    expectedRevision: 1,
    request: {
      priceVersion: c.opening.shop.version,
      catalogVersion: c.opening.catalog.version,
      tableVersion: c.opening.table.version,
    },
  };
  const random = { ticket: vi.fn(() => 0) };
  const lost = new PostgresGameTransactions(pool, {
    afterCommit: () => {
      throw Error('response lost');
    },
  });
  await expect(
    new BuyAndOpenCocoaToadUseCase(lost, () => c.opening, random).execute(id, command),
  ).rejects.toThrow('UNKNOWN_COMMIT');
  const recovered = await new BuyAndOpenCocoaToadUseCase(
    new PostgresGameTransactions(pool),
    () => {
      throw Error('must not reload table');
    },
    {
      ticket: () => {
        throw Error('must not reroll');
      },
    },
  ).execute(id, command);
  expect(recovered.state.inventory.crowns).toBe(40);
  expect(recovered.state.copies).toHaveLength(2);
  expect(random.ticket).toHaveBeenCalledTimes(2);
  const copy = recovered.state.copies[1];
  expect(copy.wizard.finish).toEqual({ id: 'enchanted', version: 1 });
  expect(copy.wizard.traits).toBeDefined();
  expect(recovered.receipt).toMatchObject({ wizard: { finish: copy.wizard.finish } });
  const corrupt = {
    ...recovered.state,
    copies: recovered.state.copies.map((c, i) =>
      i ? { ...c, wizard: { ...c.wizard, finish: undefined } } : c,
    ),
  };
  expect(() => validateGame(corrupt)).toThrow('INVALID_GAME');
  expect(await store.read(id)).toEqual(recovered.state);
});
it('rolls back before commit and serializes two keys without double spending or double variants', async () => {
  const { id, c, store } = await setup();
  const command = {
    key: 'first',
    expectedRevision: 1,
    request: {
      priceVersion: c.opening.shop.version,
      catalogVersion: c.opening.catalog.version,
      tableVersion: c.opening.table.version,
    },
  };
  const random = { ticket: vi.fn(() => 0) },
    before = await store.read(id);
  await expect(
    new BuyAndOpenCocoaToadUseCase(
      new PostgresGameTransactions(pool, {
        beforeCommit: () => {
          throw Error('abort');
        },
      }),
      () => c.opening,
      random,
    ).execute(id, command),
  ).rejects.toThrow('STORAGE');
  expect(await store.read(id)).toEqual(before);
  random.ticket.mockClear();
  const service = new BuyAndOpenCocoaToadUseCase(store, () => c.opening, random);
  const results = await Promise.allSettled([
    service.execute(id, command),
    service.execute(id, { ...command, key: 'other' }),
  ]);
  expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
  expect(random.ticket).toHaveBeenCalledTimes(2);
  expect((await store.read(id)).copies).toHaveLength(2);
});
it('freezes new memberships and offers, while an active A84 run and its first-win rights remain unchanged', async () => {
  for (const legacy of [false, true]) {
    const { id, c, store } = await setup(legacy);
    const begin = new StartRunUseCase(store, () => c.campaign, {
      seeds: { next: () => 0 },
      random: { fromSeed: (s) => new SeededRandom(s) },
    });
    const command = {
      key: 'route',
      expectedRevision: 1,
      request: {
        zoneId: c.campaign.zoneId,
        campaignVersion: c.campaign.version,
        copyIds: ['starter:apprentice'],
      },
    };
    const started = await begin.execute(id, command),
      stored = await new PostgresGameTransactions(pool).read(id);
    const run = stored.exploration!.run!;
    expect(run.campaignSnapshot!.combatRules.houseSynergies).toBe(legacy ? undefined : 1);
    expect(run.members[0].unit.house).toBe(legacy ? undefined : 'gryffindor');
    expect(run.tacticalVersion).toBe(legacy ? 2 : 3);
    expect(run.campaignVersion).toBe(1);
    expect(stored.exploration!.victories).toEqual([]);
    const replay = await new StartRunUseCase(store, () => {
      throw Error('changed live content');
    }).execute(id, command);
    expect(replay.receipt).toEqual(started.receipt);
    expect((await store.read(id)).exploration!.run).toEqual(run);
  }
});

// A tiny declared campaign isolates the reward-right contract from combat difficulty.
import { campaignFixture, runInitial } from '../../domain/arcana/support/run-fixtures';
import {
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
} from '../../../src/arcana/application/run-use-cases';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
it('a won legacy campaign retains its unique key when the next expedition uses house rules and content3', async () => {
  const id = `a85-rights-${randomUUID()}`;
  ids.push(id);
  const store = new PostgresGameTransactions(pool);
  await store.create(runInitial(id));
  const random = { fromSeed: (s: number) => new SeededRandom(s) },
    seeds = { next: () => 42 };
  const legacy = campaignFixture();
  const old = { ...legacy, tacticalContent: { version: 2 as const, nodes: legacy.nodes } };
  const modern = {
    ...legacy,
    combatRules: {
      ...legacy.combatRules,
      version: 2,
      houseSynergies: 1 as const,
      houseMembers: { merlin: 'gryffindor' as const },
    },
    tacticalContent: { version: 3 as const, nodes: legacy.nodes },
    prepareOwned: (copy: Parameters<typeof legacy.prepareOwned>[0]) => ({
      ...legacy.prepareOwned(copy),
      house: 'gryffindor' as const,
    }),
  };
  for (const [index, config] of [old, modern].entries()) {
    const before = await store.read(id);
    await new StartRunUseCase(store, () => config).execute(id, {
      key: `run${index}`,
      expectedRevision: before.revision,
      request: {
        zoneId: config.zoneId,
        campaignVersion: config.version,
        copyIds: ['copy0', 'copy1', 'copy2'],
      },
    });
    const service = new AdvanceNodeUseCase(
      store,
      () => config,
      new ResolveCombatUseCase(new CombatEngine(random), seeds),
      clock,
      random,
      seeds,
    );
    for (const node of ['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss']) {
      const state = await store.read(id);
      await service.execute(id, {
        key: `run${index}:${node}`,
        expectedRevision: state.revision,
        request: {
          runId: `run${index}`,
          nodeId: node,
          campaignVersion: 1,
          assignments: [],
          ...(node === 'pact' ? { pactAction: 'pass' as const } : {}),
          ...(node === 'encounter' ? { encounterAction: 'pass' as const } : {}),
        },
      });
    }
  }
  const state = await new PostgresGameTransactions(pool).read(id);
  expect(state.inventory.goldKeys).toBe(1);
  expect(state.copies).toHaveLength(3);
  const bosses = state.receipts
    .filter((r) => r.kind === 'advance-node')
    .filter((r) => r.request.nodeId === 'boss');
  expect(bosses.map((r) => r.firstVictory)).toEqual([true, false]);
  expect(bosses.map((r) => r.reward.goldKeys)).toEqual([1, 0]);
  expect(bosses.map((r) => r.battle?.engineVersion)).toEqual([1, 2]);
});
