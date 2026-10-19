import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  applyGameSchema,
  PostgresGameTransactions,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import type { GameState, OperationReceipt } from '../../../src/arcana/application/game';
import { createInventory } from '../../../src/arcana/domain/economy/inventory';

const schema = 'receipt_test_' + randomUUID().replaceAll('-', '');
const connection = {
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  connectionTimeoutMillis: 3000,
  max: 2,
};
const admin = new Pool(connection);
const pool = new Pool({ ...connection, options: `-c search_path=${schema}` });
const receipt = (id: string): OperationReceipt => ({
  id,
  kind: 'set-team',
  request: { copyIds: [] },
  team: { copyIds: [], loadouts: [] },
  run: null,
});
const initial = (): GameState => ({
  schemaVersion: 1,
  playerId: 'receipt-' + randomUUID(),
  revision: 1,
  inventory: createInventory(0),
  copies: [],
  receipts: [receipt('first'), receipt('second')],
});
beforeAll(async () => {
  await admin.query(`CREATE SCHEMA ${schema}`);
  await applyGameSchema(pool);
});
afterAll(async () => {
  await pool.end();
  await admin.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
  await admin.end();
});

describe('immutable receipt history in real isolated PostgreSQL', () => {
  it.each(['remove', 'reorder', 'replace', 'mutate'] as const)(
    'rejects an otherwise valid history %s without partial writes',
    async (change) => {
      const state = initial(),
        store = new PostgresGameTransactions(pool);
      await store.create(state);
      const before = await store.read(state.playerId);
      await expect(
        store.transact(state.playerId, (current) => ({
          ...current,
          revision: current.revision + 1,
          receipts:
            change === 'remove'
              ? current.receipts.slice(1)
              : change === 'reorder'
                ? [...current.receipts].reverse()
                : change === 'replace'
                  ? [receipt('replacement'), current.receipts[1]]
                  : [
                      {
                        ...receipt('first'),
                        request: { copyIds: [], bondFocus: 'auto' },
                        team: { copyIds: [], loadouts: [], bondFocus: 'auto' },
                      } as OperationReceipt,
                      current.receipts[1],
                    ],
        })),
      ).rejects.toThrow('INVALID_GAME');
      expect(await store.read(state.playerId)).toEqual(before);
    },
  );
  it('rolls back new receipts before commit and recovers one append after response loss', async () => {
    const state = initial(),
      store = new PostgresGameTransactions(pool);
    await store.create(state);
    const append = (current: GameState): GameState => ({
      ...current,
      revision: current.revision + 1,
      receipts: [...current.receipts, receipt('third')],
    });
    const before = await store.read(state.playerId);
    await expect(
      new PostgresGameTransactions(pool, {
        beforeCommit: () => {
          throw Error('before');
        },
      }).transact(state.playerId, append),
    ).rejects.toThrow('STORAGE');
    expect(await store.read(state.playerId)).toEqual(before);
    await expect(
      new PostgresGameTransactions(pool, {
        afterCommit: () => {
          throw Error('lost');
        },
      }).transact(state.playerId, append),
    ).rejects.toThrow('UNKNOWN_COMMIT');
    const recovered = await store.read(state.playerId);
    expect(recovered.receipts.map((r) => r.id)).toEqual(['first', 'second', 'third']);
    expect(
      (await new PostgresGameTransactions(pool).transact(state.playerId, (current) => current))
        .receipts,
    ).toEqual(recovered.receipts);
    const other = initial();
    await store.create(other);
    expect((await store.read(other.playerId)).receipts.some((r) => r.id === 'third')).toBe(false);
  });
  it('serializes two connections appending receipts without overwriting historical operations', async () => {
    const state = initial(),
      store = new PostgresGameTransactions(pool);
    await store.create(state);
    await Promise.all(
      ['third', 'fourth'].map((id) =>
        new PostgresGameTransactions(pool).transact(state.playerId, (current) => ({
          ...current,
          revision: current.revision + 1,
          receipts: [...current.receipts, receipt(id)],
        })),
      ),
    );
    const final = await store.read(state.playerId);
    expect(final.revision).toBe(3);
    expect(final.receipts.slice(0, 2)).toEqual(state.receipts);
    expect(new Set(final.receipts.map((r) => r.id))).toEqual(
      new Set(['first', 'second', 'third', 'fourth']),
    );
  });
});
