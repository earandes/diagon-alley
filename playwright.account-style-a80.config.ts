import { randomUUID } from 'node:crypto';
import { defineSafeConfig } from './tools/verification/playwright-safety';
const namespace = (process.env.ARCANA_ACCOUNTS_A80_NAMESPACE ??= `a80-${randomUUID()}`);
if (!/^a80-[a-f0-9-]{36}$/.test(namespace)) throw Error('A80 requires a private UUID namespace');
export default defineSafeConfig({
  testDir: './tests/browser-accounts',
  testMatch: /account-style-a80\.spec\.ts$/,
  outputDir: 'test-results/account-style-a80',
  timeout: 120000,
  maxFailures: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/account-style-a80/results.json' }]],
  expect: { timeout: 12000 },
  use: {
    baseURL: 'http://127.0.0.1:5537',
    serviceWorkers: 'block',
    hasTouch: true,
    actionTimeout: 12000,
  },
  projects: [
    {
      name: 'chromium-390-a80',
      use: { browserName: 'chromium', viewport: { width: 390, height: 844 } },
    },
    {
      name: 'chromium-1280-a80',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'webkit-865-a80',
      use: { browserName: 'webkit', viewport: { width: 865, height: 1079 } },
    },
  ],
  webServer: {
    env: { ARCANA_TRIAL_NAMESPACE: namespace },
    command:
      'npx --no-install vite preview --host 127.0.0.1 --port 5537 --strictPort --mode arcana',
    url: 'http://127.0.0.1:5537/',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
