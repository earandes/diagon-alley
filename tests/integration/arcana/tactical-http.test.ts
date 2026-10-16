import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { createClient } from 'redis';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { composeArcanaApi } from '../../../src/arcana/infrastructure/http/composition';
import { ArcanaHttpClient } from '../../../src/arcana/infrastructure/http/client';
import {
  applyGameSchema,
  PostgresGameTransactions,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import type { CampaignConfiguration } from '../../../src/arcana/application/run-use-cases';
import { campaignFixture, runInitial } from '../../domain/arcana/support/run-fixtures';
import { catalogFixture, toadFixture, shopFixture } from '../../domain/arcana/support/fixtures';
import { commerceFixture } from '../../domain/arcana/support/commerce-fixtures';

// Transport/transaction fixtures only; no campaign balance claims or existing accounts.
const pool = new Pool({
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  max: 4,
  connectionTimeoutMillis: 3000,
});
const redis = createClient({
  url: 'redis://127.0.0.1:56379',
  socket: { reconnectStrategy: false },
});
redis.on('error', () => {});
const namespace = 'tactical-http-' + randomUUID(),
  players: string[] = [],
  apps: FastifyInstance[] = [];
const campaign = (): CampaignConfiguration => {
  const base = campaignFixture();
  return {
    ...base,
    ownedAffinities: { merlin: 'alchemy' },
    tacticalContent: {
      version: 1,
      nodes: base.nodes.map((node) =>
        node.kind === 'pact'
          ? {
              ...node,
              recruits: [node.recruit, { ...node.recruit, id: 'alternate', wizardId: 'merlin' }],
            }
          : node,
      ),
    },
  };
};
const compose = (games?: PostgresGameTransactions, configuration = campaign) => {
  const runtime = composeArcanaApi({
    pool,
    redis,
    namespace,
    opening: () => ({
      catalog: catalogFixture,
      table: toadFixture,
      shop: shopFixture,
      commerce: commerceFixture,
    }),
    campaign: configuration,
    policy: { bodyLimit: 16_384, maximumPerIp: 10_000, maximumPerPlayer: 1000, windowMs: 60_000 },
    ...(games ? { games } : {}),
  });
  apps.push(runtime.app);
  return runtime;
};
const provision = async (runtime: ReturnType<typeof compose>) => {
  const id = 'tactical-http-player-' + randomUUID();
  players.push(id);
  await runtime.games.create(runInitial(id));
  const grant = await runtime.authority.issue(id, 60_000);
  return { id, token: grant.token, headers: { authorization: 'Bearer ' + grant.token } };
};
type Player = Awaited<ReturnType<typeof provision>>;
async function post(
  runtime: ReturnType<typeof compose>,
  player: Player,
  url: string,
  payload: unknown,
) {
  return runtime.app.inject({
    method: 'POST',
    url,
    headers: player.headers,
    payload: payload as object,
  });
}
async function start(runtime: ReturnType<typeof compose>, player: Player, key = 'run1') {
  const before = await runtime.games.read(player.id);
  const response = await post(runtime, player, '/api/runs', {
    key,
    expectedRevision: before.revision,
    request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0', 'copy1', 'copy2'] },
  });
  expect(response.statusCode).toBe(200);
  return response.json().state;
}
async function advance(
  runtime: ReturnType<typeof compose>,
  player: Player,
  nodeId: string,
  recruitId?: string,
) {
  const before = await runtime.games.read(player.id);
  const response = await post(runtime, player, '/api/nodes/advance', {
    key: 'move-' + nodeId,
    expectedRevision: before.revision,
    request: {
      runId: before.exploration!.run!.id,
      nodeId,
      campaignVersion: 1,
      assignments: [],
      ...(recruitId ? { recruitId } : {}),
    },
  });
  expect(response.statusCode).toBe(200);
  return response.json().state;
}
async function close(runtime: ReturnType<typeof compose>, player: Player) {
  await start(runtime, player);
  for (const node of ['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss'])
    await advance(runtime, player, node, node === 'pact' ? 'alternate' : undefined);
  return runtime.games.read(player.id);
}
beforeAll(async () => {
  await redis.connect();
  await applyGameSchema(pool);
});
afterAll(async () => {
  await Promise.all(apps.map((app) => app.close()));
  if (players.length)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [players]);
  if (redis.isOpen) {
    const keys = await redis.keys(namespace + ':*');
    if (keys.length) await redis.del(keys);
    await redis.close();
  }
  await pool.end();
});

describe('A65 tactical HTTP contracts with real PostgreSQL and Redis', () => {
  it('rejects unauthenticated, forged extra fields, active and old-source intentions without state changes', async () => {
    const runtime = compose(),
      player = await provision(runtime);
    await start(runtime, player);
    const before = await runtime.games.read(player.id);
    const command = {
      key: 'plan',
      expectedRevision: before.revision,
      request: { afterRunId: 'run1', choice: { kind: 'bean' } },
    };
    expect(
      (await runtime.app.inject({ method: 'POST', url: '/api/intentions', payload: command }))
        .statusCode,
    ).toBe(401);
    for (const payload of [
      { ...command, winner: 'player' },
      { ...command, request: { ...command.request, reward: { crowns: 100 } } },
      { ...command, request: { ...command.request, choice: { kind: 'bean', completed: true } } },
      {
        ...command,
        request: { ...command.request, choice: { kind: 'synergy', affinity: 'neutral' } },
      },
    ])
      expect((await post(runtime, player, '/api/intentions', payload)).statusCode).toBe(400);
    expect((await post(runtime, player, '/api/intentions', command)).statusCode).toBe(422);
    expect(await runtime.games.read(player.id)).toEqual(before);
    for (const node of ['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss'])
      await advance(runtime, player, node, node === 'pact' ? 'alternate' : undefined);
    const closed = await runtime.games.read(player.id);
    const old = await post(runtime, player, '/api/intentions', {
      ...command,
      expectedRevision: closed.revision,
      request: { afterRunId: 'old-run', choice: { kind: 'bean' } },
    });
    expect(old.statusCode).toBe(422);
    expect(await runtime.games.read(player.id)).toEqual(closed);
  });

  it('requires a candidate belonging to that Pact and commits only one competing HTTP selection', async () => {
    const runtime = compose(),
      player = await provision(runtime);
    await start(runtime, player);
    for (const node of ['duel', 'refuge', 'chest']) await advance(runtime, player, node);
    const before = await runtime.games.read(player.id);
    const request = {
      runId: 'run1',
      nodeId: 'pact',
      campaignVersion: 1,
      assignments: [],
      pactAction: 'recruit',
    };
    const command = { key: 'choose', expectedRevision: before.revision, request };
    expect((await post(runtime, player, '/api/nodes/advance', command)).statusCode).toBe(422);
    expect(
      (
        await post(runtime, player, '/api/nodes/advance', {
          ...command,
          request: { ...request, recruitId: 'another-pact:choice:0' },
        })
      ).statusCode,
    ).toBe(422);
    expect(
      (
        await post(runtime, player, '/api/nodes/advance', {
          ...command,
          request: { ...request, recruitId: 'alternate', stats: { power: 999 } },
        })
      ).statusCode,
    ).toBe(400);
    expect(
      (
        await post(runtime, player, '/api/nodes/advance', {
          ...command,
          request: { ...request, recruitId: 'alternate', pactAction: 'pass' },
        })
      ).statusCode,
    ).toBe(422);
    expect(await runtime.games.read(player.id)).toEqual(before);
    const responses = await Promise.all([
      post(runtime, player, '/api/nodes/advance', {
        ...command,
        request: { ...request, recruitId: 'alternate' },
      }),
      post(runtime, player, '/api/nodes/advance', {
        ...command,
        key: 'other-choice',
        request: { ...request, recruitId: 'temporary' },
      }),
    ]);
    expect(responses.map((r) => r.statusCode).sort()).toEqual([200, 409]);
    const result = responses.find((r) => r.statusCode === 200)!.json();
    const stored = await new PostgresGameTransactions(pool).read(player.id);
    expect(stored).toEqual(result.state);
    expect(stored.revision).toBe(before.revision + 1);
    expect(stored.exploration!.run!.members).toHaveLength(4);
    expect(stored.copies).toEqual(before.copies);
    expect(stored.inventory).toEqual(before.inventory);
    const recovered = await runtime.app.inject({
      method: 'GET',
      url: '/api/operations/' + result.receipt.id,
      headers: player.headers,
    });
    expect(recovered.json().receipt).toEqual(result.receipt);
  });

  it('serializes intention commands, replays the same key and rejects changed requests without economic effects', async () => {
    const runtime = compose(),
      player = await provision(runtime),
      before = await close(runtime, player);
    const command = {
      key: 'plan',
      expectedRevision: before.revision,
      request: { afterRunId: 'run1', choice: { kind: 'bean' } },
    };
    const responses = await Promise.all([
      post(runtime, player, '/api/intentions', command),
      post(runtime, player, '/api/intentions', { ...command, key: 'competing-plan' }),
    ]);
    expect(responses.map((r) => r.statusCode).sort()).toEqual([200, 409]);
    const result = responses.find((r) => r.statusCode === 200)!.json();
    const exact = { ...command, key: result.receipt.id };
    const replay = await post(runtime, player, '/api/intentions', exact);
    expect(replay.statusCode).toBe(200);
    expect(replay.json()).toEqual(result);
    const conflict = await post(runtime, player, '/api/intentions', {
      ...exact,
      request: { afterRunId: 'run1', choice: null },
    });
    expect(conflict.statusCode).toBe(409);
    expect(conflict.json().error.code).toBe('OPERATION_CONFLICT');
    const stored = await runtime.games.read(player.id);
    expect(stored.inventory).toEqual(before.inventory);
    expect(stored.copies).toEqual(before.copies);
    expect(stored.exploration!.victories).toEqual(before.exploration!.victories);
    expect(stored.revision).toBe(before.revision + 1);
  });

  it('rolls back a failed candidate save and recovers the committed candidate without granting its sibling', async () => {
    const runtime = compose(),
      player = await provision(runtime);
    await start(runtime, player);
    for (const node of ['duel', 'refuge', 'chest']) await advance(runtime, player, node);
    const before = await runtime.games.read(player.id);
    const command = {
      key: 'lost-candidate',
      expectedRevision: before.revision,
      request: {
        runId: 'run1',
        nodeId: 'pact',
        campaignVersion: 1,
        assignments: [],
        recruitId: 'alternate',
      },
    };
    const rollback = compose(
      new PostgresGameTransactions(pool, {
        beforeCommit: () => {
          throw Error('failed candidate save');
        },
      }),
    );
    const failed = await post(rollback, player, '/api/nodes/advance', command);
    expect(failed.statusCode).toBe(503);
    expect(failed.json().error.code).toBe('STORAGE');
    expect(await runtime.games.read(player.id)).toEqual(before);
    const uncertain = compose(
      new PostgresGameTransactions(pool, {
        afterCommit: () => {
          throw Error('lost candidate response');
        },
      }),
    );
    const lost = await post(uncertain, player, '/api/nodes/advance', command);
    expect(lost.statusCode).toBe(503);
    expect(lost.json().error.code).toBe('UNKNOWN_COMMIT');
    const recovered = await post(runtime, player, '/api/nodes/advance', command);
    expect(recovered.statusCode).toBe(200);
    expect(recovered.json().state.exploration.run.members.at(-1).unit.id).toBe('alternate');
    expect(
      recovered
        .json()
        .state.exploration.run.members.filter(
          (m: { unit: { id: string } }) => m.unit.id === 'temporary',
        ),
    ).toHaveLength(0);
    const other = await post(runtime, player, '/api/nodes/advance', {
      ...command,
      request: { ...command.request, recruitId: 'temporary' },
    });
    expect(other.statusCode).toBe(409);
    expect(other.json().error.code).toBe('OPERATION_CONFLICT');
    const saved = await runtime.games.read(player.id);
    expect(saved.revision).toBe(before.revision + 1);
    expect(saved.inventory).toEqual(before.inventory);
    expect(saved.copies).toEqual(before.copies);
  });

  it('recovers an actual post-COMMIT intention response loss through the typed client and cancels durably', async () => {
    const runtime = compose(),
      player = await provision(runtime),
      before = await close(runtime, player);
    const fault = compose(
      new PostgresGameTransactions(pool, {
        afterCommit: () => {
          throw Error('lost intention response');
        },
      }),
    );
    const command = {
      key: 'lost-plan',
      expectedRevision: before.revision,
      request: { afterRunId: 'run1', choice: { kind: 'bean' as const } },
    };
    const uncertain = await post(fault, player, '/api/intentions', command);
    expect(uncertain.statusCode).toBe(503);
    expect(uncertain.json().error.code).toBe('UNKNOWN_COMMIT');
    const client = new ArcanaHttpClient(
      'http://arcana.test/api',
      () => player.token,
      async (input, init) => {
        const response = await runtime.app.inject({
          method: init!.method as 'GET' | 'POST',
          url: new URL(String(input)).pathname,
          headers: Object.fromEntries(new Headers(init?.headers).entries()),
          ...(init?.body ? { payload: String(init.body) } : {}),
        });
        return new Response(response.body, {
          status: response.statusCode,
          headers: response.headers as Record<string, string>,
        });
      },
    );
    const recovered = await client.operation(command.key);
    expect(recovered.state.exploration!.intention).toMatchObject({
      afterRunId: 'run1',
      runId: null,
      choice: { kind: 'bean' },
    });
    expect((await client.setIntention(command)).receipt).toEqual(recovered.receipt);
    const cancelled = await client.setIntention({
      key: 'cancel-plan',
      expectedRevision: recovered.state.revision,
      request: { afterRunId: 'run1', choice: null },
    });
    expect(cancelled.state.exploration!.intention ?? null).toBeNull();
    expect(cancelled.state.inventory).toEqual(before.inventory);
    expect(
      (await new PostgresGameTransactions(pool).read(player.id)).exploration!.intention ?? null,
    ).toBeNull();
  });

  it('preserves the legacy one-candidate HTTP contract when new tactical content is later available', async () => {
    const legacy = compose(undefined, campaignFixture),
      player = await provision(legacy);
    await start(legacy, player);
    const updated = compose();
    for (const node of ['duel', 'refuge', 'chest']) await advance(updated, player, node);
    const before = await updated.games.read(player.id);
    expect(before.exploration!.run!.campaignSnapshot).toBeUndefined();
    const foreign = await post(updated, player, '/api/nodes/advance', {
      key: 'forged-new-content',
      expectedRevision: before.revision,
      request: {
        runId: 'run1',
        nodeId: 'pact',
        campaignVersion: 1,
        assignments: [],
        recruitId: 'alternate',
      },
    });
    expect(foreign.statusCode).toBe(422);
    expect(await updated.games.read(player.id)).toEqual(before);
    await advance(updated, player, 'pact');
    const saved = await updated.games.read(player.id);
    expect(saved.exploration!.run!.members.at(-1)!.unit.id).toBe('temporary');
    expect(saved.inventory).toEqual(before.inventory);
  });
});
