import { test, expect, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import trial from '../../src/arcana/content/trial-v1.json' with { type: 'json' };
import { changeLanguage } from './game-fixture';
import { readGame } from './route-helpers';

const evidence = resolve(
  process.env.ARCANA_EXPERIENCE_EVIDENCE_ROOT ?? 'docs/arcana/annotations-2026-10-15/after',
);
async function photo(page: Page, name: string) {
  await mkdir(evidence, { recursive: true });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((i) => i.getBoundingClientRect().width)
        .map((i) =>
          Promise.race([
            i.decode().catch(() => {}),
            new Promise((resolve) => setTimeout(resolve, 1200)),
          ]),
        ),
    );
  });
  await page.screenshot({ path: resolve(evidence, `${name}.png`) });
}
for (const language of ['es', 'en'] as const) {
  test(`A59 deliberate companions, continuous map and discovery objects ${language}`, async ({
    page,
  }, info) => {
    await page.addInitScript(() =>
      localStorage.setItem('arcana.presentation.content-pack.v1', 'diagon-alley'),
    );
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    if (language === 'en') await changeLanguage(page, 'en');
    await expect(page.locator('.welcome')).toBeVisible();
    expect(
      await page.locator('.welcome').evaluate((el) => getComputedStyle(el).backgroundColor),
    ).toBe('rgba(0, 0, 0, 0)');
    if (info.project.name === 'chromium-experience') await photo(page, `${language}-01-entry-911`);
    await page.locator('.portal-enter').click();
    const preparation = page.locator('[data-expedition-preparation="new"]');
    await expect(preparation).toBeVisible();
    const before = await readGame(page);
    expect(before.exploration?.run ?? null).toBeNull();
    await expect(preparation.locator('.preparation-card')).toHaveCount(before.copies.length);
    await expect(preparation.locator('.preparation-card[aria-pressed="true"]')).toHaveCount(0);
    await expect(preparation.locator('[data-preparation-confirm]')).toBeDisabled();
    await expect(page.locator('.team-compact')).toHaveCount(0);
    if (info.project.name === 'chromium-experience') await photo(page, `${language}-02-choose-911`);
    await preparation.locator('.preparation-card').first().click();
    await expect(preparation.locator('[data-preparation-confirm]')).toBeEnabled();
    await changeLanguage(page, language === 'es' ? 'en' : 'es');
    await changeLanguage(page, language);
    await expect(preparation.locator('.preparation-card[aria-pressed="true"]')).toHaveCount(1);
    expect(await readGame(page)).toEqual(before);
    await page.locator('.game-header .settings-trigger').click();
    const settings = page.locator('dialog.settings-case');
    await expect(settings).toBeVisible();
    await expect(page.locator('.scene-atmosphere .scene-mote').first()).toHaveCSS(
      'animation-play-state',
      'paused',
    );
    const close = settings.locator('.settings-close');
    expect(
      await close.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const target = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return el === target || el.contains(target);
      }),
    ).toBe(true);
    if (info.project.name === 'chromium-experience')
      await photo(page, `${language}-03-settings-911`);
    await close.click();
    await preparation.locator('[data-preparation-confirm]').click();
    await expect(page.locator('[data-map-phase]')).toHaveAttribute('data-map-phase', 'route');
    const started = await readGame(page);
    expect(started.receipts.filter((r) => r.kind === 'start-run')).toHaveLength(1);
    expect(started.copies).toEqual(before.copies);
    expect(started.inventory).toEqual(before.inventory);
    expect(
      started.exploration!.run!.members.filter((m) => m.source === 'owned').map((m) => m.unit.id),
    ).toEqual([before.copies[0]!.copyId]);
    await expect(page.locator('.region-map-art')).toBeHidden();
    for (const viewport of [
      { width: 911, height: 1079 },
      { width: 390, height: 844 },
      { width: 1280, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <= innerWidth &&
            document.documentElement.scrollHeight <= innerHeight + 2,
        ),
      ).toBe(true);
      const boxes = await page.locator('.game-header h1,.game-shell > .hud').evaluateAll((nodes) =>
        nodes.map((n) => {
          const r = n.getBoundingClientRect();
          return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
        }),
      );
      const a = boxes[0]!,
        b = boxes[1]!;
      expect(a.right <= b.left + 1 || a.bottom <= b.top + 1 || b.bottom <= a.top + 1).toBe(true);
      if (info.project.name === 'chromium-experience')
        await photo(page, `${language}-04-map-${viewport.width}`);
    }
    await page.locator('.team-prepare').click();
    const active = page.locator('dialog.preparation-dialog');
    await expect(active).toBeVisible();
    await expect(active.locator('[data-expedition-preparation]')).toHaveAttribute(
      'data-expedition-preparation',
      'active',
    );
    await active.locator('.settings-trigger').click();
    await expect(page.locator('dialog.game-settings')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog.game-settings')).toHaveCount(0);
    await expect(active).toBeVisible();
    await expect(active.locator('.settings-trigger')).toBeFocused();
    await active.locator('.preparation-card').first().click();
    await page.keyboard.press('Escape');
    await expect(active).toHaveCount(0);
    expect(await readGame(page)).toEqual(started);
    await page.locator('nav button').nth(1).click();
    await expect(page.locator('.collection-panel')).toBeVisible();
    await expect(page.locator('.copy-inspector,.gear-control')).toHaveCount(0);
    const recipe = page.locator('.flavour-recipe-trigger');
    await recipe.click();
    await expect(page.locator('.flavour-recipe')).toBeVisible();
    if (info.project.name === 'chromium-experience')
      await photo(page, `${language}-05-flavour-recipe-1280`);
    await page.keyboard.press('Escape');
    await expect(recipe).toBeFocused();
    await page.locator('nav button').nth(3).click();
    await expect(page.locator('.journey-atlas [data-future="true"]')).toBeVisible();
    await expect(page.locator('.journey-atlas [data-future="true"] button')).toHaveCount(0);
    if (info.project.name === 'chromium-experience') await photo(page, `${language}-06-atlas-1280`);
    expect(await readGame(page)).toEqual(started);
    await changeLanguage(page, language === 'es' ? 'en' : 'es');
    await page.locator('header .settings-trigger').click();
    await page.getByRole('button', { name: 'ARCANA', exact: true }).click();
    await page.locator('.settings-close').click();
    expect(await readGame(page)).toEqual(started);
    await page.reload();
    await expect(page.locator('.journey-atlas')).toBeVisible();
    expect(await readGame(page)).toEqual(started);
    expect(errors).toEqual([]);
  });

  test(`A59 rarity magic and reduced results are cosmetic ${language}`, async ({ page }, info) => {
    test.skip(
      process.env.ARCANA_A59_COMPILED === '1',
      'The explicitly labelled visual fixture is excluded from distribution.',
    );
    await page.addInitScript(() =>
      localStorage.setItem('arcana.presentation.content-pack.v1', 'diagon-alley'),
    );
    const posts: string[] = [];
    page.on('request', (r) => {
      if (r.method() === 'POST' && r.url().includes('/api/')) posts.push(r.url());
    });
    const recipes = [];
    for (const rarity of ['common', 'unusual', 'epic', 'arcane-legendary']) {
      const wizard = trial.catalog.wizards.find((w) => w.rarity === rarity)!;
      await page.goto(
        `/tests/arcana-art-harness.html?reveal=${wizard.id}&motion=normal&lang=${language}`,
      );
      const burst = page.locator('.celebration-a59');
      await expect(burst).toHaveAttribute('data-celebration-rarity', rarity);
      await expect(page.locator('.opening-stage > .opening-theatre')).toBeVisible();
      await expect(page.locator('.opening-theatre .celebration-a59')).toHaveCount(1);
      await expect(page.locator('.reveal')).toHaveAttribute('data-reveal-magic', 'cast');
      const recipe = await burst.evaluate((el) => ({
        shape: el.getAttribute('data-celebration-shape'),
        color: getComputedStyle(el).getPropertyValue('--burst-color'),
        count: el.querySelectorAll('.celebration-a59-particle').length,
      }));
      recipes.push(recipe);
      await expect(page.locator('.reveal-continue img')).toBeVisible();
      await expect
        .poll(() =>
          page
            .locator('.holographic-card .card-stars')
            .evaluate((el) => getComputedStyle(el).opacity),
        )
        .toBe('1');
      if (info.project.name === 'chromium-experience')
        await photo(page, `${language}-07-reward-${rarity}`);
      await expect(burst).toHaveCount(0, { timeout: 4000 });
      await expect
        .poll(
          () =>
            page
              .locator('.opening-theatre')
              .evaluate((el) =>
                el.getAnimations({ subtree: true }).some((a) => a.playState === 'running'),
              ),
          { timeout: 2200 },
        )
        .toBe(false);
      await page.goto(`/tests/arcana-art-harness.html?reveal=${wizard.id}&lang=${language}`);
      await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result');
      await expect(page.locator('.celebration-a59')).toHaveCount(0);
      await expect(page.locator('.reveal')).toHaveAttribute('data-reveal-magic', 'still');
    }
    expect(new Set(recipes.map((r) => r.shape)).size).toBe(4);
    expect(new Set(recipes.map((r) => r.color)).size).toBe(4);
    expect(recipes.map((r) => r.count)).toEqual(
      [...recipes.map((r) => r.count)].sort((a, b) => a - b),
    );
    expect(posts).toEqual([]);
    await mkdir(evidence, { recursive: true });
    await writeFile(
      resolve(evidence, `${info.project.name}-${language}-rarity-recipes.json`),
      JSON.stringify(recipes, null, 2),
    );
  });
}
