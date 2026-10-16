import { startExpedition } from './game-fixture';
import { changeLanguage } from './game-fixture';
import { reachNode, confirmEvent } from './route-helpers';
import { test, expect } from './game-fixture';
for (const language of ['es', 'en'] as const)
  test(`local ARCANA journey and reload in ${language}`, async ({ page }) => {
    await page.goto('/');
    if (language === 'en') await changeLanguage(page, 'en');
    await page
      .getByRole('button', {
        name: language === 'es' ? 'Comenzar ensayo local' : 'Start local trial',
        exact: true,
      })
      .click();
    await expect(page.locator('.preparation-card').first()).toBeVisible();
    await startExpedition(page, language);
    const duelId = await reachNode(page, 'duel', language);
    await page.locator(`[data-node="${duelId}"]`).click();
    await confirmEvent(page, language);
    await expect(
      page.getByRole('heading', { name: language === 'es' ? 'Arena de Combate' : 'Combat Arena' }),
    ).toBeVisible();
    await page
      .getByRole('button', {
        name: language === 'es' ? 'Volver al mapa' : 'Back to map',
        exact: true,
      })
      .click();
    await page
      .getByRole('button', { name: language === 'es' ? 'Bazar' : 'Bazaar', exact: true })
      .click();
    await expect(page).toHaveURL(/#\/shop$/);
    const activeNavigation = page.getByRole('button', {
      name: language === 'es' ? 'Bazar' : 'Bazaar',
      exact: true,
    });
    await activeNavigation.hover();
    const activeContrast = await activeNavigation.evaluate((element) => {
      const css = getComputedStyle(element);
      const luminance = (color: string) =>
        color
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number)
          .map((v) => {
            const c = v / 255;
            return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
          })
          .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
      const a = luminance(css.color),
        b = luminance(css.backgroundColor);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    });
    expect(activeContrast).toBeGreaterThanOrEqual(4.5);

    const beforeNavigation = (await (await page.request.get('/api/state')).json()).state;
    await page
      .getByRole('button', {
        name: language === 'es' ? 'Taller de Varitas' : 'Wand Workshop',
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(/#\/shop\/workshop$/);
    await page.reload();
    await expect(
      page.getByRole('heading', {
        name: language === 'es' ? 'Taller de Varitas' : 'Wand Workshop',
        exact: true,
      }),
    ).toBeVisible();
    await page
      .getByRole('button', { name: language === 'es' ? 'Cromodex' : 'Chromodex', exact: true })
      .click();
    await expect(page).toHaveURL(/#\/collection$/);
    await page.goBack();
    await expect(page).toHaveURL(/#\/shop\/workshop$/);
    await expect(page.locator('#content')).toBeFocused();
    await page.goForward();
    await expect(page).toHaveURL(/#\/collection$/);
    expect((await (await page.request.get('/api/state')).json()).state).toEqual(beforeNavigation);
    await page
      .getByRole('button', { name: language === 'es' ? 'Bazar' : 'Bazaar', exact: true })
      .click();
    await page
      .getByRole('button', {
        name: language === 'es' ? 'La Confitería Encantada' : 'The Enchanted Confectionery',
        exact: true,
      })
      .click();

    await page
      .getByRole('button', {
        name: language === 'es' ? 'Comprar y abrir 1 · 10 Coronas' : 'Buy and open 1 · 10 Crowns',
        exact: true,
      })
      .click();
    await expect(
      page.getByRole('heading', {
        name: language === 'es' ? 'Cromo confirmado' : 'Confirmed card',
      }),
    ).toBeVisible();
    await expect(page.locator('[data-opening-state]')).toHaveAttribute(
      'data-opening-state',
      'result',
      { timeout: 10_000 },
    );
    const saved = (await (await page.request.get('/api/state')).json()).state;
    const receipt = saved.receipts.find((r: { kind: string }) => r.kind === 'buy-open-toad');
    const stars = receipt.wizard.stars;
    expect(stars).toBeGreaterThanOrEqual(1);
    expect(stars).toBeLessThanOrEqual(5);
    const rating =
      language === 'es'
        ? `${stars} ${stars === 1 ? 'estrella' : 'estrellas'}`
        : `${stars} ${stars === 1 ? 'star' : 'stars'}`;
    await expect(
      page.locator('.holographic-card').getByText(rating, { exact: true }),
    ).toBeVisible();
    await page.setViewportSize({ width: 320, height: 844 });
    await expect(page.locator('[data-opening-state]')).toHaveAttribute(
      'data-opening-state',
      'result',
    );
    await expect(
      page.getByRole('button', {
        name: language === 'es' ? 'Omitir animación' : 'Skip animation',
        exact: true,
      }),
    ).toHaveCount(0);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      .toBe(true);
    const navigationFont = await page
      .locator('nav button')
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    expect(
      await page
        .locator('nav button')
        .first()
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    ).toBeGreaterThanOrEqual(navigationFont * 1.99);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      .toBe(true);
    await page.reload();
    await page
      .getByRole('button', { name: language === 'es' ? 'Cromodex' : 'Chromodex', exact: true })
      .click();
    await expect(
      page.getByText(language === 'es' ? '2 copias guardadas' : '2 saved copies', { exact: true }),
    ).toBeVisible();
    const article = page.locator('.album article').filter({
      has: page.getByRole('heading', { name: receipt.wizard.name[language], exact: true }),
    });
    await expect(article.getByText(rating, { exact: true }).first()).toBeVisible();
    await article.locator('.album-card-inspect').click();
    await expect(
      page.locator('.album-card-folio').getByText(rating, { exact: true }),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await changeLanguage(page, language === 'es' ? 'en' : 'es');
    const otherLanguage = language === 'es' ? 'en' : 'es';
    const otherArticle = page.locator('.album article').filter({
      has: page.getByRole('heading', { name: receipt.wizard.name[otherLanguage], exact: true }),
    });
    await otherArticle.locator('.album-card-inspect').click();
    const otherRating =
      language === 'es'
        ? `${stars} ${stars === 1 ? 'star' : 'stars'}`
        : `${stars} ${stars === 1 ? 'estrella' : 'estrellas'}`;
    await expect(
      page.locator('.album-card-folio').getByText(otherRating, { exact: true }),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await changeLanguage(page, language);
    expect((await (await page.request.get('/api/state')).json()).state).toEqual(saved);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
  });
