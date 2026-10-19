import { randomUUID } from 'node:crypto';
import { defineSafeConfig } from './tools/verification/playwright-safety';
const namespace = (process.env.ARCANA_CLARITY_A92_NAMESPACE ??= `a92-${randomUUID()}`);
if (!/^a92-[a-f0-9-]{36}$/.test(namespace)) throw Error('A92 isolated namespace required');
export default defineSafeConfig({
  testDir: './tests/browser-experience-clarity',
  testMatch: /.*-a92\.spec\.ts$/,
  outputDir: 'test-results/clarity-a92',
  timeout: 120000,
  maxFailures: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/clarity-a92/results.json' }]],
  expect: { timeout: 12000 },
  use: {
    baseURL: 'http://127.0.0.1:5530',
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
      name: `chromium-${viewport.width}-a92`,
      use: { browserName: 'chromium' as const, viewport },
    })),
    {
      name: 'webkit-390-a92',
      use: { browserName: 'webkit', viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: [
    {
      env: { ARCANA_TRIAL_NAMESPACE: namespace },
      command:
        'npx --no-install vite preview --host 127.0.0.1 --port 5530 --strictPort --mode arcana',
      url: 'http://127.0.0.1:5530/',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command:
        'npx --no-install vite preview --config tests/browser-experience-clarity/vite-map-a92.config.ts --host 127.0.0.1 --port 5621 --strictPort',
      url: 'http://127.0.0.1:5621/tests/browser-experience-clarity/map-preparation-a92.html',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command:
        'npx --no-install vite preview --config tests/browser-experience-clarity/vite-collection-a92.config.ts --host 127.0.0.1 --port 5622 --strictPort',
      url: 'http://127.0.0.1:5622/tests/browser-experience-clarity/collection-supplies-a92.html',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command:
        'npx --no-install vite preview --config tests/browser-experience-clarity/vite-map-a92.config.ts --host 127.0.0.1 --port 5623 --strictPort',
      cwd: 'test-results/a92-baseline-code',
      url: 'http://127.0.0.1:5623/tests/browser-experience-clarity/map-preparation-a92.html',
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
});
