import { nodeOptionsSnapshot } from '../node-options';
import type { ForgeWandRequest, OpenVaultRequest } from '../../domain/economy/commerce';
import type { PurchaseRequest } from '../../domain/economy/inventory';
import { validDomainId } from '../../domain/identifiers';
import type {
  BuyOpenToadRequest,
  OpenToadRequest,
  OperationCommand,
  OperationResult,
} from '../game';
import type { PublicContent } from '../public-content';
import type { StartRunRequest, AdvanceNodeRequest } from '../run-contracts';
import type { SetTeamRequest, EquipEquipmentRequest } from '../team-contracts';
import { ArcanaClientError } from './errors';
export type { PlayerStatus as AuthorityState } from '../player-status';
import type { PlayerStatus as AuthorityState } from '../player-status';
export interface ClientGateway {
  state(): Promise<AuthorityState>;
  content(): Promise<PublicContent>;
  operation(key: string): Promise<OperationResult>;
  purchase(command: OperationCommand<PurchaseRequest>): Promise<OperationResult>;
  buyOpenToad(command: OperationCommand<BuyOpenToadRequest>): Promise<OperationResult>;
  openToad(command: OperationCommand<OpenToadRequest>): Promise<OperationResult>;
  startRun(command: OperationCommand<StartRunRequest>): Promise<OperationResult>;
  advanceNode(command: OperationCommand<AdvanceNodeRequest>): Promise<OperationResult>;
  setTeam(command: OperationCommand<SetTeamRequest>): Promise<OperationResult>;
  equipEquipment(command: OperationCommand<EquipEquipmentRequest>): Promise<OperationResult>;
  forgeWand(command: OperationCommand<ForgeWandRequest>): Promise<OperationResult>;
  openVault(command: OperationCommand<OpenVaultRequest>): Promise<OperationResult>;
  logout(): Promise<void>;
}
interface ActionRequests {
  'forge-wand': ForgeWandRequest;
  'open-vault': OpenVaultRequest;
  purchase: PurchaseRequest;
  'open-toad': OpenToadRequest;
  'buy-open-toad': BuyOpenToadRequest;
  'start-run': StartRunRequest;
  'advance-node': AdvanceNodeRequest;
  'set-team': SetTeamRequest;
  'equip-equipment': EquipEquipmentRequest;
}
export type ClientAction = {
  [K in keyof ActionRequests]: { readonly kind: K; readonly request: ActionRequests[K] };
}[keyof ActionRequests];
export type PendingOperation = {
  [K in keyof ActionRequests]: {
    readonly schemaVersion: 1;
    readonly playerId: string;
    readonly kind: K;
    readonly command: OperationCommand<ActionRequests[K]>;
  };
}[keyof ActionRequests];
export interface ClientOperations {
  read(playerId: string): Promise<PendingOperation | null>;
  claim(operation: PendingOperation): Promise<void>;
  finish(playerId: string, key: string, outcome: 'confirmed' | 'rejected'): Promise<void>;
}
const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);
function fields(
  value: unknown,
  keys: string[],
  optional: string[] = [],
): asserts value is Record<string, unknown> {
  if (
    !object(value) ||
    Object.keys(value).some((key) => !keys.includes(key) && !optional.includes(key)) ||
    keys.some((key) => !(key in value))
  )
    throw Error();
}
const version = (value: unknown) =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
const ids = (value: unknown, minimum = 0): value is string[] =>
  Array.isArray(value) &&
  value.length >= minimum &&
  value.length <= 5 &&
  value.every(validDomainId) &&
  new Set(value).size === value.length;
/** Local metadata is untrusted transport data, never an inventory import. */
export function pendingSnapshot(value: unknown): PendingOperation {
  try {
    fields(value, ['schemaVersion', 'playerId', 'kind', 'command']);
    if (value.schemaVersion !== 1 || !validDomainId(value.playerId)) throw Error();
    fields(value.command, ['key', 'expectedRevision', 'request']);
    const command = value.command;
    if (
      !validDomainId(command.key) ||
      command.key.length > 100 ||
      !version(command.expectedRevision)
    )
      throw Error();
    const r = command.request;
    let request: unknown;
    switch (value.kind) {
      case 'forge-wand':
        fields(r, ['recipeId', 'catalogVersion']);
        if (!validDomainId(r.recipeId) || !version(r.catalogVersion)) throw Error();
        request = { recipeId: r.recipeId, catalogVersion: r.catalogVersion };
        break;
      case 'open-vault':
        fields(r, ['tableVersion']);
        if (!version(r.tableVersion)) throw Error();
        request = { tableVersion: r.tableVersion };
        break;
      case 'purchase':
        fields(r, ['product', 'quantity', 'priceVersion']);
        if (
          typeof r.product !== 'string' ||
          !['cacao-toad', 'random-beans'].includes(r.product) ||
          !version(r.quantity) ||
          Number(r.quantity) > 1000 ||
          !version(r.priceVersion)
        )
          throw Error();
        request = { product: r.product, quantity: r.quantity, priceVersion: r.priceVersion };
        break;
      case 'buy-open-toad':
        fields(r, ['priceVersion', 'catalogVersion', 'tableVersion']);
        if (!version(r.priceVersion) || !version(r.catalogVersion) || !version(r.tableVersion))
          throw Error();
        request = {
          priceVersion: r.priceVersion,
          catalogVersion: r.catalogVersion,
          tableVersion: r.tableVersion,
        };
        break;
      case 'open-toad':
        fields(r, ['unitId', 'catalogVersion', 'tableVersion']);
        if (!validDomainId(r.unitId) || !version(r.catalogVersion) || !version(r.tableVersion))
          throw Error();
        request = {
          unitId: r.unitId,
          catalogVersion: r.catalogVersion,
          tableVersion: r.tableVersion,
        };
        break;
      case 'start-run':
        fields(r, ['zoneId', 'campaignVersion', 'copyIds']);
        if (!validDomainId(r.zoneId) || !version(r.campaignVersion) || !ids(r.copyIds, 1))
          throw Error();
        request = {
          zoneId: r.zoneId,
          campaignVersion: r.campaignVersion,
          copyIds: Object.freeze([...r.copyIds]),
        };
        break;
      case 'advance-node': {
        fields(
          r,
          ['runId', 'nodeId', 'campaignVersion', 'assignments'],
          ['refugeAction', 'pactAction', 'replaceUnitId', 'encounterAction'],
        );
        const options = nodeOptionsSnapshot(r);
        if (
          !validDomainId(r.runId) ||
          !validDomainId(r.nodeId) ||
          !version(r.campaignVersion) ||
          !Array.isArray(r.assignments) ||
          r.assignments.length > 5
        )
          throw Error();
        const assignments = r.assignments.map((assignment) => {
          fields(assignment, ['unitId', 'beanId']);
          if (!validDomainId(assignment.unitId) || !validDomainId(assignment.beanId)) throw Error();
          return Object.freeze({ unitId: assignment.unitId, beanId: assignment.beanId });
        });
        if (
          new Set(assignments.map((a) => a.unitId)).size !== assignments.length ||
          new Set(assignments.map((a) => a.beanId)).size !== assignments.length
        )
          throw Error();
        request = {
          runId: r.runId,
          nodeId: r.nodeId,
          campaignVersion: r.campaignVersion,
          assignments: Object.freeze(assignments),
          ...options,
        };
        break;
      }
      case 'set-team':
        fields(r, ['copyIds']);
        if (!ids(r.copyIds)) throw Error();
        request = { copyIds: Object.freeze([...r.copyIds]) };
        break;
      case 'equip-equipment':
        fields(r, ['copyId', 'slot', 'equipmentId']);
        if (
          !validDomainId(r.copyId) ||
          typeof r.slot !== 'string' ||
          !['wand', 'broom'].includes(r.slot) ||
          (r.equipmentId !== null && !validDomainId(r.equipmentId))
        )
          throw Error();
        request = { copyId: r.copyId, slot: r.slot, equipmentId: r.equipmentId };
        break;
      default:
        throw Error();
    }
    return Object.freeze({
      schemaVersion: 1,
      playerId: value.playerId,
      kind: value.kind,
      command: Object.freeze({
        key: command.key,
        expectedRevision: command.expectedRevision,
        request: Object.freeze(request as object),
      }),
    }) as PendingOperation;
  } catch {
    throw new ArcanaClientError('INVALID_PENDING', 0);
  }
}
