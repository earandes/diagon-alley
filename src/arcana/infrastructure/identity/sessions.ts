import { createHash } from 'node:crypto';
import type { Pool } from 'pg';
import type { Sessions, RequestLimits } from '../../application/authority-ports';
import type { IdentityService } from './service';
import { IdentityError } from './passwords';

const digest = (token: string) => createHash('sha256').update(token).digest('hex');
export async function applyIdentitySessionSchema(pool: Pool): Promise<void> {
  await pool.query(`CREATE TABLE IF NOT EXISTS arcana_identity_sessions (
    token_hash text PRIMARY KEY,
    player_id text NOT NULL REFERENCES arcana_accounts(player_id),
    auth_version integer NOT NULL CHECK(auth_version > 0),
    expires_ms bigint NOT NULL
  )`);
}
/** Redis owns session expiry. SQL binds authenticated sessions to the credential generation. */
export class IdentitySessions implements Sessions, RequestLimits {
  constructor(
    private readonly raw: Sessions & RequestLimits,
    private readonly pool: Pool,
    private readonly identity: Pick<IdentityService, 'identityForPlayer'>,
  ) {}
  async issue(playerId: string, ttlMs: number) {
    const identity = await this.identity.identityForPlayer(playerId);
    if (identity) return this.issueIdentity(playerId, identity.authVersion, ttlMs);
    return this.raw.issue(playerId, ttlMs);
  }
  async issueIdentity(playerId: string, authVersion: number, ttlMs: number) {
    const identity = await this.identity.identityForPlayer(playerId);
    if (!identity || identity.authVersion !== authVersion)
      throw new IdentityError('INVALID_CREDENTIALS');
    const grant = await this.raw.issue(playerId, ttlMs);
    try {
      const inserted = await this.pool.query(
        `INSERT INTO arcana_identity_sessions(token_hash,player_id,auth_version,expires_ms)
           SELECT $1,player_id,auth_version,$4 FROM arcana_identities
           WHERE player_id=$2 AND auth_version=$3 RETURNING token_hash`,
        [digest(grant.token), playerId, authVersion, grant.expiresAt],
      );
      if (!inserted.rowCount) throw new IdentityError('INVALID_CREDENTIALS');
    } catch (error) {
      await this.raw.revoke(grant.token);
      throw error;
    }
    return grant;
  }
  async resolve(token: string): Promise<string | null> {
    const playerId = await this.raw.resolve(token);
    if (!playerId) return null;
    // One SQL snapshot compares the current credential generation and session generation.
    const result = await this.pool.query<{ identity_id: string | null; token_hash: string | null }>(
      `SELECT i.identity_id,s.token_hash FROM arcana_accounts a
       LEFT JOIN arcana_identities i ON i.player_id=a.player_id
       LEFT JOIN arcana_identity_sessions s ON s.player_id=i.player_id
         AND s.auth_version=i.auth_version AND s.token_hash=$1
       WHERE a.player_id=$2`,
      [digest(token), playerId],
    );
    const row = result.rows[0];
    return row && (!row.identity_id || row.token_hash) ? playerId : null;
  }
  async revoke(token: string): Promise<void> {
    await this.raw.revoke(token);
    await this.pool.query('DELETE FROM arcana_identity_sessions WHERE token_hash=$1', [
      digest(token),
    ]);
  }
  consume(subject: string, maximum: number, windowMs: number) {
    return this.raw.consume(subject, maximum, windowMs);
  }
}
