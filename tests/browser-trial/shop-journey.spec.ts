import { test, expect, type Page } from '@playwright/test';
import type { PublicContent } from '../../src/arcana/application/public-content';
import { changeLanguage } from './game-fixture';
import { readGame } from './route-helpers';

async function enter(page: Page, language: 'es' | 'en', path = '/#/shop') {
  await page.addInitScript(() =>
    localStorage.setItem('arcana.presentation.content-pack.v1', 'diagon-alley'),
  );
  await page.goto(path);
  if (language === 'en') await changeLanguage(page, 'en');
  await page
    .getByRole('button', {
      name: language === 'es' ? 'Comenzar ensayo local' : 'Start local trial',
      exact: true,
    })
    .click();
  await expect(page.locator('.hud')).toBeVisible();
  // Entry keeps its own map destination. Navigate using the same public hash as the game dock.
  await page.evaluate(() => {
    location.hash = '/shop';
  });
  await expect(page.locator('.shop-alley')).toBeVisible();
}

for (const language of ['es', 'en'] as const) {
  test(`A59 shop places and illustrated consultations preserve state in ${language}`, async ({
    page,
  }) => {
    const en = language === 'en';
    await enter(page, language);
    const before = await readGame(page);
    const shops = [
      {
        id: 'confectionery',
        title: en ? 'Diagon Sweets' : 'Dulces del Callejón',
        book: en ? 'Card probabilities' : 'Probabilidades por cromo',
      },
      {
        id: 'workshop',
        title: 'Ollivanders',
        book: en ? 'Equipment you own' : 'Equipo que posees',
      },
      {
        id: 'vault',
        title: 'Gringotts',
        book: en ? 'Possible loot and probabilities' : 'Botines posibles y probabilidades',
      },
    ];
    await expect(page.locator('.shop-storefront')).toHaveCount(3);
    for (const shop of shops) {
      await page.getByRole('button', { name: shop.title, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#/shop/${shop.id}$`));
      await expect(page.getByRole('heading', { name: shop.title, exact: true })).toBeVisible();
      await expect(page.locator('.bazaar-tabs')).toHaveCount(0);
      const book = page.getByRole('button', { name: shop.book, exact: true });
      await book.click();
      const ledger = page.getByRole('dialog', { name: shop.book, exact: true });
      await expect(ledger).toBeVisible();
      if (shop.id === 'confectionery') {
        const content: PublicContent = await (await page.request.get('/api/content')).json();
        await expect(ledger.locator('.shop-card-catalogue article')).toHaveCount(
          content.toadTable.entries.length,
        );
      }
      await page.keyboard.press('Escape');
      await expect(ledger).toHaveCount(0);
      await expect(book).toBeFocused();
      if (shop.id === 'vault') {
        await expect(page.locator('.vault-lock-action')).toBeDisabled();
        await expect(page.locator('.vault-key-ring')).toHaveAccessibleName(
          en ? 'Available keys: 0' : 'Llaves disponibles: 0',
        );
        await expect(page.locator('.vault-map-action')).toBeVisible();
      }
      expect(await readGame(page)).toEqual(before);
      await page
        .getByRole('button', { name: en ? 'Back to the alley' : 'Volver al callejón', exact: true })
        .click();
      await expect(page).toHaveURL(/#\/shop$/);
      await expect(page.locator('.shop-storefront')).toHaveCount(3);
    }
    await page.reload();
    await expect(page.locator('.shop-alley')).toBeVisible();
    expect(await readGame(page)).toEqual(before);
  });

  test(`A60 counter uses exact catalogue prices and one explicit next action in ${language}`, async ({
    page,
  }) => {
    const en = language === 'en';
    await enter(page, language);
    await page
      .getByRole('button', { name: en ? 'Diagon Sweets' : 'Dulces del Callejón', exact: true })
      .click();
    const content: PublicContent = await (await page.request.get('/api/content')).json();
    for (const kind of ['cacao-toad', 'random-beans'] as const) {
      const product = content.shop.products.find((offer) => offer.kind === kind)!;
      await page.locator(`[data-product="${kind}"]`).click();
      const before = await readGame(page);
      const buy = page.locator('.shop-purchase-ticket');
      await expect(buy.locator('.purchase-amount')).toHaveText(String(product.crowns));
      await expect(buy).toHaveAccessibleName(new RegExp(String(product.crowns)));
      await buy.click();
      await expect.poll(async () => (await readGame(page)).revision).toBe(before.revision + 1);
      const after = await readGame(page);
      expect(after.inventory.crowns).toBe(before.inventory.crowns - product.crowns);
      expect(after.inventory.products.length).toBe(before.inventory.products.length + 1);
      expect(after.receipts.length).toBe(before.receipts.length + 1);
      expect(after.receipts.at(-1)?.kind).toBe(
        kind === 'cacao-toad' ? 'buy-open-toad' : 'purchase',
      );
      if (kind === 'cacao-toad') {
        expect(after.copies.length).toBe(before.copies.length + 1);
        expect(after.inventory.products.at(-1)?.status).toBe('consumed');
        await expect(page.locator('dialog.reveal')).toBeVisible();
        const skip = page.getByRole('button', {
          name: en ? 'Skip animation' : 'Omitir animación',
          exact: true,
        });
        if (await skip.isVisible()) await skip.click();
        await page.locator('.reveal-continue').click();
      } else {
        await expect(page.locator('.bean-prepare-action')).toBeVisible();
        await expect(page.locator('.flavour-cabinet')).toHaveCount(0);
      }
      await page.reload();
      await expect(page.locator('.sweetshop-scene')).toBeVisible();
      expect(await readGame(page)).toEqual(after);
    }
  });
}
