import { createHash } from 'node:crypto';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { Sessions, RequestLimits } from '../../application/authority-ports';
import { validDomainId } from '../../domain/identifiers';
import type { IdentityService, IdentityAccount } from '../identity/service';
import { IdentityError } from '../identity/passwords';

export const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;
export const sessionCookie = (header: string | undefined) =>
  /(?:^|;\s*)arcana_trial=([a-f0-9]{64})(?:;|$)/.exec(header ?? '')?.[1];
const cookieHeader = (token: string, ttl = SESSION_TTL) =>
  `arcana_trial=${token}; Path=/api; Max-Age=${ttl / 1000}; HttpOnly; SameSite=Strict`;
export const sessionHeader = cookieHeader;
const identityFields = {
  expectedPlayerId: { type: 'string', minLength: 1, maxLength: 200 },
  allowPlayerChange: { type: 'boolean' },
};
const stringField = (maxLength: number) => ({ type: 'string', minLength: 1, maxLength });
const schema = (properties: object, required: string[]) => ({
  body: { type: 'object', additionalProperties: false, properties, required },
});
type Owner = { expectedPlayerId?: string; allowPlayerChange?: boolean };
export function registerIdentityRoutes(
  app: FastifyInstance,
  identity: IdentityService,
  authority: Sessions & RequestLimits,
) {
  const current = async (request: FastifyRequest) => {
    const token = sessionCookie(request.headers.cookie);
    return { token, playerId: token ? await authority.resolve(token) : null };
  };
  const limited = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { email?: string; token?: string };
    const subject = createHash('sha256')
      .update(body?.email?.trim().toLowerCase() ?? body?.token ?? request.ip)
      .digest('hex');
    for (const [key, maximum] of [
      [`auth-ip:${request.ip}`, 60],
      [`auth-subject:${request.url}:${subject}`, 10],
    ] as const) {
      const result = await authority.consume(key, maximum, 15 * 60 * 1000);
      if (!result.allowed) {
        reply
          .header('Retry-After', String(Math.ceil(result.retryAfterMs / 1000)))
          .code(429)
          .send({ error: { code: 'RATE_LIMITED' } });
        return false;
      }
    }
    return true;
  };
  const owner = (body: Owner, actual: string | null, target?: string) => {
    if (body.expectedPlayerId !== undefined && !validDomainId(body.expectedPlayerId))
      throw new IdentityError('INVALID_CREDENTIALS');
    if (
      actual &&
      body.expectedPlayerId &&
      actual !== body.expectedPlayerId &&
      target !== body.expectedPlayerId
    )
      throw new Error('PLAYER_MISMATCH');
    if (
      target &&
      target !== (body.expectedPlayerId ?? actual) &&
      (body.expectedPlayerId || actual) &&
      !body.allowPlayerChange
    )
      throw new Error('PLAYER_MISMATCH');
  };
  const grant = async (account: IdentityAccount, old: string | undefined, reply: FastifyReply) => {
    const secured = authority as Sessions &
      RequestLimits & {
        issueIdentity?: (
          playerId: string,
          version: number,
          ttl: number,
        ) => ReturnType<Sessions['issue']>;
      };
    if (typeof secured.issueIdentity !== 'function')
      throw Error('Identity session authority required');
    const next = await secured.issueIdentity(account.playerId, account.authVersion, SESSION_TTL);
    if (old) await authority.revoke(old);
    return reply
      .header('Set-Cookie', cookieHeader(next.token))
      .send({ playerId: account.playerId });
  };
  app.get('/api/auth/session', async (request) => {
    const session = await current(request);
    if (!session.playerId) return { kind: 'anonymous' };
    const account = await identity.identityForPlayer(session.playerId);
    return account
      ? { kind: 'account', playerId: account.playerId, email: account.email }
      : { kind: 'guest', playerId: session.playerId };
  });
  const route = (
    path: string,
    routeSchema: object,
    handler: (request: FastifyRequest, reply: FastifyReply) => Promise<unknown>,
  ) => {
    app.post(path, { schema: routeSchema }, async (request, reply) => {
      try {
        if (!(await limited(request, reply))) return;
        return await handler(request, reply);
      } catch (error) {
        const code =
          error instanceof IdentityError
            ? error.code
            : error instanceof Error && error.message === 'PLAYER_MISMATCH'
              ? 'PLAYER_MISMATCH'
              : 'STORAGE';
        const status =
          code === 'STORAGE'
            ? 503
            : code === 'PLAYER_MISMATCH' || code === 'ACCOUNT_CONFLICT'
              ? 409
              : 400;
        return reply.code(status).send({ error: { code } });
      }
    });
  };
  route(
    '/api/auth/register',
    schema({ email: stringField(254), ...identityFields }, ['email']),
    async (request) => {
      const body = request.body as { email: string } & Owner;
      const session = await current(request);
      owner(body, session.playerId);
      if (body.expectedPlayerId && !session.playerId)
        throw new IdentityError('GUEST_SESSION_REQUIRED');
      const linked = session.playerId ? await identity.identityForPlayer(session.playerId) : null;
      if (linked) throw new IdentityError('ACCOUNT_CONFLICT');
      await identity.register({
        email: body.email,
        ...(session.playerId ? { guestPlayerId: session.playerId } : {}),
      });
      return { accepted: true };
    },
  );
  route(
    '/api/auth/verify',
    schema({ token: stringField(64), password: stringField(128), ...identityFields }, [
      'token',
      'password',
    ]),
    async (request, reply) => {
      const body = request.body as { token: string; password: string } & Owner;
      const session = await current(request);
      owner(body, session.playerId);
      const account = await identity.verify({
        token: body.token,
        password: body.password,
        ...(session.playerId ? { guestPlayerId: session.playerId } : {}),
        expectedPlayerId: body.expectedPlayerId ?? session.playerId ?? undefined,
        allowPlayerChange: body.allowPlayerChange,
      });
      owner(body, session.playerId, account.playerId);
      return grant(account, session.token, reply);
    },
  );
  route(
    '/api/auth/login',
    schema({ email: stringField(254), password: stringField(128), ...identityFields }, [
      'email',
      'password',
    ]),
    async (request, reply) => {
      const body = request.body as { email: string; password: string } & Owner;
      const session = await current(request);
      const account = await identity.login(body);
      owner(body, session.playerId, account.playerId);
      return grant(account, session.token, reply);
    },
  );
  route(
    '/api/auth/request-reset',
    schema({ email: stringField(254) }, ['email']),
    async (request) => {
      await identity.requestReset(request.body as { email: string });
      return { accepted: true };
    },
  );
  route(
    '/api/auth/reset',
    schema({ token: stringField(64), password: stringField(128) }, ['token', 'password']),
    async (request) => {
      await identity.reset(request.body as { token: string; password: string });
      return { accepted: true };
    },
  );
  route('/api/auth/logout', schema({ ...identityFields }, []), async (request, reply) => {
    const session = await current(request);
    owner(request.body as Owner, session.playerId);
    if (session.token) await authority.revoke(session.token);
    return reply.header('Set-Cookie', cookieHeader('', 0)).send({ accepted: true });
  });
}
