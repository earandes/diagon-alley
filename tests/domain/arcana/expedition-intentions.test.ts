import { describe, expect, it } from 'vitest';
import {
  bindIntention,
  intentionSnapshot,
} from '../../../src/arcana/domain/exploration/intentions';
import {
  availableIntentions,
  intentionProgress,
} from '../../../src/arcana/application/client/expedition-intentions';
import { runInitial, campaignFixture } from './support/run-fixtures';
import type { GameState } from '../../../src/arcana/application/game';
import type { Run } from '../../../src/arcana/domain/exploration/run';
import type { NodeReceipt } from '../../../src/arcana/application/run-contracts';
import type { Combat } from '../../../src/arcana/domain/combat/engine';

const availability = {
  ownedAffinities: { merlin: 'alchemy', circe: 'shadows' } as const,
  beanPrice: 5,
};
function closedGame(): GameState {
  const base = runInitial();
  const campaign = campaignFixture();
  const copies = base.copies.map((copy, index) =>
    index === 2 ? { ...copy, wizard: { ...copy.wizard, id: 'circe' } } : copy,
  );
  const run: Run = {
    id: 'old-run',
    campaignVersion: 1,
    graphVersion: 1,
    graph: campaign.graph,
    zoneId: 'bulevar',
    visited: campaign.graph.nodes.map((n) => n.id),
    status: 'won',
    members: copies
      .slice(0, 2)
      .map((copy) => ({ source: 'owned', unit: campaign.prepareOwned(copy) })),
  };
  return {
    ...base,
    copies,
    inventory: { ...base.inventory, crowns: 50 },
    exploration: { run, victories: [], unlockedZones: ['bulevar'] },
  };
}
function battleReceipt(runId: string, events: Combat['events'], wizardId = 'merlin'): NodeReceipt {
  const game = closedGame();
  return {
    id: 'event',
    kind: 'advance-node',
    request: { runId, nodeId: 'duel', campaignVersion: 1, assignments: [] },
    run: { ...game.exploration!.run!, id: runId },
    reward: { crowns: 0, goldKeys: 0, products: [] },
    firstVictory: false,
    encounter: null,
    battle: {
      input: { player: [{ id: wizardId === 'circe' ? 'copy2' : 'copy0', wizardId, hp: 100 }] },
      events,
    } as unknown as Combat,
  };
}

describe('A65 voluntary intentions are evidence-bound and do not grant prizes', () => {
  it('does not offer a synergy already activated before a defeat with all members fallen', () => {
    const base = closedGame();
    const game = {
      ...base,
      copies: base.copies.map((copy) => ({ ...copy, wizard: { ...copy.wizard, id: 'merlin' } })),
      exploration: {
        ...base.exploration!,
        run: {
          ...base.exploration!.run!,
          status: 'lost' as const,
          members: base.exploration!.run!.members.map((member) => ({
            ...member,
            unit: { ...member.unit, hp: 0 },
          })),
        },
      },
      receipts: [
        battleReceipt('old-run', [
          {
            kind: 'synergy-activated' as const,
            team: 'player' as const,
            affinity: 'alchemy' as const,
            members: 3,
            round: 0,
            sequence: 1,
          },
        ]),
      ],
    };
    expect(availableIntentions(game, availability)).not.toContainEqual({
      kind: 'synergy',
      affinity: 'alchemy',
    });
  });
  it('does not call an owned companion new when it fought earlier and was later removed', () => {
    const base = closedGame();
    const game = { ...base, receipts: [battleReceipt('old-run', [], 'circe')] };
    expect(availableIntentions(game, availability)).not.toContainEqual({
      kind: 'new-companion',
      wizardId: 'circe',
    });
  });
  it('suggests only owned new companions, reachable synergies and an affordable bean attempt', () => {
    const game = closedGame(),
      before = JSON.stringify(game);
    const options = availableIntentions(game, availability);
    expect(options).toContainEqual({ kind: 'new-companion', wizardId: 'circe' });
    expect(options).toContainEqual({ kind: 'synergy', affinity: 'shadows' });
    expect(options).toContainEqual({ kind: 'bean' });
    expect(options).not.toContainEqual({ kind: 'synergy', affinity: 'alchemy' });
    expect(options.length).toBeLessThanOrEqual(3);
    expect(JSON.stringify(game)).toBe(before);
  });
  it('does not suggest a purchase that cannot be afforded or an unavailable character', () => {
    const game = closedGame();
    const options = availableIntentions(
      { ...game, copies: game.copies.slice(0, 1), inventory: { ...game.inventory, crowns: 0 } },
      availability,
    );
    expect(options).toEqual([]);
    expect(
      availableIntentions(
        {
          ...game,
          exploration: {
            ...game.exploration!,
            run: { ...game.exploration!.run!, status: 'active', visited: [] },
          },
        },
        availability,
      ),
    ).toEqual([]);
  });
  it('binds a selected intention once and never carries an attempted intention into another run', () => {
    const selected = {
      version: 1 as const,
      afterRunId: 'old-run',
      runId: null,
      choice: { kind: 'bean' as const },
    };
    const active = bindIntention(selected, 'old-run', 'new-run');
    expect(active?.runId).toBe('new-run');
    expect(bindIntention(active, 'new-run', 'third-run')).toBeNull();
    expect(bindIntention(selected, 'different-run', 'new-run')).toBeNull();
    expect(selected.runId).toBeNull();
  });
  it('requires a confirmed player activation from the bound run and never promises a new flavour', () => {
    const game = closedGame();
    const intention = {
      version: 1 as const,
      afterRunId: 'old-run',
      runId: 'new-run',
      choice: { kind: 'bean' as const },
    };
    const activation = {
      kind: 'bean-activated' as const,
      actorId: 'copy0',
      unitId: 'jar',
      flavour: 'mint' as const,
      hp: 10,
      round: 0,
      sequence: 1,
    };
    const state = {
      ...game,
      exploration: {
        ...game.exploration!,
        run: { ...game.exploration!.run!, id: 'new-run', status: 'active' as const, visited: [] },
        intention,
      },
    };
    expect(
      intentionProgress({ ...state, receipts: [battleReceipt('old-run', [activation])] })?.status,
    ).toBe('active');
    expect(
      intentionProgress({
        ...state,
        receipts: [battleReceipt('new-run', [{ ...activation, actorId: 'rival' }])],
      })?.status,
    ).toBe('active');
    expect(
      intentionProgress({ ...state, receipts: [battleReceipt('new-run', [activation])] }),
    ).toMatchObject({ status: 'completed', evidenceReceiptId: 'event' });
  });
  it('recognises a new companion only in a committed battle, not selection or recruitment', () => {
    const game = closedGame();
    const state = {
      ...game,
      exploration: {
        ...game.exploration!,
        intention: {
          version: 1 as const,
          afterRunId: 'old-run',
          runId: 'new-run',
          choice: { kind: 'new-companion' as const, wizardId: 'circe' },
        },
      },
    };
    expect(intentionProgress(state)?.status).toBe('ended');
    expect(
      intentionProgress({ ...state, receipts: [battleReceipt('new-run', [], 'circe')] })?.status,
    ).toBe('completed');
  });
  it('recognises only the requested player synergy, not a rival activation', () => {
    const game = closedGame();
    const state = {
      ...game,
      exploration: {
        ...game.exploration!,
        intention: {
          version: 1 as const,
          afterRunId: 'old-run',
          runId: 'new-run',
          choice: { kind: 'synergy' as const, affinity: 'shadows' as const },
        },
      },
    };
    const activation = {
      kind: 'synergy-activated' as const,
      team: 'rival' as const,
      affinity: 'shadows' as const,
      members: 1,
      round: 0,
      sequence: 1,
    };
    expect(
      intentionProgress({ ...state, receipts: [battleReceipt('new-run', [activation])] })?.status,
    ).toBe('ended');
    expect(
      intentionProgress({
        ...state,
        receipts: [battleReceipt('new-run', [{ ...activation, team: 'player' }])],
      })?.status,
    ).toBe('completed');
  });
  it('validates snapshots and rejects malformed or self-bound intentions', () => {
    expect(() =>
      intentionSnapshot({
        version: 2,
        afterRunId: 'run',
        runId: null,
        choice: { kind: 'bean' },
      } as never),
    ).toThrow();
    expect(() =>
      intentionSnapshot({ version: 1, afterRunId: 'run', runId: 'run', choice: { kind: 'bean' } }),
    ).toThrow();
    expect(() =>
      intentionSnapshot({
        version: 1,
        afterRunId: 'run',
        runId: null,
        choice: { kind: 'synergy', affinity: 'neutral' },
      } as never),
    ).toThrow();
  });
});
