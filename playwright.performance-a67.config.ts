import { defineSafeConfig } from './tools/verification/playwright-safety';
import { randomUUID } from 'node:crypto';
export default defineSafeConfig({
  testDir: './tests/browser-trial',
  testMatch: 'progression-performance-a67.spec.ts',
  workers: 1,
  timeout: 60000,
  outputDir: 'test-results-performance-a67',
  use: {
    baseURL: 'http://127.0.0.1:5458',
    serviceWorkers: 'block',
    viewport: { width: 1280, height: 900 },
  },
  projects: [{ name: 'chromium-performance', use: { browserName: 'chromium' } }],
  webServer: {
    command: 'node tools/verification/run-performance-preview.mjs',
    url: 'http://127.0.0.1:5458/',
    reuseExistingServer: false,
    env: { ARCANA_TRIAL_NAMESPACE: `a67-profile-${randomUUID()}` },
  },
});
