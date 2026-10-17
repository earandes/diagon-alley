import { expect, it } from 'vitest';
import { Sprite, Texture, TextureSource } from 'pixi.js';
import { applySceneAlphaFrame } from '../../../src/arcana/presentation/scenes/scene-texture';
import { SceneFigureAtlas } from '../../../src/arcana/presentation/scenes/scene-figure';
it('reassembles strips in the original logical frame through anchor, scale and resize', () => {
  const source = new TextureSource({ width: 100, height: 100 });
  const texture = applySceneAlphaFrame(new Texture({ source }), {
    width: 100,
    height: 100,
    frame: [10, 0, 80, 100],
    bands: [
      [30, 0, 40, 50],
      [10, 50, 80, 50],
    ],
  });
  const reference = new Sprite(texture);
  reference.anchor.set(0.5, 1);
  reference.width = 200;
  reference.height = 200;
  const figure = new Sprite(texture);
  const atlas = new SceneFigureAtlas();
  atlas.configure(figure, texture, true);
  atlas.anchor(figure, 0.5, 1);
  figure.width = 200;
  figure.height = 200;
  expect(figure.children.length).toBe(1);
  expect(figure.getBounds().rectangle).toEqual(reference.getBounds().rectangle);
  const next = figure.children[0] as Sprite;
  expect(figure.texture.uvs.y2).toBe(next.texture.uvs.y0);
  atlas.configure(figure, texture, false);
  expect(figure.children.length).toBe(0);
  expect(figure.getBounds().rectangle).toEqual(reference.getBounds().rectangle);
  atlas.destroy();
  figure.destroy();
  reference.destroy();
  expect(source.destroyed).toBe(false);
  texture.destroy(true);
  expect(source.destroyed).toBe(true);
});
it('uses one source for repeated copies and has a whole-image fallback without certificates', () => {
  const texture = new Texture({ source: new TextureSource({ width: 20, height: 20 }) });
  const atlas = new SceneFigureAtlas();
  const figure = new Sprite(texture);
  atlas.configure(figure, texture, true);
  expect(figure.texture).toBe(texture);
  expect(figure.children.length).toBe(0);
  atlas.destroy();
  figure.destroy();
  texture.destroy(true);
});
