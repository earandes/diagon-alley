import { afterEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  confirmedRecruit,
  recordedNodeChanges,
} from '../../../src/arcana/presentation/node-result-motion';
import { NodeResult } from '../../../src/arcana/presentation/NodeResult';
import type { NodeReceipt } from '../../../src/arcana/application/run-contracts';
import type { Run } from '../../../src/arcana/domain/exploration/run';
import { campaignFixture, runInitial } from './support/run-fixtures';

function run(): Run {
  const campaign = campaignFixture(),
    game = runInitial();
  return {
    id: 'visual-run',
    campaignVersion: 1,
    zoneId: campaign.zoneId,
    graphVersion: 1,
    graph: campaign.graph,
    campaignSnapshot: campaign,
    status: 'active',
    visited: ['duel'],
    members: game.copies.map((copy) => ({
      source: 'owned',
      unit: { ...campaign.prepareOwned(copy), hp: 47.5, maxHp: 95 },
    })),
  };
}
function receipt(after: Run, nodeId = 'refuge'): NodeReceipt {
  return {
    id: 'visual-receipt',
    kind: 'advance-node',
    request: { runId: after.id, nodeId, campaignVersion: 1, assignments: [] },
    run: after,
    reward: { crowns: 0, goldKeys: 0, products: [] },
    firstVictory: null,
    battle: null,
    encounter: null,
  };
}
afterEach(() => vi.unstubAllGlobals());
describe('A69 confirmed node information, not a replay of rules', () => {
  it('uses actual recorded refuge condition and never invents missing before values', () => {
    const before = run(),
      after = {
        ...before,
        visited: ['duel', 'refuge'],
        members: before.members.map((m) => ({ ...m, unit: { ...m.unit, hp: 71.25 } })),
      },
      saved = receipt(after);
    expect(recordedNodeChanges(saved)).toEqual([]);
    expect(recordedNodeChanges(saved, { ...before, id: 'another-run' })).toEqual([]);
    expect(recordedNodeChanges(saved, before)[0]).toMatchObject({ beforeHp: 47.5, afterHp: 71.25 });
    expect(recordedNodeChanges(saved, { ...before, visited: [] })).toEqual([]);
  });
  it('uses persisted encounter diagnostics even without a previous run', () => {
    const after = run(),
      saved = receipt(after, 'encounter');
    const withResolution = {
      ...saved,
      encounter: {
        seed: 0,
        choice: 0,
        resolution: {
          effect: { kind: 'heal' as const, fraction: 0.5 },
          vitals: [{ unitId: after.members[0].unit.id, beforeHp: 10, afterHp: 47.5 }],
        },
      },
    };
    expect(recordedNodeChanges(withResolution)[0]).toMatchObject({ beforeHp: 10, afterHp: 47.5 });
  });
  it('identifies only the chosen temporary companion and never celebrates passing', () => {
    const before = run(),
      old = { source: 'temporary' as const, unit: { ...before.members[0].unit, id: 'old' } },
      chosen = { source: 'temporary' as const, unit: { ...before.members[0].unit, id: 'chosen' } };
    const saved = {
      ...receipt({ ...before, members: [...before.members, old, chosen] }, 'pact'),
      request: {
        ...receipt(before, 'pact').request,
        recruitId: 'chosen',
        pactAction: 'recruit' as const,
      },
    };
    expect(confirmedRecruit(saved)?.unit.id).toBe('chosen');
    expect(
      confirmedRecruit({ ...saved, request: { ...saved.request, pactAction: 'pass' } }),
    ).toBeUndefined();
  });
  for (const language of ['es', 'en'] as const)
    it(`renders exact signed condition with stable values in ${language}, static during server rendering`, () => {
      vi.stubGlobal('matchMedia', () => ({ matches: false }));
      const before = run(),
        after = {
          ...before,
          visited: ['duel', 'refuge'],
          members: before.members.map((m) => ({ ...m, unit: { ...m.unit, hp: 71.25 } })),
        },
        saved = receipt(after),
        initial = JSON.stringify(saved);
      const html = renderToStaticMarkup(
        createElement(NodeResult, {
          receipt: saved,
          previousRun: before,
          confirmed: true,
          language,
          onReplay: vi.fn(),
          onMissions: vi.fn(),
        }),
      );
      expect(html).toContain(language === 'es' ? 'PV +23,75' : 'HP +23.75');
      expect(html).toContain('data-confirmed-motion="false"');
      expect(JSON.stringify(saved)).toBe(initial);
    });
});
