import { writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const name = process.argv[2];
if (!name || !['arcana', 'diagon-alley'].includes(name))
  throw Error(
    'Register the local pack in active.ts before activating it; current packs: arcana, diagon-alley',
  );
const validation = spawnSync(
  process.execPath,
  ['tools/arcana/validate-content-pack.mjs', name, '--complete'],
  { stdio: 'inherit' },
);
if (validation.status !== 0) process.exit(validation.status ?? 1);
const path = 'src/arcana/presentation/content-packs/default.json';
await writeFile(path, JSON.stringify({ id: name }, null, 2) + '\n');
console.log(
  `Selected build default ${name}. Runtime preference in Settings remains independent. No server, inventory, receipt or rule was changed.`,
);
