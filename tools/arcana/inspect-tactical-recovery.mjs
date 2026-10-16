/** Pure graph diagnostic. No route mutation or player state access. */
import { root, reference } from './simulate-tactics.mjs';
const { randomizeRoute } = await import(root + '/src/arcana/domain/exploration/randomize-route.ts');
const { SeededRandom } = await import(root + '/src/arcana/infrastructure/random/seeded-random.ts');
let routes = 0,
  withoutRefuge = 0,
  withoutDuel = 0,
  maxDuelChain = 0,
  firstNoRefuge = null;
for (let seed = 0; seed < 128; seed++) {
  const graph = randomizeRoute(reference.campaign.graph, new SeededRandom(seed));
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  function visit(node, prior) {
    const route = [...prior, node];
    if (node.next.length) {
      for (const id of node.next) visit(byId.get(id), route);
      return;
    }
    routes++;
    if (!route.some((n) => n.kind === 'refuge')) {
      withoutRefuge++;
      firstNoRefuge ??= { seed, route: route.map((n) => ({ id: n.id, kind: n.kind })) };
    }
    if (!route.some((n) => n.kind === 'duel')) withoutDuel++;
    let chain = 0;
    for (const n of route) {
      if (n.kind === 'refuge') chain = 0;
      if (n.kind === 'duel' || n.kind === 'boss') maxDuelChain = Math.max(maxDuelChain, ++chain);
    }
  }
  for (const node of graph.nodes.filter((n) => n.row === 0)) visit(node, []);
}
console.log(
  JSON.stringify(
    {
      seeds: [0, 127],
      routes,
      withoutRefuge,
      withoutDuel,
      maxBattlesWithoutRefuge: maxDuelChain,
      firstNoRefuge,
      limit:
        'Topological paths only. Refuge is not always reachable from every chosen branch. Safe seed path existence is separately simulated; never an automatic reroute.',
    },
    null,
    2,
  ),
);
