import { expect, it } from 'vitest';
import { Texture, TextureSource } from 'pixi.js';
import { applySceneAlphaFrame } from '../../../src/arcana/presentation/scenes/scene-texture';
import metadata from '../../../src/arcana/presentation/scenes/scene-alpha.json';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
it('keeps logical framing/pivots while removing only certified transparent margins from UV geometry', () => {
  let texture = new Texture({ source: new TextureSource({ width: 342, height: 428 }) });
  texture = applySceneAlphaFrame(texture, { width: 342, height: 428, frame: [11, 20, 321, 408] });
  expect([texture.width, texture.height]).toEqual([342, 428]);
  expect([texture.orig.x, texture.orig.y]).toEqual([0, 0]);
  expect([texture.trim?.x, texture.trim?.y, texture.trim?.width, texture.trim?.height]).toEqual([
    11, 20, 321, 408,
  ]);
  expect(texture.uvs.x0).toBeCloseTo(11 / 342);
  expect(texture.uvs.y1).toBeCloseTo(20 / 428);
  texture.destroy(true);
});
it('falls back to the full frame when artwork dimensions or metadata are incompatible', () => {
  const texture = new Texture({ source: new TextureSource({ width: 100, height: 100 }) });
  for (const frame of [
    undefined,
    { width: 342, height: 428, frame: [11, 20, 321, 408] },
    { width: 100, height: 100, frame: [-1, 0, 50, 50] },
    { width: 100, height: 100, frame: [50, 0, 100, 100] },
  ]) {
    applySceneAlphaFrame(texture, frame);
    expect(texture.trim).toBeUndefined();
    expect(texture.frame.width).toBe(100);
  }
  texture.destroy(true);
});
it('ties every trim certificate to its unchanged active artwork bytes', () => {
  for (const [path, record] of Object.entries(metadata.records)) {
    const source = readFileSync(`src/arcana/presentation/content-packs/${path}`);
    expect(createHash('sha256').update(source).digest('hex'), path).toBe(record.sha256);
  }
});
