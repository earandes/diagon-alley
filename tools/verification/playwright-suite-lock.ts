import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';

/** One suite across processes and worktrees. A timeout alone never authorizes stealing a lock. */
export function acquireBrowserSuiteLock(directory: string, pid = process.pid): () => void {
  const token = randomUUID();
  try {
    mkdirSync(directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
    let owner: { pid: number };
    try {
      owner = JSON.parse(readFileSync(resolve(directory, 'owner.json'), 'utf8'));
      if (!Number.isSafeInteger(owner.pid) || owner.pid <= 0) throw Error('Invalid owner');
    } catch {
      throw Error(
        `Bloqueo de navegador sin propietario verificable: ${directory}. Revisarlo antes de ejecutar.`,
      );
    }
    try {
      process.kill(owner.pid, 0);
    } catch (probe) {
      if ((probe as NodeJS.ErrnoException).code !== 'ESRCH') throw probe;
      // Fail closed: two stale-lock reapers could otherwise delete a new owner's lock.
      throw Error(
        `Bloqueo huérfano (PID ${owner.pid} ausente): ${directory}. Revisarlo y retirarlo explícitamente antes de continuar.`,
      );
    }
    throw Error(
      `Otra batería de navegador sigue activa (PID ${owner.pid}). No ejecutar suites en paralelo.`,
    );
  }
  writeFileSync(
    resolve(directory, 'owner.json'),
    JSON.stringify({ pid, token, startedAt: new Date().toISOString() }),
  );
  return () => {
    try {
      const owner = JSON.parse(readFileSync(resolve(directory, 'owner.json'), 'utf8'));
      if (owner.token === token && owner.pid === pid) rmSync(directory, { recursive: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  };
}
export default function setup() {
  const commonGit = execFileSync('git', ['rev-parse', '--git-common-dir'], {
    encoding: 'utf8',
  }).trim();
  const release = acquireBrowserSuiteLock(resolve(commonGit, 'arcana-browser-suite.lock'));
  process.once('exit', release);
  return () => {
    process.off('exit', release);
    release();
  };
}
