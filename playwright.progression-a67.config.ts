import { defineSafeConfig as defineConfig } from './tools/verification/playwright-safety';
import { randomUUID } from 'node:crypto';
const namespace = `a67-progression-${randomUUID()}`;
export default defineConfig({
  testDir: './tests/browser-trial',
  testMatch: 'progression-a67.spec.ts',
  outputDir: 'test-results-progression-a67',
  workers: 1,
  timeout: 120000,
  use: {
    baseURL: 'http://127.0.0.1:5420',
    serviceWorkers: 'block',
    viewport: { width: 1280, height: 900 },
    trace: 'retain-on-failure',
    video: 'on',
  },
  projects: [
    { name: 'chromium-a67', use: { browserName: 'chromium' } },
    { name: 'webkit-a67', use: { browserName: 'webkit', baseURL: 'http://127.0.0.1:5421' } },
  ],
  webServer: [5420, 5421].map((port) => ({
    env: { ARCANA_TRIAL_NAMESPACE: `${namespace}-${port}` },
    command: `npx --no-install vite preview --host 127.0.0.1 --port ${port} --strictPort --mode arcana`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: false,
  })),
});
