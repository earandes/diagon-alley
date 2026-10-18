import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import type { Pool, PoolClient } from 'pg';
import { validDomainId } from '../../domain/identifiers';
import { IdentityError, normalizeEmail, ScryptPasswords, type Passwords } from './passwords';
import type { IdentityMailTransport } from './mail';

export interface IdentityAccount {
  readonly identityId: string;
  readonly playerId: string;
  readonly email: string;
  readonly authVersion: number;
}
interface IdentityRow {
  identity_id: string;
  player_id: string;
  email_key: string;
  auth_version: number;
  password_hash: string;
}
interface ChallengeRow {
  token_hash: string;
  purpose: 'verify' | 'reset';
  email_key: string;
  player_id: string;
  guest_binding: boolean;
  expires_ms: string;
  used_ms: string | null;
}
export interface IdentityServiceOptions {
  readonly initializePlayer: (playerId: string, client: PoolClient) => Promise<unknown>;
  readonly now: () => Promise<number> | number;
  readonly mail: IdentityMailTransport;
  readonly passwords?: Passwords;
}
const digest = (value: string) => createHash('sha256').update(value).digest('hex');
const validToken = (value: string) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const account = (row: IdentityRow): IdentityAccount =>
  Object.freeze({
    identityId: row.identity_id,
    playerId: row.player_id,
    email: row.email_key,
    authVersion: row.auth_version,
  });
const dummyHash = `scrypt:32768:8:3:${'0'.repeat(32)}:${'0'.repeat(128)}`;

export async function applyIdentitySchema(pool: Pool): Promise<void> {
  await pool.query(await readFile(new URL('./schema.sql', import.meta.url), 'utf8'));
}

/** Persistent credentials are separate from game state; a verified binding never copies inventory. */
export class IdentityService {
  private readonly passwords: Passwords;
  constructor(
    private readonly pool: Pool,
    private readonly options: IdentityServiceOptions,
  ) {
    this.passwords = options.passwords ?? new ScryptPasswords();
  }
  private async transaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await work(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      if ((error as { code?: string }).code === '23505')
        throw new IdentityError('ACCOUNT_CONFLICT');
      throw error;
    } finally {
      client.release();
    }
  }
  private async now(): Promise<number> {
    const now = await this.options.now();
    if (!Number.isSafeInteger(now) || now < 0) throw new IdentityError('STORAGE');
    return now;
  }
  private async challenge(
    token: string,
    purpose: 'verify' | 'reset',
    client: Pool | PoolClient = this.pool,
    lock = false,
  ): Promise<ChallengeRow> {
    if (!validToken(token)) throw new IdentityError('INVALID_TOKEN');
    const result = await client.query<ChallengeRow>(
      `SELECT * FROM arcana_identity_challenges WHERE token_hash=$1${lock ? ' FOR UPDATE' : ''}`,
      [digest(token)],
    );
    const row = result.rows[0];
    if (
      !row ||
      row.purpose !== purpose ||
      row.used_ms !== null ||
      Number(row.expires_ms) <= (await this.now())
    )
      throw new IdentityError('INVALID_TOKEN');
    return row;
  }
  async register(input: {
    readonly email: string;
    readonly guestPlayerId?: string;
  }): Promise<void> {
    const email = normalizeEmail(input.email),
      now = await this.now();
    if (input.guestPlayerId !== undefined && !validDomainId(input.guestPlayerId))
      throw new IdentityError('GUEST_SESSION_REQUIRED');
    const token = randomBytes(32).toString('hex'),
      expiresAt = now + 24 * 60 * 60 * 1000;
    const queued = await this.transaction(async (client) => {
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`identity-email:${email}`]);
      if (
        (await client.query('SELECT 1 FROM arcana_identities WHERE email_key=$1', [email])).rowCount
      )
        return false;
      if (input.guestPlayerId) {
        await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
          `identity-player:${input.guestPlayerId}`,
        ]);
        if (
          !(
            await client.query('SELECT 1 FROM arcana_accounts WHERE player_id=$1', [
              input.guestPlayerId,
            ])
          ).rowCount ||
          (
            await client.query('SELECT 1 FROM arcana_identities WHERE player_id=$1', [
              input.guestPlayerId,
            ])
          ).rowCount
        )
          throw new IdentityError('GUEST_SESSION_REQUIRED');
      }
      await client.query(
        'INSERT INTO arcana_identity_challenges(token_hash,purpose,email_key,player_id,guest_binding,expires_ms,created_ms) VALUES($1,$2,$3,$4,$5,$6,$7)',
        [
          digest(token),
          'verify',
          email,
          input.guestPlayerId ?? `account-${randomUUID()}`,
          input.guestPlayerId !== undefined,
          expiresAt,
          now,
        ],
      );
      return true;
    });
    if (queued) await this.options.mail.send({ to: email, purpose: 'verify', token, expiresAt });
  }
  async verify(input: {
    readonly token: string;
    readonly password: string;
    readonly guestPlayerId?: string;
    readonly expectedPlayerId?: string;
    readonly allowPlayerChange?: boolean;
  }): Promise<IdentityAccount> {
    const pending = await this.challenge(input.token, 'verify');
    const checkOwner = (playerId: string) => {
      if (input.expectedPlayerId !== undefined && !validDomainId(input.expectedPlayerId))
        throw new IdentityError('INVALID_CREDENTIALS');
      if (input.expectedPlayerId && input.expectedPlayerId !== playerId && !input.allowPlayerChange)
        throw new IdentityError('PLAYER_MISMATCH');
    };
    checkOwner(pending.player_id);
    if (pending.guest_binding && input.guestPlayerId !== pending.player_id)
      throw new IdentityError('GUEST_SESSION_REQUIRED');
    const password = await this.passwords.hash(input.password);
    return this.transaction(async (client) => {
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        `identity-email:${pending.email_key}`,
      ]);
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        `identity-player:${pending.player_id}`,
      ]);
      const current = await this.challenge(input.token, 'verify', client, true);
      checkOwner(current.player_id);
      if (current.guest_binding && input.guestPlayerId !== current.player_id)
        throw new IdentityError('GUEST_SESSION_REQUIRED');
      if (
        (
          await client.query('SELECT 1 FROM arcana_identities WHERE email_key=$1 OR player_id=$2', [
            current.email_key,
            current.player_id,
          ])
        ).rowCount
      )
        throw new IdentityError('ACCOUNT_CONFLICT');
      // The game initializer uses this same SQL transaction. No spare pool connection
      // or independently committed kit is required while holding the mailbox lock.
      // Failure rolls back both game creation and binding, keeping the token retryable.
      if (!current.guest_binding) await this.options.initializePlayer(current.player_id, client);
      const now = await this.now(),
        identityId = randomUUID();
      const result = await client.query<IdentityRow>(
        'INSERT INTO arcana_identities(identity_id,email_key,password_hash,player_id,created_ms) VALUES($1,$2,$3,$4,$5) RETURNING *',
        [identityId, current.email_key, password, current.player_id, now],
      );
      await client.query('UPDATE arcana_identity_challenges SET used_ms=$1 WHERE token_hash=$2', [
        now,
        digest(input.token),
      ]);
      return account(result.rows[0]);
    });
  }
  async login(input: {
    readonly email: string;
    readonly password: string;
  }): Promise<IdentityAccount> {
    let email: string;
    try {
      email = normalizeEmail(input.email);
    } catch {
      await this.passwords.verify(input.password, dummyHash);
      throw new IdentityError('INVALID_CREDENTIALS');
    }
    const result = await this.pool.query<IdentityRow>(
      'SELECT * FROM arcana_identities WHERE email_key=$1',
      [email],
    );
    const row = result.rows[0],
      valid = await this.passwords.verify(input.password, row?.password_hash ?? dummyHash);
    if (!row || !valid) throw new IdentityError('INVALID_CREDENTIALS');
    const fresh = (
      await this.pool.query<IdentityRow>('SELECT * FROM arcana_identities WHERE identity_id=$1', [
        row.identity_id,
      ])
    ).rows[0];
    if (
      !fresh ||
      fresh.password_hash !== row.password_hash ||
      fresh.auth_version !== row.auth_version
    )
      throw new IdentityError('INVALID_CREDENTIALS');
    return account(fresh);
  }
  async requestReset(input: { readonly email: string }): Promise<void> {
    const email = normalizeEmail(input.email),
      now = await this.now();
    const row = (
      await this.pool.query<IdentityRow>('SELECT * FROM arcana_identities WHERE email_key=$1', [
        email,
      ])
    ).rows[0];
    if (!row) return;
    const token = randomBytes(32).toString('hex'),
      expiresAt = now + 30 * 60 * 1000;
    await this.pool.query(
      'INSERT INTO arcana_identity_challenges(token_hash,purpose,email_key,player_id,guest_binding,expires_ms,created_ms) VALUES($1,$2,$3,$4,false,$5,$6)',
      [digest(token), 'reset', email, row.player_id, expiresAt, now],
    );
    await this.options.mail.send({ to: email, purpose: 'reset', token, expiresAt });
  }
  async reset(input: { readonly token: string; readonly password: string }): Promise<void> {
    const pending = await this.challenge(input.token, 'reset'),
      password = await this.passwords.hash(input.password);
    await this.transaction(async (client) => {
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        `identity-email:${pending.email_key}`,
      ]);
      const current = await this.challenge(input.token, 'reset', client, true),
        now = await this.now();
      const updated = await client.query(
        'UPDATE arcana_identities SET password_hash=$1,auth_version=auth_version+1 WHERE email_key=$2 AND player_id=$3',
        [password, current.email_key, current.player_id],
      );
      if (updated.rowCount !== 1) throw new IdentityError('INVALID_TOKEN');
      await client.query(
        'UPDATE arcana_identity_challenges SET used_ms=$1 WHERE email_key=$2 AND purpose=$3 AND used_ms IS NULL',
        [now, current.email_key, 'reset'],
      );
    });
  }
  async identityForPlayer(playerId: string): Promise<IdentityAccount | null> {
    if (!validDomainId(playerId)) return null;
    const row = (
      await this.pool.query<IdentityRow>('SELECT * FROM arcana_identities WHERE player_id=$1', [
        playerId,
      ])
    ).rows[0];
    return row ? account(row) : null;
  }
}
