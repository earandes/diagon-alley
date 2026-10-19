import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { createClient } from 'redis';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { composeArcanaApi } from '../../../src/arcana/infrastructure/http/composition';
import {
  applyGameSchema,
  PostgresGameTransactions,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { SetIntentionUseCase } from '../../../src/arcana/application/set-intention';
import {
  StartRunUseCase,
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
} from '../../../src/arcana/application/run-use-cases';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { intentionProgress } from '../../../src/arcana/application/client/expedition-intentions';
import { battleFacts } from '../../../src/arcana/application/client/battle-facts';
import { gameSnapshot } from '../../../src/arcana/application/game';
import { runInitial, campaignFixture } from '../../domain/arcana/support/run-fixtures';

const pool = new Pool({
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  max: 3,
  connectionTimeoutMillis: 3000,
});
const redis = createClient({
  url: 'redis://127.0.0.1:56379',
  socket: { reconnectStrategy: false },
});
redis.on('error', () => {});
const namespace = `a89-company-${randomUUID()}`,
  ids: string[] = [],
  runtimes: ReturnType<typeof composeArcanaApi>[] = [];
const trial = trialConfiguration(),
  fixture = campaignFixture();
// Declared campaign fixture keeps real modern rules and copies, with deterministic low-stat rivals.
const campaign = {
  ...fixture,
  combatRules: trial.campaign.combatRules,
  ownedAffinities: trial.campaign.ownedAffinities,
  prepareOwned: trial.campaign.prepareOwned,
  tacticalContent: { version: 4 as const, nodes: fixture.nodes },
};
const availability = {
  combatRules: campaign.combatRules,
  ownedAffinities: campaign.ownedAffinities!,
  beanPrice: 5,
};
const choice = { kind: 'company', focus: 'house', house: 'gryffindor' } as const;
beforeAll(async () => {
  await redis.connect();
  await applyGameSchema(pool);
});
afterAll(async () => {
  for (const runtime of runtimes) await runtime.app.close();
  if (ids.length)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [ids]);
  if (redis.isOpen) {
    const keys = await redis.keys(`${namespace}:*`);
    if (keys.length) await redis.del(keys);
    await redis.close();
  }
  await pool.end();
});
async function setup() {
  const id = `a89-company-${randomUUID()}`;
  ids.push(id);
  const store = new PostgresGameTransactions(pool),
    base = runInitial(id);
  const wizardIds = Object.entries(campaign.combatRules.houseMembers!)
    .filter(([, h]) => h === 'gryffindor')
    .slice(0, 3)
    .map(([wizardId]) => wizardId);
  const copies = wizardIds.map((wizardId, i) => ({
    ...base.copies[i],
    wizard: trial.opening.catalog.wizards.find((w) => w.id === wizardId)!,
  }));
  const initial = gameSnapshot({
    ...base,
    copies,
    exploration: {
      run: {
        id: 'prior-run',
        campaignVersion: 1,
        zoneId: fixture.zoneId,
        graphVersion: 1,
        graph: fixture.graph,
        visited: fixture.graph.nodes.map((n) => n.id),
        status: 'won',
        members: copies.map((c) => ({ source: 'owned', unit: campaign.prepareOwned(c) })),
      },
      victories: [],
      unlockedZones: [fixture.zoneId],
    },
  });
  await store.create(initial);
  return {
    id,
    store,
    initial,
    command: {
      key: 'company-choice',
      expectedRevision: 1,
      request: { afterRunId: 'prior-run', choice },
    },
  };
}

it('stores company v2 through Redis-authenticated HTTP, blocks malformed payload and resolves one concurrent tab', async () => {
  const s = await setup();
  const runtime = composeArcanaApi({
    pool,
    redis,
    namespace,
    opening: () => trial.opening,
    campaign: () => campaign,
    policy: { bodyLimit: 16384, maximumPerIp: 1000, maximumPerPlayer: 1000, windowMs: 60000 },
  });
  runtimes.push(runtime);
  const grant = await runtime.authority.issue(s.id, 60000),
    headers = { authorization: `Bearer ${grant.token}` };
  const post = (payload: unknown) =>
    runtime.app.inject({
      method: 'POST',
      url: '/api/intentions',
      headers,
      payload: payload as object,
    });
  expect(
    (
      await post({
        ...s.command,
        request: { ...s.command.request, choice: { ...choice, completed: true } },
      })
    ).statusCode,
  ).toBe(400);
  const commands = [s.command, { ...s.command, key: 'other-tab' }];
  const results = await Promise.all(commands.map((command) => post(command)));
  expect(results.map((r) => r.statusCode).sort()).toEqual([200, 409]);
  const state = await new PostgresGameTransactions(pool).read(s.id);
  expect(state.exploration!.intention).toMatchObject({ version: 2, choice, runId: null });
  expect(state.inventory).toEqual(s.initial.inventory);
  expect(state.copies).toEqual(s.initial.copies);
  const winningCommand = commands[results.findIndex((result) => result.statusCode === 200)];
  expect((await post(winningCommand)).json().state).toEqual(state);
  const recovered = await runtime.app.inject({
    method: 'GET',
    url: `/api/operations/${winningCommand.key}`,
    headers,
  });
  expect(recovered.statusCode).toBe(200);
  expect(recovered.json().receipt.id).toBe(winningCommand.key);
  const other = await setup(),
    otherSession = await runtime.authority.issue(other.id, 60000);
  const unavailable = await runtime.app.inject({
    method: 'GET',
    url: `/api/operations/${winningCommand.key}`,
    headers: { authorization: `Bearer ${otherSession.token}` },
  });
  expect(unavailable.statusCode).not.toBe(200);
});

it('recovers a committed v2 choice after response loss, rejects key reuse, and rolls back before commit', async () => {
  const s = await setup();
  const uncertain = new PostgresGameTransactions(pool, {
    afterCommit: () => {
      throw Error('lost-response');
    },
  });
  await expect(
    new SetIntentionUseCase(uncertain, () => availability).execute(s.id, s.command),
  ).rejects.toThrow('UNKNOWN_COMMIT');
  const recovered = await new SetIntentionUseCase(s.store, () => {
    throw Error('recovery must not require new content');
  }).execute(s.id, s.command);
  expect(recovered.state.exploration!.intention).toMatchObject({ version: 2, choice });
  expect(recovered.state.inventory).toEqual(s.initial.inventory);
  await expect(
    new SetIntentionUseCase(s.store, () => availability).execute(s.id, {
      ...s.command,
      request: { ...s.command.request, choice: null },
    }),
  ).rejects.toThrow('OPERATION_CONFLICT');
  const before = await s.store.read(s.id);
  const failing = new PostgresGameTransactions(pool, {
    beforeCommit: () => {
      throw Error('abort');
    },
  });
  await expect(
    new SetIntentionUseCase(failing, () => availability).execute(s.id, {
      key: 'cancel',
      expectedRevision: before.revision,
      request: { afterRunId: 'prior-run', choice: null },
    }),
  ).rejects.toThrow('STORAGE');
  expect(await s.store.read(s.id)).toEqual(before);
});

it('binds one next expedition and derives completion and matching facts from its persisted BattleLog', async () => {
  const s = await setup();
  await new SetIntentionUseCase(s.store, () => availability).execute(s.id, s.command);
  const start = new StartRunUseCase(s.store, () => campaign);
  const begun = await start.execute(s.id, {
    key: 'next-run',
    expectedRevision: 2,
    request: {
      zoneId: campaign.zoneId,
      campaignVersion: 1,
      copyIds: s.initial.copies.map((c) => c.copyId),
      bondFocus: 'houses',
    },
  });
  expect(begun.state.exploration!.intention).toMatchObject({ version: 2, runId: 'next-run' });
  expect(intentionProgress(begun.state)?.status).toBe('active');
  const random = { fromSeed: (seed: number) => new SeededRandom(seed) },
    seeds = { next: () => 1 };
  const advance = new AdvanceNodeUseCase(
    s.store,
    () => campaign,
    new ResolveCombatUseCase(new CombatEngine(random), seeds),
    { now: async () => 0 },
    random,
    seeds,
  );
  const result = await advance.execute(s.id, {
    key: 'actual-battle',
    expectedRevision: 3,
    request: { runId: 'next-run', nodeId: 'duel', campaignVersion: 1, assignments: [] },
  });
  const reloaded = await new PostgresGameTransactions(pool).read(s.id);
  expect(intentionProgress(reloaded)).toMatchObject({
    status: 'completed',
    evidenceReceiptId: 'actual-battle',
  });
  expect(result.receipt.kind).toBe('advance-node');
  if (result.receipt.kind !== 'advance-node') throw Error('battle receipt missing');
  expect(battleFacts(result.receipt.battle, choice)[0]).toMatchObject({
    kind: 'house',
    house: 'gryffindor',
    members: 3,
  });
  expect(
    await advance.execute(s.id, {
      key: 'actual-battle',
      expectedRevision: 3,
      request: { runId: 'next-run', nodeId: 'duel', campaignVersion: 1, assignments: [] },
    }),
  ).toEqual(result);
  expect((await s.store.read(s.id)).receipts.filter((r) => r.id === 'actual-battle')).toHaveLength(
    1,
  );
});
