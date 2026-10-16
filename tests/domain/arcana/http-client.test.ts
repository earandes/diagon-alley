import {
  ForgeWandUseCase,
  OpenObsidianVaultUseCase,
} from '../../../src/arcana/application/commerce-use-cases';
import { commerceFixture } from './support/commerce-fixtures';
import { projectPlayerStatus } from '../../../src/arcana/application/player-status';
import { describe, expect, it, vi } from 'vitest';
import {
  ArcanaHttpClient,
  ArcanaClientError,
} from '../../../src/arcana/infrastructure/http/client';
import { gameSnapshot, type GameState } from '../../../src/arcana/application/game';
import { PurchaseProductUseCase } from '../../../src/arcana/application/shop-use-cases';
import { runInitial } from './support/run-fixtures';
import { catalogFixture, toadFixture, shopFixture } from './support/fixtures';
const command = {
  key: 'buy',
  expectedRevision: 1,
  request: { product: 'cacao-toad' as const, quantity: 1, priceVersion: 1 },
};
const confirmed = async () => {
  let state = gameSnapshot(runInitial());
  const games = {
    read: async () => state,
    transact: async (_id: string, change: (current: GameState) => GameState) => {
      state = gameSnapshot(change(state));
      return state;
    },
  };
  return new PurchaseProductUseCase(games, () => ({
    catalog: catalogFixture,
    table: toadFixture,
    shop: shopFixture,
  })).execute('player', command);
};
const fetcher = (payload: unknown, status = 200) =>
  vi.fn(
    async (_input: string | URL | Request, _init?: RequestInit) =>
      new Response(JSON.stringify(payload), {
        status,
        headers: { 'content-type': 'application/json' },
      }),
  );
describe('ARCANA typed HTTP client', () => {
  it('uses same-origin cookies without a fictitious bearer and binds subsequent commands to the observed player', async () => {
    const transport = fetcher(projectPlayerStatus(gameSnapshot(runInitial()), 0));
    const client = new ArcanaHttpClient('/api', () => null, transport, 'cookie');
    await client.state();
    expect(transport.mock.calls[0][1]?.headers).not.toHaveProperty('Authorization');
    expect(transport.mock.calls[0][1]?.credentials).toBe('same-origin');
    transport.mockResolvedValueOnce(
      new Response(JSON.stringify(await confirmed()), { status: 200 }),
    );
    await client.purchase(command);
    expect(transport.mock.calls[1][1]?.headers).toMatchObject({ 'X-Arcana-Player': 'player' });
  });
  it('keeps a pending intent recoverable and sends no command after its session changes', async () => {
    const state = gameSnapshot(runInitial()),
      transport = fetcher(projectPlayerStatus(state, 0));
    let token = 'first-session';
    const client = new ArcanaHttpClient('/api', () => token, transport);
    await client.state();
    token = 'another-session';
    await expect(client.purchase(command)).rejects.toMatchObject({
      code: 'PLAYER_MISMATCH',
      recoverWithSameKey: true,
    });
    await expect(client.operation('buy')).rejects.toMatchObject({
      code: 'PLAYER_MISMATCH',
      recoverWithSameKey: true,
    });
    expect(transport).toHaveBeenCalledTimes(1);
    await client.state();
    expect(transport).toHaveBeenCalledTimes(2);
  });
  it('reads a validated immutable authority state and clock', async () => {
    const state = gameSnapshot(runInitial()),
      transport = fetcher(projectPlayerStatus(state, 720_000));
    const client = new ArcanaHttpClient('/api', () => 'session-token', transport);
    const result = await client.state();
    expect(result).toEqual(projectPlayerStatus(state, 720_000));
    expect(Object.isFrozen(result.state.inventory)).toBe(true);
    expect(transport.mock.calls[0][0]).toBe('/api/state');
    expect(transport.mock.calls[0][1]).toMatchObject({
      method: 'GET',
      cache: 'no-store',
      redirect: 'error',
      headers: { Authorization: 'Bearer session-token' },
    });
  });
  it('sends the supplied key/revision/intent and returns its receipt from committed state', async () => {
    const result = await confirmed(),
      transport = fetcher(result),
      client = new ArcanaHttpClient('/api', () => 'session-token', transport);
    expect(await client.purchase(command)).toEqual(result);
    expect(transport).toHaveBeenCalledTimes(1);
    const [url, options] = transport.mock.calls[0];
    expect(url).toBe('/api/purchases');
    expect(options).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(JSON.parse(String(options!.body))).toEqual(command);
  });
  it('retrieves a historical operation by key without posting or spending again', async () => {
    const result = await confirmed(),
      transport = fetcher(result),
      client = new ArcanaHttpClient('/api', () => 'session-token', transport);
    expect(await client.operation('buy')).toEqual(result);
    expect(transport.mock.calls[0][0]).toBe('/api/operations/buy');
    expect(transport.mock.calls[0][1]?.method).toBe('GET');
  });
  it('preserves commit uncertainty and conflicts for the caller without retrying', async () => {
    const transport = fetcher({ error: { code: 'UNKNOWN_COMMIT', recoverWithSameKey: true } }, 503),
      client = new ArcanaHttpClient('/api', () => 'token', transport);
    await expect(client.purchase(command)).rejects.toMatchObject({
      code: 'UNKNOWN_COMMIT',
      status: 503,
      recoverWithSameKey: true,
    });
    expect(transport).toHaveBeenCalledTimes(1);
    const conflict = new ArcanaHttpClient(
      '/api',
      () => 'token',
      fetcher({ error: { code: 'STALE_GAME' } }, 409),
    );
    await expect(conflict.purchase(command)).rejects.toMatchObject({
      code: 'STALE_GAME',
      status: 409,
    });
  });
  it('reports network failure without replacing the key or repeating the request', async () => {
    const transport = vi.fn(async () => {
        throw Error('connection lost');
      }),
      client = new ArcanaHttpClient('/api', () => 'token', transport);
    await expect(client.purchase(command)).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      recoverWithSameKey: true,
    });
    expect(transport).toHaveBeenCalledTimes(1);
  });
  it('rejects missing authentication before making a request', async () => {
    const transport = fetcher({}),
      client = new ArcanaHttpClient('/api', () => null, transport);
    await expect(client.state()).rejects.toBeInstanceOf(ArcanaClientError);
    await expect(client.state()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    expect(transport).not.toHaveBeenCalled();
  });
  it('rejects invalid state, negative clock, unrelated receipt and malformed JSON without announcing reward', async () => {
    for (const payload of [
      { state: { crowns: 999 }, serverTime: 0 },
      { state: runInitial(), serverTime: -1 },
    ])
      await expect(
        new ArcanaHttpClient('/api', () => 'token', fetcher(payload)).state(),
      ).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
    const result = await confirmed();
    await expect(
      new ArcanaHttpClient(
        '/api',
        () => 'token',
        fetcher({ ...result, receipt: { ...result.receipt, id: 'other' } }),
      ).purchase(command),
    ).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
    const badJson = vi.fn(async () => new Response('not json', { status: 200 }));
    await expect(
      new ArcanaHttpClient('/api', () => 'token', badJson).state(),
    ).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
  });
  it('transports forge/vault intents and validates receipts without choosing loot in the browser', async () => {
    let state = gameSnapshot({
      ...runInitial(),
      inventory: { ...runInitial().inventory, goldKeys: 1 },
    });
    const games = {
      read: async () => state,
      transact: async (_id: string, change: (current: GameState) => GameState) =>
        (state = gameSnapshot(change(state))),
    };
    const forge = {
      key: 'forge',
      expectedRevision: 1,
      request: { recipeId: 'birch-dragon', catalogVersion: 1 },
    };
    const first = await new ForgeWandUseCase(games, () => commerceFixture).execute('player', forge);
    const transport = fetcher(first),
      client = new ArcanaHttpClient('/api', () => 'session-token', transport);
    expect(await client.forgeWand(forge)).toEqual(first);
    expect(transport.mock.calls[0][0]).toBe('/api/wands/forge');
    const vault = { key: 'vault', expectedRevision: 2, request: { tableVersion: 1 } };
    const second = await new OpenObsidianVaultUseCase(games, () => commerceFixture, {
      ticket: () => 0,
    }).execute('player', vault);
    transport.mockResolvedValueOnce(new Response(JSON.stringify(second), { status: 200 }));
    expect(await client.openVault(vault)).toEqual(second);
    expect(JSON.parse(transport.mock.calls[1][1]!.body as string)).toEqual(vault);
  });
  it('revokes session with DELETE and does not expect JSON from a 204 response', async () => {
    const transport = vi.fn(
      async (_input: string | URL | Request, _init?: RequestInit) =>
        new Response(null, { status: 204 }),
    );
    await new ArcanaHttpClient('/api', () => 'token', transport).logout();
    expect(transport.mock.calls[0][0]).toBe('/api/session');
    expect(transport.mock.calls[0][1]?.method).toBe('DELETE');
  });
});
