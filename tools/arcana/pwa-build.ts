import type { ContentPack } from '../../src/arcana/presentation/content-packs/contract.ts';
import {
  DEFAULT_CONTENT_PACK_ID,
  getContentPack,
} from '../../src/arcana/presentation/content-packs/active.ts';
const activePack = getContentPack(DEFAULT_CONTENT_PACK_ID);
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import ts from 'typescript';
import type { Plugin } from 'vite';
interface BuildAsset {
  readonly fileName: string;
  readonly source: string | Uint8Array;
}
const crc = (bytes: Uint8Array) => {
  let value = 0xffffffff;
  for (const byte of bytes) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
  }
  return (value ^ 0xffffffff) >>> 0;
};
const chunk = (kind: string, data: Buffer) => {
  const payload = Buffer.concat([Buffer.from(kind), data]),
    length = Buffer.alloc(4),
    checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(crc(payload));
  return Buffer.concat([length, payload, checksum]);
};
/** Own geometric sigil with opaque background and maskable safe area; no external artwork. */
function icon(size: number): Buffer {
  const pixels = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const dx = (x + 0.5) / size - 0.5,
        dy = (y + 0.5) / size - 0.5;
      const gold =
        Math.abs(Math.hypot(dx, dy) - 0.28) < 0.012 || Math.abs(dx) + Math.abs(dy) < 0.105;
      const offset = y * (size * 3 + 1) + 1 + x * 3;
      pixels.set(gold ? [216, 184, 111] : [13, 33, 31], offset);
    }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(pixels)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
export function buildPwaAssets(input: readonly BuildAsset[]): readonly BuildAsset[] {
  if (
    !input.some((asset) => asset.fileName === 'index.html') ||
    input.some(
      (asset) =>
        !/^(index\.html|assets\/[A-Za-z0-9._-]+\.(js|css|svg|png|webp|woff2|ttf))$/.test(
          asset.fileName,
        ),
    )
  )
    throw Error('Only the compiled public shell can be precached');
  const manifest = JSON.stringify({
    id: './',
    name: activePack.brand,
    short_name: activePack.brand,
    start_url: './',
    scope: './',
    display: 'standalone',
    background_color: activePack.palette.background,
    theme_color: activePack.palette.surface,
    prefer_related_applications: false,
    icons: [192, 512].map((size) => ({
      src: `arcana-${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose: 'any maskable',
    })),
  });
  const assets: BuildAsset[] = [
    { fileName: 'manifest.webmanifest', source: manifest },
    ...[192, 512].map((size) => {
      const asset = (activePack.assets as ContentPack['assets'])[`pwa.icon.${size}`];
      const source = asset
        ? readFileSync(
            new URL(
              `../../src/arcana/presentation/content-packs/${asset.sourcePack ?? activePack.id}/${asset.path}`,
              import.meta.url,
            ),
          )
        : icon(size);
      return { fileName: `arcana-${size}.png`, source };
    }),
  ];
  const worker = ts.transpileModule(
    readFileSync(
      new URL('../../src/arcana/infrastructure/pwa/service-worker.ts', import.meta.url),
      'utf8',
    ),
    { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } },
  ).outputText;
  const ordered = [...input, ...assets].sort((a, b) =>
    a.fileName < b.fileName ? -1 : a.fileName > b.fileName ? 1 : 0,
  );
  const artwork = input
    .filter((asset) => /\.(webp|png|svg)$/.test(asset.fileName))
    .map((asset) => asset.fileName)
    .sort();
  const precache = ordered.filter((asset) => !artwork.includes(asset.fileName));
  const hash = createHash('sha256').update(worker);
  for (const asset of ordered) hash.update(asset.fileName).update(asset.source);
  const version = hash.digest('hex').slice(0, 24);
  const source = `const CACHE_NAME=${JSON.stringify('arcana-shell-' + version)};\nconst PRECACHE=${JSON.stringify(precache.map((asset) => asset.fileName))};\nconst ART_ASSETS=${JSON.stringify(artwork)};\n${worker}`;
  return Object.freeze([...assets, { fileName: 'service-worker.js', source }]);
}
export function arcanaPwa(): Plugin {
  return {
    name: 'arcana-static-shell',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: () => [
      { tag: 'link', attrs: { rel: 'manifest', href: './manifest.webmanifest' }, injectTo: 'head' },
      {
        tag: 'meta',
        attrs: { name: 'theme-color', content: activePack.palette.surface },
        injectTo: 'head',
      },
      {
        tag: 'link',
        attrs: { rel: 'apple-touch-icon', href: './arcana-192.png' },
        injectTo: 'head',
      },
    ],
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const assets = Object.values(bundle).map((asset) => ({
          fileName: asset.fileName,
          source: asset.type === 'chunk' ? asset.code : asset.source,
        }));
        for (const asset of buildPwaAssets(assets))
          this.emitFile({ type: 'asset', fileName: asset.fileName, source: asset.source });
      },
    },
  };
}
