import { describe, expect, it } from 'vitest';
import { SetIntentionUseCase } from '../../../src/arcana/application/set-intention';
import type { GameState, GameTransactions } from '../../../src/arcana/application/game';
import { gameSnapshot } from '../../../src/arcana/application/game';
import { runInitial, campaignFixture } from './support/run-fixtures';
import { bindIntention } from '../../../src/arcana/domain/exploration/intentions';

function fixture() {
  const base = runInitial();
  const campaign = campaignFixture();
  let state: GameState = gameSnapshot({
    ...base,
    inventory: { ...base.inventory, crowns: 50 },
    exploration: {
      run: {
        id: 'closed-run',
        campaignVersion: 1,
        zoneId: 'bulevar',
        graphVersion: 1,
        graph: campaign.graph,
        status: 'won',
        visited: campaign.graph.nodes.map((n) => n.id),
        members: base.copies.map((copy) => ({
          source: 'owned',
          unit: campaign.prepareOwned(copy),
        })),
      },
      victories: [],
      unlockedZones: ['bulevar'],
    },
  });
  const games: GameTransactions = {
    read: async () => state,
    transact: async (_, change) => {
      state = change(state);
      return state;
    },
  };
  const useCase = new SetIntentionUseCase(games, () => ({ ownedAffinities: {}, beanPrice: 5 }));
  return { games, useCase, state: () => state };
}
const selection = {
  key: 'choose',
  expectedRevision: 1,
  request: { afterRunId: 'closed-run', choice: { kind: 'bean' as const } },
};

describe('SetIntention explicit authority boundary', () => {
  it('stores a viable plan without buying, consuming, selecting formation or advancing', async () => {
    const f = fixture(),
      before = f.state();
    const result = await f.useCase.execute('player', selection);
    expect(result.state.revision).toBe(2);
    expect(result.state.exploration?.intention).toEqual({
      version: 1,
      afterRunId: 'closed-run',
      runId: null,
      choice: { kind: 'bean' },
    });
    expect(result.state.inventory).toEqual(before.inventory);
    expect(result.state.copies).toEqual(before.copies);
    expect(result.state.team).toEqual(before.team);
    expect(result.state.exploration?.run).toEqual(before.exploration?.run);
    expect(result.state.exploration?.victories).toEqual(before.exploration?.victories);
  });
  it('recovers the same operation before checking a stale revision and rejects key reuse', async () => {
    const f = fixture();
    const first = await f.useCase.execute('player', selection);
    expect(await f.useCase.execute('player', selection)).toEqual(first);
    await expect(
      f.useCase.execute('player', {
        ...selection,
        request: { ...selection.request, choice: null },
      }),
    ).rejects.toMatchObject({ code: 'OPERATION_CONFLICT' });
    expect(f.state().revision).toBe(2);
  });
  it('cancels without a reward or resource effect, including during the explicitly bound run', async () => {
    const f = fixture();
    await f.useCase.execute('player', selection);
    const old = f.state();
    await f.games.transact('player', (current) => ({
      ...current,
      exploration: {
        ...current.exploration!,
        run: { ...current.exploration!.run!, id: 'next-run', status: 'active', visited: [] },
        intention: bindIntention(current.exploration!.intention, 'closed-run', 'next-run'),
      },
    }));
    const result = await f.useCase.execute('player', {
      key: 'cancel',
      expectedRevision: 2,
      request: { afterRunId: 'closed-run', choice: null },
    });
    expect(result.state.exploration?.intention ?? null).toBeNull();
    expect(result.state.inventory).toEqual(old.inventory);
    expect(result.state.exploration?.run?.visited).toEqual([]);
  });
  it('rejects stale tabs, mismatched runs and targets that are not actually available', async () => {
    const f = fixture();
    await expect(
      f.useCase.execute('player', { ...selection, expectedRevision: 2 }),
    ).rejects.toMatchObject({ code: 'STALE_GAME' });
    await expect(
      f.useCase.execute('player', {
        ...selection,
        request: { ...selection.request, afterRunId: 'other-run' },
      }),
    ).rejects.toMatchObject({ code: 'INVALID_OPERATION' });
    await expect(
      f.useCase.execute('player', {
        ...selection,
        request: {
          afterRunId: 'closed-run',
          choice: { kind: 'new-companion', wizardId: 'absent' },
        },
      }),
    ).rejects.toMatchObject({ code: 'INVALID_OPERATION' });
    expect(f.state().revision).toBe(1);
  });
  it('retains prior state when durable commit fails', async () => {
    const f = fixture(),
      before = f.state();
    const failing: GameTransactions = {
      read: f.games.read,
      transact: async (_, change) => {
        change(before);
        throw Error('save failed');
      },
    };
    const useCase = new SetIntentionUseCase(failing, () => ({ ownedAffinities: {}, beanPrice: 5 }));
    await expect(useCase.execute('player', selection)).rejects.toThrow('save failed');
    expect(f.state()).toEqual(before);
  });
});
