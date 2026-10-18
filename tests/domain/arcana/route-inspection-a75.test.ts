import { describe, expect, it } from 'vitest';
import { routeInspection } from '../../../src/arcana/presentation/route-inspection';
import { campaignFixture, runInitial } from './support/run-fixtures';
import type { Run } from '../../../src/arcana/domain/exploration/run';
import type { NodePlan } from '../../../src/arcana/domain/exploration/nodes';

const fixture = (): Run => {
  const campaign = campaignFixture();
  return {
    id: 'route-read-only',
    campaignVersion: campaign.version,
    zoneId: campaign.zoneId,
    graphVersion: 1,
    graph: {
      version: 1,
      nodes: [
        { id: 'a', row: 0, kind: 'pact', next: ['b', 'c'] },
        { id: 'b', row: 1, column: 0, kind: 'duel', next: ['boss'] },
        { id: 'c', row: 1, column: 1, kind: 'duel', next: ['boss'] },
        { id: 'boss', row: 2, kind: 'boss', next: [] },
      ],
    },
    status: 'active',
    visited: ['a'],
    members: [{ source: 'owned', unit: campaign.prepareOwned(runInitial().copies[0]) }],
  };
};
const plan = (threat: 'fire' | 'vanguard'): NodePlan => ({
  nodeId: 'b',
  kind: 'duel',
  levelId: 'not-for-display',
  opponents: [],
  reward: { crowns: 999, goldKeys: 9, products: [] },
  threat,
});

describe('A75 public route inspection', () => {
  it('distinguishes equal node kinds and their incoming/outgoing relations without mutating the run', () => {
    const run = fixture(),
      before = JSON.stringify(run);
    const b = routeInspection(run, 'b'),
      c = routeInspection(run, 'c');
    expect(b?.position).toEqual({ stage: 2, option: 1 });
    expect(c?.position).toEqual({ stage: 2, option: 2 });
    expect(b?.from.map((node) => node.id)).toEqual(['a']);
    expect(b?.to.map((node) => node.id)).toEqual(['boss']);
    expect(b?.state).toBe('available');
    expect(routeInspection(run, 'boss')?.state).toBe('locked');
    expect(routeInspection(run, 'a')?.state).toBe('visited');
    expect(JSON.stringify(run)).toBe(before);
  });
  it('uses the frozen plan over a live fallback, exposing neither rewards nor level IDs', () => {
    const run = {
      ...fixture(),
      campaignSnapshot: { ...campaignFixture(), nodes: [plan('fire')] },
    } as Run;
    const read = routeInspection(run, 'b', [plan('vanguard')]);
    expect(read?.threat).toBe('fire');
    expect(JSON.stringify(read)).not.toContain('not-for-display');
    expect(JSON.stringify(read)).not.toContain('crowns');
    expect(read).not.toHaveProperty('plan');
  });
  it('uses declared legacy fallback only when no snapshot exists and rejects unknown nodes', () => {
    expect(routeInspection(fixture(), 'b', [plan('vanguard')])?.threat).toBe('vanguard');
    expect(routeInspection(fixture(), 'missing')).toBeUndefined();
    const snapshot = { ...fixture(), campaignSnapshot: { ...campaignFixture(), nodes: [] } } as Run;
    expect(routeInspection(snapshot, 'b', [plan('fire')])?.threat).toBeUndefined();
  });
});
