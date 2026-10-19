import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

test.use({ baseURL: 'http://127.0.0.1:5622' });
const fixture = '/tests/browser-experience-clarity/collection-supplies-a92.html';
const pairs = [
  ['es', 'diagon-alley'],
  ['en', 'diagon-alley'],
  ['es', 'arcana'],
  ['en', 'arcana'],
] as const;
async function sample(page: import('@playwright/test').Page, name: string) {
  if (
    process.platform !== 'linux' ||
    process.env.ARCANA_CAPTURE_A92 !== '1' ||
    test.info().project.name !== 'chromium-390-a92'
  )
    return;
  const directory = resolve(
    process.env.A92_EVIDENCE_ROOT ?? 'docs/arcana/experience-clarity-2026-10-19/evidence/linux',
  );
  await mkdir(directory, { recursive: true });
  await page.screenshot({ path: resolve(directory, `${name}.png`) });
}
for (const [lang, pack] of pairs) {
  test(`A92 collection keeps identity, spread, filters and focus ${lang}/${pack}`, async ({
    page,
  }) => {
    // These samples evaluate resting composition, not a transient selection animation.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${fixture}?lang=${lang}&pack=${pack}`);
    const panel = page.locator('.collection-panel');
    await expect(panel.locator('progress')).toHaveAttribute('value', '3');
    await expect(panel.locator('progress')).toHaveAttribute('max', '34');
    await expect(panel.locator('.collection-archive-count')).toContainText('1');
    const capacity = (page.viewportSize()?.width ?? 0) >= 820 ? 8 : 4;
    await expect(panel.locator('[data-collection-id]')).toHaveCount(capacity);
    const archived = panel.locator('[data-collection-id="a92-archived"]');
    await expect(archived.locator('.card-portrait[data-art="card.back"]')).toBeVisible();
    await expect
      .poll(async () => (await archived.locator('.album-card-inspect').boundingBox())?.height ?? 0)
      .toBeGreaterThan(100);
    const next = page.getByRole('button', {
      name: lang === 'es' ? 'Página siguiente' : 'Next page',
      exact: true,
    });
    await next.click();
    const id = await panel
      .locator('[data-collection-id]')
      .first()
      .getAttribute('data-collection-id');
    const inspect = panel.locator('[data-collection-id]').first().getByRole('button');
    await inspect.click();
    const folio = page.locator('dialog.album-card-folio[open]');
    await expect(folio).toBeVisible();
    await expect(folio.locator('.album-identity-details')).not.toHaveAttribute('open', '');
    await folio.locator('.album-identity-details > summary').click();
    await expect(folio.locator('.card-stars')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(folio).toHaveCount(0);
    await expect(inspect).toBeFocused();
    await expect(panel.locator('[data-collection-id]').first()).toHaveAttribute(
      'data-collection-id',
      id!,
    );
    await panel.locator('.album-filter-drawer > summary').click();
    await panel.locator('.classification-choices button').last().click();
    await expect(panel.locator('.album-active-filters')).toBeVisible();
    await panel
      .getByRole('button', {
        name: lang === 'es' ? 'Limpiar filtros' : 'Clear filters',
        exact: true,
      })
      .click();
    await expect(panel.locator('.album-active-filters')).toHaveCount(0);
    await expect(panel.locator('progress')).toHaveAttribute('value', '3');
    await expect(panel.locator('[data-collection-id]')).toHaveCount(capacity);
    await panel.locator('[data-collection-id]').first().getByRole('button').click();
    if (lang === 'es' && pack === 'diagon-alley') await sample(page, 'portrait-first-folio');
    await page.locator('.album-copy-details > summary').click();
    await expect(page.locator('.album-copy-tokens button')).toHaveCount(12);
    await page.locator('.album-copy-tokens button').nth(3).click();
    await expect(page.locator('.album-copy-tokens button').nth(3)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page
      .getByRole('button', { name: lang === 'es' ? 'Cerrar' : 'Close', exact: true })
      .click();
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      .toBe(true);
    if (
      process.env.ARCANA_CAPTURE_A92 === '1' &&
      lang === 'es' &&
      ['chromium-390-a92', 'chromium-1280-a92'].includes(test.info().project.name)
    ) {
      await page.evaluate(async () => {
        document.documentElement.style.fontSize = '';
        await document.fonts.ready;
      });
      const discovered = panel.locator('[data-collection-discovered="true"]');
      for (const card of await discovered.all()) {
        await expect(card.locator('.rarity-badge > span')).toHaveText(
          lang === 'es' ? 'Común' : 'Common',
        );
        await expect(card.locator('.card-ownership')).toBeVisible();
        await expect
          .poll(async () => (await card.locator('.card-ownership').boundingBox())?.height ?? 0)
          .toBeGreaterThan(5);
      }
      const directory = resolve(
        process.env.A92_EVIDENCE_ROOT ?? 'docs/arcana/experience-clarity-2026-10-19/evidence/linux',
      );
      await mkdir(directory, { recursive: true });
      await page.screenshot({
        path: resolve(directory, `${test.info().project.name}-${pack}-collection.png`),
        fullPage: true,
      });
    }
  });
  test(`A92 stock100 stays bounded and draft keeps unit identity ${lang}/${pack}`, async ({
    page,
  }) => {
    await page.goto(`${fixture}?view=beans&stock=100&lang=${lang}&pack=${pack}`);
    const read = () => page.evaluate(() => JSON.parse(window.__a92Supplies.read()));
    const before = await read();
    await expect(page.locator('.bean-stock-jar')).toHaveCount(1);
    await expect(page.locator('.bean-stock-page')).toHaveCount(2);
    await expect(page.locator('.bean-stock-object')).toHaveAttribute('data-bean-stock', '100');
    if (lang === 'es' && pack === 'diagon-alley') await sample(page, 'bounded-stock100');
    const next = page.getByRole('button', {
      name: lang === 'es' ? 'Tarro siguiente' : 'Next jar',
      exact: true,
    });
    await next.click();
    await page.locator('[data-bean-unit="a89-copy-0"]').click();
    expect((await read()).draft).toEqual([{ beanId: 'a92-jar-1', unitId: 'a89-copy-0' }]);
    await expect(page.locator('[data-bean-unit="a89-copy-1"]')).toBeDisabled();
    await page.locator('[data-bean-unit="a89-copy-2"]').click();
    expect((await read()).draft).toEqual([{ beanId: 'a92-jar-1', unitId: 'a89-copy-2' }]);
    await next.click();
    await page.locator('.bean-assigned-bookmarks button').click();
    await expect(page.locator('.bean-stock-jar')).toHaveAttribute('data-bean-id', 'a92-jar-1');
    await page.locator('[data-bean-unit="a89-copy-2"]').click();
    expect((await read()).draft).toEqual([]);
    expect((await read()).game).toEqual(before.game);
    await page.locator('[data-bean-unit="a89-copy-0"]').click();
    await page.locator('[data-a92-cancel]').click();
    expect((await read()).draft).toEqual([]);
    expect((await read()).game).toEqual(before.game);
    await page.locator('[data-bean-unit="a89-copy-0"]').click();
    await page.evaluate(() => window.__a92Supplies.invalidate());
    await expect(page.locator('.bean-assigned-bookmarks button')).toHaveCount(0);
    await page.evaluate(() => window.__a92Supplies.selectStock(0));
    await expect(page.locator('.bean-stock-jar')).toHaveCount(0);
    await expect(page.locator('.empty-bean-tray')).toBeVisible();
  });
}
