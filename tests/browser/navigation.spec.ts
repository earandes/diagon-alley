import { test, expect } from '@playwright/test';
for (const language of ['es', 'en'] as const) {
  test(`contextual album access replaces bottom navigation ${language}`, async ({ page }) => {
    await page.goto('/');
    await page.locator('#language').selectOption(language);
    await expect(page.locator('.bottom-nav')).toHaveCount(0);
    await page.locator('#alley-album').press('Enter');
    await expect(
      page.getByText(language === 'es' ? '4 de 12 descubrimientos' : '4 of 12 discovered', {
        exact: true,
      }),
    ).toBeVisible();
    await page.locator('#album-back').click();
    await expect(page.locator('#alley-album')).toBeFocused();
    await page.locator('#enter-shop').click();
    await expect(page.getByRole('heading', { name: 'Weasley', exact: true })).toBeFocused();
    await page.locator('#shop-album').press('Enter');
    await page.locator('#album-back').click();
    await expect(page.locator('#shop-album')).toBeFocused();
    await page.locator('#consult-frog').click();
    await page.locator('.use-frog').click();
    await page
      .getByRole('button', { name: language === 'es' ? 'Omitir' : 'Skip', exact: true })
      .click();
    await page.locator('#result-album').click();
    await expect(
      page.getByText(language === 'es' ? '5 de 12 descubrimientos' : '5 of 12 discovered', {
        exact: true,
      }),
    ).toBeVisible();
    await page.locator('#album-back').click();
    await expect(page.locator('#result-album')).toBeFocused();
    await page.locator('#result-album').click();
    await page.locator('#album-to-alley').click();
    await expect(page.locator('#enter-shop')).toBeFocused();
    await page.locator('#enter-shop').click();
    await page.locator('#shop-album').click();
    await expect(
      page.getByText(language === 'es' ? '5 de 12 descubrimientos' : '5 of 12 discovered', {
        exact: true,
      }),
    ).toBeVisible();
  });
}
