/** Offline route-cost study. No database/player or human timings. Node24. */
import { registerHooks } from 'node:module';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
registerHooks({
  resolve(s, c, next) {
    try {
      return next(s, c);
    } catch (e) {
      if (s.startsWith('.')) return next(s + '.ts', c);
      throw e;
    }
  },
  load(u, c, next) {
    if (u.endsWith('.json'))
      return {
        format: 'module',
        shortCircuit: true,
        source: 'export default ' + fs.readFileSync(fileURLToPath(u), 'utf8') + ';',
      };
    if (u.endsWith('.ts'))
      return {
        format: 'module',
        shortCircuit: true,
        source: ts.transpileModule(fs.readFileSync(fileURLToPath(u), 'utf8'), {
          compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
        }).outputText,
      };
    return next(u, c);
  },
});
const { trialConfiguration } = await import(
  '../../src/arcana/infrastructure/content/trial-configuration.ts'
);
const { randomizeRoute } = await import('../../src/arcana/domain/exploration/randomize-route.ts');
const { SeededRandom } = await import('../../src/arcana/infrastructure/random/seeded-random.ts');
const counts = {};
let paths = 0;
for (let seed = 0; seed < 128; seed++) {
  const graph = randomizeRoute(trialConfiguration().campaign.graph, new SeededRandom(seed));
  const incoming = new Set(graph.nodes.flatMap((n) => n.next));
  const visit = (id, path) => {
    const node = graph.nodes.find((n) => n.id === id),
      p = [...path, node];
    if (p.length === 4) {
      paths++;
      const fights = p.filter((n) => n.kind === 'duel' || n.kind === 'boss').length;
      counts[fights] = (counts[fights] ?? 0) + 1;
      return;
    }
    for (const next of node.next) visit(next, p);
  };
  for (const node of graph.nodes.filter((n) => !incoming.has(n.id))) visit(node.id, []);
}
console.log(
  JSON.stringify(
    {
      seeds: 128,
      prefixesToStoryCompletion: paths,
      visitedForThreeRepairs: 4,
      opportunitiesAt: [2, 3, 4],
      combatsByPrefix: counts,
      essenceByCombat: 5,
      energyCapacity: 50,
      regenerationMinutesPerPoint: 12,
      assumptions:
        'Dispel at every opportunity; survives encountered fights; topology only, not win or human-time simulation.',
    },
    null,
    2,
  ),
);
