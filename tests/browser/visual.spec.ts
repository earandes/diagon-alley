import { test, expect } from '@playwright/test';
for (const language of ['es', 'en'] as const) {
  test(`four illustrated consultations preserve stock, collection and focus ${language}`, async ({
    page,
  }) => {
    await page.goto('/');
    await page.locator('#language').selectOption(language);
    await page.locator('#enter-shop').click();
    await expect(page.locator('.shop-product')).toHaveCount(4);
    for (const id of ['beans', 'O01', 'O02']) {
      await page.locator('#consult-' + id).click();
      await expect(page.locator('.product-detail')).toBeVisible();
      await expect(page.locator('.use-frog')).toHaveCount(0);
      await page.locator('#product-back').click();
      await expect(page.locator('#consult-' + id)).toBeFocused();
    }
    await page.locator('#product-list summary').click();
    await page.locator('#list-O01').click();
    await page.locator('#product-back').click();
    await expect(page.locator('#list-O01')).toBeFocused();
    await page.locator('#consult-frog').click();
    await expect(page.locator('.stock')).toContainText('1');
    await expect(page.locator('.odds li')).toHaveCount(6);
    await page
      .getByRole('button', {
        name: language === 'es' ? '← Volver a Weasley' : '← Return to Weasley',
        exact: true,
      })
      .click();
    await page.locator('#shop-album').click();
    await expect(
      page.getByText(language === 'es' ? '4 de 12 descubrimientos' : '4 of 12 discovered', {
        exact: true,
      }),
    ).toBeVisible();
  });
  test(`missing raster art retains all four actions and actual result ${language}`, async ({
    page,
  }) => {
    await page.route('**/art/*.webp', (r) => r.abort());
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('#language').selectOption(language);
    await page.locator('#enter-shop').click();
    await expect(page.locator('.shop-product')).toHaveCount(4);
    await page.locator('#consult-frog').click();
    await page.locator('.use-frog').click();
    await expect(page.locator('.copy-count')).toHaveText(language === 'es' ? '1 copia' : '1 copy');
    await expect(page.locator('.keepsake-card h2')).not.toBeEmpty();
  });
}
for (const [ticket, id, name] of [
  [0, 'C01', 'Albus Dumbledore'],
  [14, 'C02', 'Minerva McGonagall'],
  [28, 'C03', 'Filius Flitwick'],
  [33, 'O03', 'Portable Swamp'],
  [38, 'C04', 'Pomona Sprout'],
  [39, 'O04', 'Fireworks'],
] as const) {
  test(`controlled artwork fixture ${id} displays its saved identity, never a fixed Dumbledore`, async ({
    page,
  }) => {
    await page.addInitScript((ticket) => {
      const original = crypto.getRandomValues.bind(crypto);
      crypto.getRandomValues = function <T extends ArrayBufferView>(array: T): T {
        if (array instanceof Uint32Array && array.length === 1) {
          array[0] = ticket;
          return array;
        }
        return original(array) as T;
      };
    }, ticket);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('#language').selectOption('en');
    await page.locator('#enter-shop').click();
    await page.locator('#consult-frog').click();
    await page.locator('.use-frog').click();
    await expect(page.locator('.keepsake-card h2')).toHaveText(name);
    const dumbledorePortrait = page.locator(
      '.result-keepsake .ritual-card image[href="/art/revealed-v1.webp"]',
    );
    await expect(dumbledorePortrait).toHaveCount(id === 'C01' ? 1 : 0);
  });
}
for (const language of ['es', 'en'] as const) {
  test(`language chosen during delayed initialization persists ${language}`, async ({ page }) => {
    await page.addInitScript((language) => {
      Object.defineProperty(navigator, 'language', {
        value: language === 'es' ? 'en-GB' : 'es-ES',
      });
      const original = IDBOpenDBRequest.prototype.addEventListener;
      IDBOpenDBRequest.prototype.addEventListener = function (
        ...args: Parameters<typeof original>
      ) {
        const [type, listener, options] = args;
        if (type !== 'success' || !listener) return original.apply(this, args);
        return original.call(
          this,
          type,
          (event) =>
            setTimeout(() => {
              if (typeof listener === 'function') listener.call(this, event);
              else listener.handleEvent(event);
            }, 1000),
          options,
        );
      };
    }, language);
    await page.goto('/');
    await page.locator('#language').selectOption(language);
    await expect(page.locator('#enter-shop')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await page.reload();
    await expect(page.locator('#enter-shop')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', language);
  });
}
test('a delayed pre-change refresh cannot overwrite a newer language snapshot', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = IDBObjectStore.prototype.get;
    let delayNextRead = false;
    window.addEventListener('test-delay-refresh', () => {
      delayNextRead = true;
    });
    IDBObjectStore.prototype.get = function (key) {
      const request = original.call(this, key);
      if (!delayNextRead) return request;
      delayNextRead = false;
      const listen = request.addEventListener.bind(request);
      request.addEventListener = function (...args: Parameters<typeof listen>) {
        const [type, listener, options] = args;
        if (type !== 'success' || !listener) return listen(type, listener, options);
        return listen(
          type,
          (event) =>
            setTimeout(() => {
              if (typeof listener === 'function') listener.call(request, event);
              else listener.handleEvent(event);
            }, 1200),
          options,
        );
      };
      return request;
    };
  });
  await page.goto('/');
  await expect(page.locator('#enter-shop')).toBeVisible();
  await page.locator('#language').selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.evaluate(() => {
    window.dispatchEvent(new Event('test-delay-refresh'));
    window.dispatchEvent(new Event('focus'));
  });
  await page.locator('#language').selectOption('es');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await page.waitForTimeout(1500); // Deliberately wait for the injected stale response.
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});
