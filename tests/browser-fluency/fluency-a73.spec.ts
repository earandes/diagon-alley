import { expect, test } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { SceneMetric } from '../../src/arcana/presentation/scenes/scene-diagnostics';

const root = resolve('docs/arcana/boss-increment-2026-10-16/evidence/linux/a73');
declare global {
  interface Window {
    __a73: {
      frames: { at: number; ms: number }[];
      metrics: SceneMetric[];
      tasks: { start: number; duration: number }[];
      gpu: string[];
      phase: string;
    };
  }
}
// Bounded diagnostic sample only, no video, screenshots, trace or concurrent pages.
test('A73 bounded startup and sustained reference: generic and boss, three serial pairs', async ({
  browser,
}) => {
  test.skip(
    test.info().project.name !== 'chromium-1280-boss-a70',
    'One bounded Chromium sample; other projects retain functional coverage.',
  );
  test.setTimeout(180000);
  const records: object[] = [];
  for (let pair = 0; pair < 3; pair++)
    for (const kind of ['generic', 'boss']) {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        serviceWorkers: 'block',
      });
      const page = await context.newPage();
      await page.addInitScript(() => {
        const p = (window.__a73 = {
          frames: [],
          metrics: [],
          tasks: [],
          gpu: [],
          phase: 'startup',
        } as Window['__a73']);
        window.__arcanaSceneMetric = (metric) => {
          if (p.metrics.length < 6000) p.metrics.push(metric);
        };
        let previous = 0;
        const frame = (at: number) => {
          if (previous && p.frames.length < 3000) p.frames.push({ at, ms: at - previous });
          previous = at;
          requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
        if (PerformanceObserver.supportedEntryTypes.includes('longtask'))
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries())
              if (p.tasks.length < 100)
                p.tasks.push({ start: entry.startTime, duration: entry.duration });
          }).observe({ type: 'longtask', buffered: true });
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
          const result = original.apply(this, args);
          if (String(args[0]).startsWith('webgl') && result) {
            const gl = result as unknown as WebGLRenderingContext;
            const debug = gl.getExtension('WEBGL_debug_renderer_info');
            p.gpu.push(
              String(
                debug
                  ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
                  : gl.getParameter(gl.RENDERER),
              ),
            );
          }
          return result;
        } as typeof original;
      });
      const path =
        kind === 'generic'
          ? '/tests/browser-motion/motion-a69.html?player=3&rival=3'
          : '/tests/browser-boss/boss-a70.html?challenge=mastery';
      await page.goto(`http://127.0.0.1:5471${path}`);
      const scene = page.locator('.scene-canvas');
      await expect(scene).toHaveAttribute('data-art-ready', 'true');
      const startup = await page.evaluate(() => ({
        at: performance.now(),
        data: structuredClone(window.__a73),
        scene: { ...document.querySelector<HTMLElement>('.scene-canvas')!.dataset },
      }));
      const warmStart = await page.evaluate(() => performance.now());
      await page.waitForTimeout(10000);
      const warm = await page.evaluate(() => ({
        at: performance.now(),
        data: structuredClone(window.__a73),
        scene: { ...document.querySelector<HTMLElement>('.scene-canvas')!.dataset },
      }));
      await page.getByRole('button', { name: 'Pausa', exact: true }).click();
      await expect(scene).toHaveAttribute('data-active-ticking', 'false');
      await page.evaluate(
        () =>
          new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))),
      );
      const paused = await scene.getAttribute('data-render-count');
      await page.waitForTimeout(150);
      expect(await scene.getAttribute('data-render-count')).toBe(paused);
      await page.getByRole('button', { name: 'Omitir reproducción', exact: true }).click();
      await expect(page.locator('[data-arena-outcome]')).toBeVisible();
      records.push({ kind, pair, startup, warmStart, warm });
      await context.close();
    }
  await mkdir(root, { recursive: true });
  await writeFile(
    resolve(root, 'diagnostic-reference.json'),
    JSON.stringify(
      {
        sha: process.env.GITHUB_SHA,
        fixture: true,
        newContextEachSample: true,
        cache:
          'Fresh browser context; OS and process/shader caches uncontrolled. Not a hardware cold start.',
        instrumentation: 'Bounded sink, rAF, Long Tasks, no tracing or GPU timing.',
        records,
      },
      null,
      2,
    ),
  );
});
