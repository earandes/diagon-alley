import { describe, expect, it, vi } from 'vitest';
import {
  StartRunUseCase,
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
} from '../../../src/arcana/application/run-use-cases';
import {
  gameSnapshot,
  type GameState,
  type GameTransactions,
} from '../../../src/arcana/application/game';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { campaignFixture, runInitial } from './support/run-fixtures';
class MemoryGames implements GameTransactions {
  state = gameSnapshot(runInitial());
  fail = false;
  lost = false;
  queue: Promise<unknown> = Promise.resolve();
  async read() {
    return gameSnapshot(this.state);
  }
  transact(_playerId: string, change: (state: GameState) => GameState): Promise<GameState> {
    const operation = this.queue.then(() => {
      const next = gameSnapshot(change(this.state));
      if (this.fail) throw Error('storage failed');
      this.state = next;
      if (this.lost) throw Error('response lost');
      return next;
    });
    this.queue = operation.catch(() => {});
    return operation;
  }
}
const startRequest = {
  zoneId: 'bulevar',
  campaignVersion: 1,
  copyIds: ['copy0', 'copy1', 'copy2'],
};
const setup = async () => {
  const games = new MemoryGames(),
    config = vi.fn(campaignFixture),
    seeds = { next: vi.fn(() => 42) },
    clock = { now: vi.fn(async () => 0) };
  const combat = new ResolveCombatUseCase(
    new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) }),
    seeds,
  );
  const start = new StartRunUseCase(games, config),
    advance = new AdvanceNodeUseCase(
      games,
      config,
      combat,
      clock,
      { fromSeed: (seed) => new SeededRandom(seed) },
      seeds,
    );
  await start.execute('player', { key: 'start', expectedRevision: 1, request: startRequest });
  const move = (
    nodeId: string,
    key = nodeId,
    assignments: { unitId: string; beanId: string }[] = [],
  ) =>
    advance.execute('player', {
      key,
      expectedRevision: games.state.revision,
      request: { runId: 'start', nodeId, campaignVersion: 1, assignments },
    });
  return { games, config, seeds, clock, start, advance, move };
};
describe('ARCANA transactional run and node resolution', () => {
  it('saves each seeded encounter effect and narrative before returning and replays the original snapshot without current config', async () => {
    for (const kind of ['reward', 'heal', 'damage'] as const) {
      const { games, move, config, advance, seeds } = await setup();
      for (const node of ['duel', 'refuge', 'chest', 'pact']) await move(node);
      const campaign = campaignFixture();
      const effect =
        kind === 'reward'
          ? { kind, reward: { crowns: 10, goldKeys: 0, products: [] } }
          : { kind, fraction: 0.1 };
      const narrative = { version: 1, text: { es: `Relato ${kind}`, en: `Story ${kind}` } };
      config.mockReturnValue({
        ...campaign,
        nodes: campaign.nodes.map((node) =>
          node.kind === 'encounter'
            ? { ...node, choices: [{ weight: 1, effect, narrative }] }
            : node,
        ),
      });
      const before = games.state;
      const result = await move('encounter');
      expect(result.receipt).toMatchObject({
        encounter: {
          seed: 42,
          choice: 0,
          resolution: {
            effect,
            narrative,
            vitals: before.exploration?.run?.members.map((m) => ({
              unitId: m.unit.id,
              beforeHp: m.unit.hp,
            })),
          },
        },
      });
      if (result.receipt.kind !== 'advance-node') throw Error('Missing node');
      expect(result.receipt.encounter?.resolution?.vitals.map((v) => v.afterHp)).toEqual(
        result.receipt.run.members.map((m) => m.unit.hp),
      );
      config.mockImplementation(() => {
        throw Error('Configuration unavailable');
      });
      seeds.next.mockClear();
      const replay = await advance.execute('player', {
        key: 'encounter',
        expectedRevision: before.revision,
        request: { runId: 'start', nodeId: 'encounter', campaignVersion: 1, assignments: [] },
      });
      expect(replay.receipt).toEqual(result.receipt);
      expect(seeds.next).not.toHaveBeenCalled();
    }
  });
  it('rejects invalid narrative configuration before requesting another seed or committing an encounter', async () => {
    const { games, move, config, seeds } = await setup();
    for (const node of ['duel', 'refuge', 'chest', 'pact']) await move(node);
    const campaign = campaignFixture();
    config.mockReturnValue({
      ...campaign,
      nodes: campaign.nodes.map((node) =>
        node.kind === 'encounter'
          ? {
              ...node,
              choices: [
                { ...node.choices[0], narrative: { version: 0, text: { es: 'Relato', en: '' } } },
              ],
            }
          : node,
      ),
    });
    const before = games.state;
    seeds.next.mockClear();
    await expect(move('encounter')).rejects.toThrow('INVALID_CAMPAIGN');
    expect(games.state).toEqual(before);
    expect(seeds.next).not.toHaveBeenCalled();
  });
  it('keeps legacy encounter receipts without invented resolution and rejects mismatched stored resolution', async () => {
    const { games, move } = await setup();
    for (const node of ['duel', 'refuge', 'chest', 'pact', 'encounter']) await move(node);
    const legacy = structuredClone(games.state);
    const receipt = legacy.receipts.find(
      (r) => r.kind === 'advance-node' && r.request.nodeId === 'encounter',
    );
    if (receipt?.kind !== 'advance-node' || !receipt.encounter) throw Error('Missing encounter');
    const { resolution, ...prior } = receipt.encounter;
    const historical = {
      ...legacy,
      receipts: legacy.receipts.map((r) =>
        r.id === receipt.id ? { ...receipt, encounter: prior } : r,
      ),
    };
    expect(gameSnapshot(historical).receipts.find((r) => r.id === receipt.id)).toMatchObject({
      encounter: { seed: 42, choice: 0 },
    });
    expect(JSON.stringify(gameSnapshot(historical))).not.toContain('resolution');
    if (!resolution) throw Error('Missing resolution');
    const corrupt = {
      ...legacy,
      receipts: legacy.receipts.map((r) =>
        r.id === receipt.id
          ? {
              ...receipt,
              encounter: {
                ...prior,
                resolution: {
                  ...resolution,
                  vitals: resolution.vitals.map((v, index) =>
                    index === 0 ? { ...v, afterHp: v.afterHp - 1 } : v,
                  ),
                },
              },
            }
          : r,
      ),
    };
    expect(() => gameSnapshot(corrupt)).toThrow('INVALID_GAME');
  });
  it('starts an immutable run using owned copies and rejects duplicate or unknown formation', async () => {
    const { games, start } = await setup();
    expect(games.state.exploration?.run).toMatchObject({
      id: 'start',
      status: 'active',
      visited: [],
      members: [
        { source: 'owned', unit: { id: 'copy0', wizardId: 'merlin' } },
        { source: 'owned' },
        { source: 'owned' },
      ],
    });
    const before = games.state;
    await expect(
      start.execute('player', {
        key: 'invalid',
        expectedRevision: 2,
        request: { ...startRequest, copyIds: ['copy0', 'copy0', 'copy2'] },
      }),
    ).rejects.toThrow('INVALID_FORMATION');
    await expect(
      start.execute('player', {
        key: 'other',
        expectedRevision: 2,
        request: { ...startRequest, copyIds: ['copy0', 'other-player', 'copy2'] },
      }),
    ).rejects.toThrow('INVALID_FORMATION');
    expect(games.state).toEqual(before);
  });
  it('spends five essence and commits log, HP/PM, complete first reward and victory progress', async () => {
    const { games, move, seeds } = await setup();
    const result = await move('duel');
    expect(result.receipt).toMatchObject({
      kind: 'advance-node',
      battle: { outcome: 'player', input: { seed: 42 } },
      reward: { crowns: 100, products: ['random-beans'] },
      firstVictory: true,
    });
    expect(games.state.inventory).toMatchObject({ crowns: 150, essence: { points: 45 } });
    expect(games.state.exploration?.run?.visited).toEqual(['duel']);
    expect(games.state.exploration?.run?.members[0].unit.mana).toBe(19);
    expect(games.state.exploration?.victories).toEqual([{ levelId: 'level1', version: 1 }]);
    expect(seeds.next).toHaveBeenCalledTimes(1);
  });
  it('heals forty percent capped at max HP without spending essence or requesting a seed', async () => {
    const { games, move, seeds } = await setup();
    await move('duel');
    const run = games.state.exploration!.run!;
    games.state = gameSnapshot({
      ...games.state,
      exploration: {
        ...games.state.exploration!,
        run: { ...run, members: run.members.map((m) => ({ ...m, unit: { ...m.unit, hp: 30 } })) },
      },
    });
    await move('refuge');
    expect(games.state.exploration?.run?.members.every((m) => m.unit.hp === 70)).toBe(true);
    expect(games.state.inventory.essence.points).toBe(45);
    expect(seeds.next).toHaveBeenCalledTimes(1);
  });
  it('resolves chest, temporary pact, seeded encounter and boss unlocking and gold key', async () => {
    const { games, move } = await setup();
    for (const node of ['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss']) await move(node);
    expect(games.state.inventory.crowns).toBe(275);
    expect(games.state.inventory.goldKeys).toBe(1);
    expect(games.state.inventory.essence.points).toBe(40);
    expect(games.state.exploration?.run?.status).toBe('won');
    expect(games.state.exploration?.run?.members).toHaveLength(4);
    expect(games.state.exploration?.run?.members[3].source).toBe('temporary');
    expect(games.state.copies).toHaveLength(3);
    expect(games.state.exploration?.unlockedZones).toEqual(['bulevar', 'pasaje']);
  });
  it('grants only ten percent crowns on repeat victories and no repeat items or keys', async () => {
    const { games, move, start, advance } = await setup();
    for (const node of ['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss']) await move(node);
    await start.execute('player', {
      key: 'start2',
      expectedRevision: games.state.revision,
      request: startRequest,
    });
    const result = await advance.execute('player', {
      key: 'repeat',
      expectedRevision: games.state.revision,
      request: { runId: 'start2', nodeId: 'duel', campaignVersion: 1, assignments: [] },
    });
    expect(result.receipt).toMatchObject({
      firstVictory: false,
      reward: { crowns: 10, products: [], goldKeys: 0 },
    });
    expect(games.state.inventory.crowns).toBe(285);
  });
  it('consumes an assigned bean exactly once in the same commit and recovers replay after config changes', async () => {
    const { games, move, advance, seeds, config, clock } = await setup();
    games.state = gameSnapshot({
      ...games.state,
      inventory: {
        ...games.state.inventory,
        products: [{ id: 'bean', kind: 'random-beans', status: 'available' }],
      },
    });
    const request = {
      runId: 'start',
      nodeId: 'duel',
      campaignVersion: 1,
      assignments: [{ unitId: 'copy0', beanId: 'bean' }],
    };
    const result = await move('duel', 'duel', request.assignments);
    expect(games.state.inventory.products.find((u) => u.id === 'bean')).toMatchObject({
      status: 'consumed',
      operationId: 'duel',
    });
    config.mockImplementation(() => {
      throw Error('configuration offline');
    });
    clock.now.mockImplementation(async () => {
      throw Error('clock offline');
    });
    expect(
      (await advance.execute('player', { key: 'duel', expectedRevision: 2, request })).receipt,
    ).toEqual(result.receipt);
    expect(seeds.next).toHaveBeenCalledTimes(1);
  });
  it('rejects adjacency, stale version, stale revision, wrong run and foreign bean before seed or spending', async () => {
    const { games, move, advance, seeds } = await setup();
    const before = games.state;
    await expect(move('boss')).rejects.toThrow('INVALID_NODE');
    await expect(
      move('duel', 'invalid-bean', [{ unitId: 'copy0', beanId: 'foreign' }]),
    ).rejects.toThrow('UNIT_UNAVAILABLE');
    for (const request of [
      { runId: 'other', campaignVersion: 1 },
      { runId: 'start', campaignVersion: 2 },
    ])
      await expect(
        advance.execute('player', {
          key: 'other',
          expectedRevision: 2,
          request: { ...request, nodeId: 'duel', assignments: [] },
        }),
      ).rejects.toThrow();
    await expect(
      advance.execute('player', {
        key: 'stale',
        expectedRevision: 1,
        request: { runId: 'start', campaignVersion: 1, nodeId: 'duel', assignments: [] },
      }),
    ).rejects.toThrow('STALE_GAME');
    expect(seeds.next).not.toHaveBeenCalled();
    expect(games.state).toEqual(before);
  });
  it('regenerates essence with the authority clock and rejects insufficient essence without resolving', async () => {
    const { games, move, seeds, clock } = await setup();
    games.state = gameSnapshot({
      ...games.state,
      inventory: { ...games.state.inventory, essence: { points: 4, cursor: 0 } },
    });
    await expect(move('duel')).rejects.toThrow('INSUFFICIENT_ESSENCE');
    expect(seeds.next).not.toHaveBeenCalled();
    clock.now.mockResolvedValue(720_000);
    await move('duel');
    expect(games.state.inventory.essence.points).toBe(0);
  });
  it('commits defeat without rewards, charges combat once and closes the trial run', async () => {
    const { games, move, config } = await setup();
    const campaign = campaignFixture();
    config.mockReturnValue({
      ...campaign,
      nodes: campaign.nodes.map((n) =>
        n.kind === 'duel'
          ? {
              ...n,
              opponents: n.opponents.map((u) => ({
                ...u,
                power: 1000,
                speed: 1000,
                hp: 1000,
                maxHp: 1000,
              })),
            }
          : n,
      ),
    });
    const result = await move('duel');
    expect(result.receipt).toMatchObject({
      battle: { outcome: 'rival' },
      reward: { crowns: 0, products: [], goldKeys: 0 },
    });
    expect(games.state.exploration?.run?.status).toBe('lost');
    expect(games.state.inventory.crowns).toBe(50);
    expect(games.state.inventory.essence.points).toBe(45);
    await expect(move('refuge')).rejects.toThrow('RUN_CLOSED');
  });
  it('rolls back failures, recovers lost responses and serializes competing requests', async () => {
    const { games, move, advance } = await setup();
    const before = games.state;
    games.fail = true;
    await expect(move('duel')).rejects.toThrow('storage failed');
    expect(games.state).toEqual(before);
    games.fail = false;
    games.lost = true;
    await expect(move('duel')).rejects.toThrow('response lost');
    games.lost = false;
    await advance.execute('player', {
      key: 'duel',
      expectedRevision: 2,
      request: { runId: 'start', nodeId: 'duel', campaignVersion: 1, assignments: [] },
    });
    expect(games.state.inventory.essence.points).toBe(45);
    expect(games.state.inventory.crowns).toBe(150);
    const commands = ['a', 'b'].map((key) => ({
      key,
      expectedRevision: games.state.revision,
      request: { runId: 'start', nodeId: 'refuge', campaignVersion: 1, assignments: [] },
    }));
    const results = await Promise.allSettled(commands.map((cmd) => advance.execute('player', cmd)));
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
  });
});

describe('ARCANA run adversarial configuration and receipts', () => {
  it('rejects key reuse with another node or assignment and retains its original battle', async () => {
    const { games, move, advance, seeds } = await setup();
    const result = await move('duel');
    await expect(
      advance.execute('player', {
        key: 'duel',
        expectedRevision: games.state.revision,
        request: { runId: 'start', nodeId: 'refuge', campaignVersion: 1, assignments: [] },
      }),
    ).rejects.toThrow('OPERATION_CONFLICT');
    expect(games.state.receipts.find((r) => r.id === 'duel')).toEqual(result.receipt);
    expect(seeds.next).toHaveBeenCalledTimes(1);
  });
  it('rejects malformed campaign and foreign-owned formation stats before random', async () => {
    const { move, config, seeds, games, start } = await setup();
    const campaign = campaignFixture();
    config.mockReturnValue({
      ...campaign,
      nodes: campaign.nodes.map((n) =>
        n.kind === 'duel' ? { ...n, reward: { ...n.reward, crowns: NaN } } : n,
      ),
    });
    await expect(move('duel')).rejects.toThrow('INVALID_CAMPAIGN');
    expect(seeds.next).not.toHaveBeenCalled();
    config.mockReturnValue({
      ...campaign,
      prepareOwned: (copy) => ({ ...campaign.prepareOwned(copy), power: 999 }),
    });
    await expect(
      start.execute('player', {
        key: 'tampered',
        expectedRevision: games.state.revision,
        request: startRequest,
      }),
    ).rejects.toThrow('INVALID_FORMATION');
  });
  it('does not depend on the authority clock for a refuge, and does not regenerate for exploration', async () => {
    const { games, move, clock } = await setup();
    await move('duel');
    clock.now.mockRejectedValue(Error('clock offline'));
    await move('refuge');
    expect(games.state.inventory.essence.points).toBe(45);
  });
  it('recovers a start after another command without rebuilding formation or configuration', async () => {
    const { games, start, move, config } = await setup();
    const original = games.state.receipts[0];
    await move('duel');
    config.mockImplementation(() => {
      throw Error('offline');
    });
    const replay = await start.execute('player', {
      key: 'start',
      expectedRevision: 1,
      request: startRequest,
    });
    expect(replay.receipt).toEqual(original);
    expect(replay.state.revision).toBe(3);
  });
  it('rejects invalid stored graph, formation, consumed bean receipt and battle seed', async () => {
    const { games, move } = await setup();
    await move('duel');
    const state = games.state;
    expect(() =>
      gameSnapshot({
        ...state,
        exploration: {
          ...state.exploration!,
          run: { ...state.exploration!.run!, visited: ['boss'] },
        },
      }),
    ).toThrow('INVALID_GAME');
    expect(() =>
      gameSnapshot({
        ...state,
        exploration: {
          ...state.exploration!,
          run: {
            ...state.exploration!.run!,
            members: state.exploration!.run!.members.map((m) => ({
              ...m,
              unit: { ...m.unit, id: 'foreign' },
            })),
          },
        },
      }),
    ).toThrow('INVALID_GAME');
    expect(() =>
      gameSnapshot({
        ...state,
        inventory: {
          ...state.inventory,
          products: [{ id: 'bean', kind: 'random-beans', status: 'consumed', operationId: 'duel' }],
        },
      }),
    ).toThrow('INVALID_GAME');
    expect(() =>
      gameSnapshot({
        ...state,
        receipts: state.receipts.map((r) =>
          r.kind === 'advance-node' && r.battle
            ? { ...r, battle: { ...r.battle, input: { ...r.battle.input, seed: -1 } } }
            : r,
        ),
      }),
    ).toThrow('INVALID_GAME');
  });
  it('commits a draw with no reward at the round limit', async () => {
    const { games, move, config } = await setup();
    const campaign = campaignFixture();
    config.mockReturnValue({
      ...campaign,
      combatRules: { ...campaign.combatRules, maxRounds: 1 },
      nodes: campaign.nodes.map((n) =>
        n.kind === 'duel'
          ? { ...n, opponents: n.opponents.map((u) => ({ ...u, hp: 1000, maxHp: 1000 })) }
          : n,
      ),
    });
    const result = await move('duel');
    expect(result.receipt).toMatchObject({ battle: { outcome: 'draw' }, reward: { crowns: 0 } });
    expect(games.state.exploration?.run?.status).toBe('draw');
    expect(games.state.exploration?.victories).toEqual([]);
  });
  it('rejects using the same bean twice or assigning a bean to a noncombat node', async () => {
    const { games, move, seeds } = await setup();
    games.state = gameSnapshot({
      ...games.state,
      inventory: {
        ...games.state.inventory,
        products: [{ id: 'bean', kind: 'random-beans', status: 'available' }],
      },
    });
    await expect(
      move('duel', 'bad', [
        { unitId: 'copy0', beanId: 'bean' },
        { unitId: 'copy1', beanId: 'bean' },
      ]),
    ).rejects.toThrow('INVALID_OPERATION');
    expect(seeds.next).not.toHaveBeenCalled();
    await move('duel');
    await expect(
      move('refuge', 'bad-refuge', [{ unitId: 'copy0', beanId: 'bean' }]),
    ).rejects.toThrow('INVALID_OPERATION');
    expect(games.state.inventory.products.find((u) => u.id === 'bean')?.status).toBe('available');
  });
  it('ends a run after a configured lethal risk event without minting rewards or copies', async () => {
    const { games, move, config } = await setup();
    for (const node of ['duel', 'refuge', 'chest', 'pact']) await move(node);
    const campaign = campaignFixture();
    config.mockReturnValue({
      ...campaign,
      nodes: campaign.nodes.map((n) =>
        n.kind === 'encounter'
          ? { ...n, choices: [{ weight: 1, effect: { kind: 'damage', fraction: 1 } }] }
          : n,
      ),
    });
    await move('encounter');
    expect(games.state.exploration?.run?.status).toBe('lost');
    expect(games.state.inventory.crowns).toBe(170);
    expect(games.state.copies).toHaveLength(3);
  });
});

describe('ARCANA repeat reward preflight', () => {
  it('validates the actual repeat reward instead of reserving the full first-victory reward', async () => {
    const { games, move, start, advance } = await setup();
    for (const node of ['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss']) await move(node);
    await start.execute('player', {
      key: 'start2',
      expectedRevision: games.state.revision,
      request: startRequest,
    });
    games.state = gameSnapshot({
      ...games.state,
      inventory: { ...games.state.inventory, crowns: Number.MAX_SAFE_INTEGER - 10 },
    });
    const result = await advance.execute('player', {
      key: 'repeat-cap',
      expectedRevision: games.state.revision,
      request: { runId: 'start2', nodeId: 'duel', campaignVersion: 1, assignments: [] },
    });
    expect(result.state.inventory.crowns).toBe(Number.MAX_SAFE_INTEGER);
  });
});

it('focus restores mana with a matching receipt, clamps values and replay conflicts on another choice', async () => {
  const { games, move, advance } = await setup();
  await move('duel');
  const run = games.state.exploration!.run!;
  games.state = gameSnapshot({
    ...games.state,
    exploration: {
      ...games.state.exploration!,
      run: {
        ...run,
        members: run.members.map((m, i) => ({
          ...m,
          unit: { ...m.unit, mana: i === 0 ? 0 : m.unit.maxMana - 1 },
        })),
      },
    },
  });
  const before = games.state;
  const command = {
    key: 'focus',
    expectedRevision: before.revision,
    request: {
      runId: 'start',
      nodeId: 'refuge',
      campaignVersion: 1,
      assignments: [],
      refugeAction: 'focus' as const,
    },
  };
  const first = await advance.execute('player', command);
  expect(first.state.exploration!.run!.members.map((m) => m.unit.mana)).toEqual(
    run.members.map((m, i) => (i === 0 ? m.unit.maxMana * 0.4 : m.unit.maxMana)),
  );
  expect(first.state.exploration!.run!.members.map((m) => m.unit.hp)).toEqual(
    run.members.map((m) => m.unit.hp),
  );
  expect(first.state.inventory).toEqual(before.inventory);
  expect(await advance.execute('player', command)).toEqual(first);
  await expect(
    advance.execute('player', {
      ...command,
      request: { ...command.request, refugeAction: 'heal' },
    }),
  ).rejects.toMatchObject({ code: 'OPERATION_CONFLICT' });
});
it('passes an encounter without seed acquisition, effects or rewards and recovers it', async () => {
  const { games, move, advance, seeds } = await setup();
  for (const node of ['duel', 'refuge', 'chest', 'pact']) await move(node);
  const before = games.state,
    count = seeds.next.mock.calls.length;
  const command = {
    key: 'pass',
    expectedRevision: before.revision,
    request: {
      runId: 'start',
      nodeId: 'encounter',
      campaignVersion: 1,
      assignments: [],
      encounterAction: 'pass' as const,
    },
  };
  const result = await advance.execute('player', command);
  expect(seeds.next).toHaveBeenCalledTimes(count);
  expect(result.receipt).toMatchObject({
    encounter: null,
    reward: { crowns: 0, goldKeys: 0, products: [] },
  });
  expect(result.state.inventory).toEqual(before.inventory);
  expect(result.state.exploration!.run!.members).toEqual(before.exploration!.run!.members);
  expect(await advance.execute('player', command)).toEqual(result);
});
it('never replaces an owned copy and permits replacing a temporary ally or passing a full pact', async () => {
  for (const action of ['replace', 'pass'] as const) {
    const { games, move, advance } = await setup();
    for (const node of ['duel', 'refuge', 'chest']) await move(node);
    const run = games.state.exploration!.run!;
    const extra = [0, 1].map((i) => ({
      source: 'temporary' as const,
      unit: { ...run.members[0].unit, id: `extra${i}` },
    }));
    games.state = gameSnapshot({
      ...games.state,
      exploration: {
        ...games.state.exploration!,
        run: { ...run, members: [...run.members, ...extra] },
      },
    });
    const before = games.state;
    const command = {
      key: 'choose-pact',
      expectedRevision: before.revision,
      request: {
        runId: 'start',
        nodeId: 'pact',
        campaignVersion: 1,
        assignments: [],
        pactAction: 'recruit' as const,
        replaceUnitId: run.members[0].unit.id,
      },
    };
    await expect(advance.execute('player', command)).rejects.toMatchObject({
      code: 'INVALID_FORMATION',
    });
    expect(games.state).toEqual(before);
    const result = await advance.execute('player', {
      ...command,
      request: {
        ...command.request,
        pactAction: action === 'pass' ? 'pass' : 'recruit',
        replaceUnitId: action === 'pass' ? undefined : 'extra0',
      },
    });
    expect(result.state.copies).toEqual(before.copies);
    expect(result.state.exploration!.run!.members).toHaveLength(5);
    if (action === 'replace')
      expect(result.state.exploration!.run!.members.map((m) => m.unit.id)).not.toContain('extra0');
    else expect(result.state.exploration!.run!.members).toEqual(before.exploration!.run!.members);
  }
});
it('rejects options for another node before consuming inventory', async () => {
  const { games, advance } = await setup();
  const before = games.state;
  await expect(
    advance.execute('player', {
      key: 'wrong-kind',
      expectedRevision: before.revision,
      request: {
        runId: 'start',
        nodeId: 'duel',
        campaignVersion: 1,
        assignments: [],
        refugeAction: 'focus',
      },
    }),
  ).rejects.toMatchObject({ code: 'INVALID_OPERATION' });
  expect(games.state).toEqual(before);
});
it('persists a generated route before a lost start response and never acquires another seed on replay', async () => {
  const games = new MemoryGames(),
    config = vi.fn(() => ({ ...campaignFixture(), routeVariation: true })),
    seeds = { next: vi.fn(() => 991) };
  const start = new StartRunUseCase(games, config, {
    seeds,
    random: { fromSeed: (seed) => new SeededRandom(seed) },
  });
  const command = { key: 'variable-start', expectedRevision: 1, request: startRequest };
  games.lost = true;
  await expect(start.execute('player', command)).rejects.toThrow('response lost');
  const committed = gameSnapshot(games.state);
  expect(committed.exploration!.run!.routeGeneration).toEqual({ version: 1, seed: 991 });
  games.lost = false;
  config.mockImplementation(() => {
    throw Error('configuration unavailable');
  });
  const replay = await start.execute('player', command);
  expect(replay.state).toEqual(committed);
  expect(seeds.next).toHaveBeenCalledTimes(1);
  expect(replay.receipt.kind === 'start-run' && replay.receipt.run.graph).toEqual(
    committed.exploration!.run!.graph,
  );
});
