import { describe, expect, it } from 'vitest';
import {
  advanceRoute,
  createRoute,
  validateGraph,
  type NodeGraph,
} from '../../../src/arcana/domain/exploration/route';
// Small test graph. This is not the production map or approved encounter content.
const graph: NodeGraph = {
  version: 1,
  nodes: [
    { id: 'a', row: 0, kind: 'duel', next: ['b', 'c'] },
    { id: 'b', row: 1, kind: 'refuge', next: ['boss'] },
    { id: 'c', row: 1, kind: 'chest', next: ['boss'] },
    { id: 'boss', row: 2, kind: 'boss', next: [] },
  ],
};
describe('ARCANA EX01–03 route rules', () => {
  it('allows a root followed by a connected branch and its boss', () => {
    const initial = createRoute('run', graph);
    const start = advanceRoute(initial, graph, 'a');
    const branch = advanceRoute(start, graph, 'b');
    expect(advanceRoute(branch, graph, 'boss').visited).toEqual(['a', 'b', 'boss']);
    expect(initial.visited).toEqual([]);
  });
  it('rejects skipping a root, unknown IDs, replay and cross-branch jumps', () => {
    const initial = createRoute('run', graph);
    expect(() => advanceRoute(initial, graph, 'boss')).toThrow('INVALID_NODE');
    expect(() => advanceRoute(initial, graph, 'unknown')).toThrow('INVALID_NODE');
    const branch = advanceRoute(advanceRoute(initial, graph, 'a'), graph, 'b');
    for (const id of ['a', 'b', 'c'])
      expect(() => advanceRoute(branch, graph, id)).toThrow('INVALID_NODE');
  });
  it('rejects a route built against another graph version', () => {
    expect(() => advanceRoute(createRoute('run', graph), { ...graph, version: 2 }, 'a')).toThrow(
      'STALE_GRAPH',
    );
  });
  it.each([
    { ...graph, nodes: [...graph.nodes, graph.nodes[0]] },
    { ...graph, nodes: graph.nodes.map((n) => (n.id === 'a' ? { ...n, next: ['missing'] } : n)) },
    { ...graph, nodes: graph.nodes.map((n) => (n.id === 'b' ? { ...n, next: ['a'] } : n)) },
    { ...graph, nodes: graph.nodes.map((n) => (n.id === 'a' ? { ...n, next: ['b'] } : n)) },
    {
      ...graph,
      nodes: graph.nodes.filter((n) => n.kind !== 'boss').map((n) => ({ ...n, next: [] })),
    },
    { ...graph, nodes: graph.nodes.map((n) => (n.id === 'boss' ? { ...n, next: ['a'] } : n)) },
  ])('rejects invalid graph references, cycles, unreachable nodes or missing boss', (invalid) => {
    expect(() => validateGraph(invalid)).toThrow('INVALID_GRAPH');
  });
  it('does not trust a malformed or fabricated persisted route', () => {
    const route = { ...createRoute('run', graph), visited: ['a', 'c', 'b'] };
    expect(() => advanceRoute(route, graph, 'boss')).toThrow('INVALID_ROUTE');
  });
});
