import { ArcanaError } from '../domain/errors';
import { validDomainId } from '../domain/identifiers';
import { runSnapshot, type Run } from '../domain/exploration/run';
import {
  encounterTradeSnapshot,
  type EncounterTradeResolution,
} from '../domain/exploration/encounter-trades';
import {
  EMPTY_SEASONAL,
  SEASONAL_PREPARATION_OFFER,
  previewSeasonalPreparation,
  seasonalEditionSnapshot,
  seasonalGrantId,
  seasonalKeepsakeSnapshot,
  seasonalOpportunity,
  seasonalParticipationSnapshot,
  seasonalPhase,
  type SeasonalEdition,
  type SeasonalKeepsake,
  type SeasonalParticipation,
} from '../domain/seasonal/events';
import type { AuthorityClock } from './authority-ports';
import {
  checkPlayer,
  checkRevision,
  gameSnapshot,
  operationResult,
  type GameState,
  type GameTransactions,
  type OperationCommand,
  type OperationResult,
} from './game';
export interface SeasonalRequest {
  readonly editionId: string;
  readonly version: number;
  readonly action: 'join' | 'dispel' | 'prepare';
  readonly runId?: string;
}
export interface SeasonalReceipt {
  readonly id: string;
  readonly kind: 'seasonal-event';
  readonly request: SeasonalRequest;
  readonly participation: SeasonalParticipation;
  readonly keepsake: SeasonalKeepsake | null;
  readonly run: Run | null;
  readonly trade?: EncounterTradeResolution;
}
export function seasonalRequestSnapshot(value: unknown): SeasonalRequest {
  const r = value as SeasonalRequest;
  if (
    !r ||
    !validDomainId(r.editionId) ||
    !Number.isSafeInteger(r.version) ||
    r.version < 1 ||
    !['join', 'dispel', 'prepare'].includes(r.action) ||
    (r.runId !== undefined && !validDomainId(r.runId)) ||
    (r.action === 'join' && r.runId !== undefined) ||
    (r.action !== 'join' && r.runId === undefined)
  )
    throw new ArcanaError('INVALID_OPERATION');
  return Object.freeze({
    editionId: r.editionId,
    version: r.version,
    action: r.action,
    ...(r.runId === undefined ? {} : { runId: r.runId }),
  });
}
const sameRequest = (a: SeasonalRequest, b: SeasonalRequest) =>
  a.editionId === b.editionId &&
  a.version === b.version &&
  a.action === b.action &&
  a.runId === b.runId;
export function seasonalReceiptSnapshot(value: SeasonalReceipt): SeasonalReceipt {
  if (!value || value.kind !== 'seasonal-event' || !validDomainId(value.id))
    throw new ArcanaError('INVALID_OPERATION');
  const request = seasonalRequestSnapshot(value.request),
    participation = seasonalParticipationSnapshot(value.participation),
    keepsake = value.keepsake === null ? null : seasonalKeepsakeSnapshot(value.keepsake),
    run = value.run === null ? null : runSnapshot(value.run);
  if (
    request.editionId !== participation.edition.editionId ||
    request.version !== participation.edition.version ||
    (keepsake &&
      (keepsake.operationId !== value.id ||
        keepsake.id !== seasonalGrantId(participation.edition) ||
        keepsake.eventId !== participation.edition.eventId ||
        keepsake.editionId !== participation.edition.editionId ||
        keepsake.version !== participation.edition.version ||
        keepsake.grantedAt !== participation.opportunities.at(-1)?.at)) ||
    (participation.completedObjectiveIds.length === participation.edition.objectiveIds.length) !==
      (keepsake !== null) ||
    (request.action === 'join' &&
      (participation.opportunities.length ||
        keepsake ||
        value.trade ||
        (run?.status === 'active'
          ? participation.boundRunIds.length !== 1 || participation.boundRunIds[0] !== run.id
          : participation.boundRunIds.length !== 0))) ||
    (request.action !== 'join' &&
      (!run ||
        run.status !== 'active' ||
        run.id !== request.runId ||
        participation.opportunities.at(-1)?.runId !== run.id ||
        participation.opportunities.at(-1)?.visited !== run.visited.length ||
        participation.opportunities.at(-1)?.action !== request.action)) ||
    (request.action === 'prepare') !== (value.trade !== undefined)
  )
    throw new ArcanaError('INVALID_OPERATION');
  const trade = value.trade && run ? encounterTradeSnapshot(value.trade, run.members) : undefined;
  if (
    trade &&
    (JSON.stringify(trade.offer) !== JSON.stringify(SEASONAL_PREPARATION_OFFER) ||
      trade.choiceId !== 'window-team' ||
      trade.unitId !== undefined)
  )
    throw new ArcanaError('INVALID_OPERATION');
  return Object.freeze({
    id: value.id,
    kind: 'seasonal-event',
    request,
    participation,
    keepsake,
    run,
    ...(trade ? { trade } : {}),
  });
}
export class SeasonalEventUseCase {
  constructor(
    private readonly games: GameTransactions,
    private readonly configuration: () => SeasonalEdition,
    private readonly clock: AuthorityClock,
  ) {}
  execute = async (
    playerId: string,
    command: OperationCommand<SeasonalRequest>,
  ): Promise<OperationResult> => {
    if (!validDomainId(command.key)) throw new ArcanaError('INVALID_OPERATION');
    const request = seasonalRequestSnapshot(command.request);
    const replay = (state: GameState) => {
      const prior = state.receipts.find((r) => r.id === command.key);
      if (prior && (prior.kind !== 'seasonal-event' || !sameRequest(prior.request, request)))
        throw new ArcanaError('OPERATION_CONFLICT');
      return !!prior;
    };
    const observed = await this.games.read(playerId);
    checkPlayer(observed, playerId);
    if (replay(observed)) return operationResult(observed, command.key);
    const now = await this.clock.now();
    if (!Number.isSafeInteger(now) || now < 0) throw new ArcanaError('INVALID_TIME');
    const state = await this.games.transact(playerId, (current) => {
      checkPlayer(current, playerId);
      if (replay(current)) return current;
      checkRevision(current, command.expectedRevision);
      const seasonal = current.seasonal ?? EMPTY_SEASONAL;
      let participation = seasonal.participations.find(
          (p) => p.edition.editionId === request.editionId,
        ),
        run = current.exploration?.run ?? null,
        keepsake: SeasonalKeepsake | null = null,
        trade: EncounterTradeResolution | undefined;
      if (request.action === 'join') {
        const edition = seasonalEditionSnapshot(this.configuration());
        if (edition.editionId !== request.editionId || edition.version !== request.version)
          throw new ArcanaError('STALE_TABLE');
        if (
          seasonalPhase(edition, now) !== 'open' ||
          participation ||
          seasonal.participations.some(
            (p) =>
              p.completedObjectiveIds.length < p.edition.objectiveIds.length &&
              seasonalPhase(p.edition, now) !== 'closed',
          )
        )
          throw new ArcanaError('EVENT_UNAVAILABLE');
        participation = {
          edition,
          joinedAt: now,
          boundRunIds: run?.status === 'active' ? [run.id] : [],
          opportunities: [],
          completedObjectiveIds: [],
        };
      } else {
        if (!participation || participation.edition.version !== request.version)
          throw new ArcanaError('STALE_TABLE');
        if (!run || run.id !== request.runId) throw new ArcanaError('INVALID_ROUTE');
        if (
          now >= participation.edition.completionEndsAt ||
          now < participation.edition.startsAt ||
          !participation.boundRunIds.includes(run.id) ||
          participation.completedObjectiveIds.length === participation.edition.objectiveIds.length
        )
          throw new ArcanaError('EVENT_UNAVAILABLE');
        if (
          participation.opportunities.some(
            (o) => o.runId === run!.id && o.visited === run!.visited.length,
          )
        )
          throw new ArcanaError('EVENT_OPPORTUNITY_USED');
        if (!seasonalOpportunity(participation, run, now))
          throw new ArcanaError('EVENT_UNAVAILABLE');
        const objectiveId =
          request.action === 'dispel'
            ? participation.edition.objectiveIds[participation.completedObjectiveIds.length]
            : undefined;
        if (request.action === 'prepare') {
          const preview = previewSeasonalPreparation(run.members);
          if (!preview.eligible) throw new ArcanaError('EVENT_CONDITION');
          run = runSnapshot({ ...run, members: preview.members });
          trade = {
            offer: SEASONAL_PREPARATION_OFFER,
            choiceId: 'window-team',
            vitals: preview.vitals,
          };
        }
        participation = {
          ...participation,
          opportunities: [
            ...participation.opportunities,
            {
              runId: run.id,
              visited: run.visited.length,
              action: request.action,
              ...(objectiveId ? { objectiveId } : {}),
              at: now,
            },
          ],
          completedObjectiveIds: objectiveId
            ? [...participation.completedObjectiveIds, objectiveId]
            : participation.completedObjectiveIds,
        };
        if (
          participation.completedObjectiveIds.length === participation.edition.objectiveIds.length
        ) {
          keepsake = {
            id: seasonalGrantId(participation.edition),
            eventId: participation.edition.eventId,
            editionId: participation.edition.editionId,
            version: participation.edition.version,
            grantedAt: now,
            operationId: command.key,
          };
        }
      }
      const receipt: SeasonalReceipt = {
        id: command.key,
        kind: 'seasonal-event',
        request,
        participation,
        keepsake,
        run,
        ...(trade ? { trade } : {}),
      };
      return gameSnapshot({
        ...current,
        revision: current.revision + 1,
        seasonal: {
          participations: [
            ...seasonal.participations.filter((p) => p.edition.editionId !== request.editionId),
            participation,
          ],
          keepsakes: keepsake ? [...seasonal.keepsakes, keepsake] : seasonal.keepsakes,
        },
        ...(request.action === 'prepare' ? { exploration: { ...current.exploration!, run } } : {}),
        receipts: [...current.receipts, receipt],
      });
    });
    return operationResult(state, command.key);
  };
}
