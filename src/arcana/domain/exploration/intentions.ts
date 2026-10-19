import type { Affinity } from '../combat/synergies';
import { BOND_GROUPS, type BondGroup } from '../combat/bonds';
import { HOUSES, type House } from '../collection/traits';
import { ArcanaError } from '../errors';
import { validDomainId } from '../identifiers';

export type CompanyIntentionChoice =
  | { readonly kind: 'company'; readonly focus: 'house'; readonly house: House }
  | { readonly kind: 'company'; readonly focus: 'bond'; readonly group: BondGroup };
export type IntentionChoice =
  | { readonly kind: 'new-companion'; readonly wizardId: string }
  | { readonly kind: 'synergy'; readonly affinity: Exclude<Affinity, 'neutral'> }
  | { readonly kind: 'bean' }
  | CompanyIntentionChoice;

/** A voluntary plan, never a reward entitlement. Completion comes from committed combat evidence. */
export interface ExpeditionIntention {
  readonly version: 1 | 2;
  readonly afterRunId: string;
  readonly runId: string | null;
  readonly choice: IntentionChoice;
}
export function intentionChoiceSnapshot(value: IntentionChoice): IntentionChoice {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new ArcanaError('INVALID_OPERATION');
  if (value.kind === 'bean' && Object.keys(value).length === 1)
    return Object.freeze({ kind: 'bean' });
  if (value.kind === 'company' && Object.keys(value).length === 3) {
    if (value.focus === 'house' && HOUSES.includes(value.house))
      return Object.freeze({ kind: 'company', focus: 'house', house: value.house });
    if (value.focus === 'bond' && BOND_GROUPS.includes(value.group))
      return Object.freeze({ kind: 'company', focus: 'bond', group: value.group });
  }
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
    (value.version !== 1 && value.version !== 2) ||
    (value.version === 2) !== (value.choice?.kind === 'company') ||
    !validDomainId(value.afterRunId) ||
    (value.runId !== null && (!validDomainId(value.runId) || value.runId === value.afterRunId))
  )
    throw new ArcanaError('INVALID_OPERATION');
  return Object.freeze({
    version: value.version,
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
    (a.kind === 'company' &&
      b.kind === 'company' &&
      a.focus === b.focus &&
      ((a.focus === 'house' && b.focus === 'house' && a.house === b.house) ||
        (a.focus === 'bond' && b.focus === 'bond' && a.group === b.group))) ||
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
