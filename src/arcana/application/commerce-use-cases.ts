import {
  forgeWand,
  openVault,
  type CommerceCatalogs,
  type ForgeWandRequest,
  type OpenVaultRequest,
} from '../domain/economy/commerce';
import type { RandomTickets } from '../domain/combat/random';
import { ArcanaError } from '../domain/errors';
import { validDomainId } from '../domain/identifiers';
import {
  checkPlayer,
  checkRevision,
  gameSnapshot,
  operationResult,
  type GameTransactions,
  type OperationCommand,
  type OperationResult,
} from './game';
import type { ForgeReceipt, VaultReceipt } from './commerce-contracts';
export class ForgeWandUseCase {
  constructor(
    private readonly games: GameTransactions,
    private readonly configuration: () => CommerceCatalogs,
  ) {}
  execute = async (
    playerId: string,
    command: OperationCommand<ForgeWandRequest>,
  ): Promise<OperationResult> => {
    if (!validDomainId(command.key) || command.key.length > 100)
      throw new ArcanaError('INVALID_OPERATION');
    const state = await this.games.transact(playerId, (current) => {
      checkPlayer(current, playerId);
      const prior = current.receipts.find((r) => r.id === command.key);
      if (prior) {
        if (
          prior.kind !== 'forge-wand' ||
          prior.request.recipeId !== command.request.recipeId ||
          prior.request.catalogVersion !== command.request.catalogVersion
        )
          throw new ArcanaError('OPERATION_CONFLICT');
        return current;
      }
      checkRevision(current, command.expectedRevision);
      const result = forgeWand(
        current.inventory,
        this.configuration().forge,
        command.request,
        command.key,
      );
      const receipt: ForgeReceipt = {
        id: command.key,
        kind: 'forge-wand',
        request: { ...command.request },
        spentCrowns: result.spentCrowns,
        equipment: result.equipment,
      };
      return gameSnapshot({
        ...current,
        revision: current.revision + 1,
        inventory: result.inventory,
        receipts: [...current.receipts, receipt],
      });
    });
    return operationResult(state, command.key);
  };
}
export class OpenObsidianVaultUseCase {
  constructor(
    private readonly games: GameTransactions,
    private readonly configuration: () => CommerceCatalogs,
    private readonly random: RandomTickets,
  ) {}
  execute = async (
    playerId: string,
    command: OperationCommand<OpenVaultRequest>,
  ): Promise<OperationResult> => {
    if (!validDomainId(command.key) || command.key.length > 100)
      throw new ArcanaError('INVALID_OPERATION');
    const state = await this.games.transact(playerId, (current) => {
      checkPlayer(current, playerId);
      const prior = current.receipts.find((r) => r.id === command.key);
      if (prior) {
        if (
          prior.kind !== 'open-vault' ||
          prior.request.tableVersion !== command.request.tableVersion
        )
          throw new ArcanaError('OPERATION_CONFLICT');
        return current;
      }
      checkRevision(current, command.expectedRevision);
      const result = openVault(
        current.inventory,
        this.configuration().vault,
        command.request,
        command.key,
        this.random,
      );
      const receipt: VaultReceipt = {
        id: command.key,
        kind: 'open-vault',
        request: { ...command.request },
        spentKeys: 1,
        entryId: result.entryId,
        reward: result.reward,
        equipment: result.equipment,
      };
      return gameSnapshot({
        ...current,
        revision: current.revision + 1,
        inventory: result.inventory,
        receipts: [...current.receipts, receipt],
      });
    });
    return operationResult(state, command.key);
  };
}
