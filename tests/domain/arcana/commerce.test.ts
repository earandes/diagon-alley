import { describe, it, expect, vi } from 'vitest';
import {
  forgeWand,
  openVault,
  commerceSnapshot,
} from '../../../src/arcana/domain/economy/commerce';
import {
  ForgeWandUseCase,
  OpenObsidianVaultUseCase,
} from '../../../src/arcana/application/commerce-use-cases';
import { gameSnapshot, type GameState } from '../../../src/arcana/application/game';
import { runInitial } from './support/run-fixtures';
import { commerceFixture } from './support/commerce-fixtures';
const initial = (keys = 1) =>
  gameSnapshot({ ...runInitial(), inventory: { ...runInitial().inventory, goldKeys: keys } });
class Games {
  state = initial();
  queue: Promise<unknown> = Promise.resolve();
  fail = false;
  lost = false;
  async read() {
    return this.state;
  }
  transact(_id: string, change: (state: GameState) => GameState) {
    const work = this.queue.then(() => {
      const next = gameSnapshot(change(this.state));
      if (this.fail) throw Error('commit failed');
      this.state = next;
      if (this.lost) throw Error('response lost');
      return this.state;
    });
    this.queue = work.catch(() => {});
    return work;
  }
}
const forge = {
  key: 'forge',
  expectedRevision: 1,
  request: { recipeId: 'birch-dragon', catalogVersion: 1 },
};
const vault = { key: 'vault', expectedRevision: 1, request: { tableVersion: 1 } };
describe('ARCANA equipment commerce', () => {
  it('validates and freezes recipes, weighted loot and nested equipment', () => {
    const snapshot = commerceSnapshot(commerceFixture);
    expect(Object.isFrozen(snapshot.vault.entries[0].loot.equipment)).toBe(true);
    for (const value of [
      { ...commerceFixture, forge: { ...commerceFixture.forge, version: 0 } },
      {
        ...commerceFixture,
        vault: {
          ...commerceFixture.vault,
          entries: [{ ...commerceFixture.vault.entries[0], weight: 0 }],
        },
      },
      {
        ...commerceFixture,
        forge: {
          ...commerceFixture.forge,
          recipes: [{ ...commerceFixture.forge.recipes[0], multiplier: -1 }],
        },
      },
    ])
      expect(() => commerceSnapshot(value)).toThrow('INVALID_WORKSHOP');
  });
  it('forges a new owned instance, charging the versioned price without touching the original inventory', () => {
    const before = initial().inventory;
    const result = forgeWand(before, commerceFixture.forge, forge.request, forge.key);
    expect(result.inventory.crowns).toBe(35);
    expect(result.equipment).toMatchObject({
      id: 'forge:equipment:0',
      wood: 'birch',
      core: 'dragon',
      powerBonus: 2,
      multiplier: 1.2,
      version: 1,
    });
    expect(before.crowns).toBe(50);
    expect(before.equipment).toEqual([]);
  });
  it('rejects insufficient crowns, an obsolete recipe version and an unknown recipe without charging', () => {
    expect(() =>
      forgeWand(
        { ...initial().inventory, crowns: 14 },
        commerceFixture.forge,
        forge.request,
        'forge',
      ),
    ).toThrow('INSUFFICIENT_CROWNS');
    expect(() =>
      forgeWand(
        initial().inventory,
        commerceFixture.forge,
        { ...forge.request, catalogVersion: 2 },
        'forge',
      ),
    ).toThrow('STALE_WORKSHOP');
    expect(() =>
      forgeWand(
        initial().inventory,
        commerceFixture.forge,
        { ...forge.request, recipeId: 'missing' },
        'forge',
      ),
    ).toThrow('RECIPE_UNAVAILABLE');
  });
  it('consumes one key and delivers the exact weighted reward plus equipment', () => {
    const random = { ticket: vi.fn(() => 1) },
      before = initial().inventory;
    const result = openVault(before, commerceFixture.vault, vault.request, 'vault', random);
    expect(random.ticket).toHaveBeenCalledWith(2);
    expect(result.inventory.goldKeys).toBe(0);
    expect(result.inventory.crowns).toBe(125);
    expect(result.entryId).toBe('broom');
    expect(result.equipment[0]).toMatchObject({
      id: 'vault:equipment:0',
      kind: 'broom',
      initiative: 8,
    });
    expect(before.goldKeys).toBe(1);
  });
  it('rejects key zero or a stale table before any random draw', () => {
    const random = { ticket: vi.fn(() => 0) };
    expect(() =>
      openVault(initial(0).inventory, commerceFixture.vault, vault.request, 'vault', random),
    ).toThrow('INSUFFICIENT_KEYS');
    expect(() =>
      openVault(initial().inventory, commerceFixture.vault, { tableVersion: 2 }, 'vault', random),
    ).toThrow('STALE_WORKSHOP');
    expect(random.ticket).not.toHaveBeenCalled();
  });
  it('rejects a random ticket outside the validated table', () => {
    expect(() =>
      openVault(initial().inventory, commerceFixture.vault, vault.request, 'vault', {
        ticket: () => 2,
      }),
    ).toThrow('INVALID_RANDOM_TICKET');
  });
  it('commits forge receipt and gear together, then replays without configuration or a second charge', async () => {
    const games = new Games(),
      config = vi.fn(() => commerceFixture),
      useCase = new ForgeWandUseCase(games, config);
    const first = await useCase.execute('player', forge);
    expect(first.receipt.kind).toBe('forge-wand');
    expect(games.state.inventory.crowns).toBe(35);
    config.mockImplementation(() => {
      throw Error('config offline');
    });
    const replay = await useCase.execute('player', { ...forge, expectedRevision: 999 });
    expect(replay.receipt).toEqual(first.receipt);
    expect(games.state.inventory.equipment).toHaveLength(1);
    expect(config).toHaveBeenCalledTimes(1);
    await expect(
      useCase.execute('player', { ...forge, request: { ...forge.request, recipeId: 'other' } }),
    ).rejects.toThrow('OPERATION_CONFLICT');
  });
  it('replays a committed vault after a lost response without another draw or key', async () => {
    const games = new Games(),
      random = { ticket: vi.fn(() => 0) },
      config = vi.fn(() => commerceFixture),
      useCase = new OpenObsidianVaultUseCase(games, config, random);
    games.lost = true;
    await expect(useCase.execute('player', vault)).rejects.toThrow('response lost');
    games.lost = false;
    config.mockImplementation(() => {
      throw Error('config offline');
    });
    const result = await useCase.execute('player', vault);
    expect(result.receipt.kind).toBe('open-vault');
    expect(random.ticket).toHaveBeenCalledTimes(1);
    expect(games.state.inventory.goldKeys).toBe(0);
    expect(games.state.inventory.products).toHaveLength(2);
  });
  it('rolls back a forge or vault when commit fails', async () => {
    for (const kind of ['forge', 'vault']) {
      const games = new Games();
      games.fail = true;
      const before = games.state;
      const useCase =
        kind === 'forge'
          ? new ForgeWandUseCase(games, () => commerceFixture)
          : new OpenObsidianVaultUseCase(games, () => commerceFixture, { ticket: () => 0 });
      await expect(
        kind === 'forge'
          ? (useCase as ForgeWandUseCase).execute('player', forge)
          : (useCase as OpenObsidianVaultUseCase).execute('player', vault),
      ).rejects.toThrow('commit failed');
      expect(games.state).toEqual(before);
    }
  });
  it('allows only one of two distinct concurrent commands to spend the single key', async () => {
    const games = new Games(),
      random = { ticket: vi.fn(() => 0) },
      useCase = new OpenObsidianVaultUseCase(games, () => commerceFixture, random);
    const results = await Promise.allSettled([
      useCase.execute('player', vault),
      useCase.execute('player', { ...vault, key: 'other' }),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(random.ticket).toHaveBeenCalledTimes(1);
    expect(games.state.inventory.equipment).toHaveLength(1);
  });
  it('rejects receipts whose immutable gear or delivered products no longer match owned state', async () => {
    const games = new Games();
    await new OpenObsidianVaultUseCase(games, () => commerceFixture, { ticket: () => 0 }).execute(
      'player',
      vault,
    );
    expect(() =>
      gameSnapshot({ ...games.state, inventory: { ...games.state.inventory, equipment: [] } }),
    ).toThrow('INVALID_GAME');
    expect(() =>
      gameSnapshot({ ...games.state, inventory: { ...games.state.inventory, products: [] } }),
    ).toThrow('INVALID_GAME');
    expect(() =>
      gameSnapshot({
        ...games.state,
        inventory: {
          ...games.state.inventory,
          equipment: games.state.inventory.equipment!.map((e) =>
            e.kind === 'wand' ? { ...e, multiplier: 2 } : e,
          ),
        },
      }),
    ).toThrow('INVALID_GAME');
  });
});
