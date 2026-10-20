import type { MapLayout } from './scenes/map-layout';

/** Read-only styling of public adjacency. A visited destination alone is not a travelled edge. */
export function mapRouteConnections(
  layout: MapLayout,
  visited: readonly string[],
  available: readonly string[],
  inspectedId?: string | null,
) {
  const travelled = new Set(visited.slice(1).map((id, index) => `${visited[index]}:${id}`));
  const current = visited.at(-1);
  return layout.edges.map(({ from, to }) => ({
    from,
    to,
    state: travelled.has(`${from.id}:${to.id}`)
      ? ('visited' as const)
      : from.id === current && available.includes(to.id)
        ? ('available' as const)
        : ('future' as const),
    inspected: !!inspectedId && (from.id === inspectedId || to.id === inspectedId),
  }));
}
