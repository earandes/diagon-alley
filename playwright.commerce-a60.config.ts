import { defineSafeConfig as defineConfig } from './tools/verification/playwright-safety';
import { randomUUID } from 'node:crypto';
const namespace = `diagon-a60-commerce-${randomUUID()}`;
const compiled = false;
export default defineConfig({
  testDir: './tests/browser-trial',
  testMatch: ['**/commerce-a60.spec.ts', '**/shop-journey.spec.ts'],
  outputDir: 'test-results-commerce-a60',
  workers: 1,
  timeout: 90_000,
  use: { viewport: { width: 911, height: 1079 }, trace: 'retain-on-failure' },
  projects: [
    {
      name: 'chromium-experience',
      use: { browserName: 'chromium', baseURL: 'http://127.0.0.1:5274' },
    },
    { name: 'webkit-experience', use: { browserName: 'webkit', baseURL: 'http://127.0.0.1:5275' } },
  ],
  webServer: [5274, 5275].map((port) => ({
    env: { ARCANA_TRIAL_NAMESPACE: `${namespace}-${port}` },
    command: compiled
      ? `npx --no-install vite preview --host 127.0.0.1 --port ${port} --strictPort --mode arcana`
      : `npm run dev -- --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: false,
  })),
});
