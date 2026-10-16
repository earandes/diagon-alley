import type { CommerceCatalogs } from '../domain/economy/commerce';
import {
  acquireWizard,
  drawWizard,
  validateToadTable,
  type ToadTable,
  type WizardCatalog,
} from '../domain/collection/wizards';
import type { RandomTickets } from '../domain/combat/random';
import {
  consumeToad,
  purchaseProduct,
  type PurchaseRequest,
  type ShopCatalog,
} from '../domain/economy/inventory';
import { ArcanaError } from '../domain/errors';
import { validDomainId } from '../domain/identifiers';
import {
  checkPlayer,
  checkRevision,
  gameSnapshot,
  operationResult,
  type GameTransactions,
  type BuyOpenToadRequest,
  type BuyOpenToadReceipt,
  type OpenToadRequest,
  type OperationCommand,
  type OperationResult,
  type OpeningReceipt,
  type PurchaseReceipt,
} from './game';

export interface OpeningConfiguration {
  readonly commerce?: CommerceCatalogs;
  readonly catalog: WizardCatalog;
  readonly table: ToadTable;
  readonly shop: ShopCatalog;
}

export class PurchaseProductUseCase {
  constructor(
    private readonly games: GameTransactions,
    private readonly configuration: () => OpeningConfiguration,
  ) {}

  execute = async (
    playerId: string,
    command: OperationCommand<PurchaseRequest>,
  ): Promise<OperationResult> => {
    if (!validDomainId(command.key)) throw new ArcanaError('INVALID_OPERATION');
    const state = await this.games.transact(playerId, (current) => {
      checkPlayer(current, playerId);
      const prior = current.receipts.find((receipt) => receipt.id === command.key);
      if (prior) {
        if (
          prior.kind !== 'purchase' ||
          prior.request.product !== command.request.product ||
          prior.request.quantity !== command.request.quantity ||
          prior.request.priceVersion !== command.request.priceVersion
        )
          throw new ArcanaError('OPERATION_CONFLICT');
        return current;
      }
      checkRevision(current, command.expectedRevision);
      const inventory = purchaseProduct(
        current.inventory,
        this.configuration().shop,
        command.request,
        command.key,
      );
      const receipt: PurchaseReceipt = {
        id: command.key,
        kind: 'purchase',
        request: { ...command.request },
        spentCrowns: current.inventory.crowns - inventory.crowns,
        unitIds: inventory.products.slice(current.inventory.products.length).map((unit) => unit.id),
      };
      return gameSnapshot({
        ...current,
        revision: current.revision + 1,
        inventory,
        receipts: [...current.receipts, receipt],
      });
    });
    return operationResult(state, command.key);
  };
}

export class OpenCocoaToadUseCase {
  constructor(
    private readonly games: GameTransactions,
    private readonly configuration: () => OpeningConfiguration,
    private readonly random: RandomTickets,
  ) {}

  execute = async (
    playerId: string,
    command: OperationCommand<OpenToadRequest>,
  ): Promise<OperationResult> => {
    if (!validDomainId(command.key)) throw new ArcanaError('INVALID_OPERATION');
    const state = await this.games.transact(playerId, (current) => {
      checkPlayer(current, playerId);
      const prior = current.receipts.find((receipt) => receipt.id === command.key);
      if (prior) {
        if (
          prior.kind !== 'open-toad' ||
          prior.request.unitId !== command.request.unitId ||
          prior.request.catalogVersion !== command.request.catalogVersion ||
          prior.request.tableVersion !== command.request.tableVersion
        )
          throw new ArcanaError('OPERATION_CONFLICT');
        return current;
      }
      checkRevision(current, command.expectedRevision);
      const configuration = this.configuration();
      validateToadTable(configuration.catalog, configuration.table);
      if (
        configuration.catalog.version !== command.request.catalogVersion ||
        configuration.table.version !== command.request.tableVersion
      )
        throw new ArcanaError('STALE_TABLE');
      // Validate unit and all spending preconditions before asking for a lottery ticket.
      const inventory = consumeToad(current.inventory, command.request.unitId, command.key);
      const wizard = drawWizard(configuration.catalog, configuration.table, this.random);
      const copyId = `${command.key}:copy`;
      const copies = acquireWizard(
        current.copies,
        copyId,
        wizard,
        configuration.catalog.version,
        command.key,
        'toad',
      );
      const receipt: OpeningReceipt = {
        id: command.key,
        kind: 'open-toad',
        request: { ...command.request },
        wizard,
        copyId,
        isNew: !current.copies.some((copy) => copy.wizard.id === wizard.id),
      };
      return gameSnapshot({
        ...current,
        revision: current.revision + 1,
        inventory,
        copies,
        receipts: [...current.receipts, receipt],
      });
    });
    return operationResult(state, command.key);
  };
}

/** Purchase and reveal are a single durable economic intent, never two client requests. */
export class BuyAndOpenCocoaToadUseCase {
  constructor(
    private readonly games: GameTransactions,
    private readonly configuration: () => OpeningConfiguration,
    private readonly random: RandomTickets,
  ) {}
  execute = async (
    playerId: string,
    command: OperationCommand<BuyOpenToadRequest>,
  ): Promise<OperationResult> => {
    if (!validDomainId(command.key) || command.key.length > 100)
      throw new ArcanaError('INVALID_OPERATION');
    const state = await this.games.transact(playerId, (current) => {
      checkPlayer(current, playerId);
      const prior = current.receipts.find((receipt) => receipt.id === command.key);
      if (prior) {
        if (
          prior.kind !== 'buy-open-toad' ||
          prior.request.priceVersion !== command.request.priceVersion ||
          prior.request.catalogVersion !== command.request.catalogVersion ||
          prior.request.tableVersion !== command.request.tableVersion
        )
          throw new ArcanaError('OPERATION_CONFLICT');
        return current;
      }
      checkRevision(current, command.expectedRevision);
      const configuration = this.configuration();
      validateToadTable(configuration.catalog, configuration.table);
      if (
        configuration.catalog.version !== command.request.catalogVersion ||
        configuration.table.version !== command.request.tableVersion
      )
        throw new ArcanaError('STALE_TABLE');
      const bought = purchaseProduct(
        current.inventory,
        configuration.shop,
        { product: 'cacao-toad', quantity: 1, priceVersion: command.request.priceVersion },
        command.key,
      );
      const unitId = `${command.key}:0`;
      const inventory = consumeToad(bought, unitId, command.key);
      // Every spending/version/unit precondition precedes the random ticket.
      const wizard = drawWizard(configuration.catalog, configuration.table, this.random);
      const copyId = `${command.key}:copy`;
      const copies = acquireWizard(
        current.copies,
        copyId,
        wizard,
        configuration.catalog.version,
        command.key,
        'toad',
      );
      const receipt: BuyOpenToadReceipt = {
        id: command.key,
        kind: 'buy-open-toad',
        request: { ...command.request },
        unitId,
        spentCrowns: current.inventory.crowns - inventory.crowns,
        wizard,
        copyId,
        isNew: !current.copies.some((copy) => copy.wizard.id === wizard.id),
      };
      return gameSnapshot({
        ...current,
        revision: current.revision + 1,
        inventory,
        copies,
        receipts: [...current.receipts, receipt],
      });
    });
    return operationResult(state, command.key);
  };
}
