import { describe, expect, it, vi } from 'vitest';
import {
  seasonalEditionSnapshot,
  seasonalPhase,
  seasonalStateSnapshot,
  previewSeasonalPreparation,
  seasonalOpportunity,
  bindSeasonalRun,
} from '../../../src/arcana/domain/seasonal/events';
import {
  SeasonalEventUseCase,
  type SeasonalRequest,
} from '../../../src/arcana/application/seasonal-events';
import {
  gameSnapshot,
  type GameState,
  type GameTransactions,
} from '../../../src/arcana/application/game';
import { StartRunUseCase } from '../../../src/arcana/application/run-use-cases';
import { runInitial, campaignFixture } from './support/run-fixtures';
const edition = {
  eventId: 'enchanted-windows',
  editionId: 'halloween-2026',
  version: 1,
  timezone: 'Europe/Madrid',
  startsAt: 1000,
  participationEndsAt: 2000,
  completionEndsAt: 3000,
  objectiveIds: ['sweets', 'workshop', 'vault'],
  keepsakeId: 'lantern',
};
class Games implements GameTransactions {
  state: GameState = gameSnapshot(runInitial());
  fail = false;
  lost = false;
  async read() {
    return gameSnapshot(this.state);
  }
  async transact(_id: string, change: (s: GameState) => GameState) {
    const next = gameSnapshot(change(this.state));
    if (this.fail) throw Error('storage');
    this.state = next;
    if (this.lost) throw Error('lost');
    return next;
  }
}
async function setup() {
  const games = new Games(),
    clock = { now: vi.fn(async () => 1500) },
    config = vi.fn(() => edition),
    events = new SeasonalEventUseCase(games, config, clock);
  const perform = (action: SeasonalRequest['action'], key: string = action) =>
    events.execute('player', {
      key,
      expectedRevision: games.state.revision,
      request: {
        editionId: edition.editionId,
        version: 1,
        action,
        ...(action === 'join' ? {} : { runId: 'run' }),
      },
    });
  await new StartRunUseCase(games, campaignFixture).execute('player', {
    key: 'run',
    expectedRevision: 1,
    request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0', 'copy1', 'copy2'] },
  });
  const visit = (count: number) => {
    const exploration = games.state.exploration!;
    games.state = gameSnapshot({
      ...games.state,
      exploration: {
        ...exploration,
        run: {
          ...exploration.run!,
          visited: campaignFixture()
            .graph.nodes.slice(0, count)
            .map((n) => n.id),
        },
      },
    });
  };
  return { games, clock, config, events, perform, visit };
}
describe('A68 seasonal authority and frozen edition', () => {
  it('calendar has explicit admission and grace boundaries', () => {
    expect(seasonalPhase(edition, 999)).toBe('upcoming');
    expect(seasonalPhase(edition, 1000)).toBe('open');
    expect(seasonalPhase(edition, 2000)).toBe('grace');
    expect(seasonalPhase(edition, 3000)).toBe('closed');
    expect(() => seasonalEditionSnapshot({ ...edition, timezone: 'Wrong/Zone' })).toThrow();
    expect(() =>
      seasonalEditionSnapshot({ ...edition, objectiveIds: ['same', 'same', 'last'] }),
    ).toThrow();
  });
  it('rejects join outside admission and rejects client-selected binding or malformed versions', async () => {
    const { games, events, perform, clock } = await setup();
    clock.now.mockResolvedValue(999);
    await expect(perform('join')).rejects.toThrow('EVENT_UNAVAILABLE');
    clock.now.mockResolvedValue(2000);
    await expect(perform('join')).rejects.toThrow('EVENT_UNAVAILABLE');
    clock.now.mockResolvedValue(1500);
    await expect(
      events.execute('player', {
        key: 'forged-binding',
        expectedRevision: games.state.revision,
        request: { editionId: edition.editionId, version: 1, action: 'join', runId: 'run' },
      }),
    ).rejects.toThrow('INVALID_OPERATION');
    await expect(
      events.execute('player', {
        key: 'version',
        expectedRevision: games.state.revision,
        request: { editionId: edition.editionId, version: 2, action: 'join' },
      }),
    ).rejects.toThrow('STALE_TABLE');
    expect(games.state.seasonal).toBeUndefined();
  });
  it('cannot use the event before formation opportunities or charge a full-health team', async () => {
    const { games, perform, visit } = await setup();
    await perform('join');
    await expect(perform('dispel')).rejects.toThrow('EVENT_UNAVAILABLE');
    visit(2);
    const before = games.state;
    await expect(perform('prepare')).rejects.toThrow('EVENT_CONDITION');
    expect(games.state).toEqual(before);
  });
  it('completes three windows atomically, retains economy and grants one separate permanent keepsake', async () => {
    const { games, perform, visit } = await setup();
    const inventory = games.state.inventory,
      copies = games.state.copies;
    await perform('join');
    for (let i = 2; i <= 4; i++) {
      visit(i);
      await perform('dispel', `light${i}`);
    }
    expect(games.state.seasonal?.participations[0].completedObjectiveIds).toEqual(
      edition.objectiveIds,
    );
    expect(games.state.seasonal?.keepsakes).toHaveLength(1);
    expect(games.state.seasonal?.keepsakes[0]).toMatchObject({
      id: 'seasonal:halloween-2026:lantern',
      operationId: 'light4',
    });
    expect(games.state.inventory).toEqual(inventory);
    expect(games.state.copies).toEqual(copies);
    await expect(perform('dispel', 'extra')).rejects.toThrow();
    expect(games.state.seasonal?.keepsakes).toHaveLength(1);
  });
  it('does not grant by consulting, and cancel is absence of a command', async () => {
    const { games } = await setup();
    const before = games.state;
    await games.read();
    expect(games.state).toEqual(before);
    expect(games.state.seasonal).toBeUndefined();
  });
  it('recovers a committed response before consulting an unavailable clock or a changed definition', async () => {
    const { games, perform, visit, clock, config } = await setup();
    await perform('join');
    visit(2);
    games.lost = true;
    await expect(perform('dispel', 'lost')).rejects.toThrow('lost');
    games.lost = false;
    clock.now.mockRejectedValue(Error('clock down'));
    config.mockImplementation(() => {
      throw Error('changed');
    });
    const result = await perform('dispel', 'lost');
    expect(result.receipt.id).toBe('lost');
    expect(games.state.seasonal?.participations[0].completedObjectiveIds).toHaveLength(1);
  });
  it('blocks repeated opportunities even with a different key and after formation changes', async () => {
    const { games, perform, visit } = await setup();
    await perform('join');
    visit(2);
    await perform('dispel', 'one');
    await expect(perform('dispel', 'two')).rejects.toThrow('EVENT_OPPORTUNITY_USED');
    expect(games.state.seasonal?.participations[0].completedObjectiveIds).toHaveLength(1);
  });
  it('trade delays progress, preserves fallen units and never charges without benefit', async () => {
    const { games, perform, visit } = await setup();
    await perform('join');
    visit(2);
    const exploration = games.state.exploration!;
    games.state = gameSnapshot({
      ...games.state,
      exploration: {
        ...exploration,
        run: {
          ...exploration.run!,
          members: exploration.run!.members.map((m, i) => ({
            ...m,
            unit: { ...m.unit, hp: i === 0 ? 0 : 50 },
          })),
        },
      },
    });
    const before = games.state;
    const projection = previewSeasonalPreparation(games.state.exploration!.run!.members);
    expect(projection.eligible).toBe(true);
    await perform('prepare');
    expect(games.state.seasonal?.participations[0].completedObjectiveIds).toEqual([]);
    expect(games.state.exploration?.run?.members[0].unit.hp).toBe(0);
    expect(games.state.exploration?.run?.members[1].unit.hp).toBe(75);
    expect(games.state.exploration?.run?.members[1].unit.mana).toBe(18);
    expect(games.state.inventory).toEqual(before.inventory);
    await expect(perform('dispel', 'same-position')).rejects.toThrow('EVENT_OPPORTUNITY_USED');
    visit(3);
    await perform('dispel', 'later');
    expect(games.state.seasonal?.participations[0].completedObjectiveIds).toHaveLength(1);
  });
  it('admission and completion use frozen edition rules, grace permits only previously bound runs', async () => {
    const { games, perform, visit, clock, config } = await setup();
    await perform('join');
    visit(2);
    config.mockReturnValue({ ...edition, version: 2, objectiveIds: ['new1', 'new2', 'new3'] });
    clock.now.mockResolvedValue(2500);
    await perform('dispel');
    expect(games.state.seasonal?.participations[0].completedObjectiveIds).toEqual(['sweets']);
    clock.now.mockResolvedValue(3000);
    visit(3);
    await expect(perform('dispel', 'closed')).rejects.toThrow('EVENT_UNAVAILABLE');
    const old = games.state.seasonal!;
    expect(bindSeasonalRun(old, 'new-run', 2500)).toEqual(old);
    expect(
      seasonalOpportunity(
        old.participations[0],
        { ...games.state.exploration!.run!, id: 'new-run' },
        2500,
      ),
    ).toBe(false);
  });
  it('new runs bind only admitted participations and StartRun replay works with clock down', async () => {
    const { games, perform, clock } = await setup();
    await perform('join');
    const exploration = games.state.exploration!;
    games.state = gameSnapshot({ ...games.state, exploration: { ...exploration, run: null } });
    const start = new StartRunUseCase(games, campaignFixture, undefined, { clock });
    const command = {
      key: 'next-run',
      expectedRevision: games.state.revision,
      request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['copy0'] },
    };
    await start.execute('player', command);
    expect(games.state.seasonal?.participations[0].boundRunIds).toContain('next-run');
    clock.now.mockRejectedValue(Error('clock down'));
    await expect(start.execute('player', command)).resolves.toMatchObject({
      receipt: { id: 'next-run' },
    });
  });
  it('rollback leaves no seasonal progress, and incompatible reuse is rejected', async () => {
    const { games, perform, visit } = await setup();
    await perform('join');
    visit(2);
    const before = games.state;
    games.fail = true;
    await expect(perform('dispel', 'rollback')).rejects.toThrow('storage');
    expect(games.state).toEqual(before);
    games.fail = false;
    await perform('dispel', 'one');
    await expect(perform('prepare', 'one')).rejects.toThrow('OPERATION_CONFLICT');
  });
  it('validates persisted relationships and rejects forged completion without grant', async () => {
    const { games, perform, visit } = await setup();
    await perform('join');
    visit(2);
    await perform('dispel');
    const seasonal = games.state.seasonal!;
    expect(() =>
      seasonalStateSnapshot({
        ...seasonal,
        participations: [
          { ...seasonal.participations[0], completedObjectiveIds: edition.objectiveIds },
        ],
      }),
    ).toThrow();
    expect(() =>
      gameSnapshot({
        ...games.state,
        seasonal: { ...seasonal, keepsakes: [{ id: 'forged' } as never] },
      }),
    ).toThrow();
  });
});
