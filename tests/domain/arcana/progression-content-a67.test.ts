import { it, expect } from 'vitest';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { randomizeRoute } from '../../../src/arcana/domain/exploration/randomize-route';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { validateCampaign } from '../../../src/arcana/domain/exploration/nodes';
import {
  publicNodePlan,
  projectPublicContent,
} from '../../../src/arcana/application/public-content';
import base from '../../../src/arcana/content/trial-v1.json';
const config = trialConfiguration();
it('freezes row-dependent threats after route generation and retains economic identities', () => {
  for (const seed of [0, 1, 12, 42, 99]) {
    const graph = randomizeRoute(config.campaign.graph, new SeededRandom(seed));
    for (const challenge of ['discovery', 'tactical', 'mastery'] as const) {
      const nodes = config.campaign.challengeContent!(challenge, graph);
      expect(() => validateCampaign({ ...config.campaign, graph, nodes })).not.toThrow();
      for (const plan of nodes) {
        const original = config.campaign.nodes.find((n) => n.nodeId === plan.nodeId)!;
        if (plan.kind === 'duel' || plan.kind === 'boss') {
          expect(plan.levelId).toBe(plan.nodeId);
          if (original.kind !== 'duel' && original.kind !== 'boss') throw Error();
          expect(plan.reward).toEqual(original.reward);
          const row = graph.nodes.find((n) => n.id === plan.nodeId)!.row;
          if (plan.kind === 'boss')
            expect(plan.opponents.length).toBe(
              challenge === 'discovery' ? 3 : challenge === 'tactical' ? 4 : 5,
            );
          if (challenge === 'discovery' && plan.kind === 'duel' && row <= 2)
            expect(plan.threat).toBeUndefined();
          if (challenge === 'mastery' && plan.kind === 'duel' && row >= 4)
            expect(plan.opponents.length).toBe(3);
        }
        if (plan.kind === 'encounter') {
          expect(plan.offer?.options).toHaveLength(2);
          expect(publicNodePlan(plan)).toEqual(plan);
        }
      }
    }
  }
});
it('does not alter protected economic catalogs or character definitions', () => {
  expect(config.opening.catalog).toEqual(base.catalog);
  expect(config.opening.table).toEqual(base.toadTable);
  expect(config.opening.shop).toEqual(base.shop);
  expect(config.opening.commerce?.vault).toEqual(base.commerce.vault);
  expect(config.opening.commerce!.forge.recipes.map((r) => [r.id, r.crowns])).toEqual(
    base.commerce.forge.recipes.map((r) => [r.id, r.crowns]),
  );
  expect(config.campaign.version).toBe(base.campaign.version);
  expect(config.campaign.combatRules).toEqual(base.campaign.combatRules);
  expect(projectPublicContent(config.opening, config.campaign).campaign.challenges).toEqual([
    'discovery',
    'tactical',
    'mastery',
  ]);
});
