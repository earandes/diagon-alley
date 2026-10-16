import { describe, expect, it, vi } from 'vitest';
import {
  generateRoute,
  type RouteGeneration,
} from '../../../src/arcana/domain/exploration/generate-route';
import {
  validateGraph,
  createRoute,
  advanceRoute,
} from '../../../src/arcana/domain/exploration/route';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
const config = (): RouteGeneration => ({
  version: 1,
  idPrefix: 'route',
  widths: [1, 2, 3, 3, 3, 3],
  kinds: [
    { kind: 'duel', weight: 3 },
    { kind: 'refuge', weight: 1 },
    { kind: 'chest', weight: 1 },
    { kind: 'pact', weight: 1 },
    { kind: 'encounter', weight: 1 },
  ],
});
describe('ARCANA seeded branching graph generation', () => {
  it('generates fifteen nodes plus one boss reproducibly without mutating configuration', () => {
    const input = config(),
      original = structuredClone(input),
      a = generateRoute(input, new SeededRandom(42)),
      b = generateRoute(input, new SeededRandom(42));
    expect(a).toEqual(b);
    expect(input).toEqual(original);
    expect(a.nodes).toHaveLength(16);
    expect(a.nodes.filter((n) => n.kind === 'boss')).toHaveLength(1);
    expect(() => validateGraph(a)).not.toThrow();
    expect(Object.isFrozen(a.nodes)).toBe(true);
    expect(a.nodes[0]).toMatchObject({ row: 0, column: 0 });
    expect(a.nodes.at(-1)).toMatchObject({ kind: 'boss', row: 6, next: [] });
  });
  it('has reachable branches and supports a valid root-to-boss route with no skipped edge', () => {
    const graph = generateRoute(config(), new SeededRandom(9));
    let run = createRoute('run', graph),
      node = graph.nodes.find((n) => n.row === 0)!;
    while (true) {
      run = advanceRoute(run, graph, node.id);
      if (node.kind === 'boss') break;
      node = graph.nodes.find((n) => n.id === node.next[0])!;
    }
    expect(run.visited).toHaveLength(7);
    expect(graph.nodes.some((n) => n.next.length > 1)).toBe(true);
    expect(
      graph.nodes.every((n) =>
        n.next.every((id) => graph.nodes.find((target) => target.id === id)!.row === n.row + 1),
      ),
    ).toBe(true);
  });
  it('uses provided type weights and responds to a changed seed', () => {
    const input = { ...config(), kinds: [{ kind: 'refuge' as const, weight: 1 }] };
    expect(
      generateRoute(input, new SeededRandom(1))
        .nodes.filter((n) => n.kind !== 'boss')
        .every((n) => n.kind === 'refuge'),
    ).toBe(true);
    expect(generateRoute(config(), new SeededRandom(1))).not.toEqual(
      generateRoute(config(), new SeededRandom(2)),
    );
  });
  it('rejects invalid sizes, weights, IDs and version before requesting random', () => {
    const random = { ticket: vi.fn(() => 0) };
    for (const input of [
      { ...config(), widths: [] },
      { ...config(), widths: [0] },
      { ...config(), widths: [NaN] },
      { ...config(), widths: [1001] },
      { ...config(), kinds: [] },
      { ...config(), kinds: [{ kind: 'duel' as const, weight: -1 }] },
      { ...config(), idPrefix: 'invalid id' },
      { ...config(), version: 0 },
    ])
      expect(() => generateRoute(input, random)).toThrow('INVALID_GRAPH');
    expect(random.ticket).not.toHaveBeenCalled();
  });
  it('rejects an invalid random ticket instead of returning a partial graph', () => {
    expect(() => generateRoute(config(), { ticket: () => -1 })).toThrow('INVALID_RANDOM_TICKET');
  });
});
