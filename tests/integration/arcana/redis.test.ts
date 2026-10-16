import { randomUUID } from 'node:crypto';
import { createClient } from 'redis';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { RedisAuthority } from '../../../src/arcana/infrastructure/redis/authority';
const client = createClient({
  url: 'redis://127.0.0.1:56379',
  socket: { connectTimeout: 3000, reconnectStrategy: false },
});
client.on('error', () => {});
const namespace = 'arcana:test:' + randomUUID();
const authority = new RedisAuthority(client, namespace);
beforeAll(async () => {
  await client.connect();
});
afterAll(async () => {
  if (client.isOpen) {
    for await (const keys of client.scanIterator({ MATCH: namespace + ':*', COUNT: 100 }))
      if (keys.length) await client.del(keys);
    await client.quit();
  }
});
describe('ARCANA real Redis sessions, rate limit and authority clock', () => {
  it('issues opaque tokens, resolves only its player and revokes a session', async () => {
    const session = await authority.issue('player-a', 60_000);
    expect(session.token.length).toBeGreaterThan(40);
    expect(session.token).not.toContain('player-a');
    expect(await authority.resolve(session.token)).toBe('player-a');
    expect(await authority.resolve('not-a-session')).toBeNull();
    await authority.revoke(session.token);
    expect(await authority.resolve(session.token)).toBeNull();
  });
  it('actually expires sessions by Redis TTL', async () => {
    const session = await authority.issue('player-b', 30);
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(await authority.resolve(session.token)).toBeNull();
  });
  it('enforces an atomic shared limit against concurrent requests', async () => {
    const results = await Promise.all(
      Array.from({ length: 10 }, () => authority.consume('subject-a', 3, 1000)),
    );
    expect(results.filter((result) => result.allowed)).toHaveLength(3);
    expect(results.every((result) => result.remaining >= 0)).toBe(true);
    const blocked = await authority.consume('subject-a', 3, 1000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });
  it('starts a new window after expiration and isolates subjects', async () => {
    expect((await authority.consume('subject-b', 1, 30)).allowed).toBe(true);
    expect((await authority.consume('subject-b', 1, 30)).allowed).toBe(false);
    expect((await authority.consume('subject-c', 1, 30)).allowed).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect((await authority.consume('subject-b', 1, 30)).allowed).toBe(true);
  });
  it('reads Redis TIME for a server timestamp without trusting browser time', async () => {
    const before = Date.now(),
      time = await authority.now();
    expect(Number.isSafeInteger(time)).toBe(true);
    expect(time).toBeGreaterThanOrEqual(before - 1000);
    expect(time).toBeLessThanOrEqual(Date.now() + 1000);
  });
  it('rejects invalid identities, TTL and rate configuration', async () => {
    await expect(authority.issue('', 1000)).rejects.toThrow('INVALID_SESSION');
    await expect(authority.issue('player', 0)).rejects.toThrow('INVALID_SESSION');
    await expect(authority.consume('subject', 0, 1000)).rejects.toThrow('INVALID_RATE_LIMIT');
    await expect(authority.consume('subject', 1, Infinity)).rejects.toThrow('INVALID_RATE_LIMIT');
  });
});
