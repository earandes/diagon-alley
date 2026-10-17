import type { SceneData, ArenaPosition } from './pixi-scenes';
const samePositions = (a?: readonly ArenaPosition[], b?: readonly ArenaPosition[]) =>
  a === b ||
  (!!a &&
    !!b &&
    a.length === b.length &&
    a.every(
      (p, i) =>
        p.id === b[i].id &&
        p.x === b[i].x &&
        p.y === b[i].y &&
        p.figureHeight === b[i].figureHeight,
    ));
/** Geometry owns placement, appearance and fallen pose; PV/PM and phase are projected separately. */
export function sameSceneGeometry(a: SceneData, b: SceneData): boolean {
  if (a.kind === 'map' && b.kind === 'map')
    return (
      a.layout === b.layout &&
      a.visited.length === b.visited.length &&
      a.visited.every((id, i) => id === b.visited[i]) &&
      a.available.length === b.available.length &&
      a.available.every((id, i) => id === b.available[i])
    );
  if (a.kind !== 'arena' || b.kind !== 'arena') return false;
  if (!samePositions(a.positions, b.positions)) return false;
  if (a.boss?.id !== b.boss?.id || a.boss?.wizardId !== b.boss?.wizardId) return false;
  return (['player', 'rival'] as const).every(
    (side) =>
      a.frame[side].length === b.frame[side].length &&
      a.frame[side].every((u, i) => {
        const other = b.frame[side][i];
        return (
          u.id === other.id &&
          u.wizardId === other.wizardId &&
          u.hp > 0 === other.hp > 0 &&
          a.appearances?.[u.id] === b.appearances?.[other.id]
        );
      }),
  );
}
