// Deterministic export preparation only: preserves masters; no illustration generation.
import { readdir, readFile, writeFile, mkdir, access, unlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
const modulePath = process.argv[2];
if (!modulePath) throw Error('Pass the available sharp module path; see production README.');
const { default: sharp } = await import(resolve(modulePath));
const production = 'design/arcana/production-v1';
const output = 'src/arcana/presentation/content-packs/arcana';
const previous = JSON.parse(await readFile(join(output, 'assets.json'), 'utf8'));
const records = Object.fromEntries(
  Object.entries(previous).filter(
    ([key]) => key.startsWith('node.') || key.startsWith('currency.'),
  ),
);
const exports = [];
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};
async function emit(key, source, width, height, alpha, alt, crop) {
  const raw = await readFile(source);
  let image = sharp(raw);
  if (crop) image = image.extract(crop);
  let prepared = image.resize(width, height, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  const icon = key.startsWith('pwa.icon.');
  if (icon) prepared = prepared.flatten({ background: '#0d211f' });
  const bytes = await (
    icon ? prepared.png() : prepared.webp({ quality: 84, alphaQuality: 100 })
  ).toBuffer();
  const path = `art/${key.replaceAll('.', '/')}.${icon ? 'png' : 'webp'}`;
  await mkdir(resolve(output, path, '..'), { recursive: true });
  await writeFile(join(output, path), bytes);
  const metadata = await sharp(bytes).metadata();
  if (alpha && !metadata.hasAlpha) throw Error('Alpha lost: ' + key);
  records[key] = {
    path,
    width: metadata.width,
    height: metadata.height,
    alpha: metadata.hasAlpha ?? false,
    pivot: [0.5, 0.9],
    alt,
  };
  const manifestPath = (await exists(resolve(source, '..', 'manifest.json')))
    ? resolve(source, '..', 'manifest.json')
    : resolve(source, '..', 'manifest-v1.json');
  exports.push({
    key,
    source,
    provenanceManifest: manifestPath.replace(resolve('.') + '/', ''),
    sourceSha256: hash(raw),
    export: join(output, path),
    exportSha256: hash(bytes),
    bytes: bytes.length,
    width: metadata.width,
    height: metadata.height,
    hasAlpha: metadata.hasAlpha,
    crop: crop ?? null,
    transform: icon
      ? 'sharp resize contain, PNG flattened on ARCANA background'
      : 'sharp resize contain, WebP quality84 alpha100',
    status: 'source-reviewed-export-context-review-pending',
  });
}
for (const category of ['characters', 'rivals', 'scenes', 'products']) {
  const folder = join(production, category);
  if (!(await exists(folder))) continue;
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = join(folder, entry.name);
    if (
      !(await exists(join(dir, 'manifest.json'))) &&
      !(await exists(join(dir, 'manifest-v1.json')))
    )
      continue;
    const source = ['characters', 'rivals'].includes(category)
      ? join(dir, 'arena-master-v1.png')
      : join(dir, 'original-v1.png');
    if (!(await exists(source))) continue;
    if (category === 'rivals') {
      await emit(`rival.${entry.name}.figure`, source, 342, 512, true, {
        es: 'Figura de rival ARCANA',
        en: 'ARCANA rival figure',
      });
    } else if (category === 'characters') {
      const chars = JSON.parse(await readFile(join(output, 'characters.json'), 'utf8'));
      const label = chars[entry.name]?.name ?? { es: entry.name, en: entry.name };
      await emit(`character.${entry.name}.figure`, source, 342, 512, true, {
        es: `Figura de ${label.es}`,
        en: `Figure of ${label.en}`,
      });
      // Production source is an individual text-free full figure; portrait is a documented derivative.
      const meta = await sharp(source).metadata();
      const crop = {
        left: Math.round(meta.width * 0.15),
        top: Math.round(meta.height * 0.09),
        width: Math.round(meta.width * 0.7),
        height: Math.round(meta.width * 0.7 * 1.25),
      };
      await emit(
        `character.${entry.name}.portrait`,
        source,
        512,
        640,
        true,
        { es: `Retrato de ${label.es}`, en: `Portrait of ${label.en}` },
        crop,
      );
      await emit(`character.${entry.name}.thumbnail`, source, 96, 120, true, label, crop);
    } else if (category === 'scenes') {
      await emit(`scene.${entry.name}`, source, 1280, 854, false, {
        es: `Escenario ${entry.name}`,
        en: `${entry.name} scenery`,
      });
    } else {
      if (entry.name === 'toad-seal')
        for (const size of [192, 512])
          await emit(`pwa.icon.${size}`, source, size, size, false, {
            es: 'Icono ARCANA',
            en: 'ARCANA icon',
          });
      const keys = {
        'toad-box-closed': 'toad.box',
        'toad-box-base': 'toad.base',
        'toad-box-lid': 'toad.lid',
        'cocoa-toad-subject': 'toad.subject',
        'toad-seal': 'toad.seal',
        'bean-jar': 'beans.jar',
        'card-back': 'card.back',
        'card-frame': 'card.frame',
      };
      const card = entry.name.startsWith('card-');
      await emit(
        keys[entry.name] ?? `product.${entry.name}`,
        source,
        card ? 512 : 640,
        card ? 640 : 640,
        entry.name !== 'card-back',
        { es: `Ilustración ${entry.name}`, en: `${entry.name} illustration` },
      );
    }
  }
}
for (const [key, record] of Object.entries(previous))
  if (!records[key] && /^art\/[a-z0-9/_-]+\.webp$/.test(record.path))
    await unlink(join(output, record.path)).catch(() => {});
await writeFile(join(output, 'assets.json'), JSON.stringify(records, null, 2) + '\n');
await writeFile(
  join(production, 'exports.json'),
  JSON.stringify({ version: 1, exports }, null, 2) + '\n',
);
console.log(
  `Prepared ${exports.length} exports; ${exports.reduce((n, a) => n + a.bytes, 0)} bytes. Masters retained; visual review required.`,
);
