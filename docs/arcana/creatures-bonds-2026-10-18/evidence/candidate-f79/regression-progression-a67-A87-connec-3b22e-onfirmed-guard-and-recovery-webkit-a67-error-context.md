# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: progression-a67.spec.ts >> A87 connected creature company en arcana: fixed choices, temporary ownership, confirmed guard and recovery
- Location: tests/browser-trial/progression-a67.spec.ts:419:3

# Error details

```
Error: No remaining duel node
```

# Test source

```ts
  1  | import type { NodeGraph, NodeKind } from '../../src/arcana/domain/exploration/route';
  2  | /** Test traversal reads actual authority edges; IDs are not fixed coordinates anymore. */
  3  | export function routePath(graph: NodeGraph, visited: readonly string[], kind: NodeKind): string[] {
  4  |   const last = graph.nodes.find((n) => n.id === visited.at(-1));
  5  |   const starts = last ? last.next : graph.nodes.filter((n) => n.row === 0).map((n) => n.id);
  6  |   const queue = starts.map((id) => [id]);
  7  |   while (queue.length) {
  8  |     const path = queue.shift()!,
  9  |       node = graph.nodes.find((n) => n.id === path.at(-1))!;
  10 |     if (node.kind === kind) return path;
  11 |     for (const id of node.next) queue.push([...path, id]);
  12 |   }
> 13 |   throw Error(`No remaining ${kind} node`);
     |         ^ Error: No remaining duel node
  14 | }
  15 | 
```