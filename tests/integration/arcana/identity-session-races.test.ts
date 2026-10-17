import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { createClient } from 'redis';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { InitializePlayerUseCase } from '../../../src/arcana/application/team-use-cases';
import {
  applyGameSchema,
  gameAccountsInTransaction,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { RedisAuthority } from '../../../src/arcana/infrastructure/redis/authority';
import {
  applyIdentitySchema,
  IdentityService,
} from '../../../src/arcana/infrastructure/identity/service';
import { IdentitySessions } from '../../../src/arcana/infrastructure/identity/sessions';
import type { IdentityMail } from '../../../src/arcana/infrastructure/identity/mail';

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
const namespace = `identity-race-${randomUUID()}`,
  raw = new RedisAuthority(redis, namespace),
  config = trialConfiguration();
const emails: string[] = [],
  players: string[] = [],
  mail: IdentityMail[] = [];
const identity = new IdentityService(pool, {
  now: () => raw.now(),
  mail: {
    send: async (message) => {
      mail.push(message);
    },
  },
  initializePlayer: async (id, client) => {
    players.push(id);
    return new InitializePlayerUseCase(
      gameAccountsInTransaction(client),
      () => config.starter,
      raw,
    ).execute(id);
  },
});
const sessions = new IdentitySessions(raw, pool, identity),
  password = 'a sufficiently long account secret';
const create = async () => {
  const email = `${randomUUID()}@session-test.example`;
  emails.push(email);
  await identity.register({ email });
  return identity.verify({ token: mail.at(-1)!.token, password });
};
beforeAll(async () => {
  await redis.connect();
  await applyGameSchema(pool);
  await applyIdentitySchema(pool);
});
afterAll(async () => {
  await pool.query('DELETE FROM arcana_identity_sessions WHERE player_id=ANY($1::text[])', [
    players,
  ]);
  await pool.query('DELETE FROM arcana_identity_challenges WHERE email_key=ANY($1::text[])', [
    emails,
  ]);
  await pool.query('DELETE FROM arcana_identities WHERE email_key=ANY($1::text[])', [emails]);
  await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [players]);
  const keys = await redis.keys(namespace + ':*');
  if (keys.length) await redis.del(keys);
  await redis.close();
  await pool.end();
});
describe('credential generation with real PostgreSQL/Redis sessions', () => {
  it('rejects existing sessions and an earlier captured password proof after reset', async () => {
    const account = await create(),
      old = await sessions.issueIdentity(account.playerId, account.authVersion, 60000);
    expect(await sessions.resolve(old.token)).toBe(account.playerId);
    await identity.requestReset({ email: account.email });
    await identity.reset({ token: mail.at(-1)!.token, password: 'a replacement account secret' });
    expect(await raw.resolve(old.token)).toBe(account.playerId);
    expect(await sessions.resolve(old.token)).toBeNull();
    await expect(
      sessions.issueIdentity(account.playerId, account.authVersion, 60000),
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
    const next = await identity.login({
        email: account.email,
        password: 'a replacement account secret',
      }),
      fresh = await sessions.issueIdentity(next.playerId, next.authVersion, 60000);
    expect(await sessions.resolve(fresh.token)).toBe(account.playerId);
  });
  it('revokes a raw token if reset commits between proof validation and session insertion', async () => {
    const account = await create();
    await identity.requestReset({ email: account.email });
    const resetToken = mail.at(-1)!.token;
    let issuedToken = '';
    const controlled = new IdentitySessions(
      {
        issue: async (playerId, ttlMs) => {
          await identity.reset({
            token: resetToken,
            password: 'a replacement race account secret',
          });
          const grant = await raw.issue(playerId, ttlMs);
          issuedToken = grant.token;
          return grant;
        },
        resolve: (token) => raw.resolve(token),
        revoke: (token) => raw.revoke(token),
        consume: (subject, max, window) => raw.consume(subject, max, window),
      },
      pool,
      identity,
    );
    await expect(
      controlled.issueIdentity(account.playerId, account.authVersion, 60000),
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
    expect(issuedToken).not.toBe('');
    expect(await raw.resolve(issuedToken)).toBeNull();
    expect(
      (
        await pool.query('SELECT 1 FROM arcana_identity_sessions WHERE player_id=$1', [
          account.playerId,
        ])
      ).rowCount,
    ).toBe(0);
  });
  it('does not promote an old guest token into an authenticated session after binding', async () => {
    const id = `identity-old-guest-${randomUUID()}`;
    players.push(id);
    const init = await pool.connect();
    try {
      await init.query('BEGIN');
      await new InitializePlayerUseCase(
        gameAccountsInTransaction(init),
        () => config.starter,
        raw,
      ).execute(id);
      await init.query('COMMIT');
    } finally {
      init.release();
    }
    const guest = await raw.issue(id, 60000),
      email = `${randomUUID()}@session-test.example`;
    emails.push(email);
    expect(await sessions.resolve(guest.token)).toBe(id);
    await identity.register({ email, guestPlayerId: id });
    const linked = await identity.verify({
      token: mail.at(-1)!.token,
      password,
      guestPlayerId: id,
    });
    expect(await raw.resolve(guest.token)).toBe(id);
    expect(await sessions.resolve(guest.token)).toBeNull();
    const authenticated = await sessions.issueIdentity(id, linked.authVersion, 60000);
    expect(await sessions.resolve(authenticated.token)).toBe(id);
  });
});
