import { startExpedition } from './game-fixture';
import { openAlbumFilters } from './game-fixture';
import { confirmEvent } from './route-helpers';
import { changeLanguage } from './game-fixture';
import { expect, test } from './game-fixture';

for (const language of ['es', 'en'] as const) {
  for (const reduced of [false, true]) {
    test(`A52 confirmed feedback and orientation ${language} reduced=${reduced}`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
      await page.goto('/');
      if (language === 'en') await changeLanguage(page, 'en');
      await page
        .getByRole('button', {
          name: language === 'es' ? 'Comenzar ensayo local' : 'Start local trial',
          exact: true,
        })
        .click();
      const guide = page.locator('[data-expedition-cue]');
      await expect(guide).toHaveAttribute('data-expedition-cue', 'begin');
      await startExpedition(page, language);
      await expect(guide).toHaveAttribute('data-expedition-cue', 'recruit');
      for (const id of ['pasaje:0:0', 'pasaje:1:0']) {
        await page.locator(`[data-node="${id}"]`).click();
        await confirmEvent(page, language);
      }
      await expect(guide).toHaveAttribute('data-expedition-cue', 'choose');
      await expect(page.locator('.team-unit')).toHaveCount(3);
      await expect(
        page
          .locator('.team-source')
          .filter({ hasText: language === 'es' ? 'Aliado temporal' : 'Temporary ally' }),
      ).toHaveCount(2);
      // Both the canvas and DOM share the route; guidance/filter/language never send a command.
      await expect(page.locator('.map-scroll canvas')).toBeVisible();
      const state = async () => (await (await page.request.get('/api/state')).json()).state;
      const before = await state();
      await page
        .getByRole('button', { name: language === 'es' ? 'Cromodex' : 'Chromodex', exact: true })
        .click();
      await expect(
        page.getByText(
          language === 'es'
            ? 'Identidades descubiertas: 1 de 30'
            : 'Identities discovered: 1 of 30',
        ),
      ).toBeVisible();
      await expect(page.locator('.card-team-state')).toHaveCount(1);
      await openAlbumFilters(page);
      await page
        .getByRole('group', {
          name: language === 'es' ? 'Filtro de descubrimiento' : 'Discovery filter',
          exact: false,
        })
        .locator('[data-visual-value="discovered"]')
        .click();
      await expect(page.locator('.album .card')).toHaveCount(1);
      await changeLanguage(page, language === 'es' ? 'en' : 'es');
      expect(await state()).toEqual(before);
      await changeLanguage(page, language);
      await page
        .getByRole('button', { name: language === 'es' ? 'Bazar' : 'Bazaar', exact: true })
        .click();
      await page.locator('[data-shop="confectionery"]').click();
      await page
        .getByRole('button', {
          name: language === 'es' ? 'Grageas del Azar' : 'Chance Beans',
          exact: true,
        })
        .click();
      const purchase = page.getByRole('button', {
        name:
          language === 'es'
            ? 'Comprar Grageas del Azar · 5 Coronas'
            : 'Buy Chance Beans · 5 Crowns',
        exact: true,
      });
      await page.route('**/api/purchases', (route) =>
        route.fulfill({
          status: 422,
          contentType: 'application/json',
          body: JSON.stringify({
            error: { code: 'INSUFFICIENT_CROWNS', recoverWithSameKey: false },
          }),
        }),
      );
      // A rejected command cannot generate an optimistic success banner.
      await purchase.click();
      await expect(page.locator('.operation-feedback')).toBeHidden();
      await expect(page.getByRole('alert')).toBeVisible();
      expect(await state()).toEqual(before);
      await page.unroute('**/api/purchases');
      await page
        .getByRole('button', {
          name: language === 'es' ? 'Actualizar estado' : 'Refresh state',
          exact: true,
        })
        .click();
      // Refresh remounts the product display; choose the beans again without spending.
      await page
        .getByRole('button', {
          name: language === 'es' ? 'Grageas del Azar' : 'Chance Beans',
          exact: true,
        })
        .click();
      await expect(purchase).toBeEnabled();
      await purchase.click();
      await expect(page.locator('.operation-feedback')).toBeVisible();
      const afterPurchase = await state();
      const receipt = afterPurchase.receipts.find((r: { kind: string }) => r.kind === 'purchase');
      expect(receipt).toBeTruthy();
      await expect(page.locator('.operation-feedback')).toHaveAttribute(
        'data-confirmed-operation',
        receipt.id,
      );
      const announcement = await page.locator('main > [role="status"]').textContent();
      if (reduced)
        expect(
          await page.locator('.operation-feedback').evaluate((el) => el.getAnimations().length),
        ).toBe(0);
      await changeLanguage(page, language === 'es' ? 'en' : 'es');
      expect(await page.locator('main > [role="status"]').textContent()).toBe(announcement);
      expect(await state()).toEqual(afterPurchase);
      await page.setViewportSize({ width: 320, height: 844 });
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.reload();
      expect(await state()).toEqual(afterPurchase);
    });
  }
}
