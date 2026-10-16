import { defineSafeConfig as defineConfig } from './tools/verification/playwright-safety';
import { randomUUID } from 'node:crypto';
process.env.ARCANA_PACT_EVIDENCE = 'docs/arcana/header-pact-2026-10-16/evidence/regression';
const namespace = `a66-${randomUUID()}`;
export default defineConfig({
  testDir: './tests/browser-trial',
  testMatch: ['header-pact-a66.spec.ts', 'tactical-pacts-a65.spec.ts'],
  outputDir: 'test-results-header-pact-a66',
  workers: 1,
  timeout: 90000,
  use: {
    serviceWorkers: 'block',
    viewport: { width: 1280, height: 900 },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium-a66', use: { browserName: 'chromium', baseURL: 'http://127.0.0.1:5402' } },
    { name: 'webkit-a66', use: { browserName: 'webkit', baseURL: 'http://127.0.0.1:5403' } },
  ],
  webServer: [5402, 5403].map((port) => ({
    env: { ARCANA_TRIAL_NAMESPACE: `${namespace}-${port}` },
    command: `npx --no-install vite preview --host 127.0.0.1 --port ${port} --strictPort --mode arcana`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: false,
  })),
});
