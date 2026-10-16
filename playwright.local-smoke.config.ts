import { randomUUID } from 'node:crypto';
import { defineBoundedLocalSmoke } from './tools/verification/playwright-safety';
export default defineBoundedLocalSmoke({
  testDir: './tests/browser-trial',
  testMatch: 'browser-local-smoke-a67.spec.ts',
  outputDir: 'test-results-local-smoke',
  use: {
    baseURL: 'http://127.0.0.1:5455',
    serviceWorkers: 'block',
    hasTouch: true,
    viewport: { width: 865, height: 900 },
  },
  projects: [{ name: 'chromium-local-smoke', use: { browserName: 'chromium' } }],
  webServer: {
    command:
      'npx --no-install vite preview --host 127.0.0.1 --port 5455 --strictPort --mode arcana',
    url: 'http://127.0.0.1:5455/',
    env: { ARCANA_TRIAL_NAMESPACE: `local-smoke-${randomUUID()}` },
    reuseExistingServer: false,
    timeout: 10000,
  },
});
