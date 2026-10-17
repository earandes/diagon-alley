import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Pool } from 'pg';
import { createClient } from 'redis';
import {
  applyGameSchema,
  PostgresGameTransactions,
  gameAccountsInTransaction,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import {
  IdentityService,
  applyIdentitySchema,
} from '../../../src/arcana/infrastructure/identity/service';
import {
  LocalIdentityMail,
  type IdentityMail,
} from '../../../src/arcana/infrastructure/identity/mail';
import {
  IdentitySessions,
  applyIdentitySessionSchema,
} from '../../../src/arcana/infrastructure/identity/sessions';
import { RedisAuthority } from '../../../src/arcana/infrastructure/redis/authority';
import { InitializePlayerUseCase } from '../../../src/arcana/application/team-use-cases';
import { composeArcanaApi } from '../../../src/arcana/infrastructure/http/composition';
import { createTrialGateway } from '../../../src/arcana/infrastructure/http/trial-gateway';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
const pool = new Pool({
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  max: 4,
});
const redis = createClient({
  url: 'redis://127.0.0.1:56379',
  socket: { reconnectStrategy: false },
});
redis.on('error', () => {});
const ns = 'a76-http-' + randomUUID(),
  origin = 'http://127.0.0.1:5189',
  password = 'a long isolated password';
const raw = new RedisAuthority(redis, ns),
  games = new PostgresGameTransactions(pool),
  config = trialConfiguration();
const players: string[] = [];
const initializer = new InitializePlayerUseCase(games, () => config.starter, raw);
let directory: string;
const identity = new IdentityService(pool, {
  now: () => raw.now(),
  initializePlayer: async (id, client) => {
    players.push(id);
    await new InitializePlayerUseCase(
      gameAccountsInTransaction(client),
      () => config.starter,
      raw,
    ).execute(id);
  },
  mail: { send: async (mail) => new LocalIdentityMail(directory, 'test').send(mail) },
});
const sessions = new IdentitySessions(raw, pool, identity);
const runtime = composeArcanaApi({
  pool,
  redis,
  namespace: ns,
  games,
  sessions,
  opening: () => config.opening,
  campaign: () => config.campaign,
  policy: { bodyLimit: 16384, maximumPerIp: 1000, maximumPerPlayer: 500, windowMs: 60000 },
});
const gateway = createTrialGateway({
  api: runtime.app,
  authority: sessions,
  identity,
  origin,
  initialize: async (id) => {
    players.push(id);
    return initializer.execute(id);
  },
});
beforeAll(async () => {
  await redis.connect();
  await applyGameSchema(pool);
  await applyIdentitySchema(pool);
  await applyIdentitySessionSchema(pool);
  directory = await mkdtemp(join(tmpdir(), 'arcana-mail-'));
});
afterAll(async () => {
  await gateway.close();
  await runtime.app.close();
  if (players.length) {
    await pool.query('DELETE FROM arcana_identity_sessions WHERE player_id=ANY($1::text[])', [
      players,
    ]);
    await pool.query('DELETE FROM arcana_identities WHERE player_id=ANY($1::text[])', [players]);
    await pool.query('DELETE FROM arcana_identity_challenges WHERE player_id=ANY($1::text[])', [
      players,
    ]);
    await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [players]);
  }
  const keys = await redis.keys(ns + ':*');
  if (keys.length) await redis.del(keys);
  await redis.close();
  await pool.end();
  await rm(directory, { recursive: true, force: true });
});
const post = (path: string, payload: object, cookie?: string) =>
  gateway.inject({
    method: 'POST',
    url: '/api/' + path,
    headers: { origin, ...(cookie ? { cookie } : {}) },
    payload,
  });
const get = (path: string, cookie?: string) =>
  gateway.inject({ method: 'GET', url: '/api/' + path, headers: cookie ? { cookie } : {} });
const cookieOf = (response: { headers: Record<string, unknown> }) =>
  String(response.headers['set-cookie']).split(';')[0];
const mailFor = async (email: string, purpose: 'verify' | 'reset') => {
  const messages = await Promise.all(
    (await readdir(directory)).map(
      async (file) => JSON.parse(await readFile(join(directory, file), 'utf8')) as IdentityMail,
    ),
  );
  return messages.filter((m) => m.to === email && m.purpose === purpose).at(-1)!;
};
const register = async (guest?: string) => {
  const email = randomUUID() + '@example.test';
  const sent = await post('auth/register', { email }, guest);
  expect(sent.statusCode).toBe(200);
  expect(sent.json()).toEqual({ accepted: true });
  const mail = await mailFor(email, 'verify');
  expect(mail.token).toHaveLength(64);
  const response = await post('auth/verify', { token: mail.token, password }, guest);
  expect(response.statusCode).toBe(200);
  return {
    email,
    response,
    cookie: cookieOf(response),
    playerId: response.json().playerId as string,
    token: mail.token,
  };
};
describe('A76 identity gateway with PostgreSQL, Redis and private delivered files', () => {
  it('requires the missing guest session before mailing any binding challenge', async () => {
    const before = (await readdir(directory)).length;
    const response = await post('auth/register', {
      email: 'lost-guest@example.test',
      expectedPlayerId: 'lost-guest',
    });
    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe('GUEST_SESSION_REQUIRED');
    expect((await readdir(directory)).length).toBe(before);
  });
  it('reauthenticates the proven owner when another tab has changed the cookie', async () => {
    const account = await register();
    const otherCookie = cookieOf(await post('trial/session', {}));
    const response = await post(
      'auth/login',
      { email: account.email, password, expectedPlayerId: account.playerId },
      otherCookie,
    );
    expect(response.statusCode).toBe(200);
    expect(response.json().playerId).toBe(account.playerId);
  });
  it('verifies once, rotates session and restores exact same collection in a new context', async () => {
    const account = await register();
    expect((await get('auth/session', account.cookie)).json()).toMatchObject({
      kind: 'account',
      playerId: account.playerId,
      email: account.email,
    });
    const before = await games.read(account.playerId);
    const login = await post('auth/login', { email: account.email, password });
    expect(login.statusCode).toBe(200);
    expect(cookieOf(login)).not.toBe(account.cookie);
    expect((await get('state', cookieOf(login))).json().state).toEqual(
      JSON.parse(JSON.stringify(before)),
    );
    expect((await post('auth/verify', { token: account.token, password })).statusCode).toBe(400);
    expect((await games.read(account.playerId)).receipts).toEqual(before.receipts);
  });
  it('links the guest in place and invalidates old guest sessions', async () => {
    const guest = await post('trial/session', {}),
      old = cookieOf(guest),
      oldToken = old.split('=')[1];
    const before = (await get('state', old)).json().state;
    const account = await register(old);
    expect(account.playerId).toBe(before.playerId);
    expect(await games.read(account.playerId)).toEqual(before);
    expect(await sessions.resolve(oldToken)).toBe(null);
    expect((await get('state', old)).statusCode).toBe(401);
  });
  it('never changes another owner without explicit switching and preserves the abandoned guest', async () => {
    const account = await register();
    const guest = cookieOf(await post('trial/session', {}));
    const before = (await get('state', guest)).json().state;
    const denied = await post(
      'auth/login',
      { email: account.email, password, expectedPlayerId: before.playerId },
      guest,
    );
    expect(denied.statusCode).toBe(409);
    expect(denied.headers['set-cookie']).toBeUndefined();
    const accepted = await post(
      'auth/login',
      {
        email: account.email,
        password,
        expectedPlayerId: before.playerId,
        allowPlayerChange: true,
      },
      guest,
    );
    expect(accepted.statusCode).toBe(200);
    expect(await games.read(before.playerId)).toEqual(before);
  });
  it('reset revokes old sessions and password, then allows the same player to reauthenticate', async () => {
    const account = await register();
    const before = await games.read(account.playerId);
    expect((await post('auth/request-reset', { email: account.email })).json()).toEqual({
      accepted: true,
    });
    const mail = await mailFor(account.email, 'reset'),
      nextPassword = 'another long isolated password';
    expect(
      (await post('auth/reset', { token: mail.token, password: nextPassword })).statusCode,
    ).toBe(200);
    expect((await get('state', account.cookie)).statusCode).toBe(401);
    expect((await post('auth/login', { email: account.email, password })).statusCode).toBe(400);
    expect(
      (await post('auth/reset', { token: mail.token, password: nextPassword })).statusCode,
    ).toBe(400);
    const login = await post('auth/login', {
      email: account.email,
      password: nextPassword,
      expectedPlayerId: account.playerId,
    });
    expect(login.statusCode).toBe(200);
    expect(await games.read(account.playerId)).toEqual(before);
  });
  it('rejects cross-origin, unknown body fields and stale owner without exposing credentials', async () => {
    expect(
      (
        await gateway.inject({
          method: 'POST',
          url: '/api/auth/register',
          headers: { origin: 'https://other.test' },
          payload: { email: 'private@example.test' },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (await post('auth/register', { email: 'private@example.test', playerId: 'forged' }))
        .statusCode,
    ).toBe(400);
    expect((await get('auth/session')).json()).toEqual({ kind: 'anonymous' });
    expect((await post('auth/request-reset', { email: 'absent@example.test' })).json()).toEqual({
      accepted: true,
    });
    const account = await register();
    expect(
      (await post('auth/logout', { expectedPlayerId: 'wrong-player' }, account.cookie)).statusCode,
    ).toBe(409);
    const logout = await post(
      'auth/logout',
      { expectedPlayerId: account.playerId },
      account.cookie,
    );
    expect(logout.statusCode).toBe(200);
    expect((await get('state', account.cookie)).statusCode).toBe(401);
  });
});
