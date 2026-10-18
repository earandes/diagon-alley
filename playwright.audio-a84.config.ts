import { defineSafeConfig } from './tools/verification/playwright-safety';
export default defineSafeConfig({
  testDir: './tests/browser-audio',
  testMatch: 'audio-a84.spec.ts',
  outputDir: 'test-results/audio-a84',
  timeout: 120000,
  maxFailures: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/audio-a84/results.json' }]],
  use: { baseURL: 'http://127.0.0.1:5544', serviceWorkers: 'block', hasTouch: true },
  projects: [
    {
      name: 'chromium-390-a84',
      use: { browserName: 'chromium', viewport: { width: 390, height: 844 } },
    },
    {
      name: 'chromium-1280-a84',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'webkit-865-a84',
      use: { browserName: 'webkit', viewport: { width: 865, height: 1079 } },
    },
  ],
  webServer: {
    command:
      'npx --no-install vite build --config tests/browser-audio/vite-audio-a84.config.ts && npx --no-install vite preview --config tests/browser-audio/vite-audio-a84.config.ts --host 127.0.0.1 --port 5544 --strictPort',
    url: 'http://127.0.0.1:5544/tests/browser-audio/audio-a84.html',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
