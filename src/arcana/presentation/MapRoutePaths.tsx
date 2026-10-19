import type { MapLayout } from './scenes/map-layout';
import { mapRouteConnections } from './map-route-connections';
import './map-route-clarity-a92.css';

/** Decorative counterpart of the route book. Hit targets and commands stay in MapPanel. */
export function MapRoutePaths({
  layout,
  visited,
  available,
  inspectedId,
  origin,
}: {
  layout: MapLayout;
  visited: readonly string[];
  available: readonly string[];
  inspectedId?: string | null;
  origin: { x: number; y: number };
}) {
  const path = (from: { x: number; y: number }, to: { x: number; y: number }) =>
    `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  return (
    <svg
      className="map-route-paths"
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {mapRouteConnections(layout, visited, available, inspectedId).map(
        ({ from, to, state, inspected }) => (
          <g
            key={`${from.id}:${to.id}`}
            data-route-from={from.id}
            data-route-to={to.id}
            data-route-state={state}
            data-route-inspected={inspected}
          >
            <path className="route-path-bed" d={path(from, to)} />
            <path className="route-path-ink" d={path(from, to)} />
          </g>
        ),
      )}
      {layout.nodes
        .filter(({ node }) => node.row === 0)
        .map((point) => (
          <g
            key={`origin:${point.id}`}
            data-route-origin={point.id}
            data-route-state={
              visited[0] === point.id ? 'visited' : visited.length === 0 ? 'available' : 'future'
            }
            data-route-inspected={inspectedId === point.id}
          >
            <path className="route-path-bed" d={path(origin, point)} />
            <path className="route-path-ink" d={path(origin, point)} />
          </g>
        ))}
    </svg>
  );
}
