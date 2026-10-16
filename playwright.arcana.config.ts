import { defineSafeConfig as defineConfig } from './tools/verification/playwright-safety';
export default defineConfig({
  testDir: './tests/browser-arcana',
  outputDir: 'test-results-arcana',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:5198',
    viewport: { width: 390, height: 844 },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'npm run dev -- --port 5198 --strictPort',
    url: 'http://127.0.0.1:5198/tests/arcana-client-harness.html',
    reuseExistingServer: false,
  },
});
