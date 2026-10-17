import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { defineSafeConfig } from './tools/verification/playwright-safety';
const baseline =
  JSON.parse(readFileSync(new URL('./tools/verification/a75-phase.json', import.meta.url), 'utf8'))
    .phase === 'baseline';
/** One shared lock/worker/watchdog; graphical execution remains Linux-only. */
export default defineSafeConfig({
  testDir: './tests/browser-experience-fixes',
  testMatch: baseline ? /arena-a75\.spec\.ts$/ : /.*-a75\.spec\.ts$/,
  outputDir: 'test-results/experience-a75',
  timeout: 150000,
  maxFailures: 1,
  expect: { timeout: 12000 },
  use: {
    baseURL: 'http://127.0.0.1:5520',
    serviceWorkers: 'block',
    hasTouch: true,
    actionTimeout: 12000,
    navigationTimeout: 30000,
  },
  projects: (baseline ? (['chromium'] as const) : (['chromium', 'webkit'] as const)).flatMap(
    (browserName) =>
      (baseline
        ? [{ width: 390, height: 844 }]
        : [
            { width: 1280, height: 900 },
            { width: 390, height: 844 },
            { width: 865, height: 1079 },
          ]
      ).map((viewport) => ({
        name: `${browserName}-${viewport.width}-a75`,
        use: { browserName, viewport },
      })),
  ),
  webServer: [
    ...(!baseline
      ? [
          {
            env: { ARCANA_TRIAL_NAMESPACE: `a75-${randomUUID()}` },
            command:
              'npx --no-install vite preview --host 127.0.0.1 --port 5520 --strictPort --mode arcana',
            url: 'http://127.0.0.1:5520/',
            reuseExistingServer: false,
            timeout: 120000,
          },
        ]
      : []),
    {
      command:
        'npx --no-install vite build --config tests/browser-boss/vite-boss-a70.config.ts && npx --no-install vite preview --config tests/browser-boss/vite-boss-a70.config.ts --host 127.0.0.1 --port 5521 --strictPort',
      url: 'http://127.0.0.1:5521/tests/browser-boss/boss-a70.html',
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
});
