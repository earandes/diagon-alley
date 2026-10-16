import type { RandomTickets } from '../combat/random';
import { ArcanaError } from '../errors';
import { validateGraph, type NodeGraph, type RouteNode } from './route';

/** Generator v1: permute whole events, keeping their reward/victory identities intact. */
export function randomizeRoute(graph: NodeGraph, random: RandomTickets): NodeGraph {
  validateGraph(graph);
  const pick = (bound: number) => {
    const value = random.ticket(bound);
    if (!Number.isSafeInteger(value) || value < 0 || value >= bound)
      throw new ArcanaError('INVALID_RANDOM_BOUND');
    return value;
  };
  const shuffle = <T>(values: readonly T[]): T[] => {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = pick(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  const rows = [...new Set(graph.nodes.map((n) => n.row))].sort((a, b) => a - b);
  const pool = shuffle(graph.nodes.filter((n) => n.row >= 2 && n.kind !== 'boss'));
  // The optional early chest must lead to a third ally before any combat.
  const earlyChest = graph.nodes.some((n) => n.row === 1 && n.kind === 'chest');
  if (earlyChest) {
    const index = pool.findIndex((n) => n.kind === 'pact');
    if (index < 0) throw new ArcanaError('INVALID_CAMPAIGN');
    [pool[0], pool[index]] = [pool[index], pool[0]];
  }
  const layers = rows.map((row) => {
    const slots = graph.nodes
      .filter((n) => n.row === row)
      .sort((a, b) => (a.column ?? 0) - (b.column ?? 0));
    const events =
      row === 1
        ? shuffle(slots)
        : slots.map((slot) => (slot.row >= 2 && slot.kind !== 'boss' ? pool.shift()! : slot));
    return events.map((event, column): RouteNode => ({ ...event, row, column, next: [] }));
  });
  const nodes: RouteNode[] = [];
  for (let index = 0; index < layers.length; index++) {
    const layer = layers[index],
      next = layers[index + 1];
    if (!next) {
      nodes.push(...layer);
      continue;
    }
    const links = layer.map((node, column) => {
      if (node.row === 0) return next.map((n) => n.id);
      if (node.row === 1 && earlyChest)
        return next.filter((n) => node.kind !== 'chest' || n.kind === 'pact').map((n) => n.id);
      const targets = new Set([
        next[Math.min(next.length - 1, Math.floor((column * next.length) / layer.length))].id,
      ]);
      if (next.length > 1 && pick(2) === 1) targets.add(next[pick(next.length)].id);
      return [...targets];
    });
    for (const target of next)
      if (!links.some((ids) => ids.includes(target.id))) links[pick(layer.length)].push(target.id);
    nodes.push(...layer.map((node, i) => ({ ...node, next: links[i] })));
  }
  const result = { version: graph.version, nodes };
  validateGraph(result);
  return result;
}
