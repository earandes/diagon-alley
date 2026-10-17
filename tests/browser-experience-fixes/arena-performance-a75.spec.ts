import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
declare global {
  interface Window {
    __a75Perf: {
      start: number | null;
      ready: number | null;
      frames: { at: number; ms: number; phase: string; cursor: number }[];
      tasks: { at: number; ms: number }[];
      stop: () => void;
    };
  }
}
const evidence = resolve('docs/arcana/experience-fixes-2026-10-17/evidence/linux');
const percentile = (numbers: number[], p: number) =>
  [...numbers].sort((a, b) => a - b)[Math.max(0, Math.ceil(numbers.length * p) - 1)];

test('A75 paired mobile sustained replay and lifecycle preserve confirmed log', async ({
  browser,
}) => {
  test.skip(
    test.info().project.name !== 'chromium-390-a75',
    'Three fixed AB/BA/AB pairs in one Linux Chromium mobile-emulation project, not a universal device benchmark.',
  );
  test.setTimeout(240000);
  const results = [];
  for (const [pair, order] of [
    ['baseline', 'current'],
    ['current', 'baseline'],
    ['baseline', 'current'],
  ].entries())
    for (const variant of order) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        serviceWorkers: 'block',
        hasTouch: true,
      });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.addInitScript(() => {
        const p = (window.__a75Perf = {
          start: null,
          ready: null,
          frames: [],
          tasks: [],
          stop: () => {},
        } as Window['__a75Perf']);
        document.addEventListener(
          'pointerdown',
          (e) => {
            if ((e.target as HTMLElement)?.closest('[data-qa-start]')) p.start = performance.now();
          },
          { once: true },
        );
        const observer = new MutationObserver(() => {
          const scene = document.querySelector<HTMLElement>('.scene-canvas');
          if (
            p.ready === null &&
            scene?.dataset.artReady === 'true' &&
            scene.dataset.bossActorReady === 'true'
          )
            requestAnimationFrame(() => {
              p.ready ??= performance.now();
              observer.disconnect();
            });
        });
        observer.observe(document, {
          attributes: true,
          subtree: true,
          attributeFilter: ['data-art-ready', 'data-boss-actor-ready'],
        });
        let previous = 0,
          handle = 0;
        let panel: HTMLElement | null = null;
        const frame = (at: number) => {
          if (!panel?.isConnected) panel = document.querySelector<HTMLElement>('.battle-panel');
          if (previous && p.frames.length < 3000)
            p.frames.push({
              at,
              ms: at - previous,
              phase: panel?.dataset.replayPhase ?? '',
              cursor: Number(panel?.dataset.replayCursor ?? -1),
            });
          previous = at;
          handle = requestAnimationFrame(frame);
        };
        handle = requestAnimationFrame(frame);
        let tasks: PerformanceObserver | undefined;
        if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
          tasks = new PerformanceObserver((list) => {
            for (const e of list.getEntries())
              if (p.tasks.length < 100) p.tasks.push({ at: e.startTime, ms: e.duration });
          });
          tasks.observe({ type: 'longtask', buffered: true });
        }
        p.stop = () => {
          cancelAnimationFrame(handle);
          observer.disconnect();
          tasks?.disconnect();
        };
      });
      await page.goto(
        `http://127.0.0.1:5521${variant === 'baseline' ? '/a75-reference' : ''}/tests/browser-boss/boss-a70.html?manual&challenge=mastery&player=5`,
      );
      const moduleReadyAt = await page.evaluate(() => performance.now());
      await page.locator('[data-qa-start]').click();
      await page.waitForFunction(() => window.__a75Perf.ready !== null);
      const source = await page.evaluate(() => ({
        battle: window.__a70Fixture.battle,
        game: window.__a70Fixture.game,
      }));
      // A declared 10s sustained window after 500ms warmup. This is observation,
      // not a delay inserted into the product or time attributed to a human.
      await page.waitForTimeout(10500);
      const metrics = await page.evaluate(() => {
        window.__a75Perf.stop();
        const p = window.__a75Perf;
        return { start: p.start, ready: p.ready, frames: p.frames, tasks: p.tasks };
      });
      const steady = metrics.frames.filter(
        (f) => f.at >= metrics.ready! + 500 && f.at < metrics.ready! + 10500,
      );
      expect(steady.length).toBeGreaterThan(150);
      const scene = page.locator('.scene-canvas'),
        panel = page.locator('.battle-panel');
      await page.getByRole('button', { name: 'Pausa', exact: true }).click();
      const cursor = await panel.getAttribute('data-replay-cursor');
      await page.getByRole('button', { name: '2x', exact: true }).click();
      await page.locator('.arena-inspect').first().click();
      await expect(page.locator('.arena-inspector[open]')).toBeVisible();
      await page.keyboard.press('Escape');
      expect(await panel.getAttribute('data-replay-cursor')).toBe(cursor);
      const renders = await scene.getAttribute('data-render-count');
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.evaluate(
        () =>
          new Promise<void>((done) =>
            requestAnimationFrame(() => requestAnimationFrame(() => done())),
          ),
      );
      expect(await panel.getAttribute('data-replay-cursor')).toBe(cursor);
      expect(await scene.getAttribute('data-render-count')).toBe(renders);
      await page.evaluate(() => {
        Reflect.deleteProperty(document, 'hidden');
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.getByRole('button', { name: 'Omitir reproducción', exact: true }).click();
      await expect(page.locator('[data-arena-outcome]')).toBeVisible();
      expect(
        await page.evaluate(() => ({
          battle: window.__a70Fixture.battle,
          game: window.__a70Fixture.game,
        })),
      ).toEqual(source);
      expect(errors).toEqual([]);
      results.push({
        pair,
        variant,
        moduleReadyAt,
        actionToReadyFrameMs: metrics.ready! - metrics.start!,
        navigationToReadyFrameMs: metrics.ready,
        sustained: {
          samples: steady.length,
          p95: percentile(
            steady.map((f) => f.ms),
            0.95,
          ),
          maximum: Math.max(...steady.map((f) => f.ms)),
        },
        temporalFrames: steady.map((f, i) => (i % 12 === 0 ? f : null)).filter(Boolean),
        longTasks: metrics.tasks,
        pausedCursor: cursor,
        preservedBattleAndGame: true,
        errors,
      });
      await context.close();
    }
  await mkdir(evidence, { recursive: true });
  await writeFile(
    resolve(evidence, 'paired-mobile-performance.json'),
    JSON.stringify(
      {
        sha: process.env.GITHUB_SHA,
        baseline: '937a0a1f00bdbca7009a80cd99b7b4b450f652f0',
        fixture: true,
        physicalDevice: false,
        profile:
          '390x844 / ES Diagon / declared mastery5x5 / AB-BA-AB / fresh isolated browser contexts; application module evaluated before explicit fixture mount. rAF is not GPU time.',
        results,
      },
      null,
      2,
    ),
  );
  const before = results.filter((r) => r.variant === 'baseline').map((r) => r.sustained.p95),
    after = results.filter((r) => r.variant === 'current').map((r) => r.sustained.p95);
  expect(percentile(after, 0.5)).toBeLessThanOrEqual(Math.max(20, percentile(before, 0.5) + 1));
});
