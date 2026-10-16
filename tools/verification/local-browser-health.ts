import { execFileSync } from 'node:child_process';
import { loadavg, cpus } from 'node:os';

export interface BrowserHealth {
  load: number;
  cores: number;
  windowServerPid: number | null;
  windowServerRssMb: number;
  windowServerCpu: number;
}
export interface BrowserProcess {
  pid: number;
  parent: number;
  cpu: number;
  rssMb: number;
  name: string;
}
export function localBrowserRisk(sample: BrowserHealth, baseline: BrowserHealth = sample) {
  const reasons = [];
  if (sample.load > sample.cores * 1.25) reasons.push('Carga del sistema demasiado alta');
  if (!sample.windowServerPid) reasons.push('No se puede verificar WindowServer');
  if (sample.windowServerPid !== baseline.windowServerPid)
    reasons.push('WindowServer ha cambiado durante la prueba');
  if (sample.windowServerRssMb > 768 || sample.windowServerRssMb - baseline.windowServerRssMb > 192)
    reasons.push('Memoria de WindowServer supera el umbral conservador');
  if (sample.windowServerCpu > 70) reasons.push('CPU de WindowServer supera el umbral conservador');
  return reasons;
}
export function readLocalBrowserHealth(): BrowserHealth & { rows: BrowserProcess[] } {
  const rows = execFileSync('ps', ['-axo', 'pid=,ppid=,%cpu=,rss=,comm='], {
    encoding: 'utf8',
    timeout: 2000,
  })
    .split('\n')
    .map((line) => line.trim().match(/^(\d+)\s+(\d+)\s+([\d.]+)\s+(\d+)\s+(.+)$/))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => ({
      pid: Number(m[1]),
      parent: Number(m[2]),
      cpu: Number(m[3]),
      rssMb: Number(m[4]) / 1024,
      name: m[5],
    }));
  const ws = rows.find((row) => /\/WindowServer$/.test(row.name));
  return {
    load: loadavg()[0],
    cores: cpus().length,
    windowServerPid: ws?.pid ?? null,
    windowServerRssMb: ws?.rssMb ?? 0,
    windowServerCpu: ws?.cpu ?? 0,
    rows,
  };
}
export function ownedDescendants<T extends { pid: number; parent: number }>(
  rows: readonly T[],
  root: number,
) {
  const owned = new Set([root]);
  for (let changed = true; changed; ) {
    changed = false;
    for (const row of rows)
      if (owned.has(row.parent) && !owned.has(row.pid)) {
        owned.add(row.pid);
        changed = true;
      }
  }
  return rows.filter((row) => owned.has(row.pid));
}
