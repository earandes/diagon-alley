import { defineSafeConfig as defineConfig } from './tools/verification/playwright-safety';
import { randomUUID } from 'node:crypto';
export default defineConfig({
  testDir: './tests/browser-trial',
  testMatch: 'tactical-adverse-a65.spec.ts',
  outputDir: 'test-results-adverse-a65',
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: 'http://127.0.0.1:5398',
    viewport: { width: 390, height: 844 },
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium-adverse-a65', use: { browserName: 'chromium' } },
    { name: 'webkit-adverse-a65', use: { browserName: 'webkit' } },
  ],
  webServer: {
    env: { ARCANA_TRIAL_NAMESPACE: 'a65-adverse-' + randomUUID() },
    command:
      'npx --no-install vite preview --host 127.0.0.1 --port 5398 --strictPort --mode arcana',
    url: 'http://127.0.0.1:5398',
    reuseExistingServer: false,
  },
});
