import { ArcanaError } from '../errors';

export type NodeKind = 'duel' | 'refuge' | 'chest' | 'pact' | 'encounter' | 'boss';
export interface RouteNode {
  readonly id: string;
  readonly row: number;
  readonly column?: number;
  readonly kind: NodeKind;
  readonly next: readonly string[];
}
export interface NodeGraph {
  readonly version: number;
  readonly nodes: readonly RouteNode[];
}
export interface RouteRun {
  readonly id: string;
  readonly graphVersion: number;
  readonly visited: readonly string[];
}

/** JSONB may reorder object keys; graph identity depends on nodes and edges. */
export function sameGraph(a: NodeGraph, b: NodeGraph): boolean {
  return (
    a.version === b.version &&
    a.nodes.length === b.nodes.length &&
    a.nodes.every((node) => {
      const other = b.nodes.find((candidate) => candidate.id === node.id);
      return (
        other !== undefined &&
        node.row === other.row &&
        node.column === other.column &&
        node.kind === other.kind &&
        node.next.length === other.next.length &&
        node.next.every((id, index) => id === other.next[index])
      );
    })
  );
}

const kinds: readonly NodeKind[] = ['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss'];
const validId = (id: string) => typeof id === 'string' && id.trim().length > 0 && id.length <= 100;

export function validateGraph(graph: NodeGraph): void {
  const invalid = (): never => {
    throw new ArcanaError('INVALID_GRAPH');
  };
  if (
    !Number.isSafeInteger(graph.version) ||
    graph.version < 1 ||
    !Array.isArray(graph.nodes) ||
    !graph.nodes.length
  )
    invalid();
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  if (byId.size !== graph.nodes.length || !graph.nodes.some((node) => node.kind === 'boss'))
    invalid();
  for (const node of graph.nodes) {
    if (
      !validId(node.id) ||
      !Number.isSafeInteger(node.row) ||
      node.row < 0 ||
      (node.column !== undefined && (!Number.isSafeInteger(node.column) || node.column < 0)) ||
      !kinds.includes(node.kind) ||
      !Array.isArray(node.next)
    )
      invalid();
    if (new Set(node.next).size !== node.next.length || (node.kind === 'boss' && node.next.length))
      invalid();
    for (const id of node.next) {
      const destination = byId.get(id);
      // Strictly increasing rows rule out cycles and backtracking without a general graph engine.
      if (!destination || destination.row <= node.row) invalid();
    }
  }
  const roots = graph.nodes.filter((node) => node.row === 0);
  if (!roots.length) invalid();
  const reachable = new Set<string>();
  const queue = roots.map((node) => node.id);
  while (queue.length) {
    const id = queue.pop()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    queue.push(...byId.get(id)!.next);
  }
  if (reachable.size !== graph.nodes.length) invalid();
  // Every branch must be able to reach a final boss, rather than silently becoming a dead end.
  const reachesBoss = new Set(
    graph.nodes.filter((node) => node.kind === 'boss').map((node) => node.id),
  );
  for (const node of [...graph.nodes].sort((a, b) => b.row - a.row))
    if (node.next.some((id) => reachesBoss.has(id))) reachesBoss.add(node.id);
  if (reachesBoss.size !== graph.nodes.length) invalid();
}

export function createRoute(id: string, graph: NodeGraph): RouteRun {
  validateGraph(graph);
  if (!validId(id)) throw new ArcanaError('INVALID_ROUTE');
  return Object.freeze({ id, graphVersion: graph.version, visited: Object.freeze([]) });
}

export function advanceRoute(route: RouteRun, graph: NodeGraph, nodeId: string): RouteRun {
  validateGraph(graph);
  if (route.graphVersion !== graph.version) throw new ArcanaError('STALE_GRAPH');
  if (
    !validId(route.id) ||
    !Array.isArray(route.visited) ||
    route.visited.length > graph.nodes.length
  )
    throw new ArcanaError('INVALID_ROUTE');
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  let previous: RouteNode | undefined;
  const visited = new Set<string>();
  for (const id of route.visited) {
    const current = byId.get(id);
    if (!current || visited.has(id) || (previous ? !previous.next.includes(id) : current.row !== 0))
      throw new ArcanaError('INVALID_ROUTE');
    visited.add(id);
    previous = current;
  }
  const destination = byId.get(nodeId);
  if (
    !destination ||
    visited.has(nodeId) ||
    (previous ? !previous.next.includes(nodeId) : destination.row !== 0)
  )
    throw new ArcanaError('INVALID_NODE');
  return Object.freeze({ ...route, visited: Object.freeze([...route.visited, nodeId]) });
}
