import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
if (process.platform !== 'linux') throw Error('A75 graphical reference is Linux CI only.');
const baseline = '937a0a1f00bdbca7009a80cd99b7b4b450f652f0',
  root = process.cwd();
mkdirSync(resolve('test-results'), { recursive: true });
const target = mkdtempSync(resolve('test-results/a75-reference-source-'));
function run(command, args, cwd = root) {
  const r = spawnSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw Error(r.stderr || r.stdout || String(r.error));
}
const archive = resolve(target, 'source.tar');
try {
  run('git', [
    'archive',
    '--format=tar',
    `--output=${archive}`,
    baseline,
    'src',
    'tests/browser-boss',
    'package.json',
    'tsconfig.json',
  ]);
  run('tar', ['-xf', archive, '-C', target]);
} finally {
  rmSync(archive, { force: true });
}
symlinkSync(resolve(root, 'node_modules'), resolve(target, 'node_modules'), 'dir');
const outDir = resolve(root, 'test-results/a75-fixture-build/a75-reference');
const config = resolve(target, 'vite-reference.mjs');
writeFileSync(
  config,
  `export default ${JSON.stringify({ root: target, base: '/a75-reference/', publicDir: false, build: { outDir, emptyOutDir: true, rollupOptions: { input: resolve(target, 'tests/browser-boss/boss-a70.html') } } })};`,
);
run(
  process.execPath,
  [resolve(root, 'node_modules/vite/bin/vite.js'), 'build', '--config', config],
  target,
);
writeFileSync(
  resolve(outDir, 'provenance.json'),
  JSON.stringify(
    {
      baseline,
      sourcePatch: null,
      mode: 'Identical incumbent fixture and runtime; no instrumentation patch. Same installed dependency lock family.',
    },
    null,
    2,
  ),
);
