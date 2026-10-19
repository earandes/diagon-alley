import { readFile, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
const root = resolve('src/arcana/presentation/content-packs');
const selected = JSON.parse(await readFile(join(root, 'default.json'), 'utf8')).id;
const requested = process.argv.slice(2).find((argument) => !argument.startsWith('--')) ?? selected;
if (!requested || !/^[a-z][a-z0-9-]*$/.test(requested)) throw Error('Invalid pack folder');
const directory = join(root, requested);
const json = async (path) => JSON.parse(await readFile(path, 'utf8'));
const [metadata, messages, characters, assets, narratives, reference, config] = await Promise.all([
  json(join(directory, 'pack.json')),
  json(join(directory, 'messages.json')),
  json(join(directory, 'characters.json')),
  json(join(directory, 'assets.json')),
  json(join(directory, 'narratives.json')),
  json(join(root, 'arcana', 'messages.json')),
  json('src/arcana/content/trial-v1.json'),
]);
const source = stripTypeScriptTypes(await readFile(join(root, 'contract.ts'), 'utf8'));
const { validateContentPack } = await import(
  'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
);
validateContentPack(
  { ...metadata, messages: { ...reference, ...messages }, characters, assets, narratives },
  [
    ...config.catalog.wizards,
    ...JSON.parse(await readFile('src/arcana/content/creatures-v1.json', 'utf8')).wizards,
  ].map((w) => w.id),
  reference,
);
if (metadata.id !== requested) throw Error('Pack ID must match its folder');
for (const [key, asset] of Object.entries(assets)) {
  try {
    await access(join(root, asset.sourcePack ?? requested, asset.path));
  } catch {
    throw Error(`Missing file for ${key}: ${asset.path}`);
  }
  const bytes = await readFile(join(root, asset.sourcePack ?? requested, asset.path));
  let width, height, alpha;
  if (asset.path.endsWith('.png')) {
    if (bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a')
      throw Error(`Not a PNG: ${key}`);
    width = bytes.readUInt32BE(16);
    height = bytes.readUInt32BE(20);
    alpha = [4, 6].includes(bytes[25]) || bytes.includes(Buffer.from('tRNS'));
  } else if (asset.path.endsWith('.webp')) {
    if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP')
      throw Error(`Not a WebP: ${key}`);
    for (let offset = 12; offset + 8 <= bytes.length; ) {
      const type = bytes.toString('ascii', offset, offset + 4),
        size = bytes.readUInt32LE(offset + 4),
        data = offset + 8;
      if (type === 'VP8X') {
        width = bytes.readUIntLE(data + 4, 3) + 1;
        height = bytes.readUIntLE(data + 7, 3) + 1;
        alpha = !!(bytes[data] & 16);
        break;
      }
      if (type === 'VP8 ') {
        width = bytes.readUInt16LE(data + 6) & 16383;
        height = bytes.readUInt16LE(data + 8) & 16383;
        alpha = false;
        break;
      }
      if (type === 'VP8L') {
        const bits = bytes.readUInt32LE(data + 1);
        width = (bits & 16383) + 1;
        height = ((bits >>> 14) & 16383) + 1;
        alpha = !!(bits & (1 << 28));
        break;
      }
      offset = data + size + (size % 2);
    }
  } else {
    const box = bytes.toString('utf8').match(/viewBox="0 0 (\d+) (\d+)"/);
    width = box ? Number(box[1]) : undefined;
    height = box ? Number(box[2]) : undefined;
    alpha = true;
  }
  if (width !== asset.width || height !== asset.height || alpha !== asset.alpha)
    throw Error(`Image metadata mismatch: ${key}`);
}
if (process.argv.includes('--complete')) {
  const required = [
    ...[
      ...config.catalog.wizards,
      ...JSON.parse(await readFile('src/arcana/content/creatures-v1.json', 'utf8')).wizards,
    ].flatMap((w) =>
      ['portrait', 'thumbnail', 'figure'].map((variant) => `character.${w.id}.${variant}`),
    ),
    ...['boulevard', 'passage', 'arena', 'confectionery', 'workshop', 'vault'].map(
      (id) => `scene.${id}`,
    ),
    ...['box', 'base', 'lid', 'seal', 'subject'].map((id) => `toad.${id}`),
    'beans.jar',
    'card.frame',
    'card.back',
    ...['mint', 'pepper', 'earth', 'soap'].map((id) => `product.bean-${id}`),
    ...['birch', 'willow', 'elder'].map((id) => `product.wand-${id}`),
    ...['dragon', 'phoenix', 'wyvern'].map((id) => `product.core-${id}`),
    ...['cadet-zephyr', 'zephyr-2000', 'wind-arrow'].map((id) => `product.broom-${id}`),
    'product.gold-key',
    'product.loot-chest',
    ...['arcanist-1', 'arcanist-2', 'arcanist-3', 'boss'].map((id) => `rival.${id}.figure`),
    ...['duel', 'refuge', 'chest', 'pact', 'encounter', 'boss'].map((id) => `node.${id}`),
    'currency.crowns',
    'currency.essence',
    'pwa.icon.192',
    'pwa.icon.512',
  ];
  for (const key of required) if (!assets[key]) throw Error(`Incomplete production pack: ${key}`);
}
console.log(
  `Content pack ${requested}: ${Object.keys({ ...reference, ...messages }).length} bilingual UI messages, ${Object.keys(characters).length} characters, ${Object.keys(assets).length} assets, ${narratives.length} narratives validated. Art completeness is a separate production/QA check.`,
);
