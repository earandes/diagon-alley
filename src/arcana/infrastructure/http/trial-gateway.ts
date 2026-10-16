import { randomUUID } from 'node:crypto';
import Fastify, { type FastifyInstance } from 'fastify';
import type { Sessions, RequestLimits } from '../../application/authority-ports';
import { validDomainId } from '../../domain/identifiers';
interface TrialGatewayOptions {
  readonly api: FastifyInstance;
  readonly authority: Sessions & RequestLimits;
  readonly initialize: (id: string) => Promise<unknown>;
  readonly origin: string;
}
const ttl = 7 * 24 * 60 * 60 * 1000;
const sessionCookie = (header: string | undefined) =>
  /(?:^|;\s*)arcana_trial=([a-f0-9]{64})(?:;|$)/.exec(header ?? '')?.[1];
/** Development-only same-origin gateway. Production account recovery is not implemented here. */
export function createTrialGateway(options: TrialGatewayOptions): FastifyInstance {
  const url = new URL(options.origin);
  if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || url.origin !== options.origin)
    throw Error('Trial origin must be loopback');
  const app = Fastify({
    logger: false,
    trustProxy: false,
    bodyLimit: 16384,
    ajv: { customOptions: { removeAdditional: false, coerceTypes: false, useDefaults: false } },
  });
  app.setErrorHandler((error, _request, reply) =>
    reply.code((error as { validation?: unknown }).validation ? 400 : 503).send({
      error: {
        code: (error as { validation?: unknown }).validation ? 'INVALID_REQUEST' : 'STORAGE',
      },
    }),
  );
  app.addHook('onRequest', async (request, reply) => {
    reply.header('Cache-Control', 'no-store').header('X-Content-Type-Options', 'nosniff');
    if (['POST', 'DELETE'].includes(request.method) && request.headers.origin !== options.origin)
      return reply.code(403).send({ error: { code: 'INVALID_ORIGIN' } });
  });
  app.post(
    '/api/trial/session',
    { schema: { body: { type: 'object', additionalProperties: false, properties: {} } } },
    async (request, reply) => {
      const existing = sessionCookie(request.headers.cookie);
      if (existing && (await options.authority.resolve(existing))) return reply.code(204).send();
      const limit = await options.authority.consume(`trial-entry:${request.ip}`, 30, 3600000);
      if (!limit.allowed)
        return reply
          .header('Retry-After', String(Math.ceil(limit.retryAfterMs / 1000)))
          .code(429)
          .send({ error: { code: 'RATE_LIMITED' } });
      const id = 'trial-' + randomUUID();
      await options.initialize(id);
      const grant = await options.authority.issue(id, ttl);
      return reply
        .header(
          'Set-Cookie',
          `arcana_trial=${grant.token}; Path=/api; Max-Age=${ttl / 1000}; HttpOnly; SameSite=Strict`,
        )
        .code(204)
        .send();
    },
  );
  app.route({
    method: ['GET', 'POST', 'DELETE'],
    url: '/api/*',
    handler: async (request, reply) => {
      if (request.url.split('?')[0] === '/api/trial/session')
        return reply.code(404).send({ error: { code: 'NOT_FOUND' } });
      const token = sessionCookie(request.headers.cookie),
        player = token ? await options.authority.resolve(token) : null;
      if (!token || !player) return reply.code(401).send({ error: { code: 'UNAUTHORIZED' } });
      const expected = request.headers['x-arcana-player'];
      if (request.url.split('?')[0] !== '/api/state' && expected !== undefined) {
        if (typeof expected !== 'string' || !validDomainId(expected))
          return reply.code(400).send({ error: { code: 'INVALID_REQUEST' } });
        if (expected !== player)
          return reply
            .code(409)
            .send({ error: { code: 'PLAYER_MISMATCH', recoverWithSameKey: true } });
      }
      const result = await options.api.inject({
        method: request.method as 'GET' | 'POST' | 'DELETE',
        url: request.url,
        remoteAddress: request.ip,
        headers: {
          authorization: `Bearer ${token}`,
          ...(request.headers['content-type']
            ? { 'content-type': request.headers['content-type'] }
            : {}),
        },
        ...(request.body === undefined ? {} : { payload: request.body as object }),
      });
      if (
        request.method === 'DELETE' &&
        request.url === '/api/session' &&
        result.statusCode === 204
      )
        reply.header(
          'Set-Cookie',
          'arcana_trial=; Path=/api; Max-Age=0; HttpOnly; SameSite=Strict',
        );
      reply.code(result.statusCode);
      for (const name of ['content-type', 'cache-control', 'x-content-type-options', 'retry-after'])
        if (result.headers[name]) reply.header(name, result.headers[name]);
      return reply.send(result.body);
    },
  });
  return app;
}
