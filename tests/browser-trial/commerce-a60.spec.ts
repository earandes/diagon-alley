import { test, expect, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { OperationResult } from '../../src/arcana/application/game';
import { changeLanguage } from './game-fixture';
import { readGame } from './route-helpers';
const output = resolve(process.env.ARCANA_COMMERCE_EVIDENCE_ROOT ?? 'docs/arcana/pokelike-2026-10-15/commerce-after');
async function enter(page: Page, language: 'es' | 'en') {
  await page.addInitScript(() =>
    localStorage.setItem('arcana.presentation.content-pack.v1', 'diagon-alley'),
  );
  await page.goto('/#/shop/confectionery');
  if (language === 'en') await changeLanguage(page, 'en');
  await page
    .getByRole('button', {
      name: language === 'es' ? 'Comenzar ensayo local' : 'Start local trial',
      exact: true,
    })
    .click();
  await page.evaluate(() => {
    location.hash = '/shop/confectionery';
  });
  await expect(page.locator('.sweetshop-scene')).toBeVisible();
}
async function shot(page: Page, name: string) {
  await mkdir(output, { recursive: true });
  await page.screenshot({ path: resolve(output, name + '.png'), fullPage: true });
}
for (const language of ['es', 'en'] as const) {
  test(`A60 clear next action, consultation and atomic frog ${language}`, async ({ page }) => {
    await enter(page, language);
    for (const width of [1280, 865, 390]) {
      await page.setViewportSize({ width, height: 1079 });
      await shot(page, `${language}-buy-open-${width}-${test.info().project.name}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    }
    const before = await readGame(page),
      posts: string[] = [];
    page.on('request', (request) => {
      if (request.method() === 'POST') posts.push(new URL(request.url()).pathname);
    });
    await page.locator('[data-product="random-beans"]').click();
    const info = page.locator('.shop-info-object');
    await info.click();
    await expect(page.locator('.bean-use-story li')).toHaveCount(3);
    expect(await readGame(page)).toEqual(before);
    await shot(page, `${language}-bean-info-${test.info().project.name}`);
    await page.keyboard.press('Escape');
    await expect(info).toBeFocused();
    await page.locator('[data-product="cacao-toad"]').click();
    expect(posts).toEqual([]);
    await expect(page.locator('.shop-counter-actions [data-primary-action]')).toHaveCount(1);
    await expect(page.locator('.shop-purchase-ticket')).toHaveAccessibleName(
      new RegExp(language === 'es' ? 'Comprar y abrir' : 'Buy and open'),
    );
    await page.locator('.shop-purchase-ticket').click();
    await expect(page.locator('dialog.reveal')).toBeVisible();
    const after = await readGame(page);
    expect(after.inventory.crowns).toBe(before.inventory.crowns - 10);
    expect(after.revision).toBe(before.revision + 1);
    expect(after.copies).toHaveLength(before.copies.length + 1);
    expect(after.receipts.at(-1)?.kind).toBe('buy-open-toad');
    expect(posts).toEqual(['/api/toads/buy-open']);
    const skip = page.getByRole('button', {
      name: language === 'es' ? 'Omitir animación' : 'Skip animation',
      exact: true,
    });
    if (await skip.isVisible()) await skip.click();
    await page.locator('.reveal-continue').click();
    await page.locator('[data-product="random-beans"]').click();
    await page.locator('.shop-purchase-ticket').click();
    await expect(page.locator('.bean-prepare-action')).toBeVisible();
    const prepare = page.locator('.bean-prepare-action');
    for (const state of ['hover', 'focus'] as const) {
      if (state === 'hover') await prepare.hover();
      else await prepare.focus();
      const contrast = await prepare.evaluate((element) => {
        const style = getComputedStyle(element);
        const luminance = (value: string) => {
          const rgb = value
            .match(/[\d.]+/g)!
            .slice(0, 3)
            .map(Number)
            .map((channel) => {
              const x = channel / 255;
              return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
            });
          return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
        };
        const a = luminance(style.color),
          b = luminance(style.backgroundColor);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      });
      expect(contrast).toBeGreaterThanOrEqual(4.5);
    }

    const bought = await readGame(page);
    expect(bought.inventory.crowns).toBe(after.inventory.crowns - 5);
    expect(bought.copies).toEqual(after.copies);
    await expect(page.locator('.flavour-cabinet')).toHaveCount(0);
    await expect(page.locator('.shop-counter-actions [data-primary-action]')).toHaveCount(1);
    for (const width of [1280, 865, 390]) {
      await page.setViewportSize({ width, height: 1079 });
      await shot(page, `${language}-beans-${width}-${test.info().project.name}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    }
    await page.locator('.bean-prepare-action').click();
    await expect(page.locator('dialog.preparation-dialog .expedition-preparation')).toBeVisible();
    expect(await readGame(page)).toEqual(bought);
    await page.reload();
    expect(await readGame(page)).toEqual(bought);
  });
  test(`A60 owned frog opens without repurchase and recovery ${language}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await enter(page, language);
    const before = await readGame(page);
    // Setup uses the retained public purchase command to represent a pre-A60 sealed unit.
    const content = await (await page.request.get('/api/content')).json();
    const buy = await page.request.post('/api/purchases', {
      headers: { Origin: new URL(page.url()).origin },
      data: {
        key: 'a60-stock',
        expectedRevision: before.revision,
        request: { product: 'cacao-toad', quantity: 1, priceVersion: content.shop.version },
      },
    });
    if (!buy.ok()) throw Error(await buy.text());
    await page.reload();
    await expect(page.locator('.open-frog-action')).toBeVisible();
    await expect(page.locator('.shop-purchase-ticket')).toHaveCount(0);
    const owned = await readGame(page);
    for (const width of [1280, 865, 390]) {
      await page.setViewportSize({ width, height: 1079 });
      await shot(page, `${language}-owned-frog-${width}-${test.info().project.name}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    }
    await page.context().setOffline(true);
    await expect(page.locator('.open-frog-action')).toBeDisabled();
    await page.context().setOffline(false);
    await expect(page.locator('.open-frog-action')).toBeEnabled();
    await page.locator('.open-frog-action').click();
    await expect(page.locator('dialog.reveal')).toHaveAttribute('data-opening-state', 'result');
    const opened = await readGame(page);
    expect(opened.inventory.crowns).toBe(owned.inventory.crowns);
    expect(opened.copies).toHaveLength(owned.copies.length + 1);
    expect(opened.receipts.at(-1)?.kind).toBe('open-toad');
    await page.reload();
    expect(await readGame(page)).toEqual(opened);
  });
  test(`A60 committed buy-open survives a lost HTTP response ${language}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await enter(page, language);
    const before = await readGame(page);
    let posted = 0,
      commitBody: OperationResult | null = null;
    const recoveryGets: string[] = [];
    page.on('request', (request) => {
      const path = new URL(request.url()).pathname;
      if (request.method() === 'POST' && path === '/api/toads/buy-open') posted++;
      if (request.method() === 'GET' && path.startsWith('/api/operations/'))
        recoveryGets.push(path);
    });
    await page.route('**/api/toads/buy-open', async (route) => {
      const committed = await route.fetch();
      expect(committed.ok()).toBe(true);
      commitBody = await committed.json();
      await route.abort('failed');
    });
    await page.locator('.shop-purchase-ticket').click();
    await expect(
      page.getByRole('button', {
        name: language === 'es' ? 'Recuperar operación' : 'Recover operation',
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator('dialog.reveal')).toHaveCount(0);
    const committed = await readGame(page);
    expect(committed.revision).toBe(before.revision + 1);
    expect(committed.copies).toHaveLength(before.copies.length + 1);
    expect(committed.inventory.crowns).toBe(before.inventory.crowns - 10);
    await page
      .getByRole('button', {
        name: language === 'es' ? 'Recuperar operación' : 'Recover operation',
        exact: true,
      })
      .click();
    await expect(page.locator('dialog.reveal')).toHaveAttribute('data-opening-state', 'result');
    expect(await readGame(page)).toEqual(committed);
    expect(recoveryGets).toContain('/api/operations/' + commitBody!.receipt.id);
    expect(posted).toBe(1);
    await page.reload();
    expect(await readGame(page)).toEqual(committed);
  });
}
