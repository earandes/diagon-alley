import { it, expect } from 'vitest';
import {
  DEFAULT_CONTENT_PACK_ID,
  getContentPack,
} from '../../../src/arcana/presentation/content-packs/active';
import { buildPwaAssets } from '../../../tools/arcana/pwa-build';
const bundle = [
  { fileName: 'index.html', source: '<html>ARCANA</html>' },
  { fileName: 'assets/app-a.js', source: 'const app=1;' },
  { fileName: 'assets/app-a.css', source: 'body{}' },
];
it('emits a standalone manifest, genuine 192/512 PNGs and a shell worker with an exact public allowlist', () => {
  const assets = buildPwaAssets(bundle);
  const manifest = JSON.parse(
    String(assets.find((asset) => asset.fileName === 'manifest.webmanifest')?.source),
  );
  expect(manifest).toMatchObject({
    name: getContentPack(DEFAULT_CONTENT_PACK_ID).brand,
    display: 'standalone',
    start_url: './',
    scope: './',
    prefer_related_applications: false,
  });
  for (const size of [192, 512]) {
    const png = Buffer.from(
      assets.find((asset) => asset.fileName === `arcana-${size}.png`)!.source,
    );
    expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(png.readUInt32BE(16)).toBe(size);
    expect(png.readUInt32BE(20)).toBe(size);
  }
  const worker = String(assets.find((asset) => asset.fileName === 'service-worker.js')?.source);
  expect(worker).toContain('assets/app-a.js');
  expect(worker).toContain('manifest.webmanifest');
  expect(worker).not.toContain('/api/state');
  expect(() =>
    buildPwaAssets([...bundle, { fileName: 'api/state', source: 'private state' }]),
  ).toThrow();
});
it('versions the cache by build contents while keeping identical builds deterministic', () => {
  expect(buildPwaAssets(bundle)).toEqual(buildPwaAssets(bundle));
  const worker = (assets: ReturnType<typeof buildPwaAssets>) =>
    assets.find((asset) => asset.fileName === 'service-worker.js')!.source;
  expect(worker(buildPwaAssets(bundle))).not.toBe(
    worker(
      buildPwaAssets(bundle.map((asset) => ({ ...asset, source: asset.source + ' changed' }))),
    ),
  );
});
it('defers illustration downloads instead of precaching the full collection', () => {
  const assets = buildPwaAssets([
    ...bundle,
    { fileName: 'assets/portrait-a.webp', source: new Uint8Array([1, 2, 3]) },
  ]);
  const source = String(assets.find((a) => a.fileName === 'service-worker.js')!.source);
  const precache = JSON.parse(source.match(/const PRECACHE=(.*);\n/)![1]);
  expect(precache).not.toContain('assets/portrait-a.webp');
  expect(source).toContain('const ART_ASSETS=["assets/portrait-a.webp"]');
});
it('precaches a compiled local TrueType font while rejecting remote, traversal and API font URLs', () => {
  const assets = buildPwaAssets([
    ...bundle,
    { fileName: 'assets/cinzel-latin-variable-a12.ttf', source: new Uint8Array([0, 1, 0, 0]) },
  ]);
  const source = String(assets.find((asset) => asset.fileName === 'service-worker.js')!.source);
  const precache = JSON.parse(source.match(/const PRECACHE=(.*);\n/)![1]);
  expect(precache).toContain('assets/cinzel-latin-variable-a12.ttf');
  for (const fileName of [
    'https://fonts.example/font.ttf',
    '/api/fonts/font.ttf',
    'assets/../secret.ttf',
    'assets/font.ttf?token=private',
  ])
    expect(() => buildPwaAssets([...bundle, { fileName, source: 'private' }])).toThrow(
      /public shell/,
    );
});
