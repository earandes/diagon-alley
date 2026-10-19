import { test, expect } from '@playwright/test';
const base = 'http://127.0.0.1:5622/tests/browser-experience-clarity/collection-supplies-a92.html';
for (const [lang, pack] of [
  ['es', 'diagon-alley'],
  ['en', 'arcana'],
] as const) {
  test(`A92 ${lang}/${pack} books retain a visible close with all artwork missing`, async ({
    page,
  }) => {
    await page.route('**/*.{svg,webp,png}', (route) => route.abort('failed'));
    await page.goto(`${base}?view=books&lang=${lang}&pack=${pack}`);
    const book = page.getByRole('button', {
      name: lang === 'es' ? 'Libro de prueba' : 'Test book',
      exact: true,
    });
    await book.click();
    const close = page.getByRole('button', {
      name: lang === 'es' ? 'Cerrar libro' : 'Close book',
      exact: true,
    });
    await expect(close).toBeVisible();
    const shape = await close
      .locator('svg')
      .evaluate((e) => ({
        width: e.getBoundingClientRect().width,
        height: e.getBoundingClientRect().height,
      }));
    expect(shape.width).toBeGreaterThanOrEqual(20);
    expect(shape.height).toBeGreaterThanOrEqual(20);
    await close.click();
    await expect(book).toBeFocused();
    await book.click();
    await page.keyboard.press('Escape');
    await expect(book).toBeFocused();
  });
  test(`A92 ${lang}/${pack} seasonal error is localized and consultation remains reversible`, async ({
    page,
  }) => {
    await page.goto(`${base}?view=books&lang=${lang}&pack=${pack}&error=EVENT_UNAVAILABLE`);
    const open = page.locator('[data-seasonal-open]');
    await open.click();
    const dialog = page.locator('[data-seasonal-dialog][open]');
    await expect(dialog.getByRole('alert')).toContainText(
      lang === 'es' ? 'disponibilidad' : 'availability',
    );
    await expect(dialog.getByRole('alert')).not.toContainText('EVENT_UNAVAILABLE');
    await page.keyboard.press('Escape');
    await expect(open).toBeFocused();
  });
}
