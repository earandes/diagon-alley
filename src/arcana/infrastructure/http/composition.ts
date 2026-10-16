import type { AuthorityClock } from '../../application/authority-ports';
import { ForgeWandUseCase, OpenObsidianVaultUseCase } from '../../application/commerce-use-cases';
import { ArcanaError } from '../../domain/errors';
import type { Pool } from 'pg';
import { PostgresGameTransactions } from '../postgres/game-transactions';
import { RedisAuthority } from '../redis/authority';
import { SeededRandom } from '../random/seeded-random';
import { CryptoBattleSeeds, CryptoTickets } from '../random/crypto-random';
import { CombatEngine } from '../../domain/combat/engine';
import {
  PurchaseProductUseCase,
  OpenCocoaToadUseCase,
  BuyAndOpenCocoaToadUseCase,
  type OpeningConfiguration,
} from '../../application/shop-use-cases';
import {
  StartRunUseCase,
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
  type CampaignConfiguration,
} from '../../application/run-use-cases';
import { createArcanaApi, type HttpPolicy, type ArcanaApiServices } from './api';
import { SetTeamUseCase, EquipEquipmentUseCase } from '../../application/team-use-cases';
import { SetIntentionUseCase } from '../../application/set-intention';
import { SeasonalEventUseCase } from '../../application/seasonal-events';
import type { SeasonalEdition } from '../../domain/seasonal/events';
import { seasonalEdition } from '../content/seasonal-content';
interface CompositionOptions {
  readonly clock?: AuthorityClock;
  readonly seasonal?: () => SeasonalEdition;
  readonly pool: Pool;
  readonly redis: ConstructorParameters<typeof RedisAuthority>[0];
  readonly namespace: string;
  readonly policy: HttpPolicy;
  readonly opening: () => OpeningConfiguration;
  readonly campaign: () => CampaignConfiguration;
  readonly games?: PostgresGameTransactions;
}
/** Caller owns connections and session provisioning. This factory never imports browser balances. */
export function composeArcanaApi(options: CompositionOptions) {
  const games = options.games ?? new PostgresGameTransactions(options.pool);
  const authority = new RedisAuthority(options.redis, options.namespace);
  const clock = options.clock ?? authority;
  const seeds = new CryptoBattleSeeds(),
    random = { fromSeed: (seed: number) => new SeededRandom(seed) };
  const commerce = () => {
    const config = options.opening().commerce;
    if (!config) throw new ArcanaError('INVALID_WORKSHOP');
    return config;
  };
  const services: ArcanaApiServices = {
    seasonalConfiguration: options.seasonal ?? (() => seasonalEdition),
    seasonalEvent: new SeasonalEventUseCase(
      games,
      options.seasonal ?? (() => seasonalEdition),
      clock,
    ),
    setIntention: new SetIntentionUseCase(games, () => ({
      ownedAffinities: options.campaign().ownedAffinities ?? {},
      beanPrice:
        options.opening().shop.products.find((p) => p.kind === 'random-beans')?.crowns ?? Infinity,
    })),
    forgeWand: new ForgeWandUseCase(games, commerce),
    openVault: new OpenObsidianVaultUseCase(games, commerce, new CryptoTickets()),
    games,
    sessions: authority,
    limits: authority,
    clock,
    opening: options.opening,
    campaign: options.campaign,
    purchase: new PurchaseProductUseCase(games, options.opening),
    buyOpenToad: new BuyAndOpenCocoaToadUseCase(games, options.opening, new CryptoTickets()),
    openToad: new OpenCocoaToadUseCase(games, options.opening, new CryptoTickets()),
    startRun: new StartRunUseCase(
      games,
      options.campaign,
      { seeds, random },
      { clock, configuration: options.seasonal ?? (() => seasonalEdition) },
    ),
    setTeam: new SetTeamUseCase(games, options.campaign),
    equipEquipment: new EquipEquipmentUseCase(games),
    advanceNode: new AdvanceNodeUseCase(
      games,
      options.campaign,
      new ResolveCombatUseCase(new CombatEngine(random), seeds),
      clock,
      random,
      seeds,
    ),
  };
  return { app: createArcanaApi(services, options.policy), services, games, authority };
}
