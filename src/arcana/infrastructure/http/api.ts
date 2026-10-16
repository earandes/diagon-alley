import type { ForgeWandRequest, OpenVaultRequest } from '../../domain/economy/commerce';
import type {
  ForgeWandUseCase,
  OpenObsidianVaultUseCase,
} from '../../application/commerce-use-cases';
import { projectPlayerStatus } from '../../application/player-status';
import Fastify, { type FastifyInstance, type FastifyRequest } from 'fastify';
import type { Sessions, RequestLimits, AuthorityClock } from '../../application/authority-ports';
import {
  operationResult,
  type GameTransactions,
  type OpenToadRequest,
  type BuyOpenToadRequest,
  type OperationCommand,
} from '../../application/game';
import type {
  PurchaseProductUseCase,
  OpenCocoaToadUseCase,
  BuyAndOpenCocoaToadUseCase,
  OpeningConfiguration,
} from '../../application/shop-use-cases';
import type {
  StartRunUseCase,
  AdvanceNodeUseCase,
  CampaignConfiguration,
} from '../../application/run-use-cases';
import type { StartRunRequest, AdvanceNodeRequest } from '../../application/run-contracts';
import type { PurchaseRequest } from '../../domain/economy/inventory';
import { projectPublicContent } from '../../application/public-content';
import type { SetTeamUseCase, EquipEquipmentUseCase } from '../../application/team-use-cases';
import type { SetTeamRequest, EquipEquipmentRequest } from '../../application/team-contracts';
import { ArcanaError, type ArcanaErrorCode } from '../../domain/errors';
import { validDomainId } from '../../domain/identifiers';
import {
  purchaseSchema,
  openingSchema,
  buyOpeningSchema,
  startRunSchema,
  advanceNodeSchema,
  operationParams,
  noQuery,
  setTeamSchema,
  equipEquipmentSchema,
  forgeWandSchema,
  openVaultSchema,
} from './schemas';

export interface ArcanaApiServices {
  readonly forgeWand: ForgeWandUseCase;
  readonly openVault: OpenObsidianVaultUseCase;
  readonly games: GameTransactions;
  readonly sessions: Sessions;
  readonly limits: RequestLimits;
  readonly clock: AuthorityClock;
  readonly opening: () => OpeningConfiguration;
  readonly campaign: () => CampaignConfiguration;
  readonly purchase: PurchaseProductUseCase;
  readonly buyOpenToad: BuyAndOpenCocoaToadUseCase;
  readonly openToad: OpenCocoaToadUseCase;
  readonly startRun: StartRunUseCase;
  readonly advanceNode: AdvanceNodeUseCase;
  readonly setTeam: SetTeamUseCase;
  readonly equipEquipment: EquipEquipmentUseCase;
}
export interface HttpPolicy {
  readonly bodyLimit: number;
  readonly maximumPerIp: number;
  readonly maximumPerPlayer: number;
  readonly windowMs: number;
}
const conflict = new Set<ArcanaErrorCode>([
  'STALE_GAME',
  'STALE_PRICE',
  'STALE_WORKSHOP',
  'STALE_TABLE',
  'STALE_GRAPH',
  'STALE_CAMPAIGN',
  'OPERATION_CONFLICT',
  'RUN_ACTIVE',
]);
const internal = new Set<ArcanaErrorCode>([
  'INVALID_GAME',
  'INVALID_INVENTORY',
  'INVALID_CATALOG',
  'INVALID_TOAD_TABLE',
  'INVALID_SHOP',
  'INVALID_WORKSHOP',
  'INVALID_BEAN_TABLE',
  'INVALID_CAMPAIGN',
  'INVALID_COMBAT',
  'INVALID_RANDOM_TICKET',
  'INVALID_RANDOM_BOUND',
  'INVALID_TIME',
  'INVALID_RATE_LIMIT',
]);
function domainStatus(code: ArcanaErrorCode): number {
  if (code === 'STORAGE' || code === 'UNKNOWN_COMMIT') return 503;
  if (code === 'PLAYER_NOT_FOUND') return 404;
  if (code === 'INVALID_SESSION') return 401;
  if (conflict.has(code)) return 409;
  if (internal.has(code)) return 500;
  return 422;
}
/** Transport validates intent; application owns all game rules and transactional writes. */
export function createArcanaApi(services: ArcanaApiServices, policy: HttpPolicy): FastifyInstance {
  if (
    !policy ||
    [policy.bodyLimit, policy.maximumPerIp, policy.maximumPerPlayer, policy.windowMs].some(
      (n) => !Number.isSafeInteger(n) || n < 1,
    ) ||
    policy.bodyLimit > 1_048_576
  )
    throw new ArcanaError('INVALID_RATE_LIMIT');
  const app = Fastify({
    logger: false,
    trustProxy: false,
    bodyLimit: policy.bodyLimit,
    ajv: { customOptions: { removeAdditional: false, coerceTypes: false, useDefaults: false } },
  });
  const identities = new WeakMap<FastifyRequest, { playerId: string; token: string }>();
  const identity = (request: FastifyRequest) => {
    const value = identities.get(request);
    if (!value) throw new ArcanaError('INVALID_SESSION');
    return value;
  };
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ArcanaError) {
      return reply.code(domainStatus(error.code)).send({
        error: {
          code: error.code,
          ...(error.code === 'UNKNOWN_COMMIT' ? { recoverWithSameKey: true } : {}),
        },
      });
    }
    const transport = error as { validation?: unknown; statusCode?: number; code?: string };
    if (transport.validation || transport.statusCode === 400 || transport.statusCode === 415)
      return reply.code(400).send({ error: { code: 'INVALID_REQUEST' } });
    if (transport.statusCode === 413)
      return reply.code(413).send({ error: { code: 'PAYLOAD_TOO_LARGE' } });
    return reply.code(500).send({ error: { code: 'INTERNAL_ERROR' } });
  });
  app.setNotFoundHandler((_request, reply) =>
    reply.code(404).send({ error: { code: 'NOT_FOUND' } }),
  );
  app.addHook('onRequest', async (request, reply) => {
    reply.header('Cache-Control', 'no-store').header('X-Content-Type-Options', 'nosniff');
    const ipLimit = await services.limits.consume(
      `ip:${request.ip}`,
      policy.maximumPerIp,
      policy.windowMs,
    );
    if (!ipLimit.allowed)
      return reply
        .header('Retry-After', String(Math.ceil(ipLimit.retryAfterMs / 1000)))
        .code(429)
        .send({ error: { code: 'RATE_LIMITED' } });
    const authorization = request.headers.authorization;
    const token =
      typeof authorization === 'string'
        ? /^Bearer ([a-f0-9]{64})$/.exec(authorization)?.[1]
        : undefined;
    const playerId = token ? await services.sessions.resolve(token) : null;
    if (!token || !playerId) return reply.code(401).send({ error: { code: 'UNAUTHORIZED' } });
    if (!validDomainId(playerId)) throw new ArcanaError('INVALID_SESSION');
    const playerLimit = await services.limits.consume(
      `player:${playerId}`,
      policy.maximumPerPlayer,
      policy.windowMs,
    );
    if (!playerLimit.allowed)
      return reply
        .header('Retry-After', String(Math.ceil(playerLimit.retryAfterMs / 1000)))
        .code(429)
        .send({ error: { code: 'RATE_LIMITED' } });
    identities.set(request, { playerId, token });
    if (
      request.method === 'POST' &&
      request.headers['content-type']?.split(';')[0].toLowerCase().trim() !== 'application/json'
    )
      return reply.code(400).send({ error: { code: 'INVALID_REQUEST' } });
  });
  const query = { querystring: noQuery };
  app.get('/api/state', { schema: query }, async (request) =>
    projectPlayerStatus(
      await services.games.read(identity(request).playerId),
      await services.clock.now(),
    ),
  );
  app.get('/api/content', { schema: query }, async () => {
    return projectPublicContent(services.opening(), services.campaign());
  });
  app.get<{ Params: { id: string } }>(
    '/api/operations/:id',
    { schema: { ...query, params: operationParams } },
    async (request, reply) => {
      const state = await services.games.read(identity(request).playerId);
      if (!state.receipts.some((r) => r.id === request.params.id))
        return reply.code(404).send({ error: { code: 'NOT_FOUND' } });
      return operationResult(state, request.params.id);
    },
  );
  app.post<{ Body: OperationCommand<PurchaseRequest> }>(
    '/api/purchases',
    { schema: { ...query, body: purchaseSchema } },
    (request) => services.purchase.execute(identity(request).playerId, request.body),
  );
  app.post<{ Body: OperationCommand<BuyOpenToadRequest> }>(
    '/api/toads/buy-open',
    { schema: { ...query, body: buyOpeningSchema } },
    (request) => services.buyOpenToad.execute(identity(request).playerId, request.body),
  );
  app.post<{ Body: OperationCommand<OpenToadRequest> }>(
    '/api/toads/open',
    { schema: { ...query, body: openingSchema } },
    (request) => services.openToad.execute(identity(request).playerId, request.body),
  );
  app.post<{ Body: OperationCommand<StartRunRequest> }>(
    '/api/runs',
    { schema: { ...query, body: startRunSchema } },
    (request) => services.startRun.execute(identity(request).playerId, request.body),
  );
  app.post<{ Body: OperationCommand<AdvanceNodeRequest> }>(
    '/api/nodes/advance',
    { schema: { ...query, body: advanceNodeSchema } },
    (request) => services.advanceNode.execute(identity(request).playerId, request.body),
  );
  app.delete('/api/session', { schema: query }, async (request, reply) => {
    await services.sessions.revoke(identity(request).token);
    return reply.code(204).send();
  });
  app.post<{ Body: OperationCommand<SetTeamRequest> }>(
    '/api/team',
    { schema: { ...query, body: setTeamSchema } },
    (request) => services.setTeam.execute(identity(request).playerId, request.body),
  );
  app.post<{ Body: OperationCommand<EquipEquipmentRequest> }>(
    '/api/equipment',
    { schema: { ...query, body: equipEquipmentSchema } },
    (request) => services.equipEquipment.execute(identity(request).playerId, request.body),
  );
  app.post<{ Body: OperationCommand<ForgeWandRequest> }>(
    '/api/wands/forge',
    { schema: { ...query, body: forgeWandSchema } },
    (request) => services.forgeWand.execute(identity(request).playerId, request.body),
  );
  app.post<{ Body: OperationCommand<OpenVaultRequest> }>(
    '/api/vaults/open',
    { schema: { ...query, body: openVaultSchema } },
    (request) => services.openVault.execute(identity(request).playerId, request.body),
  );
  return app;
}
