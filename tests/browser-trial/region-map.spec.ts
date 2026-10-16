import { confirmEvent } from './route-helpers';
import { startExpedition } from './game-fixture';
import { changeLanguage } from './game-fixture';
import { expect, test } from './game-fixture';
test.use({ hasTouch: true });
for (const language of ['es', 'en'] as const)
  test(`A55 illustrated region and inspectable team ${language}`, async ({ page }) => {
    const en = language === 'en';
    const button = (es: string, english: string) =>
      page.getByRole('button', { name: en ? english : es, exact: true });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    if (en) await changeLanguage(page, 'en');
    await button('Comenzar ensayo local', 'Start local trial').click();
    const read = async () => (await (await page.request.get('/api/state')).json()).state;
    await expect(page.locator('.preparation-card').first()).toBeVisible();
    await expect(page.locator('[data-team-member]')).toHaveCount(0);
    await startExpedition(page, language);
    const portrait = page.locator('[data-team-member]').first();
    await expect(portrait).toBeVisible();
    const before = await read();
    await expect(page.locator('.team-unit-info')).toHaveCount(0);
    await portrait.hover();
    const card = page.getByRole('dialog', {
      name: en ? 'Alchemy Apprentice' : 'Aprendiz de Alquimia',
      exact: true,
    });
    await expect(card).toBeVisible();
    await expect(card).toContainText(en ? 'Owned copy' : 'Copia propia');
    await card.hover();
    await expect(card).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(card).toBeHidden();
    await portrait.focus();
    await expect(card).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(card).toBeHidden();
    await portrait.click();
    await expect(card).toBeVisible();
    await card.getByRole('button', { name: en ? 'Close' : 'Cerrar', exact: true }).click();
    await expect(card).toBeHidden();
    await expect(portrait).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(card).toBeVisible();
    await expect(card).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(card).toBeHidden();
    await expect(portrait).toBeFocused();
    await portrait.click();
    await expect(card).toBeVisible();
    await page.locator('.game-header h1').click();
    await expect(card).toBeHidden();
    expect(await read()).toEqual(before);
    await expect(page.locator('.region-map-art')).toBeHidden();
    const sceneSource = await page.locator('.region-map-art').getAttribute('src');
    await expect
      .poll(() =>
        page
          .locator('.game-world-backdrop')
          .evaluate((element) => getComputedStyle(element).backgroundImage),
      )
      .toContain(sceneSource!);
    await expect(page.locator('.region-map-art')).toHaveAttribute('data-art', 'scene.passage');
    await expect(page.locator('.branch-map')).toHaveAttribute('data-region', 'pasaje');
    await expect(page.locator('.map-scroll canvas')).toBeVisible();
    await page.locator('[data-node="pasaje:0:0"]').click();
    await confirmEvent(page, language);
    await page.locator('[data-node="pasaje:1:0"]').click();
    await confirmEvent(page, language);
    await expect(page.locator('[data-team-member]')).toHaveCount(3);
    const state = await read();
    await page.locator('[data-team-member]').nth(1).click();
    await expect(page.getByRole('dialog')).toContainText(en ? 'Temporary ally' : 'Aliado temporal');
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 320, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('[data-team-member]').last().tap();
    await expect(page.getByRole('dialog')).toHaveAttribute(
      'data-inspected-unit',
      state.exploration.run.members[2].unit.id,
    );
    const bounds = await page.getByRole('dialog').boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
    await page.keyboard.press('Escape');
    await page.reload();
    expect(await read()).toEqual(state);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
