import { randomUUID } from 'node:crypto';
import { defineSafeConfig } from './tools/verification/playwright-safety';
const namespace = (process.env.ARCANA_ACCOUNTS_A77_NAMESPACE ??= `a77-${randomUUID()}`);
if (!/^a77-[a-f0-9-]{36}$/.test(namespace)) throw Error('A77 requires a private UUID namespace');
export default defineSafeConfig({
  testDir: './tests/browser-accounts',
  testMatch: /accounts-review-a77\.spec\.ts$/,
  outputDir: 'test-results/accounts-review-a77',
  timeout: 120000,
  maxFailures: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/accounts-review-a77/results.json' }]],
  expect: { timeout: 12000 },
  use: {
    baseURL: 'http://127.0.0.1:5534',
    serviceWorkers: 'block',
    hasTouch: true,
    actionTimeout: 12000,
  },
  projects: [
    {
      name: 'chromium-390-a77',
      use: { browserName: 'chromium', viewport: { width: 390, height: 844 } },
    },
    {
      name: 'chromium-1280-a77',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'webkit-865-a77',
      use: { browserName: 'webkit', viewport: { width: 865, height: 1079 } },
    },
  ],
  webServer: {
    env: { ARCANA_TRIAL_NAMESPACE: namespace },
    command:
      'npx --no-install vite preview --host 127.0.0.1 --port 5534 --strictPort --mode arcana',
    url: 'http://127.0.0.1:5534/',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
