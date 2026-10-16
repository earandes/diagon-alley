import { describe, expect, it, vi } from 'vitest';
import {
  BuyAndOpenCocoaToadUseCase,
  OpenCocoaToadUseCase,
  PurchaseProductUseCase,
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
class Games implements GameTransactions {
  state = gameSnapshot({
    schemaVersion: 1,
    playerId: 'buyer',
    revision: 1,
    inventory: createInventory(0),
    copies: [],
    receipts: [],
  });
  queue: Promise<unknown> = Promise.resolve();
  failCommit = false;
  loseResponse = false;
  async read() {
    return gameSnapshot(this.state);
  }
  transact(_id: string, change: (state: GameState) => GameState): Promise<GameState> {
    const next = this.queue.then(async () => {
      const candidate = gameSnapshot(change(this.state));
      if (this.failCommit) throw Error('commit failed');
      this.state = candidate;
      if (this.loseResponse) throw Error('response lost');
      return this.read();
    });
    this.queue = next.catch(() => {});
    return next;
  }
}
const config = (): OpeningConfiguration => ({
  catalog: catalogFixture,
  table: toadFixture,
  shop: shopFixture,
});
const command = {
  key: 'buy-open',
  expectedRevision: 1,
  request: { priceVersion: 1, catalogVersion: 1, tableVersion: 1 },
};
describe('A60 buy and open is one economic transaction', () => {
  it('commits cost, consumed unit, snapshot, copy and one receipt in one revision', async () => {
    const games = new Games(),
      random = { ticket: vi.fn(() => 0) };
    const result = await new BuyAndOpenCocoaToadUseCase(games, config, random).execute(
      'buyer',
      command,
    );
    expect(result.state.revision).toBe(2);
    expect(result.state.inventory.crowns).toBe(40);
    expect(result.state.inventory.products).toEqual([
      { id: 'buy-open:0', kind: 'cacao-toad', status: 'consumed', operationId: 'buy-open' },
    ]);
    expect(result.state.copies).toHaveLength(1);
    expect(result.state.receipts).toHaveLength(1);
    expect(result.receipt).toMatchObject({
      kind: 'buy-open-toad',
      unitId: 'buy-open:0',
      spentCrowns: 10,
      wizard: { id: 'merlin' },
      copyId: 'buy-open:copy',
      isNew: true,
      request: command.request,
    });
    expect(random.ticket).toHaveBeenCalledTimes(1);
    if (result.receipt.kind !== 'buy-open-toad') throw Error('Missing combined receipt');
    expect(Object.isFrozen(result.receipt.request)).toBe(true);
  });
  it('recovers a lost response before stale revision/configuration and never rerolls', async () => {
    const games = new Games(),
      random = { ticket: vi.fn(() => 0) };
    let current = config();
    const useCase = new BuyAndOpenCocoaToadUseCase(games, () => current, random);
    games.loseResponse = true;
    await expect(useCase.execute('buyer', command)).rejects.toThrow('response lost');
    games.loseResponse = false;
    current = { ...current, table: { ...current.table, entries: [] } };
    const recovered = await useCase.execute('buyer', command);
    expect(recovered.state.inventory.crowns).toBe(40);
    expect(recovered.state.copies).toHaveLength(1);
    expect(random.ticket).toHaveBeenCalledTimes(1);
    await expect(
      useCase.execute('buyer', { ...command, request: { ...command.request, priceVersion: 2 } }),
    ).rejects.toThrow('OPERATION_CONFLICT');
  });
  it('does not draw on stale versions, invalid key/revision, insufficient funds or invalid table', async () => {
    const games = new Games(),
      random = { ticket: vi.fn(() => 0) };
    const useCase = new BuyAndOpenCocoaToadUseCase(games, config, random);
    for (const [change, error] of [
      [{ priceVersion: 2 }, 'STALE_PRICE'],
      [{ catalogVersion: 2 }, 'STALE_TABLE'],
      [{ tableVersion: 2 }, 'STALE_TABLE'],
    ] as const)
      await expect(
        useCase.execute('buyer', { ...command, request: { ...command.request, ...change } }),
      ).rejects.toThrow(error);
    await expect(useCase.execute('buyer', { ...command, expectedRevision: 2 })).rejects.toThrow(
      'STALE_GAME',
    );
    await expect(useCase.execute('buyer', { ...command, key: '?' })).rejects.toThrow(
      'INVALID_OPERATION',
    );
    await expect(useCase.execute('buyer', { ...command, key: 'a'.repeat(118) })).rejects.toThrow(
      'INVALID_OPERATION',
    );
    games.state = gameSnapshot({
      ...games.state,
      inventory: { ...games.state.inventory, crowns: 0 },
    });
    await expect(useCase.execute('buyer', command)).rejects.toThrow('INSUFFICIENT_CROWNS');
    await expect(
      new BuyAndOpenCocoaToadUseCase(
        games,
        () => ({ ...config(), table: { ...toadFixture, entries: [] } }),
        random,
      ).execute('buyer', command),
    ).rejects.toThrow();
    expect(random.ticket).not.toHaveBeenCalled();
    expect(games.state.revision).toBe(1);
  });
  it('rolls back every economic change when commit fails', async () => {
    const games = new Games(),
      before = games.state;
    games.failCommit = true;
    await expect(
      new BuyAndOpenCocoaToadUseCase(games, config, { ticket: () => 0 }).execute('buyer', command),
    ).rejects.toThrow('commit failed');
    expect(games.state).toEqual(before);
  });
  it('serializes competing keys without a second debit or draw', async () => {
    const games = new Games(),
      random = { ticket: vi.fn(() => 0) },
      useCase = new BuyAndOpenCocoaToadUseCase(games, config, random);
    const results = await Promise.allSettled([
      useCase.execute('buyer', command),
      useCase.execute('buyer', { ...command, key: 'other' }),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(games.state.inventory.crowns).toBe(40);
    expect(random.ticket).toHaveBeenCalledTimes(1);
  });
  it('retains old purchase/open receipts and reports later duplicates as copies', async () => {
    const games = new Games();
    await new PurchaseProductUseCase(games, config).execute('buyer', {
      key: 'old-buy',
      expectedRevision: 1,
      request: { product: 'cacao-toad', quantity: 1, priceVersion: 1 },
    });
    await new OpenCocoaToadUseCase(games, config, { ticket: () => 0 }).execute('buyer', {
      key: 'old-open',
      expectedRevision: 2,
      request: { unitId: 'old-buy:0', catalogVersion: 1, tableVersion: 1 },
    });
    const result = await new BuyAndOpenCocoaToadUseCase(games, config, { ticket: () => 0 }).execute(
      'buyer',
      { ...command, expectedRevision: 3 },
    );
    expect(result.receipt).toMatchObject({ isNew: false });
    expect(result.state.receipts.map((r) => r.kind)).toEqual([
      'purchase',
      'open-toad',
      'buy-open-toad',
    ]);
    expect(result.state.copies).toHaveLength(2);
  });
  it('rejects corrupt persisted links, versions, amount or missing receipt', async () => {
    const games = new Games();
    await new BuyAndOpenCocoaToadUseCase(games, config, { ticket: () => 0 }).execute(
      'buyer',
      command,
    );
    for (const change of [
      (s: GameState) => ({ ...s, copies: [] }),
      (s: GameState) => ({ ...s, receipts: [] }),
      (s: GameState) => ({ ...s, receipts: s.receipts.map((r) => ({ ...r, unitId: 'other' })) }),
      (s: GameState) => ({ ...s, receipts: s.receipts.map((r) => ({ ...r, spentCrowns: -1 })) }),
      (s: GameState) => ({
        ...s,
        receipts: s.receipts.map((r) =>
          r.kind === 'buy-open-toad' ? { ...r, request: { ...r.request, priceVersion: 0 } } : r,
        ),
      }),
    ])
      expect(() => validateGame(change(structuredClone(games.state)))).toThrow('INVALID_GAME');
  });
});
