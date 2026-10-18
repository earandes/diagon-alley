import { openAlbumFilters } from './game-fixture';
import { changeLanguage } from './game-fixture';
import { expect, test } from './game-fixture';
for (const language of ['es', 'en'] as const) {
  test(`A54 illustrated controls, preview and reduced motion ${language}`, async ({ page }) => {
    const en = language === 'en';
    const button = (es: string, english: string) =>
      page.getByRole('button', { name: en ? english : es, exact: true });
    const read = async () => (await (await page.request.get('/api/state')).json()).state;
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    if (en) await changeLanguage(page, 'en');
    await button('Jugar como invitado', 'Play as guest').click();
    await expect(page.locator('input, select, textarea')).toHaveCount(0);
    await button('Bazar', 'Bazaar').click();
    await button('Taller de Varitas', 'Wand Workshop').click();
    const before = await read();
    const wood = page.getByRole('group', { name: en ? 'Wood' : 'Madera', exact: true });
    const willow = wood.locator('[data-visual-value="willow"]');
    await willow.focus();
    await page.keyboard.press('Enter');
    await expect(willow).toHaveAttribute('aria-pressed', 'true');
    await expect(willow.locator('img')).not.toHaveCount(0);
    expect(await read()).toEqual(before);
    expect(await willow.evaluate((el) => el.getAnimations().length)).toBe(0);
    await expect(page.locator('input, select, textarea')).toHaveCount(0);
    await button('Cromodex', 'Chromodex').click();
    await openAlbumFilters(page);
    await expect(page.locator('input, select, textarea')).toHaveCount(0);
    await page
      .getByRole('group', { name: en ? 'Discovery filter' : 'Filtro de descubrimiento' })
      .locator('[data-visual-value="discovered"]')
      .click();
    await expect(page.locator('.album .card')).toHaveCount(1);
    expect(await read()).toEqual(before);
    await page.setViewportSize({ width: 320, height: 844 });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test('A54 motion preference updates already mounted choices and missing art retains actions', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('**/*.{webp,svg}', (route) => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Jugar como invitado', exact: true }).click();
  await page.getByRole('button', { name: 'Bazar', exact: true }).click();
  await page.getByRole('button', { name: 'Taller de Varitas', exact: true }).click();
  await page.getByRole('button', { name: 'Ajustes', exact: true }).click();
  await page
    .getByRole('button', { name: 'Reducir movimiento por mi elección', exact: true })
    .click();
  await expect(page.locator('.arcana-shell')).toHaveAttribute('data-reduced', 'true');
  await page.getByRole('dialog').getByRole('button', { name: 'Cerrar', exact: true }).click();
  const willow = page
    .getByRole('group', { name: 'Madera', exact: true })
    .locator('[data-visual-value="willow"]');
  await willow.click();
  await expect(willow).toHaveAttribute('aria-pressed', 'true');
  await expect(willow.getByText('Sauce', { exact: true })).toBeVisible();
  expect(await willow.evaluate((el) => el.getAnimations().length)).toBe(0);
  await page.reload();
  await expect(page.locator('.arcana-shell')).toHaveAttribute('data-reduced', 'true');
});
