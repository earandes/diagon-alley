import { defineSafeConfig as defineConfig } from './tools/verification/playwright-safety';
import { randomUUID } from 'node:crypto';
const external = process.env.A65_INTENTIONS_BASE_URL;
const namespace = `a65-intentions-${randomUUID()}`;
const ports = [5394, 5395];
export default defineConfig({
  testDir: './tests/browser-trial',
  testMatch: 'tactical-intentions-a65.spec.ts',
  outputDir: 'test-results-intentions-a65',
  workers: 1,
  timeout: 150000,
  use: {
    baseURL: external ?? `http://127.0.0.1:${ports[0]}`,
    serviceWorkers: 'block',
    viewport: { width: 1280, height: 900 },
    trace: 'retain-on-failure',
    video: 'on',
  },
  projects: [
    { name: 'chromium-intentions-a65', use: { browserName: 'chromium' } },
    {
      name: 'webkit-intentions-a65',
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
