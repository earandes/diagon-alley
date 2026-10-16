import { describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPanel } from '../../../src/arcana/presentation/MapPanel';
import { campaignFixture, runInitial } from './support/run-fixtures';
import type { Run } from '../../../src/arcana/domain/exploration/run';

// Canvas is a client-only renderer; this check covers semantic controls, not Pixi pixels.
vi.mock('../../../src/arcana/presentation/scenes/SceneCanvas', () => ({ SceneCanvas: () => null }));

const runFixture = (): Run => {
  const campaign = campaignFixture(),
    game = runInitial();
  return {
    id: 'map-test',
    campaignVersion: campaign.version,
    zoneId: campaign.zoneId,
    graphVersion: campaign.graph.version,
    graph: campaign.graph,
    status: 'active',
    visited: [],
    members: [{ source: 'owned', unit: campaign.prepareOwned(game.copies[0]) }],
  };
};
describe('A60 legible map without converting origin into an event', () => {
  for (const language of ['es', 'en'] as const) {
    it(`renders a non-interactive origin and preserves every event in ${language}`, () => {
      const run = runFixture(),
        before = JSON.stringify(run),
        onSelect = vi.fn();
      const html = renderToStaticMarkup(
        createElement(MapPanel, { run, language, ready: true, onSelect }),
      );
      expect(html).toContain('data-map-origin="true"');
      expect(html).toMatch(/<div[^>]*data-map-origin="true"/);
      expect(html.match(/data-node-kind=/g)).toHaveLength(run.graph.nodes.length);
      expect(html).toContain('class="map-event-medallion"');
      expect(html.match(/<button[^>]*data-node="duel"[^>]*>/)?.[0]).not.toContain('disabled');
      expect(html).toContain(language === 'es' ? 'Inicio' : 'Start');
      expect(onSelect).not.toHaveBeenCalled();
      expect(JSON.stringify(run)).toBe(before);
    });
    it(`leaves visited nodes inert and subsequent authority options actionable in ${language}`, () => {
      const run = { ...runFixture(), visited: ['duel'] };
      const html = renderToStaticMarkup(
        createElement(MapPanel, { run, language, ready: true, onSelect: vi.fn() }),
      );
      const visitedButton = html.match(/<button[^>]*data-node="duel"[^>]*>/)?.[0];
      const nextButton = html.match(/<button[^>]*data-node="refuge"[^>]*>/)?.[0];
      expect(visitedButton).toContain('data-node-state="visited"');
      expect(visitedButton).toContain('disabled');
      expect(nextButton).toContain('data-node-state="available"');
      expect(nextButton).not.toContain('disabled');
    });
  }
});
