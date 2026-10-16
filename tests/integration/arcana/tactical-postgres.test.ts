import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { beforeAll, afterAll, it, expect } from 'vitest';
import {
  applyGameSchema,
  PostgresGameTransactions,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import {
  StartRunUseCase,
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
  type CampaignConfiguration,
} from '../../../src/arcana/application/run-use-cases';
import { SetIntentionUseCase } from '../../../src/arcana/application/set-intention';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { campaignFixture, runInitial } from '../../domain/arcana/support/run-fixtures';
const connection = {
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  max: 4,
};
const pool = new Pool(connection),
  players: string[] = [];
const random = { fromSeed: (seed: number) => new SeededRandom(seed) },
  seeds = { next: () => 42 };
const config = (): CampaignConfiguration => {
  const c = campaignFixture();
  return {
    ...c,
    tacticalContent: {
      version: 1,
      nodes: c.nodes.map((p) =>
        p.kind === 'pact'
          ? { ...p, recruits: [p.recruit, { ...p.recruit, id: 'alternate', wizardId: 'merlin' }] }
          : p,
      ),
    },
  };
};
const cases = (
  store: PostgresGameTransactions,
  configuration: () => CampaignConfiguration = config,
) => ({
  start: new StartRunUseCase(store, configuration),
  advance: new AdvanceNodeUseCase(
    store,
    configuration,
    new ResolveCombatUseCase(new CombatEngine(random), seeds),
    { now: async () => 0 },
    random,
    seeds,
  ),
  intention: new SetIntentionUseCase(store, () => ({
    ownedAffinities: { merlin: 'alchemy' },
    beanPrice: 5,
  })),
});
beforeAll(() => applyGameSchema(pool));
afterAll(async () => {
  await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [players]);
  await pool.end();
});
async function setup(legacy = false) {
  const id = 'tactical-' + randomUUID();
  players.push(id);
  const store = new PostgresGameTransactions(pool);
  await store.create(runInitial(id));
  const c = cases(store, legacy ? campaignFixture : config);
  await c.start.execute(id, {
    key: 'run1',
    expectedRevision: 1,
    request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0', 'copy1', 'copy2'] },
  });
  return { id, store, ...c };
}
async function move(
  s: Awaited<ReturnType<typeof setup>>,
  nodeId: string,
  extra: Record<string, string> = {},
) {
  const state = await s.store.read(s.id);
  return s.advance.execute(s.id, {
    key: nodeId,
    expectedRevision: state.revision,
    request: { runId: 'run1', nodeId, campaignVersion: 1, assignments: [], ...extra },
  });
}
it('legacy active runs retain single recruitment when new content becomes available; first victory keys do not change', async () => {
  const s = await setup(true);
  const updated = { ...s, ...cases(s.store) };
  for (const node of ['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss'])
    await move(updated, node);
  const closed = await s.store.read(s.id);
  expect(closed.exploration!.run!.campaignSnapshot).toBeUndefined();
  expect(closed.inventory.goldKeys).toBe(1);
  await updated.start.execute(s.id, {
    key: 'run2',
    expectedRevision: closed.revision,
    request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0', 'copy1', 'copy2'] },
  });
  let state = await s.store.read(s.id);
  expect(state.exploration!.run!.tacticalVersion).toBe(1);
  for (const nodeId of ['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss']) {
    state = await s.store.read(s.id);
    const result = await updated.advance.execute(s.id, {
      key: 'repeat-' + nodeId,
      expectedRevision: state.revision,
      request: {
        runId: 'run2',
        nodeId,
        campaignVersion: 1,
        assignments: [],
        ...(nodeId === 'pact' ? { recruitId: 'alternate' } : {}),
      },
    });
    if (nodeId === 'boss') {
      expect(result.receipt).toMatchObject({
        firstVictory: false,
        reward: { goldKeys: 0, products: [] },
      });
    }
  }
  expect((await s.store.read(s.id)).inventory.goldKeys).toBe(1);
});
it('new offers are immutable across pools, reject missing/foreign choices, serialize competing choices and recover commit loss', async () => {
  const s = await setup();
  for (const node of ['duel', 'refuge', 'chest']) await move(s, node);
  const before = await s.store.read(s.id),
    request = {
      runId: 'run1',
      nodeId: 'pact',
      campaignVersion: 1,
      assignments: [],
      recruitId: 'alternate',
    };
  await expect(
    s.advance.execute(s.id, {
      key: 'bad',
      expectedRevision: before.revision,
      request: { ...request, recruitId: 'foreign' },
    }),
  ).rejects.toMatchObject({ code: 'INVALID_OPERATION' });
  const rollback = cases(
    new PostgresGameTransactions(pool, {
      beforeCommit: () => {
        throw Error('fail');
      },
    }),
  );
  await expect(
    rollback.advance.execute(s.id, { key: 'pick', expectedRevision: before.revision, request }),
  ).rejects.toMatchObject({ code: 'STORAGE' });
  expect(await s.store.read(s.id)).toEqual(before);
  const uncertain = cases(
    new PostgresGameTransactions(pool, {
      afterCommit: () => {
        throw Error('lost');
      },
    }),
  );
  await expect(
    uncertain.advance.execute(s.id, { key: 'pick', expectedRevision: before.revision, request }),
  ).rejects.toMatchObject({ code: 'UNKNOWN_COMMIT' });
  const reopened = new Pool(connection);
  try {
    const store = new PostgresGameTransactions(reopened),
      recovery = cases(store, () => {
        throw Error('no live config');
      });
    const result = await recovery.advance.execute(s.id, {
      key: 'pick',
      expectedRevision: before.revision,
      request,
    });
    expect(result.state.exploration!.run!.members.at(-1)!.unit.id).toBe('alternate');
    expect(result.state.copies).toEqual(before.copies);
    expect(result.state.inventory).toEqual(before.inventory);
    await expect(
      s.advance.execute(s.id, {
        key: 'other',
        expectedRevision: before.revision,
        request: { ...request, recruitId: 'temporary' },
      }),
    ).rejects.toMatchObject({ code: 'STALE_GAME' });
    await expect(
      recovery.advance.execute(s.id, {
        key: 'pick',
        expectedRevision: before.revision,
        request: { ...request, recruitId: 'temporary' },
      }),
    ).rejects.toMatchObject({ code: 'OPERATION_CONFLICT' });
    expect(await store.read(s.id)).toEqual(result.state);
  } finally {
    await reopened.end();
  }
});
it('intentions persist, recover and bind to exactly one explicit new expedition with no inventory changes', async () => {
  const s = await setup();
  for (const node of ['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss'])
    await move(s, node, node === 'pact' ? { recruitId: 'alternate' } : {});
  const before = await s.store.read(s.id),
    command = {
      key: 'intent',
      expectedRevision: before.revision,
      request: { afterRunId: 'run1', choice: { kind: 'bean' as const } },
    };
  const fault = cases(
    new PostgresGameTransactions(pool, {
      afterCommit: () => {
        throw Error('lost');
      },
    }),
  );
  await expect(fault.intention.execute(s.id, command)).rejects.toMatchObject({
    code: 'UNKNOWN_COMMIT',
  });
  const reopened = new Pool(connection);
  try {
    const store = new PostgresGameTransactions(reopened),
      c = cases(store),
      saved = await c.intention.execute(s.id, command);
    expect(saved.state.inventory).toEqual(before.inventory);
    expect(saved.state.exploration!.intention).toMatchObject({
      runId: null,
      choice: { kind: 'bean' },
    });
    await c.start.execute(s.id, {
      key: 'next',
      expectedRevision: saved.state.revision,
      request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0', 'copy1', 'copy2'] },
    });
    const active = await store.read(s.id);
    expect(active.exploration!.intention).toMatchObject({ runId: 'next' });
    const cancelled = await c.intention.execute(s.id, {
      key: 'cancel',
      expectedRevision: active.revision,
      request: { afterRunId: 'run1', choice: null },
    });
    expect(cancelled.state.exploration!.intention ?? null).toBeNull();
    expect(cancelled.state.inventory).toEqual(before.inventory);
  } finally {
    await reopened.end();
  }
});
