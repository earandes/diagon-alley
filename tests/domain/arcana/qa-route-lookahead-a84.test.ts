import { expect, it } from 'vitest';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { randomizeRoute } from '../../../src/arcana/domain/exploration/randomize-route';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { healRun, type Run, type RunMember } from '../../../src/arcana/domain/exploration/run';
import { preparedRoutePath } from '../../support/prepared-route';
import fixture from '../../support/fixtures/a73-route-seed0.json';

function start(seed: number): Run {
  const { campaign, opening } = trialConfiguration('a84');
  const graph = randomizeRoute(campaign.graph, new SeededRandom(seed));
  const wizard = opening.catalog.wizards.find((w) => w.id === 'apprentice')!;
  return {
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
    campaignSnapshot: { ...campaign, graph, nodes: campaign.challengeContent!('discovery', graph) },
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
}
function follow(
  run: Run,
  path: readonly string[],
  recruits: Readonly<Record<string, string>> = {},
): Run {
  let members: readonly RunMember[] = run.members;
  const engine = new CombatEngine({ fromSeed: (s) => new SeededRandom(s) });
  for (const id of path) {
    const plan = run.campaignSnapshot!.nodes.find((n) => n.nodeId === id)!;
    if (plan.kind === 'pact') {
      const recruit =
        plan.recruits?.find((unit) => unit.id === recruits[id]) ??
        plan.recruits?.[0] ??
        plan.recruit;
      if (members.length === 5) {
        const replacement = members.find((m) => m.source === 'temporary');
        if (replacement) members = members.filter((m) => m !== replacement);
      }
      if (members.length < 5) members = [...members, { source: 'temporary', unit: recruit }];
    } else if (plan.kind === 'refuge') members = healRun(members, 0.4);
    else if (plan.kind === 'duel' || plan.kind === 'boss') {
      const combat = engine.resolve({
        id: 'qa',
        seed: 0,
        player: members.map((m) => m.unit),
        rival: plan.opponents,
        rules: run.campaignSnapshot!.combatRules,
      });
      if (combat.outcome !== 'player')
        return { ...run, status: 'lost', visited: [...run.visited, ...path], members };
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
  return { ...run, visited: [...run.visited, ...path], members };
}
it('demonstrates why a random greedy journey is not a guaranteed victory fixture (seed36)', () => {
  const run = start(36);
  expect(follow(run, preparedRoutePath(run, 'boss')).status).not.toBe('lost');
  const greedy = follow(run, preparedRoutePath(run, 'duel'));
  expect(follow(greedy, preparedRoutePath(greedy, 'boss')).status).toBe('lost');
});

it('the declared seed0 fixture retains first duel, boss and victory under unchanged rules', () => {
  const run = start(0);
  const first = preparedRoutePath(run, 'duel');
  const after = follow(run, first);
  expect(after.status).not.toBe('lost');
  expect(follow(after, preparedRoutePath(after, 'boss')).status).not.toBe('lost');
});

it('the browser route fixture equals the current campaign graph and complete node plans', () => {
  const run = start(0);
  expect(fixture.version).toBe(1);
  expect(fixture.campaignVersion).toBe(run.campaignVersion);
  expect(fixture.graph).toEqual(run.graph);
  expect(fixture.nodes).toEqual(run.campaignSnapshot!.nodes);
});
