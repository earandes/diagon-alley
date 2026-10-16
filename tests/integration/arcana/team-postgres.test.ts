import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import {
  PostgresGameTransactions,
  applyGameSchema,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import {
  InitializePlayerUseCase,
  SetTeamUseCase,
  EquipEquipmentUseCase,
} from '../../../src/arcana/application/team-use-cases';
import {
  PurchaseProductUseCase,
  OpenCocoaToadUseCase,
} from '../../../src/arcana/application/shop-use-cases';
import {
  StartRunUseCase,
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
} from '../../../src/arcana/application/run-use-cases';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { catalogFixture, toadFixture, shopFixture } from '../../domain/arcana/support/fixtures';
import { campaignFixture } from '../../domain/arcana/support/run-fixtures';
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
  ids: string[] = [];
const apprentice = {
  ...catalogFixture.wizards[0],
  id: 'apprentice-alchemy',
  name: { es: 'Aprendiz de Alquimia', en: 'Alchemy Apprentice' },
};
const kit = () => ({ catalog: { version: 1, wizards: [apprentice] }, apprenticeId: apprentice.id });
const opening = () => ({ catalog: catalogFixture, table: toadFixture, shop: shopFixture });
const clock = { now: async () => 0 };
const initialize = (store: PostgresGameTransactions) =>
  new InitializePlayerUseCase(store, kit, clock);
const fixture = async () => {
  const id = 'team-test-' + randomUUID();
  ids.push(id);
  const store = new PostgresGameTransactions(pool);
  await initialize(store).execute(id);
  await new PurchaseProductUseCase(store, opening).execute(id, {
    key: 'buy',
    expectedRevision: 1,
    request: { product: 'cacao-toad', quantity: 2, priceVersion: 1 },
  });
  for (let i = 0; i < 2; i++)
    await new OpenCocoaToadUseCase(store, opening, { ticket: () => 0 }).execute(id, {
      key: `open${i}`,
      expectedRevision: 2 + i,
      request: { unitId: `buy:${i}`, catalogVersion: 1, tableVersion: 1 },
    });
  return { id, store };
};
beforeAll(() => applyGameSchema(pool));
afterAll(async () => {
  if (ids.length)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [ids]);
  await pool.end();
});
describe('ARCANA PostgreSQL owned kit, team and reserve state', () => {
  it('initializes the exact kit once across two real repository connections', async () => {
    const id = 'kit-test-' + randomUUID();
    ids.push(id);
    const [a, b] = await Promise.all([
      initialize(new PostgresGameTransactions(pool)).execute(id),
      initialize(new PostgresGameTransactions(pool)).execute(id),
    ]);
    expect(a).toEqual(b);
    expect(a.copies).toHaveLength(1);
    expect(a.inventory.equipment).toHaveLength(2);
    expect(a.team?.copyIds).toEqual(['starter:apprentice']);
    const recovered = await new PostgresGameTransactions(pool).read(id);
    expect(recovered).toEqual(a);
    expect(
      (
        await pool.query('SELECT count(*)::int AS count FROM arcana_equipment WHERE player_id=$1', [
          id,
        ])
      ).rows[0].count,
    ).toBe(2);
  });
  it('persists equipment transfer and reserves, retaining mana on reselect after reopening pool', async () => {
    const { id, store } = await fixture();
    const copyIds = ['starter:apprentice', 'open0:copy', 'open1:copy'];
    await new StartRunUseCase(store, campaignFixture).execute(id, {
      key: 'start',
      expectedRevision: 4,
      request: { zoneId: 'bulevar', campaignVersion: 1, copyIds },
    });
    const random = { fromSeed: (seed: number) => new SeededRandom(seed) };
    const advance = new AdvanceNodeUseCase(
      store,
      campaignFixture,
      new ResolveCombatUseCase(new CombatEngine(random), { next: () => 42 }),
      clock,
      random,
      { next: () => 42 },
    );
    await advance.execute(id, {
      key: 'duel',
      expectedRevision: 5,
      request: { runId: 'start', nodeId: 'duel', campaignVersion: 1, assignments: [] },
    });
    const mana = (await store.read(id)).exploration!.run!.members[0].unit.mana;
    await new EquipEquipmentUseCase(store).execute(id, {
      key: 'gear',
      expectedRevision: 6,
      request: { copyId: 'open0:copy', slot: 'wand', equipmentId: 'starter:wand' },
    });
    await new SetTeamUseCase(store, campaignFixture).execute(id, {
      key: 'bench',
      expectedRevision: 7,
      request: { copyIds: ['open0:copy', 'open1:copy'] },
    });
    const reopenedPool = new Pool(connection);
    try {
      const reopened = new PostgresGameTransactions(reopenedPool),
        current = await reopened.read(id);
      expect(current.team?.loadouts.find((l) => l.copyId === 'open0:copy')?.wandId).toBe(
        'starter:wand',
      );
      expect(current.exploration?.run?.reserves?.[0].unit.mana).toBe(mana);
      await new SetTeamUseCase(reopened, campaignFixture).execute(id, {
        key: 'return',
        expectedRevision: 8,
        request: { copyIds },
      });
      expect((await reopened.read(id)).exploration?.run?.members[0].unit.mana).toBe(mana);
    } finally {
      await reopenedPool.end();
    }
  });
  it('rolls back gear writes and recovers a committed assignment after response loss', async () => {
    const { id, store } = await fixture(),
      before = await store.read(id);
    const command = {
      key: 'gear',
      expectedRevision: 4,
      request: { copyId: 'open0:copy', slot: 'wand' as const, equipmentId: 'starter:wand' },
    };
    await expect(
      new EquipEquipmentUseCase(
        new PostgresGameTransactions(pool, {
          beforeCommit: () => {
            throw Error('failure');
          },
        }),
      ).execute(id, command),
    ).rejects.toThrow('STORAGE');
    expect(await store.read(id)).toEqual(before);
    await expect(
      new EquipEquipmentUseCase(
        new PostgresGameTransactions(pool, {
          afterCommit: () => {
            throw Error('lost');
          },
        }),
      ).execute(id, command),
    ).rejects.toThrow('UNKNOWN_COMMIT');
    const recovered = await new EquipEquipmentUseCase(store).execute(id, command);
    expect(recovered.state.inventory.equipment).toHaveLength(2);
    expect(recovered.receipt).toMatchObject({ kind: 'equip-equipment' });
  });
  it('serializes two team selections using a shared expected revision', async () => {
    const { id, store } = await fixture();
    const results = await Promise.allSettled([
      new SetTeamUseCase(store, campaignFixture).execute(id, {
        key: 'a',
        expectedRevision: 4,
        request: { copyIds: ['open0:copy'] },
      }),
      new SetTeamUseCase(new PostgresGameTransactions(pool), campaignFixture).execute(id, {
        key: 'b',
        expectedRevision: 4,
        request: { copyIds: ['open1:copy'] },
      }),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect((await store.read(id)).revision).toBe(5);
  });
});
