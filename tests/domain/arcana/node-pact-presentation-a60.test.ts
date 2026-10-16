import { afterEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NodePreparation } from '../../../src/arcana/presentation/NodePreparation';
import { campaignFixture, runInitial } from './support/run-fixtures';
import type { Run } from '../../../src/arcana/domain/exploration/run';

const model = (members = 1) => {
  const game = runInitial(),
    campaign = campaignFixture();
  const run: Run = {
    id: 'pact-test',
    campaignVersion: campaign.version,
    zoneId: campaign.zoneId,
    graphVersion: campaign.graph.version,
    graph: campaign.graph,
    status: 'active',
    visited: [],
    members: Array.from({ length: members }, (_, index) => ({
      source: index ? ('temporary' as const) : ('owned' as const),
      unit: { ...campaign.prepareOwned(game.copies[0]), id: `member-${index}` },
    })),
  };
  return { game, run, plan: campaign.nodes.find((plan) => plan.kind === 'pact')! };
};
afterEach(() => vi.unstubAllGlobals());
describe('A60 explicit pact resolution actions', () => {
  for (const language of ['es', 'en'] as const) {
    it(`offers one-action recruitment without invoking it on render in ${language}`, () => {
      vi.stubGlobal('matchMedia', () => ({ matches: true }));
      const state = model(),
        before = JSON.stringify(state),
        onResolve = vi.fn();
      const html = renderToStaticMarkup(
        createElement(NodePreparation, {
          ...state,
          language,
          rounding: 'floor',
          options: {},
          ready: true,
          onChange: vi.fn(),
          onResolve,
        }),
      );
      expect(html).toContain('data-pact-action="recruit"');
      expect(html.match(/<button[^>]*data-pact-action="recruit"[^>]*>/)?.[0]).not.toContain(
        'disabled',
      );
      expect(html.match(/<button[^>]*data-pact-action="pass"[^>]*>/)?.[0]).toContain('disabled');
      expect(html).not.toContain('aria-pressed');
      expect(onResolve).not.toHaveBeenCalled();
      expect(JSON.stringify(state)).toBe(before);
    });
    it(`keeps replacement and legacy callers as preview then confirmation in ${language}`, () => {
      vi.stubGlobal('matchMedia', () => ({ matches: true }));
      const onResolve = vi.fn();
      const full = renderToStaticMarkup(
        createElement(NodePreparation, {
          ...model(5),
          language,
          rounding: 'floor',
          options: {},
          ready: true,
          onChange: vi.fn(),
          onResolve,
        }),
      );
      expect(full).not.toContain('data-pact-action=');
      expect(full).toContain('data-visual-value="recruit"');
      expect(full).toContain('data-visual-value="member-1"');
      const legacy = renderToStaticMarkup(
        createElement(NodePreparation, {
          ...model(),
          language,
          rounding: 'floor',
          options: {},
          ready: false,
          onChange: vi.fn(),
        }),
      );
      expect(legacy).not.toContain('data-pact-action=');
      expect(legacy).toContain('<fieldset class="visual-choices" disabled=""');
      expect(onResolve).not.toHaveBeenCalled();
    });
  }
});
