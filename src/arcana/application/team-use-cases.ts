import { acquireWizard, validateCatalog, type WizardCatalog } from '../domain/collection/wizards';
import { EMPTY_TEAM, equipItem, selectTeam } from '../domain/collection/team';
import { starterEquipment } from '../domain/economy/equipment';
import { createInventory, inventorySnapshot } from '../domain/economy/inventory';
import { runSnapshot, type Run, type RunMember } from '../domain/exploration/run';
import { ArcanaError } from '../domain/errors';
import { validDomainId } from '../domain/identifiers';
import {
  checkPlayer,
  checkRevision,
  gameSnapshot,
  operationResult,
  type PlayerAccounts,
  type GameTransactions,
  type GameState,
  type OperationCommand,
  type OperationResult,
} from './game';
import type { AuthorityClock } from './authority-ports';
import type { CampaignConfiguration } from './run-use-cases';
import type {
  SetTeamRequest,
  EquipEquipmentRequest,
  StarterKitReceipt,
  TeamReceipt,
} from './team-contracts';
import { prepareOwnedUnit, refreshRunEquipment } from './prepare-team';
export interface StarterConfiguration {
  readonly catalog: WizardCatalog;
  readonly apprenticeId: string;
}
export class InitializePlayerUseCase {
  constructor(
    private readonly accounts: PlayerAccounts,
    private readonly configuration: () => StarterConfiguration,
    private readonly clock: AuthorityClock,
  ) {}
  execute = async (playerId: string): Promise<GameState> => {
    if (!validDomainId(playerId)) throw new ArcanaError('INVALID_KIT');
    try {
      const current = await this.accounts.read(playerId);
      checkPlayer(current, playerId);
      return current;
    } catch (error) {
      if (!(error instanceof ArcanaError) || error.code !== 'PLAYER_NOT_FOUND') throw error;
    }
    const configuration = this.configuration();
    validateCatalog(configuration.catalog);
    const wizard = configuration.catalog.wizards.find((w) => w.id === configuration.apprenticeId);
    if (!wizard || wizard.name.es !== 'Aprendiz de Alquimia') throw new ArcanaError('INVALID_KIT');
    const now = await this.clock.now(),
      copyId = 'starter:apprentice',
      equipment = starterEquipment();
    const receipt: StarterKitReceipt = {
      id: 'starter-kit',
      kind: 'starter-kit',
      catalogVersion: configuration.catalog.version,
      copyId,
      wizard,
      equipmentIds: equipment.map((item) => item.id),
    };
    return this.accounts.create(
      gameSnapshot({
        schemaVersion: 1,
        playerId,
        revision: 1,
        inventory: inventorySnapshot({ ...createInventory(now), equipment }),
        copies: acquireWizard(
          [],
          copyId,
          wizard,
          configuration.catalog.version,
          'starter-kit',
          'starter',
        ),
        team: {
          copyIds: [copyId],
          loadouts: [{ copyId, wandId: 'starter:wand', broomId: 'starter:broom' }],
        },
        receipts: [receipt],
      }),
    );
  };
}
const sameIds = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((id, i) => id === b[i]);
function selectRun(
  current: GameState,
  configuration: CampaignConfiguration,
  copyIds: readonly string[],
): Run | null {
  const run = current.exploration?.run;
  if (!run || run.status !== 'active') return null;
  if (run.campaignVersion !== configuration.version || run.zoneId !== configuration.zoneId)
    throw new ArcanaError('STALE_CAMPAIGN');
  const temporary = run.members.filter((m) => m.source === 'temporary');
  if (copyIds.length + temporary.length < 1 || copyIds.length + temporary.length > 5)
    throw new ArcanaError('INVALID_FORMATION');
  const known = [...run.members, ...(run.reserves ?? [])].filter((m) => m.source === 'owned');
  const members: RunMember[] = copyIds.map((id) => {
    const previous = known.find((m) => m.unit.id === id);
    if (previous) return previous;
    const copy = current.copies.find((c) => c.copyId === id)!;
    return { source: 'owned', unit: prepareOwnedUnit(copy, configuration, current) };
  });
  if (![...members, ...temporary].some((m) => m.unit.hp > 0))
    throw new ArcanaError('INVALID_FORMATION');
  return refreshRunEquipment(
    runSnapshot({
      ...run,
      members: [...members, ...temporary],
      reserves: known.filter((m) => !copyIds.includes(m.unit.id)),
    }),
    current,
    current.team ?? EMPTY_TEAM,
  );
}
export class SetTeamUseCase {
  constructor(
    private readonly games: GameTransactions,
    private readonly configuration: () => CampaignConfiguration,
  ) {}
  execute = async (
    playerId: string,
    command: OperationCommand<SetTeamRequest>,
  ): Promise<OperationResult> => {
    if (!validDomainId(command.key) || !command.request || !Array.isArray(command.request.copyIds))
      throw new ArcanaError('INVALID_OPERATION');
    const state = await this.games.transact(playerId, (current) => {
      checkPlayer(current, playerId);
      const prior = current.receipts.find((r) => r.id === command.key);
      if (prior) {
        if (prior.kind !== 'set-team' || !sameIds(prior.request.copyIds, command.request.copyIds))
          throw new ArcanaError('OPERATION_CONFLICT');
        return current;
      }
      checkRevision(current, command.expectedRevision);
      const team = selectTeam(
        current.team ?? EMPTY_TEAM,
        command.request.copyIds,
        current.copies.map((c) => c.copyId),
        current.inventory.equipment ?? [],
      );
      const next = { ...current, team },
        active = current.exploration?.run?.status === 'active';
      const run = active ? selectRun(next, this.configuration(), team.copyIds) : null;
      const receipt: TeamReceipt = {
        id: command.key,
        kind: 'set-team',
        request: { copyIds: [...command.request.copyIds] },
        team,
        run,
      };
      return gameSnapshot({
        ...next,
        revision: current.revision + 1,
        ...(run ? { exploration: { ...current.exploration!, run } } : {}),
        receipts: [...current.receipts, receipt],
      });
    });
    return operationResult(state, command.key);
  };
}
export class EquipEquipmentUseCase {
  constructor(private readonly games: GameTransactions) {}
  execute = async (
    playerId: string,
    command: OperationCommand<EquipEquipmentRequest>,
  ): Promise<OperationResult> => {
    const request = command.request;
    if (
      !validDomainId(command.key) ||
      !request ||
      !validDomainId(request.copyId) ||
      !['wand', 'broom'].includes(request.slot) ||
      (request.equipmentId !== null && !validDomainId(request.equipmentId))
    )
      throw new ArcanaError('INVALID_OPERATION');
    const state = await this.games.transact(playerId, (current) => {
      checkPlayer(current, playerId);
      const prior = current.receipts.find((r) => r.id === command.key);
      if (prior) {
        if (
          prior.kind !== 'equip-equipment' ||
          prior.request.copyId !== request.copyId ||
          prior.request.slot !== request.slot ||
          prior.request.equipmentId !== request.equipmentId
        )
          throw new ArcanaError('OPERATION_CONFLICT');
        return current;
      }
      checkRevision(current, command.expectedRevision);
      const team = equipItem(
        current.team ?? EMPTY_TEAM,
        request.copyId,
        request.slot,
        request.equipmentId,
        current.copies.map((c) => c.copyId),
        current.inventory.equipment ?? [],
      );
      const run =
        current.exploration?.run?.status === 'active'
          ? refreshRunEquipment(current.exploration.run, current, team)
          : null;
      const receipt: TeamReceipt = {
        id: command.key,
        kind: 'equip-equipment',
        request: { ...request },
        team,
        run,
      };
      return gameSnapshot({
        ...current,
        team,
        revision: current.revision + 1,
        ...(run ? { exploration: { ...current.exploration!, run } } : {}),
        receipts: [...current.receipts, receipt],
      });
    });
    return operationResult(state, command.key);
  };
}
