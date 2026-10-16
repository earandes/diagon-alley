import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { safePlaywrightConfig } from '../../../tools/verification/playwright-safety';
import { acquireBrowserSuiteLock } from '../../../tools/verification/playwright-suite-lock';
describe('browser host protection after WindowServer crash', () => {
  it('rejects complete suites on macOS before starting browsers or servers', () => {
    expect(() => safePlaywrightConfig({}, 'darwin')).toThrow('WindowServer');
  });
  it('removes continuous recording and limits workers even when a project opts in', () => {
    const config = safePlaywrightConfig(
      {
        workers: 3,
        fullyParallel: true,
        retries: 4,
        use: { video: 'on', trace: 'on', screenshot: 'on' },
        projects: [{ name: 'recording', use: { video: 'on' } }],
      },
      'linux',
    );
    expect(config.workers).toBe(1);
    expect(config.fullyParallel).toBe(false);
    expect(config.retries).toBe(0);
    expect(config.use).toMatchObject({ video: 'off', trace: 'off', screenshot: 'off' });
    expect(config.projects![0].use!.video).toBe('off');
    expect(config.globalSetup).toHaveLength(1);
  });
  it('rejects a second suite and releases only its own lock', () => {
    const root = mkdtempSync(resolve(tmpdir(), 'arcana-browser-lock-'));
    try {
      const lock = resolve(root, 'suite');
      const release = acquireBrowserSuiteLock(lock);
      expect(() => acquireBrowserSuiteLock(lock)).toThrow('sigue activa');
      release();
      const next = acquireBrowserSuiteLock(lock);
      next();
      next();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
  it('does not steal malformed lock metadata just because it exists', () => {
    const root = mkdtempSync(resolve(tmpdir(), 'arcana-browser-lock-'));
    try {
      const lock = resolve(root, 'suite');
      mkdirSync(lock);
      writeFileSync(resolve(lock, 'owner.json'), '{}');
      expect(() => acquireBrowserSuiteLock(lock)).toThrow('sin propietario verificable');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
