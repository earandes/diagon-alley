import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { beforeAll, afterAll, it, expect, vi } from 'vitest';
import {
  PostgresGameTransactions,
  applyGameSchema,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import {
  ForgeWandUseCase,
  OpenObsidianVaultUseCase,
} from '../../../src/arcana/application/commerce-use-cases';
import { OpenCocoaToadUseCase } from '../../../src/arcana/application/shop-use-cases';
import { EquipEquipmentUseCase } from '../../../src/arcana/application/team-use-cases';
import { createInventory } from '../../../src/arcana/domain/economy/inventory';
import { commerceFixture } from '../../domain/arcana/support/commerce-fixtures';
import { catalogFixture, toadFixture, shopFixture } from '../../domain/arcana/support/fixtures';
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
const provision = async () => {
  const id = 'commerce-' + randomUUID();
  players.push(id);
  await new PostgresGameTransactions(pool).create({
    schemaVersion: 1,
    playerId: id,
    revision: 1,
    inventory: { ...createInventory(0), goldKeys: 1 },
    copies: [],
    receipts: [],
  });
  return id;
};
const forge = {
  key: 'forge',
  expectedRevision: 1,
  request: { recipeId: 'birch-dragon', catalogVersion: 1 },
};
const vault = { key: 'vault', expectedRevision: 1, request: { tableVersion: 1 } };
beforeAll(() => applyGameSchema(pool));
afterAll(async () => {
  if (players.length)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [players]);
  await pool.end();
});
it('persists forged and vault gear, opens awarded toads and equips without another purchase, then reopens a pool', async () => {
  const id = await provision(),
    games = new PostgresGameTransactions(pool);
  await new ForgeWandUseCase(games, () => commerceFixture).execute(id, forge);
  await new OpenObsidianVaultUseCase(games, () => commerceFixture, { ticket: () => 0 }).execute(
    id,
    { ...vault, expectedRevision: 2 },
  );
  await new OpenCocoaToadUseCase(
    games,
    () => ({ catalog: catalogFixture, table: toadFixture, shop: shopFixture }),
    { ticket: () => 0 },
  ).execute(id, {
    key: 'open',
    expectedRevision: 3,
    request: { unitId: 'vault:loot:0', catalogVersion: 1, tableVersion: 1 },
  });
  await new EquipEquipmentUseCase(games).execute(id, {
    key: 'equip',
    expectedRevision: 4,
    request: { copyId: 'open:copy', slot: 'wand', equipmentId: 'forge:equipment:0' },
  });
  const reopened = new Pool(connection);
  try {
    const state = await new PostgresGameTransactions(reopened).read(id);
    expect(state.inventory.equipment).toHaveLength(2);
    expect(state.inventory.crowns).toBe(85);
    expect(state.inventory.goldKeys).toBe(0);
    expect(state.team?.loadouts[0].wandId).toBe('forge:equipment:0');
    expect(state.inventory.products.find((p) => p.id === 'vault:loot:0')?.status).toBe('consumed');
    expect(state.receipts).toHaveLength(4);
  } finally {
    await reopened.end();
  }
});
it('rolls back a forge and recovers a vault after an uncertain actual COMMIT without another draw', async () => {
  const id = await provision(),
    store = new PostgresGameTransactions(pool),
    before = await store.read(id);
  const failing = new PostgresGameTransactions(pool, {
    beforeCommit: () => {
      throw Error('failure');
    },
  });
  await expect(
    new ForgeWandUseCase(failing, () => commerceFixture).execute(id, forge),
  ).rejects.toThrow('STORAGE');
  expect(await store.read(id)).toEqual(before);
  const uncertain = new PostgresGameTransactions(pool, {
      afterCommit: () => {
        throw Error('lost');
      },
    }),
    random = { ticket: vi.fn(() => 0) };
  await expect(
    new OpenObsidianVaultUseCase(uncertain, () => commerceFixture, random).execute(id, vault),
  ).rejects.toThrow('UNKNOWN_COMMIT');
  const replay = await new OpenObsidianVaultUseCase(
    store,
    () => {
      throw Error('config offline');
    },
    random,
  ).execute(id, vault);
  expect(replay.state.inventory.goldKeys).toBe(0);
  expect(replay.state.inventory.equipment).toHaveLength(1);
  expect(random.ticket).toHaveBeenCalledTimes(1);
});
it('serializes two distinct connections spending one key and returns one durable loot', async () => {
  const id = await provision(),
    random = { ticket: vi.fn(() => 0) };
  const first = new OpenObsidianVaultUseCase(
      new PostgresGameTransactions(pool),
      () => commerceFixture,
      random,
    ),
    second = new OpenObsidianVaultUseCase(
      new PostgresGameTransactions(pool),
      () => commerceFixture,
      random,
    );
  const results = await Promise.allSettled([
    first.execute(id, vault),
    second.execute(id, { ...vault, key: 'second' }),
  ]);
  expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
  expect(random.ticket).toHaveBeenCalledTimes(1);
  const state = await new PostgresGameTransactions(pool).read(id);
  expect(state.inventory.goldKeys).toBe(0);
  expect(state.receipts).toHaveLength(1);
  expect(state.inventory.products).toHaveLength(2);
});
