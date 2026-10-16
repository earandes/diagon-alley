import {
  ForgeWandUseCase,
  OpenObsidianVaultUseCase,
} from '../../../src/arcana/application/commerce-use-cases';
import { commerceFixture } from './support/commerce-fixtures';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FastifyInstance } from 'fastify';
import {
  createArcanaApi,
  type ArcanaApiServices,
} from '../../../src/arcana/infrastructure/http/api';
import {
  gameSnapshot,
  type GameState,
  type GameTransactions,
} from '../../../src/arcana/application/game';
import {
  PurchaseProductUseCase,
  OpenCocoaToadUseCase,
  BuyAndOpenCocoaToadUseCase,
} from '../../../src/arcana/application/shop-use-cases';
import {
  StartRunUseCase,
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
} from '../../../src/arcana/application/run-use-cases';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { ArcanaError } from '../../../src/arcana/domain/errors';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { catalogFixture, toadFixture, shopFixture } from './support/fixtures';
import { campaignFixture, runInitial } from './support/run-fixtures';
import { SeasonalEventUseCase } from '../../../src/arcana/application/seasonal-events';
import { seasonalEdition } from '../../../src/arcana/infrastructure/content/seasonal-content';
import {
  SetTeamUseCase,
  EquipEquipmentUseCase,
} from '../../../src/arcana/application/team-use-cases';
const apps: FastifyInstance[] = [];
afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});
const token = 'a'.repeat(64),
  auth = { authorization: `Bearer ${token}` };
const opening = () => ({ catalog: catalogFixture, table: toadFixture, shop: shopFixture });
class Games implements GameTransactions {
  state = gameSnapshot(runInitial());
  queue: Promise<unknown> = Promise.resolve();
  fail: 'before' | 'after' | null = null;
  async read(playerId: string) {
    if (playerId !== this.state.playerId) throw new ArcanaError('PLAYER_NOT_FOUND');
    return gameSnapshot(this.state);
  }
  transact(playerId: string, change: (state: GameState) => GameState): Promise<GameState> {
    const work = this.queue.then(async () => {
      await this.read(playerId);
      const state = gameSnapshot(change(this.state));
      if (this.fail === 'before') throw new ArcanaError('STORAGE');
      this.state = state;
      if (this.fail === 'after') throw new ArcanaError('UNKNOWN_COMMIT');
      return state;
    });
    this.queue = work.catch(() => {});
    return work;
  }
}
const setup = () => {
  const games = new Games(),
    random = { ticket: vi.fn(() => 0) },
    seeds = { next: vi.fn(() => 42) },
    clock = { now: vi.fn(async () => 0) };
  let session: string | null = 'player';
  const sessions = {
    issue: vi.fn(async () => ({ token, expiresAt: 1000 })),
    resolve: vi.fn(async (received: string) => (received === token ? session : null)),
    revoke: vi.fn(async () => {
      session = null;
    }),
  };
  const limits = {
    consume: vi.fn(async (_subject: string, _maximum: number, _windowMs: number) => ({
      allowed: true,
      remaining: 10,
      retryAfterMs: 0,
    })),
  };
  const services: ArcanaApiServices = {
    seasonalConfiguration: () => seasonalEdition,
    seasonalEvent: new SeasonalEventUseCase(games, () => seasonalEdition, clock),
    games,
    sessions,
    limits,
    clock,
    opening,
    campaign: campaignFixture,
    forgeWand: new ForgeWandUseCase(games, () => commerceFixture),
    openVault: new OpenObsidianVaultUseCase(games, () => commerceFixture, random),
    purchase: new PurchaseProductUseCase(games, opening),
    buyOpenToad: new BuyAndOpenCocoaToadUseCase(games, opening, random),
    openToad: new OpenCocoaToadUseCase(games, opening, random),
    startRun: new StartRunUseCase(games, campaignFixture),
    setTeam: new SetTeamUseCase(games, campaignFixture),
    equipEquipment: new EquipEquipmentUseCase(games),
    advanceNode: new AdvanceNodeUseCase(
      games,
      campaignFixture,
      new ResolveCombatUseCase(
        new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) }),
        seeds,
      ),
      clock,
      { fromSeed: (seed) => new SeededRandom(seed) },
      seeds,
    ),
  };
  const app = createArcanaApi(services, {
    bodyLimit: 16_384,
    maximumPerIp: 100,
    maximumPerPlayer: 50,
    windowMs: 60_000,
  });
  apps.push(app);
  return { app, games, random, seeds, clock, sessions, limits, services };
};
const purchase = {
  key: 'buy',
  expectedRevision: 1,
  request: { product: 'cacao-toad', quantity: 1, priceVersion: 1 },
};
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
describe('ARCANA Fastify authenticated command API', () => {
  it('A68 keeps seasonal intents strict, read-only consultation and recoverable joins', async () => {
    const { app, games, clock } = setup();
    clock.now.mockResolvedValue(seasonalEdition.startsAt + 100);
    const before = games.state;
    const content = await app.inject({ method: 'GET', url: '/api/content', headers: auth });
    expect(content.json().seasonalEdition).toEqual(seasonalEdition);
    expect(games.state).toEqual(before);
    const payload = {
      key: 'seasonal-join',
      expectedRevision: before.revision,
      request: {
        editionId: seasonalEdition.editionId,
        version: seasonalEdition.version,
        action: 'join',
      },
    };
    for (const field of [
      { serverTime: seasonalEdition.startsAt },
      { completedObjectiveIds: ['a', 'b', 'c'] },
      { action: 'grant' },
    ]) {
      const invalid = await app.inject({
        method: 'POST',
        url: '/api/events/seasonal',
        headers: auth,
        payload: { ...payload, request: { ...payload.request, ...field } },
      });
      expect(invalid.statusCode).toBe(400);
      expect(games.state).toEqual(before);
    }
    const joined = await app.inject({
      method: 'POST',
      url: '/api/events/seasonal',
      headers: auth,
      payload,
    });
    expect(joined.statusCode).toBe(200);
    expect(joined.json().receipt.kind).toBe('seasonal-event');
    expect(games.state.inventory).toEqual(before.inventory);
    clock.now.mockRejectedValue(new Error('clock unavailable'));
    const replay = await app.inject({
      method: 'POST',
      url: '/api/events/seasonal',
      headers: auth,
      payload,
    });
    expect(replay.statusCode).toBe(200);
    expect(replay.json()).toEqual(joined.json());
    const recovered = await app.inject({
      method: 'GET',
      url: '/api/operations/seasonal-join',
      headers: auth,
    });
    expect(recovered.json()).toEqual(joined.json());
  });
  it('accepts one strict buy-open command and recovers the same committed receipt', async () => {
    const { app, games, random } = setup();
    const payload = {
      key: 'buy-open',
      expectedRevision: 1,
      request: { priceVersion: 1, catalogVersion: 1, tableVersion: 1 },
    };
    const invalid = await app.inject({
      method: 'POST',
      url: '/api/toads/buy-open',
      headers: auth,
      payload: { ...payload, request: { ...payload.request, quantity: 2 } },
    });
    expect(invalid.statusCode).toBe(400);
    expect(random.ticket).not.toHaveBeenCalled();
    const opened = await app.inject({
      method: 'POST',
      url: '/api/toads/buy-open',
      headers: auth,
      payload,
    });
    expect(opened.statusCode).toBe(200);
    expect(opened.json()).toMatchObject({
      state: { revision: 2, inventory: { crowns: 40 } },
      receipt: { kind: 'buy-open-toad', spentCrowns: 10 },
    });
    const replay = await app.inject({
      method: 'POST',
      url: '/api/toads/buy-open',
      headers: auth,
      payload,
    });
    const recovered = await app.inject({
      method: 'GET',
      url: '/api/operations/buy-open',
      headers: auth,
    });
    expect(replay.json()).toEqual(opened.json());
    expect(recovered.json()).toEqual(opened.json());
    expect(games.state.receipts).toHaveLength(1);
    expect(random.ticket).toHaveBeenCalledTimes(1);
    const conflict = await app.inject({
      method: 'POST',
      url: '/api/toads/buy-open',
      headers: auth,
      payload: { ...payload, request: { ...payload.request, priceVersion: 2 } },
    });
    expect(conflict.statusCode).toBe(409);
    expect(conflict.json().error.code).toBe('OPERATION_CONFLICT');
  });

  it('requires a valid opaque bearer session before reading or mutating a player', async () => {
    const { app, games } = setup(),
      before = games.state;
    for (const authorization of [
      undefined,
      'Bearer invalid',
      'Basic credentials',
      `Bearer ${'b'.repeat(64)}`,
    ]) {
      const result = await app.inject({
        method: 'GET',
        url: '/api/state',
        headers: authorization ? { authorization } : {},
      });
      expect(result.statusCode).toBe(401);
      expect(result.json()).toEqual({ error: { code: 'UNAUTHORIZED' } });
    }
    const result = await app.inject({ method: 'POST', url: '/api/purchases', payload: purchase });
    expect(result.statusCode).toBe(401);
    expect(games.state).toEqual(before);
  });
  it('reads confirmed state and server time without spending, with no-store caching', async () => {
    const { app, games, clock } = setup(),
      before = games.state;
    const response = await app.inject({ method: 'GET', url: '/api/state', headers: auth });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ state: before, serverTime: 0 });
    expect(response.headers['cache-control']).toBe('no-store');
    expect(games.state).toEqual(before);
    expect(clock.now).toHaveBeenCalledTimes(1);
  });
  it('queries regenerated energy without modifying the stored reserve or revision', async () => {
    const { app, games, clock } = setup();
    games.state = gameSnapshot({
      ...games.state,
      inventory: { ...games.state.inventory, essence: { points: 4, cursor: 0 } },
    });
    const before = games.state;
    clock.now.mockResolvedValue(720_001);
    const response = await app.inject({ method: 'GET', url: '/api/state', headers: auth });
    expect(response.json()).toMatchObject({
      state: before,
      serverTime: 720_001,
      energy: { points: 5, maximum: 50, combatCost: 5, nextPointAt: 1_440_000 },
    });
    expect(games.state).toEqual(before);
  });
  it('forges and opens a vault by owned intent, rejecting client prices/stats and empty keys', async () => {
    const { app, games, random } = setup();
    games.state = gameSnapshot({
      ...games.state,
      inventory: { ...games.state.inventory, goldKeys: 1 },
    });
    const forge = {
      key: 'forge',
      expectedRevision: 1,
      request: { recipeId: 'birch-dragon', catalogVersion: 1 },
    };
    expect(
      (
        await app.inject({
          method: 'POST',
          url: '/api/wands/forge',
          headers: auth,
          payload: { ...forge, request: { ...forge.request, crowns: 0, multiplier: 99 } },
        })
      ).statusCode,
    ).toBe(400);
    expect(
      (await app.inject({ method: 'POST', url: '/api/wands/forge', headers: auth, payload: forge }))
        .statusCode,
    ).toBe(200);
    expect(games.state.inventory.crowns).toBe(35);
    const vault = { key: 'vault', expectedRevision: 2, request: { tableVersion: 1 } };
    const result = await app.inject({
      method: 'POST',
      url: '/api/vaults/open',
      headers: auth,
      payload: vault,
    });
    expect(result.statusCode).toBe(200);
    expect(games.state.inventory.goldKeys).toBe(0);
    expect(
      (
        await app.inject({ method: 'POST', url: '/api/vaults/open', headers: auth, payload: vault })
      ).json().receipt,
    ).toEqual(result.json().receipt);
    expect(random.ticket).toHaveBeenCalledTimes(1);
    const empty = await app.inject({
      method: 'POST',
      url: '/api/vaults/open',
      headers: auth,
      payload: { ...vault, key: 'empty', expectedRevision: 3 },
    });
    expect(empty.statusCode).toBe(422);
    expect(empty.json().error.code).toBe('INSUFFICIENT_KEYS');
    expect(random.ticket).toHaveBeenCalledTimes(1);
  });
  it('returns public versioned configuration without the private formation function', async () => {
    const { app } = setup();
    const response = await app.inject({ method: 'GET', url: '/api/content', headers: auth });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      catalog: { version: 1 },
      toadTable: { version: 1 },
      shop: { version: 1 },
      campaign: { version: 1, zoneId: 'bulevar' },
    });
    expect(response.body).not.toContain('prepareOwned');
    expect(response.body).not.toContain('seed');
    expect(response.body).not.toContain(token);
  });
  it('purchases and opens through the real cases and retrieves only a confirmed receipt', async () => {
    const { app, games, random } = setup();
    expect(
      (
        await app.inject({
          method: 'POST',
          url: '/api/purchases',
          headers: auth,
          payload: purchase,
        })
      ).statusCode,
    ).toBe(200);
    const command = {
      key: 'open',
      expectedRevision: 2,
      request: { unitId: 'buy:0', catalogVersion: 1, tableVersion: 1 },
    };
    const opened = await app.inject({
      method: 'POST',
      url: '/api/toads/open',
      headers: auth,
      payload: command,
    });
    expect(opened.statusCode).toBe(200);
    expect(opened.json().receipt).toMatchObject({ kind: 'open-toad', wizard: { id: 'merlin' } });
    const recovered = await app.inject({
      method: 'GET',
      url: '/api/operations/open',
      headers: auth,
    });
    expect(recovered.json()).toEqual(opened.json());
    expect(games.state.copies).toHaveLength(4);
    expect(random.ticket).toHaveBeenCalledTimes(1);
    expect(
      (await app.inject({ method: 'GET', url: '/api/operations/missing', headers: auth }))
        .statusCode,
    ).toBe(404);
  });
  it('starts owned formation and resolves the battle using server seed and clock', async () => {
    const { app, games, seeds, clock } = setup();
    expect(
      (await app.inject({ method: 'POST', url: '/api/runs', headers: auth, payload: start }))
        .statusCode,
    ).toBe(200);
    const response = await app.inject({
      method: 'POST',
      url: '/api/nodes/advance',
      headers: auth,
      payload: advance,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().receipt).toMatchObject({
      kind: 'advance-node',
      battle: { outcome: 'player', input: { seed: 42 } },
    });
    expect(games.state.inventory.essence.points).toBe(45);
    expect(seeds.next).toHaveBeenCalledTimes(1);
    expect(clock.now).toHaveBeenCalledTimes(1);
  });
  it.each(['playerId', 'seed', 'crowns', 'winner', 'reward', 'now', 'opponents', 'stats'])(
    'rejects client-controlled %s rather than silently discarding it',
    async (field) => {
      const { app, games, seeds } = setup(),
        before = games.state;
      const response = await app.inject({
        method: 'POST',
        url: '/api/runs',
        headers: auth,
        payload: { ...start, request: { ...start.request, [field]: 42 } },
      });
      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ error: { code: 'INVALID_REQUEST' } });
      expect(games.state).toEqual(before);
      expect(seeds.next).not.toHaveBeenCalled();
    },
  );
  it('rejects string coercion, extra command fields, duplicate copies and non-JSON bodies', async () => {
    const { app, games } = setup();
    const before = games.state;
    for (const payload of [
      { ...purchase, expectedRevision: '1' },
      { ...purchase, playerId: 'other' },
      { ...purchase, request: { ...purchase.request, quantity: '1' } },
      { ...start, request: { ...start.request, copyIds: ['copy0', 'copy0', 'copy2'] } },
    ])
      expect(
        (
          await app.inject({
            method: 'POST',
            url: payload.key === 'start' ? '/api/runs' : '/api/purchases',
            headers: auth,
            payload,
          })
        ).statusCode,
      ).toBe(400);
    const text = await app.inject({
      method: 'POST',
      url: '/api/purchases',
      headers: { ...auth, 'content-type': 'text/plain' },
      payload: JSON.stringify(purchase),
    });
    expect(text.statusCode).toBe(400);
    expect(games.state).toEqual(before);
  });
  it('returns conflicts and domain rejections without committing an operation', async () => {
    const { app, games } = setup();
    const stale = await app.inject({
      method: 'POST',
      url: '/api/purchases',
      headers: auth,
      payload: { ...purchase, expectedRevision: 2 },
    });
    expect(stale.statusCode).toBe(409);
    expect(stale.json().error.code).toBe('STALE_GAME');
    const insufficient = await app.inject({
      method: 'POST',
      url: '/api/purchases',
      headers: auth,
      payload: { ...purchase, request: { ...purchase.request, quantity: 6 } },
    });
    expect(insufficient.statusCode).toBe(422);
    expect(insufficient.json().error.code).toBe('INSUFFICIENT_CROWNS');
    expect(games.state.revision).toBe(1);
  });
  it('reports uncertain commit and recovers it with the same key and no new lottery', async () => {
    const { app, games } = setup();
    games.fail = 'after';
    const uncertain = await app.inject({
      method: 'POST',
      url: '/api/purchases',
      headers: auth,
      payload: purchase,
    });
    expect(uncertain.statusCode).toBe(503);
    expect(uncertain.json()).toEqual({
      error: { code: 'UNKNOWN_COMMIT', recoverWithSameKey: true },
    });
    games.fail = null;
    const recovered = await app.inject({
      method: 'POST',
      url: '/api/purchases',
      headers: auth,
      payload: purchase,
    });
    expect(recovered.statusCode).toBe(200);
    expect(games.state.inventory.crowns).toBe(40);
    expect(games.state.receipts).toHaveLength(1);
  });
  it('enforces rate limiting before mutating state and does not trust X-Forwarded-For', async () => {
    const { app, games, limits } = setup();
    limits.consume.mockResolvedValue({ allowed: false, remaining: 0, retryAfterMs: 1234 });
    const response = await app.inject({
      method: 'POST',
      url: '/api/purchases',
      headers: { ...auth, 'x-forwarded-for': '203.0.113.50' },
      payload: purchase,
    });
    expect(response.statusCode).toBe(429);
    expect(response.headers['retry-after']).toBe('2');
    expect(response.json().error.code).toBe('RATE_LIMITED');
    expect(games.state.revision).toBe(1);
    expect(limits.consume.mock.calls[0][0]).toBe('ip:127.0.0.1');
  });
  it('revokes only the presented session without deleting inventory', async () => {
    const { app, sessions, games } = setup(),
      before = games.state;
    expect(
      (await app.inject({ method: 'DELETE', url: '/api/session', headers: auth })).statusCode,
    ).toBe(204);
    expect(sessions.revoke).toHaveBeenCalledWith(token);
    expect((await app.inject({ method: 'GET', url: '/api/state', headers: auth })).statusCode).toBe(
      401,
    );
    expect(games.state).toEqual(before);
  });
  it('hides unexpected errors and denies oversized payloads', async () => {
    const { app, games } = setup();
    vi.spyOn(games, 'read').mockRejectedValue(Error('SQL password=private_secret'));
    const response = await app.inject({ method: 'GET', url: '/api/state', headers: auth });
    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: { code: 'INTERNAL_ERROR' } });
    expect(response.body).not.toContain('private_secret');
    const large = await app.inject({
      method: 'POST',
      url: '/api/purchases',
      headers: auth,
      payload: { ...purchase, padding: 'x'.repeat(20_000) },
    });
    expect(large.statusCode).toBe(413);
  });
});

describe('ARCANA explicit public configuration projection', () => {
  it('omits authority metadata attached to configuration rather than serializing it accidentally', async () => {
    const { services } = setup();
    const config = opening();
    const app = createArcanaApi(
      {
        ...services,
        opening: () => ({
          ...config,
          catalog: {
            ...config.catalog,
            internalNotes: 'private-authority-metadata',
            wizards: config.catalog.wizards.map((w) => ({
              ...w,
              internalNotes: 'private-authority-metadata',
            })),
          },
          table: { ...config.table, internalNotes: 'private-authority-metadata' },
          shop: { ...config.shop, internalNotes: 'private-authority-metadata' },
        }),
      },
      { bodyLimit: 16_384, maximumPerIp: 100, maximumPerPlayer: 50, windowMs: 60_000 },
    );
    apps.push(app);
    const response = await app.inject({ method: 'GET', url: '/api/content', headers: auth });
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toContain('private-authority-metadata');
  });
});

describe('ARCANA HTTP policy validation', () => {
  it('rejects an incomplete policy before exposing a server with accidental defaults', () => {
    const { services } = setup();
    expect(() => createArcanaApi(services, {} as Parameters<typeof createArcanaApi>[1])).toThrow(
      'INVALID_RATE_LIMIT',
    );
  });
});

describe('ARCANA team and equipment HTTP commands', () => {
  it('allows a one-copy exploration run but rejects a duel without three units or energy loss', async () => {
    const { app, games, seeds } = setup();
    const started = await app.inject({
      method: 'POST',
      url: '/api/runs',
      headers: auth,
      payload: { ...start, request: { ...start.request, copyIds: ['copy0'] } },
    });
    expect(started.statusCode).toBe(200);
    const duel = await app.inject({
      method: 'POST',
      url: '/api/nodes/advance',
      headers: auth,
      payload: advance,
    });
    expect(duel.statusCode).toBe(422);
    expect(duel.json().error.code).toBe('INVALID_FORMATION');
    expect(games.state.inventory.essence.points).toBe(50);
    expect(seeds.next).not.toHaveBeenCalled();
  });
  it('selects owned copies and transfers owned gear through strict schemas', async () => {
    const { app, games } = setup();
    games.state = gameSnapshot({
      ...games.state,
      inventory: {
        ...games.state.inventory,
        equipment: [
          {
            id: 'wand',
            kind: 'wand',
            version: 1,
            wood: 'birch',
            core: null,
            powerBonus: 2,
            multiplier: 1,
          },
        ],
      },
    });
    const selected = await app.inject({
      method: 'POST',
      url: '/api/team',
      headers: auth,
      payload: { key: 'team', expectedRevision: 1, request: { copyIds: ['copy0', 'copy1'] } },
    });
    expect(selected.statusCode).toBe(200);
    const gear = {
      key: 'gear',
      expectedRevision: 2,
      request: { copyId: 'copy0', slot: 'wand', equipmentId: 'wand' },
    };
    const equipped = await app.inject({
      method: 'POST',
      url: '/api/equipment',
      headers: auth,
      payload: gear,
    });
    expect(equipped.statusCode).toBe(200);
    expect(equipped.json().state.team.loadouts[0]).toMatchObject({
      copyId: 'copy0',
      wandId: 'wand',
    });
    expect(
      (
        await app.inject({
          method: 'POST',
          url: '/api/equipment',
          headers: auth,
          payload: { ...gear, request: { ...gear.request, powerBonus: 999 } },
        })
      ).statusCode,
    ).toBe(400);
    const foreign = await app.inject({
      method: 'POST',
      url: '/api/equipment',
      headers: auth,
      payload: {
        ...gear,
        key: 'foreign',
        expectedRevision: 3,
        request: { ...gear.request, equipmentId: 'foreign-item' },
      },
    });
    expect(foreign.statusCode).toBe(422);
    expect(foreign.json().error.code).toBe('EQUIPMENT_UNAVAILABLE');
  });
});
