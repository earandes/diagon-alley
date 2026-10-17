import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
if (process.platform !== 'linux') throw Error('Referencia gráfica A73 exclusivamente en CI Linux.');
const root = process.cwd();
const baseline = 'd03c93cab47d8b0324be9c4ad0f251ae4821b7df';
mkdirSync(resolve('test-results'), { recursive: true });
const target = mkdtempSync(resolve('test-results/a73-reference-source-'));
const run = (cmd, args, cwd = root) => {
  const p = spawnSync(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (p.status !== 0) throw Error(p.stderr || p.stdout || String(p.error));
  return p.stdout;
};
const archive = resolve(target, 'reference.tar');
try {
  run('git', [
    'archive',
    '--format=tar',
    `--output=${archive}`,
    baseline,
    'src',
    'tests/browser-motion',
    'tests/browser-boss',
    'tests/browser-boss-style',
    'package.json',
    'tsconfig.json',
  ]);
  run('tar', ['-xf', archive, '-C', target]);
} finally {
  rmSync(archive, { force: true });
}
symlinkSync(resolve(root, 'node_modules'), resolve(target, 'node_modules'), 'dir');
// Identical opt-in React wall-time probe in reference and candidate; no rule or render change.
const panel = resolve(target, 'src/arcana/presentation/BattlePanel.tsx');
let source = readFileSync(panel, 'utf8');
const anchor = '  const total = combat.events.length,';
if (!source.includes(anchor)) throw Error('Baseline instrumentation anchor changed');
if (!source.includes("sceneEnd('react-commit-wall', renderStarted)")) source =
  "import { sceneStart, sceneEnd } from './scenes/scene-diagnostics';\n" +
  source.replace(
    anchor,
    "  const renderStarted = sceneStart();\n  useLayoutEffect(() => sceneEnd('react-commit-wall', renderStarted));\n" +
      anchor,
  );
writeFileSync(panel, source);
const config = resolve(target, 'reference-vite.mjs');
writeFileSync(
  config,
  `export default ${JSON.stringify({ root: target, base: '/a73-reference/', publicDir: false, build: { outDir: resolve(root, 'test-results/boss-a70-build/a73-reference'), emptyOutDir: true, rollupOptions: { input: { battle: resolve(target, 'tests/browser-boss/boss-a70.html'), generic: resolve(target, 'tests/browser-motion/motion-a69.html'), preparation: resolve(target, 'tests/browser-boss-style/boss-style-a71.html') } } } })};`,
);
run(
  process.execPath,
  [resolve(root, 'node_modules/vite/bin/vite.js'), 'build', '--config', config],
  target,
);
writeFileSync(
  resolve(root, 'test-results/boss-a70-build/a73-reference/provenance.json'),
  JSON.stringify(
    {
      baseline,
      diagnosticsOnlyPatch:
        'React render to layout-effect wall interval; same hook in current. No production rules/assets or scene algorithm modified.',
    },
    null,
    2,
  ),
);
console.log(
  `A73 fixed reference ${baseline} built under /a73-reference/; same guarded preview, no extra browser.`,
);
