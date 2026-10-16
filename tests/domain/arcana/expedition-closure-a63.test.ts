import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExpeditionClosure } from '../../../src/arcana/presentation/ExpeditionClosure';
import { expeditionClosure } from '../../../src/arcana/application/client/expedition-closure';
import type { GameState } from '../../../src/arcana/application/game';
import type { NodeReceipt } from '../../../src/arcana/application/run-contracts';
import type { Run } from '../../../src/arcana/domain/exploration/run';
import { campaignFixture, runInitial } from './support/run-fixtures';

// Presentation fixtures: no rewards are granted or persisted by this read model.
function closed(status: Run['status'] = 'won'): GameState {
  const state = runInitial();
  const campaign = campaignFixture();
  const run: Run = {
    id: 'closed-run', graphVersion: 1, campaignVersion: 1, zoneId: campaign.zoneId,
    graph: campaign.graph, visited: campaign.graph.nodes.map(n => n.id), status,
    members: state.copies.map(copy => ({ source: 'owned', unit: campaign.prepareOwned(copy) })),
  };
  const receipt: NodeReceipt = {
    id: 'last-node', kind: 'advance-node',
    request: { runId: run.id, nodeId: 'boss', campaignVersion: 1, assignments: [] },
    run, reward: status === 'lost' || status === 'draw'
      ? { crowns: 0, goldKeys: 0, products: [] }
      : { crowns: 50, goldKeys: 1, products: ['cacao-toad'] },
    firstVictory: true, battle: null, encounter: null,
  };
  return { ...state, exploration: { run, victories: [], unlockedZones: ['bulevar'] }, receipts: [receipt] };
}
describe('closed expedition guidance reads committed state, never grants anything', () => {
  it('does not replace the initial selection or an active route', () => {
    expect(expeditionClosure(runInitial())).toBeNull();
    expect(expeditionClosure(closed('active'))).toBeNull();
  });
  it('offers a real key first and preserves the original reward separately from current inventory', () => {
    const state = closed();
    const withKey = { ...state, inventory: { ...state.inventory, goldKeys: 1 } };
    const before = JSON.stringify(withKey);
    expect(expeditionClosure(withKey)?.actions).toEqual(['vault', 'prepare']);
    expect(expeditionClosure(withKey)?.receipt?.reward.goldKeys).toBe(1);
    expect(JSON.stringify(withKey)).toBe(before);
  });
  it('updates the destination after using the key, including a sealed frog earned earlier', () => {
    const state = closed();
    const frog = { ...state, inventory: { ...state.inventory, goldKeys: 0,
      products: [{ id: 'earned-frog', kind: 'cacao-toad' as const, status: 'available' as const }] } };
    expect(expeditionClosure(frog)?.actions).toEqual(['frog', 'prepare']);
    expect(expeditionClosure(frog)?.frogId).toBe('earned-frog');
    expect(expeditionClosure(state)?.actions).toEqual(['prepare']);
  });
  it('does not offer consumed frogs or a free vault from an old receipt', () => {
    const state = closed();
    const spent = { ...state, inventory: { ...state.inventory, products: [{ id: 'old-frog',
      kind: 'cacao-toad' as const, status: 'consumed' as const, operationId: 'opened' }] } };
    expect(expeditionClosure(spent)?.actions).toEqual(['prepare']);
  });
  it('only points to unassigned equipment, without moving a loadout', () => {
    const state = closed();
    const gear = { id: 'new-wand', version: 1, kind: 'wand' as const, wood: 'birch' as const,
      core: 'dragon' as const, powerBonus: 2, multiplier: 1.2 };
    const available = { ...state, inventory: { ...state.inventory, equipment: [gear] } };
    expect(expeditionClosure(available)?.actions).toEqual(['equipment', 'prepare']);
    const equipped = { ...available, team: { copyIds: ['copy0'], loadouts: [{ copyId: 'copy0', wandId: gear.id, broomId: null }] } };
    expect(expeditionClosure(equipped)?.actions).toEqual(['prepare']);
  });
  it.each(['lost', 'draw'] as const)('keeps %s distinct and never invents a victory reward', status => {
    const state = closed(status);
    expect(expeditionClosure(state)?.run.status).toBe(status);
    expect(expeditionClosure(state)?.actions).toEqual(['prepare']);
  });
  it('keeps the closing receipt after unrelated operations and after reload', () => {
    const state = closed();
    const later = { ...state, receipts: [...state.receipts, { id: 'later-purchase', kind: 'purchase' as const,
      request: { product: 'random-beans' as const, quantity: 1, priceVersion: 1 }, spentCrowns: 5, unitIds: ['bean'] }] };
    const result = expeditionClosure(later);
    expect(result?.receipt?.id).toBe('last-node');
    expect(expeditionClosure(JSON.parse(JSON.stringify(later)))).toEqual(result);
  });
  it('does not upgrade a repeated boss reward to first victory loot', () => {
    const state = closed();
    const receipt = state.receipts[0] as NodeReceipt;
    const repeat = { ...state, receipts: [{ ...receipt, firstVictory: false,
      reward: { crowns: 5, goldKeys: 0, products: [] } }] };
    expect(expeditionClosure(repeat)?.receipt?.firstVictory).toBe(false);
    expect(expeditionClosure(repeat)?.receipt?.reward).toEqual({ crowns: 5, goldKeys: 0, products: [] });
  });
});

// Explicit render fixtures, not campaign defeats or player observations.
for (const status of ['lost', 'draw'] as const) for (const language of ['es', 'en'] as const) {
  it(`renders distinct ${status} closure in ${language} without victory loot`, () => {
    const game = closed(status);
    const html = renderToStaticMarkup(createElement(ExpeditionClosure, {
      game, language, ready: true, onAction: () => {}, onReplay: () => {}, onMissions: () => {},
    }));
    const expected = status === 'draw' ? (language === 'es' ? 'Empate' : 'Draw')
      : (language === 'es' ? 'Expedición terminada' : 'Expedition ended');
    expect(html).toContain(expected);
    expect(html).toContain('data-closure-action="prepare"');
    expect(html).not.toContain('data-closure-action="vault"');
    expect(html).not.toContain('data-closure-action="frog"');
    expect(html).not.toContain('closure-key');
    expect(html).not.toContain('+50');
  });
}
