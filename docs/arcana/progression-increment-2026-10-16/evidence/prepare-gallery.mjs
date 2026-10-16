import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, mkdir, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const python = process.env.ARCANA_GALLERY_PYTHON ?? 'python3';
const evidence = 'docs/arcana/progression-increment-2026-10-16/evidence';
const gallery = `${evidence}/gallery`;
await mkdir(gallery, { recursive: true });
const images = [
  [
    'before-map-865',
    `${evidence}/before/map-865.png`,
    'A67 reference captured before implementation; different random route/accounts from after.',
  ],
  [
    'historical-encounter-390',
    'docs/arcana/expert-review-2026-10-15/evidence/captures/es-node-encounter-390.png',
    'Historical A62 browser capture2026-10-15; not an equivalent A67 baseline.',
  ],
  [
    'historical-workshop-390',
    'docs/arcana/expert-review-2026-10-15/evidence/captures/es-25-workshop-390.png',
    'Historical A62 browser capture2026-10-15; not an equivalent A67 baseline.',
  ],
  ...[1280, 390, 865].map((w) => [
    `challenge-${w}`,
    `${evidence}/browser/chromium-a67-diagon-alley-es-challenge-picker-${w}.png`,
    'A67 isolated account; no economic operation on challenge selection.',
  ]),
  [
    'map-discovery-865',
    `${evidence}/browser/chromium-a67-diagon-alley-es-map-discovery-865.png`,
    'A67 Discovery new run.',
  ],
  [
    'map-tactical-390',
    `${evidence}/browser/chromium-a67-en-map-tactical-390.png`,
    'A67 Tactical new run with forged equipment; English.',
  ],
  ...[1280, 390, 865].map((w) => [
    `encounter-es-${w}`,
    `${evidence}/browser/chromium-a67-diagon-alley-es-encounter-unit-${w}.png`,
    'A67 unit trade; declared SQL fixture50%HP/MP on own newly created account.',
  ]),
  ...[1280, 390, 865].map((w) => [
    `encounter-arcana-en-${w}`,
    `${evidence}/browser/chromium-a67-arcana-en-encounter-unit-${w}.png`,
    'A67 ARCANA English reduced motion; declared condition fixture.',
  ]),
  ...[1280, 390].map((w) => [
    `encounter-team-${w}`,
    `${evidence}/browser/chromium-a67-es-encounter-group-${w}.png`,
    'A67 team trade before lost-response recovery; declared condition fixture.',
  ]),
  ...[1280, 390].map((w) => [
    `encounter-saved-${w}`,
    `${evidence}/browser/chromium-a67-diagon-alley-es-encounter-confirmed-${w}.png`,
    'A67 authority-confirmed persisted trade result, optional receipt opened.',
  ]),
  [
    'workshop-es-390',
    `${evidence}/browser/chromium-a67-es-workshop-v2-390.png`,
    'A67 real ForgeV2 purchases, fixed original costs.',
  ],
  [
    'workshop-en-1280',
    `${evidence}/browser/chromium-a67-en-workshop-v2-1280.png`,
    'A67 real ForgeV2 purchases, English.',
  ],
  ...[1280, 390].map((w) => [
    `arena-specialized-${w}`,
    `${evidence}/browser/chromium-a67-es-specialized-arena-${w}.png`,
    'A67 real confirmed BattleLog after Phoenix equipment; replay is not simulation.',
  ]),
  [
    'adverse-es-390',
    `${evidence}/browser/chromium-a67-es-adverse-encounter-200-390.png`,
    'Declared missing WebP/WebGL fixtures, text200%, reduced motion. Scroll allowed.',
  ],
  [
    'adverse-en-865',
    `${evidence}/browser/chromium-a67-en-adverse-encounter-200-865.png`,
    'Declared missing WebP/WebGL fixtures, text200%, English.',
  ],
];
const manifest = [];
for (const [id, source, note] of images) {
  const target = `${gallery}/${id}.webp`;
  const result = spawnSync(
    python,
    [
      '-c',
      'from PIL import Image; import sys; Image.open(sys.argv[1]).save(sys.argv[2], format="WEBP", quality=85, method=6)',
      resolve(source),
      resolve(target),
    ],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) throw Error(`${source}: ${result.stderr}`);
  manifest.push({
    id,
    source,
    target,
    note,
    sourceSha256: createHash('sha256')
      .update(await readFile(source))
      .digest('hex'),
    targetSha256: createHash('sha256')
      .update(await readFile(target))
      .digest('hex'),
    bytes: (await stat(target)).size,
    transformation:
      'PNG→WebP quality85. Original dimensions preserved; no crop, retouch or UI changes.',
    command: [
      'python3',
      'Pillow Image.open(source).save(target, format=WEBP, quality=85, method=6)',
    ],
  });
}
await writeFile(
  `${gallery}/manifest.json`,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      images: manifest,
      totalImageBytes: manifest.reduce((sum, item) => sum + item.bytes, 0),
      tool: 'Bundled local Python/Pillow/libwebp; no paid service',
      originals:
        'PNG originals retained locally in evidence/browser and historical sources, not overwritten.',
    },
    null,
    2,
  ),
);
console.log(
  `${manifest.length} images, ${manifest.reduce((sum, item) => sum + item.bytes, 0)} bytes`,
);
