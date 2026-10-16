import { defineSafeConfig as defineConfig } from './tools/verification/playwright-safety';
import { randomUUID } from 'node:crypto';
const namespace = `a65-pacts-${randomUUID()}`;
export default defineConfig({
  testDir: './tests/browser-trial',
  testMatch:
    process.env.A65_PROFILE === '1'
      ? 'tactical-performance-a65.spec.ts'
      : 'tactical-pacts-a65.spec.ts',
  outputDir:
    process.env.A65_PROFILE === '1'
      ? 'test-results-tactics-profile-a65'
      : 'test-results-tactics-a65',
  workers: 1,
  timeout: 90000,
  use: {
    baseURL: 'http://127.0.0.1:5396',
    serviceWorkers: 'block',
    viewport: { width: 1280, height: 900 },
    trace: 'retain-on-failure',
    video: 'on',
  },
  projects: [
    { name: 'chromium-a65', use: { browserName: 'chromium' } },
    { name: 'webkit-a65', use: { browserName: 'webkit', baseURL: 'http://127.0.0.1:5397' } },
  ],
  webServer: [5396, 5397].map((port) => ({
    env: { ARCANA_TRIAL_NAMESPACE: `${namespace}-${port}` },
    command: `npx --no-install vite preview --host 127.0.0.1 --port ${port} --strictPort --mode arcana`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: false,
  })),
});
