import { expect, test, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { changeLanguage } from '../browser-trial/game-fixture';
import { readGame } from '../browser-trial/route-helpers';
const root = resolve(
  process.env.ARCANA_OPENING_EVIDENCE_ROOT ?? 'docs/arcana/pokelike-2026-10-15/qa/opening',
);
test.beforeAll(async () => {
  await mkdir(resolve(root, 'captures'), { recursive: true });
});
const baseline = process.env.ARCANA_OPENING_BASELINE === '1';

type Probe = {
  frames: { start: number; duration: number }[];
  tasks: { start: number; duration: number }[];
  contexts: { type: string; start: number; duration: number }[];
  glCalls: { name: string; start: number; duration: number }[];
  decodes: { source: string; start: number; duration: number }[];
  marks: Record<string, number>;
  longTasksSupported: boolean;
};
declare global {
  interface Window {
    openingProbe: Probe;
  }
}
async function observe(page: Page) {
  await page.addInitScript(() => {
    const p: Probe = (window.openingProbe = {
      frames: [],
      tasks: [],
      contexts: [],
      glCalls: [],
      decodes: [],
      marks: {},
      longTasksSupported: PerformanceObserver.supportedEntryTypes.includes('longtask'),
    });
    let prior = 0;
    const frame = (time: number) => {
      if (prior) p.frames.push({ start: prior, duration: time - prior });
      prior = time;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    if (p.longTasksSupported)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          p.tasks.push({ start: entry.startTime, duration: entry.duration });
      }).observe({ type: 'longtask', buffered: true });
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      ...args: Parameters<typeof getContext>
    ) {
      const start = performance.now();
      try {
        const context = getContext.apply(this, args);
        if (context && /webgl/.test(String(args[0]))) {
          const gl = context as unknown as Record<string, (...args: unknown[]) => unknown>;
          for (const name of [
            'compileShader',
            'linkProgram',
            'getProgramParameter',
            'getShaderParameter',
            'getUniformLocation',
            'drawElements',
            'drawArrays',
          ]) {
            const original = gl[name];
            if (typeof original !== 'function') continue;
            gl[name] = function (...parameters: unknown[]) {
              const start = performance.now();
              try {
                return original.apply(context, parameters);
              } finally {
                p.glCalls.push({ name, start, duration: performance.now() - start });
              }
            };
          }
        }
        return context;
      } finally {
        p.contexts.push({ type: String(args[0]), start, duration: performance.now() - start });
      }
    } as typeof getContext;
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = async function () {
      const start = performance.now();
      try {
        await decode.call(this);
      } finally {
        p.decodes.push({
          source: this.currentSrc || this.src,
          start,
          duration: performance.now() - start,
        });
      }
    };
  });
}
async function mark(page: Page, name: string) {
  await page.evaluate((name) => {
    window.openingProbe.marks[name] = performance.now();
  }, name);
}
async function prepare(page: Page, language: 'es' | 'en') {
  await page.goto('/');
  await mark(page, 'welcome');
  if (language === 'en') await changeLanguage(page, 'en');
  await page
    .getByRole('button', {
      name: language === 'en' ? 'Start local trial' : 'Comenzar ensayo local',
      exact: true,
    })
    .click();
  await page
    .getByRole('button', { name: language === 'en' ? 'Diagon Alley' : 'Callejón', exact: true })
    .click();
  await page.locator('[data-shop="confectionery"]').click();
  await mark(page, 'commerce');
  await expect(page.locator('.shop-purchase-ticket')).toBeEnabled();
  await expect(page.locator('.open-frog-action')).toHaveCount(0);
  // No purchase or artificial render warmup before the measured explicit action.
  await mark(page, 'buyOpenReady');
}
async function open(page: Page) {
  await mark(page, 'open');
  await page.locator('.shop-purchase-ticket').click();
  await expect(page.locator('dialog.reveal')).toHaveAttribute('data-opening-state', 'playing');
  await mark(page, 'reveal');
}
for (const language of ['es', 'en'] as const) {
  test(`A60 cold complete buy and opening ${language}`, async ({ page }, info) => {
    await observe(page);
    await prepare(page, language);
    let openings = 0;
    page.on('request', (request) => {
      if (request.method() === 'POST' && request.url().endsWith('/api/toads/buy-open')) openings++;
    });
    await open(page);
    const committed = await readGame(page);
    expect(committed.inventory.crowns).toBe(40);
    expect(committed.inventory.products).toMatchObject([
      { kind: 'cacao-toad', status: 'consumed' },
    ]);
    expect(committed.receipts.at(-1)?.kind).toBe('buy-open-toad');
    expect(committed.receipts.filter((receipt) => receipt.kind === 'buy-open-toad')).toHaveLength(
      1,
    );
    const magic = page.locator('.frog-magic');
    await expect(magic).toHaveAttribute('data-renderer', /webgl|canvas2d/);
    await expect.poll(() => magic.getAttribute('data-render-count')).not.toBe('0');
    const renderer = await magic.getAttribute('data-renderer');
    const firstDraws = Number(await magic.getAttribute('data-render-count'));
    await page.waitForTimeout(250);
    expect(Number(await magic.getAttribute('data-render-count'))).toBeGreaterThan(firstDraws);
    await expect(page.locator('dialog.reveal')).toHaveAttribute('data-opening-state', 'result', {
      timeout: 10_000,
    });
    await mark(page, 'result');
    await expect(page.locator('[data-celebration]')).toHaveCount(0, { timeout: 3_000 });
    await expect
      .poll(
        () =>
          page
            .locator('dialog.reveal')
            .evaluate((reveal) =>
              reveal
                .getAnimations({ subtree: true })
                .some((animation) => animation.playState === 'running'),
            ),
        { timeout: 3_000 },
      )
      .toBe(false);
    await mark(page, 'finished');
    await page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => done())));
    const profile = await page.evaluate(() => {
      const p = window.openingProbe;
      const from = p.marks.open,
        to = p.marks.finished;
      const frames = p.frames.filter((frame) => frame.start >= from && frame.start < to);
      return {
        ...p,
        opening: {
          trigger: 'buy-open-toad',
          includesPurchaseTransaction: true,
          duration: to - from,
          resultAtMs: p.marks.result - from,
          finaleDurationMs: to - p.marks.result,
          frameCount: frames.length,
          fps: 1000 / (frames.reduce((sum, frame) => sum + frame.duration, 0) / frames.length),
          maxFrameMs: Math.max(...frames.map((frame) => frame.duration)),
          p95FrameMs: frames.map((frame) => frame.duration).sort((a, b) => a - b)[
            Math.floor(frames.length * 0.95)
          ],
          longTasks: p.tasks.filter(
            (task) => task.start + task.duration >= from && task.start <= to,
          ),
        },
        renderer: document.querySelector<HTMLElement>('.frog-magic')?.dataset.renderer,
        rendererDraws: Number(
          document.querySelector<HTMLElement>('.frog-magic')?.dataset.renderCount ?? 0,
        ),
        artwork: [...document.querySelectorAll<HTMLImageElement>('.opening-stage img')].map(
          (image) => ({
            source: image.currentSrc,
            width: image.naturalWidth,
            height: image.naturalHeight,
          }),
        ),
      };
    });
    await writeFile(
      resolve(root, `${baseline ? 'before' : 'after'}-${info.project.name}-${language}.json`),
      JSON.stringify({ ...profile, renderer }, null, 2),
    );
    await page.screenshot({
      path: resolve(
        root,
        'captures',
        `${baseline ? 'before' : 'after'}-${info.project.name}-${language}.png`,
      ),
    });
    expect(await readGame(page)).toEqual(committed);
    expect(openings).toBe(1);
    await page.reload();
    expect(await readGame(page)).toEqual(committed);
    // Tail latency is the behavior under test; no particular renderer is required.
    // Earlier route phases remain recorded so moving the hitch cannot hide it.
    expect(profile.opening.maxFrameMs).toBeLessThan(50);
    if (profile.longTasksSupported) expect(profile.opening.longTasks).toHaveLength(0);
  });
}
for (const language of ['es', 'en'] as const) {
  for (const mode of ['skip', 'reduced', 'fallback'] as const) {
    test(`A60 ${mode} keeps one committed buy-open receipt ${language}`, async ({ page }) => {
      await observe(page);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
      if (mode === 'fallback') {
        await page.addInitScript(() => {
          const original = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function (
            this: HTMLCanvasElement,
            ...args: Parameters<typeof original>
          ) {
            return this.dataset.effect === 'frog-magic' ? null : original.apply(this, args);
          } as typeof original;
        });
      }
      await prepare(page, language);
      let commands = 0;
      page.on('request', (request) => {
        if (request.method() === 'POST') commands++;
      });
      await page.locator('.shop-purchase-ticket').click();
      const reveal = page.locator('dialog.reveal');
      await expect(reveal).toBeVisible();
      const committed = await readGame(page);
      expect(committed.copies).toHaveLength(2);
      expect(committed.inventory.crowns).toBe(40);
      expect(committed.inventory.products).toMatchObject([
        { kind: 'cacao-toad', status: 'consumed' },
      ]);
      expect(committed.receipts.at(-1)?.kind).toBe('buy-open-toad');
      if (mode === 'skip') {
        await page
          .getByRole('button', {
            name: language === 'es' ? 'Omitir animación' : 'Skip animation',
            exact: true,
          })
          .click();
      }
      await expect(reveal).toHaveAttribute('data-opening-state', 'result', { timeout: 10_000 });
      await expect(page.locator('.frog-magic canvas')).toHaveCount(0);
      if (mode !== 'fallback') await expect(page.locator('[data-celebration]')).toHaveCount(0);
      const draws = await page.locator('.frog-magic').getAttribute('data-render-count');
      await page.waitForTimeout(100);
      expect(await page.locator('.frog-magic').getAttribute('data-render-count')).toBe(draws);
      expect(await readGame(page)).toEqual(committed);
      await changeLanguage(page, language === 'es' ? 'en' : 'es');
      expect(await readGame(page)).toEqual(committed);
      expect(commands).toBe(1);
      await page.reload();
      expect(await readGame(page)).toEqual(committed);
    });
  }
}
