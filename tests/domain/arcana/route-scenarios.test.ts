import { expect, it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import config from '../../../src/arcana/content/trial-v1.json';
import { randomizeRoute } from '../../../src/arcana/domain/exploration/randomize-route';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import type { NodeGraph, NodeKind } from '../../../src/arcana/domain/exploration/route';
const base = config.campaign.graph as NodeGraph;
it('compares route exposure under three policies without writing player data or economic configuration', () => {
  const trials = 1000,
    rows = [];
  for (const topology of ['fixed-reference', 'variable-v1'])
    for (const policy of ['random', 'loot-first', 'combat-first']) {
      const observations: {
        blocked: boolean;
        duels: number;
        chests: number;
        encounters: number;
        essence: number;
        firstClearCrowns: number;
        repeatCrowns: number;
      }[] = [];
      for (let seed = 0; seed < trials; seed++) {
        const graph =
          topology === 'fixed-reference' ? base : randomizeRoute(base, new SeededRandom(seed));
        const rng = new SeededRandom(seed + 100000);
        let visited: string[] = [],
          members = 1,
          duels = 0,
          chests = 0,
          encounters = 0,
          blocked = false,
          won = false;
        while (!won) {
          const prior = graph.nodes.find((n) => n.id === visited.at(-1));
          let options = graph.nodes.filter((n) =>
            prior ? prior.next.includes(n.id) : n.row === 0,
          );
          if (members < 3 && options.some((n) => n.kind === 'pact'))
            options = options.filter((n) => n.kind === 'pact');
          const rank = (kind: NodeKind) =>
            policy === 'loot-first'
              ? { chest: 0, refuge: 1, pact: 2, encounter: 3, duel: 4, boss: 5 }[kind]
              : { duel: 0, encounter: 1, chest: 2, refuge: 3, pact: 4, boss: 5 }[kind];
          if (policy !== 'random') {
            const best = Math.min(...options.map((n) => rank(n.kind)));
            options = options.filter((n) => rank(n.kind) === best);
          }
          const node = options[rng.ticket(options.length)];
          if ((node.kind === 'duel' || node.kind === 'boss') && members < 3) {
            blocked = true;
            break;
          }
          visited = [...visited, node.id];
          if (node.kind === 'pact') members = Math.min(5, members + 1);
          if (node.kind === 'duel') duels++;
          if (node.kind === 'chest') chests++;
          if (node.kind === 'encounter') encounters++;
          won = node.kind === 'boss';
        }
        const encounterExpectedCrowns =
          config.encounters.reduce(
            (sum, c) => sum + c.weight * (c.effect.kind === 'reward' ? c.effect.reward!.crowns : 0),
            0,
          ) / config.encounters.reduce((sum, c) => sum + c.weight, 0);
        observations.push({
          blocked,
          duels,
          chests,
          encounters,
          essence: (duels + (won ? 1 : 0)) * 5,
          firstClearCrowns:
            duels * config.duelReward.crowns +
            chests * config.chestReward.crowns +
            encounters * encounterExpectedCrowns +
            (won ? config.bossReward.crowns : 0),
          repeatCrowns:
            duels * Math.floor(config.duelReward.crowns / 10) +
            chests * config.chestReward.crowns +
            encounters * encounterExpectedCrowns +
            (won ? Math.floor(config.bossReward.crowns / 10) : 0),
        });
      }
      const mean = (
        key: 'duels' | 'chests' | 'encounters' | 'essence' | 'firstClearCrowns' | 'repeatCrowns',
      ) => Math.round((observations.reduce((sum, o) => sum + o[key], 0) / trials) * 100) / 100;
      const blocked = observations.filter((o) => o.blocked).length;
      if (topology === 'variable-v1') expect(blocked).toBe(0);
      rows.push({
        topology,
        policy,
        trials,
        blocked,
        meanDuels: mean('duels'),
        meanChests: mean('chests'),
        meanEncounters: mean('encounters'),
        meanEssence: mean('essence'),
        meanFirstClearCrowns: mean('firstClearCrowns'),
        meanRepeatCrowns: mean('repeatCrowns'),
      });
    }
  const report = {
    configSha256: createHash('sha256').update(JSON.stringify(config)).digest('hex'),
    seedRange: [0, trials - 1],
    rows,
    limits: [
      'Technical hypotheses, not observed players or win rates. No database or save mutations.',
      'Assumes every eligible combat is won; ignores HP, mana, time and equipment. Encounters use expected crowns, not sampled effects.',
      'Policies recruit when below three; random otherwise chooses uniformly. Loot-first and combat-first use static priority, not human decisions.',
      'First-clear assumes every combat level is new. Repeat assumes every combat level already won; existing rounding and reduced reward rules.',
      'Changed topology changes reward exposure even though all original prices, weights and base reward values are preserved.',
    ],
  };
  if (process.env.ARCANA_ROUTE_REPORT)
    writeFileSync(process.env.ARCANA_ROUTE_REPORT, JSON.stringify(report, null, 2) + '\n');
});
