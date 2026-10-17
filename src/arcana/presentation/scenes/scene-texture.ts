import { Rectangle, Texture } from 'pixi.js';
import { packAssetUrls } from '../content-packs/active';
import metadata from './scene-alpha.json';
// URL metadata only: no image fetch or global GPU texture cache.
const urls = packAssetUrls();
const frames = new Map(
  Object.entries(metadata.records).flatMap(([path, frame]) => {
    const url = urls[`./${path}`];
    return typeof url === 'string' ? [[new URL(url, import.meta.url).href, frame] as const] : [];
  }),
);
/** Omit only alpha-zero margins from the quad. The complete source, logical frame,
 * pivots and resolution are unchanged; missing/stale-size metadata uses the full image. */
export function sceneTexture(image: HTMLImageElement, url: string): Texture {
  return applySceneAlphaFrame(Texture.from(image), frames.get(new URL(url, import.meta.url).href));
}
export function applySceneAlphaFrame(
  texture: Texture,
  frame?: {
    width: number;
    height: number;
    frame: readonly number[];
  },
): Texture {
  if (!frame || frame.width !== texture.width || frame.height !== texture.height) return texture;
  const [x, y, width, height] = frame.frame;
  if (
    frame.frame.length !== 4 ||
    !frame.frame.every(Number.isInteger) ||
    x < 0 ||
    y < 0 ||
    width <= 0 ||
    height <= 0 ||
    x + width > frame.width ||
    y + height > frame.height
  )
    return texture;
  const trimmed = new Texture({
    source: texture.source,
    frame: new Rectangle(x, y, width, height),
    orig: texture.orig.clone(),
    trim: new Rectangle(x, y, width, height),
  });
  // Transfer the scene-owned source; remove the unused full-frame cache wrapper.
  texture.destroy(false);
  return trimmed;
}
