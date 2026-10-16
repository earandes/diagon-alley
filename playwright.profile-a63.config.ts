import { defineSafeConfig as defineConfig } from './tools/verification/playwright-safety';
export default defineConfig({
  testDir: './tests/browser-trial',
  testMatch: 'arena-profile-a63.spec.ts',
  outputDir: 'test-results-profile-a63',
  workers: 1,
  timeout: 90000,
  use: { baseURL: process.env.A63_PROFILE_URL ?? 'http://127.0.0.1:5360' },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
