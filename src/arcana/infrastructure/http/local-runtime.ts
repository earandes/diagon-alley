import type { AuthorityClock } from '../../application/authority-ports';
import { Pool } from 'pg';
import { createClient } from 'redis';
import { composeArcanaApi } from './composition';
import { createTrialGateway } from './trial-gateway';
import { trialConfiguration } from '../content/trial-configuration';
import { applyGameSchema } from '../postgres/game-transactions';
import { InitializePlayerUseCase } from '../../application/team-use-cases';
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
    const config = trialConfiguration();
    const runtime = composeArcanaApi({
      pool,
      redis,
      namespace,
      clock,
      opening: () => config.opening,
      campaign: () => config.campaign,
      policy: { bodyLimit: 16384, maximumPerIp: 1000, maximumPerPlayer: 500, windowMs: 60000 },
    });
    const initializer = new InitializePlayerUseCase(
      runtime.games,
      () => config.starter,
      runtime.services.clock,
    );
    const gateway = createTrialGateway({
      api: runtime.app,
      authority: runtime.authority,
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
