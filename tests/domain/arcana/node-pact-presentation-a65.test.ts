import { afterEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NodePreparation } from '../../../src/arcana/presentation/NodePreparation';
import { ThreatBadge, ThreatHelp } from '../../../src/arcana/presentation/TacticalBadge';
import { campaignFixture, runInitial } from './support/run-fixtures';
import type { Run } from '../../../src/arcana/domain/exploration/run';
import type { NodeOptions } from '../../../src/arcana/application/run-contracts';

function model(count = 2, temporary = true) {
  const game = runInitial(),
    campaign = campaignFixture();
  const recruit = campaign.nodes.find((plan) => plan.kind === 'pact')!;
  if (recruit.kind !== 'pact') throw new Error('pact fixture missing');
  const recruits = [
    { ...recruit.recruit, id: 'offer-alchemy', affinity: 'alchemy' as const },
    { ...recruit.recruit, id: 'offer-fire', wizardId: 'ember-keeper', affinity: 'fire' as const },
  ];
  const run: Run = {
    id: 'tactical-pact',
    campaignVersion: campaign.version,
    zoneId: campaign.zoneId,
    graphVersion: campaign.graph.version,
    graph: campaign.graph,
    status: 'active',
    visited: [],
    members: Array.from({ length: count }, (_, index) => ({
      source: index && temporary ? ('temporary' as const) : ('owned' as const),
      unit: {
        ...campaign.prepareOwned(game.copies[0]),
        id: `member-${index}`,
        affinity: 'alchemy' as const,
      },
    })),
  };
  return {
    game,
    run,
    plan: { ...recruit, recruits },
    rules: { ...campaign.combatRules, alchemyHealing: 5 },
  };
}
afterEach(() => vi.unstubAllGlobals());
describe('A65 tactical pact presentation', () => {
  for (const language of ['es', 'en'] as const) {
    it(`requires candidate selection without recruiting on render in ${language}`, () => {
      vi.stubGlobal('matchMedia', () => ({ matches: true }));
      const state = model(),
        before = JSON.stringify(state),
        onResolve = vi.fn(),
        onChange = vi.fn();
      const render = (options: NodeOptions) =>
        renderToStaticMarkup(
          createElement(NodePreparation, {
            ...state,
            language,
            rounding: 'floor',
            options,
            ready: true,
            onChange,
            onResolve,
          }),
        );
      const unselected = render({});
      expect(unselected.match(/data-pact-candidate=/g)).toHaveLength(2);
      expect(unselected).not.toContain('data-pact-action=');
      expect(unselected.match(/aria-pressed="false"/g)).toHaveLength(2);
      expect(unselected).not.toContain('data-pact-choice="pass"');
      expect(unselected).not.toContain('data-preparation-synergies');
      expect(unselected).toContain('data-affinity-progress="alchemy"');
      expect(unselected).toContain('2 → 3 / 3');
      const selected = render({ pactAction: 'recruit', recruitId: 'offer-alchemy' });
      expect(selected).toContain('data-active-synergy="alchemy"');
      expect(selected).toContain('data-synergy-value="5"');
      expect(selected).toContain(language === 'es' ? 'Actual → propuesta' : 'Current → proposed');
      expect(onResolve).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
      expect(JSON.stringify(state)).toBe(before);
    });
    it(`does not imply a full-team comparison before explicit temporary replacement in ${language}`, () => {
      vi.stubGlobal('matchMedia', () => ({ matches: true }));
      const state = model(5),
        props = {
          ...state,
          language,
          rounding: 'floor' as const,
          ready: true,
          onChange: vi.fn(),
        };
      const draft = renderToStaticMarkup(
        createElement(NodePreparation, {
          ...props,
          options: { pactAction: 'recruit', recruitId: 'offer-fire' },
        }),
      );
      expect(draft).toContain('data-visual-value="member-1"');
      expect(draft).not.toContain('data-visual-value="member-0"');
      expect(draft).not.toContain('data-preparation-synergies');
      expect(draft).not.toContain(' → ');
      const fullOwned = renderToStaticMarkup(
        createElement(NodePreparation, {
          ...props,
          ...model(5, false),
          options: {},
        }),
      );
      expect(fullOwned.match(/<button[^>]*disabled=""[^>]*data-pact-candidate=/g)).toHaveLength(2);
      expect(fullOwned).toContain(
        language === 'es' ? 'Equipo completo de copias propias' : 'full of owned copies',
      );
      expect(fullOwned.match(/<button[^>]*data-pact-choice="pass"[^>]*>/)?.[0]).not.toContain(
        'disabled',
      );
    });
    it(`keeps full names and deterministic accessible threat explanations in ${language}`, () => {
      const fire = renderToStaticMarkup(createElement(ThreatHelp, { language, threat: 'fire' }));
      const vanguard = renderToStaticMarkup(
        createElement(ThreatHelp, { language, threat: 'vanguard' }),
      );
      expect(fire).toContain(language === 'es' ? 'Fuego · quemadura' : 'Fire · burn');
      expect(vanguard).toContain(
        language === 'es' ? 'Vanguardia · iniciativa' : 'Vanguard · initiative',
      );
      const compact = renderToStaticMarkup(
        createElement(ThreatBadge, { language, threat: 'fire', compact: true }),
      );
      expect(compact).toContain('visually-hidden');
      expect(compact).toContain(language === 'es' ? 'Fuego · quemadura' : 'Fire · burn');
    });
  }
});
