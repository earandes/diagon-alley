import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { expect, it } from 'vitest';
import manifest from '../../../design/production/account-symbols-v1/manifest.json';
import diagon from '../../../src/arcana/presentation/content-packs/diagon-alley/assets.json';
import arcana from '../../../src/arcana/presentation/content-packs/arcana/assets.json';

it('keeps each runtime symbol identical to its editable source and provenance record', () => {
  for (const asset of manifest.assets) {
    const source = readFileSync(asset.sourceEditable, 'utf8');
    const runtime = readFileSync(asset.runtime, 'utf8');
    expect(runtime).toBe(source);
    expect(createHash('sha256').update(runtime).digest('hex')).toBe(asset.sha256);
    expect(Buffer.byteLength(runtime)).toBe(asset.bytes);
    expect(asset.bytes).toBeLessThan(8000);
    expect(runtime).toContain('viewBox="0 0 512 512"');
    // Functional labels stay in the DOM. Image loads cannot run code, embed
    // external art/fonts, or acquire new network dependencies.
    expect(runtime).not.toMatch(
      /<(?:text|script|image|foreignObject)\b|(?:href|onload|onclick)\s*=/i,
    );
    expect(runtime).not.toMatch(/url\(\s*["']?(?:https?:|data:)/i);
  }
});
it('gives both skins the same stable roles with distinct vector compositions', () => {
  for (const assets of [diagon, arcana]) {
    const keys = ['brand.emblem', 'account.login', 'account.register'] as const;
    expect(new Set(keys.map((key) => assets[key].path)).size).toBe(3);
    for (const key of keys) {
      expect(assets[key].alpha).toBe(true);
      expect(assets[key].alt.es).not.toBe('');
      expect(assets[key].alt.en).not.toBe('');
    }
  }
  expect(manifest.assets).toHaveLength(6);
});
