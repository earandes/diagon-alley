import { describe, expect, it, vi } from 'vitest';
import {
  InitializePlayerUseCase,
  SetTeamUseCase,
  EquipEquipmentUseCase,
} from '../../../src/arcana/application/team-use-cases';
import {
  StartRunUseCase,
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
} from '../../../src/arcana/application/run-use-cases';
import {
  gameSnapshot,
  type GameState,
  type PlayerAccounts,
} from '../../../src/arcana/application/game';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { ArcanaError } from '../../../src/arcana/domain/errors';
import { catalogFixture } from './support/fixtures';
import { campaignFixture } from './support/run-fixtures';
const apprentice = {
  ...catalogFixture.wizards[0],
  id: 'apprentice-alchemy',
  name: { es: 'Aprendiz de Alquimia', en: 'Alchemy Apprentice' },
};
const kit = () => ({ catalog: { version: 1, wizards: [apprentice] }, apprenticeId: apprentice.id });
class Accounts implements PlayerAccounts {
  state: GameState | null = null;
  fail = false;
  lost = false;
  queue: Promise<unknown> = Promise.resolve();
  async read(id: string) {
    if (!this.state || this.state.playerId !== id) throw new ArcanaError('PLAYER_NOT_FOUND');
    return gameSnapshot(this.state);
  }
  async create(initial: GameState) {
    if (!this.state) {
      if (this.fail) throw new ArcanaError('STORAGE');
      this.state = gameSnapshot(initial);
      if (this.lost) throw new ArcanaError('UNKNOWN_COMMIT');
    }
    return this.read(initial.playerId);
  }
  transact(id: string, change: (current: GameState) => GameState): Promise<GameState> {
    const operation = this.queue.then(async () => {
      const next = gameSnapshot(change(await this.read(id)));
      if (this.fail) throw new ArcanaError('STORAGE');
      this.state = next;
      if (this.lost) throw new ArcanaError('UNKNOWN_COMMIT');
      return next;
    });
    this.queue = operation.catch(() => {});
    return operation;
  }
}
const setup = async () => {
  const accounts = new Accounts(),
    clock = { now: vi.fn(async () => 0) },
    configuration = vi.fn(kit);
  const initialize = new InitializePlayerUseCase(accounts, configuration, clock);
  await initialize.execute('player');
  const campaign = vi.fn(campaignFixture);
  const team = new SetTeamUseCase(accounts, campaign),
    equip = new EquipEquipmentUseCase(accounts),
    start = new StartRunUseCase(accounts, campaign);
  const seeds = { next: vi.fn(() => 42) },
    random = { fromSeed: (seed: number) => new SeededRandom(seed) };
  const advance = new AdvanceNodeUseCase(
    accounts,
    campaign,
    new ResolveCombatUseCase(new CombatEngine(random), seeds),
    clock,
    random,
    seeds,
  );
  const state = () => accounts.state!;
  const select = (copyIds: string[], key = 'team') =>
    team.execute('player', { key, expectedRevision: state().revision, request: { copyIds } });
  const equipment = (
    copyId: string,
    slot: 'wand' | 'broom',
    equipmentId: string | null,
    key = 'equip',
  ) =>
    equip.execute('player', {
      key,
      expectedRevision: state().revision,
      request: { copyId, slot, equipmentId },
    });
  return {
    accounts,
    clock,
    configuration,
    initialize,
    team,
    equip,
    start,
    advance,
    seeds,
    state,
    select,
    equipment,
    campaign,
  };
};
const addCopies = (accounts: Accounts) => {
  const state = accounts.state!;
  accounts.state = gameSnapshot({
    ...state,
    copies: [
      ...state.copies,
      ...[1, 2, 3].map((i) => ({
        ...state.copies[0],
        copyId: `copy${i}`,
        sourceId: 'test-additional-fixture',
      })),
    ],
  });
};
describe('ARCANA authority starter kit and owned team', () => {
  it('creates exactly one apprentice, a birch wand, cadet broom and fifty crowns once', async () => {
    const { state, initialize, configuration, clock } = await setup();
    const initial = state();
    expect(initial.copies).toHaveLength(1);
    expect(initial.copies[0]).toMatchObject({
      copyId: 'starter:apprentice',
      origin: 'starter',
      wizard: { id: 'apprentice-alchemy' },
    });
    expect(initial.inventory).toMatchObject({
      crowns: 50,
      essence: { points: 50 },
      products: [],
      equipment: [
        {
          id: 'starter:wand',
          kind: 'wand',
          wood: 'birch',
          core: null,
          powerBonus: 2,
          multiplier: 1,
        },
        { id: 'starter:broom', kind: 'broom', model: 'cadet-zephyr', initiative: 3 },
      ],
    });
    expect(initial.team).toMatchObject({
      copyIds: ['starter:apprentice'],
      loadouts: [
        { copyId: 'starter:apprentice', wandId: 'starter:wand', broomId: 'starter:broom' },
      ],
    });
    configuration.mockImplementation(() => {
      throw Error('config offline');
    });
    clock.now.mockRejectedValue(Error('clock offline'));
    expect(await initialize.execute('player')).toEqual(initial);
    expect(clock.now).toHaveBeenCalledTimes(1);
  });
  it('rejects missing apprentice and invalid stats without persisting a partial kit', async () => {
    const accounts = new Accounts();
    await expect(
      new InitializePlayerUseCase(accounts, () => ({ ...kit(), apprenticeId: 'missing' }), {
        now: async () => 0,
      }).execute('player'),
    ).rejects.toThrow('INVALID_KIT');
    expect(accounts.state).toBe(null);
    await expect(
      new InitializePlayerUseCase(
        accounts,
        () => ({
          ...kit(),
          catalog: {
            version: 1,
            wizards: [{ ...apprentice, stats: { ...apprentice.stats, maxHp: NaN } }],
          },
        }),
        { now: async () => 0 },
      ).execute('player'),
    ).rejects.toThrow();
    expect(accounts.state).toBe(null);
  });
  it('selects only owned distinct copies up to five and recovers its receipt', async () => {
    const { accounts, select, team, state } = await setup();
    addCopies(accounts);
    const selected = await select(['copy1', 'starter:apprentice']);
    expect(selected.state.team?.copyIds).toEqual(['copy1', 'starter:apprentice']);
    expect(
      (
        await team.execute('player', {
          key: 'team',
          expectedRevision: 1,
          request: { copyIds: ['copy1', 'starter:apprentice'] },
        })
      ).receipt,
    ).toEqual(selected.receipt);
    await expect(select(['foreign'], 'foreign')).rejects.toThrow('INVALID_FORMATION');
    await expect(select(['copy1', 'copy1'], 'duplicate')).rejects.toThrow('INVALID_FORMATION');
    expect(state().inventory.crowns).toBe(50);
  });
  it('moves a single owned wand between copies, supports unequip and rejects a foreign or wrong-slot piece', async () => {
    const { accounts, equipment, state } = await setup();
    addCopies(accounts);
    await equipment('copy1', 'wand', 'starter:wand');
    expect(state().team?.loadouts.find((l) => l.copyId === 'copy1')?.wandId).toBe('starter:wand');
    expect(state().team?.loadouts.find((l) => l.copyId === 'starter:apprentice')?.wandId).toBe(
      null,
    );
    await equipment('copy1', 'wand', null, 'unequip');
    expect(state().team?.loadouts.find((l) => l.copyId === 'copy1')?.wandId).toBe(null);
    await expect(equipment('copy1', 'wand', 'starter:broom', 'wrong-slot')).rejects.toThrow(
      'EQUIPMENT_UNAVAILABLE',
    );
    await expect(equipment('copy1', 'wand', 'foreign', 'foreign-piece')).rejects.toThrow(
      'EQUIPMENT_UNAVAILABLE',
    );
    expect(state().inventory.equipment).toHaveLength(2);
  });
  it('allows the single starter to explore but rejects a three-unit duel before seed or essence', async () => {
    const { start, advance, state, seeds } = await setup();
    await start.execute('player', {
      key: 'start',
      expectedRevision: 1,
      request: { zoneId: 'bulevar', campaignVersion: 1, copyIds: ['starter:apprentice'] },
    });
    expect(state().exploration?.run?.members[0].unit).toMatchObject({
      level: 1,
      wandPowerBonus: 2,
      broomInitiative: 3,
      wandMultiplier: 1,
    });
    const before = state();
    await expect(
      advance.execute('player', {
        key: 'duel',
        expectedRevision: 2,
        request: { runId: 'start', nodeId: 'duel', campaignVersion: 1, assignments: [] },
      }),
    ).rejects.toThrow('INVALID_FORMATION');
    expect(state()).toEqual(before);
    expect(seeds.next).not.toHaveBeenCalled();
  });
  it('retains injured HP and spent PM when withdrawing and reselecting a copy during the same run', async () => {
    const { accounts, start, advance, state, select, campaign } = await setup();
    addCopies(accounts);
    const configured = campaignFixture();
    campaign.mockReturnValue({
      ...configured,
      nodes: configured.nodes.map((node) =>
        node.kind === 'duel'
          ? {
              ...node,
              opponents: node.opponents.map((unit) => ({
                ...unit,
                hp: 60,
                maxHp: 60,
                power: 5,
                speed: 9,
              })),
            }
          : node,
      ),
    });
    await start.execute('player', {
      key: 'start',
      expectedRevision: 1,
      request: {
        zoneId: 'bulevar',
        campaignVersion: 1,
        copyIds: ['starter:apprentice', 'copy1', 'copy2'],
      },
    });
    await advance.execute('player', {
      key: 'duel',
      expectedRevision: 2,
      request: { runId: 'start', nodeId: 'duel', campaignVersion: 1, assignments: [] },
    });
    const mana = state().exploration!.run!.members[0].unit.mana;
    const hp = state().exploration!.run!.members[0].unit.hp;
    expect(hp).toBeLessThan(state().copies[0].wizard.stats.maxHp);
    await select(['copy1', 'copy2', 'copy3'], 'bench');
    expect(
      state().exploration?.run?.reserves?.find((m) => m.unit.id === 'starter:apprentice')?.unit
        .mana,
    ).toBe(mana);
    await select(['starter:apprentice', 'copy1', 'copy2'], 'return');
    expect(state().exploration?.run?.members[0].unit.mana).toBe(mana);
    expect(state().exploration?.run?.members[0].unit.hp).toBe(hp);
    expect(state().exploration?.run?.visited).toEqual(['duel']);
    expect(state().inventory.essence.points).toBe(45);
  });
  it('updates owned equipment during a run without resetting HP/PM or changing old battle input', async () => {
    const { accounts, start, advance, state, equipment } = await setup();
    addCopies(accounts);
    await start.execute('player', {
      key: 'start',
      expectedRevision: 1,
      request: {
        zoneId: 'bulevar',
        campaignVersion: 1,
        copyIds: ['starter:apprentice', 'copy1', 'copy2'],
      },
    });
    const battle = await advance.execute('player', {
      key: 'duel',
      expectedRevision: 2,
      request: { runId: 'start', nodeId: 'duel', campaignVersion: 1, assignments: [] },
    });
    const before = state().exploration!.run!.members[0].unit;
    await equipment('copy1', 'wand', 'starter:wand');
    expect(state().exploration?.run?.members[0].unit).toMatchObject({
      hp: before.hp,
      mana: before.mana,
      wandPowerBonus: 0,
    });
    expect(state().exploration?.run?.members[1].unit.wandPowerBonus).toBe(2);
    expect(state().receipts.find((r) => r.id === 'duel')).toEqual(battle.receipt);
  });
  it('keeps temporary recruits in the run and counts them toward the five-unit cap', async () => {
    const { accounts, start, advance, select, state } = await setup();
    addCopies(accounts);
    await start.execute('player', {
      key: 'start',
      expectedRevision: 1,
      request: {
        zoneId: 'bulevar',
        campaignVersion: 1,
        copyIds: ['starter:apprentice', 'copy1', 'copy2'],
      },
    });
    for (const nodeId of ['duel', 'refuge', 'chest', 'pact'])
      await advance.execute('player', {
        key: nodeId,
        expectedRevision: state().revision,
        request: { runId: 'start', nodeId, campaignVersion: 1, assignments: [] },
      });
    await select(['copy1', 'copy2', 'copy3'], 'after-pact');
    expect(state().exploration?.run?.members).toHaveLength(4);
    expect(state().exploration?.run?.members.at(-1)?.source).toBe('temporary');
    expect(state().copies).toHaveLength(4);
  });
  it('rolls back equipment/formation failures and recovers uncertain commit without duplication', async () => {
    const { accounts, select, team, state } = await setup();
    addCopies(accounts);
    const before = state();
    accounts.fail = true;
    await expect(select(['copy1'])).rejects.toThrow('STORAGE');
    expect(state()).toEqual(before);
    accounts.fail = false;
    accounts.lost = true;
    await expect(select(['copy1'])).rejects.toThrow('UNKNOWN_COMMIT');
    accounts.lost = false;
    await team.execute('player', {
      key: 'team',
      expectedRevision: 1,
      request: { copyIds: ['copy1'] },
    });
    expect(state().team?.copyIds).toEqual(['copy1']);
    expect(state().receipts).toHaveLength(2);
  });
});

describe('ARCANA starter grant uniqueness', () => {
  it('rejects a stored second copy that claims the same starter grant', async () => {
    const { state } = await setup(),
      original = state();
    expect(() =>
      gameSnapshot({
        ...original,
        copies: [...original.copies, { ...original.copies[0], copyId: 'duplicate-starter' }],
      }),
    ).toThrow('INVALID_GAME');
  });
});

describe('ARCANA starter source integrity', () => {
  it('does not accept a kit copy without its grant receipt', async () => {
    const { state } = await setup();
    const current = state();
    expect(() => gameSnapshot({ ...current, receipts: [] })).toThrow('INVALID_GAME');
  });
});
