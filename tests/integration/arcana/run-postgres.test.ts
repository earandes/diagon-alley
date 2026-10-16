import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  applyGameSchema,
  PostgresGameTransactions,
} from '../../../src/arcana/infrastructure/postgres/game-transactions';
import {
  StartRunUseCase,
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
} from '../../../src/arcana/application/run-use-cases';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { campaignFixture, runInitial } from '../../domain/arcana/support/run-fixtures';
const connection = {
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  max: 4,
  connectionTimeoutMillis: 3000,
};
const pool = new Pool(connection),
  players: string[] = [];
const startRequest = {
  zoneId: 'bulevar',
  campaignVersion: 1,
  copyIds: ['copy0', 'copy1', 'copy2'],
};
const command = {
  key: 'duel',
  expectedRevision: 2,
  request: { runId: 'start', nodeId: 'duel', campaignVersion: 1, assignments: [] },
};
const useCases = (
  store: PostgresGameTransactions,
  seeds = { next: vi.fn(() => 42) },
  config = campaignFixture,
) => ({
  start: new StartRunUseCase(store, config),
  advance: new AdvanceNodeUseCase(
    store,
    config,
    new ResolveCombatUseCase(
      new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) }),
      seeds,
    ),
    { now: async () => 0 },
    { fromSeed: (seed) => new SeededRandom(seed) },
    seeds,
  ),
  seeds,
});
const initialize = async () => {
  const id = 'run-test-' + randomUUID();
  players.push(id);
  const store = new PostgresGameTransactions(pool),
    cases = useCases(store);
  await store.create(runInitial(id));
  await cases.start.execute(id, { key: 'start', expectedRevision: 1, request: startRequest });
  return { id, store, ...cases };
};
beforeAll(() => applyGameSchema(pool));
afterAll(async () => {
  if (players.length)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id = ANY($1::text[])', [players]);
  await pool.end();
});
describe('ARCANA PostgreSQL run atomicity and JSONB recovery', () => {
  it('recovers the original narrative/effect after commit response loss and pool reopening, without current configuration or another seed', async () => {
    const { id, store, advance } = await initialize();
    for (const nodeId of ['duel', 'refuge', 'chest', 'pact']) {
      const state = await store.read(id);
      await advance.execute(id, {
        key: nodeId,
        expectedRevision: state.revision,
        request: { ...command.request, nodeId },
      });
    }
    const config = () => {
      const campaign = campaignFixture();
      return {
        ...campaign,
        nodes: campaign.nodes.map((node) =>
          node.kind === 'encounter'
            ? {
                ...node,
                choices: node.choices.map((choice) => ({
                  ...choice,
                  narrative: {
                    version: 1,
                    text: { es: 'Una bolsa junto al puente.', en: 'A pouch beside the bridge.' },
                  },
                })),
              }
            : node,
        ),
      };
    };
    const before = await store.read(id);
    const request = {
      key: 'encounter',
      expectedRevision: before.revision,
      request: { ...command.request, nodeId: 'encounter' },
    };
    const failing = useCases(
      new PostgresGameTransactions(pool, {
        beforeCommit: () => {
          throw Error('Before commit');
        },
      }),
      { next: vi.fn(() => 42) },
      config,
    );
    await expect(failing.advance.execute(id, request)).rejects.toThrow('STORAGE');
    expect(await store.read(id)).toEqual(before);
    const uncertain = useCases(
      new PostgresGameTransactions(pool, {
        afterCommit: () => {
          throw Error('Lost response');
        },
      }),
      { next: vi.fn(() => 42) },
      config,
    );
    await expect(uncertain.advance.execute(id, request)).rejects.toThrow('UNKNOWN_COMMIT');
    const reopened = new Pool(connection);
    try {
      const seeds = {
        next: vi.fn(() => {
          throw Error('No new seed');
        }),
      };
      const recovery = useCases(new PostgresGameTransactions(reopened), seeds, () => {
        throw Error('No configuration');
      });
      const result = await recovery.advance.execute(id, request);
      expect(result.receipt).toMatchObject({
        encounter: {
          resolution: {
            narrative: {
              version: 1,
              text: { es: 'Una bolsa junto al puente.', en: 'A pouch beside the bridge.' },
            },
            effect: { kind: 'reward', reward: { crowns: 5 } },
          },
        },
      });
      expect(result.state.inventory.crowns).toBe(before.inventory.crowns + 5);
      expect(result.state.exploration?.run?.visited.at(-1)).toBe('encounter');
      expect(seeds.next).not.toHaveBeenCalled();
    } finally {
      await reopened.end();
    }
  });
  it('persists graph, residual HP/PM, battle log, reward and relational progress across pools', async () => {
    const { id, advance } = await initialize();
    const committed = await advance.execute(id, command);
    const reopened = new Pool(connection);
    try {
      const state = await new PostgresGameTransactions(reopened).read(id);
      expect(state).toEqual(committed.state);
      expect(state.exploration?.run?.visited).toEqual(['duel']);
      expect(state.exploration?.run?.members[0].unit.mana).toBe(19);
      const row = await reopened.query(
        'SELECT run_id,run_state FROM arcana_exploration WHERE player_id=$1',
        [id],
      );
      expect(row.rows[0]).toMatchObject({
        run_id: 'start',
        run_state: { graphVersion: 1, visited: ['duel'] },
      });
      expect(
        (
          await reopened.query(
            'SELECT level_id,campaign_version FROM arcana_victories WHERE player_id=$1',
            [id],
          )
        ).rows,
      ).toEqual([{ level_id: 'level1', campaign_version: 1 }]);
    } finally {
      await reopened.end();
    }
  });
  it('rolls back every SQL write and recovers a lost committed response without another seed', async () => {
    const { id, store } = await initialize(),
      before = await store.read(id);
    const failing = useCases(
      new PostgresGameTransactions(pool, {
        beforeCommit: () => {
          throw Error('fault after writes');
        },
      }),
    );
    await expect(failing.advance.execute(id, command)).rejects.toThrow('STORAGE');
    expect(await store.read(id)).toEqual(before);
    const uncertain = useCases(
      new PostgresGameTransactions(pool, {
        afterCommit: () => {
          throw Error('response lost');
        },
      }),
    );
    await expect(uncertain.advance.execute(id, command)).rejects.toThrow('UNKNOWN_COMMIT');
    const seed = {
      next: vi.fn(() => {
        throw Error('must not generate another seed');
      }),
    };
    const recovered = await useCases(store, seed).advance.execute(id, command);
    expect(recovered.state.inventory.essence.points).toBe(45);
    expect(recovered.state.inventory.crowns).toBe(150);
    expect(seed.next).not.toHaveBeenCalled();
    expect(recovered.receipt).toMatchObject({
      kind: 'advance-node',
      battle: { input: { seed: 42 } },
    });
  });
  it('serializes two real connections so only one key spends, resolves and rewards', async () => {
    const { id } = await initialize(),
      seeds = { next: vi.fn(() => 42) };
    const a = useCases(new PostgresGameTransactions(pool), seeds),
      b = useCases(new PostgresGameTransactions(pool), seeds);
    const results = await Promise.allSettled([
      a.advance.execute(id, command),
      b.advance.execute(id, { ...command, key: 'competing' }),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(seeds.next).toHaveBeenCalledTimes(1);
    const state = await new PostgresGameTransactions(pool).read(id);
    expect(state.inventory.crowns).toBe(150);
    expect(state.inventory.essence.points).toBe(45);
    expect(state.exploration?.run?.visited).toEqual(['duel']);
  });
  it('retains gold keys and unlocked zone after a boss and never persists temporary recruits as copies', async () => {
    const { id, store, advance } = await initialize();
    for (const nodeId of ['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss']) {
      const current = await store.read(id);
      await advance.execute(id, {
        key: nodeId,
        expectedRevision: current.revision,
        request: { ...command.request, nodeId },
      });
    }
    const state = await new PostgresGameTransactions(pool).read(id);
    expect(state.exploration?.run?.status).toBe('won');
    expect(state.inventory.goldKeys).toBe(1);
    expect(state.exploration?.unlockedZones).toEqual(['bulevar', 'pasaje']);
    expect(state.copies).toHaveLength(3);
  });
});
