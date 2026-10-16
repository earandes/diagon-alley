import { defineConfig } from '@playwright/test';
import { randomUUID } from 'node:crypto';
export default defineConfig({
  testDir: './tests/browser-pwa',
  outputDir: 'test-results-arcana-pwa',
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:5218',
    viewport: { width: 390, height: 844 },
    trace: 'retain-on-failure',
  },
  webServer: {
    env: { ARCANA_TRIAL_NAMESPACE: 'arcana-pwa-' + randomUUID() },
    command:
      'npx --no-install vite preview --host 127.0.0.1 --port 5218 --strictPort --mode arcana',
    url: 'http://127.0.0.1:5218/',
    reuseExistingServer: false,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
