import { randomUUID } from 'node:crypto';
import { defineSafeConfig } from './tools/verification/playwright-safety';
const namespace = (process.env.ARCANA_ACCOUNTS_A82_NAMESPACE ??= `a82-${randomUUID()}`);
if (!/^a82-[a-f0-9-]{36}$/.test(namespace)) throw Error('A82 requires a private UUID namespace');
export default defineSafeConfig({
  testDir: './tests/browser-accounts',
  testMatch: /welcome-menu-a82\.spec\.ts$/,
  outputDir: 'test-results/welcome-menu-a82',
  timeout: 120000,
  maxFailures: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/welcome-menu-a82/results.json' }]],
  expect: { timeout: 12000 },
  use: {
    baseURL: 'http://127.0.0.1:5539',
    serviceWorkers: 'block',
    hasTouch: true,
    actionTimeout: 12000,
  },
  projects: [
    {
      name: 'chromium-390-a82',
      use: { browserName: 'chromium', viewport: { width: 390, height: 844 } },
    },
    {
      name: 'chromium-1280-a82',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'webkit-865-a82',
      use: { browserName: 'webkit', viewport: { width: 865, height: 1079 } },
    },
  ],
  webServer: {
    env: { ARCANA_TRIAL_NAMESPACE: namespace },
    command:
      'npx --no-install vite preview --host 127.0.0.1 --port 5539 --strictPort --mode arcana',
    url: 'http://127.0.0.1:5539/',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
