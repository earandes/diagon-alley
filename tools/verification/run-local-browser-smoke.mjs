import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import {
  localBrowserRisk,
  ownedDescendants,
  readLocalBrowserHealth,
} from './local-browser-health.ts';

if (process.platform !== 'darwin')
  throw Error('Este control local es para macOS. En Linux utilizar las suites de CI.');
const baseline = readLocalBrowserHealth();
const reasons = localBrowserRisk(baseline);
const services = spawnSync(
  'docker',
  ['compose', '-f', 'compose.arcana.yml', 'ps', '--format', 'json'],
  { encoding: 'utf8', timeout: 5000 },
);
let serviceRows = [];
try {
  const output = services.stdout.trim();
  serviceRows = output.startsWith('[')
    ? JSON.parse(output)
    : output
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line));
} catch {}
if (
  services.status !== 0 ||
  !['postgres', 'redis'].every((name) =>
    serviceRows.some(
      (service) =>
        service.Service === name && service.State === 'running' && service.Health === 'healthy',
    ),
  )
)
  reasons.push('PostgreSQL/Redis no están verificados como saludables');
const summary = {
  allowed: reasons.length === 0,
  reasons,
  load: baseline.load,
  cores: baseline.cores,
  windowServerRssMb: baseline.windowServerRssMb,
  windowServerCpu: baseline.windowServerCpu,
  scope: '1 Chromium, 1 test, sin vídeo/trazas/capturas, límite total60s; no reproduce carga',
};
console.log(JSON.stringify(summary));
if (process.argv.includes('--check')) process.exit(reasons.length ? 2 : 0);
if (reasons.length) process.exit(2);
const token = randomUUID(),
  permission = resolve(tmpdir(), `arcana-browser-smoke-${process.pid}.json`);
writeFileSync(permission, JSON.stringify({ pid: process.pid, token }), { mode: 0o600 });
const env = {
  ...process.env,
  ARCANA_LOCAL_SMOKE_PERMISSION: permission,
  ARCANA_LOCAL_SMOKE_TOKEN: token,
};
const cli = resolve('node_modules/playwright/cli.js');
const args = [
  'test',
  '--config',
  'playwright.local-smoke.config.ts',
  '--project',
  'chromium-local-smoke',
  '--workers=1',
  '--retries=0',
];
// --list loads configuration and enumerates tests without starting a browser or preview.
const list = spawnSync(process.execPath, [cli, ...args, '--list', '--reporter=json'], {
  env,
  encoding: 'utf8',
  timeout: 10000,
});
function countTests(suites) {
  return suites.reduce(
    (n, suite) =>
      n +
      (suite.specs ?? []).reduce((sum, spec) => sum + (spec.tests?.length ?? 0), 0) +
      countTests(suite.suites ?? []),
    0,
  );
}
try {
  if (list.status !== 0) throw Error(list.stderr || 'No se pudo enumerar el smoke');
  const report = JSON.parse(list.stdout);
  if (report.errors?.length || countTests(report.suites ?? []) !== 1)
    throw Error('El smoke debe contener exactamente un test');
} catch (error) {
  rmSync(permission, { force: true });
  throw error;
}
const child = spawn(process.execPath, [cli, ...args], { env, stdio: 'inherit', detached: true });
let stopping = false;
function stop(reason) {
  if (stopping) return;
  stopping = true;
  console.error(`Smoke detenido: ${reason}`);
  // Snapshot ownership before stopping; never kill by browser name or touch a personal session.
  let owned = [];
  try {
    owned = ownedDescendants(readLocalBrowserHealth().rows, child.pid)
      .map((row) => row.pid)
      .reverse();
  } catch {
    // The monitor itself can fail. The isolated process group remains ours to stop.
  }
  for (const pid of owned)
    try {
      process.kill(pid, 'SIGTERM');
    } catch {}
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch {}
  setTimeout(() => {
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch {}
    for (const pid of owned)
      try {
        process.kill(pid, 'SIGKILL');
      } catch {}
  }, 800);
}
const timer = setTimeout(() => stop('límite total60s'), 60000);
const watch = setInterval(() => {
  try {
    const sample = readLocalBrowserHealth(),
      risks = localBrowserRisk(sample, baseline);
    const owned = ownedDescendants(sample.rows, child.pid);
    if (owned.reduce((sum, row) => sum + row.rssMb, 0) > 1536)
      risks.push('procesos propios superan1,5GB RSS');
    if (risks.length) stop(risks.join('; '));
  } catch {
    stop('no se puede verificar el estado del equipo');
  }
}, 2000);
process.once('SIGINT', () => stop('cancelado'));
process.once('SIGTERM', () => stop('cancelado'));
child.once('exit', (code) => {
  clearTimeout(timer);
  clearInterval(watch);
  rmSync(permission, { force: true });
  process.exitCode = stopping ? 2 : (code ?? 1);
});
