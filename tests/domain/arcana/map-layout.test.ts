import { it, expect } from 'vitest';
import { mapLayout } from '../../../src/arcana/presentation/scenes/map-layout';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
it('places every node and edge in ascending progression with branch-separated coordinates', () => {
  const { campaign } = trialConfiguration(),
    layout = mapLayout(campaign.graph);
  expect(layout.nodes).toHaveLength(16);
  expect(layout.edges).toHaveLength(
    campaign.graph.nodes.reduce((n, node) => n + node.next.length, 0),
  );
  expect(new Set(layout.nodes.map((n) => `${n.x}:${n.y}`)).size).toBe(16);
  for (const edge of layout.edges) expect(edge.to.y).toBeLessThan(edge.from.y);
});
it('centers first and last rows and uses immutable positions shared by DOM and Pixi', () => {
  const { campaign } = trialConfiguration(),
    layout = mapLayout(campaign.graph);
  expect(layout.nodes.find((n) => n.id === 'pasaje:0:0')?.x).toBe(layout.width / 2);
  expect(layout.nodes.find((n) => n.id === 'pasaje:6:0')?.x).toBe(layout.width / 2);
  expect(Object.isFrozen(layout.nodes[0])).toBe(true);
});
it('increases visual row spacing for enlarged labels without changing graph identities or adjacency', () => {
  const { campaign } = trialConfiguration();
  const regular = mapLayout(campaign.graph);
  const enlarged = mapLayout(campaign.graph, 260);
  expect(enlarged.height).toBeGreaterThan(regular.height);
  expect(enlarged.nodes.map((n) => n.id)).toEqual(regular.nodes.map((n) => n.id));
  expect(enlarged.edges.map((e) => [e.from.id, e.to.id])).toEqual(
    regular.edges.map((e) => [e.from.id, e.to.id]),
  );
  const first = enlarged.nodes.find((n) => n.id === 'pasaje:0:0')!;
  const second = enlarged.nodes.find((n) => n.id === 'pasaje:1:0')!;
  expect(first.y - second.y).toBe(260);
});
