import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '../../../../tests/browser-arcana',
  testMatch: /(arena-a63|arena-passives|arena-load|contrast)\.spec\.ts/,
  outputDir: './arena-results',
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:5362',
    viewport: { width: 390, height: 844 },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    cwd: process.cwd(),
    command: 'npx --no-install vite --host 127.0.0.1 --port 5362 --strictPort',
    url: 'http://127.0.0.1:5362/tests/arcana-arena-a63-harness.html',
    reuseExistingServer: false,
  },
});
