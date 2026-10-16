import { CombatEngine } from '../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../src/arcana/infrastructure/random/seeded-random';
import type { Run, RunMember } from '../../src/arcana/domain/exploration/run';
import { healRun } from '../../src/arcana/domain/exploration/run';
import type { NodeKind } from '../../src/arcana/domain/exploration/route';
import { routePath } from './arcana-route';

/** Technical QA policy, not a player/recommender: first Pact candidate, heal refuges, pass trades,
 * no beans. Combat is deterministic without beans; search only public fixed route snapshots.
 * Closure/inventory tests need a surviving route, not a random assertion that every branch wins. */
export function preparedRoutePath(run: Run, kind: NodeKind): string[] {
  if (!run.challenge || !run.campaignSnapshot) return routePath(run.graph, run.visited, kind);
  const snapshot = run.campaignSnapshot;
  const engine = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) });
  const last = run.graph.nodes.find((n) => n.id === run.visited.at(-1));
  const starts = last?.next ?? run.graph.nodes.filter((n) => n.row === 0).map((n) => n.id);
  const found: { path: string[]; score: number }[] = [];
  const visit = (id: string, members: readonly RunMember[], path: string[]) => {
    const node = run.graph.nodes.find((n) => n.id === id)!;
    const plan = snapshot.nodes.find((n) => n.nodeId === id)!;
    let next = members;
    if (plan.kind === 'pact') {
      const recruit = plan.recruits?.[0] ?? plan.recruit;
      if (next.length < 5) next = [...next, { source: 'temporary', unit: recruit }];
      else {
        const replacement = next.find((m) => m.source === 'temporary');
        if (replacement)
          next = [
            ...next.filter((m) => m.unit.id !== replacement.unit.id),
            { source: 'temporary', unit: recruit },
          ];
      }
    } else if (plan.kind === 'refuge') next = healRun(next, 0.4);
    else if (plan.kind === 'duel' || plan.kind === 'boss') {
      if (next.length < 3) return;
      const combat = engine.resolve({
        id: 'qa-route',
        seed: 0,
        player: next.map((m) => m.unit),
        rival: plan.opponents,
        rules: snapshot.combatRules,
      });
      if (combat.outcome !== 'player') return;
      next = next.map((m) => {
        const unit = combat.player.find((u) => u.id === m.unit.id)!;
        return { ...m, unit: { ...m.unit, hp: unit.hp, mana: unit.mana } };
      });
    }
    const route = [...path, id];
    if (node.kind === kind) {
      found.push({
        path: route,
        score: next.reduce((n, m) => n + (m.unit.hp > 0 ? 1000 : 0) + m.unit.hp + m.unit.mana, 0),
      });
      return;
    }
    for (const target of node.next) visit(target, next, route);
  };
  for (const id of starts) visit(id, run.members, []);
  found.sort((a, b) => b.score - a.score || a.path.join('|').localeCompare(b.path.join('|')));
  return found[0]?.path ?? routePath(run.graph, run.visited, kind);
}
