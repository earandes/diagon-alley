import { ArcanaError } from '../domain/errors';
import { validDomainId } from '../domain/identifiers';
import {
  intentionChoiceSnapshot,
  intentionSnapshot,
  sameIntentionChoice,
  type ExpeditionIntention,
  type IntentionChoice,
} from '../domain/exploration/intentions';
import { canSelectIntention, type IntentionAvailability } from './client/expedition-intentions';
import {
  checkPlayer,
  checkRevision,
  gameSnapshot,
  operationResult,
  type GameTransactions,
  type OperationCommand,
  type OperationResult,
} from './game';

export interface SetIntentionRequest {
  readonly afterRunId: string;
  readonly choice: IntentionChoice | null;
}
export interface SetIntentionReceipt {
  readonly id: string;
  readonly kind: 'set-intention';
  readonly request: SetIntentionRequest;
  readonly intention: ExpeditionIntention | null;
}
export function intentionRequestSnapshot(value: SetIntentionRequest): SetIntentionRequest {
  if (!value || !validDomainId(value.afterRunId) || value.choice === undefined)
    throw new ArcanaError('INVALID_OPERATION');
  return Object.freeze({
    afterRunId: value.afterRunId,
    choice: value.choice === null ? null : intentionChoiceSnapshot(value.choice),
  });
}
export function intentionReceiptSnapshot(value: SetIntentionReceipt): SetIntentionReceipt {
  if (!value || value.kind !== 'set-intention' || !validDomainId(value.id))
    throw new ArcanaError('INVALID_OPERATION');
  const request = intentionRequestSnapshot(value.request);
  const intention = value.intention === null ? null : intentionSnapshot(value.intention);
  if (
    (request.choice === null) !== (intention === null) ||
    (intention &&
      (intention.runId !== null ||
        intention.afterRunId !== request.afterRunId ||
        !sameIntentionChoice(request.choice, intention.choice)))
  )
    throw new ArcanaError('INVALID_OPERATION');
  return Object.freeze({ id: value.id, kind: 'set-intention', request, intention });
}
/** Selecting a plan is an explicit durable operation with no inventory/reward side effects. */
export class SetIntentionUseCase {
  constructor(
    private readonly games: GameTransactions,
    private readonly configuration: () => IntentionAvailability,
  ) {}
  execute = async (
    playerId: string,
    command: OperationCommand<SetIntentionRequest>,
  ): Promise<OperationResult> => {
    if (!validDomainId(command.key)) throw new ArcanaError('INVALID_OPERATION');
    const request = intentionRequestSnapshot(command.request);
    const state = await this.games.transact(playerId, (current) => {
      checkPlayer(current, playerId);
      const prior = current.receipts.find((receipt) => receipt.id === command.key);
      if (prior) {
        if (
          prior.kind !== 'set-intention' ||
          prior.request.afterRunId !== request.afterRunId ||
          !sameIntentionChoice(prior.request.choice, request.choice)
        )
          throw new ArcanaError('OPERATION_CONFLICT');
        return current;
      }
      checkRevision(current, command.expectedRevision);
      const exploration = current.exploration;
      const run = exploration?.run;
      if (!exploration || !run) throw new ArcanaError('INVALID_OPERATION');
      if (request.choice === null) {
        if (!exploration.intention || exploration.intention.afterRunId !== request.afterRunId)
          throw new ArcanaError('INVALID_OPERATION');
      } else if (
        run.id !== request.afterRunId ||
        run.status === 'active' ||
        !canSelectIntention(current, this.configuration(), request.choice)
      )
        throw new ArcanaError('INVALID_OPERATION');
      const intention =
        request.choice === null
          ? null
          : intentionSnapshot({
              version: request.choice.kind === 'company' ? 2 : 1,
              afterRunId: request.afterRunId,
              runId: null,
              choice: request.choice,
            });
      const receipt: SetIntentionReceipt = {
        id: command.key,
        kind: 'set-intention',
        request,
        intention,
      };
      return gameSnapshot({
        ...current,
        revision: current.revision + 1,
        exploration: { ...exploration, intention },
        receipts: [...current.receipts, receipt],
      });
    });
    return operationResult(state, command.key);
  };
}
