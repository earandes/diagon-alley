import { randomUUID } from 'node:crypto';
import type { PlaywrightTestConfig } from '@playwright/test';

/** Shared raw options; callers must always apply defineSafeConfig. No browser is launched here. */
export const priorityBrowserOptions: PlaywrightTestConfig = {
  testDir: './tests/browser-priorities',
  testMatch: /.*\.spec\.ts$/,
  outputDir: 'test-results/priorities-a89',
  timeout: 150000,
  maxFailures: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/priorities-a89/results.json' }]],
  expect: { timeout: 12000 },
  use: {
    baseURL: 'http://127.0.0.1:5611',
    hasTouch: true,
    serviceWorkers: 'block',
    actionTimeout: 12000,
    navigationTimeout: 30000,
  },
  projects: [
    ...[
      { width: 390, height: 844 },
      { width: 1280, height: 900 },
      { width: 865, height: 1079 },
    ].map((viewport) => ({
      name: `chromium-${viewport.width}-a89`,
      use: { browserName: 'chromium' as const, viewport },
    })),
    {
      name: 'webkit-390-a89',
      use: { browserName: 'webkit', viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: [
    {
      env: { ARCANA_TRIAL_NAMESPACE: `a89-${randomUUID()}` },
      command:
        'npx --no-install vite preview --host 127.0.0.1 --port 5610 --strictPort --mode arcana',
      url: 'http://127.0.0.1:5610/',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command:
        'npx --no-install vite build --config tests/browser-priorities/vite-priorities-a89.config.ts && npx --no-install vite preview --config tests/browser-priorities/vite-priorities-a89.config.ts --host 127.0.0.1 --port 5611 --strictPort',
      url: 'http://127.0.0.1:5611/tests/browser-priorities/priorities-a89.html',
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
};
