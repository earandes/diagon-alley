import { expect, test as base, type Page } from '@playwright/test';

/** Historical journeys retain their original content assertions after the new default skin. */
export const test = base.extend({
  page: async ({ page }, use) => {
    const preferredPack =
      process.env.ARCANA_TEST_CONTENT_PACK === 'diagon-alley' ? 'diagon-alley' : 'arcana';
    await page.addInitScript((pack) => {
      try {
        const key = 'arcana.presentation.content-pack.v1';
        if (!localStorage.getItem(key)) localStorage.setItem(key, pack);
      } catch {
        /* Preferences can be unavailable before an origin is established. */
      }
    }, preferredPack);
    await use(page);
  },
});
export { expect };
export type { Page } from '@playwright/test';

/** Exercise A59's explicit owned-copy choice; no auto-selection in production or API seeding. */
export async function startExpedition(page: Page, language: 'es' | 'en' = 'es') {
  const preparation = page.locator('[data-expedition-preparation="new"]');
  await expect(preparation).toBeVisible();
  const first = preparation.locator('.preparation-card').first();
  await expect(first).toBeVisible();
  if ((await first.getAttribute('aria-pressed')) !== 'true') await first.click();
  const confirm = preparation.getByRole('button', {
    name: language === 'es' ? 'Entrar al mapa' : 'Enter the map',
    exact: true,
  });
  await expect(confirm).toBeEnabled();
  await confirm.click();
  await expect(page.locator('.branch-map')).toBeVisible();
}

/** Exercise the actual settings UI, including inside a node/commerce confirmation. */
export async function changeLanguage(page: Page, language: 'es' | 'en') {
  const activeDialog = page.locator('dialog[open]').last();
  const reveal = page.locator('.reveal');
  const revealSettings = reveal.getByRole('button', { name: /^(Ajustes|Settings)$/, exact: true });
  const origin = (await activeDialog.count())
    ? activeDialog
    : (await revealSettings.count())
      ? reveal
      : page.locator('header');
  await origin.getByRole('button', { name: /^(Ajustes|Settings)$/, exact: true }).click();
  const settings = page.locator('dialog.game-settings[open]');
  await expect(settings).toBeVisible();
  await settings
    .getByRole('button', { name: language === 'es' ? 'Español' : 'English', exact: true })
    .click();
  await expect(page.locator('html')).toHaveAttribute('lang', language);
  await settings
    .getByRole('button', { name: language === 'es' ? 'Cerrar' : 'Close', exact: true })
    .click();
  await expect(settings).toHaveCount(0);
}

export async function openAlbumFilters(page: Page) {
  const drawer = page.locator('.album-filter-drawer');
  if ((await drawer.getAttribute('open')) === null)
    await drawer.locator(':scope > summary').click();
  await expect(drawer).toHaveAttribute('open', '');
}

/** A60 card inspection is an explicit secondary action, independent of roster selection. */
export async function inspectPreparationCopy(page: Page, index = 0) {
  const preparation = page.locator('.preparation-dialog');
  await expect(preparation).toBeVisible();
  await preparation.locator('[data-preparation-inspect]').nth(index).click();
  await expect(page.locator('.preparation-inspection[open]')).toBeVisible();
}
export async function closePreparation(page: Page) {
  if (await page.locator('.preparation-inspection[open]').count())
    await page.keyboard.press('Escape');
  if (await page.locator('.preparation-dialog[open]').count()) await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
}
