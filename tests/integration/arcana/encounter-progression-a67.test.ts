// A67 historical contract uses the executable pre-house reference; A85 tests the new version separately.
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { createClient } from 'redis';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { composeArcanaApi } from '../../../src/arcana/infrastructure/http/composition';
import {
  applyGameSchema,
  PostgresGameTransactions,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import type { CampaignConfiguration } from '../../../src/arcana/application/run-use-cases';
import { campaignFixture, runInitial } from '../../domain/arcana/support/run-fixtures';
import { catalogFixture, toadFixture, shopFixture } from '../../domain/arcana/support/fixtures';
import { commerceFixture } from '../../domain/arcana/support/commerce-fixtures';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import type { EncounterOffer } from '../../../src/arcana/domain/exploration/encounter-trades';
import { previewEncounterTrade } from '../../../src/arcana/domain/exploration/encounter-trades';
// Declared transaction/HTTP fixtures. Wounds are set only on disposable accounts, never on a player session.
const pool = new Pool({
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  max: 6,
  connectionTimeoutMillis: 3000,
});
const redis = createClient({
  url: 'redis://127.0.0.1:56379',
  socket: { reconnectStrategy: false },
});
redis.on('error', () => {});
const namespace = 'a67-encounter-' + randomUUID(),
  players: string[] = [],
  apps: FastifyInstance[] = [];
function configuration(
  kind: 'healer' | 'scholar' = 'healer',
  legacy = false,
): CampaignConfiguration {
  const c = campaignFixture();
  const graph = {
    version: 1,
    nodes: [
      { id: 'encounter', kind: 'encounter' as const, row: 0, next: ['boss'] },
      { id: 'boss', kind: 'boss' as const, row: 1, next: [] },
    ],
  };
  const offer: EncounterOffer = {
    id: 'fixed:' + kind,
    npcId: kind === 'healer' ? 'merlin' : 'circe',
    kind,
    options: [
      {
        id: 'one',
        scope: 'unit',
        restore: kind === 'healer' ? 'hp' : 'mana',
        fraction: 0.4,
        costFraction: 0.2,
      },
      {
        id: 'team',
        scope: 'team',
        restore: kind === 'healer' ? 'hp' : 'mana',
        fraction: 0.15,
        costFraction: 0.1,
      },
    ],
  };
  const nodes = c.nodes.filter((n) => n.kind === 'encounter' || n.kind === 'boss');
  const offered = nodes.map((n) => (n.kind === 'encounter' ? { ...n, offer } : n));
  return {
    ...c,
    graph,
    nodes,
    ...(legacy
      ? {}
      : {
          equipmentRulesVersion: 2,
          tacticalContent: { version: 2, nodes: offered },
          challengeContent: () => offered,
        }),
  };
}
function compose(
  games?: PostgresGameTransactions,
  config: () => CampaignConfiguration = configuration,
) {
  const runtime = composeArcanaApi({
    pool,
    redis,
    namespace,
    opening: () => ({
      catalog: catalogFixture,
      table: toadFixture,
      shop: shopFixture,
      commerce: commerceFixture,
    }),
    campaign: config,
    policy: { bodyLimit: 16384, maximumPerIp: 10000, maximumPerPlayer: 1000, windowMs: 60000 },
    ...(games ? { games } : {}),
  });
  apps.push(runtime.app);
  return runtime;
}
async function provision(runtime: ReturnType<typeof compose>) {
  const id = 'a67-encounter-player-' + randomUUID();
  players.push(id);
  await runtime.games.create(runInitial(id));
  const grant = await runtime.authority.issue(id, 60000);
  return { id, headers: { authorization: 'Bearer ' + grant.token } };
}
type Player = Awaited<ReturnType<typeof provision>>;
const post = (r: ReturnType<typeof compose>, p: Player, url: string, payload: unknown) =>
  r.app.inject({ method: 'POST', url, headers: p.headers, payload: payload as object });
async function setup(kind: 'healer' | 'scholar' = 'healer', legacy = false) {
  const runtime = compose(undefined, () => configuration(kind, legacy)),
    player = await provision(runtime);
  const response = await post(runtime, player, '/api/runs', {
    key: 'run',
    expectedRevision: 1,
    request: {
      zoneId: 'bulevar',
      campaignVersion: 1,
      copyIds: ['copy0', 'copy1', 'copy2'],
      ...(legacy ? {} : { challenge: 'mastery' }),
    },
  });
  expect(response.statusCode, response.body).toBe(200);
  // Setup-only condition fixture: the API does not expose an HP/PM editor.
  await runtime.games.transact(player.id, (current) => ({
    ...current,
    revision: current.revision + 1,
    exploration: {
      ...current.exploration!,
      run: {
        ...current.exploration!.run!,
        members: current.exploration!.run!.members.map((m) => ({
          ...m,
          unit: { ...m.unit, hp: 40, mana: 10 },
        })),
      },
    },
  }));
  return { runtime, player };
}
async function command(
  s: Awaited<ReturnType<typeof setup>>,
  extra: Record<string, string> = {},
  key = 'trade',
) {
  const before = await s.runtime.games.read(s.player.id);
  return {
    key,
    expectedRevision: before.revision,
    request: {
      runId: 'run',
      nodeId: 'encounter',
      campaignVersion: 1,
      assignments: [],
      encounterAction: 'trade',
      encounterChoiceId: 'one',
      encounterUnitId: 'copy0',
      ...extra,
    },
  };
}
beforeAll(async () => {
  await redis.connect();
  await applyGameSchema(pool);
});
afterAll(async () => {
  await Promise.all(apps.map((app) => app.close()));
  if (players.length)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [players]);
  if (redis.isOpen) {
    const keys = await redis.keys(namespace + ':*');
    if (keys.length) await redis.del(keys);
    await redis.close();
  }
  await pool.end();
});
describe('A67 encounter/progression HTTP with actual PostgreSQL and Redis', () => {
  it('stores an explicit actual challenge profile without changing campaign reward rights', async () => {
    const actual = trialConfiguration('a84');
    const r = compose(undefined, () => actual.campaign),
      p = await provision(r);
    const invalid = await post(r, p, '/api/runs', {
      key: 'bad',
      expectedRevision: 1,
      request: {
        zoneId: actual.campaign.zoneId,
        campaignVersion: actual.campaign.version,
        copyIds: ['copy0'],
        challenge: 'future',
      },
    });
    expect(invalid.statusCode).toBe(400);
    const result = await post(r, p, '/api/runs', {
      key: 'new',
      expectedRevision: 1,
      request: {
        zoneId: actual.campaign.zoneId,
        campaignVersion: actual.campaign.version,
        copyIds: ['copy0'],
        challenge: 'mastery',
      },
    });
    expect(result.statusCode, result.body).toBe(200);
    const saved = await r.games.read(p.id);
    expect(saved.exploration!.run).toMatchObject({
      challenge: 'mastery',
      tacticalVersion: 2,
      equipmentRulesVersion: 2,
      campaignVersion: 1,
    });
    const boss = saved.exploration!.run!.campaignSnapshot!.nodes.find((n) => n.kind === 'boss');
    expect(boss?.kind === 'boss' && boss.opponents).toHaveLength(5);
    expect(saved.exploration!.victories).toEqual([]);
    expect(saved.inventory).toEqual(runInitial().inventory);
  });
  it('keeps offers fixed across reads/pools and pass only advances without condition/resource changes', async () => {
    const s = await setup();
    const before = await s.runtime.games.read(s.player.id);
    const other = new PostgresGameTransactions(pool);
    expect(await other.read(s.player.id)).toEqual(before);
    const offer = before.exploration!.run!.campaignSnapshot!.nodes.find(
      (n) => n.kind === 'encounter',
    );
    expect(offer?.kind === 'encounter' && offer.offer?.id).toBe('fixed:healer');
    const projected = previewEncounterTrade(
      before.exploration!.run!.members,
      offer!.kind === 'encounter' ? offer!.offer! : null!,
      'one',
      'copy0',
    );
    expect(projected.eligible).toBe(true);
    expect(await other.read(s.player.id)).toEqual(before);
    const response = await post(s.runtime, s.player, '/api/nodes/advance', {
      key: 'pass',
      expectedRevision: before.revision,
      request: {
        runId: 'run',
        nodeId: 'encounter',
        campaignVersion: 1,
        assignments: [],
        encounterAction: 'pass',
      },
    });
    expect(response.statusCode, response.body).toBe(200);
    const after = await other.read(s.player.id);
    expect(after.inventory).toEqual(before.inventory);
    expect(after.exploration!.run!.members).toEqual(before.exploration!.run!.members);
    expect(after.exploration!.run!.visited).toEqual(['encounter']);
  });
  it.each(['healer', 'scholar'] as const)(
    'confirms the %s trade exactly once and persists its condition snapshot',
    async (kind) => {
      const s = await setup(kind),
        before = await s.runtime.games.read(s.player.id),
        c = await command(s);
      const first = await post(s.runtime, s.player, '/api/nodes/advance', c);
      expect(first.statusCode, first.body).toBe(200);
      const replay = await post(s.runtime, s.player, '/api/nodes/advance', c);
      expect(replay.statusCode, replay.body).toBe(200);
      expect(replay.json()).toEqual(first.json());
      const saved = await s.runtime.games.read(s.player.id);
      expect(saved.inventory).toEqual(before.inventory);
      expect(saved.exploration!.run!.members[0].unit).toMatchObject(
        kind === 'healer' ? { hp: 80, mana: 6 } : { hp: 20, mana: 18 },
      );
      expect(saved.exploration!.run!.members[1]).toEqual(before.exploration!.run!.members[1]);
      expect(saved.receipts.filter((r) => r.id === 'trade')).toHaveLength(1);
      expect(saved.receipts.at(-1)).toMatchObject({
        encounter: { trade: { choiceId: 'one', unitId: 'copy0', offer: { id: 'fixed:' + kind } } },
      });
    },
  );
  it('recovers a response lost after actual COMMIT with its fixed offer, and conflicts on another choice under the same key', async () => {
    const s = await setup(),
      c = await command(s);
    const failing = compose(
      new PostgresGameTransactions(pool, {
        afterCommit: () => {
          throw Error('lost');
        },
      }),
      () => {
        throw Error('live campaign unavailable');
      },
    );
    const lost = await post(failing, s.player, '/api/nodes/advance', c);
    expect(lost.statusCode, lost.body).toBe(503);
    expect(lost.json().error.code).toBe('UNKNOWN_COMMIT');
    const recovered = await post(s.runtime, s.player, '/api/nodes/advance', c);
    expect(recovered.statusCode, recovered.body).toBe(200);
    expect(recovered.json().state.exploration.run.members[0].unit.hp).toBe(80);
    const conflict = await post(s.runtime, s.player, '/api/nodes/advance', {
      ...c,
      request: { ...c.request, encounterChoiceId: 'team', encounterUnitId: undefined },
    });
    expect(conflict.statusCode, conflict.body).toBe(409);
    expect(conflict.json().error.code).toBe('OPERATION_CONFLICT');
    const saved = await s.runtime.games.read(s.player.id);
    expect(saved.receipts.filter((r) => r.kind === 'advance-node')).toHaveLength(1);
  });
  it('serializes distinct connection choices into one advance and one condition change', async () => {
    const s = await setup(),
      c = await command(s),
      other = compose(new PostgresGameTransactions(pool));
    const results = await Promise.all([
      post(s.runtime, s.player, '/api/nodes/advance', c),
      post(other, s.player, '/api/nodes/advance', { ...c, key: 'other' }),
    ]);
    expect(results.map((r) => r.statusCode).sort()).toEqual([200, 409]);
    const saved = await s.runtime.games.read(s.player.id);
    expect(saved.exploration!.run!.members[0].unit.hp).toBe(80);
    expect(saved.exploration!.run!.visited).toEqual(['encounter']);
    expect(saved.receipts.filter((r) => r.kind === 'advance-node')).toHaveLength(1);
  });
  it('rejects forged/missing choices and invalid condition, and rolls back failed storage', async () => {
    const s = await setup(),
      c = await command(s),
      before = await s.runtime.games.read(s.player.id);
    for (const request of [
      { ...c.request, encounterChoiceId: undefined },
      { ...c.request, encounterChoiceId: 'foreign' },
      { ...c.request, encounterUnitId: 'foreign' },
    ]) {
      const result = await post(s.runtime, s.player, '/api/nodes/advance', { ...c, request });
      expect(result.statusCode, result.body).toBe(422);
    }
    expect(await s.runtime.games.read(s.player.id)).toEqual(before);
    const failing = compose(
      new PostgresGameTransactions(pool, {
        beforeCommit: () => {
          throw Error('fail');
        },
      }),
    );
    const response = await post(failing, s.player, '/api/nodes/advance', c);
    expect(response.statusCode).toBe(503);
    expect(await s.runtime.games.read(s.player.id)).toEqual(before);
    await s.runtime.games.transact(s.player.id, (current) => ({
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
    const poor = await s.runtime.games.read(s.player.id);
    const bad = await post(s.runtime, s.player, '/api/nodes/advance', await command(s));
    expect(bad.statusCode, bad.body).toBe(422);
    expect(await s.runtime.games.read(s.player.id)).toEqual(poor);
  });
  it('preserves a tactical V1 campaign snapshot with no offer when live configuration is unavailable', async () => {
    const config = () => {
      const c = configuration('healer', true);
      return { ...c, tacticalContent: { version: 1 as const, nodes: c.nodes } };
    };
    const r = compose(undefined, config),
      p = await provision(r);
    const started = await post(r, p, '/api/runs', {
      key: 'v1',
      expectedRevision: 1,
      request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0', 'copy1', 'copy2'] },
    });
    expect(started.statusCode, started.body).toBe(200);
    const before = await r.games.read(p.id);
    expect(before.exploration!.run!.tacticalVersion).toBe(1);
    const unavailable = compose(undefined, () => {
      throw Error('live unavailable');
    });
    const result = await post(unavailable, p, '/api/nodes/advance', {
      key: 'legacy-snapshot',
      expectedRevision: before.revision,
      request: {
        runId: 'v1',
        nodeId: 'encounter',
        campaignVersion: 1,
        assignments: [],
        encounterAction: 'risk',
      },
    });
    expect(result.statusCode, result.body).toBe(200);
    expect(result.json().receipt.encounter.trade).toBeUndefined();
    expect(result.json().receipt.encounter.resolution.effect.kind).toBe('reward');
    expect(result.json().state.exploration.run.tacticalVersion).toBe(1);
  });
  it('rejects client supplied offer and cost mechanics before changing state', async () => {
    const s = await setup(),
      c = await command(s),
      before = await s.runtime.games.read(s.player.id);
    for (const forged of [
      { offer: { id: 'forged', costFraction: 0 } },
      { costFraction: 0 },
      { restore: 'hp', fraction: 1 },
    ]) {
      const response = await post(s.runtime, s.player, '/api/nodes/advance', {
        ...c,
        request: { ...c.request, ...forged },
      });
      expect(response.statusCode, response.body).toBe(400);
      expect(await s.runtime.games.read(s.player.id)).toEqual(before);
    }
  });
  it('changing an explicit profile on another run does not renew boss first-victory keys', async () => {
    const s = await setup();
    const move = async (key: string, runId: string, nodeId: string) => {
      const before = await s.runtime.games.read(s.player.id);
      const response = await post(s.runtime, s.player, '/api/nodes/advance', {
        key,
        expectedRevision: before.revision,
        request: {
          runId,
          nodeId,
          campaignVersion: 1,
          assignments: [],
          ...(nodeId === 'encounter' ? { encounterAction: 'pass' } : {}),
        },
      });
      expect(response.statusCode, response.body).toBe(200);
      return response.json();
    };
    await move('pass1', 'run', 'encounter');
    const first = await move('boss1', 'run', 'boss');
    expect(first.receipt).toMatchObject({ firstVictory: true, reward: { goldKeys: 1 } });
    const before = await s.runtime.games.read(s.player.id);
    const started = await post(s.runtime, s.player, '/api/runs', {
      key: 'new-profile',
      expectedRevision: before.revision,
      request: {
        zoneId: 'bulevar',
        campaignVersion: 1,
        copyIds: ['copy0', 'copy1', 'copy2'],
        challenge: 'discovery',
      },
    });
    expect(started.statusCode, started.body).toBe(200);
    await move('pass2', 'new-profile', 'encounter');
    const repeat = await move('boss2', 'new-profile', 'boss');
    expect(repeat.receipt).toMatchObject({
      firstVictory: false,
      reward: { goldKeys: 0, crowns: 10, products: [] },
    });
    const saved = await s.runtime.games.read(s.player.id);
    expect(saved.inventory.goldKeys).toBe(1);
    expect(saved.exploration!.victories).toEqual([{ levelId: 'boss1', version: 1 }]);
  });
  it('keeps a snapshot with no offer on its historical random encounter path after live content gains trades', async () => {
    const s = await setup('healer', true);
    const before = await s.runtime.games.read(s.player.id);
    expect(before.exploration!.run!.campaignSnapshot).toBeUndefined();
    const modern = compose();
    const rejected = await post(modern, s.player, '/api/nodes/advance', await command(s));
    expect(rejected.statusCode, rejected.body).toBe(422);
    expect(await s.runtime.games.read(s.player.id)).toEqual(before);
    const response = await post(modern, s.player, '/api/nodes/advance', {
      key: 'legacy',
      expectedRevision: before.revision,
      request: {
        runId: 'run',
        nodeId: 'encounter',
        campaignVersion: 1,
        assignments: [],
        encounterAction: 'risk',
      },
    });
    expect(response.statusCode, response.body).toBe(200);
    expect(response.json().receipt.encounter.trade).toBeUndefined();
    expect(response.json().receipt.encounter.resolution).toBeTruthy();
    expect(response.json().state.inventory.crowns).toBe(before.inventory.crowns + 5);
  });
});
