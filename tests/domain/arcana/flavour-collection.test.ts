import { describe, expect, it } from 'vitest';
import { flavourCollection } from '../../../src/arcana/application/client/flavour-collection';
import { gameSnapshot, type GameState } from '../../../src/arcana/application/game';
import {
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
  StartRunUseCase,
} from '../../../src/arcana/application/run-use-cases';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import type { BeanFlavour } from '../../../src/arcana/domain/combat/beans';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { campaignFixture, runInitial } from './support/run-fixtures';

const setup = async (flavour: BeanFlavour = 'mint', defeat = false) => {
  const initial = runInitial();
  let state = gameSnapshot({
    ...initial,
    inventory: {
      ...initial.inventory,
      products: ['bean-a', 'bean-b'].map((id) => ({
        id,
        kind: 'random-beans' as const,
        status: 'available' as const,
      })),
    },
  });
  const games = {
    read: async () => state,
    transact: async (_: string, change: (current: GameState) => GameState) =>
      (state = gameSnapshot(change(state))),
  };
  const config = () => {
    const campaign = campaignFixture();
    return {
      ...campaign,
      nodes: defeat
        ? campaign.nodes.map((node) =>
            node.kind === 'duel'
              ? {
                  ...node,
                  opponents: node.opponents.map((unit) => ({
                    ...unit,
                    power: 1000,
                    speed: 1000,
                    hp: 1000,
                    maxHp: 1000,
                  })),
                }
              : node,
          )
        : campaign.nodes,
      combatRules: {
        ...campaign.combatRules,
        beans: { version: 7, entries: [{ flavour, weight: 1 }] },
      },
    };
  };
  const random = { fromSeed: (seed: number) => new SeededRandom(seed) },
    seeds = { next: () => 42 };
  const advance = new AdvanceNodeUseCase(
    games,
    config,
    new ResolveCombatUseCase(new CombatEngine(random), seeds),
    { now: async () => 0 },
    random,
    seeds,
  );
  await new StartRunUseCase(games, config).execute('player', {
    key: 'start',
    expectedRevision: 1,
    request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0', 'copy1', 'copy2'] },
  });
  const move = (nodeId: string, beanId?: string) =>
    advance.execute('player', {
      key: nodeId,
      expectedRevision: state.revision,
      request: {
        runId: 'start',
        nodeId,
        campaignVersion: 1,
        assignments: beanId ? [{ unitId: 'copy0', beanId }] : [],
      },
    });
  return { state: () => state, move, advance };
};

describe('flavour collection from committed player activations', () => {
  it('leaves available beans and old saves undiscovered without changing state', () => {
    const state = gameSnapshot(runInitial()),
      before = JSON.stringify(state);
    expect(flavourCollection(state)).toEqual(
      ['mint', 'pepper', 'earth', 'soap'].map((flavour) => ({
        flavour,
        discovered: false,
        activations: 0,
        firstDiscovery: null,
      })),
    );
    expect(JSON.stringify(state)).toBe(before);
  });
  it.each(['mint', 'pepper', 'earth', 'soap'] as const)(
    'projects confirmed %s independently of theme or current rules',
    async (flavour) => {
      const { state, move } = await setup(flavour);
      expect(flavourCollection(state()).every((entry) => !entry.discovered)).toBe(true);
      await move('duel', 'bean-a');
      const stored = JSON.stringify(state()),
        entries = flavourCollection(JSON.parse(stored) as GameState);
      expect(entries.find((entry) => entry.flavour === flavour)).toEqual({
        flavour,
        discovered: true,
        activations: 1,
        firstDiscovery: {
          operationId: 'duel',
          beanUnitId: 'bean-a',
          battleId: 'duel:battle',
          rulesVersion: 7,
        },
      });
      expect(entries.filter((entry) => entry.discovered)).toHaveLength(1);
      expect(JSON.stringify(state())).toBe(stored);
      expect(Object.isFrozen(entries)).toBe(true);
      expect(Object.isFrozen(entries[0])).toBe(true);
    },
  );
  it('keeps a taste from a confirmed defeat rather than tying discovery to rewards', async () => {
    const { state, move } = await setup('mint', true);
    const result = await move('duel', 'bean-a');
    expect(result.receipt).toMatchObject({ battle: { outcome: 'rival' }, reward: { crowns: 0 } });
    expect(flavourCollection(state()).find((entry) => entry.flavour === 'mint')).toMatchObject({
      discovered: true,
      activations: 1,
    });
  });
  it('counts different units once and retains the first discovery after replay', async () => {
    const { state, move, advance } = await setup();
    const first = await move('duel', 'bean-a');
    const original = flavourCollection(first.state).find((entry) => entry.flavour === 'mint')!;
    await advance.execute('player', {
      key: 'duel',
      expectedRevision: 2,
      request: {
        runId: 'start',
        nodeId: 'duel',
        campaignVersion: 1,
        assignments: [{ unitId: 'copy0', beanId: 'bean-a' }],
      },
    });
    expect(flavourCollection(state()).find((entry) => entry.flavour === 'mint')).toEqual(original);
    for (const node of ['refuge', 'chest', 'pact', 'encounter']) await move(node);
    await move('boss', 'bean-b');
    expect(flavourCollection(state()).find((entry) => entry.flavour === 'mint')).toEqual({
      ...original,
      activations: 2,
    });
  });
  it('does not derive discoveries from rivals, unknown flavours, missing consumption or duplicate log events', async () => {
    const { state, move } = await setup();
    await move('duel', 'bean-a');
    const committed = state(),
      receipt = committed.receipts.find((r) => r.kind === 'advance-node')!;
    if (receipt.kind !== 'advance-node' || !receipt.battle) throw Error('Missing battle');
    const activation = receipt.battle.events.find((event) => event.kind === 'bean-activated')!;
    if (activation.kind !== 'bean-activated') throw Error('Missing activation');
    const altered = (replacement: object) =>
      ({
        ...committed,
        receipts: committed.receipts.map((r) =>
          r.id === receipt.id
            ? {
                ...receipt,
                battle: {
                  ...receipt.battle!,
                  events: receipt.battle!.events.map((e) =>
                    e.kind === 'bean-activated' ? { ...activation, ...replacement } : e,
                  ),
                },
              }
            : r,
        ),
      }) as GameState;
    expect(
      flavourCollection(altered({ actorId: receipt.battle.input.rival[0].id })).every(
        (entry) => !entry.discovered,
      ),
    ).toBe(true);
    const rivalOnly = altered({ actorId: receipt.battle.input.rival[0].id });
    const assignedRival = {
      ...rivalOnly,
      receipts: rivalOnly.receipts.map((r) =>
        r.kind === 'advance-node'
          ? {
              ...r,
              request: {
                ...r.request,
                assignments: [{ unitId: receipt.battle!.input.rival[0].id, beanId: 'bean-a' }],
              },
            }
          : r,
      ),
    };
    expect(flavourCollection(assignedRival).every((entry) => !entry.discovered)).toBe(true);
    expect(
      flavourCollection(altered({ flavour: 'invented' })).every((entry) => !entry.discovered),
    ).toBe(true);
    expect(
      flavourCollection(altered({ flavour: 'pepper' })).every((entry) => !entry.discovered),
    ).toBe(true);
    const noConsumption = {
      ...committed,
      inventory: {
        ...committed.inventory,
        products: committed.inventory.products.map((unit) =>
          unit.id === 'bean-a' ? { ...unit, operationId: 'other' } : unit,
        ),
      },
    };
    expect(flavourCollection(noConsumption).every((entry) => !entry.discovered)).toBe(true);
    const duplicateEvent = {
      ...committed,
      receipts: committed.receipts.map((r) =>
        r.id === receipt.id
          ? {
              ...receipt,
              battle: { ...receipt.battle!, events: [...receipt.battle!.events, activation] },
            }
          : r,
      ),
    };
    expect(
      flavourCollection(duplicateEvent).find((entry) => entry.flavour === 'mint')?.activations,
    ).toBe(1);
    const duplicated = { ...committed, receipts: [...committed.receipts, receipt] };
    expect(
      flavourCollection(duplicated).find((entry) => entry.flavour === 'mint')?.activations,
    ).toBe(1);
    expect(() =>
      flavourCollection({
        ...committed,
        receipts: [{ kind: 'advance-node' }],
      } as unknown as GameState),
    ).not.toThrow();
  });
});
