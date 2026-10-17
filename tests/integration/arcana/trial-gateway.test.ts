import { CryptoBattleSeeds } from '../../../src/arcana/infrastructure/random/crypto-random';
import { routePath } from '../../support/arcana-route';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { createClient } from 'redis';
import { beforeAll, afterAll, describe, it, expect, vi } from 'vitest';
import { composeArcanaApi } from '../../../src/arcana/infrastructure/http/composition';
import { createTrialGateway } from '../../../src/arcana/infrastructure/http/trial-gateway';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { InitializePlayerUseCase } from '../../../src/arcana/application/team-use-cases';
import { applyGameSchema } from '../../../src/arcana/infrastructure/postgres/game-transactions';
const pool = new Pool({
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  connectionTimeoutMillis: 3000,
});
const redis = createClient({
  url: 'redis://127.0.0.1:56379',
  socket: { reconnectStrategy: false },
});
redis.on('error', () => {});
const namespace = 'trial-test-' + randomUUID(),
  players: string[] = [],
  origin = 'http://127.0.0.1:5189',
  config = trialConfiguration();
const runtime = composeArcanaApi({
  pool,
  redis,
  namespace,
  opening: () => config.opening,
  campaign: () => config.campaign,
  policy: { bodyLimit: 16384, maximumPerIp: 1000, maximumPerPlayer: 500, windowMs: 60000 },
});
const initializer = new InitializePlayerUseCase(
  runtime.games,
  () => config.starter,
  runtime.authority,
);
const gateway = createTrialGateway({
  api: runtime.app,
  authority: runtime.authority,
  initialize: async (id: string) => {
    players.push(id);
    return initializer.execute(id);
  },
  origin,
});
beforeAll(async () => {
  await redis.connect();
  await applyGameSchema(pool);
});
afterAll(async () => {
  await gateway.close();
  await runtime.app.close();
  if (players.length)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [players]);
  const keys = await redis.keys(namespace + ':*');
  if (keys.length) await redis.del(keys);
  await redis.close();
  await pool.end();
});
const create = () =>
  gateway.inject({ method: 'POST', url: '/api/trial/session', headers: { origin }, payload: {} });
const cookie = (response: Awaited<ReturnType<typeof create>>) =>
  String(response.headers['set-cookie']).split(';')[0];
describe('local trial cookie gateway with authoritative SQL/Redis', () => {
  it('requires explicit same-origin empty POST and never accepts a player identity', async () => {
    expect((await gateway.inject({ method: 'GET', url: '/api/trial/session' })).statusCode).toBe(
      404,
    );
    expect(
      (
        await gateway.inject({
          method: 'POST',
          url: '/api/trial/session',
          headers: { origin: 'https://foreign.example' },
          payload: {},
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await gateway.inject({
          method: 'POST',
          url: '/api/trial/session',
          headers: { origin },
          payload: { playerId: 'forged' },
        })
      ).statusCode,
    ).toBe(400);
    expect((await gateway.inject({ method: 'GET', url: '/api/state' })).statusCode).toBe(401);
  });
  it('creates opaque HttpOnly session and recovers the same account/kit on reentry', async () => {
    const created = await create();
    expect(created.statusCode).toBe(204);
    expect(created.headers['set-cookie']).toMatch(/HttpOnly/);
    expect(created.headers['set-cookie']).toMatch(/SameSite=Strict/);
    expect(created.body).toBe('');
    const headers = { origin, cookie: cookie(created) };
    const state = (await gateway.inject({ url: '/api/state', headers })).json().state;
    expect(state.inventory.crowns).toBe(50);
    expect(state.copies).toHaveLength(1);
    expect(state.copies[0].wizard.name.es).toBe('Aprendiz de Alquimia');
    expect(
      (await gateway.inject({ method: 'POST', url: '/api/trial/session', headers, payload: {} }))
        .statusCode,
    ).toBe(204);
    expect((await gateway.inject({ url: '/api/state', headers })).json().state).toEqual(state);
    const another = await create(),
      otherHeaders = { origin, cookie: cookie(another), 'x-arcana-player': state.playerId };
    const rejected = await gateway.inject({
      method: 'POST',
      url: '/api/purchases',
      headers: otherHeaders,
      payload: {
        key: 'buy',
        expectedRevision: 1,
        request: { product: 'cacao-toad', quantity: 1, priceVersion: 1 },
      },
    });
    expect(rejected.statusCode).toBe(409);
    expect(rejected.json().error).toMatchObject({
      code: 'PLAYER_MISMATCH',
      recoverWithSameKey: true,
    });
    expect(
      (await gateway.inject({ url: '/api/state', headers: otherHeaders })).json().state.inventory
        .crowns,
    ).toBe(50);
  });
  it.each([0, 17])(
    'executes apprentice→temporary pacts→valid battle without extra permanent gifts (route seed %i)',
    async (routeSeed) => {
      const created = await create(),
        headers = { origin, cookie: cookie(created) };
      let state = (await gateway.inject({ url: '/api/state', headers })).json().state;
      // Pin only route generation; battle randomness and the SQL/Redis authority remain real.
      const routeSeeds = vi.spyOn(CryptoBattleSeeds.prototype, 'next').mockReturnValue(routeSeed);
      const start = await gateway
        .inject({
          method: 'POST',
          url: '/api/runs',
          headers,
          payload: {
            key: 'run',
            expectedRevision: state.revision,
            request: { zoneId: 'pasaje', campaignVersion: 1, copyIds: [state.copies[0].copyId] },
          },
        })
        .finally(() => routeSeeds.mockRestore());
      expect(start.statusCode).toBe(200);
      state = start.json().state;
      const route = routePath(state.exploration.run.graph, [], 'duel');
      if (routeSeed === 17)
        expect(
          route.some(
            (id) =>
              state.exploration.run.graph.nodes.find(
                (node: { id: string; kind: string }) => node.id === id,
              )?.kind === 'encounter',
          ),
        ).toBe(true);
      const generated = structuredClone(state.exploration.run.graph);
      expect(state.exploration.run.routeGeneration.version).toBe(1);
      for (const nodeId of route) {
        const plan = state.exploration.run.campaignSnapshot.nodes.find(
          (entry: { nodeId: string; kind: string }) => entry.nodeId === nodeId,
        );
        const result = await gateway.inject({
          method: 'POST',
          url: '/api/nodes/advance',
          headers,
          payload: {
            key: 'advance-' + nodeId,
            expectedRevision: state.revision,
            request: {
              runId: 'run',
              nodeId,
              campaignVersion: 1,
              assignments: [],
              ...(plan.kind === 'pact' ? { recruitId: plan.recruits[0].id } : {}),
              // This journey tests recruitment and combat; trades have dedicated contracts.
              // Passing is an explicit valid choice, including A67 deterministic encounters.
              ...(plan.kind === 'encounter' ? { encounterAction: 'pass' } : {}),
            },
          },
        });
        expect(result.statusCode, `route seed ${routeSeed}, node ${nodeId}: ${result.body}`).toBe(
          200,
        );
        state = result.json().state;
      }
      expect(state.copies).toHaveLength(1);
      expect(state.exploration.run.members.length).toBeGreaterThanOrEqual(3);
      expect(state.inventory.essence.points).toBe(45);
      expect(
        (await gateway.inject({ url: '/api/state', headers })).json().state.exploration.run.graph,
      ).toEqual(generated);
      const receipt = state.receipts.find(
        (r: { id: string }) => r.id === 'advance-' + route.at(-1),
      );
      expect(receipt.battle.input.player).toHaveLength(state.exploration.run.members.length);
      expect(receipt.battle.events.at(-1).kind).toBe('combat-finished');
    },
  );
});
