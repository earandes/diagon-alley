import { defineSafeConfig as defineConfig } from './tools/verification/playwright-safety';
import { randomUUID } from 'node:crypto';
const namespace = `a58-art-${randomUUID()}`;
export default defineConfig({
  testDir: './tests/browser-art',
  outputDir: 'test-results-art',
  workers: 1,
  timeout: 30_000,
  use: { viewport: { width: 1280, height: 900 }, trace: 'off' },
  projects: [
    { name: 'chromium-art', use: { browserName: 'chromium', baseURL: 'http://127.0.0.1:5230' } },
    { name: 'webkit-art', use: { browserName: 'webkit', baseURL: 'http://127.0.0.1:5231' } },
  ],
  webServer: [5230, 5231].map((port) => ({
    env: { ARCANA_TRIAL_NAMESPACE: `${namespace}-${port}` },
    command: `npm run dev -- --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}/tests/arcana-art-harness.html`,
    reuseExistingServer: false,
  })),
});
