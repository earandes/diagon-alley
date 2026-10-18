import type { AuthorityClock } from '../../application/authority-ports';
import { Pool } from 'pg';
import { createClient } from 'redis';
import { composeArcanaApi } from './composition';
import { createTrialGateway } from './trial-gateway';
import { trialConfiguration } from '../content/trial-configuration';
import {
  applyGameSchema,
  PostgresGameTransactions,
  gameAccountsInTransaction,
} from '../postgres/game-transactions';
import { InitializePlayerUseCase } from '../../application/team-use-cases';
import { RedisAuthority } from '../redis/authority';
import { applyIdentitySchema, IdentityService } from '../identity/service';
import { applyIdentitySessionSchema, IdentitySessions } from '../identity/sessions';
import { LocalIdentityMail } from '../identity/mail';
import { resolve } from 'node:path';
/** Only this opt-in development launcher uses the local Compose ports and trial data. */
export async function createLocalTrial(
  origin: string,
  namespace = 'arcana-local-trial-v1',
  clock?: AuthorityClock,
) {
  const pool = new Pool({
    host: '127.0.0.1',
    port: 55432,
    user: 'arcana_dev',
    password: 'arcana-local-development',
    database: 'arcana_dev',
    max: 5,
    connectionTimeoutMillis: 3000,
  });
  const redis = createClient({
    url: 'redis://127.0.0.1:56379',
    socket: { reconnectStrategy: false },
  });
  redis.on('error', () => {});
  try {
    await redis.connect();
    await applyGameSchema(pool);
    await applyIdentitySchema(pool);
    await applyIdentitySessionSchema(pool);
    const config = trialConfiguration();
    const raw = new RedisAuthority(redis, namespace);
    const games = new PostgresGameTransactions(pool);
    const initializer = new InitializePlayerUseCase(games, () => config.starter, clock ?? raw);
    const identity = new IdentityService(pool, {
      initializePlayer: (playerId, client) =>
        new InitializePlayerUseCase(
          gameAccountsInTransaction(client),
          () => config.starter,
          clock ?? raw,
        ).execute(playerId),
      // Identity expiry uses real authority time, independent of seasonal fixture clocks.
      now: () => raw.now(),
      mail: new LocalIdentityMail(resolve('.local/arcana-mail', namespace), 'development'),
    });
    const sessions = new IdentitySessions(raw, pool, identity);
    const runtime = composeArcanaApi({
      pool,
      redis,
      namespace,
      clock,
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
      initialize: initializer.execute,
      origin,
    });
    await gateway.ready();
    return {
      gateway,
      close: async () => {
        await gateway.close();
        await runtime.app.close();
        if (redis.isOpen) await redis.close();
        await pool.end();
      },
    };
  } catch (error) {
    if (redis.isOpen) await redis.close();
    await pool.end();
    throw error;
  }
}
