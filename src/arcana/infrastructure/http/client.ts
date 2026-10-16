import type { ForgeWandRequest, OpenVaultRequest } from '../../domain/economy/commerce';
import { playerStatusSnapshot } from '../../application/player-status';
import {
  gameSnapshot,
  operationResult,
  type OperationResult,
  type OperationCommand,
  type OpenToadRequest,
  type BuyOpenToadRequest,
} from '../../application/game';
import type { PurchaseRequest } from '../../domain/economy/inventory';
import type { StartRunRequest, AdvanceNodeRequest } from '../../application/run-contracts';
import type { SetTeamRequest, EquipEquipmentRequest } from '../../application/team-contracts';
import { publicContentSnapshot, type PublicContent } from '../../application/public-content';
import { validDomainId } from '../../domain/identifiers';
import { ArcanaClientError } from '../../application/client/errors';
import type { AuthorityState, ClientGateway } from '../../application/client/ports';
export { ArcanaClientError } from '../../application/client/errors';
export type { AuthorityState } from '../../application/client/ports';
type FetchTransport = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
/** This adapter transports intents and confirmed data. It never retries or computes a reward. */
export class ArcanaHttpClient implements ClientGateway {
  private observedToken: string | undefined;
  private observedPlayer: string | undefined;
  constructor(
    private readonly base: string,
    private readonly token: () => string | null,
    private readonly fetch: FetchTransport = globalThis.fetch.bind(globalThis),
    private readonly authentication: 'bearer' | 'cookie' = 'bearer',
  ) {}
  async state(): Promise<AuthorityState> {
    const token = this.token();
    const value = await this.request('GET', '/state', undefined, false, token);
    try {
      const result = playerStatusSnapshot(value);
      if (this.authentication === 'bearer') this.observedToken = token!;
      this.observedPlayer = result.state.playerId;
      return result;
    } catch {
      throw new ArcanaClientError('INVALID_RESPONSE', 200);
    }
  }
  async content(): Promise<PublicContent> {
    try {
      return publicContentSnapshot(await this.request('GET', '/content'));
    } catch (error) {
      if (error instanceof ArcanaClientError) throw error;
      throw new ArcanaClientError('INVALID_RESPONSE', 200);
    }
  }
  async operation(key: string): Promise<OperationResult> {
    if (!validDomainId(key)) throw new ArcanaClientError('INVALID_OPERATION', 0);
    return this.result(await this.request('GET', `/operations/${encodeURIComponent(key)}`), key);
  }
  purchase = (command: OperationCommand<PurchaseRequest>) => this.command('/purchases', command);
  buyOpenToad = (command: OperationCommand<BuyOpenToadRequest>) =>
    this.command('/toads/buy-open', command);
  openToad = (command: OperationCommand<OpenToadRequest>) => this.command('/toads/open', command);
  startRun = (command: OperationCommand<StartRunRequest>) => this.command('/runs', command);
  advanceNode = (command: OperationCommand<AdvanceNodeRequest>) =>
    this.command('/nodes/advance', command);
  setTeam = (command: OperationCommand<SetTeamRequest>) => this.command('/team', command);
  equipEquipment = (command: OperationCommand<EquipEquipmentRequest>) =>
    this.command('/equipment', command);
  forgeWand = (command: OperationCommand<ForgeWandRequest>) =>
    this.command('/wands/forge', command);
  openVault = (command: OperationCommand<OpenVaultRequest>) =>
    this.command('/vaults/open', command);
  async logout(): Promise<void> {
    await this.request('DELETE', '/session', undefined, true);
  }
  private async command<Request>(
    path: string,
    command: OperationCommand<Request>,
  ): Promise<OperationResult> {
    return this.result(await this.request('POST', path, command), command.key);
  }
  private result(value: unknown, key: string): OperationResult {
    try {
      const envelope = value as OperationResult;
      if (envelope.receipt.id !== key) throw Error();
      // Use the validated receipt in committed state, not a separate unvalidated reward object.
      return operationResult(gameSnapshot(envelope.state), key);
    } catch {
      throw new ArcanaClientError('INVALID_RESPONSE', 200, true);
    }
  }
  private async request(
    method: string,
    path: string,
    body?: unknown,
    noBody = false,
    token = this.token(),
  ): Promise<unknown> {
    if (this.authentication === 'bearer' && !token)
      throw new ArcanaClientError('UNAUTHORIZED', 401);
    if (path !== '/state' && this.observedToken !== undefined && token !== this.observedToken)
      throw new ArcanaClientError('PLAYER_MISMATCH', 409, true);
    let response: Response;
    try {
      response = await this.fetch(`${this.base.replace(/\/$/, '')}${path}`, {
        method,
        cache: 'no-store',
        redirect: 'error',
        credentials: 'same-origin',
        headers: {
          ...(this.authentication === 'bearer' ? { Authorization: `Bearer ${token}` } : {}),
          ...(path !== '/state' && this.observedPlayer
            ? { 'X-Arcana-Player': this.observedPlayer }
            : {}),
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    } catch {
      throw new ArcanaClientError('NETWORK_ERROR', 0, method === 'POST');
    }
    let value: unknown;
    if (response.ok && noBody && response.status === 204) return undefined;
    try {
      value = await response.json();
    } catch {
      throw new ArcanaClientError('INVALID_RESPONSE', response.status, method === 'POST');
    }
    if (!response.ok) {
      const error = (value as { error?: { code?: unknown; recoverWithSameKey?: unknown } } | null)
        ?.error;
      if (!error || typeof error.code !== 'string' || !/^[A-Z_]{1,100}$/.test(error.code))
        throw new ArcanaClientError('INVALID_RESPONSE', response.status, method === 'POST');
      throw new ArcanaClientError(error.code, response.status, error.recoverWithSameKey === true);
    }
    return value;
  }
}
