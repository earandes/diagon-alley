import { defineSafeConfig as defineConfig } from './tools/verification/playwright-safety';
import { randomUUID } from 'node:crypto';

const namespace = `diagon-a60-${randomUUID()}`;
const compiled = process.env.ARCANA_A60_COMPILED === '1';
export default defineConfig({
  testDir: './tests/browser-trial',
  testMatch: '**/pokelike-experience.spec.ts',
  outputDir: 'test-results-pokelike',
  workers: 1,
  timeout: 120_000,
  use: { viewport: { width: 865, height: 1079 }, trace: 'retain-on-failure' },
  projects: [
    {
      name: 'chromium-pokelike',
      use: { browserName: 'chromium', baseURL: 'http://127.0.0.1:5280' },
    },
    { name: 'webkit-pokelike', use: { browserName: 'webkit', baseURL: 'http://127.0.0.1:5281' } },
  ],
  webServer: [5280, 5281].map((port) => ({
    env: { ARCANA_TRIAL_NAMESPACE: `${namespace}-${port}` },
    command: compiled
      ? `npx --no-install vite preview --host 127.0.0.1 --port ${port} --strictPort --mode arcana`
      : `npm run dev -- --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: false,
  })),
});
