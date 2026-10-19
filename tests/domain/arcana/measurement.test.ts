import { describe, expect, it } from 'vitest';
import {
  measureJourney,
  type JourneyObservation,
} from '../../../src/arcana/application/measurement';

const hour = 3_600_000;
const loaded = (owner: string, at = 0): Extract<JourneyObservation, { kind: 'loaded' }> => ({
  id: `loaded-${owner}`,
  owner,
  at,
  kind: 'loaded',
  newPlayer: true,
  followup: true,
  firstSessionComplete: true,
});
const resolved = (
  owner: string,
  at = 1,
): Extract<JourneyObservation, { kind: 'battle-confirmed' }> => ({
  id: `resolved-${owner}`,
  owner,
  at,
  kind: 'battle-confirmed',
  receiptId: 'battle',
});
const usable = (owner: string, at = 2): Extract<JourneyObservation, { kind: 'result-usable' }> => ({
  id: `usable-${owner}`,
  owner,
  at,
  kind: 'result-usable',
  receiptId: 'battle',
  mode: 'skip',
});
describe('minimal journey measurement: synthetic observations, not player evidence', () => {
  it('deduplicates tabs, receipts and replay; requires confirmation for usable result', () => {
    const observations = [
      loaded('a'),
      resolved('a'),
      usable('a'),
      { ...usable('a'), id: 'replay-a' },
      loaded('b'),
      usable('b'),
    ];
    const report = measureJourney([...observations, observations[0]], {
      cohort: 'rules3-table4',
      asOf: 200 * hour,
      origin: 'fixture',
    });
    expect(report.activation).toEqual({ eligible: 2, activated: 1, unknown: 0 });
    expect(report.quality.duplicateEvents).toBe(1);
    expect(report.quality.orphanResults).toBe(1);
    expect(report.origin).toBe('fixture');
  });
  it('shows incomplete coverage and does not activate after first-session inactivity', () => {
    const report = measureJourney(
      [
        loaded('a'),
        resolved('a', hour),
        usable('a', hour + 1),
        { ...loaded('b'), firstSessionComplete: false },
      ],
      { cohort: 'rules3-table4', asOf: 200 * hour, origin: 'fixture' },
    );
    expect(report.activation).toEqual({ eligible: 2, activated: 0, unknown: 1 });
  });
  it('keeps immature and untracked cohorts separate; excludes technical or prompted returns', () => {
    const report = measureJourney(
      [
        loaded('a'),
        resolved('a'),
        usable('a'),
        loaded('b', 100 * hour),
        resolved('b', 100 * hour + 1),
        usable('b', 100 * hour + 2),
        { ...loaded('c'), followup: false },
        resolved('c'),
        usable('c'),
        {
          id: 'return',
          owner: 'a',
          at: 25 * hour,
          kind: 'action',
          deliberate: true,
          prompted: false,
        },
        {
          id: 'poll',
          owner: 'b',
          at: 125 * hour,
          kind: 'action',
          deliberate: false,
          prompted: false,
        },
      ],
      { cohort: 'rules3-table4', asOf: 200 * hour, origin: 'fixture' },
    );
    expect(report.return24h7d).toEqual({ mature: 1, returned: 1, immature: 1, untracked: 1 });
  });
  it('counts ended failed intentions and censors active expeditions without inventing rewards', () => {
    const report = measureJourney(
      [
        {
          id: 'r1',
          owner: 'a',
          at: 1,
          kind: 'run-plan',
          runId: 'r1',
          eligibleAtStart: true,
          ended: true,
          evidenced: true,
        },
        {
          id: 'r2',
          owner: 'a',
          at: 2,
          kind: 'run-plan',
          runId: 'r2',
          eligibleAtStart: true,
          ended: true,
          evidenced: false,
        },
        {
          id: 'r3',
          owner: 'a',
          at: 3,
          kind: 'run-plan',
          runId: 'r3',
          eligibleAtStart: true,
          ended: false,
          evidenced: false,
        },
      ],
      { cohort: 'rules3-table4', asOf: 10, origin: 'fixture' },
    );
    expect(report.plans).toEqual({ ended: 2, evidenced: 1, active: 1 });
  });
  it('rejects contradictory event ownership and future clocks rather than mixing identities', () => {
    const report = measureJourney(
      [loaded('a'), { ...loaded('b'), id: 'loaded-a' }, { ...loaded('c'), at: 999 }],
      { cohort: 'rules3-table4', asOf: 100, origin: 'fixture' },
    );
    expect(report.activation.eligible).toBe(0);
    expect(report.quality.conflictingEvents).toBe(1);
    expect(report.quality.invalidEvents).toBe(1);
  });
  it('reports latency quantiles separately from errors and missing observations', () => {
    const report = measureJourney(
      [
        {
          id: 'l1',
          owner: 'a',
          at: 1,
          kind: 'latency',
          action: 'battle',
          status: 'usable',
          elapsedMs: 100,
        },
        {
          id: 'l2',
          owner: 'a',
          at: 2,
          kind: 'latency',
          action: 'battle',
          status: 'usable',
          elapsedMs: 200,
        },
        { id: 'l3', owner: 'a', at: 3, kind: 'latency', action: 'battle', status: 'timeout' },
        { id: 'l4', owner: 'a', at: 4, kind: 'latency', action: 'battle', status: 'error' },
      ],
      { cohort: 'rules3-table4', asOf: 10, origin: 'fixture' },
    );
    expect(report.latency.battle).toEqual({
      usable: 2,
      errors: 1,
      timeouts: 1,
      missingDuration: 0,
      p50Ms: 100,
      p95Ms: 200,
      maxMs: 200,
    });
  });
  it('does not erase failed plans by changing eligibility after the run', () => {
    const report = measureJourney(
      [
        {
          id: 'start',
          owner: 'a',
          at: 1,
          kind: 'run-plan',
          runId: 'r',
          eligibleAtStart: true,
          ended: false,
          evidenced: false,
        },
        {
          id: 'end',
          owner: 'a',
          at: 2,
          kind: 'run-plan',
          runId: 'r',
          eligibleAtStart: false,
          ended: true,
          evidenced: false,
        },
      ],
      { cohort: 'rules3-table4', asOf: 10, origin: 'fixture' },
    );
    expect(report.quality.conflictingPlans).toBe(1);
    expect(report.plans.ended).toBe(0); // Excluded as contradictory, reported separately, never silently a success.
  });
  it('declares sensitivity to first-session gap and keeps the other owner result orphaned', () => {
    const input: JourneyObservation[] = [
      loaded('a'),
      resolved('a', 40 * 60_000),
      usable('a', 40 * 60_000 + 1),
      usable('other'),
    ];
    expect(
      measureJourney(input, {
        cohort: 'rules3-table4',
        asOf: hour,
        origin: 'technical',
        sessionGapMinutes: 30,
      }).activation.activated,
    ).toBe(0);
    const report = measureJourney(input, {
      cohort: 'rules3-table4',
      asOf: hour,
      origin: 'technical',
      sessionGapMinutes: 60,
    });
    expect(report.activation.activated).toBe(1);
    expect(report.quality.orphanResults).toBe(1);
    expect(report.return24h7d.immature).toBe(1);
  });
  it('counts confirmed integrity cases once without presenting unverified claims as incidents', () => {
    const report = measureJourney(
      [
        {
          id: 'incident-a',
          owner: 'a',
          at: 1,
          kind: 'integrity-incident',
          caseId: 'lost-response',
          confirmed: true,
          category: 'unrecoverable',
        },
        {
          id: 'incident-reported-again',
          owner: 'a',
          at: 2,
          kind: 'integrity-incident',
          caseId: 'lost-response',
          confirmed: true,
          category: 'unrecoverable',
        },
        {
          id: 'unverified',
          owner: 'a',
          at: 3,
          kind: 'integrity-incident',
          caseId: 'suspected',
          confirmed: false,
          category: 'loss',
        },
      ],
      { cohort: 'rules3-table4', asOf: 10, origin: 'fixture' },
    );
    expect(report.integrity.confirmedCases).toBe(1);
  });
});
