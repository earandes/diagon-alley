import { test, expect } from '@playwright/test';

for (const language of ['es', 'en'] as const) {
  test(`A28 keyboard bypass, actionable first views and illustrated album details ${language}`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const original = crypto.getRandomValues.bind(crypto);
      crypto.getRandomValues = function <T extends ArrayBufferView>(array: T): T {
        if (array instanceof Uint32Array && array.length === 1) {
          array[0] = 14; // Controlled Minerva fixture, not a real draw statistic.
          return array;
        }
        return original(array) as T;
      };
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('#language').selectOption(language);
    const skip = page.getByRole('link', {
      name: language === 'es' ? 'Saltar al contenido' : 'Skip to content',
    });
    await skip.focus();
    await skip.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    await page.locator('#enter-shop').click();
    await expect(page.locator('#consult-frog')).toBeVisible();
    expect(
      (await page.locator('#consult-frog').boundingBox())!.y +
        (await page.locator('#consult-frog').boundingBox())!.height,
    ).toBeLessThan(800);
    await page.locator('#consult-frog').click();
    await expect(page.locator('.use-frog')).toBeVisible();
    expect(
      (await page.locator('.use-frog').boundingBox())!.y +
        (await page.locator('.use-frog').boundingBox())!.height,
    ).toBeLessThan(800);
    await page.locator('.use-frog').click();
    await expect(page.locator('#result-album')).toBeVisible();
    expect(
      (await page.locator('#result-album').boundingBox())!.y +
        (await page.locator('#result-album').boundingBox())!.height,
    ).toBeLessThan(800);
    await page.locator('#result-album').click();
    await page.locator('#identity-C02').click();
    await expect(page.locator('.view-card .keepsake-art')).toBeVisible();
    await expect(page.locator('.view-card .card-engraving')).toBeVisible();
  });
}
