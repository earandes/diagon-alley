import { defineSafeConfig as defineConfig } from './tools/verification/playwright-safety';
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 3,
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:5189',
    viewport: { width: 390, height: 844 },
    trace: 'retain-on-failure',
    reducedMotion: 'no-preference',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'npm run dev -- --port 5189 --strictPort',
    url: 'http://127.0.0.1:5189',
    reuseExistingServer: false,
  },
});
