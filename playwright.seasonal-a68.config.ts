import { randomUUID } from 'node:crypto';
import { defineSafeConfig } from './tools/verification/playwright-safety';

/** Linux only. No local bypass, recordings, automatic retries or parallel workers. */
export default defineSafeConfig({
  testDir: './tests/browser-trial',
  testMatch: 'seasonal-a68.spec.ts',
  outputDir: 'test-results-seasonal-a68',
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:5456', serviceWorkers: 'block', hasTouch: true },
  projects: (['chromium', 'webkit'] as const).flatMap((browserName) =>
    [
      { width: 1280, height: 900 },
      { width: 390, height: 844 },
      { width: 865, height: 1079 },
    ].flatMap((viewport) =>
      [false, true].map((rendererFailure) => ({
        name: `${browserName}-${viewport.width}-${rendererFailure ? 'fallback' : 'normal'}-a68`,
        use: { browserName, viewport },
        metadata: { rendererFailure },
      })),
    ),
  ),
  webServer: {
    command:
      'npx --no-install vite preview --host 127.0.0.1 --port 5456 --strictPort --mode arcana',
    url: 'http://127.0.0.1:5456/',
    env: { ARCANA_TRIAL_NAMESPACE: `a68-seasonal-${randomUUID()}` },
    reuseExistingServer: false,
  },
});
