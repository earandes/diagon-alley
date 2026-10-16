import { defineConfig, type PlaywrightTestConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const fullSuiteMessage =
  'Baterías gráficas desactivadas en macOS tras el incidente de WindowServer del 16/10/2026. Ejecutarlas en CI Linux. No repetir capturas, vídeo o WebKit localmente para reproducir el fallo.';

/** This machine has suffered a WindowServer capture failure. Full graphical runs belong on Linux. */
export function safePlaywrightConfig(
  config: PlaywrightTestConfig,
  platform: NodeJS.Platform,
): PlaywrightTestConfig {
  if (platform === 'darwin') throw new Error(fullSuiteMessage);
  const setup = config.globalSetup
    ? Array.isArray(config.globalSetup)
      ? config.globalSetup
      : [config.globalSetup]
    : [];
  const recording = { video: 'off' as const, trace: 'off' as const, screenshot: 'off' as const };
  return {
    ...config,
    workers: 1,
    fullyParallel: false,
    retries: 0,
    globalSetup: [fileURLToPath(new URL('./playwright-suite-lock.ts', import.meta.url)), ...setup],
    use: { ...config.use, ...recording },
    projects: config.projects?.map((project) => ({
      ...project,
      use: { ...project.use, ...recording },
    })),
  };
}
export const defineSafeConfig = (config: PlaywrightTestConfig) =>
  defineConfig(safePlaywrightConfig(config, process.platform));

/** The sole macOS exception is the fixed one-test smoke, launched by its resource watchdog. */
export function defineBoundedLocalSmoke(config: PlaywrightTestConfig) {
  const permission = process.env.ARCANA_LOCAL_SMOKE_PERMISSION;
  if (!permission)
    throw new Error('Usar npm run test:browser:local; no lanzar el smoke directamente.');
  const owner = JSON.parse(readFileSync(permission, 'utf8'));
  if (!owner.pid || owner.token !== process.env.ARCANA_LOCAL_SMOKE_TOKEN)
    throw new Error('Control local inválido');
  process.kill(owner.pid, 0);
  if (
    config.projects?.length !== 1 ||
    config.projects[0].use?.browserName !== 'chromium' ||
    config.testMatch !== 'browser-local-smoke-a67.spec.ts'
  )
    throw new Error('Solo se permite el smoke fijo de Chromium');
  return defineConfig({
    ...safePlaywrightConfig(config, 'linux'),
    timeout: 30000,
    globalTimeout: 45000,
    maxFailures: 1,
  });
}
