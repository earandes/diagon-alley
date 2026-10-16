import { ArcanaError } from '../errors';
import { validDomainId } from '../identifiers';
import {
  encounterOfferSnapshot,
  previewEncounterTrade,
  type EncounterOffer,
} from '../exploration/encounter-trades';
import type { Run, RunMember } from '../exploration/run';

/** A versioned, deliberately small behaviour family, independent of presentation packs. */
export interface SeasonalEdition {
  readonly eventId: string;
  readonly editionId: string;
  readonly version: number;
  readonly timezone: string;
  readonly startsAt: number;
  readonly participationEndsAt: number;
  readonly completionEndsAt: number;
  readonly objectiveIds: readonly string[];
  readonly keepsakeId: string;
}
export interface SeasonalOpportunity {
  readonly runId: string;
  readonly visited: number;
  readonly action: 'dispel' | 'prepare';
  readonly objectiveId?: string;
  readonly at: number;
}
export interface SeasonalParticipation {
  readonly edition: SeasonalEdition;
  readonly joinedAt: number;
  readonly boundRunIds: readonly string[];
  readonly opportunities: readonly SeasonalOpportunity[];
  readonly completedObjectiveIds: readonly string[];
}
export interface SeasonalKeepsake {
  readonly id: string;
  readonly eventId: string;
  readonly editionId: string;
  readonly version: number;
  readonly grantedAt: number;
  readonly operationId: string;
}
export interface SeasonalState {
  readonly participations: readonly SeasonalParticipation[];
  readonly keepsakes: readonly SeasonalKeepsake[];
}
export const EMPTY_SEASONAL: SeasonalState = Object.freeze({
  participations: Object.freeze([]),
  keepsakes: Object.freeze([]),
});
const time = (n: number) => Number.isSafeInteger(n) && n >= 0;
const unique = (ids: readonly string[]) =>
  Array.isArray(ids) && ids.every(validDomainId) && new Set(ids).size === ids.length;
export function seasonalEditionSnapshot(value: unknown): SeasonalEdition {
  const e = value as SeasonalEdition;
  if (
    !e ||
    !validDomainId(e.eventId) ||
    !validDomainId(e.editionId) ||
    !validDomainId(e.keepsakeId) ||
    !validDomainId(`seasonal:${e.editionId}:${e.keepsakeId}`) ||
    !Number.isSafeInteger(e.version) ||
    e.version < 1 ||
    typeof e.timezone !== 'string' ||
    ![e.startsAt, e.participationEndsAt, e.completionEndsAt].every(time) ||
    e.startsAt >= e.participationEndsAt ||
    e.participationEndsAt > e.completionEndsAt ||
    !unique(e.objectiveIds) ||
    e.objectiveIds.length !== 3
  )
    throw new ArcanaError('INVALID_CAMPAIGN');
  try {
    new Intl.DateTimeFormat('en', { timeZone: e.timezone }).format(0);
  } catch {
    throw new ArcanaError('INVALID_CAMPAIGN');
  }
  return Object.freeze({
    eventId: e.eventId,
    editionId: e.editionId,
    version: e.version,
    timezone: e.timezone,
    startsAt: e.startsAt,
    participationEndsAt: e.participationEndsAt,
    completionEndsAt: e.completionEndsAt,
    objectiveIds: Object.freeze([...e.objectiveIds]),
    keepsakeId: e.keepsakeId,
  });
}
export function seasonalPhase(
  edition: SeasonalEdition,
  now: number,
): 'upcoming' | 'open' | 'grace' | 'closed' {
  if (!time(now)) throw new ArcanaError('INVALID_TIME');
  return now < edition.startsAt
    ? 'upcoming'
    : now < edition.participationEndsAt
      ? 'open'
      : now < edition.completionEndsAt
        ? 'grace'
        : 'closed';
}
export function seasonalParticipationSnapshot(value: unknown): SeasonalParticipation {
  const p = value as SeasonalParticipation;
  if (!p) throw new ArcanaError('INVALID_GAME');
  const edition = seasonalEditionSnapshot(p.edition);
  if (
    !time(p.joinedAt) ||
    seasonalPhase(edition, p.joinedAt) !== 'open' ||
    !unique(p.boundRunIds) ||
    !unique(p.completedObjectiveIds) ||
    p.completedObjectiveIds.some((id, i) => edition.objectiveIds[i] !== id) ||
    !Array.isArray(p.opportunities)
  )
    throw new ArcanaError('INVALID_GAME');
  const used = new Set<string>();
  let completed = 0;
  const opportunities = p.opportunities.map((o) => {
    const key = `${o?.runId}:${o?.visited}`;
    if (
      !o ||
      !p.boundRunIds.includes(o.runId) ||
      !Number.isSafeInteger(o.visited) ||
      o.visited < 2 ||
      !['dispel', 'prepare'].includes(o.action) ||
      completed >= edition.objectiveIds.length ||
      !time(o.at) ||
      o.at < p.joinedAt ||
      o.at >= edition.completionEndsAt ||
      used.has(key) ||
      (o.action === 'dispel'
        ? o.objectiveId !== edition.objectiveIds[completed++]
        : o.objectiveId !== undefined)
    )
      throw new ArcanaError('INVALID_GAME');
    used.add(key);
    return Object.freeze({
      runId: o.runId,
      visited: o.visited,
      action: o.action,
      ...(o.objectiveId === undefined ? {} : { objectiveId: o.objectiveId }),
      at: o.at,
    });
  });
  if (completed !== p.completedObjectiveIds.length) throw new ArcanaError('INVALID_GAME');
  return Object.freeze({
    edition,
    joinedAt: p.joinedAt,
    boundRunIds: Object.freeze([...p.boundRunIds]),
    opportunities: Object.freeze(opportunities),
    completedObjectiveIds: Object.freeze([...p.completedObjectiveIds]),
  });
}
export function seasonalKeepsakeSnapshot(value: unknown): SeasonalKeepsake {
  const k = value as SeasonalKeepsake;
  if (
    !k ||
    ![k.id, k.eventId, k.editionId, k.operationId].every(validDomainId) ||
    !Number.isSafeInteger(k.version) ||
    k.version < 1 ||
    !time(k.grantedAt)
  )
    throw new ArcanaError('INVALID_GAME');
  return Object.freeze({
    id: k.id,
    eventId: k.eventId,
    editionId: k.editionId,
    version: k.version,
    grantedAt: k.grantedAt,
    operationId: k.operationId,
  });
}
export function seasonalStateSnapshot(value: unknown): SeasonalState {
  const s = value as SeasonalState;
  if (!s || !Array.isArray(s.participations) || !Array.isArray(s.keepsakes))
    throw new ArcanaError('INVALID_GAME');
  const participations = s.participations.map(seasonalParticipationSnapshot),
    keepsakes = s.keepsakes.map(seasonalKeepsakeSnapshot);
  if (
    new Set(participations.map((p) => p.edition.editionId)).size !== participations.length ||
    new Set(keepsakes.map((k) => k.id)).size !== keepsakes.length
  )
    throw new ArcanaError('INVALID_GAME');
  for (const p of participations) {
    const grants = keepsakes.filter((k) => k.editionId === p.edition.editionId);
    if (
      grants.length !== (p.completedObjectiveIds.length === p.edition.objectiveIds.length ? 1 : 0)
    )
      throw new ArcanaError('INVALID_GAME');
    if (
      grants.some(
        (k) =>
          k.id !== seasonalGrantId(p.edition) ||
          k.eventId !== p.edition.eventId ||
          k.version !== p.edition.version ||
          k.grantedAt !== p.opportunities.at(-1)?.at,
      )
    )
      throw new ArcanaError('INVALID_GAME');
  }
  if (keepsakes.some((k) => !participations.some((p) => p.edition.editionId === k.editionId)))
    throw new ArcanaError('INVALID_GAME');
  return Object.freeze({
    participations: Object.freeze(participations),
    keepsakes: Object.freeze(keepsakes),
  });
}
export function seasonalGrantId(edition: SeasonalEdition): string {
  return `seasonal:${edition.editionId}:${edition.keepsakeId}`;
}
export function seasonalOpportunity(
  participation: SeasonalParticipation,
  run: Run | null | undefined,
  now: number,
): boolean {
  return (
    !!run &&
    run.status === 'active' &&
    run.visited.length >= 2 &&
    participation.boundRunIds.includes(run.id) &&
    participation.completedObjectiveIds.length < participation.edition.objectiveIds.length &&
    now >= participation.edition.startsAt &&
    now < participation.edition.completionEndsAt &&
    !participation.opportunities.some((o) => o.runId === run.id && o.visited === run.visited.length)
  );
}
/** Uses the existing healer exchange exactly. A v1 edition keeps these mechanics forever. */
export const SEASONAL_PREPARATION_OFFER: EncounterOffer = encounterOfferSnapshot({
  id: 'window-healer-v1',
  npcId: 'healer',
  kind: 'healer',
  options: Object.freeze([
    { id: 'window-team', scope: 'team', restore: 'hp', fraction: 0.25, costFraction: 0.1 },
    { id: 'window-unit', scope: 'unit', restore: 'hp', fraction: 0.25, costFraction: 0.1 },
  ] as const),
});
export function previewSeasonalPreparation(members: readonly RunMember[]) {
  return previewEncounterTrade(members, SEASONAL_PREPARATION_OFFER, 'window-team');
}
/** No binding during grace, and no rewriting an already admitted edition snapshot. */
export function bindSeasonalRun(state: SeasonalState, runId: string, now: number): SeasonalState {
  if (!validDomainId(runId)) throw new ArcanaError('INVALID_ROUTE');
  const participations = state.participations.map((p) =>
    seasonalPhase(p.edition, now) === 'open' &&
    p.completedObjectiveIds.length < p.edition.objectiveIds.length &&
    !p.boundRunIds.includes(runId)
      ? { ...p, boundRunIds: [...p.boundRunIds, runId] }
      : p,
  );
  return seasonalStateSnapshot({ ...state, participations });
}
