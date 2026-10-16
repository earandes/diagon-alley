import { defineConfig } from '@playwright/test';
import { randomUUID } from 'node:crypto';
const namespace = `a63-preparation-${randomUUID()}`;
export default defineConfig({
  testDir: './docs/arcana/gameplay-increment-2026-10-16/evidence',
  testMatch: 'preparation.spec.ts', outputDir: 'test-results-preparation-a63', workers: 1,
  timeout: 150000,
  use: { actionTimeout: 15000, baseURL: 'http://127.0.0.1:5367', viewport: { width: 390, height: 844 }, trace: 'retain-on-failure', video: 'on' },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit', baseURL: 'http://127.0.0.1:5368' } },
  ],
  webServer: [5367,5368].map(port => ({
    env: { ARCANA_TRIAL_NAMESPACE: `${namespace}-${port}` },
    command: `npx --no-install vite preview --host 127.0.0.1 --port ${port} --strictPort --mode arcana`,
    url: `http://127.0.0.1:${port}/`, reuseExistingServer: false,
  })),
});
