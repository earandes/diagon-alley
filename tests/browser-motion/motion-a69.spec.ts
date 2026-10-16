import { expect, test, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('docs/arcana/motion-audit-2026-10-16/evidence/linux');
const fixture = '/tests/browser-motion/motion-a69.html';
const capture = process.platform === 'linux' && process.env.ARCANA_CAPTURE_A69 === '1';
type Sample = { frames: number[]; tasks: number[]; longTasksSupported: boolean };
declare global {
  interface Window {
    __a69Probe: Sample & {
      raf: number;
      previous: number;
      actionStarted: number | null;
      stop: () => void;
    };
  }
}
async function instrumentation(page: Page) {
  await page.addInitScript(() => {
    const probe = (window.__a69Probe = {
      frames: [],
      tasks: [],
      longTasksSupported: PerformanceObserver.supportedEntryTypes.includes('longtask'),
      raf: 0,
      previous: 0,
      actionStarted: null,
      stop: () => {},
    } as Window['__a69Probe']);
    const tick = (now: number) => {
      if (probe.previous && probe.frames.length < 20000) probe.frames.push(now - probe.previous);
      probe.previous = now;
      probe.raf = requestAnimationFrame(tick);
    };
    probe.raf = requestAnimationFrame(tick);
    let observer: PerformanceObserver | undefined;
    if (probe.longTasksSupported) {
      observer = new PerformanceObserver((list) =>
        probe.tasks.push(...list.getEntries().map((entry) => entry.duration)),
      );
      observer.observe({ type: 'longtask', buffered: true });
    }
    probe.stop = () => {
      cancelAnimationFrame(probe.raf);
      observer?.disconnect();
    };
  });
}
function summary(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    samples: sorted.length,
    p50: sorted[Math.floor(sorted.length * 0.5)] ?? null,
    p95: sorted[Math.floor(sorted.length * 0.95)] ?? null,
    max: sorted.at(-1) ?? null,
  };
}
async function report(page: Page, name: string, extra: object = {}) {
  const probe = await page.evaluate(() => {
    const p = window.__a69Probe;
    return {
      frames: p.frames,
      tasks: p.tasks,
      longTasksSupported: p.longTasksSupported,
      renderer: [...document.querySelectorAll<HTMLElement>('.scene-canvas')].map((el) => ({
        ...el.dataset,
      })),
    };
  });
  await mkdir(root, { recursive: true });
  await writeFile(
    resolve(root, `${test.info().project.name}-${name}.json`),
    JSON.stringify(
      {
        fixture: true,
        engine: test.info().project.use.browserName,
        viewport: test.info().project.use.viewport,
        media: 'off',
        newDocument: true,
        networkCacheReset: false,
        sha: process.env.GITHUB_SHA ?? null,
        frameMs: summary(probe.frames),
        longTasks: probe.longTasksSupported ? probe.tasks : null,
        renderer: probe.renderer,
        budgetTargetsNotProof: { p95FrameMs: 20, maximumFrameMs: 50, skipUsableMs: 100 },
        ...extra,
      },
      null,
      2,
    ),
  );
}
async function control(page: Page, name: string) {
  await page.locator(`[data-qa-${name}]`).evaluate((el: HTMLButtonElement) => el.click());
}
async function settled(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}
async function markAction(page: Page, selector: string) {
  await page.locator(selector).evaluate((el) =>
    el.addEventListener(
      'pointerdown',
      () => {
        window.__a69Probe.actionStarted = performance.now();
      },
      { once: true },
    ),
  );
}
async function actionElapsed(page: Page) {
  return page.evaluate(() => {
    if (window.__a69Probe.actionStarted === null)
      throw Error('No actual pointer action was recorded');
    return performance.now() - window.__a69Probe.actionStarted;
  });
}
async function preserved(page: Page) {
  return page.evaluate(() => ({
    battle: window.__a69Fixture.battle,
    game: window.__a69Fixture.game,
    receipt: window.__a69Fixture.receipt,
  }));
}
async function expectFits(page: Page, actors: number) {
  await expect(page.locator('.pedestal')).toHaveCount(actors);
  await expect
    .poll(() =>
      page.locator('.pedestal').evaluateAll((nodes) =>
        nodes.every((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight + 1 && r.right <= innerWidth + 1
          );
        }),
      ),
    )
    .toBe(true);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollHeight <= innerHeight + 1 &&
        document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}
const pause = (page: Page, lang: 'es' | 'en' = 'es') =>
  page.getByRole('button', { name: lang === 'es' ? 'Pausa' : 'Pause', exact: true });
const auto = (page: Page, lang: 'es' | 'en' = 'es') =>
  page.getByRole('button', { name: lang === 'es' ? 'Auto' : 'Auto', exact: true });
const skip = (page: Page, lang: 'es' | 'en' = 'es') =>
  page.getByRole('button', {
    name: lang === 'es' ? 'Omitir reproducción' : 'Skip playback',
    exact: true,
  });

test.beforeEach(async ({ page }) => {
  await instrumentation(page);
});

test('A69 arena real 3x3, 5x3, 5x5: both packs and ES/EN keep all actors and confirmed log', async ({
  page,
}) => {
  const posts: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST') posts.push(request.url());
  });
  for (const pack of ['diagon-alley', 'arcana'])
    for (const lang of ['es', 'en'] as const) {
      for (const [player, rival] of [
        [3, 3],
        [5, 3],
        [5, 5],
      ]) {
        await page.goto(`${fixture}?pack=${pack}&lang=${lang}&player=${player}&rival=${rival}`);
        await expect(page.locator('.scene-canvas[data-renderer="webgl"]')).toBeVisible();
        await expect(page.locator('.scene-canvas')).toHaveAttribute('data-art-ready', 'true');
        const navigationToSceneReadyMs = await page.evaluate(() => performance.now());
        await pause(page, lang).click();
        const before = await preserved(page);
        const panel = page.locator('.battle-panel');
        expect(await panel.innerText()).not.toMatch(/Victoria|Derrota|Empate|Victory|Defeat|Draw/);
        expect(await panel.ariaSnapshot()).not.toMatch(
          /Victoria|Derrota|Empate|Victory|Defeat|Draw/,
        );
        await expectFits(page, player + rival);
        await page.locator('.arena-inspect').first().tap();
        await expect(page.locator('dialog.arena-inspector[open]')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.locator('.arena-inspect').first()).toBeFocused();
        await markAction(page, '.replay-controls button:last-child');
        await skip(page, lang).click();
        await expect(page.locator('[data-arena-outcome]')).toBeVisible();
        const skipUsableMs = await actionElapsed(page);
        expect(await preserved(page)).toEqual(before);
        await report(page, `arena-${pack}-${lang}-${player}x${rival}`, {
          skipUsableMs,
          navigationToSceneReadyMs,
          freshContextFirstNavigation:
            pack === 'diagon-alley' && lang === 'es' && player === 3 && rival === 3,
          declaration:
            'Fixed-seed presentation fixture; no account operation or human play observation',
        });
        await control(page, 'unmount');
        await expect(page.locator('canvas')).toHaveCount(0);
        await expect
          .poll(() =>
            page.evaluate(() =>
              window.__a69Fixture.retired.every(
                (el) =>
                  el.dataset.destroyed === 'true' &&
                  el.dataset.activeTicking === 'false' &&
                  Number(el.dataset.textureCount) === 0,
              ),
            ),
          )
          .toBe(true);
      }
    }
  expect(posts).toEqual([]);
});

test('A69 replay clock: pause, 2x, inspector, hidden, skip and renderer failure preserve result', async ({
  page,
}) => {
  await page.goto(`${fixture}?player=5&rival=5`);
  const panel = page.locator('.battle-panel');
  const scene = page.locator('.scene-canvas');
  await expect(scene).toHaveAttribute('data-art-ready', 'true');
  const before = await preserved(page);
  await expect
    .poll(async () => Number(await scene.getAttribute('data-render-count')))
    .toBeGreaterThan(0);
  await pause(page).click();
  await settled(page);
  await expect(panel).toHaveAttribute('data-replay-playing', 'false');
  const frozen = await panel.getAttribute('data-replay-cursor');
  const phase = await panel.getAttribute('data-replay-progress');
  const renders = await scene.getAttribute('data-render-count');
  await page.waitForTimeout(180);
  expect(await panel.getAttribute('data-replay-cursor')).toBe(frozen);
  expect(await panel.getAttribute('data-replay-progress')).toBe(phase);
  expect(await scene.getAttribute('data-render-count')).toBe(renders);
  await page.getByRole('button', { name: '2x', exact: true }).click();
  await expect(panel).toHaveAttribute('data-replay-speed', '2');
  expect(await panel.getAttribute('data-replay-cursor')).toBe(frozen);
  expect(await panel.getAttribute('data-replay-progress')).toBe(phase);
  const retiredHost = await scene.elementHandle();
  await control(page, 'pack');
  await expect(scene).toHaveAttribute('data-art-ready', 'true');
  expect(await retiredHost!.evaluate((el: HTMLElement) => el.dataset.destroyed)).toBe('true');
  expect(await retiredHost!.evaluate((el: HTMLElement) => el.dataset.textureCount)).toBe('0');
  expect(await panel.getAttribute('data-replay-cursor')).toBe(frozen);
  expect(await panel.getAttribute('data-replay-progress')).toBe(phase);
  await expect(page.locator('.scene-canvas canvas')).toHaveCount(1);
  await auto(page).click();
  await expect
    .poll(async () => Number(await panel.getAttribute('data-replay-cursor')))
    .toBeGreaterThan(Number(frozen));
  await page.locator('.arena-inspect').first().click();
  const inspectedCursor = await panel.getAttribute('data-replay-cursor');
  await page.waitForTimeout(180);
  expect(await panel.getAttribute('data-replay-cursor')).toBe(inspectedCursor);
  await page.keyboard.press('Escape');
  // Synthetic Page Visibility condition is declared; this is not evidence from
  // physically backgrounding a phone. It exercises the real visibility listener.
  await auto(page).click();
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const hiddenCursor = await panel.getAttribute('data-replay-cursor');
  const hiddenRenders = await scene.getAttribute('data-render-count');
  await page.waitForTimeout(300);
  expect(await panel.getAttribute('data-replay-cursor')).toBe(hiddenCursor);
  expect(await scene.getAttribute('data-render-count')).toBe(hiddenRenders);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect
    .poll(async () => Number(await scene.getAttribute('data-render-count')))
    .toBeGreaterThan(Number(hiddenRenders));
  await skip(page).click();
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await report(page, 'controls', {
    fixtureStateUnchanged: (await preserved(page)).battle === before.battle,
  });
  expect(await preserved(page)).toEqual(before);
  await control(page, 'unmount');
  await page.goto(`${fixture}?player=5&rival=3`);
  await expect(page.locator('.scene-canvas canvas')).toHaveCount(1);
  const beforeFailure = await preserved(page);
  await page
    .locator('.scene-canvas canvas')
    .evaluate((el) =>
      el.dispatchEvent(new Event('webglcontextlost', { bubbles: true, cancelable: true })),
    );
  await expect(page.locator('.scene-fallback')).toBeVisible();
  await expect(page.locator('.arena-portrait').first()).not.toHaveCSS('opacity', '0');
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await expect(page.locator('.arena-exit')).toBeEnabled();
  await expect(page.locator('.pedestal')).toHaveCount(8);
  expect(await preserved(page)).toEqual(beforeFailure);
  await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    .toBe(true);
  await page.goto(`${fixture}?player=5&rival=5&reduced`);
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await expect(page.locator('.battle-panel')).toHaveAttribute('data-replay-playing', 'false');
  await expect(page.locator('.pedestal')).toHaveCount(10);
});

test('A69 CardReveal actual: four ranks, new/repeat, skip, reduced, language/pack/remount and missing art', async ({
  page,
}) => {
  for (const pack of ['diagon-alley', 'arcana'])
    for (const lang of ['es', 'en']) {
      for (const rarity of ['common', 'unusual', 'epic', 'arcane-legendary']) {
        await page.goto(
          `${fixture}?kind=opening&pack=${pack}&lang=${lang}&rarity=${rarity}&manual`,
        );
        await expect(page.locator('[data-qa-start]')).toBeEnabled();
        const documentBootToReadyMs = await page.evaluate(() => performance.now());
        const before = await preserved(page);
        await markAction(page, '[data-qa-start]');
        await page.locator('[data-qa-start]').click();
        await expect(page.locator('.reveal[data-opening-state="result"]')).toBeVisible();
        await expect(page.locator('.holographic-card')).toBeVisible();
        expect(
          await page.locator('.card-stars').evaluate((el) => getComputedStyle(el).opacity),
        ).toBe('1');
        const resultUsableMs = await actionElapsed(page);
        expect(await preserved(page)).toEqual(before);
        await report(page, `opening-${pack}-${lang}-${rarity}`, {
          isNew: true,
          resultUsableMs,
          documentBootToReadyMs,
          freshContextFirstNavigation:
            pack === 'diagon-alley' && lang === 'es' && rarity === 'common',
          action:
            'Explicit fixture presentation, includes image/decode/animation; no network authority command in this declared fixture',
        });
      }
      await page.goto(`${fixture}?kind=opening&pack=${pack}&lang=${lang}&rarity=epic&repeat`);
      const before = await preserved(page);
      await expect(page.locator('.reveal[data-opening-state="result"]')).toBeVisible();
      await expect(page.locator('[data-celebration]')).toHaveCount(0);
      await control(page, 'language');
      await control(page, 'pack');
      await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result');
      expect(await preserved(page)).toEqual(before);
      await report(page, `opening-${pack}-${lang}-repeat`, { isNew: false });
    }
  await page.goto(`${fixture}?kind=opening&rarity=epic&instance=skip`);
  const saved = await preserved(page);
  await page.getByRole('button', { name: 'Omitir animación' }).click();
  await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result');
  expect(await preserved(page)).toEqual(saved);
  await page.reload();
  await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result');
  await page.goto(`${fixture}?kind=opening&reduced&rarity=arcane-legendary&instance=reduced`);
  await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result');
  await expect(page.locator('[data-effect="frog-magic"]')).toHaveCount(0);
  await page.goto(`${fixture}?kind=opening&rarity=common&instance=hidden`);
  await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'playing');
  await expect
    .poll(() => page.locator('.opening-subject').evaluate((el) => getComputedStyle(el).transform))
    .not.toBe('none');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('.reveal')).toHaveAttribute('data-paused', 'true');
  const hiddenOpening = await page
    .locator('.opening-subject')
    .evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(200);
  expect(
    await page.locator('.opening-subject').evaluate((el) => getComputedStyle(el).transform),
  ).toBe(hiddenOpening);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('.reveal')).toHaveAttribute('data-paused', 'false');
  await page.getByRole('button', { name: 'Omitir animación' }).click();
  await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result');
  await page.route('**/*.webp', (route) => route.abort());
  let failedGsapRequests = 0;
  await page.route('**/*gsap-a69*', (route) => {
    failedGsapRequests++;
    return route.abort();
  });
  await page.goto(`${fixture}?kind=opening&rarity=unusual&instance=missing-art`);
  const missingArtRecord = await preserved(page);
  await expect(page.locator('.reveal[data-opening-state="result"]')).toBeVisible();
  await expect(page.locator('.reveal-continue')).toBeEnabled();
  expect(failedGsapRequests).toBeGreaterThan(0);
  expect(await preserved(page)).toEqual(missingArtRecord);
});

async function freezeSpellPhase(page: Page, desired: 'anticipation' | 'impact') {
  await page.evaluate(async (phase) => {
    const events = JSON.parse(window.__a69Fixture.battle).events;
    await new Promise<void>((resolve, reject) => {
      const until = performance.now() + 15000;
      const observe = () => {
        const panel = document.querySelector<HTMLElement>('.battle-panel')!;
        if (
          events[Number(panel.dataset.replayCursor)]?.kind === 'spell-cast' &&
          panel.dataset.replayPhase === phase
        ) {
          document.querySelector<HTMLButtonElement>('.replay-controls button:first-child')!.click();
          resolve();
        } else if (performance.now() >= until) reject(Error('No requested spell phase observed'));
        else requestAnimationFrame(observe);
      };
      observe();
    });
  }, desired);
  await expect(page.locator('.battle-panel')).toHaveAttribute('data-replay-phase', desired);
}

test('A69 selected visual evidence and 30 serial scene teardown cycles (one Linux Chromium project)', async ({
  page,
}) => {
  test.skip(
    test.info().project.name !== 'chromium-1280-motion-a69',
    'One bounded repeated-life-cycle sample; no duplicated matrix captures.',
  );
  test.setTimeout(180000);
  await page.goto(`${fixture}?player=3&rival=3`);
  await expect(page.locator('.scene-canvas')).toHaveAttribute('data-art-ready', 'true');
  if (capture) {
    await mkdir(root, { recursive: true });
    await freezeSpellPhase(page, 'anticipation');
    await page.screenshot({ path: resolve(root, 'selected-arena-anticipation.png') });
    await auto(page).click();
    await freezeSpellPhase(page, 'impact');
    await page.screenshot({ path: resolve(root, 'selected-arena-contact.png') });
    await skip(page).click();
    await expect(page.locator('[data-arena-outcome]')).toBeVisible();
    await page.screenshot({ path: resolve(root, 'selected-arena-result.png') });
  }
  // Separate warm replay window; startup remains in the earlier action records.
  // This is intentionally not presented as a cold-start improvement.
  if (capture) {
    await control(page, 'unmount');
    await control(page, 'mount');
  }
  await expect(page.locator('.scene-canvas')).toHaveAttribute('data-art-ready', 'true');
  await page.evaluate(() => {
    window.__a69Probe.frames = [];
    window.__a69Probe.tasks = [];
    window.__a69Probe.previous = 0;
  });
  const warmRenders = Number(await page.locator('.scene-canvas').getAttribute('data-render-count'));
  await page.waitForTimeout(10000);
  const warmDraws =
    Number(await page.locator('.scene-canvas').getAttribute('data-render-count')) - warmRenders;
  expect(warmDraws).toBeGreaterThan(0);
  await report(page, 'warm-replay-10s', {
    windowMs: 10000,
    warmDraws,
    startupIncluded: false,
    scope: 'Separate warm fixture window; startup is retained in cold action records',
  });
  const counts: object[] = [];
  for (let i = 0; i < 30; i++) {
    if (i) await control(page, 'mount');
    await expect(page.locator('.scene-canvas')).toHaveAttribute('data-art-ready', 'true');
    const current = await page.locator('.scene-canvas').evaluate((el: HTMLElement) => ({
      textures: el.dataset.textureCount,
      bytes: el.dataset.textureBytes,
    }));
    expect(Number(current.bytes)).toBeLessThanOrEqual(12 * 1024 * 1024);
    await control(page, 'unmount');
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect
      .poll(() =>
        page.evaluate(() =>
          window.__a69Fixture.retired.every(
            (el) =>
              el.dataset.destroyed === 'true' &&
              Number(el.dataset.textureCount) === 0 &&
              el.dataset.activeTicking === 'false',
          ),
        ),
      )
      .toBe(true);
    counts.push({ cycle: i + 1, ...current });
  }
  await report(page, 'lifecycle-30', {
    counts,
    limitation:
      'Resource counters and detached host state; not GPU-process RSS or forced-GC heap proof',
  });
  if (capture) {
    await page.goto(`${fixture}?kind=opening&rarity=arcane-legendary&instance=selected-capture`);
    await expect(page.locator('.reveal[data-opening-state="result"]')).toBeVisible();
    await page.screenshot({ path: resolve(root, 'selected-opening-result.png') });
  }
});
