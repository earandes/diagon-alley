import { defineSafeConfig as defineConfig } from './tools/verification/playwright-safety';
import { randomUUID } from 'node:crypto';
const external = process.env.A63_BASE_URL;
const namespace = `a63-gameplay-${randomUUID()}`;
const ports = [5365, 5366];
export default defineConfig({
  testDir: './tests/browser-trial',
  testMatch: 'gameplay-increment-a63.spec.ts',
  outputDir: 'test-results-gameplay-a63',
  workers: 1,
  timeout: 150000,
  // Transport fixtures must intercept network calls; PWA has its own worker-enabled suite.
  use: {
    baseURL: external ?? `http://127.0.0.1:${ports[0]}`,
    serviceWorkers: 'block',
    viewport: { width: 1280, height: 900 },
    trace: 'retain-on-failure',
    video: 'on',
  },
  projects: [
    { name: 'chromium-a63', use: { browserName: 'chromium' } },
    {
      name: 'webkit-a63',
      use: { browserName: 'webkit', baseURL: external ?? `http://127.0.0.1:${ports[1]}` },
    },
  ],
  webServer: external
    ? undefined
    : ports.map((port) => ({
        env: { ARCANA_TRIAL_NAMESPACE: `${namespace}-${port}` },
        command: `npx --no-install vite preview --host 127.0.0.1 --port ${port} --strictPort --mode arcana`,
        url: `http://127.0.0.1:${port}/`,
        reuseExistingServer: false,
      })),
});
