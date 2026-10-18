import { pauseBattle, resumeBattle } from '../browser-trial/battle-controls';
import { expect, test } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const evidence = resolve('docs/arcana/boss-increment-2026-10-16/evidence/linux/a73');

declare global {
  interface Window {
    __a73ReleaseDecodes: () => void;
  }
}
// One bounded fixture closes the lifecycle gaps affected by source admission.
// Visibility is synthetic; this is not a physical background/foreground test.
test('A73 pending decode hidden, paused resize and reduced preference during replay', async ({
  page,
}) => {
  test.skip(
    test.info().project.name !== 'chromium-1280-boss-a70',
    'One serial lifecycle sample; original matrices retain engine and viewport coverage.',
  );
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.addInitScript(() => {
    let release: () => void = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    window.__a73ReleaseDecodes = release;
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      return decode.call(this).then(() => gate);
    };
  });
  await page.goto(
    'http://127.0.0.1:5471/tests/browser-boss/boss-a70.html?challenge=mastery&player=5',
  );
  const panel = page.locator('.battle-panel'),
    scene = page.locator('.scene-canvas');
  await expect(scene).toHaveAttribute('data-renderer', 'webgl');
  await pauseBattle(page);
  await expect(panel).toHaveAttribute('data-replay-playing', 'false');
  await expect(scene).toHaveAttribute('data-art-ready', 'false');
  const frozen = await panel.getAttribute('data-replay-cursor');
  const before = await page.evaluate(() => ({
    battle: window.__a70Fixture.battle,
    game: window.__a70Fixture.game,
  }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const paints = await scene.getAttribute('data-render-count');
  await page.evaluate(async () => {
    window.__a73ReleaseDecodes();
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  });
  expect(await scene.getAttribute('data-render-count')).toBe(paints);
  expect(await panel.getAttribute('data-replay-cursor')).toBe(frozen);
  await page.evaluate(() => {
    Reflect.deleteProperty(document, 'hidden');
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(scene).toHaveAttribute('data-art-ready', 'true');
  await expect(scene).toHaveAttribute('data-boss-actor-ready', 'true');
  await expect(scene).toHaveAttribute('data-visible-figures', '10');
  for (const width of [390, 865]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1079 });
    for (const selector of ['.arena-figure-space', '.arena-inspect > strong', '.arena-health']) {
      await expect(page.locator(selector)).toHaveCount(10);
      for (const item of await page.locator(selector).all())
        await expect(item).toBeInViewport({ ratio: 1 });
    }
    expect(await panel.getAttribute('data-replay-cursor')).toBe(frozen);
    if (width === 390 && process.platform === 'linux' && process.env.ARCANA_CAPTURE_A71 === '1') {
      await page.evaluate(
        () =>
          new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))),
      );
      await mkdir(evidence, { recursive: true });
      await page.screenshot({ path: resolve(evidence, 'selected-paused-resize.png') });
    }
  }
  await resumeBattle(page);
  await expect(scene).toHaveAttribute('data-boss-actor-pose', 'cast', { timeout: 20000 });
  await page.locator('[data-qa-reduced]').evaluate((button: HTMLButtonElement) => button.click());
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await expect(page.locator('[data-arena-outcome]')).toHaveAttribute(
    'data-arena-outcome',
    JSON.parse(before.battle).outcome,
  );
  const finished = await panel.getAttribute('data-replay-cursor');
  await expect(scene).toHaveAttribute('data-active-ticking', 'false');
  await page.locator('[data-qa-reduced]').evaluate((button: HTMLButtonElement) => button.click());
  expect(await panel.getAttribute('data-replay-cursor')).toBe(finished);
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  expect(
    await page.evaluate(() => ({
      battle: window.__a70Fixture.battle,
      game: window.__a70Fixture.game,
    })),
  ).toEqual(before);
  expect(errors).toEqual([]);
  await mkdir(evidence, { recursive: true });
  await writeFile(
    resolve(evidence, 'lifecycle.json'),
    JSON.stringify(
      {
        sha: process.env.GITHUB_SHA,
        fixture: true,
        engine: 'chromium',
        physicalDevice: false,
        syntheticVisibility: true,
        controlledDecodeGate: true,
        pausedCursor: frozen,
        finishedCursor: finished,
        viewportWidths: [390, 865],
        preservedBattleAndGame: true,
        errors,
      },
      null,
      2,
    ),
  );
});
