import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';
import {
  applyGameSchema,
  PostgresGameTransactions,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import {
  InitializePlayerUseCase,
  SetTeamUseCase,
} from '../../../src/arcana/application/team-use-cases';
import { StartRunUseCase } from '../../../src/arcana/application/run-use-cases';
import { BuyAndOpenCocoaToadUseCase } from '../../../src/arcana/application/shop-use-cases';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { bondProgress } from '../../../src/arcana/domain/combat/bonds';
import { campaignFixture, runInitial } from '../../domain/arcana/support/run-fixtures';
import {
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
} from '../../../src/arcana/application/run-use-cases';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
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
async function setup(version: 'a85' | 'a87' = 'a87') {
  const id = `a87-${randomUUID()}`;
  ids.push(id);
  const c = trialConfiguration(version),
    store = new PostgresGameTransactions(pool);
  await new InitializePlayerUseCase(store, () => c.starter, clock).execute(id);
  return { id, c, store };
}
it('recovers a bond choice after a lost response with the exact request and no economy change', async () => {
  const { id, c, store } = await setup();
  const before = await store.read(id);
  const command = {
    key: 'bond',
    expectedRevision: 1,
    request: { copyIds: ['starter:apprentice'], bondFocus: 'creatures' as const },
  };
  const lost = new PostgresGameTransactions(pool, {
    afterCommit: () => {
      throw Error('lost');
    },
  });
  await expect(new SetTeamUseCase(lost, () => c.campaign).execute(id, command)).rejects.toThrow(
    'UNKNOWN_COMMIT',
  );
  const result = await new SetTeamUseCase(store, () => {
    throw Error('must not consult live content');
  }).execute(id, command);
  expect(result.receipt).toMatchObject({
    request: command.request,
    team: { bondFocus: 'creatures' },
  });
  expect(result.state.inventory).toEqual(before.inventory);
  expect(result.state.copies).toEqual(before.copies);
  expect(await store.read(id)).toEqual(result.state);
  await expect(
    new SetTeamUseCase(store, () => c.campaign).execute(id, {
      ...command,
      request: { ...command.request, bondFocus: 'order' },
    }),
  ).rejects.toThrow('OPERATION_CONFLICT');
});
it('serializes two tabs and rolls back a failed bond save without consuming anything', async () => {
  const { id, c, store } = await setup();
  const before = await store.read(id);
  const command = {
    key: 'abort',
    expectedRevision: 1,
    request: { copyIds: ['starter:apprentice'], bondFocus: 'order' as const },
  };
  const failing = new PostgresGameTransactions(pool, {
    beforeCommit: () => {
      throw Error('abort');
    },
  });
  await expect(new SetTeamUseCase(failing, () => c.campaign).execute(id, command)).rejects.toThrow(
    'STORAGE',
  );
  expect(await store.read(id)).toEqual(before);
  const commands = ['order', 'creatures'].map((bondFocus, i) => ({
    ...command,
    key: `tab${i}`,
    request: { ...command.request, bondFocus: bondFocus as 'order' | 'creatures' },
  }));
  const results = await Promise.allSettled(
    commands.map((cmd) =>
      new SetTeamUseCase(new PostgresGameTransactions(pool), () => c.campaign).execute(id, cmd),
    ),
  );
  expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
  const saved = await store.read(id);
  expect(saved.revision).toBe(2);
  expect(saved.receipts.filter((r) => r.kind === 'set-team')).toHaveLength(1);
  expect(saved.inventory).toEqual(before.inventory);
});
it('binds the selected mode to a new expedition and keeps historical start receipts unchanged on a later choice', async () => {
  const { id, c, store } = await setup();
  const command = {
    key: 'route',
    expectedRevision: 1,
    request: {
      zoneId: c.campaign.zoneId,
      campaignVersion: c.campaign.version,
      copyIds: ['starter:apprentice'],
      bondFocus: 'order' as const,
    },
  };
  const start = new StartRunUseCase(store, () => c.campaign, {
    seeds: { next: () => 0 },
    random: { fromSeed: (seed) => new SeededRandom(seed) },
  });
  const result = await start.execute(id, command);
  expect(result.state.exploration!.run).toMatchObject({
    tacticalVersion: 4,
    bondFocus: 'order',
    campaignSnapshot: { combatRules: { version: 3 } },
  });
  const changed = await new SetTeamUseCase(store, () => c.campaign).execute(id, {
    key: 'change',
    expectedRevision: 2,
    request: { copyIds: command.request.copyIds, bondFocus: 'creatures' },
  });
  expect(changed.state.exploration!.run!.bondFocus).toBe('creatures');
  expect(changed.state.receipts.find((r) => r.id === 'route')).toEqual(result.receipt);
  await expect(
    start.execute(id, { ...command, request: { ...command.request, bondFocus: 'houses' } }),
  ).rejects.toThrow('OPERATION_CONFLICT');
});
it('preserves an active a85 snapshot and rejects a new bond unsupported by that expedition', async () => {
  const { id, c, store } = await setup('a85');
  await new StartRunUseCase(store, () => c.campaign, {
    seeds: { next: () => 0 },
    random: { fromSeed: (seed) => new SeededRandom(seed) },
  }).execute(id, {
    key: 'old',
    expectedRevision: 1,
    request: {
      zoneId: c.campaign.zoneId,
      campaignVersion: c.campaign.version,
      copyIds: ['starter:apprentice'],
    },
  });
  const before = await store.read(id);
  await expect(
    new SetTeamUseCase(store, () => trialConfiguration('a87').campaign).execute(id, {
      key: 'unsupported',
      expectedRevision: 2,
      request: { copyIds: ['starter:apprentice'], bondFocus: 'creatures' },
    }),
  ).rejects.toThrow('INVALID_FORMATION');
  expect(await store.read(id)).toEqual(before);
  expect(before.exploration!.run!.campaignSnapshot!.combatRules.bonds).toBeUndefined();
});
it('stores an obtainable creature once and recovers its historical result without a second draw', async () => {
  const { id, c, store } = await setup();
  const command = {
    key: 'creature',
    expectedRevision: 1,
    request: { priceVersion: c.opening.shop.version, catalogVersion: 4, tableVersion: 4 },
  };
  const random = { ticket: vi.fn((bound: number) => (bound === 33 ? 29 : 50)) };
  const lost = new PostgresGameTransactions(pool, {
    afterCommit: () => {
      throw Error('lost');
    },
  });
  await expect(
    new BuyAndOpenCocoaToadUseCase(lost, () => c.opening, random).execute(id, command),
  ).rejects.toThrow('UNKNOWN_COMMIT');
  const recovered = await new BuyAndOpenCocoaToadUseCase(
    store,
    () => {
      throw Error('no config');
    },
    {
      ticket: () => {
        throw Error('no draw');
      },
    },
  ).execute(id, command);
  expect(recovered.state.copies[1]).toMatchObject({
    catalogVersion: 4,
    wizard: { id: 'phoenix-companion', traits: { version: 2, nature: 'creature' } },
  });
  expect(recovered.state.inventory.crowns).toBe(40);
  expect(recovered.state.copies).toHaveLength(2);
  expect(random.ticket).toHaveBeenCalledTimes(2);
});
it('stores four enchanted species as four identities, with their original stats and a single contribution each', async () => {
  const { id, c, store } = await setup();
  for (let index = 0; index < 4; index++)
    await new BuyAndOpenCocoaToadUseCase(store, () => c.opening, {
      ticket: (bound) => (bound === 33 ? 29 + index : 0),
    }).execute(id, {
      key: `species${index}`,
      expectedRevision: index + 1,
      request: { priceVersion: c.opening.shop.version, catalogVersion: 4, tableVersion: 4 },
    });
  const state = await store.read(id),
    copies = state.copies.slice(1);
  expect(copies.every((copy) => copy.wizard.finish?.id === 'enchanted')).toBe(true);
  for (const copy of copies)
    expect(copy.wizard.stats).toEqual(
      c.opening.catalog.wizards.find((w) => w.id === copy.wizard.id)!.stats,
    );
  expect(
    bondProgress(copies.map(c.campaign.prepareOwned), c.campaign.combatRules.bonds!, 'creatures'),
  ).toMatchObject({ count: 4, tier: 2 });
  expect(state.inventory.crowns).toBe(10);
});
it('recovers an a85 opening after upgrading the live table without reclassifying or drawing again', async () => {
  const { id, c, store } = await setup('a85');
  const command = {
    key: 'old-opening',
    expectedRevision: 1,
    request: { priceVersion: c.opening.shop.version, catalogVersion: 3, tableVersion: 3 },
  };
  const old = await new BuyAndOpenCocoaToadUseCase(store, () => c.opening, {
    ticket: () => 0,
  }).execute(id, command);
  const recovered = await new BuyAndOpenCocoaToadUseCase(
    store,
    () => trialConfiguration('a87').opening,
    {
      ticket: () => {
        throw Error('must not draw');
      },
    },
  ).execute(id, command);
  expect(recovered).toEqual(old);
  expect(recovered.state.copies[1].wizard.traits!.version).toBe(1);
});
it('keeps campaign1 unique rewards when a won a85 expedition is followed by rules3/content4', async () => {
  const id = `a87-rights-${randomUUID()}`;
  ids.push(id);
  const store = new PostgresGameTransactions(pool);
  await store.create(runInitial(id));
  const base = campaignFixture(),
    rules = trialConfiguration('a87').campaign.combatRules;
  const old = {
    ...base,
    combatRules: { ...base.combatRules, version: 2, houseSynergies: 1 as const },
    tacticalContent: { version: 3 as const, nodes: base.nodes },
  };
  const next = {
    ...base,
    combatRules: {
      ...base.combatRules,
      version: 3,
      houseSynergies: 1 as const,
      bonds: rules.bonds,
    },
    tacticalContent: { version: 4 as const, nodes: base.nodes },
  };
  const random = { fromSeed: (s: number) => new SeededRandom(s) },
    seeds = { next: () => 42 };
  for (const [index, config] of [old, next].entries()) {
    const before = await store.read(id);
    await new StartRunUseCase(store, () => config).execute(id, {
      key: `run${index}`,
      expectedRevision: before.revision,
      request: { zoneId: config.zoneId, campaignVersion: 1, copyIds: ['copy0', 'copy1', 'copy2'] },
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
  const state = await store.read(id),
    bosses = state.receipts.flatMap((r) =>
      r.kind === 'advance-node' && r.request.nodeId === 'boss' ? [r] : [],
    );
  expect(state.inventory.goldKeys).toBe(1);
  expect(state.copies).toHaveLength(3);
  expect(bosses.map((r) => r.firstVictory)).toEqual([true, false]);
  expect(bosses.map((r) => r.reward.goldKeys)).toEqual([1, 0]);
  expect(bosses.map((r) => r.battle?.engineVersion)).toEqual([2, 3]);
});
