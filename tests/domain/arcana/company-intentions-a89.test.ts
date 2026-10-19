import { describe, expect, it } from 'vitest';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { gameSnapshot, type GameState } from '../../../src/arcana/application/game';
import { SetIntentionUseCase } from '../../../src/arcana/application/set-intention';
import {
  availableIntentions,
  companyIntentionProgress,
  intentionProgress,
} from '../../../src/arcana/application/client/expedition-intentions';
import {
  bindIntention,
  intentionChoiceSnapshot,
  intentionSnapshot,
  type IntentionChoice,
} from '../../../src/arcana/domain/exploration/intentions';
import type { Combat, BattleEventData } from '../../../src/arcana/domain/combat/engine';
import type { NodeReceipt } from '../../../src/arcana/application/run-contracts';
import { runInitial, campaignFixture } from './support/run-fixtures';

const trial = trialConfiguration();
const availability = {
  ownedAffinities: trial.campaign.ownedAffinities!,
  beanPrice: 5,
  combatRules: trial.campaign.combatRules,
};
const house = { kind: 'company', focus: 'house', house: 'gryffindor' } as const;
const creatures = { kind: 'company', focus: 'bond', group: 'creatures' } as const;
function closed(ids = ['merlin', 'circe', 'flamel']): GameState {
  const base = runInitial(),
    campaign = campaignFixture();
  const copies = ids.map((id, i) => ({
    ...base.copies[0],
    copyId: `copy${i}`,
    wizard: trial.opening.catalog.wizards.find((w) => w.id === id)!,
  }));
  return gameSnapshot({
    ...base,
    copies,
    inventory: { ...base.inventory, crowns: 50 },
    exploration: {
      run: {
        id: 'old',
        zoneId: campaign.zoneId,
        campaignVersion: 1,
        graphVersion: 1,
        graph: campaign.graph,
        visited: campaign.graph.nodes.map((n) => n.id),
        status: 'won',
        members: copies
          .slice(0, 1)
          .map((copy) => ({ source: 'owned', unit: campaign.prepareOwned(copy) })),
      },
      victories: [],
      unlockedZones: [campaign.zoneId],
    },
  });
}
function evidenced(
  base: GameState,
  choice: IntentionChoice,
  event: BattleEventData,
  runId = 'next',
): GameState {
  const run = { ...base.exploration!.run!, id: 'next', status: 'active' as const, visited: [] };
  const receipt = {
    id: 'evidence',
    kind: 'advance-node',
    request: { runId, nodeId: 'duel', campaignVersion: 1, assignments: [] },
    run,
    battle: {
      input: { player: base.copies.map((c) => ({ id: c.copyId, wizardId: c.wizard.id, hp: 100 })) },
      events: [{ ...event, sequence: 0, round: 0 }],
    } as unknown as Combat,
    reward: { crowns: 0, goldKeys: 0, products: [] },
    firstVictory: null,
    encounter: null,
  } as NodeReceipt;
  return {
    ...base,
    exploration: {
      ...base.exploration!,
      run,
      intention: { version: 2, afterRunId: 'old', runId: 'next', choice },
    },
    receipts: [receipt],
  };
}

describe('A89 company intention is a versioned voluntary plan', () => {
  it('preserves v1 and binds v2 once, rejecting malformed or mixed versions', () => {
    const prior = {
      version: 1 as const,
      afterRunId: 'old',
      runId: null,
      choice: { kind: 'bean' as const },
    };
    expect(intentionSnapshot(prior)).toEqual(prior);
    const next = { ...prior, version: 2 as const, choice: house };
    expect(bindIntention(next, 'old', 'next')).toEqual({ ...next, runId: 'next' });
    expect(bindIntention({ ...next, runId: 'next' }, 'next', 'third')).toBeNull();
    for (const bad of [
      { ...next, version: 1 },
      { ...prior, version: 2 },
      { ...next, choice: { ...house, group: 'death' } },
      { ...next, choice: { ...house, house: 'houses' } },
    ])
      expect(() => intentionSnapshot(bad as never)).toThrow();
    expect(intentionChoiceSnapshot(creatures)).toEqual(creatures);
  });

  it('offers one company from distinct owned identities, without rarity or finish multiplier', () => {
    const ids = Object.entries(availability.combatRules.houseMembers!)
      .filter(([, h]) => h === 'gryffindor')
      .slice(0, 3)
      .map(([id]) => id);
    const game = closed(ids),
      before = JSON.stringify(game);
    expect(availableIntentions(game, availability)).toContainEqual(house);
    expect(availableIntentions(game, availability)).toHaveLength(3);
    const repeated = closed([ids[0], ids[0], ids[1]]);
    expect(availableIntentions(repeated, availability).some((c) => c.kind === 'company')).toBe(
      false,
    );
    expect(
      availableIntentions(game, { ...availability, combatRules: undefined }).some(
        (c) => c.kind === 'company',
      ),
    ).toBe(false);
    expect(JSON.stringify(game)).toBe(before);
  });

  it('offers creatures when owned; temporary recruits in the old run never promise next run offers', () => {
    const ids = availability.combatRules.bonds!.members.creatures.slice(0, 3);
    const own = closed([...ids]);
    expect(availableIntentions(own, availability)).toContainEqual(creatures);
    const single = closed([ids[0]]);
    const withTemporaries = {
      ...single,
      exploration: {
        ...single.exploration!,
        run: {
          ...single.exploration!.run!,
          members: own.copies.map((c) => ({
            source: 'temporary' as const,
            unit: trial.campaign.prepareOwned(c),
          })),
        },
      },
    };
    expect(
      availableIntentions(withTemporaries, availability).some((c) => c.kind === 'company'),
    ).toBe(false);
  });
  it('keeps a still-viable legacy selection visible instead of invalidating it when company fills the tray', () => {
    const ids = Object.entries(availability.combatRules.houseMembers!)
      .filter(([, house]) => house === 'gryffindor')
      .slice(0, 3)
      .map(([id]) => id);
    const game = closed(ids);
    const selected = {
      ...game,
      exploration: {
        ...game.exploration!,
        intention: {
          version: 1 as const,
          afterRunId: 'old',
          runId: null,
          choice: { kind: 'bean' as const },
        },
      },
    };
    expect(availableIntentions(selected, availability)).toContainEqual({ kind: 'bean' });
    expect(availableIntentions(selected, availability)).toHaveLength(3);
    expect(intentionProgress(selected, availability)?.status).toBe('selected');
  });

  it('uses only matching own activation in the bound run, not another house, rival or replay', () => {
    const game = closed();
    const activation = {
      kind: 'house-activated',
      team: 'player',
      house: 'gryffindor',
      members: 3,
      tier: 1,
      value: 2,
      contributorIds: game.copies.map((c) => c.copyId),
    } as const;
    const state = evidenced(game, house, activation);
    expect(intentionProgress(state)).toMatchObject({
      status: 'completed',
      evidenceReceiptId: 'evidence',
    });
    expect(intentionProgress(JSON.parse(JSON.stringify(state)))).toEqual(intentionProgress(state));
    expect(
      intentionProgress(evidenced(game, house, { ...activation, team: 'rival' }))?.status,
    ).toBe('active');
    expect(
      intentionProgress(evidenced(game, house, { ...activation, house: 'ravenclaw' }))?.status,
    ).toBe('active');
    expect(intentionProgress(evidenced(game, house, activation, 'other'))?.status).toBe('active');
    const empty = {
      ...state,
      receipts: [],
      exploration: {
        ...state.exploration!,
        run: { ...state.exploration!.run!, status: 'lost' as const },
      },
    };
    expect(intentionProgress(empty)?.status).toBe('ended');
    const bond = {
      kind: 'bond-activated',
      team: 'player',
      group: 'creatures',
      members: 3,
      tier: 1,
      value: 2,
      contributorIds: game.copies.map((c) => c.copyId),
    } as const;
    expect(intentionProgress(evidenced(game, creatures, bond))?.status).toBe('completed');
    expect(intentionProgress(evidenced(game, creatures, { ...bond, group: 'order' }))?.status).toBe(
      'active',
    );
  });

  it('previews the active snapshot and condition including temporary members, never live catalogue', () => {
    const ids = availability.combatRules.bonds!.members.creatures.slice(0, 3),
      game = closed([...ids]);
    const active = {
      ...game,
      exploration: {
        ...game.exploration!,
        run: {
          ...game.exploration!.run!,
          status: 'active' as const,
          campaignSnapshot: { ...campaignFixture(), combatRules: availability.combatRules },
          members: game.copies.map((c, i) => ({
            source: i ? ('temporary' as const) : ('owned' as const),
            unit: { ...trial.campaign.prepareOwned(c), hp: i === 2 ? 0 : 100 },
          })),
        },
      },
    };
    const fresh = {
      ...availability,
      combatRules: {
        ...availability.combatRules,
        bonds: {
          ...availability.combatRules.bonds!,
          members: {
            ...availability.combatRules.bonds!.members,
            creatures: ['absent1', 'absent2', 'absent3'],
          },
        },
      },
    };
    expect(companyIntentionProgress(active, fresh, creatures)).toMatchObject({
      count: 2,
      tier: 0,
      next: 3,
    });
  });

  it('stores and recovers one v2 choice without changing inventory, rejects stale/concurrent and conflicting commands', async () => {
    const ids = Object.entries(availability.combatRules.houseMembers!)
      .filter(([, h]) => h === 'gryffindor')
      .slice(0, 3)
      .map(([id]) => id);
    let state = closed(ids);
    const before = state;
    const transactions = {
      read: async () => state,
      transact: async (_: string, change: (g: GameState) => GameState) => (state = change(state)),
    };
    const use = new SetIntentionUseCase(transactions, () => availability);
    const command = {
      key: 'choose',
      expectedRevision: state.revision,
      request: { afterRunId: 'old', choice: house },
    };
    const result = await use.execute('player', command);
    expect(result.state.exploration!.intention).toMatchObject({
      version: 2,
      choice: house,
      runId: null,
    });
    expect(result.state.inventory).toEqual(before.inventory);
    expect(result.state.copies).toEqual(before.copies);
    expect(await use.execute('player', command)).toEqual(result);
    await expect(
      use.execute('player', { ...command, request: { ...command.request, choice: creatures } }),
    ).rejects.toMatchObject({ code: 'OPERATION_CONFLICT' });
    await expect(use.execute('player', { ...command, key: 'other-tab' })).rejects.toMatchObject({
      code: 'STALE_GAME',
    });
    await expect(use.execute('other-owner', { ...command, key: 'other-owner' })).rejects.toThrow();
    await use.execute('player', {
      key: 'cancel',
      expectedRevision: state.revision,
      request: { afterRunId: 'old', choice: null },
    });
    expect(state.exploration!.intention).toBeUndefined();
    expect(state.inventory).toEqual(before.inventory);
  });
});
