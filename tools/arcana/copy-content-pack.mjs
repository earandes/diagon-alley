import { cp, access, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9-]*$/.test(name) || name === 'arcana')
  throw Error('Use a new lowercase folder name: node tools/arcana/copy-content-pack.mjs my-theme');
const root = 'src/arcana/presentation/content-packs';
const current = JSON.parse(await readFile(join(root, 'default.json'), 'utf8')).id;
if (!current) throw Error('Cannot resolve current pack');
const target = join(root, name);
let exists = true;
try {
  await access(target);
} catch {
  exists = false;
}
if (exists) throw Error(`Folder already exists; no files overwritten: ${target}`);
await cp(join(root, current), target, { recursive: true, errorOnExist: true, force: false });
const path = join(target, 'pack.json');
const metadata = JSON.parse(await readFile(path, 'utf8'));
await writeFile(path, JSON.stringify({ ...metadata, id: name, version: 1 }, null, 2) + '\n');
console.log(
  `Copied ${current} to ${target}. Edit the texts and artwork, validate with node tools/arcana/validate-content-pack.mjs ${name}, then register its imports in active.ts before selecting it with node tools/arcana/activate-content-pack.mjs ${name} and rebuilding. The current game and its data were not changed.`,
);
