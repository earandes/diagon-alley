import { Rectangle, Sprite, Texture } from 'pixi.js';
import { alphaCertificate } from './scene-texture';
/** Atlas frames share the complete unchanged image source. Only large ordinary
 * actors use strips; boss limbs/props retain their existing actor hierarchy. */
export class SceneFigureAtlas {
  private readonly frames = new Map<Texture, readonly Texture[]>();
  private readonly parts = new WeakMap<
    Sprite,
    { texture: Texture; split: boolean; children: Sprite[] }
  >();
  configure(figure: Sprite, texture: Texture, large: boolean): void {
    const certificate = alphaCertificate(texture);
    const bands = certificate?.bands;
    const split = !!(
      large &&
      bands &&
      bands.length > 1 &&
      bands.length <= 16 &&
      bands.every(
        ([x, y, w, h], i) =>
          [x, y, w, h].every(Number.isInteger) &&
          x >= 0 &&
          y >= 0 &&
          w > 0 &&
          h > 0 &&
          x + w <= texture.width &&
          y + h <= texture.height &&
          (!i || y >= bands[i - 1][1] + bands[i - 1][3]),
      )
    );
    const previous = this.parts.get(figure);
    if (previous?.texture === texture && previous.split === split) return;
    for (const child of previous?.children ?? []) {
      figure.removeChild(child);
      child.destroy();
    }
    const children: Sprite[] = [];
    figure.texture = texture;
    if (split) {
      let frames = this.frames.get(texture);
      if (!frames) {
        frames = bands!.map(
          ([x, y, w, h]) =>
            new Texture({
              source: texture.source,
              orig: texture.orig.clone(),
              frame: new Rectangle(x, y, w, h),
              trim: new Rectangle(x, y, w, h),
            }),
        );
        this.frames.set(texture, frames);
      }
      figure.texture = frames[0];
      for (const frame of frames.slice(1)) {
        const child = new Sprite(frame);
        figure.addChild(child);
        children.push(child);
      }
    }
    this.parts.set(figure, { texture, split, children });
  }
  anchor(figure: Sprite, x: number, y: number): void {
    figure.anchor.set(x, y);
    for (const child of this.parts.get(figure)?.children ?? []) child.anchor.set(x, y);
  }
  destroy(): void {
    for (const frames of this.frames.values()) for (const texture of frames) texture.destroy(false);
    this.frames.clear();
  }
}
