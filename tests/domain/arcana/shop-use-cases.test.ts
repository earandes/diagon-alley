import { describe, expect, it, vi } from 'vitest';
import {
  PurchaseProductUseCase,
  OpenCocoaToadUseCase,
  type OpeningConfiguration,
} from '../../../src/arcana/application/shop-use-cases';
import {
  gameSnapshot,
  validateGame,
  type GameState,
  type GameTransactions,
} from '../../../src/arcana/application/game';
import { createInventory } from '../../../src/arcana/domain/economy/inventory';
import { catalogFixture, toadFixture, shopFixture } from './support/fixtures';
const shopUseCases = (
  games: GameTransactions,
  config: () => OpeningConfiguration,
  random: { ticket(max: number): number },
) => ({
  purchase: new PurchaseProductUseCase(games, config).execute,
  openToad: new OpenCocoaToadUseCase(games, config, random).execute,
});
const initial = (): GameState => ({
  schemaVersion: 1,
  playerId: 'player',
  revision: 1,
  inventory: createInventory(0),
  copies: [],
  receipts: [],
});
class MemoryGames implements GameTransactions {
  state = gameSnapshot(initial());
  queue: Promise<unknown> = Promise.resolve();
  failBeforeCommit = false;
  loseAfterCommit = false;
  async read() {
    return gameSnapshot(this.state);
  }
  transact(playerId: string, change: (state: GameState) => GameState): Promise<GameState> {
    const next = this.queue.then(() => {
      expect(playerId).toBe(this.state.playerId);
      const candidate = change(gameSnapshot(this.state));
      validateGame(candidate);
      if (this.failBeforeCommit) throw Error('commit failed');
      this.state = gameSnapshot(candidate);
      if (this.loseAfterCommit) throw Error('response lost');
      return this.read();
    });
    this.queue = next.catch(() => {});
    return next;
  }
}
const configuration = (): OpeningConfiguration => ({
  catalog: catalogFixture,
  table: toadFixture,
  shop: shopFixture,
});
const buy = {
  key: 'buy',
  expectedRevision: 1,
  request: { product: 'cacao-toad' as const, quantity: 1, priceVersion: 1 },
};
const open = {
  key: 'open',
  expectedRevision: 2,
  request: { unitId: 'buy:0', catalogVersion: 1, tableVersion: 1 },
};
describe('ARCANA AP/CO purchase→opening transactional use cases', () => {
  it('persists acquired stars and replays them after another catalogue version changes the same identity', async () => {
    const games = new MemoryGames();
    let config: OpeningConfiguration = {
      ...configuration(),
      catalog: {
        ...catalogFixture,
        wizards: catalogFixture.wizards.map((wizard) => ({ ...wizard, stars: 2 as const })),
      },
    };
    const random = { ticket: vi.fn(() => 0) };
    const useCases = shopUseCases(games, () => config, random);
    await useCases.purchase('player', buy);
    const first = await useCases.openToad('player', open);
    if (first.receipt.kind !== 'open-toad') throw Error('Missing opening receipt');
    expect(first.receipt.wizard.stars).toBe(2);
    expect(first.state.copies[0].wizard.stars).toBe(2);
    config = {
      ...config,
      catalog: {
        version: 2,
        wizards: config.catalog.wizards.map((wizard) => ({ ...wizard, stars: 5 as const })),
      },
      table: { ...config.table, version: 2, catalogVersion: 2 },
    };
    const replay = await useCases.openToad('player', open);
    expect(replay.receipt).toEqual(first.receipt);
    expect(random.ticket).toHaveBeenCalledTimes(1);
    const purchased = await useCases.purchase('player', {
      ...buy,
      key: 'next-buy',
      expectedRevision: games.state.revision,
    });
    const acquired = await useCases.openToad('player', {
      key: 'next-open',
      expectedRevision: purchased.state.revision,
      request: { unitId: 'next-buy:0', catalogVersion: 2, tableVersion: 2 },
    });
    expect(acquired.state.copies.map((copy) => copy.wizard.stars)).toEqual([2, 5]);
  });
  it('rejects a stored mismatch between copy and receipt stars', async () => {
    const games = new MemoryGames(),
      useCases = shopUseCases(games, configuration, { ticket: () => 0 });
    await useCases.purchase('player', buy);
    await useCases.openToad('player', open);
    const state = structuredClone(games.state);
    const receipt = state.receipts.find((receipt) => receipt.kind === 'open-toad');
    if (receipt?.kind !== 'open-toad') throw Error('Missing receipt');
    const valid = {
      ...state,
      copies: state.copies.map((copy) => ({
        ...copy,
        wizard: { ...copy.wizard, stars: 2 as const },
      })),
      receipts: state.receipts.map((r) =>
        r.kind === 'open-toad' ? { ...r, wizard: { ...r.wizard, stars: 2 as const } } : r,
      ),
    };
    expect(() => validateGame(valid)).not.toThrow();
    const corrupt = {
      ...valid,
      copies: valid.copies.map((copy) => ({
        ...copy,
        wizard: { ...copy.wizard, stars: 5 as const },
      })),
    };
    expect(() => validateGame(corrupt)).toThrow('INVALID_GAME');
  });
  it('commits cost, unit, copy and receipt and returns an original result on replay', async () => {
    const games = new MemoryGames(),
      random = { ticket: vi.fn(() => 0) };
    const useCases = shopUseCases(games, configuration, random);
    const bought = await useCases.purchase('player', buy);
    expect(bought.state.inventory.crowns).toBe(40);
    const opened = await useCases.openToad('player', open);
    expect(opened.receipt).toMatchObject({
      kind: 'open-toad',
      isNew: true,
      wizard: { id: 'merlin' },
    });
    expect(opened.state.inventory.products[0].status).toBe('consumed');
    expect(opened.state.copies).toHaveLength(1);
    expect((await useCases.openToad('player', open)).receipt).toEqual(opened.receipt);
    expect((await useCases.purchase('player', buy)).receipt).toEqual(bought.receipt);
    expect(random.ticket).toHaveBeenCalledTimes(1);
    expect(games.state.receipts).toHaveLength(2);
    expect(games.state.revision).toBe(3);
  });
  it('returns the current state with the historical receipt after other purchases', async () => {
    const games = new MemoryGames(),
      useCases = shopUseCases(games, configuration, { ticket: () => 0 });
    const first = await useCases.purchase('player', buy);
    await useCases.purchase('player', { ...buy, key: 'buy-again', expectedRevision: 2 });
    const replay = await useCases.purchase('player', buy);
    expect(replay.receipt).toEqual(first.receipt);
    expect(replay.state.inventory.crowns).toBe(30);
  });
  it('rejects another request with the same key and another key for a consumed unit without drawing', async () => {
    const games = new MemoryGames(),
      random = { ticket: vi.fn(() => 0) };
    const useCases = shopUseCases(games, configuration, random);
    await useCases.purchase('player', buy);
    await useCases.openToad('player', open);
    await expect(
      useCases.openToad('player', { ...open, request: { ...open.request, unitId: 'other' } }),
    ).rejects.toThrow('OPERATION_CONFLICT');
    await expect(
      useCases.openToad('player', { ...open, key: 'other', expectedRevision: 3 }),
    ).rejects.toThrow('UNIT_UNAVAILABLE');
    await expect(
      useCases.purchase('player', { ...buy, request: { ...buy.request, quantity: 2 } }),
    ).rejects.toThrow('OPERATION_CONFLICT');
    await expect(useCases.purchase('player', { ...buy, key: 'open' })).rejects.toThrow(
      'OPERATION_CONFLICT',
    );
    expect(random.ticket).toHaveBeenCalledTimes(1);
  });
  it('rejects stale state, prices, tables and unknown player before requesting random', async () => {
    const games = new MemoryGames(),
      random = { ticket: vi.fn(() => 0) };
    const useCases = shopUseCases(games, configuration, random);
    await expect(useCases.purchase('player', { ...buy, expectedRevision: 0 })).rejects.toThrow(
      'STALE_GAME',
    );
    await expect(
      useCases.purchase('player', { ...buy, request: { ...buy.request, priceVersion: 2 } }),
    ).rejects.toThrow('STALE_PRICE');
    await useCases.purchase('player', buy);
    await expect(
      useCases.openToad('player', { ...open, request: { ...open.request, tableVersion: 2 } }),
    ).rejects.toThrow('STALE_TABLE');
    const wrong = { ...games.state, playerId: 'other' };
    games.state = wrong;
    await expect(
      shopUseCases(
        { read: () => Promise.resolve(wrong), transact: async (_, change) => change(wrong) },
        configuration,
        random,
      ).openToad('player', open),
    ).rejects.toThrow('PLAYER_MISMATCH');
    expect(random.ticket).not.toHaveBeenCalled();
  });
  it('replays a confirmed opening after the current configuration changes or becomes invalid', async () => {
    const games = new MemoryGames();
    let config = configuration();
    const random = { ticket: vi.fn(() => 0) };
    const useCases = shopUseCases(games, () => config, random);
    await useCases.purchase('player', buy);
    const opened = await useCases.openToad('player', open);
    config = {
      ...config,
      catalog: { ...config.catalog, version: 2 },
      table: { ...config.table, version: 2, catalogVersion: 2 },
    };
    expect((await useCases.openToad('player', open)).receipt).toEqual(opened.receipt);
    config = { ...config, table: { ...config.table, entries: [] } };
    expect((await useCases.openToad('player', open)).receipt).toEqual(opened.receipt);
    expect(random.ticket).toHaveBeenCalledTimes(1);
  });
  it('reports a duplicate as another copy, not another discovery', async () => {
    const games = new MemoryGames(),
      useCases = shopUseCases(games, configuration, { ticket: () => 0 });
    await useCases.purchase('player', { ...buy, request: { ...buy.request, quantity: 2 } });
    await useCases.openToad('player', open);
    const repeated = await useCases.openToad('player', {
      key: 'open-2',
      expectedRevision: 3,
      request: { ...open.request, unitId: 'buy:1' },
    });
    expect(repeated.receipt).toMatchObject({ isNew: false });
    expect(repeated.state.copies).toHaveLength(2);
  });
  it('rolls back a failed commit and recovers a lost response with the same key', async () => {
    const games = new MemoryGames(),
      useCases = shopUseCases(games, configuration, { ticket: () => 0 });
    await useCases.purchase('player', buy);
    const before = games.state;
    games.failBeforeCommit = true;
    await expect(useCases.openToad('player', open)).rejects.toThrow('commit failed');
    expect(games.state).toEqual(before);
    games.failBeforeCommit = false;
    games.loseAfterCommit = true;
    await expect(useCases.openToad('player', open)).rejects.toThrow('response lost');
    games.loseAfterCommit = false;
    const recovered = await useCases.openToad('player', open);
    expect(recovered.state.copies).toHaveLength(1);
    expect(recovered.state.revision).toBe(3);
  });
  it('serializes competing keys and concurrent purchases using the expected revision', async () => {
    const games = new MemoryGames(),
      random = { ticket: vi.fn(() => 0) },
      useCases = shopUseCases(games, configuration, random);
    const purchases = await Promise.allSettled([
      useCases.purchase('player', buy),
      useCases.purchase('player', { ...buy, key: 'other-buy' }),
    ]);
    expect(purchases.filter((p) => p.status === 'fulfilled')).toHaveLength(1);
    expect(games.state.inventory.crowns).toBe(40);
    const openings = await Promise.allSettled([
      useCases.openToad('player', open),
      useCases.openToad('player', { ...open, key: 'other-open' }),
    ]);
    expect(openings.filter((p) => p.status === 'fulfilled')).toHaveLength(1);
    expect(games.state.copies).toHaveLength(1);
    expect(random.ticket).toHaveBeenCalledTimes(1);
  });
  it('does not expose shared mutable state in snapshots or receipts', async () => {
    const games = new MemoryGames(),
      useCases = shopUseCases(games, configuration, { ticket: () => 0 });
    const result = await useCases.purchase('player', buy);
    const receipt = result.state.receipts[0];
    if (receipt.kind !== 'purchase') throw Error('expected purchase receipt');
    expect(Object.isFrozen(receipt.request)).toBe(true);
    expect(Object.isFrozen(result.state.inventory.products)).toBe(true);
  });
  it('validates stored copy/unit/receipt cross-references rather than trusting arbitrary JSON', async () => {
    const games = new MemoryGames(),
      useCases = shopUseCases(games, configuration, { ticket: () => 0 });
    await useCases.purchase('player', buy);
    await useCases.openToad('player', open);
    for (const edit of [
      (state: GameState) => ({ ...state, revision: NaN }),
      (state: GameState) => ({ ...state, copies: [] }),
      (state: GameState) => ({ ...state, inventory: { ...state.inventory, products: [] } }),
      (state: GameState) => ({ ...state, receipts: [...state.receipts, state.receipts[0]] }),
      (state: GameState) => ({
        ...state,
        receipts: state.receipts.filter((r) => r.kind !== 'open-toad'),
      }),
    ])
      expect(() => validateGame(edit(structuredClone(games.state)))).toThrow('INVALID_GAME');
  });
});
