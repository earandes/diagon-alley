import type { NodeGraph, NodeKind } from '../../src/arcana/domain/exploration/route';
/** Test traversal reads actual authority edges; IDs are not fixed coordinates anymore. */
export function routePath(graph: NodeGraph, visited: readonly string[], kind: NodeKind): string[] {
  const last = graph.nodes.find((n) => n.id === visited.at(-1));
  const starts = last ? last.next : graph.nodes.filter((n) => n.row === 0).map((n) => n.id);
  const queue = starts.map((id) => [id]);
  while (queue.length) {
    const path = queue.shift()!,
      node = graph.nodes.find((n) => n.id === path.at(-1))!;
    if (node.kind === kind) return path;
    for (const id of node.next) queue.push([...path, id]);
  }
  throw Error(`No remaining ${kind} node`);
}
