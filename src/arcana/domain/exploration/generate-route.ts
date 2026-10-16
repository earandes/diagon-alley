import type { RandomTickets } from '../combat/random';
import { ArcanaError } from '../errors';
import { validDomainId } from '../identifiers';
import { createNodeCoordinate } from './coordinate';
import { validateGraph, type NodeGraph, type NodeKind, type RouteNode } from './route';
export interface RouteGeneration {
  readonly version: number;
  readonly idPrefix: string;
  readonly widths: readonly number[];
  readonly kinds: readonly { readonly kind: Exclude<NodeKind, 'boss'>; readonly weight: number }[];
}
/** Generation is a domain service. Content distribution remains supplied, versioned data. */
export function generateRoute(configuration: RouteGeneration, random: RandomTickets): NodeGraph {
  const invalid = () => {
    throw new ArcanaError('INVALID_GRAPH');
  };
  if (
    !configuration ||
    !Number.isSafeInteger(configuration.version) ||
    configuration.version < 1 ||
    !validDomainId(configuration.idPrefix) ||
    !Array.isArray(configuration.widths) ||
    !configuration.widths.length ||
    configuration.widths.some((n) => !Number.isSafeInteger(n) || n < 1) ||
    configuration.widths.reduce((n, width) => n + width, 0) > 1000 ||
    !Array.isArray(configuration.kinds) ||
    !configuration.kinds.length ||
    new Set(configuration.kinds.map((entry) => entry.kind)).size !== configuration.kinds.length ||
    configuration.kinds.some(
      (entry) =>
        !['duel', 'refuge', 'chest', 'pact', 'encounter'].includes(entry.kind) ||
        !Number.isSafeInteger(entry.weight) ||
        entry.weight <= 0,
    )
  )
    invalid();
  const total = configuration.kinds.reduce((n, entry) => n + entry.weight, 0);
  if (!Number.isSafeInteger(total) || total > 2 ** 32) invalid();
  const id = (row: number, column: number) => `${configuration.idPrefix}:${row}:${column}`;
  const coordinates = [...configuration.widths, 1].map((width, row) =>
    Array.from({ length: width }, (_, column) => createNodeCoordinate(row, column)),
  );
  if (
    coordinates.some((layer) =>
      layer.some((coordinate) => !validDomainId(id(coordinate.row, coordinate.column))),
    )
  )
    invalid();
  const ticket = (bound: number) => {
    const value = random.ticket(bound);
    if (!Number.isSafeInteger(value) || value < 0 || value >= bound)
      throw new ArcanaError('INVALID_RANDOM_TICKET');
    return value;
  };
  const kind = (): NodeKind => {
    let choice = ticket(total);
    for (const entry of configuration.kinds) {
      if (choice < entry.weight) return entry.kind;
      choice -= entry.weight;
    }
    throw new ArcanaError('INVALID_RANDOM_TICKET');
  };
  const layers = coordinates.map((layer, row) =>
    layer.map((coordinate) => ({
      ...coordinate,
      id: id(coordinate.row, coordinate.column),
      kind: row === configuration.widths.length ? ('boss' as const) : kind(),
      next: [] as string[],
    })),
  );
  for (let row = 0; row < layers.length - 1; row++) {
    const sources = layers[row],
      destinations = layers[row + 1];
    // Incoming coverage first; a wide row cannot leave disconnected destinations.
    for (const [index, target] of destinations.entries())
      sources[index % sources.length].next.push(target.id);
    for (const source of sources) {
      const destination = destinations[ticket(destinations.length)].id;
      if (!source.next.includes(destination)) source.next.push(destination);
    }
  }
  const nodes: readonly RouteNode[] = Object.freeze(
    layers.flat().map((node) => Object.freeze({ ...node, next: Object.freeze([...node.next]) })),
  );
  const graph = Object.freeze({ version: configuration.version, nodes });
  validateGraph(graph);
  return graph;
}
