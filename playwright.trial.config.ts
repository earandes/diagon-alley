import { defineConfig } from '@playwright/test';
import { randomUUID } from 'node:crypto';
const namespace = 'arcana-browser-' + randomUUID();
const compiled = process.env.ARCANA_TRIAL_COMPILED === '1';
const command = (port: number) => compiled
  ? `npx --no-install vite preview --host 127.0.0.1 --port ${port} --strictPort --mode arcana`
  : `npm run dev:arcana -- --port ${port}`;
const port = Number(process.env.ARCANA_TRIAL_TEST_PORT_BASE ?? 5189);
const isolatedExperience = [
  '**/annotation-experience.spec.ts',
  '**/shop-journey.spec.ts',
  '**/commerce-a60.spec.ts',
  '**/pokelike-experience.spec.ts',
  '**/*-a63.spec.ts',
];
export default defineConfig({
  testDir: './tests/browser-trial',
  // A63 profiles/journeys have dedicated configs and isolated manual authorities.
  testIgnore: '**/*-a63.spec.ts',
  outputDir: 'test-results-arcana-journey',
  workers: 1,
  fullyParallel: false,
  timeout: 30000,
  use: {
    // This suite injects transport failures; worker/offline behavior has a separate suite.
    serviceWorkers: 'block',
    baseURL: `http://127.0.0.1:${port}`,
    viewport: { width: 390, height: 844 },
    trace: 'retain-on-failure',
  },
  // Existing journeys and A56 cases each get isolated test authority/session quotas.
  // All servers keep the real 30 entries/hour guard; no production bypass or quota increase.
  webServer: [
    {
      env: { ARCANA_TRIAL_NAMESPACE: namespace + '-chromium' },
      command: command(port),
      url: `http://127.0.0.1:${port}/`,
      reuseExistingServer: false,
    },
    {
      env: { ARCANA_TRIAL_NAMESPACE: namespace + '-webkit' },
      command: command(port + 3),
      url: `http://127.0.0.1:${port + 3}/`,
      reuseExistingServer: false,
    },
    ...[port + 2, port + 4].map((port) => ({
      env: { ARCANA_TRIAL_NAMESPACE: namespace + '-nodes-' + port },
      command: command(port),
      url: `http://127.0.0.1:${port}/`,
      reuseExistingServer: false,
    })),
  ],
  projects: [
    {
      name: 'chromium',
      testIgnore: ['**/visual-nodes.spec.ts', '**/game-redesign.spec.ts', ...isolatedExperience],
      use: { browserName: 'chromium' },
    },
    {
      name: 'webkit',
      testIgnore: ['**/visual-nodes.spec.ts', '**/game-redesign.spec.ts', ...isolatedExperience],
      use: { browserName: 'webkit', baseURL: `http://127.0.0.1:${port + 3}` },
    },
    {
      name: 'chromium-nodes',
      testMatch: '**/visual-nodes.spec.ts',
      use: { browserName: 'chromium', baseURL: `http://127.0.0.1:${port + 2}` },
    },
    {
      name: 'webkit-nodes',
      testMatch: '**/visual-nodes.spec.ts',
      use: { browserName: 'webkit', baseURL: `http://127.0.0.1:${port + 4}` },
    },
  ],
});
