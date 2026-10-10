import { test, expect, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const labels = {
  es: {
    enter: 'Entrar en Weasley',
    consult: 'Consultar la rana',
    use: 'Usar 1 rana',
    skip: 'Omitir',
    result: 'Tu recuerdo está a salvo',
    album: 'Ver en el álbum',
    settings: 'Ajustes',
    local: 'Guardado en este dispositivo',
    progress: '5 de 12 descubrimientos',
    back: 'Volver al callejón',
    family: 'Filtrar por familia',
    rarity: 'Filtrar por rareza',
    reset: 'Reiniciar demo',
    cancel: 'Cancelar',
    confirm: 'Confirmar sustitución',
    paste: 'O pegar una copia JSON',
    review: 'Revisar restauración',
  },
  en: {
    enter: 'Enter Weasley',
    consult: 'Inspect the frog',
    use: 'Use 1 Chocolate Frog',
    skip: 'Skip',
    result: 'Your keepsake is safe',
    album: 'View in album',
    settings: 'Settings',
    local: 'Saved on this device',
    progress: '5 of 12 discovered',
    back: 'Return to the alley',
    family: 'Filter by family',
    rarity: 'Filter by rarity',
    reset: 'Reset demo',
    cancel: 'Cancel',
    confirm: 'Confirm replacement',
    paste: 'Or paste a JSON backup',
    review: 'Review restoration',
  },
};
async function ready(page: Page, language: 'es' | 'en') {
  await page.goto('/');
  await page.locator('#language').selectOption(language);
  await expect(page.locator('html')).toHaveAttribute('lang', language);
  await expect(
    page.getByRole('button', { name: labels[language].enter, exact: true }),
  ).toBeVisible();
}
async function inspect(page: Page, l: typeof labels.es) {
  await page.getByRole('button', { name: l.enter, exact: true }).click();
  await page.locator('#consult-frog').click();
}
async function noOverflow(page: Page) {
  const outside = await page.evaluate(() =>
    [...document.querySelectorAll('body *')]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        return (
          r.width > 0 &&
          (r.right > innerWidth + 1 || r.left < -1) &&
          getComputedStyle(e).position !== 'absolute'
        );
      })
      .map((e) => ({
        tag: e.tagName,
        class: e.className,
        text: e.textContent?.slice(0, 80),
        right: e.getBoundingClientRect().right,
      })),
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    JSON.stringify(outside),
  ).toBe(true);
}
for (const language of ['es', 'en'] as const) {
  const l = labels[language];
  test(`AC01–10 mobile journey ${language}, reviewed screenshots and focus`, async ({
    page,
  }, info) => {
    await ready(page, language);
    await noOverflow(page);
    await mkdir('docs/navigation-i1/screenshots', { recursive: true });
    const screenshot = async (name: string) => {
      if (info.project.name !== 'chromium') return;
      await page.evaluate(async () => {
        await Promise.all(
          document
            .getAnimations()
            .filter((a) => a.effect?.getTiming().iterations !== Infinity)
            .map((a) => a.finished.catch(() => undefined)),
        );
      });
      const width = page.viewportSize()!.width;
      await page.screenshot({
        path: `docs/navigation-i1/screenshots/${language}-${name}-${width}.png`,
        fullPage: true,
      });
      await page.screenshot({
        path: `docs/navigation-i1/screenshots/${language}-${name}-${width}-viewport.png`,
      });
    };
    await screenshot('alley');
    await page.locator('#list-shop').click();
    await page.getByRole('button', { name: '← ' + l.back, exact: true }).click();
    await expect(page.locator('#list-shop')).toBeFocused();
    await page.getByRole('button', { name: l.enter, exact: true }).press('Enter');
    await expect(page.getByRole('heading', { name: 'Weasley', exact: true })).toBeFocused();
    await screenshot('shop');
    await page.locator('#consult-frog').click();
    await expect(page.getByRole('button', { name: l.use, exact: true })).toBeEnabled();
    await expect(page.locator('.odds li')).toHaveCount(6);
    await screenshot('detail');
    await noOverflow(page);
    await page.getByRole('button', { name: l.use, exact: true }).click();
    await page.getByRole('button', { name: l.skip, exact: true }).click();
    await expect(page.getByRole('heading', { name: l.result })).toBeVisible();
    const result = await page.locator('.keepsake-card h2').innerText();
    await screenshot('result');
    await page.getByRole('button', { name: l.album, exact: true }).click();
    await expect(page.getByText(l.progress, { exact: true })).toBeVisible();
    await expect(page.locator('.album-entry')).toHaveCount(12);
    await screenshot('album');
    await page.getByLabel(l.family).selectOption('flavour');
    await expect(page.locator('.album-entry')).toHaveCount(4);
    await expect(page.getByText(l.progress, { exact: true })).toBeVisible();
    await page.getByLabel(l.rarity).selectOption('R03');
    await expect(page.locator('.album-entry')).toHaveCount(1);
    await page.locator('.album-entry').click();
    await expect(page.locator('.keepsake-card')).toBeVisible();
    await page
      .getByRole('button', { name: language === 'es' ? '← Álbum' : '← Album', exact: true })
      .click();
    await expect(page.locator('#identity-S04')).toBeFocused();
    await page.locator('#album-to-alley').click();
    await expect(page.locator('#enter-shop')).toBeFocused();
    await page.reload();
    await page.locator('#enter-shop').click();
    await page.locator('#consult-frog').click();
    await expect(page.getByRole('button', { name: l.use, exact: true })).toBeDisabled();
    await page
      .getByRole('button', {
        name: language === 'es' ? 'Ver el resultado guardado' : 'View saved result',
      })
      .click();
    await expect(page.locator('.keepsake-card h2')).toHaveText(result);
    await page.setViewportSize({ width: 320, height: 844 });
    await noOverflow(page);
    await screenshot('result');
  });
  test(`AC06/09 changing language during ritual and reload preserves result ${language}`, async ({
    page,
  }) => {
    await ready(page, language);
    await inspect(page, l);
    await page.getByRole('button', { name: l.use, exact: true }).click();
    await expect(page.getByRole('button', { name: l.skip, exact: true })).toBeVisible();
    const other = language === 'es' ? 'en' : 'es';
    await page.locator('#language').selectOption(other);
    await page.reload();
    await expect(page.getByRole('heading', { name: labels[other].result })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', other);
    await expect(page.locator('.copy-count')).toHaveText(other === 'es' ? '1 copia' : '1 copy');
  });
  test(`AC10 reduced motion, artwork absent and 320px / enlarged text ${language}`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 320, height: 844 });
    await ready(page, language);
    await page.addStyleTag({ content: '.artwork{display:none!important} html{font-size:200%}' });
    await noOverflow(page);
    await inspect(page, l);
    await page.getByRole('button', { name: l.use, exact: true }).click();
    await expect(page.getByRole('heading', { name: l.result })).toBeVisible();
    await expect(page.getByRole('button', { name: l.skip, exact: true })).toHaveCount(0);
    await noOverflow(page);
    if (info.project.name === 'chromium')
      await page.screenshot({
        path: `docs/navigation-i1/screenshots/${language}-reduced-result-320-200percent.png`,
        fullPage: true,
      });
    await page.getByRole('button', { name: l.album, exact: true }).click();
    await expect(page.getByText(l.progress, { exact: true })).toBeVisible();
    await noOverflow(page);
    if (info.project.name === 'chromium')
      await page.screenshot({
        path: `docs/navigation-i1/screenshots/${language}-reduced-album-320-200percent.png`,
        fullPage: true,
      });
  });
  test(`AC12 export, invalid import, cancel, valid restore and new run ${language}`, async ({
    page,
  }) => {
    await ready(page, language);
    await page.getByRole('button', { name: l.settings, exact: true }).click();
    const run = await page.locator('.run-id').innerText();
    const downloadPromise = page.waitForEvent('download');
    await page
      .getByRole('button', {
        name: language === 'es' ? 'Exportar partida JSON' : 'Export game JSON',
      })
      .click();
    const download = await downloadPromise;
    const path = await download.path();
    expect(path).toBeTruthy();
    await page.getByLabel(l.paste).fill('{bad');
    await page.getByRole('button', { name: l.review }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.locator('.run-id')).toHaveText(run);
    await page.getByRole('button', { name: l.reset, exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: l.cancel, exact: true }).click();
    await expect(page.locator('.run-id')).toHaveText(run);
    await page.getByRole('button', { name: l.reset, exact: true }).click();
    await page.getByRole('button', { name: l.confirm, exact: true }).click();
    await page.getByRole('button', { name: l.settings, exact: true }).click();
    await expect(page.locator('.run-id')).not.toHaveText(run);
    await page.locator('input[type=file]').setInputFiles(path!);
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: l.confirm, exact: true }).click();
    await page.getByRole('button', { name: l.settings, exact: true }).click();
    await expect(page.locator('.run-id')).toHaveText(run);
  });
  test(`AC07 aborted native write shows error and no fictional success ${language}`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const original = IDBObjectStore.prototype.put;
      let failed = false;
      IDBObjectStore.prototype.put = function (value, key) {
        if (!failed && value?.state?.operations?.length) {
          failed = true;
          this.transaction.abort();
          throw new DOMException('Injected write abort', 'AbortError');
        }
        return original.call(this, value, key);
      };
    });
    await ready(page, language);
    await inspect(page, l);
    await page.getByRole('button', { name: l.use, exact: true }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('button', { name: l.skip })).toHaveCount(0);
    await expect(page.locator('.stock')).toContainText('1');
    await page.getByRole('alert').getByRole('button').click();
    await page.getByRole('button', { name: l.use, exact: true }).click();
    await expect(page.getByRole('button', { name: l.skip, exact: true })).toBeVisible();
  });
}
for (const delay of [100, 350, 700, 1100, 1450]) {
  test(`AC06 skip from confirmed phase at ${delay}ms uses the committed result`, async ({
    page,
  }) => {
    await ready(page, 'en');
    await inspect(page, labels.en);
    const clockStart = new Date();
    await page.clock.install({ time: clockStart });
    await page.clock.pauseAt(new Date(clockStart.getTime() + 60000));
    await page.getByRole('button', { name: labels.en.use, exact: true }).click();
    await expect(page.getByRole('button', { name: 'Skip', exact: true })).toBeVisible();
    await page.clock.runFor(delay);
    await page.getByRole('button', { name: 'Skip', exact: true }).click();
    await expect(page.getByRole('heading', { name: labels.en.result })).toBeVisible();
    const result = await page.locator('.keepsake-card h2').innerText();
    await page.reload();
    const recoveredResult = page.getByRole('heading', { name: labels.en.result });
    await expect(recoveredResult.or(page.locator('#enter-shop'))).toBeVisible();
    // Reload may precede the separate seen receipt; both recovery routes preserve delivery.
    if (await recoveredResult.isVisible()) {
      await expect(page.locator('.keepsake-card h2')).toHaveText(result);
      await page.getByRole('button', { name: labels.en.back, exact: true }).click();
    }
    await page.locator('#enter-shop').click();
    await page.locator('#consult-frog').click();
    await page.getByRole('button', { name: 'View saved result' }).click();
    await expect(page.locator('.keepsake-card h2')).toHaveText(result);
  });
}
for (const language of ['es', 'en'] as const) {
  test(`AC11 invalid catalogue at startup reports a bilingual error ${language}`, async ({
    page,
  }) => {
    await page.route('**/src/content/welcome-table.json*', (r) =>
      r.fulfill({
        contentType: 'application/javascript',
        body: 'export default {version:1,catalogVersion:1,entries:[]};',
      }),
    );
    await page.goto('/');
    await page.locator('#language').selectOption(language);
    await expect(page.getByRole('alert')).toContainText(
      language === 'es' ? 'no son válidos' : 'is invalid',
    );
    await expect(page.getByRole('button', { name: labels[language].use })).toHaveCount(0);
  });
}
test('AC04/06 timed ritual settles automatically after the committed delivery', async ({
  page,
}, info) => {
  await ready(page, 'es');
  await inspect(page, labels.es);
  await page.getByRole('button', { name: labels.es.use, exact: true }).click();
  await expect(page.getByRole('button', { name: 'Omitir', exact: true })).toBeVisible();
  await page.waitForTimeout(650);
  if (info.project.name === 'chromium')
    await page.screenshot({ path: 'docs/navigation-i1/screenshots/es-ritual-jump-390.png' });
  await expect(page.getByRole('heading', { name: labels.es.result })).toBeVisible();
  await expect(page.locator('.copy-count')).toHaveText('1 copia');
});
for (const language of ['es', 'en'] as const) {
  test(`AC07 storage unavailable at startup keeps the bilingual recovery UI ${language}`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      IDBFactory.prototype.open = function () {
        throw new DOMException('Injected storage denial', 'SecurityError');
      };
    });
    await page.goto('/');
    await page.locator('#language').selectOption(language);
    await expect(page.getByRole('alert')).toContainText(
      language === 'es' ? 'No se pudo completar el guardado' : 'The save could not be completed',
    );
    await expect(page.locator('.stock')).toHaveCount(0);
    await expect(page.getByRole('button', { name: labels[language].use })).toHaveCount(0);
  });
}
for (const language of ['es', 'en'] as const) {
  test(`AC07/09 first recovery respects the language selected during storage failure ${language}`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const original = IDBFactory.prototype.open;
      let first = true;
      IDBFactory.prototype.open = function (...args) {
        if (first) {
          first = false;
          throw new DOMException('Injected once', 'SecurityError');
        }
        return original.apply(this, args);
      };
    });
    await page.goto('/');
    await expect(page.getByRole('alert')).toBeVisible();
    await page.locator('#language').selectOption(language);
    await page.getByRole('alert').getByRole('button').click();
    await expect(
      page.getByRole('button', { name: labels[language].enter, exact: true }),
    ).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', language);
  });
}
