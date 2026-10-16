// Existing genuine SVG library assets, not handmade illustrations. Retain license in every copy.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const vendor = process.argv[2] ?? '.tools/arcana-icons/package';
const production = 'design/arcana/production-v1/icons';
const output = 'src/arcana/presentation/content-packs/arcana';
const license = await readFile(vendor + '/LICENSE', 'utf8');
const metadata = JSON.parse(await readFile(output + '/pack.json', 'utf8'));
const records = JSON.parse(await readFile(output + '/assets.json', 'utf8'));
const icons = [
  ['node.duel', 'sword', 'Duelo', 'Duel'],
  ['node.refuge', 'flask', 'Refugio', 'Refuge'],
  ['node.chest', 'treasure-chest', 'Cofre', 'Chest'],
  ['node.pact', 'handshake', 'Pacto', 'Pact'],
  ['node.encounter', 'sparkle', 'Encuentro', 'Encounter'],
  ['node.boss', 'crown', 'Jefe', 'Boss'],
  ['currency.crowns', 'crown', 'Coronas', 'Crowns'],
  ['currency.essence', 'leaf', 'Esencia', 'Essence'],
];
const manifest = [];
await mkdir(production, { recursive: true });
await mkdir(output + '/art/icons', { recursive: true });
await writeFile(production + '/LICENSE', license);
for (const [id, name, es, en] of icons) {
  const original = await readFile(`${vendor}/assets/duotone/${name}-duotone.svg`, 'utf8');
  await writeFile(`${production}/${name}-duotone.svg`, original);
  const color = id.startsWith('node.') ? metadata.palette.paperInk : metadata.palette.gold;
  const prepared = original
    .replaceAll('fill="currentColor"', `fill="${color}"`)
    .replaceAll('fill="black"', `fill="${color}"`);
  const svg = prepared.replace('</svg>', `<!--\n${license.replaceAll('--', '—')}\n--></svg>`);
  const file = 'art/icons/' + id.replaceAll('.', '-') + '.svg';
  await writeFile(`${output}/${file}`, svg);
  records[id] = {
    path: file,
    width: 256,
    height: 256,
    alpha: true,
    pivot: [0.5, 0.5],
    alt: { es, en },
  };
  manifest.push({
    id,
    path: `${output}/${file}`,
    source: `${production}/${name}-duotone.svg`,
    author: 'Phosphor Icons',
    tool: 'Official SVG copy, deterministic fill transform',
    version: '@phosphor-icons/core 2.1.1',
    provenance: 'https://github.com/phosphor-icons/core',
    license: 'MIT, retained in the exported SVG',
    sourceSha256: createHash('sha256').update(original).digest('hex'),
    dimensions: [256, 256],
    alpha: 'SVG transparent background',
    variants: 'duotone',
    pivot: [0.5, 0.5],
    status: 'source-copied-context-review-pending',
    alt: { es, en },
  });
}
await writeFile(production + '/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
await writeFile(output + '/assets.json', JSON.stringify(records, null, 2) + '\n');
console.log(`Prepared ${icons.length} licensed SVG icons; no runtime icon dependency.`);
