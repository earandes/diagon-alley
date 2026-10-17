import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { InitializePlayerUseCase } from '../../../src/arcana/application/team-use-cases';
import {
  PostgresGameTransactions,
  applyGameSchema,
  gameAccountsInTransaction,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import {
  applyIdentitySchema,
  IdentityService,
} from '../../../src/arcana/infrastructure/identity/service';
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
const ids: string[] = [],
  emails: string[] = [],
  mail: IdentityMail[] = [],
  games = new PostgresGameTransactions(pool);
let now = 1_800_000_000_000,
  failInitialize = false,
  failAfterInitialize = false;
const config = trialConfiguration();
const initialize = new InitializePlayerUseCase(games, () => config.starter, {
  now: async () => now,
});
const service = new IdentityService(pool, {
  now: () => now,
  mail: {
    send: async (message) => {
      mail.push(message);
    },
  },
  initializePlayer: async (id, client) => {
    if (!ids.includes(id)) ids.push(id);
    if (failInitialize) throw Error('isolated initialization failure');
    const state = await new InitializePlayerUseCase(
      gameAccountsInTransaction(client),
      () => config.starter,
      { now: async () => now },
    ).execute(id);
    if (failAfterInitialize) throw Error('isolated failure after kit creation');
    return state;
  },
});
const address = () => {
  const email = `${randomUUID()}@identity-test.example`;
  emails.push(email);
  return email;
};
const latest = (email: string, purpose: IdentityMail['purpose'] = 'verify') =>
  mail.filter((m) => m.to === email && m.purpose === purpose).at(-1)!;
const password = 'a new account secret phrase';
beforeAll(async () => {
  await applyGameSchema(pool);
  await applyIdentitySchema(pool);
});
afterAll(async () => {
  await pool.query('DELETE FROM arcana_identity_challenges WHERE email_key=ANY($1::text[])', [
    emails,
  ]);
  await pool.query('DELETE FROM arcana_identities WHERE email_key=ANY($1::text[])', [emails]);
  await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [ids]);
  await pool.end();
});
describe('recoverable identity PostgreSQL binding', () => {
  it('rolls back the actual kit with the identity when verification fails after initialization', async () => {
    const email = address();
    await service.register({ email });
    const token = latest(email).token;
    failAfterInitialize = true;
    try {
      await expect(service.verify({ token, password })).rejects.toThrow(
        'isolated failure after kit creation',
      );
    } finally {
      failAfterInitialize = false;
    }
    const candidate = ids.at(-1)!;
    expect(
      (await pool.query('SELECT 1 FROM arcana_accounts WHERE player_id=$1', [candidate])).rowCount,
    ).toBe(0);
    expect(
      (await pool.query('SELECT 1 FROM arcana_identities WHERE email_key=$1', [email])).rowCount,
    ).toBe(0);
    expect((await service.verify({ token, password })).playerId).toBe(candidate);
  });
  it('serializes six concurrent mailbox claims without an extra connection or an unreachable kit', async () => {
    const email = address(),
      tokens: string[] = [];
    for (let i = 0; i < 6; i++) {
      await service.register({ email });
      tokens.push(latest(email).token);
    }
    const initial = ids.length;
    const results = await Promise.allSettled(
      tokens.map((token) => service.verify({ token, password })),
    );
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(ids).toHaveLength(initial + 1);
  });
  it('rejects an incompatible current owner before initializing or binding an anonymous challenge', async () => {
    const email = address();
    await service.register({ email });
    const initial = ids.length;
    await expect(
      service.verify({
        token: latest(email).token,
        password,
        expectedPlayerId: 'different-current-owner',
      }),
    ).rejects.toMatchObject({ code: 'PLAYER_MISMATCH' });
    expect(ids).toHaveLength(initial);
    expect(
      (await pool.query('SELECT 1 FROM arcana_identities WHERE email_key=$1', [email])).rowCount,
    ).toBe(0);
    expect(
      (
        await service.verify({
          token: latest(email).token,
          password,
          expectedPlayerId: 'different-current-owner',
          allowPlayerChange: true,
        })
      ).playerId,
    ).toBeDefined();
  });
  it('requires mailbox proof before initialization, delivers no token via response, and recovers same player by login', async () => {
    const email = address(),
      initial = ids.length;
    expect(await service.register({ email })).toBeUndefined();
    expect(ids.length).toBe(initial);
    await expect(service.login({ email, password })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
    const message = latest(email);
    const stored = await pool.query(
      'SELECT token_hash FROM arcana_identity_challenges WHERE email_key=$1',
      [email],
    );
    expect(stored.rows[0].token_hash).not.toBe(message.token);
    const verified = await service.verify({ token: message.token, password });
    const state = await games.read(verified.playerId);
    expect(state.inventory.crowns).toBe(50);
    expect(state.copies).toHaveLength(1);
    expect(await service.login({ email: email.toUpperCase(), password })).toEqual(verified);
    await expect(service.verify({ token: message.token, password })).rejects.toMatchObject({
      code: 'INVALID_TOKEN',
    });
    expect(await games.read(verified.playerId)).toEqual(state);
    expect(await service.identityForPlayer(verified.playerId)).toEqual(verified);
  });
  it('binds the exact guest with unchanged game and denies token possession without that guest authority', async () => {
    const email = address(),
      guest = `identity-guest-${randomUUID()}`;
    ids.push(guest);
    await initialize.execute(guest);
    const before = await games.read(guest);
    await service.register({ email, guestPlayerId: guest });
    const token = latest(email).token;
    await expect(service.verify({ token, password })).rejects.toMatchObject({
      code: 'GUEST_SESSION_REQUIRED',
    });
    await expect(
      service.verify({ token, password, guestPlayerId: `trial-${randomUUID()}` }),
    ).rejects.toMatchObject({ code: 'GUEST_SESSION_REQUIRED' });
    expect((await service.verify({ token, password, guestPlayerId: guest })).playerId).toBe(guest);
    expect(await games.read(guest)).toEqual(before);
    expect((await service.login({ email, password })).playerId).toBe(guest);
  });
  it('allows exactly one concurrent binding of a guest, never both candidates or duplicated kit', async () => {
    const guest = `identity-race-${randomUUID()}`;
    ids.push(guest);
    await initialize.execute(guest);
    const first = address(),
      second = address(),
      before = await games.read(guest);
    await Promise.all([
      service.register({ email: first, guestPlayerId: guest }),
      service.register({ email: second, guestPlayerId: guest }),
    ]);
    const results = await Promise.allSettled([
      service.verify({ token: latest(first).token, password, guestPlayerId: guest }),
      service.verify({ token: latest(second).token, password, guestPlayerId: guest }),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(
      (await pool.query('SELECT * FROM arcana_identities WHERE player_id=$1', [guest])).rowCount,
    ).toBe(1);
    expect(await games.read(guest)).toEqual(before);
  });
  it('does not reserve an unverified email or accept a prechosen attacker password', async () => {
    const email = address();
    await service.register({ email });
    const first = latest(email).token;
    await service.register({ email });
    const second = latest(email).token;
    expect(second).not.toBe(first);
    const verified = await service.verify({
      token: second,
      password: 'the mailbox owner chosen secret',
    });
    const initialized = ids.length;
    await expect(service.verify({ token: first, password })).rejects.toMatchObject({
      code: 'ACCOUNT_CONFLICT',
    });
    expect(ids).toHaveLength(initialized);
    expect(
      (await service.login({ email, password: 'the mailbox owner chosen secret' })).playerId,
    ).toBe(verified.playerId);
    await expect(service.login({ email, password })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
  });
  it('uses expiring single-use reset tokens, increments session version and keeps progress', async () => {
    const email = address();
    await service.register({ email });
    const original = await service.verify({ token: latest(email).token, password }),
      before = await games.read(original.playerId);
    await service.requestReset({ email });
    const token = latest(email, 'reset').token;
    await service.reset({ token, password: 'another sufficiently long secret' });
    await expect(service.reset({ token, password })).rejects.toMatchObject({
      code: 'INVALID_TOKEN',
    });
    await expect(service.login({ email, password })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
    const renewed = await service.login({ email, password: 'another sufficiently long secret' });
    expect(renewed.authVersion).toBe(original.authVersion + 1);
    expect(await games.read(original.playerId)).toEqual(before);
    const count = mail.length;
    await service.requestReset({ email: address() });
    expect(mail).toHaveLength(count);
  });
  it('keeps the same pending player when initialization fails and allows deliberate retry', async () => {
    const email = address();
    await service.register({ email });
    const token = latest(email).token;
    failInitialize = true;
    try {
      await expect(service.verify({ token, password })).rejects.toThrow(
        'isolated initialization failure',
      );
    } finally {
      failInitialize = false;
    }
    const candidate = ids.at(-1)!;
    const result = await service.verify({ token, password });
    expect(result.playerId).toBe(candidate);
    expect((await games.read(candidate)).copies).toHaveLength(1);
  });
  it('rejects expired and cross-purpose challenges without initializing or changing a password', async () => {
    const email = address();
    await service.register({ email });
    const token = latest(email).token;
    await expect(service.reset({ token, password })).rejects.toMatchObject({
      code: 'INVALID_TOKEN',
    });
    now += 24 * 60 * 60 * 1000 + 1;
    await expect(service.verify({ token, password })).rejects.toMatchObject({
      code: 'INVALID_TOKEN',
    });
    expect(await service.identityForPlayer('absent-test-player')).toBeNull();
  });
});
