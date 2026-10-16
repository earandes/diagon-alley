import { it, expect } from 'vitest';
import { preparedRoutePath } from '../../support/prepared-route';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { randomizeRoute } from '../../../src/arcana/domain/exploration/randomize-route';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import type { Run } from '../../../src/arcana/domain/exploration/run';
import { routePath } from '../../support/arcana-route';
it('uses only fixed public edges and does not mutate state or imply every path wins', () => {
  const { campaign, opening } = trialConfiguration();
  const wizard = opening.catalog.wizards.find((w) => w.id === 'apprentice')!;
  for (const seed of [0, 1, 42, 99]) {
    const graph = randomizeRoute(campaign.graph, new SeededRandom(seed));
    const run: Run = {
      id: 'qa',
      campaignVersion: campaign.version,
      zoneId: campaign.zoneId,
      graphVersion: graph.version,
      graph,
      visited: [],
      status: 'active',
      challenge: 'discovery',
      tacticalVersion: 2,
      equipmentRulesVersion: 2,
      campaignSnapshot: {
        ...campaign,
        graph,
        nodes: campaign.challengeContent!('discovery', graph),
      },
      members: [
        {
          source: 'owned',
          unit: {
            ...campaign.prepareOwned({
              copyId: 'qa:copy',
              catalogVersion: 1,
              wizard,
              sourceId: 'qa:starter',
              origin: 'starter',
            }),
            wandPowerBonus: 2,
            broomInitiative: 3,
          },
        },
      ],
    };
    const before = JSON.stringify(run);
    const path = preparedRoutePath(run, 'boss');
    expect(graph.nodes.find((n) => n.id === path.at(-1))?.kind).toBe('boss');
    for (let i = 1; i < path.length; i++)
      expect(graph.nodes.find((n) => n.id === path[i - 1])?.next).toContain(path[i]);
    expect(JSON.stringify(run)).toBe(before);
    expect(preparedRoutePath({ ...run, challenge: undefined }, 'boss')).toEqual(
      routePath(graph, [], 'boss'),
    );
  }
});
