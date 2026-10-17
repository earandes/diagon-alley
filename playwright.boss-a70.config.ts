import { randomUUID } from 'node:crypto';
import { defineSafeConfig } from './tools/verification/playwright-safety';

const namespace = `a70-boss-${randomUUID()}`;
const styleNamespace = `a71-boss-${randomUUID()}`;
// A71 runs in this existing CI step, under the same guard/lock and one worker.
// Keep new selected evidence separate from the historical A70 PNG baseline.
process.env.A71_FIXTURE_URL = 'http://127.0.0.1:5471';
process.env.A71_EVIDENCE_ROOT = 'docs/arcana/boss-increment-2026-10-16/evidence/linux/a71';
if (process.env.ARCANA_CAPTURE_A70 === '1') {
  process.env.ARCANA_CAPTURE_A71 = '1';
  process.env.ARCANA_CAPTURE_A70 = '0';
}
/** Linux only: the shared guard enforces lock, one worker, no retries or recording. */
export default defineSafeConfig({
  testDir: './tests',
  testMatch: [/browser-boss\/boss-a70\.spec\.ts$/, /browser-boss-style\/boss-style-a71\.spec\.ts$/],
  outputDir: 'test-results/boss-a70',
  timeout: 180000,
  maxFailures: 1,
  expect: { timeout: 10000 },
  use: {
    baseURL: 'http://127.0.0.1:5470',
    serviceWorkers: 'block',
    hasTouch: true,
    actionTimeout: 10000,
    navigationTimeout: 20000,
  },
  projects: (['chromium', 'webkit'] as const).flatMap((browserName) =>
    [
      { width: 1280, height: 900 },
      { width: 390, height: 844 },
      { width: 865, height: 1079 },
    ].map((viewport) => ({
      name: `${browserName}-${viewport.width}-boss-a70`,
      use: { browserName, viewport },
    })),
  ),
  webServer: [
    {
      env: { ARCANA_TRIAL_NAMESPACE: namespace },
      command:
        'npx --no-install vite preview --host 127.0.0.1 --port 5470 --strictPort --mode arcana',
      url: 'http://127.0.0.1:5470/',
      reuseExistingServer: false,
      timeout: 120000,
    },
    // Each journey suite creates 24 isolated trial accounts. Separate ephemeral
    // authorities preserve the real 30/IP/hour entry quota rather than relaxing it.
    {
      env: { ARCANA_TRIAL_NAMESPACE: styleNamespace },
      command:
        'npx --no-install vite preview --host 127.0.0.1 --port 5472 --strictPort --mode arcana',
      url: 'http://127.0.0.1:5472/',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command:
        'npx --no-install vite build --config tests/browser-boss/vite-boss-a70.config.ts && npx --no-install vite preview --config tests/browser-boss/vite-boss-a70.config.ts --host 127.0.0.1 --port 5471 --strictPort',
      url: 'http://127.0.0.1:5471/tests/browser-boss/boss-a70.html',
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
});
