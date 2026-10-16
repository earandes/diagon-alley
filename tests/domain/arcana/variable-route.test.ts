import { expect, it } from 'vitest';
import { randomizeRoute } from '../../../src/arcana/domain/exploration/randomize-route';
import { validateGraph } from '../../../src/arcana/domain/exploration/route';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { fitMapLayout } from '../../../src/arcana/presentation/scenes/map-layout';
it('reproduces variable valid routes without changing identities or stranding a two-member team', () => {
  const graph = trialConfiguration().campaign.graph,
    original = structuredClone(graph);
  const variants = new Set<string>();
  for (let seed = 0; seed < 100; seed++) {
    const result = randomizeRoute(graph, new SeededRandom(seed));
    expect(result).toEqual(randomizeRoute(graph, new SeededRandom(seed)));
    expect(() => validateGraph(result)).not.toThrow();
    expect(result.nodes.map((n) => [n.id, n.kind]).sort()).toEqual(
      graph.nodes.map((n) => [n.id, n.kind]).sort(),
    );
    const chest = result.nodes.find((n) => n.row === 1 && n.kind === 'chest')!;
    expect(chest.next.every((id) => result.nodes.find((n) => n.id === id)?.kind === 'pact')).toBe(
      true,
    );
    variants.add(JSON.stringify(result));
  }
  expect(variants.size).toBeGreaterThan(90);
  expect(graph).toEqual(original);
});
it('rejects a random source outside its bounds', () => {
  expect(() => randomizeRoute(trialConfiguration().campaign.graph, { ticket: (n) => n })).toThrow();
});
it('fits every 44px target into portrait and landscape maps without overlap', () => {
  const graph = trialConfiguration().campaign.graph;
  for (const [width, height] of [
    [320, 600],
    [320, 408],
    [390, 408],
    [390, 500],
    [1440, 680],
    [844, 220],
  ]) {
    const layout = fitMapLayout(graph, width, height);
    for (const a of layout.nodes) {
      expect(a.x).toBeGreaterThanOrEqual(22);
      expect(a.y).toBeGreaterThanOrEqual(22);
      expect(a.x).toBeLessThanOrEqual(width - 22);
      expect(a.y).toBeLessThanOrEqual(height - 22);
      for (const b of layout.nodes.filter((b) => a.id !== b.id))
        expect(Math.abs(a.x - b.x) >= 44 || Math.abs(a.y - b.y) >= 44).toBe(true);
    }
  }
});
