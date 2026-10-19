import { expect, it } from 'vitest';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { randomizeRoute } from '../../../src/arcana/domain/exploration/randomize-route';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { healRun, type Run, type RunMember } from '../../../src/arcana/domain/exploration/run';
import { preparedRoutePath } from '../../support/prepared-route';
import fixture from '../../support/fixtures/a87-route-seed0.json';

it('pins the boss presentation fixture to current A87 public content, without different stats or rewards', () => {
  const { campaign } = trialConfiguration('a87');
  const graph = randomizeRoute(campaign.graph, new SeededRandom(0));
  expect(fixture.campaignVersion).toBe(campaign.version);
  expect(fixture.tacticalVersion).toBe(campaign.tacticalContent!.version);
  expect(fixture.graph).toEqual(graph);
  expect(fixture.nodes).toEqual(campaign.challengeContent!('discovery', graph, ['apprentice']));
});

it('reaches and defeats the declared boss with the unchanged starter and first-candidate QA policy', () => {
  const { campaign, opening } = trialConfiguration('a87');
  const graph = randomizeRoute(campaign.graph, new SeededRandom(0));
  const nodes = campaign.challengeContent!('discovery', graph, ['apprentice']);
  const wizard = opening.catalog.wizards.find((w) => w.id === 'apprentice')!;
  for (const copyId of ['0000:owned', 'qa:owned', 'zzzz:owned']) {
    const run: Run = {
      id: 'qa',
      campaignVersion: campaign.version,
      zoneId: campaign.zoneId,
      graphVersion: graph.version,
      graph,
      visited: [],
      status: 'active',
      challenge: 'discovery',
      tacticalVersion: 4,
      equipmentRulesVersion: 2,
      campaignSnapshot: { ...campaign, graph, nodes },
      members: [
        {
          source: 'owned',
          unit: {
            ...campaign.prepareOwned({
              copyId,
              catalogVersion: 4,
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
    let members: readonly RunMember[] = run.members;
    const path = preparedRoutePath(run, 'boss');
    const engine = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) });
    for (const id of path) {
      const plan = nodes.find((n) => n.nodeId === id)!;
      if (plan.kind === 'pact') {
        expect(members.length).toBeLessThan(5);
        members = [...members, { source: 'temporary', unit: plan.recruits?.[0] ?? plan.recruit }];
      } else if (plan.kind === 'refuge') members = healRun(members, 0.4);
      else if (plan.kind === 'duel' || plan.kind === 'boss') {
        const combat = engine.resolve({
          id: 'qa',
          seed: 0,
          player: members.map((m) => m.unit),
          rival: plan.opponents,
          rules: campaign.combatRules,
        });
        expect(combat.outcome, `${copyId}/${id}`).toBe('player');
        members = members.map((m) => ({
          ...m,
          unit: {
            ...m.unit,
            hp: combat.player.find((u) => u.id === m.unit.id)!.hp,
            mana: combat.player.find((u) => u.id === m.unit.id)!.mana,
          },
        }));
      }
    }
    expect(graph.nodes.find((n) => n.id === path.at(-1))?.kind).toBe('boss');
  }
});
