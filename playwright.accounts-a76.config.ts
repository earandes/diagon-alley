import { randomUUID } from 'node:crypto';
import { defineSafeConfig } from './tools/verification/playwright-safety';
import { clarityBrowserOptions } from './playwright.clarity-a92.options';
import { priorityBrowserOptions } from './playwright.priorities-a89.options';

// Inherited by workers and preview alike: never read messages from an ordinary player's mailbox.
const namespace = (process.env.ARCANA_ACCOUNTS_A76_NAMESPACE ??= `a76-${randomUUID()}`);
if (!/^a76-[a-f0-9-]{36}$/.test(namespace)) throw Error('A76 requires an isolated UUID namespace');
// A92 joins this existing serial workflow; selected evidence inherits the explicit capture opt-in.
if (process.env.ARCANA_CAPTURE_A76 === '1') process.env.ARCANA_CAPTURE_A92 = '1';
process.env.A92_EVIDENCE_ROOT = 'docs/arcana/accounts-2026-10-17/evidence/linux/a92';

export default defineSafeConfig({
  testDir: './tests',
  testMatch: /(?:accounts-a76|priorities-a89)\.spec\.ts$/,
  outputDir: 'test-results/accounts-a76',
  timeout: 90000,
  maxFailures: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/accounts-a76/results.json' }]],
  expect: { timeout: 12000 },
  use: {
    baseURL: 'http://127.0.0.1:5530',
    serviceWorkers: 'block',
    hasTouch: true,
    actionTimeout: 12000,
    navigationTimeout: 30000,
  },
  projects: [
    ...(clarityBrowserOptions.projects ?? []).map((project) => ({
      ...project,
      testDir: './tests/browser-experience-clarity',
      testMatch: /.*-a92\.spec\.ts$/,
      timeout: 120000,
      use: { ...clarityBrowserOptions.use, ...project.use },
    })),
    ...(priorityBrowserOptions.projects ?? []).map((project) => ({
      ...project,
      testDir: './tests/browser-priorities',
      testMatch: /priorities-a89\.spec\.ts$/,
      timeout: 150000,
      use: { ...priorityBrowserOptions.use, ...project.use },
    })),
    ...(['chromium', 'webkit'] as const).flatMap((browserName) =>
      [
        { width: 390, height: 844 },
        { width: 1280, height: 900 },
        { width: 865, height: 1079 },
      ].map((viewport) => ({
        name: `${browserName}-${viewport.width}-a76`,
        testDir: './tests/browser-accounts',
        testMatch: /accounts-a76\.spec\.ts$/,
        use: { browserName, viewport },
      })),
    ),
  ],
  webServer: [
    {
      env: { ARCANA_TRIAL_NAMESPACE: namespace },
      command:
        'node tools/verification/build-clarity-a92.mjs && npx --no-install vite preview --host 127.0.0.1 --port 5530 --strictPort --mode arcana',
      url: 'http://127.0.0.1:5530/',
      reuseExistingServer: false,
      timeout: 120000,
    },
    ...(Array.isArray(priorityBrowserOptions.webServer) ? priorityBrowserOptions.webServer : []),
    ...(Array.isArray(clarityBrowserOptions.webServer)
      ? clarityBrowserOptions.webServer.slice(1)
      : []),
  ],
});
