import type { Affinity } from '../combat/synergies';
import { ArcanaError } from '../errors';
import { validDomainId } from '../identifiers';

export type IntentionChoice =
  | { readonly kind: 'new-companion'; readonly wizardId: string }
  | { readonly kind: 'synergy'; readonly affinity: Exclude<Affinity, 'neutral'> }
  | { readonly kind: 'bean' };

/** A voluntary plan, never a reward entitlement. Completion comes from committed combat evidence. */
export interface ExpeditionIntention {
  readonly version: 1;
  readonly afterRunId: string;
  readonly runId: string | null;
  readonly choice: IntentionChoice;
}
export function intentionChoiceSnapshot(value: IntentionChoice): IntentionChoice {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new ArcanaError('INVALID_OPERATION');
  if (value.kind === 'bean' && Object.keys(value).length === 1)
    return Object.freeze({ kind: 'bean' });
  if (
    value.kind === 'new-companion' &&
    validDomainId(value.wizardId) &&
    Object.keys(value).length === 2
  )
    return Object.freeze({ kind: 'new-companion', wizardId: value.wizardId });
  if (
    value.kind === 'synergy' &&
    ['alchemy', 'fire', 'shadows'].includes(value.affinity) &&
    Object.keys(value).length === 2
  )
    return Object.freeze({ kind: 'synergy', affinity: value.affinity });
  throw new ArcanaError('INVALID_OPERATION');
}
export function intentionSnapshot(value: ExpeditionIntention): ExpeditionIntention {
  if (
    !value ||
    value.version !== 1 ||
    !validDomainId(value.afterRunId) ||
    (value.runId !== null && (!validDomainId(value.runId) || value.runId === value.afterRunId))
  )
    throw new ArcanaError('INVALID_OPERATION');
  return Object.freeze({
    version: 1,
    afterRunId: value.afterRunId,
    runId: value.runId,
    choice: intentionChoiceSnapshot(value.choice),
  });
}
export function sameIntentionChoice(a: IntentionChoice | null, b: IntentionChoice | null): boolean {
  if (a === null || b === null) return a === b;
  if (a.kind !== b.kind) return false;
  return (
    a.kind === 'bean' ||
    (a.kind === 'new-companion' && b.kind === 'new-companion' && a.wizardId === b.wizardId) ||
    (a.kind === 'synergy' && b.kind === 'synergy' && a.affinity === b.affinity)
  );
}
/** Only the explicitly following expedition receives this plan. Attempts never silently repeat. */
export function bindIntention(
  value: ExpeditionIntention | null | undefined,
  previousRunId: string | undefined,
  runId: string,
): ExpeditionIntention | null {
  if (!value) return null;
  const intention = intentionSnapshot(value);
  if (intention.runId !== null || intention.afterRunId !== previousRunId) return null;
  return intentionSnapshot({ ...intention, runId });
}
