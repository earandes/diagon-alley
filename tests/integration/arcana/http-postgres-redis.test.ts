import { commerceFixture } from '../../domain/arcana/support/commerce-fixtures';
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
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { campaignFixture, runInitial } from '../../domain/arcana/support/run-fixtures';
import { catalogFixture, toadFixture, shopFixture } from '../../domain/arcana/support/fixtures';
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
const namespace = 'http-test-' + randomUUID(),
  players: string[] = [],
  apps: FastifyInstance[] = [];
const opening = () => ({
  catalog: catalogFixture,
  table: toadFixture,
  shop: shopFixture,
  commerce: commerceFixture,
});
const policy = { bodyLimit: 16_384, maximumPerIp: 1000, maximumPerPlayer: 500, windowMs: 60_000 };
const compose = (limits = policy, games?: PostgresGameTransactions) => {
  const runtime = composeArcanaApi({
    pool,
    redis,
    namespace,
    opening,
    campaign: campaignFixture,
    policy: limits,
    ...(games ? { games } : {}),
  });
  apps.push(runtime.app);
  return runtime;
};
const provision = async (runtime: ReturnType<typeof composeArcanaApi>) => {
  const id = 'http-player-' + randomUUID();
  players.push(id);
  await runtime.games.create(runInitial(id));
  const grant = await runtime.authority.issue(id, 60_000);
  return { id, headers: { authorization: `Bearer ${grant.token}` }, token: grant.token };
};
beforeAll(async () => {
  await redis.connect();
  await applyGameSchema(pool);
});
afterAll(async () => {
  await Promise.all(apps.map((app) => app.close()));
  if (players.length)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [players]);
  if (redis.isOpen) {
    const keys = await redis.keys(`${namespace}:*`);
    if (keys.length) await redis.del(keys);
    await redis.close();
  }
  await pool.end();
});
const start = {
  key: 'start',
  expectedRevision: 1,
  request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0', 'copy1', 'copy2'] },
};
const advance = {
  key: 'duel',
  expectedRevision: 2,
  request: { runId: 'start', nodeId: 'duel', campaignVersion: 1, assignments: [] },
};
describe('ARCANA composed HTTP authority with real PostgreSQL and Redis', () => {
  it('buys-opens via typed HTTP client with one SQL revision and replayable operation', async () => {
    const runtime = compose(),
      player = await provision(runtime);
    const client = new ArcanaHttpClient(
      'http://arcana.test/api',
      () => player.token,
      async (input, init) => {
        const result = await runtime.app.inject({
          method: init!.method as 'GET' | 'POST',
          url: new URL(String(input)).pathname,
          headers: Object.fromEntries(new Headers(init?.headers).entries()),
          ...(init?.body ? { payload: String(init.body) } : {}),
        });
        return new Response(result.body, {
          status: result.statusCode,
          headers: result.headers as Record<string, string>,
        });
      },
    );
    await client.state();
    const command = {
      key: 'atomic',
      expectedRevision: 1,
      request: { priceVersion: 1, catalogVersion: 1, tableVersion: 1 },
    };
    const result = await client.buyOpenToad(command);
    expect(result.state.revision).toBe(2);
    expect(result.state.inventory.crowns).toBe(40);
    expect(result.receipt).toMatchObject({ kind: 'buy-open-toad', spentCrowns: 10 });
    expect((await client.buyOpenToad(command)).receipt).toEqual(result.receipt);
    expect((await client.operation('atomic')).receipt).toEqual(result.receipt);
    const stored = await runtime.games.read(player.id);
    expect(stored.revision).toBe(2);
    expect(stored.copies).toHaveLength(4);
    expect(stored.receipts).toHaveLength(1);
    expect(stored.inventory.products[0].status).toBe('consumed');
  });

  it('composes authenticated forge and key exchange with real SQL and Redis', async () => {
    const runtime = compose(),
      player = await provision(runtime);
    await runtime.games.transact(player.id, (state) => ({
      ...state,
      revision: state.revision + 1,
      inventory: { ...state.inventory, goldKeys: 1 },
    }));
    const content = await runtime.app.inject({
      method: 'GET',
      url: '/api/content',
      headers: player.headers,
    });
    expect(content.json().commerce.forge.recipes).toHaveLength(1);
    const forge = await runtime.app.inject({
      method: 'POST',
      url: '/api/wands/forge',
      headers: player.headers,
      payload: {
        key: 'forge',
        expectedRevision: 2,
        request: { recipeId: 'birch-dragon', catalogVersion: 1 },
      },
    });
    expect(forge.statusCode).toBe(200);
    expect(forge.json().state.inventory.crowns).toBe(35);
    const request = { key: 'vault', expectedRevision: 3, request: { tableVersion: 1 } };
    const vault = await runtime.app.inject({
      method: 'POST',
      url: '/api/vaults/open',
      headers: player.headers,
      payload: request,
    });
    expect(vault.statusCode).toBe(200);
    expect(vault.json().state.inventory.goldKeys).toBe(0);
    expect(vault.json().state.inventory.equipment).toHaveLength(2);
    const replay = await runtime.app.inject({
      method: 'POST',
      url: '/api/vaults/open',
      headers: player.headers,
      payload: request,
    });
    expect(replay.json().receipt).toEqual(vault.json().receipt);
    expect(await new PostgresGameTransactions(pool).read(player.id)).toEqual(vault.json().state);
  });
  it('uses Redis TIME to project regeneration while PostgreSQL reserve and revision remain unchanged', async () => {
    const runtime = compose(),
      player = await provision(runtime),
      now = await runtime.authority.now();
    await runtime.games.transact(player.id, (state) => ({
      ...state,
      revision: state.revision + 1,
      inventory: { ...state.inventory, essence: { points: 4, cursor: now - 720_000 } },
    }));
    const before = await runtime.games.read(player.id);
    for (let query = 0; query < 2; query++) {
      const response = await runtime.app.inject({
        method: 'GET',
        url: '/api/state',
        headers: player.headers,
      });
      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        state: before,
        energy: { points: 5, maximum: 50, combatCost: 5, nextPointAt: now + 720_000 },
      });
      expect(response.json().serverTime).toBeGreaterThanOrEqual(now);
    }
    expect(await new PostgresGameTransactions(pool).read(player.id)).toEqual(before);
  });
  it('executes run→server battle→reward→purchase→opening and reproduces its persisted seed log', async () => {
    const runtime = compose(),
      player = await provision(runtime),
      before = await runtime.authority.now();
    const state = await runtime.app.inject({
      method: 'GET',
      url: '/api/state',
      headers: player.headers,
    });
    expect(state.statusCode).toBe(200);
    expect(state.json().serverTime).toBeGreaterThanOrEqual(before);
    const forged = await runtime.app.inject({
      method: 'POST',
      url: '/api/nodes/advance',
      headers: player.headers,
      payload: { ...advance, request: { ...advance.request, seed: 1, winner: 'player' } },
    });
    expect(forged.statusCode).toBe(400);
    expect(
      (
        await runtime.app.inject({
          method: 'POST',
          url: '/api/runs',
          headers: player.headers,
          payload: start,
        })
      ).statusCode,
    ).toBe(200);
    const result = await runtime.app.inject({
      method: 'POST',
      url: '/api/nodes/advance',
      headers: player.headers,
      payload: advance,
    });
    expect(result.statusCode).toBe(200);
    const battle = result.json().receipt.battle;
    expect(battle.outcome).toBe('player');
    expect(Number.isInteger(battle.input.seed)).toBe(true);
    expect(
      new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) }).resolve(battle.input),
    ).toEqual(battle);
    const committed = await runtime.games.read(player.id);
    expect(committed.inventory.essence.points).toBe(45);
    expect(committed.inventory.essence.cursor).toBeGreaterThanOrEqual(before);
    expect(committed.inventory.crowns).toBe(150);
    const purchase = {
      key: 'buy',
      expectedRevision: 3,
      request: { product: 'cacao-toad', quantity: 1, priceVersion: 1 },
    };
    expect(
      (
        await runtime.app.inject({
          method: 'POST',
          url: '/api/purchases',
          headers: player.headers,
          payload: purchase,
        })
      ).statusCode,
    ).toBe(200);
    const open = {
      key: 'open',
      expectedRevision: 4,
      request: { unitId: 'buy:0', catalogVersion: 1, tableVersion: 1 },
    };
    const opened = await runtime.app.inject({
      method: 'POST',
      url: '/api/toads/open',
      headers: player.headers,
      payload: open,
    });
    expect(opened.statusCode).toBe(200);
    const recovered = await runtime.app.inject({
      method: 'GET',
      url: '/api/operations/open',
      headers: player.headers,
    });
    expect(recovered.json()).toEqual(opened.json());
    expect((await runtime.games.read(player.id)).copies).toHaveLength(4);
  });
  it('isolates states and operation recovery by Redis session, and revokes one session only', async () => {
    const runtime = compose(),
      first = await provision(runtime),
      second = await provision(runtime);
    const buy = {
      key: 'buy',
      expectedRevision: 1,
      request: { product: 'cacao-toad', quantity: 1, priceVersion: 1 },
    };
    await runtime.app.inject({
      method: 'POST',
      url: '/api/purchases',
      headers: first.headers,
      payload: buy,
    });
    expect(
      (
        await runtime.app.inject({
          method: 'GET',
          url: '/api/operations/buy',
          headers: second.headers,
        })
      ).statusCode,
    ).toBe(404);
    const state = await runtime.app.inject({
      method: 'GET',
      url: '/api/state',
      headers: second.headers,
    });
    expect(state.json().state.playerId).toBe(second.id);
    expect(state.json().state.inventory.crowns).toBe(50);
    expect(
      (await runtime.app.inject({ method: 'DELETE', url: '/api/session', headers: first.headers }))
        .statusCode,
    ).toBe(204);
    expect(await runtime.authority.resolve(first.token)).toBe(null);
    expect(await runtime.authority.resolve(second.token)).toBe(second.id);
  });
  it('serializes competing HTTP commands and recovers an actual post-COMMIT response loss', async () => {
    const runtime = compose(),
      player = await provision(runtime);
    await runtime.app.inject({
      method: 'POST',
      url: '/api/runs',
      headers: player.headers,
      payload: start,
    });
    const results = await Promise.all([
      runtime.app.inject({
        method: 'POST',
        url: '/api/nodes/advance',
        headers: player.headers,
        payload: advance,
      }),
      runtime.app.inject({
        method: 'POST',
        url: '/api/nodes/advance',
        headers: player.headers,
        payload: { ...advance, key: 'competing' },
      }),
    ]);
    expect(results.map((r) => r.statusCode).sort()).toEqual([200, 409]);
    const lost = compose(
      policy,
      new PostgresGameTransactions(pool, {
        afterCommit: () => {
          throw Error('lost HTTP response');
        },
      }),
    );
    const purchase = {
      key: 'buy',
      expectedRevision: 3,
      request: { product: 'cacao-toad', quantity: 1, priceVersion: 1 },
    };
    const uncertain = await lost.app.inject({
      method: 'POST',
      url: '/api/purchases',
      headers: player.headers,
      payload: purchase,
    });
    expect(uncertain.statusCode).toBe(503);
    expect(uncertain.json().error).toEqual({ code: 'UNKNOWN_COMMIT', recoverWithSameKey: true });
    const recovered = await runtime.app.inject({
      method: 'POST',
      url: '/api/purchases',
      headers: player.headers,
      payload: purchase,
    });
    expect(recovered.statusCode).toBe(200);
    expect(recovered.json().state.inventory.crowns).toBe(140);
  });
  it('uses real Redis rate counters to reject an over-limit authenticated request', async () => {
    const runtime = compose({ ...policy, maximumPerPlayer: 1 }),
      player = await provision(runtime);
    expect(
      (await runtime.app.inject({ method: 'GET', url: '/api/state', headers: player.headers }))
        .statusCode,
    ).toBe(200);
    const result = await runtime.app.inject({
      method: 'GET',
      url: '/api/state',
      headers: player.headers,
    });
    expect(result.statusCode).toBe(429);
    expect(Number(result.headers['retry-after'])).toBeGreaterThan(0);
  });
  it('serves confirmed state over an actual loopback TCP socket and closes it', async () => {
    const runtime = compose(),
      player = await provision(runtime);
    const address = await runtime.app.listen({ host: '127.0.0.1', port: 0 });
    try {
      const response = await fetch(`${address}/api/state`, { headers: player.headers });
      expect(response.status).toBe(200);
      expect((await response.json()).state.playerId).toBe(player.id);
      expect(response.headers.get('cache-control')).toBe('no-store');
      const client = new ArcanaHttpClient(`${address}/api`, () => player.token);
      expect((await client.state()).state.playerId).toBe(player.id);
      expect((await client.content()).catalog.version).toBe(1);
      const result = await client.purchase({
        key: 'socket-buy',
        expectedRevision: 1,
        request: { product: 'cacao-toad', quantity: 1, priceVersion: 1 },
      });
      expect(result.state.inventory.crowns).toBe(40);
      expect(await client.operation('socket-buy')).toEqual(result);
    } finally {
      await runtime.app.close();
    }
  });
});

describe('ARCANA composed starter, team and equipment API', () => {
  it('keeps the starter singular while buying recruits, equipping and forming a valid server battle', async () => {
    const runtime = compose(),
      id = 'starter-http-' + randomUUID();
    players.push(id);
    const { InitializePlayerUseCase } = await import(
      '../../../src/arcana/application/team-use-cases'
    );
    const apprentice = {
      ...catalogFixture.wizards[0],
      id: 'apprentice-alchemy',
      name: { es: 'Aprendiz de Alquimia', en: 'Alchemy Apprentice' },
    };
    await new InitializePlayerUseCase(
      runtime.games,
      () => ({ catalog: { version: 1, wizards: [apprentice] }, apprenticeId: apprentice.id }),
      runtime.authority,
    ).execute(id);
    const grant = await runtime.authority.issue(id, 60_000),
      client = new ArcanaHttpClient(
        'http://127.0.0.1/api',
        () => grant.token,
        async (input, init) => {
          const headers = Object.fromEntries(new Headers(init?.headers).entries());
          const result = await runtime.app.inject({
            method: init!.method as 'GET' | 'POST' | 'DELETE',
            url: new URL(String(input)).pathname,
            headers,
            ...(init?.body ? { payload: String(init.body) } : {}),
          });
          return new Response(result.statusCode === 204 ? null : result.body, {
            status: result.statusCode,
            headers: result.headers as Record<string, string>,
          });
        },
      );
    await client.purchase({
      key: 'buy',
      expectedRevision: 1,
      request: { product: 'cacao-toad', quantity: 2, priceVersion: 1 },
    });
    for (let i = 0; i < 2; i++)
      await client.openToad({
        key: `open${i}`,
        expectedRevision: 2 + i,
        request: { unitId: `buy:${i}`, catalogVersion: 1, tableVersion: 1 },
      });
    const copyIds = ['starter:apprentice', 'open0:copy', 'open1:copy'];
    await client.setTeam({ key: 'team', expectedRevision: 4, request: { copyIds } });
    await client.equipEquipment({
      key: 'wand',
      expectedRevision: 5,
      request: { copyId: 'open0:copy', slot: 'wand', equipmentId: 'starter:wand' },
    });
    await client.startRun({
      key: 'start',
      expectedRevision: 6,
      request: { zoneId: 'bulevar', campaignVersion: 1, copyIds },
    });
    const battle = await client.advanceNode({
      key: 'duel',
      expectedRevision: 7,
      request: { runId: 'start', nodeId: 'duel', campaignVersion: 1, assignments: [] },
    });
    expect(battle.receipt).toMatchObject({ kind: 'advance-node', battle: { outcome: 'player' } });
    expect(battle.state.copies.filter((c) => c.sourceId === 'starter-kit')).toHaveLength(1);
    expect(battle.state.inventory.equipment).toHaveLength(2);
    expect(battle.state.inventory.crowns).toBe(130);
    expect(
      battle.state.exploration?.run?.members.find((m) => m.unit.id === 'open0:copy')?.unit
        .wandPowerBonus,
    ).toBe(2);
  });
});
