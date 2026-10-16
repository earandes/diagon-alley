import { createHash, randomBytes } from 'node:crypto';
import type {
  AuthorityClock,
  RequestLimits,
  RequestLimitResult,
  Sessions,
  SessionGrant,
} from '../../application/authority-ports';
import { ArcanaError } from '../../domain/errors';
import { validDomainId } from '../../domain/identifiers';

interface RedisCommands {
  sendCommand(args: string[]): Promise<unknown>;
}
const positive = (value: number) => Number.isSafeInteger(value) && value > 0;
const digest = (value: string) => createHash('sha256').update(value).digest('hex');
const issueScript = `
local time = redis.call('TIME')
local now = tonumber(time[1]) * 1000 + math.floor(tonumber(time[2]) / 1000)
redis.call('SET', KEYS[1], ARGV[1], 'PX', ARGV[2])
return now + tonumber(ARGV[2])
`;
const limitScript = `
local count = tonumber(redis.call('GET', KEYS[1]) or '0')
local maximum = tonumber(ARGV[1])
if count >= maximum then
  return {0, count, redis.call('PTTL', KEYS[1])}
end
count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[2]) end
return {1, count, redis.call('PTTL', KEYS[1])}
`;

/** Redis owns ephemeral authority data; balances and regeneration cursors remain transactional SQL. */
export class RedisAuthority implements Sessions, RequestLimits, AuthorityClock {
  constructor(
    private readonly redis: RedisCommands,
    private readonly namespace = 'arcana',
  ) {
    if (!/^[a-zA-Z0-9_:-]{1,120}$/.test(namespace)) throw new ArcanaError('INVALID_SESSION');
  }

  private async call(args: string[]): Promise<unknown> {
    try {
      return await this.redis.sendCommand(args);
    } catch {
      throw new ArcanaError('STORAGE');
    }
  }

  async issue(playerId: string, ttlMs: number): Promise<SessionGrant> {
    if (!validDomainId(playerId) || !positive(ttlMs)) throw new ArcanaError('INVALID_SESSION');
    const token = randomBytes(32).toString('hex');
    const expiresAt = Number(
      await this.call(['EVAL', issueScript, '1', this.sessionKey(token), playerId, String(ttlMs)]),
    );
    if (!Number.isSafeInteger(expiresAt) || expiresAt < 0) throw new ArcanaError('INVALID_TIME');
    return Object.freeze({ token, expiresAt });
  }

  async resolve(token: string): Promise<string | null> {
    if (!/^[a-f0-9]{64}$/.test(token)) return null;
    const playerId = await this.call(['GET', this.sessionKey(token)]);
    if (playerId === null) return null;
    if (!validDomainId(playerId)) throw new ArcanaError('INVALID_SESSION');
    return playerId;
  }

  async revoke(token: string): Promise<void> {
    if (/^[a-f0-9]{64}$/.test(token)) await this.call(['DEL', this.sessionKey(token)]);
  }

  async consume(subject: string, maximum: number, windowMs: number): Promise<RequestLimitResult> {
    if (!subject || subject.length > 200 || !positive(maximum) || !positive(windowMs))
      throw new ArcanaError('INVALID_RATE_LIMIT');
    const reply = await this.call([
      'EVAL',
      limitScript,
      '1',
      `${this.namespace}:rate:${digest(subject)}`,
      String(maximum),
      String(windowMs),
    ]);
    if (!Array.isArray(reply) || reply.length !== 3) throw new ArcanaError('INVALID_RATE_LIMIT');
    const [allowed, count, ttl] = reply.map(Number);
    if (
      ![0, 1].includes(allowed) ||
      !Number.isSafeInteger(count) ||
      count < 1 ||
      !Number.isSafeInteger(ttl) ||
      ttl < 0
    )
      throw new ArcanaError('INVALID_RATE_LIMIT');
    return Object.freeze({
      allowed: allowed === 1,
      remaining: Math.max(0, maximum - count),
      retryAfterMs: allowed === 1 ? 0 : ttl,
    });
  }

  async now(): Promise<number> {
    const reply = await this.call(['TIME']);
    if (!Array.isArray(reply) || reply.length !== 2) throw new ArcanaError('INVALID_TIME');
    const timestamp = Number(reply[0]) * 1000 + Math.floor(Number(reply[1]) / 1000);
    if (!Number.isSafeInteger(timestamp) || timestamp < 0) throw new ArcanaError('INVALID_TIME');
    return timestamp;
  }

  private sessionKey(token: string): string {
    return `${this.namespace}:session:${digest(token)}`;
  }
}
