import { test, expect, type Page, type Locator } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { startExpedition } from './game-fixture';
async function measure(
  page: Page,
  name: string,
  trigger: Locator,
  done: () => Promise<unknown>,
  surface?: Locator,
) {
  await page.evaluate(() => {
    const w = window as typeof window & {
      probe?: {
        input: number;
        frames: number[];
        tasks: number[];
        stop: boolean;
        observer?: PerformanceObserver;
      };
    };
    const probe = (w.probe = { input: 0, frames: [], tasks: [], stop: false } as NonNullable<
      typeof w.probe
    >);
    document.addEventListener(
      'pointerdown',
      () => {
        probe.input = performance.now();
      },
      { once: true, capture: true },
    );
    let before = performance.now();
    const frame = (now: number) => {
      if (probe.input) probe.frames.push(now - before);
      before = now;
      if (!probe.stop) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
      probe.observer = new PerformanceObserver((list) =>
        probe.tasks.push(...list.getEntries().map((e) => e.duration)),
      );
      probe.observer.observe({ entryTypes: ['longtask'] });
    }
  });
  await trigger.click();
  await done();
  if (surface)
    await surface.evaluate(async (el) => {
      await Promise.all([...el.querySelectorAll('img')].map((img) => img.decode().catch(() => {})));
    });
  const usable = await page.evaluate(() => performance.now());
  if (surface)
    await expect
      .poll(() =>
        surface.evaluate((el) =>
          el.getAnimations({ subtree: true }).some((a) => a.playState === 'running'),
        ),
      )
      .toBe(false);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  return page.evaluate(
    ({ name, usable }) => {
      const p = (
        window as unknown as {
          probe: {
            input: number;
            stop: boolean;
            frames: number[];
            tasks: number[];
            observer?: PerformanceObserver;
          };
        }
      ).probe;
      p.stop = true;
      p.observer?.disconnect();
      return {
        name,
        inputObserved: p.input > 0,
        inputToUsableMs: usable - p.input,
        inputToSettledMs: performance.now() - p.input,
        maxFrameMs: Math.max(...p.frames, 0),
        longtasks: p.tasks,
        network: performance
          .getEntriesByType('resource')
          .filter((e) => e.startTime >= p.input && e.name.includes('/api/'))
          .map((e) => ({ path: new URL(e.name).pathname, durationMs: e.duration })),
      };
    },
    { name, usable },
  );
}
test('A67 isolated serial common-action timing without recording', async ({ page }) => {
  const results = [];
  await page.goto('/');
  await page.locator('.portal-enter').click();
  await startExpedition(page, 'es');
  await page.evaluate(() => document.fonts.ready);
  const node = page.locator('.map-node > button:enabled').first(),
    dialog = page.locator('.node-event-dialog');
  for (let index = 0; index < 3; index++) {
    results.push(
      await measure(
        page,
        index === 0 ? 'pact-open-cold' : `pact-open-warm-${index}`,
        node,
        () => expect(dialog).toBeVisible(),
        dialog,
      ),
    );
    results.push(
      await measure(
        page,
        `pact-select-${index}`,
        page.locator('[data-pact-candidate]').first(),
        () =>
          expect(page.locator('[data-pact-candidate]').first()).toHaveAttribute(
            'aria-pressed',
            'true',
          ),
        dialog,
      ),
    );
    if (index < 2) {
      await page.locator('.node-cancel-action').click();
      await expect(dialog).toHaveCount(0);
    }
  }
  results.push(
    await measure(
      page,
      'pact-confirm',
      page.locator('.node-confirm-action'),
      () => expect(dialog).toHaveCount(0),
      page.locator('.team-compact'),
    ),
  );
  await page.locator('nav').getByRole('button', { name: 'Callejón', exact: true }).click();
  const workshop = page.locator('.shop-workshop');
  results.push(
    await measure(
      page,
      'workshop-open',
      page.locator('[data-shop="workshop"]'),
      () => expect(workshop).toBeVisible(),
      workshop,
    ),
  );
  await page.locator('[data-visual-value="wyvern"]').click();
  results.push(
    await measure(
      page,
      'forge-quote',
      page.locator('.forge-action'),
      () => expect(page.locator('.shop-trade-confirmation')).toBeVisible(),
      page.locator('.shop-trade-confirmation'),
    ),
  );
  const out = resolve('docs/arcana/progression-increment-2026-10-16/evidence/performance');
  await mkdir(out, { recursive: true });
  await writeFile(
    resolve(
      out,
      `${process.env.A67_PERFORMANCE_VARIANT === 'baseline' ? 'baseline' : 'current'}.json`,
    ),
    JSON.stringify(
      {
        engine: 'Chromium',
        platform: process.platform,
        viewport: [1280, 900],
        variant: process.env.A67_PERFORMANCE_VARIANT ?? 'current',
        scope:
          'Pointerdown→visible+decoded images→finite animations settled; includes API/network and runner polling overhead. One browser/server; no screenshots/video/traces. No human timing.',
        results,
      },
      null,
      2,
    ),
  );
});
