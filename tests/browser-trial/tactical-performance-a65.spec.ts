import { test, expect, type Page, type Locator } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { startExpedition } from './game-fixture';
import { readGame } from './route-helpers';
import { routePath } from '../support/arcana-route';
const output = resolve('docs/arcana/tactical-increment-2026-10-16/evidence/performance-pacts');
async function action(
  page: Page,
  name: string,
  control: Locator,
  completed: () => Promise<void>,
  scene: Locator,
) {
  await page.evaluate(() => {
    const scope = window as unknown as { a65Pointer: number };
    document.addEventListener(
      'pointerdown',
      (event) => {
        scope.a65Pointer = event.timeStamp;
      },
      { once: true, capture: true },
    );
  });
  await control.click();
  await completed();
  const visible = await page.evaluate(() => performance.now());
  const settled = await scene.evaluate(async (element) => {
    const images = [...element.querySelectorAll('img')];
    await Promise.all(images.map((image) => image.decode().catch(() => {})));
    const finite = element
      .getAnimations({ subtree: true })
      .filter((animation) => animation.effect?.getTiming().iterations !== Infinity);
    await Promise.all(finite.map((animation) => animation.finished.catch(() => {})));
    await new Promise<void>((done) =>
      requestAnimationFrame(() => requestAnimationFrame(() => done())),
    );
    const start = (window as unknown as { a65Pointer: number }).a65Pointer;
    return {
      start,
      settled: performance.now(),
      images: images.length,
      broken: images.filter((i) => !i.complete || i.naturalWidth === 0).length,
      network: performance
        .getEntriesByType('resource')
        .filter((e) => e.startTime >= start && e.name.includes('/api/'))
        .map((e) => ({ path: new URL(e.name).pathname, durationMs: e.duration })),
    };
  });
  return {
    name,
    inputToVisibleMs: visible - settled.start,
    inputToDecodedAndSettledMs: settled.settled - settled.start,
    images: settled.images,
    broken: settled.broken,
    network: settled.network,
  };
}
async function reachDuel(page: Page) {
  const run = (await readGame(page)).exploration!.run!;
  const path = routePath(run.graph, run.visited, 'duel');
  for (const id of path.slice(0, -1)) {
    await page.locator(`[data-node="${id}"]`).click();
    const candidates = page.locator('[data-pact-candidate]');
    if (await candidates.count()) await candidates.first().click();
    const pass = page.locator('[data-preparation="encounter"] [data-visual-value="pass"]');
    if (await pass.count()) await pass.click();
    await page.locator('.node-confirm-action').click();
    await expect(page.locator('.node-event-dialog')).toHaveCount(0);
  }
  return path.at(-1)!;
}
for (const viewport of [
  { width: 1280, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`A65 action and eight-second arena profile ${viewport.width}`, async ({ page }, info) => {
    await mkdir(output, { recursive: true });
    await page.setViewportSize(viewport);
    await page.addInitScript(() =>
      localStorage.setItem('arcana.presentation.content-pack.v1', 'diagon-alley'),
    );
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.locator('.portal-enter').click();
    await startExpedition(page);
    const run = (await readGame(page)).exploration!.run!,
      id = run.graph.nodes.find((n) => n.row === 0)!.id;
    const profiles = [];
    profiles.push(
      await action(
        page,
        'open-pact',
        page.locator(`[data-node="${id}"]`),
        async () => {
          await expect(page.locator('[data-tactical-pact]')).toBeVisible();
        },
        page.locator('.node-event-dialog'),
      ),
    );
    profiles.push(
      await action(
        page,
        'select-candidate',
        page.locator('[data-pact-candidate]').first(),
        async () => {
          await expect(page.locator('[data-pact-candidate]').first()).toHaveAttribute(
            'aria-pressed',
            'true',
          );
        },
        page.locator('.node-event-dialog'),
      ),
    );
    profiles.push(
      await action(
        page,
        'confirmed-recruitment',
        page.locator('.node-confirm-action'),
        async () => {
          await expect(page.locator('.node-event-dialog')).toHaveCount(0);
        },
        page.locator('.branch-map'),
      ),
    );
    const duel = await reachDuel(page);
    await page.locator(`[data-node="${duel}"]`).click();
    // The sample starts at the actual pointer event, before HTTP and renderer creation.
    const sample = page.evaluate(
      () =>
        new Promise<unknown>((done) => {
          const begin = (event: PointerEvent) => {
            const start = event.timeStamp,
              frames: number[] = [],
              tasks: { startMs: number; durationMs: number }[] = [];
            let prior = start;
            const supports = PerformanceObserver.supportedEntryTypes.includes('longtask');
            const observer = supports
              ? new PerformanceObserver((list) => {
                  tasks.push(
                    ...list
                      .getEntries()
                      .filter((e) => e.startTime >= start)
                      .map((e) => ({ startMs: e.startTime - start, durationMs: e.duration })),
                  );
                })
              : null;
            observer?.observe({ entryTypes: ['longtask'] });
            const frame = (now: number) => {
              frames.push(now - prior);
              prior = now;
              if (now - start < 8000) {
                requestAnimationFrame(frame);
                return;
              }
              observer?.disconnect();
              const sorted = [...frames].sort((a, b) => a - b),
                elapsed = now - start;
              done({
                inputMs: start,
                elapsedMs: elapsed,
                rafCallbacks: frames.length,
                estimatedRafHz: (frames.length * 1000) / elapsed,
                p95FrameMs: sorted[Math.floor(sorted.length * 0.95)],
                maxFrameMs: Math.max(...frames),
                longtasks: supports ? tasks : null,
                network: performance
                  .getEntriesByType('resource')
                  .filter((e) => e.startTime >= start && e.name.includes('/api/'))
                  .map((e) => ({ path: new URL(e.name).pathname, durationMs: e.duration })),
                viewport: { width: innerWidth, height: innerHeight },
                document: {
                  width: document.documentElement.scrollWidth,
                  height: document.documentElement.scrollHeight,
                },
              });
            };
            requestAnimationFrame(frame);
          };
          document.addEventListener('pointerdown', begin, { once: true, capture: true });
        }),
    );
    await page.locator('.node-confirm-action').click();
    await expect(page.locator('.arena-a63')).toBeVisible();
    const visibleAt = await page.evaluate(() => performance.now());
    const decodedAt = await page.locator('.arena-a63').evaluate(async (element) => {
      await Promise.all(
        [...element.querySelectorAll('img')].map((image) => image.decode().catch(() => {})),
      );
      return performance.now();
    });
    const committed = await readGame(page),
      arena = (await sample) as { inputMs: number; [key: string]: unknown };
    expect(await readGame(page)).toEqual(committed);
    const result = {
      browser: info.project.name,
      viewport,
      scope:
        'Fresh isolated compiled GUI; Diagon Alley ES; normal motion; serial run. Pact scenes wait for image decode and finite authored transitions. Arena window is 8 seconds from pointerdown, including HTTP and renderer startup. rAF cadence is not displayed GPU FPS or physical device evidence. WebKit has no longtask API when reported null. No equivalent before baseline or improvement percentage.',
      profiles,
      arena: {
        ...arena,
        inputToArenaVisibleMs: visibleAt - arena.inputMs,
        inputToPortraitsDecodedMs: decodedAt - arena.inputMs,
      },
    };
    await writeFile(
      resolve(output, `${info.project.name}-${viewport.width}.json`),
      JSON.stringify(result, null, 2),
    );
    await page.screenshot({
      path: resolve(output, `${info.project.name}-${viewport.width}.png`),
      fullPage: true,
      animations: 'disabled',
    });
  });
}
