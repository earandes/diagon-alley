import type { SceneData } from './pixi-scenes';
/** Static log acknowledgements still advance on the shared replay clock.
 * They require a snapshot paint, not a second continuous graphics ticker. */
export function sceneNeedsContinuousFrames(data: SceneData): boolean {
  if (data.kind !== 'arena') return false;
  // Preserve the legacy scene's local entrance timing when no shared clock exists.
  if (!data.clock || data.clock.snapshot().cursor === 0) return true;
  return (
    data.next?.kind === 'spell-cast' ||
    data.next?.kind === 'healed' ||
    data.next?.kind === 'burn-tick'
  );
}
