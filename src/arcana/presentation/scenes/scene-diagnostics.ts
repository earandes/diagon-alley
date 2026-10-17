/** Optional bounded test sink. Never enabled by game input or used as authority.
 * Submission duration is CPU/wall time around render(), not GPU completion. */
export interface SceneMetric {
  name: string;
  start: number;
  duration: number;
}
declare global {
  interface Window {
    __arcanaSceneMetric?: (metric: SceneMetric) => void;
  }
}
export const sceneStart = () => (window.__arcanaSceneMetric ? performance.now() : undefined);
export function sceneEnd(name: string, start: number | undefined) {
  if (start !== undefined)
    window.__arcanaSceneMetric?.({ name, start, duration: performance.now() - start });
}
