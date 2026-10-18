import { defineSafeConfig } from './tools/verification/playwright-safety';

/** Linux only through the unchanged shared host guard and cross-process suite lock. */
export default defineSafeConfig({
  testDir: './tests/browser-motion',
  testMatch: /(?:motion-a69|audio-a84|houses-a85)\.spec\.ts$/,
  outputDir: 'test-results/motion-a69',
  timeout: 180000,
  expect: { timeout: 10000 },
  use: { baseURL: 'http://127.0.0.1:5469', serviceWorkers: 'block', hasTouch: true },
  projects: (['chromium', 'webkit'] as const).flatMap((browserName) =>
    [
      { width: 1280, height: 900 },
      { width: 390, height: 844 },
      { width: 865, height: 1079 },
    ].map((viewport) => ({
      name: `${browserName}-${viewport.width}-motion-a69`,
      use: { browserName, viewport },
    })),
  ),
  webServer: {
    command:
      'npx --no-install vite build --config tests/browser-motion/vite-motion-a69.config.ts && npx --no-install vite preview --config tests/browser-motion/vite-motion-a69.config.ts --host 127.0.0.1 --port 5469 --strictPort',
    url: 'http://127.0.0.1:5469/tests/browser-motion/motion-a69.html',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
