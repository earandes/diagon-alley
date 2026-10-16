import {
  ForgeWandUseCase,
  OpenObsidianVaultUseCase,
} from '../../../src/arcana/application/commerce-use-cases';
import { commerceFixture } from './support/commerce-fixtures';
import { projectPlayerStatus } from '../../../src/arcana/application/player-status';
import { describe, expect, it, vi } from 'vitest';
import { GameController } from '../../../src/arcana/application/client/game-controller';
import {
  pendingSnapshot,
  type ClientGateway,
  type PendingOperation,
  type ClientOperations,
} from '../../../src/arcana/application/client/ports';
import { ArcanaClientError } from '../../../src/arcana/application/client/errors';
import {
  gameSnapshot,
  operationResult,
  type GameState,
} from '../../../src/arcana/application/game';
import { projectPublicContent } from '../../../src/arcana/application/public-content';
import {
  BuyAndOpenCocoaToadUseCase,
  PurchaseProductUseCase,
} from '../../../src/arcana/application/shop-use-cases';
import { runInitial, campaignFixture } from './support/run-fixtures';
import { catalogFixture, toadFixture, shopFixture } from './support/fixtures';
const opening = () => ({ catalog: catalogFixture, table: toadFixture, shop: shopFixture });
class Metadata implements ClientOperations {
  pending: PendingOperation | null = null;
  lastKey: string | null = null;
  failClaim = false;
  failFinish = false;
  async read(playerId: string) {
    return this.pending?.playerId === playerId ? pendingSnapshot(this.pending) : null;
  }
  async claim(operation: PendingOperation) {
    if (this.failClaim) throw new ArcanaClientError('CLIENT_STORAGE', 0);
    if (this.pending && this.pending.command.key !== operation.command.key)
      throw new ArcanaClientError('OPERATION_PENDING', 0);
    this.pending = pendingSnapshot(operation);
  }
  async finish(playerId: string, key: string, outcome: 'confirmed' | 'rejected') {
    if (this.failFinish) throw new ArcanaClientError('CLIENT_STORAGE', 0);
    if (this.pending && (this.pending.playerId !== playerId || this.pending.command.key !== key))
      throw new ArcanaClientError('OPERATION_PENDING', 0);
    this.pending = null;
    if (outcome === 'confirmed') this.lastKey = key;
  }
}
const fixture = (goldKeys = 0) => {
  const operations = new Metadata();
  let state = gameSnapshot({ ...runInitial(), inventory: { ...runInitial().inventory, goldKeys } });
  const games = {
    read: async () => state,
    transact: async (_id: string, change: (current: GameState) => GameState) => {
      state = gameSnapshot(change(state));
      return state;
    },
  };
  const purchase = new PurchaseProductUseCase(games, opening);
  const gateway: ClientGateway = {
    state: vi.fn(async () => projectPlayerStatus(state, 0)),
    content: vi.fn(async () => projectPublicContent(opening(), campaignFixture())),
    operation: vi.fn(async (key) => {
      if (!state.receipts.some((r) => r.id === key)) throw new ArcanaClientError('NOT_FOUND', 404);
      return operationResult(state, key);
    }),
    purchase: vi.fn(async (command) => {
      expect(operations.pending?.command.key).toBe(command.key);
      return purchase.execute('player', command);
    }),
    buyOpenToad: vi.fn((command) =>
      new BuyAndOpenCocoaToadUseCase(games, opening, { ticket: () => 0 }).execute(
        'player',
        command,
      ),
    ),
    openToad: vi.fn(),
    startRun: vi.fn(),
    advanceNode: vi.fn(),
    setTeam: vi.fn(),
    equipEquipment: vi.fn(),
    forgeWand: vi.fn((command) =>
      new ForgeWandUseCase(games, () => commerceFixture).execute('player', command),
    ),
    openVault: vi.fn((command) =>
      new OpenObsidianVaultUseCase(games, () => commerceFixture, { ticket: () => 0 }).execute(
        'player',
        command,
      ),
    ),
    logout: vi.fn(),
  };
  const keys = vi.fn(() => 'buy'),
    controller = new GameController(gateway, operations, keys);
  return { gateway, operations, controller, keys, state: () => state };
};
const action = {
  kind: 'purchase' as const,
  request: { product: 'cacao-toad' as const, quantity: 1, priceVersion: 1 },
};
describe('ARCANA recoverable client orchestration', () => {
  it('persists and recovers a buy-open intent after a lost response without another POST', async () => {
    const { controller, gateway, operations, state } = fixture();
    await controller.load();
    const execute = vi.mocked(gateway.buyOpenToad).getMockImplementation()!;
    vi.mocked(gateway.buyOpenToad).mockImplementationOnce(async (command) => {
      expect(operations.pending?.kind).toBe('buy-open-toad');
      const result = await execute(command);
      throw new ArcanaClientError('NETWORK_ERROR', 0, true);
      return result;
    });
    await controller.perform({
      kind: 'buy-open-toad',
      request: { priceVersion: 1, catalogVersion: 1, tableVersion: 1 },
    });
    expect(controller.getSnapshot().status).toBe('recovery-required');
    expect(state().inventory.crowns).toBe(40);
    const restored = new GameController(gateway, operations, () => {
      throw Error('Must keep original key');
    });
    await restored.load();
    expect(restored.getSnapshot()).toMatchObject({
      status: 'ready',
      receipt: { kind: 'buy-open-toad', id: 'buy' },
    });
    expect(operations.pending).toBeNull();
    expect(gateway.buyOpenToad).toHaveBeenCalledTimes(1);
    expect(state().copies).toHaveLength(4);
  });

  it('loads authority state/config and reports readiness without economic mutation', async () => {
    const { controller, gateway, state } = fixture();
    await controller.load();
    expect(controller.getSnapshot()).toMatchObject({
      status: 'ready',
      game: state(),
      pending: null,
      error: null,
    });
    expect(gateway.purchase).not.toHaveBeenCalled();
  });
  it('persists intent before POST, presents only confirmed receipt and acknowledges its key', async () => {
    const { controller, operations, state } = fixture();
    await controller.load();
    await controller.perform(action);
    expect(state().inventory.crowns).toBe(40);
    expect(operations.pending).toBe(null);
    expect(operations.lastKey).toBe('buy');
    expect(controller.getSnapshot()).toMatchObject({
      status: 'ready',
      receipt: { id: 'buy', kind: 'purchase' },
      game: state(),
    });
  });
  it('does not send a command when saving its intent fails', async () => {
    const { controller, operations, gateway, state } = fixture();
    await controller.load();
    operations.failClaim = true;
    await controller.perform(action);
    expect(gateway.purchase).not.toHaveBeenCalled();
    expect(state().inventory.crowns).toBe(50);
    expect(controller.getSnapshot().error).toBe('CLIENT_STORAGE');
  });
  it('recovers a committed response lost across reload without another POST or key', async () => {
    const { controller, gateway, operations, state } = fixture();
    await controller.load();
    const original = gateway.purchase;
    gateway.purchase = vi.fn(async (command) => {
      await original(command);
      throw new ArcanaClientError('NETWORK_ERROR', 0, true);
    });
    await controller.perform(action);
    expect(controller.getSnapshot().status).toBe('recovery-required');
    expect(state().inventory.crowns).toBe(40);
    const keys = vi.fn(() => 'must-not-run'),
      reloaded = new GameController(gateway, operations, keys);
    await reloaded.load();
    expect(reloaded.getSnapshot()).toMatchObject({
      status: 'ready',
      game: state(),
      receipt: { id: 'buy' },
    });
    expect(gateway.purchase).toHaveBeenCalledTimes(1);
    expect(keys).not.toHaveBeenCalled();
  });
  it('reuses the complete command after a failure before server commit and a missing receipt', async () => {
    const { controller, gateway, operations, state } = fixture();
    await controller.load();
    const original = gateway.purchase;
    gateway.purchase = vi
      .fn()
      .mockRejectedValueOnce(new ArcanaClientError('NETWORK_ERROR', 0, true))
      .mockImplementation(original);
    await controller.perform(action);
    const pending = pendingSnapshot(operations.pending!);
    expect(state().inventory.crowns).toBe(50);
    await controller.recover();
    expect(gateway.purchase).toHaveBeenCalledTimes(2);
    expect(vi.mocked(gateway.purchase).mock.calls[1][0]).toEqual(pending.command);
    expect(state().inventory.crowns).toBe(40);
  });
  it('releases a definitely rejected command and synchronizes for explicit reconfirmation', async () => {
    const { controller, gateway, operations, state } = fixture();
    await controller.load();
    gateway.purchase = vi.fn(async () => {
      throw new ArcanaClientError('STALE_PRICE', 409);
    });
    await controller.perform(action);
    expect(operations.pending).toBe(null);
    expect(controller.getSnapshot().error).toBe('STALE_PRICE');
    expect(state().inventory.crowns).toBe(50);
    expect(gateway.content).toHaveBeenCalledTimes(2);
  });
  it('blocks another command while one is uncertain and preserves its key', async () => {
    const { controller, gateway, operations, keys } = fixture();
    await controller.load();
    gateway.purchase = vi.fn(async () => {
      throw new ArcanaClientError('UNKNOWN_COMMIT', 503, true);
    });
    await controller.perform(action);
    await controller.perform({ ...action, request: { ...action.request, quantity: 2 } });
    expect(keys).toHaveBeenCalledTimes(1);
    expect(gateway.purchase).toHaveBeenCalledTimes(1);
    expect(operations.pending?.command.key).toBe('buy');
  });
  it('surfaces an intent claimed by another tab without overwriting or posting the new intent', async () => {
    const { controller, operations, gateway } = fixture();
    await controller.load();
    operations.pending = pendingSnapshot({
      schemaVersion: 1,
      playerId: 'player',
      kind: 'purchase',
      command: { key: 'other-tab', expectedRevision: 1, request: action.request },
    });
    await controller.perform(action);
    expect(controller.getSnapshot()).toMatchObject({
      status: 'recovery-required',
      pending: { command: { key: 'other-tab' } },
      receipt: null,
    });
    expect(gateway.purchase).not.toHaveBeenCalled();
    await controller.recover();
    expect(controller.getSnapshot().receipt?.id).toBe('other-tab');
    expect(vi.mocked(gateway.purchase).mock.calls[0][0].key).toBe('other-tab');
  });
  it('does not present a new receipt when local acknowledgement fails and recovers it later', async () => {
    const { controller, operations, gateway } = fixture();
    await controller.load();
    operations.failFinish = true;
    await controller.perform(action);
    expect(controller.getSnapshot()).toMatchObject({ status: 'recovery-required', receipt: null });
    expect(operations.pending).not.toBe(null);
    operations.failFinish = false;
    await controller.recover();
    expect(controller.getSnapshot().receipt?.id).toBe('buy');
    expect(gateway.purchase).toHaveBeenCalledTimes(1);
  });
  it('never runs a saved command belonging to another signed-in player', async () => {
    const { controller, gateway, operations } = fixture();
    operations.pending = pendingSnapshot({
      schemaVersion: 1,
      playerId: 'other',
      kind: 'purchase',
      command: { key: 'old', expectedRevision: 1, request: action.request },
    });
    await controller.load();
    expect(controller.getSnapshot().pending).toBe(null);
    expect(gateway.purchase).not.toHaveBeenCalled();
    expect(gateway.operation).not.toHaveBeenCalled();
    expect(operations.pending.playerId).toBe('other');
  });
  it('recovers a receipt even when current content/configuration is unavailable', async () => {
    const { controller, gateway, operations } = fixture();
    await controller.load();
    const original = gateway.purchase;
    gateway.purchase = vi.fn(async (command) => {
      await original(command);
      throw new ArcanaClientError('NETWORK_ERROR', 0, true);
    });
    await controller.perform(action);
    gateway.content = vi.fn(async () => {
      throw new ArcanaClientError('STORAGE', 503);
    });
    const next = new GameController(gateway, operations, () => 'unused');
    await next.load();
    expect(next.getSnapshot().receipt?.id).toBe('buy');
    expect(gateway.purchase).toHaveBeenCalledTimes(1);
  });
  it('refreshes authority energy without losing a confirmed receipt or issuing another command', async () => {
    const { controller, gateway, state } = fixture();
    await controller.load();
    await controller.perform(action);
    const receipt = controller.getSnapshot().receipt;
    vi.mocked(gateway.state).mockResolvedValue(projectPlayerStatus(state(), 720_000));
    await controller.refreshStatus();
    expect(controller.getSnapshot()).toMatchObject({
      game: state(),
      receipt,
      serverTime: 720_000,
      energy: { points: 50 },
      status: 'ready',
    });
    expect(gateway.purchase).toHaveBeenCalledTimes(1);
  });
  it('keeps a committed receipt when its follow-up authority query fails', async () => {
    const { controller, gateway, operations } = fixture();
    await controller.load();
    vi.mocked(gateway.state).mockRejectedValue(new ArcanaClientError('NETWORK_ERROR', 0));
    await controller.perform(action);
    expect(controller.getSnapshot()).toMatchObject({
      receipt: { id: 'buy' },
      pending: null,
      error: null,
      energy: null,
      statusError: 'NETWORK_ERROR',
      status: 'ready',
    });
    expect(operations.lastKey).toBe('buy');
    expect(gateway.purchase).toHaveBeenCalledTimes(1);
  });
  it('rejects an older query and another player without replacing the confirmed state', async () => {
    const { controller, gateway, state } = fixture();
    const before = state();
    await controller.load();
    await controller.perform(action);
    const confirmed = controller.getSnapshot().game;
    vi.mocked(gateway.state).mockResolvedValue(projectPlayerStatus(before, 1));
    await controller.refreshStatus();
    expect(controller.getSnapshot()).toMatchObject({
      game: confirmed,
      statusError: 'STALE_STATUS',
    });
    vi.mocked(gateway.state).mockResolvedValue(
      projectPlayerStatus({ ...before, playerId: 'another-player' }, 2),
    );
    await controller.refreshStatus();
    expect(controller.getSnapshot()).toMatchObject({
      game: confirmed,
      status: 'error',
      error: 'PLAYER_MISMATCH',
    });
  });
  it('does not refresh while a command is uncertain', async () => {
    const { controller, gateway } = fixture();
    await controller.load();
    gateway.purchase = vi.fn(async () => {
      throw new ArcanaClientError('UNKNOWN_COMMIT', 503, true);
    });
    await controller.perform(action);
    const calls = vi.mocked(gateway.state).mock.calls.length;
    await controller.refreshStatus();
    expect(gateway.state).toHaveBeenCalledTimes(calls);
    expect(controller.getSnapshot().pending?.command.key).toBe('buy');
  });
  it('dispatches forge and recovers a committed vault response without another key or POST', async () => {
    const { controller, gateway, keys, operations, state } = fixture(1);
    keys.mockReturnValueOnce('forge').mockReturnValueOnce('vault');
    await controller.load();
    await controller.perform({
      kind: 'forge-wand',
      request: { recipeId: 'birch-dragon', catalogVersion: 1 },
    });
    expect(controller.getSnapshot().receipt?.kind).toBe('forge-wand');
    const original = gateway.openVault;
    gateway.openVault = vi.fn(async (command) => {
      await original(command);
      throw new ArcanaClientError('NETWORK_ERROR', 0, true);
    });
    await controller.perform({ kind: 'open-vault', request: { tableVersion: 1 } });
    expect(controller.getSnapshot().status).toBe('recovery-required');
    await controller.recover();
    expect(controller.getSnapshot()).toMatchObject({
      status: 'ready',
      receipt: { kind: 'open-vault' },
      pending: null,
    });
    expect(gateway.forgeWand).toHaveBeenCalledTimes(1);
    expect(gateway.openVault).toHaveBeenCalledTimes(1);
    expect(keys).toHaveBeenCalledTimes(2);
    expect(state().inventory.goldKeys).toBe(0);
    expect(state().inventory.equipment).toHaveLength(2);
    expect(operations.lastKey).toBe('vault');
  });
  it('validates complete recoverable forge and vault intents, rejecting client loot and price fields', () => {
    for (const action of [
      { kind: 'forge-wand', request: { recipeId: 'birch-dragon', catalogVersion: 1 } },
      { kind: 'open-vault', request: { tableVersion: 1 } },
    ]) {
      const metadata = {
        schemaVersion: 1,
        playerId: 'player',
        kind: action.kind,
        command: { key: 'new', expectedRevision: 1, request: action.request },
      };
      expect(pendingSnapshot(metadata)).toEqual(metadata);
      expect(() =>
        pendingSnapshot({
          ...metadata,
          command: { ...metadata.command, request: { ...action.request, crowns: 99 } },
        }),
      ).toThrow('INVALID_PENDING');
    }
  });
  it('rejects malformed metadata instead of forwarding unknown economic fields', () => {
    for (const value of [
      {},
      {
        schemaVersion: 1,
        playerId: 'player',
        kind: 'purchase',
        command: { key: 'buy', expectedRevision: 1, request: { ...action.request, crowns: 999 } },
      },
      {
        schemaVersion: 1,
        playerId: 'player',
        kind: 'advance-node',
        command: { key: 'duel', expectedRevision: -1, request: {} },
      },
    ])
      expect(() => pendingSnapshot(value)).toThrow('INVALID_PENDING');
  });
});
