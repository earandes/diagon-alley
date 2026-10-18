import {
  gameSnapshot,
  operationResult,
  type GameState,
  type OperationReceipt,
  type OperationResult,
} from '../game';
import type { PublicContent } from '../public-content';
import { playerStatusSnapshot, type PlayerStatus } from '../player-status';
import { ArcanaClientError } from './errors';
import {
  pendingSnapshot,
  type ClientAction,
  type ClientGateway,
  type ClientOperations,
  type PendingOperation,
} from './ports';
export interface ClientSnapshot {
  readonly status: 'loading' | 'ready' | 'sending' | 'recovering' | 'recovery-required' | 'error';
  readonly game: GameState | null;
  readonly content: PublicContent | null;
  readonly serverTime: number | null;
  readonly energy: PlayerStatus['energy'] | null;
  readonly refreshingStatus: boolean;
  readonly statusError: string | null;
  readonly pending: PendingOperation | null;
  readonly receipt: OperationReceipt | null;
  readonly error: string | null;
}
const initial: ClientSnapshot = Object.freeze({
  status: 'loading',
  game: null,
  content: null,
  serverTime: null,
  energy: null,
  refreshingStatus: false,
  statusError: null,
  pending: null,
  receipt: null,
  error: null,
});
const code = (error: unknown) =>
  error instanceof ArcanaClientError ? error.code : 'CLIENT_STORAGE';
/** Presentation orchestration; rules, randomness and economic commits stay behind the gateway. */
export class GameController {
  private snapshot = initial;
  private listeners = new Set<() => void>();
  private busy = false;
  private identityChange: ClientSnapshot | null = null;
  constructor(
    private readonly gateway: ClientGateway,
    private readonly operations: ClientOperations,
    private readonly keys: () => string,
  ) {}
  getSnapshot = (): ClientSnapshot => this.snapshot;
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private update(change: Partial<ClientSnapshot>): void {
    this.snapshot = Object.freeze({ ...this.snapshot, ...change });
    for (const listener of this.listeners) listener();
  }
  /** Hold the same exclusion as economic commands while identity transport is in flight. */
  beginIdentityChange = async (samePlayerOnly: boolean): Promise<boolean> => {
    if (this.busy || this.identityChange) return false;
    this.busy = true;
    try {
      const playerId = this.snapshot.game?.playerId ?? this.snapshot.pending?.playerId;
      const pending =
        this.snapshot.pending ??
        (playerId
          ? await this.operations.read(playerId)
          : ((await this.operations.pendingForEntry?.()) ?? null));
      if (pending && playerId && pending.playerId !== playerId)
        throw new ArcanaClientError('PLAYER_MISMATCH', 409);
      if (pending) {
        this.update({ pending, status: 'recovery-required', error: 'OPERATION_PENDING' });
        if (!samePlayerOnly) return false;
      }
      this.identityChange = this.snapshot;
      this.update({ status: 'loading' });
      return true;
    } catch (error) {
      this.update({ status: 'error', error: code(error) });
      return false;
    } finally {
      if (!this.identityChange) this.busy = false;
    }
  };
  finishIdentityChange = async (
    outcome: 'cancel' | 'authenticated' | 'signed-out' | 'uncertain',
    samePlayerOnly: boolean,
    expectedPlayerId?: string,
  ): Promise<void> => {
    if (!this.identityChange) {
      if (outcome === 'uncertain' && !this.busy)
        this.update({
          status: this.snapshot.pending ? 'recovery-required' : 'error',
          error: 'INVALID_SESSION',
        });
      return;
    }
    const previous = this.identityChange;
    this.identityChange = null;
    this.busy = false;
    if (outcome === 'authenticated') {
      await this.load({ allowPlayerChange: !samePlayerOnly, expectedPlayerId });
    } else if (outcome === 'uncertain') {
      this.update({
        status: previous.pending ? 'recovery-required' : 'error',
        error: 'INVALID_SESSION',
      });
    } else if (outcome === 'signed-out') {
      this.update({ ...initial, status: 'error', error: 'UNAUTHORIZED' });
    } else this.update(previous);
  };
  /** Read transport metadata before explicit entry; never abandon an earlier owner's request. */
  prepareTrialEntry = async (): Promise<boolean> => {
    if (this.busy) return false;
    if (this.snapshot.pending) {
      this.update({ status: 'recovery-required', error: 'OPERATION_PENDING' });
      return false;
    }
    const playerId = this.snapshot.game?.playerId;
    if (!playerId) {
      try {
        const pending = await this.operations.pendingForEntry?.();
        if (!pending) return true;
        this.update({ pending, status: 'recovery-required', error: 'OPERATION_PENDING' });
      } catch (error) {
        this.update({ status: 'error', error: code(error) });
      }
      return false;
    }
    this.busy = true;
    try {
      const pending = await this.operations.read(playerId);
      if (pending && pending.playerId !== playerId)
        throw new ArcanaClientError('PLAYER_MISMATCH', 409);
      if (pending) {
        this.update({ pending, status: 'recovery-required', error: 'OPERATION_PENDING' });
        return false;
      }
      return true;
    } catch (error) {
      this.update({ status: 'error', error: code(error) });
      return false;
    } finally {
      this.busy = false;
    }
  };
  load = async (
    options: { readonly allowPlayerChange?: boolean; readonly expectedPlayerId?: string } = {},
  ): Promise<void> => {
    if (this.busy) return;
    if (options.allowPlayerChange && this.snapshot.pending) {
      this.update({ status: 'recovery-required', error: 'OPERATION_PENDING' });
      return;
    }
    this.busy = true;
    const previousPlayer = this.snapshot.game?.playerId;
    // Reloading is a query: never erase an uncertain operation or its owner before authority replies.
    this.update({ status: 'loading', error: null, energy: null });
    try {
      const envelope = playerStatusSnapshot(await this.gateway.state()),
        game = gameSnapshot(envelope.state);
      if (options.expectedPlayerId && game.playerId !== options.expectedPlayerId)
        throw new ArcanaClientError('PLAYER_MISMATCH', 409);
      if (previousPlayer && game.playerId !== previousPlayer && !options.allowPlayerChange)
        throw new ArcanaClientError('PLAYER_MISMATCH', 409);
      const pending = this.snapshot.pending ?? (await this.operations.read(game.playerId));
      if (pending && pending.playerId !== game.playerId)
        throw new ArcanaClientError('PLAYER_MISMATCH', 409);
      this.update({
        ...(previousPlayer && previousPlayer !== game.playerId ? initial : {}),
        game,
        serverTime: envelope.serverTime,
        energy: envelope.energy,
        statusError: null,
        pending,
        status: pending ? 'recovering' : 'loading',
      });
      if (pending) await this.resolve(pending);
      if (this.snapshot.error === 'PLAYER_MISMATCH') return;
      try {
        const content = await this.gateway.content();
        this.update({ content });
      } catch (error) {
        this.update({
          error: code(error),
          status: this.snapshot.pending ? 'recovery-required' : 'error',
        });
        return;
      }
      if (
        !this.snapshot.pending &&
        !['UNAUTHORIZED', 'INVALID_SESSION', 'PLAYER_MISMATCH'].includes(this.snapshot.error ?? '')
      )
        this.update({ status: 'ready' });
    } catch (error) {
      let failure = code(error);
      if (!this.snapshot.game && !this.snapshot.pending) {
        try {
          const pending = await this.operations.pendingForEntry?.();
          if (pending) this.update({ pending });
        } catch (storage) {
          failure = code(storage);
        }
      }
      this.update({
        error: failure,
        status: this.snapshot.pending ? 'recovery-required' : 'error',
      });
    } finally {
      this.busy = false;
    }
  };
  refreshStatus = async (): Promise<void> => {
    if (
      this.busy ||
      this.snapshot.pending ||
      this.snapshot.status !== 'ready' ||
      !this.snapshot.game
    )
      return;
    this.busy = true;
    this.update({ refreshingStatus: true });
    try {
      await this.queryStatus();
    } finally {
      this.busy = false;
      this.update({ refreshingStatus: false });
    }
  };
  private async queryStatus(): Promise<void> {
    try {
      const envelope = playerStatusSnapshot(await this.gateway.state());
      if (envelope.state.playerId !== this.snapshot.game?.playerId)
        throw new ArcanaClientError('PLAYER_MISMATCH', 409);
      if (envelope.state.revision < this.snapshot.game.revision)
        throw new ArcanaClientError('STALE_STATUS', 409);
      this.update({
        game: envelope.state,
        energy: envelope.energy,
        serverTime: envelope.serverTime,
        statusError: null,
      });
    } catch (error) {
      const failure = code(error);
      this.update({
        energy: null,
        statusError: failure,
        ...(['PLAYER_MISMATCH', 'UNAUTHORIZED', 'INVALID_SESSION'].includes(failure)
          ? { status: 'error' as const, error: failure }
          : {}),
      });
    }
  }
  perform = async (action: ClientAction): Promise<void> => {
    if (
      this.busy ||
      this.snapshot.pending ||
      this.snapshot.status !== 'ready' ||
      !this.snapshot.game
    )
      return;
    this.busy = true;
    try {
      const pending = pendingSnapshot({
        schemaVersion: 1,
        playerId: this.snapshot.game.playerId,
        kind: action.kind,
        command: {
          key: this.keys(),
          expectedRevision: this.snapshot.game.revision,
          request: action.request,
        },
      });
      try {
        await this.operations.claim(pending);
      } catch (error) {
        if (code(error) === 'OPERATION_PENDING') {
          const existing = await this.operations.read(pending.playerId);
          if (existing) {
            this.update({
              error: 'OPERATION_PENDING',
              status: 'recovery-required',
              pending: existing,
              receipt: null,
            });
            return;
          }
        }
        this.update({ error: code(error), status: 'error' });
        return;
      }
      this.update({ status: 'sending', pending, error: null, receipt: null });
      await this.sendAndConfirm(pending);
    } catch (error) {
      this.update({
        error: code(error),
        status: this.snapshot.pending ? 'recovery-required' : 'error',
      });
    } finally {
      this.busy = false;
    }
  };
  recover = async (): Promise<void> => {
    if (this.busy || !this.snapshot.pending || !this.snapshot.game) return;
    this.busy = true;
    this.update({ status: 'recovering', error: null });
    try {
      const envelope = playerStatusSnapshot(await this.gateway.state());
      if (envelope.state.playerId !== this.snapshot.pending.playerId)
        throw new ArcanaClientError('PLAYER_MISMATCH', 409);
      this.update({ serverTime: envelope.serverTime });
      await this.resolve(this.snapshot.pending);
    } catch (error) {
      this.update({ error: code(error), status: 'recovery-required' });
    } finally {
      this.busy = false;
    }
  };
  private async resolve(pending: PendingOperation): Promise<void> {
    try {
      const recovered = await this.gateway.operation(pending.command.key);
      await this.confirm(pending, recovered);
    } catch (error) {
      if (error instanceof ArcanaClientError && error.status === 404 && error.code === 'NOT_FOUND')
        await this.sendAndConfirm(pending);
      else throw error;
    }
  }
  private async sendAndConfirm(pending: PendingOperation): Promise<void> {
    let result: OperationResult;
    try {
      result = await this.send(pending);
    } catch (error) {
      const definitive =
        error instanceof ArcanaClientError &&
        error.status >= 400 &&
        error.status < 500 &&
        !error.recoverWithSameKey;
      if (!definitive) throw error;
      await this.operations.finish(pending.playerId, pending.command.key, 'rejected');
      this.update({ pending: null, status: 'error', error: code(error) });
      try {
        const envelope = playerStatusSnapshot(await this.gateway.state());
        if (envelope.state.playerId !== pending.playerId)
          throw new ArcanaClientError('PLAYER_MISMATCH', 409);
        this.update({
          game: gameSnapshot(envelope.state),
          serverTime: envelope.serverTime,
          energy: envelope.energy,
          content: await this.gateway.content(),
        });
      } catch {
        /* Keep the explicit rejection and require a fresh load before another confirmation. */
      }
      return;
    }
    await this.confirm(pending, result);
  }
  private async confirm(pending: PendingOperation, result: OperationResult): Promise<void> {
    if (result.state.playerId !== pending.playerId || result.receipt.id !== pending.command.key)
      throw new ArcanaClientError('INVALID_RESPONSE', 200, true);
    const canonical = operationResult(gameSnapshot(result.state), pending.command.key);
    await this.operations.finish(pending.playerId, pending.command.key, 'confirmed');
    this.update({
      game: canonical.state,
      receipt: canonical.receipt,
      pending: null,
      status: 'ready',
      error: null,
      energy: null,
      refreshingStatus: true,
      statusError: null,
    });
    await this.queryStatus();
    this.update({ refreshingStatus: false });
  }
  private send(pending: PendingOperation): Promise<OperationResult> {
    switch (pending.kind) {
      case 'seasonal-event':
        if (!this.gateway.seasonalEvent) throw new Error('Seasonal transport unavailable');
        return this.gateway.seasonalEvent(pending.command);
      case 'set-intention':
        if (!this.gateway.setIntention) throw new Error('Intention transport unavailable');
        return this.gateway.setIntention(pending.command);
      case 'forge-wand':
        return this.gateway.forgeWand(pending.command);
      case 'open-vault':
        return this.gateway.openVault(pending.command);
      case 'purchase':
        return this.gateway.purchase(pending.command);
      case 'buy-open-toad':
        return this.gateway.buyOpenToad(pending.command);
      case 'open-toad':
        return this.gateway.openToad(pending.command);
      case 'start-run':
        return this.gateway.startRun(pending.command);
      case 'advance-node':
        return this.gateway.advanceNode(pending.command);
      case 'set-team':
        return this.gateway.setTeam(pending.command);
      case 'equip-equipment':
        return this.gateway.equipEquipment(pending.command);
    }
  }
}
