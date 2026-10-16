import { expect, test } from '../browser-trial/game-fixture';
import { mkdir, writeFile } from 'node:fs/promises';
const evidence = 'docs/arcana/gameplay-increment-2026-10-16/evidence';
const pack = process.env.ARCANA_TEST_CONTENT_PACK === 'diagon-alley' ? 'diagon-alley' : 'arcana';
const capturesRoot = `${evidence}/arena-captures-${pack}`;
for (const language of ['es', 'en'] as const) {
  test(`A63 simultaneous 3–5 actors, no spoiler and inspector in ${language}`, async ({ page }) => {
    test.setTimeout(90000);
    const captures = `${capturesRoot}/${test.info().project.name}`;
    for (const [player, rival] of [
      [3, 3],
      [5, 3],
      [5, 5],
    ]) {
      await page.goto(
        `/tests/arcana-arena-a63-harness.html?player=${player}&rival=${rival}&lang=${language}`,
      );
      await page
        .getByRole('button', { name: language === 'es' ? 'Pausa' : 'Pause', exact: true })
        .click();
      const original = await page.evaluate(
        () => (window as unknown as { __arenaFixtureRecord: string }).__arenaFixtureRecord,
      );
      expect(await page.locator('.battle-panel').innerText()).not.toMatch(
        /Victoria|Derrota|Empate|Victory|Defeat|Draw/,
      );
      expect(await page.locator('.battle-panel').ariaSnapshot()).not.toMatch(
        /Victoria|Derrota|Empate|Victory|Defeat|Draw/,
      );
      for (const viewport of [
        { width: 1280, height: 900 },
        { width: 390, height: 844 },
        { width: 865, height: 1079 },
      ]) {
        await page.setViewportSize(viewport);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          );
        });
        await expect(page.locator('.pedestal')).toHaveCount(player + rival);
        const boxes = await page.locator('.pedestal').evaluateAll((nodes) =>
          nodes.map((node) => {
            const r = node.getBoundingClientRect();
            return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
          }),
        );
        await writeFile(
          `${evidence}/arena-boxes-${language}-${player}x${rival}-${viewport.width}.json`,
          JSON.stringify(
            {
              boxes,
              layout: await page
                .locator(
                  '.arena-stage,.arena-team,.arena-fighters,.pedestal,.arena-inspect,.arena-figure-space,.arena-portrait,.arena-inspect >strong,.arena-health',
                )
                .evaluateAll((nodes) =>
                  nodes.slice(0, 30).map((node) => ({
                    class: node.className,
                    height: node.getBoundingClientRect().height,
                    css: getComputedStyle(node).cssText,
                    font: getComputedStyle(node).fontSize,
                    minHeight: getComputedStyle(node).minHeight,
                    padding: getComputedStyle(node).padding,
                    position: getComputedStyle(node).position,
                  })),
                ),
            },
            null,
            2,
          ),
        );
        expect(
          boxes.every(
            (box) =>
              box.top >= 0 &&
              box.bottom <= viewport.height &&
              box.left >= 0 &&
              box.right <= viewport.width,
          ),
        ).toBe(true);
        await mkdir(`${captures}`, { recursive: true });
        await writeFile(
          `${captures}/${language}-${player}x${rival}-${viewport.width}-geometry.json`,
          JSON.stringify(
            await page.evaluate(() => ({
              docHeight: document.documentElement.scrollHeight,
              viewport: innerHeight,
              elements: [
                ...document.querySelectorAll<HTMLElement>(
                  '.game-shell,.game-header,.battle-wallet,main,.arena-a63,.arena-stage,.arena-caption,.arena-columns',
                ),
              ].map((el) => ({
                class: el.className,
                y: el.getBoundingClientRect().y,
                height: el.getBoundingClientRect().height,
                margin: getComputedStyle(el).margin,
                padding: getComputedStyle(el).padding,
                minHeight: getComputedStyle(el).minHeight,
              })),
            })),
            null,
            2,
          ),
        );
        await page.screenshot({
          path: `${captures}/${language}-${player}x${rival}-${viewport.width}.png`,
          fullPage: true,
        });
        expect(
          await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1),
        ).toBe(true);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        ).toBe(true);
        await mkdir(`${captures}`, { recursive: true });
        await page.screenshot({
          path: `${captures}/${language}-${player}x${rival}-${viewport.width}.png`,
          fullPage: true,
        });
      }
      const trigger = page.locator('[data-unit="p0"] .arena-inspect');
      await trigger.click();
      const inspector = page.locator('dialog.arena-inspector[open]');
      await expect(inspector).toBeVisible();
      await expect(inspector).toContainText(language === 'es' ? 'Alquimia' : 'Alchemy');
      await expect(inspector).toContainText(language === 'es' ? 'PM' : 'MP');
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
      await page
        .getByRole('button', {
          name: language === 'es' ? 'Omitir reproducción' : 'Skip playback',
          exact: true,
        })
        .click();
      await expect(page.locator('[data-arena-outcome]')).toBeVisible();
      expect(
        await page.evaluate(
          () => (window as unknown as { __arenaFixtureRecord: string }).__arenaFixtureRecord,
        ),
      ).toBe(original);
    }
  });
}
test('A63 replay controls, reduced, missing renderer, assets and enlarged text preserve record', async ({
  page,
}) => {
  await page.goto('/tests/arcana-arena-a63-harness.html');
  const panel = page.locator('.battle-panel');
  await page.getByRole('button', { name: 'Pausa', exact: true }).click();
  const cursor = await panel.getAttribute('data-replay-cursor');
  await page.waitForTimeout(600);
  expect(await panel.getAttribute('data-replay-cursor')).toBe(cursor);
  await page.getByRole('button', { name: '2x', exact: true }).click();
  await page.getByRole('button', { name: 'Auto', exact: true }).click();
  await expect
    .poll(async () => Number(await panel.getAttribute('data-replay-cursor')))
    .toBeGreaterThan(Number(cursor));
  const during = await page.evaluate(async () => {
    const samples: { height: number; captionTop:number; actorBottom:number; cursor: string | null; caption: string | null }[] = [];
    const start = performance.now();
    while (performance.now() - start < 5000) {
      samples.push({
        height: document.documentElement.scrollHeight,
        captionTop: document.querySelector('.arena-caption')!.getBoundingClientRect().top,
        actorBottom: Math.max(
          ...[...document.querySelectorAll('.pedestal')].map(
            (node) => node.getBoundingClientRect().bottom,
          ),
        ),
        cursor: document.querySelector('.battle-panel')?.getAttribute('data-replay-cursor') ?? null,
        caption: document.querySelector('.arena-caption')?.textContent ?? null,
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return samples;
  });
  await writeFile(
    `${evidence}/arena-during-${pack}-${test.info().project.name}.json`,
    JSON.stringify(during, null, 2),
  );
  expect(Math.max(...during.map((sample) => sample.height))).toBeLessThanOrEqual(845);
  expect(during.every((sample) => sample.actorBottom <= sample.captionTop)).toBe(true);
  await page.getByRole('button', { name: 'Omitir reproducción', exact: true }).click();
  await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    .toBe(true);
  expect(
    await page
      .locator('.pedestal')
      .evaluateAll((nodes) => nodes.every((node) => node.scrollHeight <= node.clientHeight + 1)),
  ).toBe(true);
  await page.goto('/tests/arcana-arena-a63-harness.html?reduced');
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await page.route('**/*pixi-scenes*', (route) => route.abort());
  await page.route('**/*.webp', (route) => route.abort());
  await page.goto('/tests/arcana-arena-a63-harness.html?fallback');
  await expect(page.locator('.scene-fallback')).toBeVisible();
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await expect(page.locator('.pedestal')).toHaveCount(10);
  await expect(page.locator('.arena-exit')).toBeEnabled();
  await writeFile(`${evidence}/arena-fallback.txt`, await panel.innerText());
});
