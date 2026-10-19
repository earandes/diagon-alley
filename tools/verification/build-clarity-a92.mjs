import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, cpSync, symlinkSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
if (process.platform !== 'linux')
  throw Error('A92 graphical fixtures/reference are CI Linux only.');
const root = process.cwd(),
  reference = resolve('test-results/a92-baseline-code');
const baseline = '86d6a92665f63616034a4fcd668c5df6ffe3e322';
if (existsSync(reference)) throw Error('Do not overwrite an existing A92 reference.');
mkdirSync(reference, { recursive: true });
function run(command, args, cwd = root) {
  const r = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (r.status !== 0) throw Error(`${command} failed (${r.status ?? r.signal})`);
}
const archive = resolve(reference, '.baseline.tar');
try {
  run('git', [
    'archive',
    '--format=tar',
    `--output=${archive}`,
    baseline,
    'src',
    'tests/domain/arcana/support',
    'tests/browser-priorities/fixture-state.ts',
    'package.json',
  ]);
  run('tar', ['-xf', archive, '-C', reference]);
} finally {
  rmSync(archive, { force: true });
}
const harness = 'tests/browser-experience-clarity';
mkdirSync(resolve(reference, harness), { recursive: true });
for (const file of [
  'map-preparation-a92.html',
  'map-preparation-a92-harness.tsx',
  'vite-map-a92.config.ts',
])
  cpSync(resolve(harness, file), resolve(reference, harness, file));
symlinkSync(resolve(root, 'node_modules'), resolve(reference, 'node_modules'), 'dir');
run(
  'npx',
  ['--no-install', 'vite', 'build', '--config', `${harness}/vite-map-a92.config.ts`],
  reference,
);
run('npx', ['--no-install', 'vite', 'build', '--config', `${harness}/vite-map-a92.config.ts`]);
run('npx', [
  '--no-install',
  'vite',
  'build',
  '--config',
  `${harness}/vite-collection-a92.config.ts`,
]);
writeFileSync(
  'test-results/a92-reference.json',
  JSON.stringify(
    {
      baseline,
      fixture:
        'same map/preparation A92 harness copied unchanged; baseline runtime/assets from git archive',
      notColdStartPerformance: true,
    },
    null,
    2,
  ) + '\n',
);

if (process.env.A92_EVIDENCE_ROOT) {
  mkdirSync(process.env.A92_EVIDENCE_ROOT, { recursive: true });
  cpSync(
    'test-results/a92-reference.json',
    resolve(process.env.A92_EVIDENCE_ROOT, 'reference.json'),
  );
}
