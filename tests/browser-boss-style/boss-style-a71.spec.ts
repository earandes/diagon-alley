import { test, expect, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { changeLanguage, startExpedition } from '../browser-trial/game-fixture';
import { readGame, reachNode, confirmEvent, expectMapFits } from '../browser-trial/route-helpers';

// The A71 authority has its own ephemeral namespace, with unchanged entry limits.
test.use({ baseURL: 'http://127.0.0.1:5472' });

const evidence = resolve(
  process.env.A71_EVIDENCE_ROOT ?? 'docs/arcana/boss-stage-2026-10-17/evidence/linux',
);
const fixtureBase = process.env.A71_FIXTURE_URL ?? 'http://127.0.0.1:5473';
const battleFixture = new URL('/tests/browser-boss/boss-a70.html', fixtureBase).href;
const partyFixture = new URL('/tests/browser-boss-style/boss-style-a71.html', fixtureBase).href;
const word = (lang: 'es' | 'en', es: string, en: string) => (lang === 'es' ? es : en);
const skip = (page: Page, language: 'es' | 'en' = 'es') =>
  page.getByRole('button', {
    name: word(language, 'Omitir reproducción', 'Skip playback'),
    exact: true,
  });
async function capture(page: Page, name: string, widths: readonly number[] = [1280]) {
  const project = test.info().project;
  if (
    process.platform !== 'linux' ||
    process.env.ARCANA_CAPTURE_A71 !== '1' ||
    project.use.browserName !== 'chromium' ||
    !widths.includes(project.use.viewport!.width)
  )
    return;
  await mkdir(evidence, { recursive: true });
  await page.screenshot({ path: resolve(evidence, `selected-${name}.png`), fullPage: false });
}
async function report(name: string, data: object) {
  await mkdir(evidence, { recursive: true });
  await writeFile(
    resolve(evidence, `${test.info().project.name}-${name}.json`),
    JSON.stringify(
      {
        sha: process.env.GITHUB_SHA ?? null,
        engine: test.info().project.use.browserName,
        viewport: test.info().project.use.viewport,
        physicalDevice: false,
        ...data,
      },
      null,
      2,
    ),
  );
}
async function arenaFits(page: Page, count: number) {
  await expect(page.locator('.pedestal')).toHaveCount(count);
  await expect
    .poll(() =>
      page.locator('.pedestal').evaluateAll((nodes) =>
        nodes.every((node) => {
          const r = node.getBoundingClientRect();
          return (
            r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1
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
async function castAndPause(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((done, reject) => {
        const until = performance.now() + 15000;
        const observe = () => {
          const host = document.querySelector<HTMLElement>('.scene-canvas');
          if (
            host?.dataset.bossActorPose === 'cast' &&
            Number(host.dataset.bossActorArmAngle) !== 0
          ) {
            document
              .querySelector<HTMLButtonElement>('.replay-controls button:first-child')!
              .click();
            done();
          } else if (performance.now() >= until)
            reject(Error('No actual articulated boss cast observed'));
          else requestAnimationFrame(observe);
        };
        observe();
      }),
  );
}
async function actorFrame(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done()))),
  );
  return page.locator('.scene-canvas').evaluate((el: HTMLElement) => ({
    pose: el.dataset.bossActorPose,
    angle: el.dataset.bossActorArmAngle,
    layers: el.dataset.bossActorLayers,
    paints: el.dataset.renderCount,
  }));
}

for (const language of ['es', 'en'] as const)
  for (const pack of ['diagon-alley', 'arcana'] as const) {
    test(`A71 staged real boss: consult prepare cancel confirm loot ${language} ${pack}`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.addInitScript(
        (pack) => localStorage.setItem('arcana.presentation.content-pack.v1', pack),
        pack,
      );
      await page.goto('/');
      if (language === 'en') await changeLanguage(page, language);
      await page.locator('.portal-enter').click();
      await startExpedition(page, language);
      const bossId = await reachNode(page, 'boss', language);
      await expectMapFits(page);
      const before = await readGame(page);
      const run = before.exploration!.run!;
      const plan = run.campaignSnapshot!.nodes.find((node) => node.nodeId === bossId)!;
      if (plan.kind !== 'boss') throw Error('Expected current saved boss plan');
      const origin = page.locator(`button[data-node="${bossId}"]`);
      await origin.focus();
      await origin.press('Enter');
      const dialog = page.locator('.node-event-dialog.boss-staging');
      const prelude = dialog.locator('[data-boss-prelude]');
      const party = dialog.locator('[data-boss-party]');
      await expect(prelude).toBeVisible();
      await expect(party).toBeVisible();
      const settingsBox = await dialog.locator(':scope > .settings-trigger').boundingBox();
      for (const item of ['.boss-prelude-identity h4', '.boss-roster-count']) {
        const box = await prelude.locator(item).boundingBox();
        expect(
          box!.x + box!.width <= settingsBox!.x ||
            box!.x >= settingsBox!.x + settingsBox!.width ||
            box!.y + box!.height <= settingsBox!.y ||
            box!.y >= settingsBox!.y + settingsBox!.height,
        ).toBe(true);
      }
      expect(
        await prelude
          .locator('[data-boss-opponent]')
          .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('data-boss-opponent'))),
      ).toEqual(plan.opponents.map((unit) => unit.id));
      expect(
        await party
          .locator('[data-boss-member]')
          .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('data-boss-member'))),
      ).toEqual(run.members.map((member) => member.unit.id));
      await expect(
        dialog.locator('input, select, textarea, [role="textbox"], [role="checkbox"]'),
      ).toHaveCount(0);
      const book = prelude.locator('.boss-opponent-details > summary');
      await expect(book).toHaveAccessibleName(
        word(language, 'Conocer al rival', 'Inspect opponents'),
      );
      await book.focus();
      await book.press('Enter');
      await expect(prelude.locator('.boss-opponent-details')).toHaveAttribute('open', '');
      await expect(prelude.locator('.boss-opponent-stats > section')).toHaveCount(
        plan.opponents.length,
      );
      expect(await readGame(page)).toEqual(before);
      await book.press('Enter');
      await expect(prelude.locator('.boss-opponent-details')).not.toHaveAttribute('open', '');
      const stock = before.inventory.products.filter(
        (p) => p.kind === 'random-beans' && p.status === 'available',
      ).length;
      const jar = dialog.locator('.node-bean-preparation > summary');
      await expect(jar).toHaveAttribute('data-bean-stock', String(stock));
      await expect(jar).not.toContainText(/^\s*0\s*\/\s*\d+\s*$/);
      for (const control of [
        book,
        party.locator('[data-boss-member]').first(),
        jar,
        dialog.locator('.node-confirm-action'),
      ]) {
        await expect(control).toBeInViewport({ ratio: 1 });
        const bounds = await control.boundingBox();
        expect(bounds!.width).toBeGreaterThanOrEqual(44);
        expect(bounds!.height).toBeGreaterThanOrEqual(44);
      }
      const member = party.locator('[data-boss-member]').first();
      await member.focus();
      await member.press('Enter');
      await expect(page.locator('.preparation-dialog[open]')).toBeVisible();
      expect(await readGame(page)).toEqual(before);
      await page.keyboard.press('Escape');
      await expect(member).toBeFocused();
      expect(await readGame(page)).toEqual(before);
      await jar.tap();
      await expect(dialog.locator('.node-bean-preparation')).toHaveAttribute('open', '');
      expect(await readGame(page)).toEqual(before);
      await jar.tap();
      // Reuse these real isolated accounts: text enlargement is not a new
      // screenshot matrix or a command. Details may scroll; controls must remain usable.
      const enlargedPopupChecked =
        language === 'es' && test.info().project.use.viewport!.width === 390;
      if (enlargedPopupChecked) {
        const priorFontSize = await page.evaluate(() => document.documentElement.style.fontSize);
        const priorScroll = await dialog.evaluate((element) => element.scrollTop);
        try {
          await page.evaluate(() => {
            document.documentElement.style.fontSize = '200%';
          });
          await expect
            .poll(() =>
              dialog.evaluate(
                (element) =>
                  element.scrollWidth <= element.clientWidth + 1 &&
                  document.documentElement.scrollWidth <= innerWidth + 1,
              ),
            )
            .toBe(true);
          for (const control of [book, member, jar, dialog.locator('.node-confirm-action')]) {
            await control.focus();
            await control.scrollIntoViewIfNeeded();
            await expect(control).toBeFocused();
            await expect(control).toBeInViewport({ ratio: 1 });
            // Trial performs actionability checks only. It never dispatches the
            // confirmation click, consumes a unit or advances the saved route.
            await control.click({ trial: true });
          }
          expect(await readGame(page)).toEqual(before);
        } finally {
          await page.evaluate((fontSize) => {
            document.documentElement.style.fontSize = fontSize;
          }, priorFontSize);
          await dialog.evaluate((element, top) => {
            element.scrollTop = top;
          }, priorScroll);
        }
      }
      if (language === 'es' && pack === 'diagon-alley') {
        await capture(page, 'preparation-desktop');
        await capture(page, 'preparation-mobile-diagon', [390]);
      }
      if (language === 'es' && pack === 'arcana')
        await capture(page, 'preparation-mobile-arcana', [390]);
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(origin).toBeFocused();
      expect(await readGame(page)).toEqual(before);
      await origin.tap();
      await changeLanguage(page, language === 'es' ? 'en' : 'es');
      await expect(prelude.locator('[data-boss-opponent]')).toHaveCount(plan.opponents.length);
      expect(await readGame(page)).toEqual(before);
      await changeLanguage(page, language);
      const started = Date.now();
      await confirmEvent(page, language);
      const committed = await readGame(page),
        receipt = committed.receipts.at(-1)!;
      if (receipt.kind !== 'advance-node' || !receipt.battle)
        throw Error('Expected confirmed boss BattleLog');
      const immutable = JSON.stringify(receipt);
      await arenaFits(page, receipt.battle.input.player.length + receipt.battle.input.rival.length);
      const actionToDomUsableUpperBoundMs = Date.now() - started;
      await expect(page.locator('.scene-canvas')).toHaveAttribute('data-art-ready', 'true');
      const actionToFiguresReadyUpperBoundMs = Date.now() - started;
      if (await skip(page, language).isEnabled()) await skip(page, language).click();
      await expect(page.locator('[data-arena-outcome]')).toBeVisible();
      expect(JSON.stringify((await readGame(page)).receipts.at(-1))).toBe(immutable);
      await page
        .getByRole('button', { name: word(language, 'Volver al mapa', 'Back to map'), exact: true })
        .click();
      const closure = page.locator('[data-expedition-closure="won"]');
      await expect(closure).toBeVisible();
      if (language === 'es' && pack === 'diagon-alley') {
        await expect(closure.locator('.closure-spoils')).toHaveCSS('opacity', '1');
        await capture(page, 'closure');
      }
      await page.reload();
      await expect(closure).toBeVisible();
      expect(await readGame(page)).toEqual(committed);
      await closure.locator('[data-closure-action="frog"]').click();
      await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result', {
        timeout: 15000,
      });
      const opened = await readGame(page);
      expect(opened.inventory.crowns).toBe(committed.inventory.crowns);
      expect(opened.copies.length).toBe(committed.copies.length + 1);
      expect(errors).toEqual([]);
      await report(`${language}-${pack}-real-journey`, {
        fixture: false,
        isolatedAuthorityAccount: committed.playerId,
        runId: run.id,
        actionToDomUsableUpperBoundMs,
        actionToFiguresReadyUpperBoundMs,
        confirmedReceiptImmutable: true,
        queryCancelNoSpend: true,
        enlargedPopupChecked,
        pageErrors: errors,
      });
    });
  }

test('A71 party component: one to five, owned duplicate temporary fallen, no operation', async ({
  page,
}) => {
  for (const count of [1, 2, 3, 4, 5]) {
    await page.goto(`${partyFixture}?members=${count}&pack=diagon-alley`);
    const before = await page.evaluate(() => window.__a71Party.read());
    const members = page.locator('[data-boss-member]');
    await expect(members).toHaveCount(count);
    for (let i = 0; i < count; i++) {
      await expect(members.nth(i)).toHaveAttribute('data-boss-member', `a71-member-${i}`);
      await expect(members.nth(i)).toHaveAccessibleName(/.+/);
    }
    await expect(members.first()).toHaveAttribute('data-boss-party-source', 'owned');
    await expect(members.first().locator('[data-boss-party-gear="a71-wand"]')).toHaveCount(1);
    if (count > 1) {
      await expect(members.nth(1)).toHaveAttribute('data-boss-party-source', 'owned');
      await expect(members.nth(1).locator('[data-boss-party-gear="a71-broom"]')).toHaveCount(1);
    }
    if (count >= 3)
      await expect(members.nth(2)).toHaveAttribute('data-boss-party-source', 'temporary');
    if (count === 5)
      await expect(members.nth(4)).toHaveAttribute('data-boss-party-condition', 'fallen');
    await members.first().click();
    await expect(page.locator('[data-component-consulted]')).toHaveText('a71-member-0');
    expect(await page.evaluate(() => window.__a71Party.read())).toBe(before);
    await page.locator('.node-bean-preparation > summary').click();
    const carrier = page.locator('[data-bean-unit="a71-member-0"]');
    await carrier.click();
    await expect(carrier).toHaveAttribute('aria-pressed', 'true');
    await expect(members.first().locator('[data-boss-party-bean]')).toHaveCount(1);
    expect(await page.evaluate(() => window.__a71Party.read())).toBe(before);
    await carrier.click();
    await expect(carrier).toHaveAttribute('aria-pressed', 'false');
    await expect(members.first().locator('[data-boss-party-bean]')).toHaveCount(0);
    if (count === 5) await expect(page.locator('[data-bean-unit="a71-member-4"]')).toBeDisabled();
    expect(await page.evaluate(() => window.__a71Party.read())).toBe(before);
  }
  await page.goto(`${partyFixture}?members=5&pack=arcana&lang=en&empty`);
  await expect(page.locator('[data-boss-member]')).toHaveCount(5);
  await page.locator('.node-bean-preparation > summary').click();
  await expect(page.locator('[data-bean-unit]')).toHaveCount(0);
  await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await report('declared-party-states', {
    fixture: true,
    counts: [1, 2, 3, 4, 5],
    duplicates: true,
    temporary: true,
    fallen: true,
    emptyInventory: true,
    queryDidNotMutate: true,
    limitation: 'Component callback only; actual preparation and authority checked in real journey',
  });
});

test('A71 actual actor cast stays frozen on pause and survives pack and skip', async ({ page }) => {
  await page.goto(`${battleFixture}?player=3&challenge=discovery`);
  const scene = page.locator('.scene-canvas');
  await expect(scene).toHaveAttribute('data-boss-actor-ready', 'true');
  await expect(scene).toHaveAttribute('data-visible-figures', '6');
  const before = await page.evaluate(() => ({
    battle: window.__a70Fixture.battle,
    game: window.__a70Fixture.game,
  }));
  await arenaFits(page, 6);
  await castAndPause(page);
  const paused = await actorFrame(page);
  expect(Number(paused.angle)).not.toBe(0);
  expect(Number(paused.layers)).toBeGreaterThanOrEqual(2);
  await page.waitForTimeout(200);
  expect(await actorFrame(page)).toEqual(paused);
  await capture(page, 'actor-diagon');
  await page.locator('[data-qa-pack]').evaluate((el: HTMLButtonElement) => el.click());
  await expect(scene).toHaveAttribute('data-boss-actor-ready', 'true');
  const swapped = await actorFrame(page);
  expect(swapped.pose).toBe('cast');
  expect(Number(swapped.angle)).not.toBe(0);
  await capture(page, 'actor-arcana');
  await skip(page).click();
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  expect(
    await page.evaluate(() => ({
      battle: window.__a70Fixture.battle,
      game: window.__a70Fixture.game,
    })),
  ).toEqual(before);
  await report('actor-sample', {
    fixture: true,
    prolongedPlayerStats: true,
    paused,
    swapped,
    battleUnchanged: true,
    physicalDevice: false,
  });
});

test('A71 articulated layer missing preserves static actor and confirmed result', async ({
  page,
}) => {
  let failed = 0;
  await page.route(/\/assets\/actor-arm-[^/]+\.webp/, async (route) => {
    failed++;
    await route.abort();
  });
  await page.goto(`${battleFixture}?player=3`);
  const scene = page.locator('.scene-canvas');
  await expect(scene).toHaveAttribute('data-art-ready', 'true');
  await expect(scene).toHaveAttribute('data-boss-actor-ready', 'false');
  await expect(scene).toHaveAttribute('data-visible-figures', '6');
  const before = await page.evaluate(() => window.__a70Fixture.battle);
  expect(failed).toBeGreaterThan(0);
  await skip(page).click();
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await expect(page.locator('.arena-exit')).toBeEnabled();
  expect(await page.evaluate(() => window.__a70Fixture.battle)).toBe(before);
  await report('absent-arm', {
    fixture: true,
    failed,
    staticActorRetained: true,
    battleUnchanged: true,
  });
});

// Same current mastery snapshot, seed70, modified player stats and 10s warm window
// as A70. This is a bounded renderer comparison, not human pacing or GPU timing.
test('A71 selected cold-navigation warm playback and teardown sample', async ({ page }) => {
  test.skip(
    !['chromium-1280-boss-style-a71', 'chromium-1280-boss-a70'].includes(test.info().project.name),
    'One serial timing project',
  );
  await page.addInitScript(() => {
    const intervals: number[] = [],
      longTasks: number[] = [];
    const decodes: {
      start: number;
      end: number;
      width: number;
      height: number;
      failed: boolean;
    }[] = [];
    let prior = 0,
      raf = 0,
      running = true;
    const originalDecode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      const start = performance.now();
      const record = (failed: boolean) =>
        decodes.push({
          start,
          end: performance.now(),
          width: this.naturalWidth,
          height: this.naturalHeight,
          failed,
        });
      return originalDecode.call(this).then(
        () => {
          record(false);
        },
        (error: unknown) => {
          record(true);
          throw error;
        },
      );
    };
    const tick = (now: number) => {
      if (!running) return;
      if (prior && intervals.length < 10000) intervals.push(now - prior);
      prior = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const observer = PerformanceObserver.supportedEntryTypes.includes('longtask')
      ? new PerformanceObserver((list) =>
          longTasks.push(...list.getEntries().map((entry) => entry.duration)),
        )
      : null;
    observer?.observe({ type: 'longtask', buffered: true });
    Object.assign(window, {
      __a71Perf: {
        reset: () => {
          intervals.length = 0;
          longTasks.length = 0;
          prior = 0;
        },
        read: () => ({
          elapsedMs: performance.now(),
          intervals: [...intervals],
          longTasks: observer ? [...longTasks] : null,
          decodes: [...decodes],
          imageResources: performance
            .getEntriesByType('resource')
            .filter((entry) => (entry as PerformanceResourceTiming).initiatorType === 'img')
            .map((entry) => ({
              duration: entry.duration,
              responseEnd: (entry as PerformanceResourceTiming).responseEnd,
              transferSize: (entry as PerformanceResourceTiming).transferSize,
            })),
        }),
        stop: () => {
          running = false;
          cancelAnimationFrame(raf);
          observer?.disconnect();
          HTMLImageElement.prototype.decode = originalDecode;
        },
      },
    });
  });
  await page.goto(`${battleFixture}?player=5&challenge=mastery`);
  const scene = page.locator('.scene-canvas');
  await expect(scene).toHaveAttribute('data-art-ready', 'true');
  await expect(scene).toHaveAttribute('data-boss-actor-ready', 'true');
  const startup = await page.evaluate(() => window.__a71Perf.read());
  const immutable = await page.evaluate(() => window.__a70Fixture.battle);
  const initialPaints = Number(await scene.getAttribute('data-render-count'));
  await page.evaluate(() => window.__a71Perf.reset());
  await page.waitForTimeout(10000);
  const warm = await page.evaluate(() => window.__a71Perf.read());
  const actualPaints = Number(await scene.getAttribute('data-render-count')) - initialPaints;
  expect(actualPaints).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pausa', exact: true }).click();
  const paused = await actorFrame(page);
  await page.waitForTimeout(200);
  expect(await actorFrame(page)).toEqual(paused);
  const omitStart = Date.now();
  await skip(page).click();
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  const skipToOutcomeUpperBoundMs = Date.now() - omitStart;
  const resources = await scene.evaluate((el: HTMLElement) => ({ ...el.dataset }));
  const retired = await scene.elementHandle();
  await page.locator('[data-qa-unmount]').evaluate((el: HTMLButtonElement) => el.click());
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(
    await retired!.evaluate((el: HTMLElement) => ({
      destroyed: el.dataset.destroyed,
      textures: el.dataset.textureCount,
      active: el.dataset.activeTicking,
    })),
  ).toEqual({ destroyed: 'true', textures: '0', active: 'false' });
  expect(await page.evaluate(() => window.__a70Fixture.battle)).toBe(immutable);
  await page.evaluate(() => window.__a71Perf.stop());
  await report('performance', {
    fixture: true,
    prolongedPlayerStats: true,
    seed: 70,
    challenge: 'mastery',
    playerCount: 5,
    startup,
    warm,
    warmWindowMs: 10000,
    actualPaints,
    skipToOutcomeUpperBoundMs,
    resources,
    teardownCountersZero: true,
    limitations: [
      'No authoritative network latency in fixture',
      'OS cache not reset',
      'rAF intervals are not GPU frame times',
      'Own counters do not prove global absence of leaks',
      'decode promise includes fetch/scheduling; not decoder CPU timing',
      'Compare A70 same fixture without attributing causes from timing alone',
    ],
  });
});

declare global {
  interface Window {
    __a71Perf: {
      reset: () => void;
      read: () => {
        elapsedMs: number;
        intervals: number[];
        longTasks: number[] | null;
        decodes: { start: number; end: number; width: number; height: number; failed: boolean }[];
        imageResources: { duration: number; responseEnd: number; transferSize: number }[];
      };
      stop: () => void;
    };
  }
}
