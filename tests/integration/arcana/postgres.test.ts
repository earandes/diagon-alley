import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  PostgresGameTransactions,
  applyGameSchema,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import {
  PurchaseProductUseCase,
  BuyAndOpenCocoaToadUseCase,
  OpenCocoaToadUseCase,
} from '../../../src/arcana/application/shop-use-cases';
import { createInventory } from '../../../src/arcana/domain/economy/inventory';
import type { GameState } from '../../../src/arcana/application/game';
import { catalogFixture, toadFixture, shopFixture } from '../../domain/arcana/support/fixtures';
// Always this isolated loopback test service; never inherit an external DATABASE_URL.
const connection = {
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  max: 4,
  connectionTimeoutMillis: 3000,
};
const pool = new Pool(connection);
const playerIds: string[] = [];
const configuration = () => ({ catalog: catalogFixture, table: toadFixture, shop: shopFixture });
const player = (): GameState => {
  const playerId = 'test-' + randomUUID();
  playerIds.push(playerId);
  return {
    schemaVersion: 1,
    playerId,
    revision: 1,
    inventory: createInventory(0),
    copies: [],
    receipts: [],
  };
};
const buy = {
  key: 'buy',
  expectedRevision: 1,
  request: { product: 'cacao-toad' as const, quantity: 1, priceVersion: 1 },
};
const open = {
  key: 'open',
  expectedRevision: 2,
  request: { unitId: 'buy:0', catalogVersion: 1, tableVersion: 1 },
};
beforeAll(() => applyGameSchema(pool));
afterAll(async () => {
  if (playerIds.length)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id = ANY($1::text[])', [playerIds]);
  await pool.end();
});
describe('ARCANA PostgreSQL real transaction contract', () => {
  it('buy-open rolls back real writes and recovers committed response across pool reopening', async () => {
    const state = player(),
      store = new PostgresGameTransactions(pool);
    await store.create(state);
    const command = {
      key: 'atomic',
      expectedRevision: 1,
      request: { priceVersion: 1, catalogVersion: 1, tableVersion: 1 },
    };
    const before = await store.read(state.playerId);
    const failed = new PostgresGameTransactions(pool, {
      beforeCommit: () => {
        throw Error('failure after SQL writes');
      },
    });
    await expect(
      new BuyAndOpenCocoaToadUseCase(failed, configuration, { ticket: () => 0 }).execute(
        state.playerId,
        command,
      ),
    ).rejects.toThrow('STORAGE');
    expect(await store.read(state.playerId)).toEqual(before);
    const lost = new PostgresGameTransactions(pool, {
      afterCommit: () => {
        throw Error('response lost');
      },
    });
    await expect(
      new BuyAndOpenCocoaToadUseCase(lost, configuration, { ticket: () => 3 }).execute(
        state.playerId,
        command,
      ),
    ).rejects.toThrow('UNKNOWN_COMMIT');
    const reopenedPool = new Pool(connection);
    try {
      const reopened = new PostgresGameTransactions(reopenedPool);
      const recovered = await new BuyAndOpenCocoaToadUseCase(
        reopened,
        () => {
          throw Error('No current config needed');
        },
        {
          ticket: () => {
            throw Error('No reroll');
          },
        },
      ).execute(state.playerId, command);
      expect(recovered.state.revision).toBe(2);
      expect(recovered.state.inventory.crowns).toBe(40);
      expect(recovered.state.inventory.products).toEqual([
        { id: 'atomic:0', kind: 'cacao-toad', status: 'consumed', operationId: 'atomic' },
      ]);
      expect(recovered.receipt).toMatchObject({
        kind: 'buy-open-toad',
        spentCrowns: 10,
        wizard: { id: 'circe' },
      });
      expect(recovered.state.copies).toHaveLength(1);
      expect(recovered.state.receipts).toHaveLength(1);
    } finally {
      await reopenedPool.end();
    }
  });
  it('buy-open serializes distinct clients and leaves one debit/copy/receipt', async () => {
    const state = player(),
      a = new PostgresGameTransactions(pool),
      b = new PostgresGameTransactions(pool);
    await a.create(state);
    let draws = 0;
    const command = {
      key: 'atomic',
      expectedRevision: 1,
      request: { priceVersion: 1, catalogVersion: 1, tableVersion: 1 },
    };
    const results = await Promise.allSettled([
      new BuyAndOpenCocoaToadUseCase(a, configuration, {
        ticket: () => {
          draws++;
          return 0;
        },
      }).execute(state.playerId, command),
      new BuyAndOpenCocoaToadUseCase(b, configuration, {
        ticket: () => {
          draws++;
          return 0;
        },
      }).execute(state.playerId, { ...command, key: 'other' }),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    const saved = await b.read(state.playerId);
    expect(saved.inventory.crowns).toBe(40);
    expect(saved.copies).toHaveLength(1);
    expect(saved.receipts).toHaveLength(1);
    expect(draws).toBe(1);
  });

  it('persists star snapshots across pool reopening and preserves historical ratings after new catalogue versions', async () => {
    const localPool = new Pool(connection),
      store = new PostgresGameTransactions(localPool),
      state = player();
    let config = {
      ...configuration(),
      catalog: {
        ...catalogFixture,
        wizards: catalogFixture.wizards.map((wizard) => ({ ...wizard, stars: 2 as 2 | 5 })),
      },
    };
    const random = { ticket: () => 0 };
    try {
      await store.create(state);
      await new PurchaseProductUseCase(store, () => config).execute(state.playerId, buy);
      await new OpenCocoaToadUseCase(store, () => config, random).execute(state.playerId, open);
    } finally {
      await localPool.end();
    }
    const reopenedPool = new Pool(connection),
      reopened = new PostgresGameTransactions(reopenedPool);
    try {
      const before = await reopened.read(state.playerId);
      expect(before.copies[0].wizard.stars).toBe(2);
      config = {
        ...config,
        catalog: {
          version: 2,
          wizards: config.catalog.wizards.map((wizard) => ({ ...wizard, stars: 5 as const })),
        },
        table: { ...toadFixture, version: 2, catalogVersion: 2 },
      };
      const use = new OpenCocoaToadUseCase(reopened, () => config, random);
      const replay = await use.execute(state.playerId, open);
      if (replay.receipt.kind !== 'open-toad') throw Error('Missing opening receipt');
      expect(replay.receipt.wizard.stars).toBe(2);
      await new PurchaseProductUseCase(reopened, () => config).execute(state.playerId, {
        ...buy,
        key: 'next-buy',
        expectedRevision: before.revision,
      });
      await use.execute(state.playerId, {
        key: 'next-open',
        expectedRevision: before.revision + 1,
        request: { unitId: 'next-buy:0', catalogVersion: 2, tableVersion: 2 },
      });
      const final = await reopened.read(state.playerId);
      expect(final.copies.map((copy) => copy.wizard.stars)).toEqual([2, 5]);
      const receipts = final.receipts.filter((receipt) => receipt.kind === 'open-toad');
      expect(receipts.map((receipt) => receipt.wizard.stars)).toEqual([2, 5]);
    } finally {
      await reopenedPool.end();
    }
  });
  it('initializes a player once from two repository connections', async () => {
    const store = new PostgresGameTransactions(pool),
      state = player();
    const competing = { ...state, inventory: { ...state.inventory, crowns: 999 } };
    const initialized = await Promise.all([
      store.create(state),
      new PostgresGameTransactions(pool).create(state),
    ]);
    const first = initialized[0];
    expect(initialized[1]).toEqual(first);
    const results = await Promise.all([
      store.create(competing),
      new PostgresGameTransactions(pool).create(competing),
    ]);
    expect(first.inventory.crowns).toBe(50);
    expect(results.every((result) => result.inventory.crowns === 50)).toBe(true);
    expect(
      (
        await pool.query('SELECT count(*)::int AS count FROM arcana_accounts WHERE player_id=$1', [
          state.playerId,
        ])
      ).rows[0].count,
    ).toBe(1);
  });
  it('persists purchase/opening across closing and reopening actual PostgreSQL pools', async () => {
    const localPool = new Pool(connection),
      store = new PostgresGameTransactions(localPool),
      state = player();
    try {
      await store.create(state);
      await new PurchaseProductUseCase(store, configuration).execute(state.playerId, buy);
      await new OpenCocoaToadUseCase(store, configuration, { ticket: () => 3 }).execute(
        state.playerId,
        open,
      );
    } finally {
      await localPool.end();
    }
    const reopenedPool = new Pool(connection);
    try {
      const recovered = await new PostgresGameTransactions(reopenedPool).read(state.playerId);
      expect(recovered.inventory.crowns).toBe(40);
      expect(recovered.inventory.products[0].status).toBe('consumed');
      expect(recovered.copies[0].wizard.id).toBe('circe');
      expect(recovered.receipts).toHaveLength(2);
    } finally {
      await reopenedPool.end();
    }
  });
  it('rolls back after actual SQL writes, then recovers a response lost after COMMIT', async () => {
    const store = new PostgresGameTransactions(pool),
      state = player();
    await store.create(state);
    await new PurchaseProductUseCase(store, configuration).execute(state.playerId, buy);
    const before = await store.read(state.playerId);
    const fail = new PostgresGameTransactions(pool, {
      beforeCommit: () => {
        throw Error('fault');
      },
    });
    await expect(
      new OpenCocoaToadUseCase(fail, configuration, { ticket: () => 0 }).execute(
        state.playerId,
        open,
      ),
    ).rejects.toThrow('STORAGE');
    expect(await store.read(state.playerId)).toEqual(before);
    const lost = new PostgresGameTransactions(pool, {
      afterCommit: () => {
        throw Error('lost response');
      },
    });
    await expect(
      new OpenCocoaToadUseCase(lost, configuration, { ticket: () => 3 }).execute(
        state.playerId,
        open,
      ),
    ).rejects.toThrow('UNKNOWN_COMMIT');
    const recovered = await new OpenCocoaToadUseCase(store, configuration, {
      ticket: () => {
        throw Error('must not redraw');
      },
    }).execute(state.playerId, open);
    expect(recovered.state.copies).toHaveLength(1);
    expect(recovered.receipt).toMatchObject({ kind: 'open-toad', wizard: { id: 'circe' } });
  });
  it('serializes two clients competing for one unit and honors stale revisions', async () => {
    const state = player(),
      a = new PostgresGameTransactions(pool),
      b = new PostgresGameTransactions(pool);
    await a.create(state);
    await new PurchaseProductUseCase(a, configuration).execute(state.playerId, buy);
    let draws = 0;
    const random = {
      ticket: () => {
        draws++;
        return 0;
      },
    };
    const results = await Promise.allSettled([
      new OpenCocoaToadUseCase(a, configuration, random).execute(state.playerId, open),
      new OpenCocoaToadUseCase(b, configuration, random).execute(state.playerId, {
        ...open,
        key: 'other',
      }),
    ]);
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter((result) => result.status === 'rejected')).toHaveLength(1);
    expect(draws).toBe(1);
    expect((await b.read(state.playerId)).copies).toHaveLength(1);
  });
  it('rejects a cross-player replacement and inconsistent mutations inside a tx', async () => {
    const store = new PostgresGameTransactions(pool),
      state = player();
    await store.create(state);
    await expect(
      store.transact(state.playerId, (current) => ({ ...current, playerId: 'other' })),
    ).rejects.toThrow('PLAYER_MISMATCH');
    await expect(
      store.transact(state.playerId, (current) => ({
        ...current,
        inventory: { ...current.inventory, crowns: -1 },
      })),
    ).rejects.toThrow('INVALID_GAME');
    expect((await store.read(state.playerId)).inventory.crowns).toBe(50);
  });
  it('does not fabricate an inventory for an unknown player', async () => {
    await expect(
      new PostgresGameTransactions(pool).read('unknown-' + randomUUID()),
    ).rejects.toThrow('PLAYER_NOT_FOUND');
  });
});
