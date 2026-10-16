import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, symlinkSync } from 'node:fs';
import { resolve } from 'node:path';
if (process.platform !== 'linux')
  throw Error('La referencia comparativa se reconstruye para CI Linux, sin navegador local.');
const root = process.cwd(),
  source = resolve('docs/arcana/progression-increment-2026-10-16/evidence/performance-reference');
const manifest = JSON.parse(readFileSync(resolve(source, 'manifest.json'), 'utf8'));
const target = resolve('.a66-performance-reference');
if (existsSync(target))
  throw Error('Directorio de referencia ya existe; no sobrescribir evidencia');
mkdirSync(target);
const run = (cmd, args, options = {}) => {
  const r = spawnSync(cmd, args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    ...options,
  });
  if (r.status !== 0) throw Error(r.stderr || `${cmd} failed`);
  return r;
};
const archive = run('git', ['archive', manifest.baseCommit], { encoding: null });
run('tar', ['-x', '-C', target], { input: archive.stdout });
const patch = readFileSync(resolve(source, 'a66-runtime.patch'));
if (createHash('sha256').update(patch).digest('hex') !== manifest.patchSha256)
  throw Error('Reference patch hash mismatch');
run('git', [
  'apply',
  '--directory=.a66-performance-reference',
  resolve(source, 'a66-runtime.patch'),
]);
for (const entry of manifest.extraFiles) {
  const file = resolve(source, 'extra', entry.path);
  if (createHash('sha256').update(readFileSync(file)).digest('hex') !== entry.sha256)
    throw Error('Reference source hash mismatch');
  mkdirSync(resolve(target, entry.path, '..'), { recursive: true });
  cpSync(file, resolve(target, entry.path));
}
symlinkSync(resolve(root, 'node_modules'), resolve(target, 'node_modules'), 'dir');
const result = spawnSync('npm', ['run', 'build'], { cwd: target, stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);
