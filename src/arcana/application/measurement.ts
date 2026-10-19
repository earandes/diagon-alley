/** Offline, explicitly sourced measurement. It never writes player state or captures runtime data. */
interface ObservationBase {
  readonly id: string;
  readonly owner: string;
  /** Reliable server/study time, milliseconds UTC; never inferred from receipt order. */
  readonly at: number;
}
export type JourneyObservation = ObservationBase &
  (
    | {
        readonly kind: 'loaded';
        readonly newPlayer: boolean;
        readonly followup: boolean;
        readonly firstSessionComplete: boolean;
      }
    | { readonly kind: 'battle-confirmed'; readonly receiptId: string }
    | {
        readonly kind: 'result-usable';
        readonly receiptId: string;
        readonly mode: 'replay' | 'skip' | 'fallback';
      }
    | { readonly kind: 'action'; readonly deliberate: boolean; readonly prompted: boolean }
    | {
        readonly kind: 'run-plan';
        readonly runId: string;
        readonly eligibleAtStart: boolean;
        readonly ended: boolean;
        readonly evidenced: boolean;
      }
    | {
        readonly kind: 'integrity-incident';
        readonly caseId: string;
        readonly confirmed: boolean;
        readonly category: 'loss' | 'duplication' | 'cross-owner' | 'unrecoverable';
      }
    | {
        readonly kind: 'latency';
        readonly action: string;
        readonly status: 'usable' | 'error' | 'timeout';
        readonly elapsedMs?: number;
      }
  );
interface Options {
  readonly asOf: number;
  /** One declared effective-version cohort per input batch; never pool incompatible content. */
  readonly cohort: string;
  readonly origin: 'fixture' | 'technical' | 'human';
  readonly sessionGapMinutes?: 15 | 30 | 60;
}
interface LatencySummary {
  usable: number;
  errors: number;
  timeouts: number;
  missingDuration: number;
  p50Ms: number | null;
  p95Ms: number | null;
  maxMs: number | null;
}
const hour = 3_600_000;
const signature = (event: JourneyObservation) => JSON.stringify(event, Object.keys(event).sort());
const quantile = (values: number[], q: number) =>
  values.length ? values[Math.ceil(q * values.length) - 1] : null;

/** Inputs are an already authorized study export, not client claims of economic authority. */
export function measureJourney(input: readonly JourneyObservation[], options: Options) {
  if (!Number.isFinite(options.asOf) || options.asOf < 0) throw Error('INVALID_MEASUREMENT_CLOCK');
  if (!options.cohort.trim()) throw Error('MISSING_MEASUREMENT_COHORT');
  const quality = {
    duplicateEvents: 0,
    conflictingEvents: 0,
    conflictingPlans: 0,
    invalidEvents: 0,
    orphanResults: 0,
  };
  const unique = new Map<string, JourneyObservation>();
  const conflicts = new Set<string>();
  for (const event of input) {
    if (
      !event.id ||
      !event.owner ||
      !Number.isFinite(event.at) ||
      event.at < 0 ||
      event.at > options.asOf ||
      (event.kind === 'latency' &&
        event.elapsedMs !== undefined &&
        (!Number.isFinite(event.elapsedMs) || event.elapsedMs < 0))
    ) {
      quality.invalidEvents++;
      continue;
    }
    const prior = unique.get(event.id);
    if (prior) {
      if (signature(prior) === signature(event)) quality.duplicateEvents++;
      else conflicts.add(event.id);
    } else unique.set(event.id, event);
  }
  quality.conflictingEvents = conflicts.size;
  const events = [...unique.values()]
    .filter((event) => !conflicts.has(event.id))
    .sort((a, b) => a.at - b.at);
  const byOwner = new Map<string, JourneyObservation[]>();
  for (const event of events)
    byOwner.set(event.owner, [...(byOwner.get(event.owner) ?? []), event]);
  const activation = { eligible: 0, activated: 0, unknown: 0 };
  const return24h7d = { mature: 0, returned: 0, immature: 0, untracked: 0 };
  const gap = (options.sessionGapMinutes ?? 30) * 60_000;
  for (const owned of byOwner.values()) {
    const confirmed = new Map<string, number>();
    for (const event of owned) {
      if (event.kind === 'battle-confirmed' && !confirmed.has(event.receiptId))
        confirmed.set(event.receiptId, event.at);
      if (
        event.kind === 'result-usable' &&
        (!confirmed.has(event.receiptId) || confirmed.get(event.receiptId)! > event.at)
      )
        quality.orphanResults++;
    }
    const first = owned.find(
      (event): event is Extract<JourneyObservation, { kind: 'loaded' }> =>
        event.kind === 'loaded' && event.newPlayer,
    );
    if (!first) continue;
    activation.eligible++;
    let lastActivity = first.at;
    let activatedAt: number | undefined;
    for (const event of owned) {
      if (event.at < first.at) continue;
      if (event.at - lastActivity > gap) break;
      if ((event.kind === 'action' && event.deliberate) || event.kind === 'battle-confirmed')
        lastActivity = event.at;
      if (
        event.kind === 'result-usable' &&
        confirmed.has(event.receiptId) &&
        confirmed.get(event.receiptId)! >= first.at &&
        confirmed.get(event.receiptId)! <= event.at
      ) {
        activatedAt = event.at;
        break;
      }
    }
    if (activatedAt === undefined) {
      if (!first.firstSessionComplete) activation.unknown++;
      continue;
    }
    activation.activated++;
    if (!first.followup) {
      return24h7d.untracked++;
      continue;
    }
    if (options.asOf - activatedAt < 168 * hour) {
      return24h7d.immature++;
      continue;
    }
    return24h7d.mature++;
    if (
      owned.some(
        (event) =>
          event.kind === 'action' &&
          event.deliberate &&
          !event.prompted &&
          event.at >= activatedAt + 24 * hour &&
          event.at <= activatedAt + 168 * hour,
      )
    )
      return24h7d.returned++;
  }
  const plans = { ended: 0, evidenced: 0, active: 0 };
  const runs = new Map<string, Extract<JourneyObservation, { kind: 'run-plan' }>>();
  const conflictingRuns = new Set<string>();
  for (const event of events)
    if (event.kind === 'run-plan') {
      const key = `${event.owner}\0${event.runId}`;
      const prior = runs.get(key);
      if (
        prior &&
        (prior.eligibleAtStart !== event.eligibleAtStart ||
          (prior.ended && !event.ended) ||
          (prior.evidenced && !event.evidenced))
      )
        conflictingRuns.add(key);
      runs.set(key, event);
    }
  quality.conflictingPlans = conflictingRuns.size;
  for (const [key, run] of runs) {
    if (conflictingRuns.has(key)) continue;
    if (!run.eligibleAtStart) continue;
    if (!run.ended) {
      plans.active++;
      continue;
    }
    plans.ended++;
    if (run.evidenced) plans.evidenced++;
  }
  const latency: Record<string, LatencySummary> = Object.create(null);
  const integrityCases = new Set<string>();
  for (const event of events)
    if (event.kind === 'integrity-incident' && event.confirmed)
      integrityCases.add(`${event.owner}\0${event.caseId}`);
  const timings = new Map<string, number[]>();
  for (const event of events) {
    if (event.kind !== 'latency') continue;
    const summary = (latency[event.action] ??= {
      usable: 0,
      errors: 0,
      timeouts: 0,
      missingDuration: 0,
      p50Ms: null,
      p95Ms: null,
      maxMs: null,
    });
    if (event.status === 'error') summary.errors++;
    else if (event.status === 'timeout') summary.timeouts++;
    else {
      summary.usable++;
      if (event.elapsedMs === undefined) summary.missingDuration++;
      else timings.set(event.action, [...(timings.get(event.action) ?? []), event.elapsedMs]);
    }
  }
  for (const [action, values] of timings) {
    values.sort((a, b) => a - b);
    Object.assign(latency[action], {
      p50Ms: quantile(values, 0.5),
      p95Ms: quantile(values, 0.95),
      maxMs: values.at(-1)!,
    });
  }
  return {
    schemaVersion: 1 as const,
    origin: options.origin,
    cohort: options.cohort,
    asOf: options.asOf,
    sessionGapMinutes: options.sessionGapMinutes ?? 30,
    activation,
    return24h7d,
    plans,
    integrity: { confirmedCases: integrityCases.size },
    latency,
    quality,
  };
}
