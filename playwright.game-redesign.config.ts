import { defineConfig } from '@playwright/test';
import { randomUUID } from 'node:crypto';
const namespace = `diagon-redesign-${randomUUID()}`;
const compiledPreview = process.env.ARCANA_REDESIGN_COMPILED_PREVIEW === '1';
export default defineConfig({
  testDir: './tests/browser-trial',
  testMatch: '**/game-redesign.spec.ts',
  outputDir: 'test-results-game-redesign',
  workers: 1,
  timeout: 60_000,
  use: {
    viewport: { width: 1280, height: 900 },
    trace: compiledPreview ? 'off' : 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium-redesign',
      use: { browserName: 'chromium', baseURL: 'http://127.0.0.1:5216' },
    },
    { name: 'webkit-redesign', use: { browserName: 'webkit', baseURL: 'http://127.0.0.1:5217' } },
  ],
  webServer: [5216, 5217].map((port) => ({
    env: { ARCANA_TRIAL_NAMESPACE: `${namespace}-${port}` },
    command: compiledPreview
      ? `npx --no-install vite preview --host 127.0.0.1 --port ${port} --strictPort --mode arcana`
      : `npm run dev:arcana -- --port ${port}`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: false,
  })),
});
