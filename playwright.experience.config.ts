import { defineConfig } from '@playwright/test';
import { randomUUID } from 'node:crypto';
const namespace = `diagon-a59-${randomUUID()}`;
const compiled = process.env.ARCANA_A59_COMPILED === '1';
export default defineConfig({
  testDir: './tests/browser-trial',
  testMatch: ['**/annotation-experience.spec.ts', '**/shop-journey.spec.ts'],
  outputDir: 'test-results-experience',
  workers: 1,
  timeout: 90_000,
  use: { viewport: { width: 911, height: 1079 }, trace: 'retain-on-failure' },
  projects: [
    {
      name: 'chromium-experience',
      use: { browserName: 'chromium', baseURL: 'http://127.0.0.1:5244' },
    },
    { name: 'webkit-experience', use: { browserName: 'webkit', baseURL: 'http://127.0.0.1:5245' } },
  ],
  webServer: [5244, 5245].map((port) => ({
    env: { ARCANA_TRIAL_NAMESPACE: `${namespace}-${port}` },
    command: compiled
      ? `npx --no-install vite preview --host 127.0.0.1 --port ${port} --strictPort --mode arcana`
      : `npm run dev -- --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: false,
  })),
});
