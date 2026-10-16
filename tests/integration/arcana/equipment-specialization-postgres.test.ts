import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { beforeAll, afterAll, it, expect } from 'vitest';
import {
  PostgresGameTransactions,
  applyGameSchema,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import { ForgeWandUseCase } from '../../../src/arcana/application/commerce-use-cases';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { specializedForge } from '../../../src/arcana/infrastructure/content/equipment-content';
import { createInventory } from '../../../src/arcana/domain/economy/inventory';
const pool = new Pool({
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  max: 4,
  connectionTimeoutMillis: 3000,
});
const players: string[] = [];
const config = () => {
  const commerce = trialConfiguration().opening.commerce!;
  return { ...commerce, forge: specializedForge(commerce.forge) };
};
const provision = async () => {
  const playerId = 'a67-equipment-' + randomUUID();
  players.push(playerId);
  await new PostgresGameTransactions(pool).create({
    schemaVersion: 1,
    playerId,
    revision: 1,
    inventory: { ...createInventory(0), crowns: 15 },
    copies: [],
    receipts: [],
  });
  return playerId;
};
beforeAll(() => applyGameSchema(pool));
afterAll(async () => {
  if (players.length)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [players]);
  await pool.end();
});
it('recovers a lost actual COMMIT with exact V2 specialization without charging twice, even when live configuration is unavailable', async () => {
  const id = await provision();
  const command = {
    key: 'phoenix',
    expectedRevision: 1,
    request: { recipeId: 'birch-phoenix', catalogVersion: 2 },
  };
  const uncertain = new PostgresGameTransactions(pool, {
    afterCommit: () => {
      throw Error('lost');
    },
  });
  await expect(new ForgeWandUseCase(uncertain, config).execute(id, command)).rejects.toThrow(
    'UNKNOWN_COMMIT',
  );
  const games = new PostgresGameTransactions(pool);
  const recovered = await new ForgeWandUseCase(games, () => {
    throw Error('offline config');
  }).execute(id, command);
  expect(recovered.state.inventory.crowns).toBe(0);
  expect(recovered.state.inventory.equipment).toHaveLength(1);
  expect(recovered.state.inventory.equipment?.[0]).toMatchObject({
    version: 2,
    healing: 2,
    multiplier: 1,
  });
  expect(await games.read(id)).toEqual(recovered.state);
});
it('serializes independent connections spending the last recipe cost and never obtains both specializations', async () => {
  const id = await provision();
  const commands = [
    {
      key: 'phoenix',
      expectedRevision: 1,
      request: { recipeId: 'birch-phoenix', catalogVersion: 2 },
    },
    {
      key: 'wyvern',
      expectedRevision: 1,
      request: { recipeId: 'birch-wyvern', catalogVersion: 2 },
    },
  ];
  const results = await Promise.allSettled(
    commands.map((command) =>
      new ForgeWandUseCase(new PostgresGameTransactions(pool), config).execute(id, command),
    ),
  );
  expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
  const saved = await new PostgresGameTransactions(pool).read(id);
  expect(saved.inventory.crowns).toBe(0);
  expect(saved.inventory.equipment).toHaveLength(1);
  expect(saved.receipts).toHaveLength(1);
});
it('rolls back before COMMIT and rejects stale V1 quote without a partial purchase', async () => {
  const id = await provision();
  const store = new PostgresGameTransactions(pool);
  const before = await store.read(id);
  await expect(
    new ForgeWandUseCase(store, config).execute(id, {
      key: 'old',
      expectedRevision: 1,
      request: { recipeId: 'birch-wyvern', catalogVersion: 1 },
    }),
  ).rejects.toThrow('STALE_WORKSHOP');
  const failing = new PostgresGameTransactions(pool, {
    beforeCommit: () => {
      throw Error('fail');
    },
  });
  await expect(
    new ForgeWandUseCase(failing, config).execute(id, {
      key: 'fail',
      expectedRevision: 1,
      request: { recipeId: 'birch-wyvern', catalogVersion: 2 },
    }),
  ).rejects.toThrow('STORAGE');
  expect(await store.read(id)).toEqual(before);
});
