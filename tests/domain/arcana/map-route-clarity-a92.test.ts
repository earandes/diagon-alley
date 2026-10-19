import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mapRouteConnections } from '../../../src/arcana/presentation/map-route-connections';
import { BeanAssignments } from '../../../src/arcana/presentation/BeanAssignments';
import { projectPublicContent } from '../../../src/arcana/application/public-content';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { BossPartyStage } from '../../../src/arcana/presentation/BossPartyStage';
import { campaignFixture, runInitial } from './support/run-fixtures';
import { fitMapLayout } from '../../../src/arcana/presentation/scenes/map-layout';
import type { Run } from '../../../src/arcana/domain/exploration/run';

const graph = {
  version: 1,
  nodes: [
    { id: 'a', kind: 'pact' as const, row: 0, next: ['b', 'c'] },
    { id: 'b', kind: 'duel' as const, row: 1, column: 0, next: ['d'] },
    { id: 'c', kind: 'chest' as const, row: 1, column: 1, next: ['d'] },
    { id: 'd', kind: 'boss' as const, row: 2, next: [] },
  ],
};
describe('A92 public connections and deliberate preparation', () => {
  it('shows all known edges but only the actual consecutive path as travelled', () => {
    const layout = fitMapLayout(graph, 390, 600);
    const before = JSON.stringify(layout);
    const connections = mapRouteConnections(layout, ['a', 'b'], ['d'], 'c');
    expect(connections).toHaveLength(4);
    expect(
      connections.map(({ from, to, state, inspected }) => [from.id, to.id, state, inspected]),
    ).toEqual([
      ['a', 'b', 'visited', false],
      ['a', 'c', 'future', true],
      ['b', 'd', 'available', false],
      ['c', 'd', 'future', true],
    ]);
    expect(JSON.stringify(layout)).toBe(before);
    expect(
      mapRouteConnections(layout, ['a', 'd'], []).every((edge) => edge.state === 'future'),
    ).toBe(true);
  });
  it('query and no-query expose exactly the same public adjacency without changing availability', () => {
    const layout = fitMapLayout(graph, 865, 1079);
    const plain = mapRouteConnections(layout, ['a'], ['b', 'c']);
    const inspected = mapRouteConnections(layout, ['a'], ['b', 'c'], 'd');
    expect(inspected.map(({ from, to, state }) => [from.id, to.id, state])).toEqual(
      plain.map(({ from, to, state }) => [from.id, to.id, state]),
    );
    expect(inspected.filter((edge) => edge.inspected)).toHaveLength(2);
  });
  for (const language of ['es', 'en'] as const)
    it(`previews the saved group instead of Auto in ${language}`, () => {
      const game = runInitial();
      const campaign = campaignFixture();
      const units = game.copies.map((copy, index) => ({
        source: 'owned' as const,
        unit: { ...campaign.prepareOwned(copy), wizardId: `identity-${index}` },
      }));
      const run: Run = {
        id: 'a92-bond',
        campaignVersion: 1,
        graphVersion: 1,
        zoneId: 'bulevar',
        status: 'active',
        graph: campaign.graph,
        visited: [],
        members: units,
        bondFocus: 'death',
      };
      const rules = {
        ...campaign.combatRules,
        houseSynergies: 1 as const,
        bonds: {
          version: 1 as const,
          orderHealing: [2, 3] as const,
          deathDamage: [2, 3] as const,
          creatureGuard: [2, 3] as const,
          members: {
            order: units.map(({ unit }) => unit.wizardId),
            death: units.map(({ unit }) => unit.wizardId),
            creatures: ['other-a', 'other-b', 'other-c'],
          },
        },
      };
      const before = JSON.stringify({ run, game, rules });
      const html = renderToStaticMarkup(
        createElement(BossPartyStage, {
          run,
          game,
          rules,
          assignments: [],
          language,
          ready: true,
          onPrepare: () => {},
        }),
      );
      expect(html).toContain('data-bond-progress="death"');
      expect(html).not.toContain('data-bond-progress="order"');
      expect(html).toContain(language === 'es' ? 'Vínculo del equipo' : 'Team bond');
      expect(html.match(/data-boss-member=/g)).toHaveLength(3);
      const current = trialConfiguration();
      const content = {
        ...projectPublicContent(current.opening, current.campaign),
        combatRules: rules,
      };
      const beanRun: Run = { ...run, campaignSnapshot: { ...campaign, combatRules: rules } };
      const beans = renderToStaticMarkup(
        createElement(BeanAssignments, {
          run: beanRun,
          game,
          content,
          language,
          assignments: [],
          ready: true,
          onChange: () => {},
        }),
      );
      expect(beans).toContain('data-bond-progress="death"');
      expect(beans).not.toContain('data-bond-progress="order"');
      expect(JSON.stringify({ run, game, rules })).toBe(before);
    });
});
