import { test, expect, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { changeLanguage, startExpedition } from '../browser-trial/game-fixture';
import { readGame, reachNode, confirmEvent, expectMapFits } from '../browser-trial/route-helpers';

const evidence = resolve('docs/arcana/boss-increment-2026-10-16/evidence/linux');
const fixture = 'http://127.0.0.1:5471/tests/browser-boss/boss-a70.html';
const selected = () =>
  process.platform === 'linux' &&
  process.env.ARCANA_CAPTURE_A70 === '1' &&
  test.info().project.name === 'chromium-1280-boss-a70';
const label = (lang: 'es' | 'en', es: string, en: string) => (lang === 'es' ? es : en);
const skip = (page: Page, lang: 'es' | 'en' = 'es') =>
  page.getByRole('button', {
    name: label(lang, 'Omitir reproducción', 'Skip playback'),
    exact: true,
  });
const pause = (page: Page, lang: 'es' | 'en' = 'es') =>
  page.getByRole('button', { name: label(lang, 'Pausa', 'Pause'), exact: true });
const auto = (page: Page, _lang: 'es' | 'en' = 'es') =>
  page.getByRole('button', { name: 'Auto', exact: true });
async function capture(page: Page, name: string) {
  if (!selected()) return;
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
async function preserved(page: Page) {
  return page.evaluate(() => ({
    battle: window.__a70Fixture.battle,
    game: window.__a70Fixture.game,
  }));
}
async function control(page: Page, name: string) {
  await page.locator(`[data-qa-${name}]`).evaluate((el: HTMLButtonElement) => el.click());
}
async function fits(page: Page, count: number) {
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
async function frozen(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done()))),
  );
  return page.locator('.scene-canvas').evaluate((el: HTMLElement) => ({
    angle: el.dataset.bossPropAngle,
    activity: el.dataset.bossPropActivity,
    scaleX: el.dataset.bossPropScaleX,
    scaleY: el.dataset.bossPropScaleY,
    layers: el.dataset.bossPropLayers,
    pose: el.dataset.bossPropPose,
    renders: el.dataset.renderCount,
  }));
}
async function freezeBossCast(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((done, reject) => {
        const events = JSON.parse(window.__a70Fixture.battle).events;
        const until = performance.now() + 15000;
        const observe = () => {
          const host = document.querySelector<HTMLElement>('.scene-canvas');
          const cursor = Number(
            document.querySelector<HTMLElement>('.battle-panel')?.dataset.replayCursor,
          );
          const event = events[cursor];
          if (
            host?.dataset.bossPropPose === 'cast' &&
            event?.kind === 'spell-cast' &&
            event.actorId === window.__a70Fixture.leader
          ) {
            document
              .querySelector<HTMLButtonElement>('.replay-controls button:first-child')!
              .click();
            done();
          } else if (performance.now() >= until)
            reject(Error('No real leader spell phase observed'));
          else requestAnimationFrame(observe);
        };
        observe();
      }),
  );
}

for (const language of ['es', 'en'] as const)
  for (const pack of ['diagon-alley', 'arcana'] as const) {
    test(`A70 real authority journey: preview cancel battle loot next intention ${language} ${pack}`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.addInitScript(
        (pack) => localStorage.setItem('arcana.presentation.content-pack.v1', pack),
        pack,
      );
      if (pack === 'arcana') await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      if (language === 'en') await changeLanguage(page, language);
      await page.locator('.portal-enter').click();
      await startExpedition(page, language);
      const bossId = await reachNode(page, 'boss', language);
      await expectMapFits(page);
      const before = await readGame(page);
      const run = before.exploration!.run!;
      const plan = run.campaignSnapshot!.nodes.find((node) => node.nodeId === bossId)!;
      if (plan.kind !== 'boss') throw Error('Expected real saved boss plan');
      const leader = plan.opponents.find((unit) => unit.wizardId !== 'rival') ?? plan.opponents[0];
      const origin = page.locator(`button[data-node="${bossId}"]`);
      await origin.focus();
      await origin.press('Enter');
      const prelude = page.locator('[data-boss-prelude]');
      await expect(prelude).toHaveAttribute('data-boss-leader', leader.id);
      await expect(prelude).toHaveAttribute('data-boss-roster-size', String(plan.opponents.length));
      // Initial consultation must expose preparation, not place it under the sticky fight footer.
      // Visibility alone does not detect an overlapping sibling or auto-scroll on click.
      const consultation = page.locator('.node-event-dialog');
      expect(await consultation.evaluate((element) => element.scrollTop)).toBe(0);
      const footerBox = await page.locator('.node-combat-actions').boundingBox();
      for (const control of [
        page.locator('.node-team-prepare'),
        page.locator('.node-bean-preparation > summary'),
      ]) {
        await expect(control).toBeInViewport({ ratio: 1 });
        const box = await control.boundingBox();
        expect(box!.y + box!.height).toBeLessThanOrEqual(footerBox!.y);
      }
      expect(
        await prelude
          .locator('[data-boss-opponent]')
          .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-boss-opponent'))),
      ).toEqual(plan.opponents.map((unit) => unit.id));
      const rivalDetails = prelude.locator('.boss-opponent-details > summary');
      await rivalDetails.focus();
      await rivalDetails.press('Enter');
      await expect(prelude.locator('.boss-opponent-details')).toHaveAttribute('open', '');
      expect(await readGame(page)).toEqual(before);
      await rivalDetails.press('Enter');
      await expect(prelude.locator('.boss-opponent-details')).not.toHaveAttribute('open', '');
      expect(await readGame(page)).toEqual(before);
      if (language === 'es' && pack === 'diagon-alley') await capture(page, 'boss-preparation');
      await page.keyboard.press('Escape');
      await expect(prelude).toHaveCount(0);
      await expect(origin).toBeFocused();
      expect(await readGame(page)).toEqual(before);
      await origin.tap();
      await expect(prelude).toBeVisible();
      await changeLanguage(page, language === 'es' ? 'en' : 'es');
      await expect(prelude).toHaveAttribute('data-boss-leader', leader.id);
      await expect(prelude).toHaveAttribute('data-boss-roster-size', String(plan.opponents.length));
      expect(
        await prelude
          .locator('[data-boss-opponent]')
          .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-boss-opponent'))),
      ).toEqual(plan.opponents.map((unit) => unit.id));
      // The live locator resolves the translated dialog after the locale change.
      await rivalDetails.focus();
      await rivalDetails.press('Enter');
      await expect(prelude.locator('.boss-opponent-details')).toHaveAttribute('open', '');
      expect(await readGame(page)).toEqual(before);
      await rivalDetails.press('Enter');
      await expect(prelude.locator('.boss-opponent-details')).not.toHaveAttribute('open', '');
      expect(await readGame(page)).toEqual(before);
      await changeLanguage(page, language);
      const prepareTeam = page.locator('.node-team-prepare');
      await prepareTeam.click();
      await expect(page.locator('.preparation-dialog[open]')).toBeVisible();
      expect(await readGame(page)).toEqual(before);
      await page.keyboard.press('Escape');
      await expect(prepareTeam).toBeFocused();
      await expect(prelude).toBeVisible();
      expect(await readGame(page)).toEqual(before);
      const actionStarted = Date.now();
      await confirmEvent(page, language);
      const committed = await readGame(page);
      const receipt = committed.receipts.at(-1)!;
      if (receipt.kind !== 'advance-node' || !receipt.battle)
        throw Error('Expected committed boss receipt');
      const confirmedBattle = JSON.stringify(receipt.battle);
      await expect(page.locator('.battle-panel')).toHaveAttribute('data-boss-leader', leader.id);
      await fits(page, receipt.battle.input.player.length + receipt.battle.input.rival.length);
      const actionToDomUsableUpperBoundMs = Date.now() - actionStarted;
      await expect(page.locator('.scene-canvas')).toHaveAttribute('data-art-ready', 'true');
      const actionToFiguresReadyUpperBoundMs = Date.now() - actionStarted;
      if (await skip(page, language).isEnabled()) await skip(page, language).click();
      await expect(page.locator('[data-arena-outcome]')).toBeVisible();
      expect(JSON.stringify((await readGame(page)).receipts.at(-1))).toBe(JSON.stringify(receipt));
      await page
        .getByRole('button', {
          name: label(language, 'Volver al mapa', 'Back to map'),
          exact: true,
        })
        .click();
      const closure = page.locator('[data-expedition-closure="won"]');
      await expect(closure).toBeVisible();
      await expect(closure).toHaveAttribute('data-closure-boss', leader.wizardId);
      expect(await closure.locator('[data-boss-fact]').count()).toBeLessThanOrEqual(2);
      if (language === 'es' && pack === 'diagon-alley') {
        await expect(closure.locator('.closure-spoils')).toHaveCSS('opacity', '1');
        await capture(page, 'boss-closure');
      }
      await page.reload();
      await expect(closure).toBeVisible();
      expect(await readGame(page)).toEqual(committed);
      await expect(closure).toHaveAttribute('data-confirmed-motion', 'false');
      await closure.locator('[data-closure-action="frog"]').click();
      await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result', {
        timeout: 15000,
      });
      const opened = await readGame(page);
      expect(opened.inventory.crowns).toBe(committed.inventory.crowns);
      expect(opened.copies).toHaveLength(committed.copies.length + 1);
      await page.locator('.reveal-continue').click();
      await closure.locator('[data-closure-action="vault"]').click();
      await page.locator('.vault-lock-action').click();
      await page
        .getByRole('button', { name: label(language, 'Cancelar', 'Cancel'), exact: true })
        .click();
      expect(await readGame(page)).toEqual(opened);
      await page.locator('.vault-lock-action').click();
      await page
        .getByRole('button', {
          name: label(language, 'Confirmar canje', 'Confirm exchange'),
          exact: true,
        })
        .click();
      await expect(page.locator('.commerce-result')).toBeVisible();
      const used = await readGame(page);
      expect(used.inventory.goldKeys).toBe((opened.inventory.goldKeys ?? 0) - 1);
      await page
        .locator('nav')
        .getByRole('button', { name: label(language, 'Mapa', 'Map'), exact: true })
        .click();
      const choice = page.locator('[data-intention-choice] > button').first();
      await expect(choice).toBeVisible();
      await choice.focus();
      await choice.press('Enter');
      await expect(choice).toHaveAttribute('aria-pressed', 'true');
      const selectedState = await readGame(page);
      expect(selectedState.inventory).toEqual(used.inventory);
      expect(selectedState.exploration!.run).toEqual(used.exploration!.run);
      await closure.locator('[data-closure-action="prepare"]').click();
      await expect(page.locator('.preparation-dialog[open]')).toBeVisible();
      expect(await readGame(page)).toEqual(selectedState);
      await page.keyboard.press('Escape');
      await expect(closure.locator('[data-closure-action="prepare"]')).toBeFocused();
      expect(await readGame(page)).toEqual(selectedState);
      await closure.locator('[data-closure-action="prepare"]').click();
      await startExpedition(page, language);
      const next = await readGame(page);
      expect(next.exploration!.run!.id).not.toBe(run.id);
      expect(next.inventory).toEqual(used.inventory);
      expect(next.exploration!.intention!.runId).toBe(next.exploration!.run!.id);
      expect(JSON.stringify(receipt.battle)).toBe(confirmedBattle);
      expect(errors).toEqual([]);
      await report(`${language}-${pack}-authority`, {
        fixture: false,
        isolatedAuthorityAccount: committed.playerId,
        runId: run.id,
        bossReceipt: receipt.id,
        leaderId: leader.id,
        leaderWizardId: leader.wizardId,
        reward: receipt.reward,
        firstVictory: receipt.firstVictory,
        actionToDomUsableUpperBoundMs,
        actionToFiguresReadyUpperBoundMs,
        battleUnchanged: true,
        reloadExact: true,
        selectionDidNotConsume: true,
        pageErrors: errors,
      });
    });
  }

test('A70 real boss profile fixtures: poses pause speed hidden inspector skip pack and teardown', async ({
  page,
}) => {
  for (const [profile, playerCount, rivalCount] of [
    ['discovery', 3, 3],
    ['tactical', 5, 4],
    ['mastery', 5, 5],
  ] as const) {
    await page.goto(`${fixture}?challenge=${profile}&player=${playerCount}`);
    const panel = page.locator('.battle-panel');
    const scene = page.locator('.scene-canvas');
    const leader = await page.evaluate(() => window.__a70Fixture.leader);
    await expect(panel).toHaveAttribute('data-boss-leader', leader);
    const genericAlias = await page.evaluate(() => window.__a70Fixture.bossAlias);
    await expect(panel.locator(`.arena-portrait[data-art="${genericAlias}"]`)).toHaveCount(0);
    await pause(page).click();
    await expect(scene).toHaveAttribute('data-art-ready', 'true');
    await expect(scene).toHaveAttribute('data-visible-figures', String(playerCount + rivalCount));
    await expect(scene).toHaveAttribute(
      'data-boss-prop-ready',
      profile === 'tactical' ? 'false' : 'true',
    );
    await fits(page, playerCount + rivalCount);
    const before = await preserved(page);
    const navigationToReadyMs = await page.evaluate(() => performance.now());
    if (profile === 'discovery') {
      await expect(scene).toHaveAttribute('data-boss-prop-ready', 'true');
      await auto(page).click();
      await freezeBossCast(page);
      const atCast = await frozen(page);
      expect(Number(atCast.activity)).toBeGreaterThan(0);
      expect(Number(atCast.layers)).toBeGreaterThan(0);
      await page.waitForTimeout(200);
      expect(await frozen(page)).toEqual(atCast);
      if (selected()) await capture(page, 'boss-object-cast');
    }
    await page.getByRole('button', { name: '2x', exact: true }).click();
    await expect(panel).toHaveAttribute('data-replay-speed', '2');
    const cursor = await panel.getAttribute('data-replay-cursor');
    const progress = await panel.getAttribute('data-replay-progress');
    const retiredHost = await scene.elementHandle();
    await control(page, 'pack');
    await expect(scene).toHaveAttribute('data-art-ready', 'true');
    await expect(scene).toHaveAttribute(
      'data-boss-prop-ready',
      profile === 'tactical' ? 'false' : 'true',
    );
    expect(await retiredHost!.evaluate((el: HTMLElement) => el.dataset.destroyed)).toBe('true');
    expect(await retiredHost!.evaluate((el: HTMLElement) => el.dataset.textureCount)).toBe('0');
    expect(await panel.getAttribute('data-replay-cursor')).toBe(cursor);
    expect(await panel.getAttribute('data-replay-progress')).toBe(progress);
    if (profile === 'discovery') {
      // The new ARCANA renderer samples the same paused cast. Check the actual
      // bowl Sprite transform, not just a pose name calculated by the model.
      const bowl = await frozen(page);
      expect(bowl.pose).toBe('cast');
      expect(Number(bowl.activity)).toBeGreaterThan(0);
      expect(Number(bowl.scaleX)).toBeLessThan(1);
      expect(Number(bowl.scaleY)).toBeGreaterThan(1);
      if (selected()) await capture(page, 'boss-object-arcana-cast');
    }
    await control(page, 'language');
    expect(await panel.getAttribute('data-replay-cursor')).toBe(cursor);
    await page.locator('.arena-inspect').first().tap();
    await expect(page.locator('dialog.arena-inspector[open]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.arena-inspect').first()).toBeFocused();
    await auto(page, 'en').click();
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    const hidden = await frozen(page);
    await page.waitForTimeout(200);
    expect(await frozen(page)).toEqual(hidden);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await skip(page, 'en').click();
    await expect(page.locator('[data-arena-outcome]')).toBeVisible();
    await expect(scene).toHaveAttribute('data-boss-prop-scale-x', '1');
    await expect(scene).toHaveAttribute('data-boss-prop-scale-y', '1');
    expect(await preserved(page)).toEqual(before);
    const resource = await scene.evaluate((el: HTMLElement) => ({ ...el.dataset }));
    await control(page, 'unmount');
    await expect(page.locator('canvas')).toHaveCount(0);
    expect(
      await page.evaluate(() =>
        window.__a70Fixture.retired.every(
          (el) =>
            el.dataset.destroyed === 'true' &&
            el.dataset.textureCount === '0' &&
            el.dataset.activeTicking === 'false',
        ),
      ),
    ).toBe(true);
    await report(`${profile}-presentation`, {
      fixture: true,
      playerStatsProlonged: true,
      bossRulesFromCurrentProfile: true,
      navigationToReadyMs,
      coldOsCacheNotReset: true,
      resources: resource,
      battleUnchanged: true,
      teardownCountersZero: true,
      limitation: 'Own resource counters, not GPU process memory or human evidence',
    });
  }
});

test('A70 boss reduced and failed renderer retain actors outcome record and confirmed state', async ({
  page,
}) => {
  await page.goto(`${fixture}?reduced&player=5&challenge=mastery&pack=arcana&lang=en`);
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await expect(page.locator('.battle-panel')).toHaveAttribute('data-replay-playing', 'false');
  await fits(page, 10);
  const reducedState = await preserved(page);
  await page.locator('.arena-record-trigger').click();
  await expect(page.locator('.battle-log')).toBeVisible();
  await page.keyboard.press('Escape');
  expect(await preserved(page)).toEqual(reducedState);
  await page.goto(`${fixture}?player=3`);
  await expect(page.locator('.scene-canvas canvas')).toHaveCount(1);
  const before = await preserved(page);
  await page
    .locator('.scene-canvas canvas')
    .evaluate((el) =>
      el.dispatchEvent(new Event('webglcontextlost', { bubbles: true, cancelable: true })),
    );
  await expect(page.locator('.scene-fallback')).toBeVisible();
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await expect(page.locator('.arena-exit')).toBeEnabled();
  await expect(page.locator('.arena-portrait').first()).not.toHaveCSS('opacity', '0');
  expect(await preserved(page)).toEqual(before);
  await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await report('fallback', {
    fixture: true,
    reducedOutcomePreserved: true,
    rendererLostOutcomePreserved: true,
  });
});

test('A70 selected warm sample and bounded serial lifetimes (one project)', async ({ page }) => {
  test.skip(
    test.info().project.name !== 'chromium-1280-boss-a70',
    'One resource sample; no matrix recording',
  );
  await page.addInitScript(() => {
    const samples: number[] = [];
    const tasks: number[] = [];
    let previous = 0;
    let running = true;
    let raf = 0;
    let observer: PerformanceObserver | undefined;
    const supported = PerformanceObserver.supportedEntryTypes.includes('longtask');
    const tick = (now: number) => {
      if (!running) return;
      if (previous && samples.length < 10000) samples.push(now - previous);
      previous = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    if (supported) {
      observer = new PerformanceObserver((list) =>
        tasks.push(...list.getEntries().map((entry) => entry.duration)),
      );
      observer.observe({ type: 'longtask', buffered: true });
    }
    Object.assign(window, {
      __a70Perf: {
        reset: () => {
          samples.length = 0;
          tasks.length = 0;
          previous = 0;
        },
        read: () => ({ samples: [...samples], tasks: supported ? [...tasks] : null }),
        stop: () => {
          running = false;
          cancelAnimationFrame(raf);
          observer?.disconnect();
        },
      },
    });
  });
  await page.goto(`${fixture}?player=5&challenge=mastery`);
  const scene = page.locator('.scene-canvas');
  await expect(scene).toHaveAttribute('data-art-ready', 'true');
  const before = await preserved(page);
  const startup = await page.evaluate(() => ({
    elapsed: performance.now(),
    ...window.__a70Perf.read(),
  }));
  // Warm window separate from startup, same10s as A69 but different actor/art fixture.
  await page.evaluate(() => window.__a70Perf.reset());
  const draws = Number(await scene.getAttribute('data-render-count'));
  await page.waitForTimeout(10000);
  const warm = await page.evaluate(() => window.__a70Perf.read());
  const actualPaints = Number(await scene.getAttribute('data-render-count')) - draws;
  expect(actualPaints).toBeGreaterThan(0);
  const resources: object[] = [];
  for (let i = 0; i < 8; i++) {
    if (i) await control(page, 'mount');
    await expect(scene).toHaveAttribute('data-art-ready', 'true');
    resources.push(await scene.evaluate((el: HTMLElement) => ({ ...el.dataset })));
    await control(page, 'unmount');
    await expect(page.locator('canvas')).toHaveCount(0);
    expect(
      await page.evaluate(() =>
        window.__a70Fixture.retired.every(
          (el) =>
            el.dataset.destroyed === 'true' &&
            el.dataset.textureCount === '0' &&
            el.dataset.activeTicking === 'false',
        ),
      ),
    ).toBe(true);
  }
  expect(await preserved(page)).toEqual(before);
  await page.evaluate(() => window.__a70Perf.stop());
  await report('performance-lifetimes', {
    fixture: true,
    startup,
    warm,
    actualPaints,
    warmWindowMs: 10000,
    resources,
    cycles: 8,
    traceVideoScreenshots: 'off',
    limitations: [
      'rAF intervals are not GPU frame times',
      'OS cache not reset',
      'Custom player stats',
      'No authoritative network latency in fixture',
      'Different composition from A69 baseline; no causal before-after claim',
      'Own texture counters, not GPU memory or heap proof',
    ],
    targetsNotMeasuredGuarantees: { p95FrameMs: 20, extraBossTexturesBytes: 2097152, skipMs: 100 },
  });
});

declare global {
  interface Window {
    __a70Perf: {
      reset: () => void;
      read: () => { samples: number[]; tasks: number[] | null };
      stop: () => void;
    };
  }
}

test('A70 absent art has a usable static result', async ({ page }) => {
  let failedImages = 0;
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      failedImages++;
      await route.abort();
    } else await route.continue();
  });
  await page.goto(`${fixture}?player=3`);
  await expect(page.locator('.pedestal')).toHaveCount(6);
  const absentArtState = await preserved(page);
  await skip(page).click();
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await expect(page.locator('.arena-exit')).toBeEnabled();
  expect(failedImages).toBeGreaterThan(0);
  expect(await preserved(page)).toEqual(absentArtState);
  await report('absent-art-fallback', { fixture: true, failedImages, stateUnchanged: true });
});

// A new test receives a fresh context: a previous successful renderer import
// must not satisfy this deliberate network failure from an engine cache.
test('A70 fresh-context renderer import failure has a usable static result', async ({ page }) => {
  let failedImports = 0;
  await page.route(/\/assets\/pixi-scenes-[^/]+\.js/, async (route) => {
    failedImports++;
    await route.abort();
  });
  await page.goto(`${fixture}?player=5&challenge=mastery`);
  const failedImportState = await preserved(page);
  await expect.poll(() => failedImports).toBeGreaterThan(0);
  await expect(page.locator('.scene-fallback')).toBeVisible();
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await expect(page.locator('.arena-exit')).toBeEnabled();
  await expect(page.locator('.pedestal')).toHaveCount(10);
  expect(failedImports).toBeGreaterThan(0);
  expect(await preserved(page)).toEqual(failedImportState);
  await report('import-fallback', {
    fixture: true,
    freshContext: true,
    failedImports,
    stateUnchanged: true,
  });
});

test('A70 missing overlay alone preserves original boss art and usable replay', async ({
  page,
}) => {
  let failedOverlayImages = 0;
  // Vite emits the >4kB cover as assets/book-cover-HASH.webp. Other small pieces
  // may be inlined, so block this specific real layer, never base character art.
  await page.route(/\/assets\/book-cover-[^/]+\.webp/, async (route) => {
    failedOverlayImages++;
    await route.abort();
  });
  await page.goto(`${fixture}?player=3&pack=diagon-alley`);
  const scene = page.locator('.scene-canvas');
  await expect(scene).toHaveAttribute('data-renderer', 'webgl');
  await expect(scene).toHaveAttribute('data-art-ready', 'true');
  await expect(scene).toHaveAttribute('data-visible-figures', '6');
  await expect(scene).toHaveAttribute('data-boss-prop-ready', 'false');
  const before = await preserved(page);
  expect(failedOverlayImages).toBeGreaterThan(0);
  await fits(page, 6);
  await skip(page).click();
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await expect(page.locator('.arena-exit')).toBeEnabled();
  await page.locator('.arena-record-trigger').click();
  await expect(page.locator('.battle-log')).toBeVisible();
  await page.keyboard.press('Escape');
  expect(await preserved(page)).toEqual(before);
  await report('overlay-only-failure', {
    fixture: true,
    failedOverlayImages,
    baseFiguresReady: true,
    staticOriginalBossRetained: true,
    stateUnchanged: true,
  });
});
