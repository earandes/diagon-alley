import { defineConfig } from '@playwright/test';
import { randomUUID } from 'node:crypto';
const namespace = `frog-opening-${randomUUID()}`;
export default defineConfig({
  testDir: './tests/browser-opening',
  outputDir: 'test-results-opening',
  workers: 1,
  timeout: 30_000,
  use: { viewport: { width: 1280, height: 900 }, trace: 'off' },
  projects: [
    {
      name: 'chromium-opening',
      use: { browserName: 'chromium', baseURL: 'http://127.0.0.1:5222' },
    },
    { name: 'webkit-opening', use: { browserName: 'webkit', baseURL: 'http://127.0.0.1:5223' } },
  ],
  webServer: [5222, 5223].map((port) => ({
    env: { ARCANA_TRIAL_NAMESPACE: `${namespace}-${port}` },
    command: `npx --no-install vite preview --host 127.0.0.1 --port ${port} --strictPort --mode arcana`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: false,
  })),
});
