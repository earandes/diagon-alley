import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { createClient } from 'redis';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { GameState, OperationCommand } from '../../../src/arcana/application/game';
import {
  SeasonalEventUseCase,
  type SeasonalRequest,
} from '../../../src/arcana/application/seasonal-events';
import { StartRunUseCase } from '../../../src/arcana/application/run-use-cases';
import type { SeasonalEdition } from '../../../src/arcana/domain/seasonal/events';
import { seasonalEdition } from '../../../src/arcana/infrastructure/content/seasonal-content';
import {
  applyGameSchema,
  PostgresGameTransactions,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import { RedisAuthority } from '../../../src/arcana/infrastructure/redis/authority';
import { campaignFixture, runInitial } from '../../domain/arcana/support/run-fixtures';

// Transaction fixtures only. Route position/condition changes below are test setup on
// unique disposable accounts, not claims that an automated player traversed the route.
const pool = new Pool({
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  max: 4,
  connectionTimeoutMillis: 3000,
});
const redis = createClient({
  url: 'redis://127.0.0.1:56379',
  socket: { reconnectStrategy: false },
});
redis.on('error', () => {});
const namespace = 'a68-seasonal-' + randomUUID();
const players: string[] = [];
const games = new PostgresGameTransactions(pool);
const authority = new RedisAuthority(redis, namespace);
const during = Date.parse('2026-10-20T12:00:00+02:00');

async function setup(options: { start?: boolean; now?: number; edition?: SeasonalEdition } = {}) {
  const playerId = 'a68-seasonal-player-' + randomUUID();
  players.push(playerId);
  await games.create(runInitial(playerId));
  const time = { value: options.now ?? during };
  const clock = { now: async () => time.value };
  const edition = options.edition ?? seasonalEdition;
  const useCase = new SeasonalEventUseCase(games, () => edition, clock);
  const starter = new StartRunUseCase(games, campaignFixture, undefined, { clock });
  if (options.start !== false) {
    await starter.execute(playerId, {
      key: 'run',
      expectedRevision: 1,
      request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0', 'copy1', 'copy2'] },
    });
    await position(playerId, 2);
  }
  return { playerId, time, clock, edition, useCase, starter };
}
type Fixture = Awaited<ReturnType<typeof setup>>;
async function position(playerId: string, count: number, wounded = false) {
  return games.transact(playerId, (s) => ({
    ...s,
    revision: s.revision + 1,
    exploration: {
      ...s.exploration!,
      run: {
        ...s.exploration!.run!,
        visited: campaignFixture()
          .graph.nodes.slice(0, count)
          .map((n) => n.id),
        members: s.exploration!.run!.members.map((m) => ({
          ...m,
          unit: { ...m.unit, ...(wounded ? { hp: 40, mana: 10 } : {}) },
        })),
      },
    },
  }));
}
async function command(
  s: Fixture,
  action: SeasonalRequest['action'],
  key: string = action,
): Promise<OperationCommand<SeasonalRequest>> {
  const current = await games.read(s.playerId);
  return {
    key,
    expectedRevision: current.revision,
    request: {
      editionId: s.edition.editionId,
      version: s.edition.version,
      action,
      ...(action === 'join' ? {} : { runId: current.exploration!.run!.id }),
    },
  };
}
async function act(s: Fixture, action: SeasonalRequest['action'], key: string = action) {
  return s.useCase.execute(s.playerId, await command(s, action, key));
}
const protectedState = (s: GameState) => ({
  inventory: s.inventory,
  copies: s.copies,
  team: s.team,
  victories: s.exploration?.victories,
  zones: s.exploration?.unlockedZones,
  graph: s.exploration?.run?.graph,
  campaign: s.exploration?.run?.campaignSnapshot,
});

beforeAll(async () => {
  await redis.connect();
  await applyGameSchema(pool);
});
afterAll(async () => {
  if (players.length)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [players]);
  if (redis.isOpen) {
    const keys = await redis.keys(namespace + ':*');
    if (keys.length) await redis.del(keys);
    await redis.close();
  }
  await pool.end();
});

describe('A68 seasonal operations on real PostgreSQL and Redis', () => {
  it('uses Redis server time/session authority and preserves a legacy account on pure reads', async () => {
    const s = await setup({ start: false });
    const before = await games.read(s.playerId);
    expect(before.seasonal).toBeUndefined();
    const grant = await authority.issue(s.playerId, 60_000);
    expect(await authority.resolve(grant.token)).toBe(s.playerId);
    const now = await authority.now();
    expect(Number.isSafeInteger(now)).toBe(true);
    expect(Math.abs(now - Date.now())).toBeLessThan(60_000);
    expect(await new PostgresGameTransactions(pool).read(s.playerId)).toEqual(before);
  });
  it('joins explicitly, reopens the same edition snapshot, and never changes campaign/economic rights', async () => {
    const s = await setup();
    const before = await games.read(s.playerId);
    const c = await command(s, 'join');
    const first = await s.useCase.execute(s.playerId, c);
    expect(await s.useCase.execute(s.playerId, c)).toEqual(first);
    const saved = await new PostgresGameTransactions(pool).read(s.playerId);
    expect(saved.seasonal!.participations).toHaveLength(1);
    expect(saved.seasonal!.participations[0]).toMatchObject({
      edition: s.edition,
      joinedAt: during,
      boundRunIds: ['run'],
      completedObjectiveIds: [],
      opportunities: [],
    });
    expect(protectedState(saved)).toEqual(protectedState(before));
    expect(saved.exploration!.run).toEqual(before.exploration!.run);
    expect(saved.receipts.filter((r) => r.kind === 'seasonal-event')).toHaveLength(1);
  });
  it('stores three sequential known repairs and one permanent non-economic keepsake across independent reads', async () => {
    const s = await setup();
    const before = await games.read(s.playerId);
    await act(s, 'join');
    for (const count of [2, 3, 4]) {
      if (count > 2) await position(s.playerId, count);
      await act(s, 'dispel', 'repair-' + count);
    }
    const saved = await new PostgresGameTransactions(pool).read(s.playerId);
    expect(saved.seasonal!.participations[0].completedObjectiveIds).toEqual(s.edition.objectiveIds);
    expect(saved.seasonal!.keepsakes).toHaveLength(1);
    expect(saved.seasonal!.keepsakes[0]).toMatchObject({
      eventId: s.edition.eventId,
      editionId: s.edition.editionId,
      version: s.edition.version,
      operationId: 'repair-4',
      grantedAt: during,
    });
    expect(protectedState(saved)).toEqual(protectedState(before));
    const again = await command(s, 'dispel', 'extra');
    await expect(s.useCase.execute(s.playerId, again)).rejects.toMatchObject({
      code: 'EVENT_UNAVAILABLE',
    });
    expect(await games.read(s.playerId)).toEqual(saved);
  });
  it('trades only actual beneficiaries once at a route position, with no objective or resource reward', async () => {
    const s = await setup();
    await position(s.playerId, 2, true);
    await act(s, 'join');
    const before = await games.read(s.playerId);
    const c = await command(s, 'prepare');
    const result = await s.useCase.execute(s.playerId, c);
    expect(await s.useCase.execute(s.playerId, c)).toEqual(result);
    const saved = await games.read(s.playerId);
    for (const member of saved.exploration!.run!.members)
      expect(member.unit).toMatchObject({ hp: 65, mana: 8 });
    expect(saved.seasonal!.participations[0].completedObjectiveIds).toEqual([]);
    expect(saved.seasonal!.participations[0].opportunities).toHaveLength(1);
    expect(saved.seasonal!.keepsakes).toEqual([]);
    expect(protectedState(saved)).toEqual(protectedState(before));
    await expect(act(s, 'dispel', 'same-place')).rejects.toMatchObject({
      code: 'EVENT_OPPORTUNITY_USED',
    });
    expect(await games.read(s.playerId)).toEqual(saved);
    await position(s.playerId, 3);
    await act(s, 'dispel', 'next-place');
    expect(
      (await games.read(s.playerId)).seasonal!.participations[0].completedObjectiveIds,
    ).toEqual([s.edition.objectiveIds[0]]);
  });
  it('does not charge or advance when no healing benefits exist or PM is insufficient', async () => {
    const s = await setup();
    await act(s, 'join');
    let before = await games.read(s.playerId);
    await expect(act(s, 'prepare')).rejects.toMatchObject({ code: 'EVENT_CONDITION' });
    expect(await games.read(s.playerId)).toEqual(before);
    await position(s.playerId, 2, true);
    await games.transact(s.playerId, (current) => ({
      ...current,
      revision: current.revision + 1,
      exploration: {
        ...current.exploration!,
        run: {
          ...current.exploration!.run!,
          members: current.exploration!.run!.members.map((m) => ({
            ...m,
            unit: { ...m.unit, mana: 0 },
          })),
        },
      },
    }));
    before = await games.read(s.playerId);
    await expect(act(s, 'prepare')).rejects.toMatchObject({ code: 'EVENT_CONDITION' });
    expect(await games.read(s.playerId)).toEqual(before);
  });
  it('rolls back condition, participation, operation and final grant on actual SQL commit failure', async () => {
    const s = await setup();
    await act(s, 'join');
    await act(s, 'dispel', 'first');
    await position(s.playerId, 3);
    await act(s, 'dispel', 'second');
    await position(s.playerId, 4);
    const before = await games.read(s.playerId);
    const failing = new SeasonalEventUseCase(
      new PostgresGameTransactions(pool, {
        beforeCommit: () => {
          throw Error('declared-storage-fault');
        },
      }),
      () => s.edition,
      s.clock,
    );
    await expect(
      failing.execute(s.playerId, await command(s, 'dispel', 'final')),
    ).rejects.toMatchObject({ code: 'STORAGE' });
    expect(await games.read(s.playerId)).toEqual(before);
    expect(before.seasonal!.keepsakes).toEqual([]);
  });
  it('recovers a final committed reward after response loss, closed dates and unavailable live configuration', async () => {
    const s = await setup();
    await act(s, 'join');
    await act(s, 'dispel', 'first');
    await position(s.playerId, 3);
    await act(s, 'dispel', 'second');
    await position(s.playerId, 4);
    const c = await command(s, 'dispel', 'final');
    const failing = new SeasonalEventUseCase(
      new PostgresGameTransactions(pool, {
        afterCommit: () => {
          throw Error('declared-lost-response');
        },
      }),
      () => s.edition,
      s.clock,
    );
    await expect(failing.execute(s.playerId, c)).rejects.toMatchObject({ code: 'UNKNOWN_COMMIT' });
    const committed = await games.read(s.playerId);
    expect(committed.seasonal!.keepsakes).toHaveLength(1);
    const unavailable = new SeasonalEventUseCase(
      new PostgresGameTransactions(pool),
      () => {
        throw Error('live-definition-unavailable');
      },
      {
        now: async () => {
          throw Error('live-clock-unavailable');
        },
      },
    );
    const result = await unavailable.execute(s.playerId, c);
    expect(result.state).toEqual(committed);
    expect(result.receipt).toMatchObject({ id: 'final', kind: 'seasonal-event' });
    expect(await games.read(s.playerId)).toEqual(committed);
    await expect(
      unavailable.execute(s.playerId, { ...c, request: { ...c.request, action: 'prepare' } }),
    ).rejects.toMatchObject({ code: 'OPERATION_CONFLICT' });
  });
  it('serializes two independent connections so a route opportunity and final grant cannot be taken twice', async () => {
    const s = await setup();
    await act(s, 'join');
    await act(s, 'dispel', 'first');
    await position(s.playerId, 3);
    await act(s, 'dispel', 'second');
    await position(s.playerId, 4);
    const c = await command(s, 'dispel', 'tab-a');
    const other = new SeasonalEventUseCase(
      new PostgresGameTransactions(pool),
      () => s.edition,
      s.clock,
    );
    const responses = await Promise.allSettled([
      s.useCase.execute(s.playerId, c),
      other.execute(s.playerId, { ...c, key: 'tab-b' }),
    ]);
    expect(responses.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(responses.filter((r) => r.status === 'rejected')).toHaveLength(1);
    const saved = await games.read(s.playerId);
    expect(saved.seasonal!.keepsakes).toHaveLength(1);
    expect(saved.seasonal!.participations[0].opportunities).toHaveLength(3);
    expect(saved.receipts.filter((r) => r.id === 'tab-a' || r.id === 'tab-b')).toHaveLength(1);
  });
  it('recovers the same simultaneous double-tap key rather than rejecting or granting twice', async () => {
    const s = await setup();
    await act(s, 'join');
    const c = await command(s, 'dispel', 'double-tap');
    const other = new SeasonalEventUseCase(
      new PostgresGameTransactions(pool),
      () => s.edition,
      s.clock,
    );
    const [first, second] = await Promise.all([
      s.useCase.execute(s.playerId, c),
      other.execute(s.playerId, c),
    ]);
    expect(second).toEqual(first);
    const saved = await games.read(s.playerId);
    expect(saved.seasonal!.participations[0].completedObjectiveIds).toHaveLength(1);
    expect(saved.receipts.filter((r) => r.id === 'double-tap')).toHaveLength(1);
  });
  it('keeps the admitted edition definition when live data changes and keeps historical grants in a later edition', async () => {
    const s = await setup();
    await games.transact(s.playerId, (current) => ({
      ...current,
      revision: current.revision + 1,
      inventory: { ...current.inventory, goldKeys: 1 },
      exploration: { ...current.exploration!, victories: [{ levelId: 'boss1', version: 1 }] },
    }));
    const before = await games.read(s.playerId);
    await act(s, 'join');
    const changed: SeasonalEdition = {
      ...s.edition,
      version: s.edition.version + 1,
      objectiveIds: ['changed-one', 'changed-two', 'changed-three'],
    };
    const updated = new SeasonalEventUseCase(
      new PostgresGameTransactions(pool),
      () => changed,
      s.clock,
    );
    const incompatible = await command(s, 'dispel', 'incompatible-version');
    const admitted = await games.read(s.playerId);
    await expect(
      updated.execute(s.playerId, {
        ...incompatible,
        request: { ...incompatible.request, version: changed.version },
      }),
    ).rejects.toMatchObject({ code: 'STALE_TABLE' });
    expect(await games.read(s.playerId)).toEqual(admitted);
    for (const count of [2, 3, 4]) {
      if (count > 2) await position(s.playerId, count);
      await updated.execute(s.playerId, await command(s, 'dispel', 'old-version-' + count));
    }
    const completed = await games.read(s.playerId);
    expect(completed.seasonal!.participations[0].edition).toEqual(s.edition);
    expect(completed.seasonal!.participations[0].completedObjectiveIds).toEqual(
      s.edition.objectiveIds,
    );
    expect(protectedState(completed)).toEqual(protectedState(before));
    const nextYear = 366 * 24 * 60 * 60 * 1000;
    const next: SeasonalEdition = {
      ...s.edition,
      editionId: 'halloween-2027',
      startsAt: s.edition.startsAt + nextYear,
      participationEndsAt: s.edition.participationEndsAt + nextYear,
      completionEndsAt: s.edition.completionEndsAt + nextYear,
    };
    s.time.value += nextYear;
    const nextUseCase = new SeasonalEventUseCase(games, () => next, s.clock);
    await nextUseCase.execute(s.playerId, {
      key: 'next-edition',
      expectedRevision: completed.revision,
      request: { editionId: next.editionId, version: next.version, action: 'join' },
    });
    const saved = await new PostgresGameTransactions(pool).read(s.playerId);
    expect(saved.seasonal!.participations).toHaveLength(2);
    expect(
      saved.seasonal!.participations.find((p) => p.edition.editionId === next.editionId)!
        .completedObjectiveIds,
    ).toEqual([]);
    expect(saved.seasonal!.keepsakes).toEqual(completed.seasonal!.keepsakes);
    expect(saved.exploration!.victories).toEqual([{ levelId: 'boss1', version: 1 }]);
    expect(saved.inventory.goldKeys).toBe(1);
  });
  it('rejects new participants before/after admission and lets an admitted bound run finish only in grace', async () => {
    for (const now of [
      Date.parse('2026-10-15T23:59:59+02:00'),
      Date.parse('2026-11-02T00:00:00+01:00'),
    ]) {
      const closed = await setup({ now });
      const before = await games.read(closed.playerId);
      await expect(act(closed, 'join')).rejects.toMatchObject({ code: 'EVENT_UNAVAILABLE' });
      expect(await games.read(closed.playerId)).toEqual(before);
    }
    const s = await setup();
    await act(s, 'join');
    s.time.value = Date.parse('2026-11-02T12:00:00+01:00');
    await act(s, 'dispel', 'grace');
    await position(s.playerId, 3);
    s.time.value = Date.parse('2026-11-03T00:00:00+01:00');
    const before = await games.read(s.playerId);
    await expect(act(s, 'dispel', 'closed')).rejects.toMatchObject({ code: 'EVENT_UNAVAILABLE' });
    expect(await games.read(s.playerId)).toEqual(before);
    expect(
      (await new PostgresGameTransactions(pool).read(s.playerId)).seasonal!.participations[0]
        .completedObjectiveIds,
    ).toHaveLength(1);
  });
  it('binds explicitly started new runs only during admission, without changing campaign snapshots or first-victory rights', async () => {
    const s = await setup({ start: false });
    await act(s, 'join');
    expect((await games.read(s.playerId)).seasonal!.participations[0].boundRunIds).toEqual([]);
    await s.starter.execute(s.playerId, {
      key: 'after-join',
      expectedRevision: (await games.read(s.playerId)).revision,
      request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0'] },
    });
    const saved = await games.read(s.playerId);
    expect(saved.seasonal!.participations[0].boundRunIds).toEqual(['after-join']);
    expect(saved.exploration!.victories).toEqual([]);
    expect(saved.inventory).toEqual(runInitial().inventory);
    expect(saved.exploration!.run!.campaignVersion).toBe(1);
  });
  it('allows normal new expeditions in grace while refusing to silently bind them to the closed admission', async () => {
    const s = await setup();
    await act(s, 'join');
    await games.transact(s.playerId, (current) => ({
      ...current,
      revision: current.revision + 1,
      exploration: {
        ...current.exploration!,
        run: { ...current.exploration!.run!, status: 'draw' },
      },
    }));
    s.time.value = Date.parse('2026-11-02T12:00:00+01:00');
    await s.starter.execute(s.playerId, {
      key: 'grace-run',
      expectedRevision: (await games.read(s.playerId)).revision,
      request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0'] },
    });
    await position(s.playerId, 2);
    const before = await games.read(s.playerId);
    expect(before.seasonal!.participations[0].boundRunIds).toEqual(['run']);
    expect(before.exploration!.run!.id).toBe('grace-run');
    await expect(act(s, 'dispel', 'unbound-grace')).rejects.toMatchObject({
      code: 'EVENT_UNAVAILABLE',
    });
    expect(await games.read(s.playerId)).toEqual(before);
  });
});
