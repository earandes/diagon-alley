import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';
import { flavourCollection } from '../../../src/arcana/application/client/flavour-collection';
import {
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
  StartRunUseCase,
} from '../../../src/arcana/application/run-use-cases';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import {
  PostgresGameTransactions,
  applyGameSchema,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { campaignFixture, runInitial } from '../../domain/arcana/support/run-fixtures';

const connection = {
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  max: 4,
  connectionTimeoutMillis: 3000,
};
const pool = new Pool(connection),
  players: string[] = [];
const cases = (
  store: PostgresGameTransactions,
  config = campaignFixture,
  seeds = { next: vi.fn(() => 42) },
) => {
  const random = { fromSeed: (seed: number) => new SeededRandom(seed) };
  return {
    start: new StartRunUseCase(store, config),
    advance: new AdvanceNodeUseCase(
      store,
      config,
      new ResolveCombatUseCase(new CombatEngine(random), seeds),
      { now: async () => 0 },
      random,
      seeds,
    ),
  };
};
beforeAll(() => applyGameSchema(pool));
afterAll(async () => {
  if (players.length)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id = ANY($1::text[])', [players]);
  await pool.end();
});

it('discovers only committed tastes, recovers across pools and replays a lost response without another draw', async () => {
  const playerId = `flavour-test-${randomUUID()}`;
  players.push(playerId);
  const initial = runInitial(playerId),
    store = new PostgresGameTransactions(pool);
  await store.create({
    ...initial,
    inventory: {
      ...initial.inventory,
      products: [{ id: 'bean', kind: 'random-beans', status: 'available' }],
    },
  });
  await cases(store).start.execute(playerId, {
    key: 'start',
    expectedRevision: 1,
    request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0', 'copy1', 'copy2'] },
  });
  const before = await store.read(playerId),
    command = {
      key: 'taste',
      expectedRevision: before.revision,
      request: {
        runId: 'start',
        nodeId: 'duel',
        campaignVersion: 1,
        assignments: [{ unitId: 'copy0', beanId: 'bean' }],
      },
    };
  expect(flavourCollection(before).every((entry) => !entry.discovered)).toBe(true);
  const rollback = new PostgresGameTransactions(pool, {
    beforeCommit: () => {
      throw Error('Before commit');
    },
  });
  await expect(cases(rollback).advance.execute(playerId, command)).rejects.toThrow('STORAGE');
  expect(await store.read(playerId)).toEqual(before);
  expect(flavourCollection(await store.read(playerId)).every((entry) => !entry.discovered)).toBe(
    true,
  );
  const lostResponse = new PostgresGameTransactions(pool, {
    afterCommit: () => {
      throw Error('Lost response');
    },
  });
  await expect(cases(lostResponse).advance.execute(playerId, command)).rejects.toThrow(
    'UNKNOWN_COMMIT',
  );
  const reopened = new Pool(connection);
  try {
    const freshStore = new PostgresGameTransactions(reopened),
      committed = await freshStore.read(playerId);
    const expected = {
      flavour: 'mint',
      discovered: true,
      activations: 1,
      firstDiscovery: {
        operationId: 'taste',
        beanUnitId: 'bean',
        battleId: 'taste:battle',
        rulesVersion: 1,
      },
    };
    expect(flavourCollection(committed).find((entry) => entry.flavour === 'mint')).toEqual(
      expected,
    );
    const seeds = {
      next: vi.fn(() => {
        throw Error('No draw during recovery');
      }),
    };
    const replay = await cases(
      freshStore,
      () => {
        throw Error('No active catalogue during recovery');
      },
      seeds,
    ).advance.execute(playerId, command);
    expect(replay.state).toEqual(committed);
    expect(flavourCollection(replay.state).find((entry) => entry.flavour === 'mint')).toEqual(
      expected,
    );
    expect(seeds.next).not.toHaveBeenCalled();
    expect(replay.state.inventory.products.find((unit) => unit.id === 'bean')).toMatchObject({
      status: 'consumed',
      operationId: 'taste',
    });
    expect(replay.state.inventory.essence.points).toBe(45);
    expect(replay.state.inventory.crowns).toBe(150);
  } finally {
    await reopened.end();
  }
});
