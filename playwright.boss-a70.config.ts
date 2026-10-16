import { randomUUID } from 'node:crypto';
import { defineSafeConfig } from './tools/verification/playwright-safety';

const namespace = `a70-boss-${randomUUID()}`;
/** Linux only: the shared guard enforces lock, one worker, no retries or recording. */
export default defineSafeConfig({
  testDir: './tests/browser-boss',
  testMatch: 'boss-a70.spec.ts',
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
    {
      command:
        'npx --no-install vite build --config tests/browser-boss/vite-boss-a70.config.ts && npx --no-install vite preview --config tests/browser-boss/vite-boss-a70.config.ts --host 127.0.0.1 --port 5471 --strictPort',
      url: 'http://127.0.0.1:5471/tests/browser-boss/boss-a70.html',
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
});
