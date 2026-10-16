import { validateGraph, type NodeGraph, type RouteNode } from '../../domain/exploration/route';
export interface MapPosition {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly node: RouteNode;
}
export interface MapLayout {
  readonly width: number;
  readonly height: number;
  readonly nodes: readonly MapPosition[];
  readonly edges: readonly { readonly from: MapPosition; readonly to: MapPosition }[];
}
/** Visual coordinates only; adjacency remains the graph supplied by authority. */
export function mapLayout(graph: NodeGraph, rowSpacing = 130): MapLayout {
  validateGraph(graph);
  if (!Number.isFinite(rowSpacing) || rowSpacing < 130)
    throw new RangeError('Invalid visual row spacing');
  const rows = [...new Set(graph.nodes.map((n) => n.row))].sort((a, b) => a - b),
    width = 600,
    // Reserve the measured label height below the first node as well as between rows.
    // Effect hints and enlarged text must fit inside the scrollable canvas surface.
    bottomPadding = rowSpacing + 24,
    height = rows.length * rowSpacing + bottomPadding;
  const positions: MapPosition[] = rows.flatMap((row, index) => {
    const layer = graph.nodes
      .filter((n) => n.row === row)
      .sort((a, b) => (a.column ?? 0) - (b.column ?? 0) || a.id.localeCompare(b.id));
    return layer.map((node, column) =>
      Object.freeze({
        id: node.id,
        node,
        x: (width * (column + 1)) / (layer.length + 1),
        y: height - bottomPadding - index * rowSpacing,
      }),
    );
  });
  const byId = new Map(positions.map((p) => [p.id, p]));
  return Object.freeze({
    width,
    height,
    nodes: Object.freeze(positions),
    edges: Object.freeze(
      positions.flatMap((from) =>
        from.node.next.map((id) => Object.freeze({ from, to: byId.get(id)! })),
      ),
    ),
  });
}

/** Fit the complete authority graph. Short viewports progress horizontally. */
export function fitMapLayout(graph: NodeGraph, width: number, height: number): MapLayout {
  validateGraph(graph);
  if (![width, height].every((n) => Number.isFinite(n) && n >= 132))
    throw new RangeError('Invalid map bounds');
  const rows = [...new Set(graph.nodes.map((n) => n.row))].sort((a, b) => a - b);
  const horizontal = width > height * 1.3 || (height < 440 && width >= 368);
  const nodes = rows.flatMap((row, index) => {
    const layer = graph.nodes
      .filter((n) => n.row === row)
      .sort((a, b) => (a.column ?? 0) - (b.column ?? 0));
    const progress = rows.length === 1 ? 0.5 : index / (rows.length - 1);
    return layer.map((node, column) =>
      Object.freeze({
        id: node.id,
        node,
        x: horizontal ? 52 + (width - 104) * progress : (width * (column + 1)) / (layer.length + 1),
        y: horizontal
          ? layer.length === 1
            ? height >= 244
              ? (height - 12) / 2
              : height / 2
            : height >= 244
              ? 76 + ((height - 164) * column) / (layer.length - 1)
              : 38 + ((height - 76) * column) / (layer.length - 1)
          : height - 88 - (height - 140) * progress,
      }),
    );
  });
  const byId = new Map(nodes.map((n) => [n.id, n]));
  return Object.freeze({
    width,
    height,
    nodes: Object.freeze(nodes),
    edges: Object.freeze(
      nodes.flatMap((from) =>
        from.node.next.map((id) => Object.freeze({ from, to: byId.get(id)! })),
      ),
    ),
  });
}
