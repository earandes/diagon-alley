import { readFile, readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { inspectBuildText } from './build-content-policy.mjs';
const args = process.argv.slice(2);
const option = args.indexOf('--pack');
const defaults = JSON.parse(
  await readFile('src/arcana/presentation/content-packs/default.json', 'utf8'),
);
const policy = option >= 0 ? args[option + 1] : defaults.id;
if (!['arcana', 'diagon-alley'].includes(policy))
  throw Error('Use --pack arcana or --pack diagon-alley');
let bytes = 0;
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await inspect(path);
      continue;
    }
    const data = await readFile(path);
    bytes += data.length;
    if (['.html', '.js', '.css', '.json', '.svg', '.txt', '.webmanifest'].includes(extname(path))) {
      try {
        inspectBuildText(data.toString('utf8'), policy);
      } catch (error) {
        throw Error(`${path}: ${error.message}`);
      }
    }
  }
}
await inspect('dist');
console.log(
  `${policy} build content scan passed; total distributed bytes: ${bytes}. Historical I1 excluded. ${policy === 'diagon-alley' ? 'Private thematic dual build; ARCANA-only distribution not certified.' : 'ARCANA-only policy enforced.'}`,
);
