import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { changeLanguage } from '../browser-trial/game-fixture';
import { clickAccountAction } from './account-controls';
const dialog = (page: Page) => page.locator('[data-account-dialog][open]');
const root = resolve('docs/arcana/account-style-2026-10-18/evidence/linux');
const observations: unknown[] = [];
async function inspect(page: Page, name: string) {
  await expect(dialog(page)).toHaveAttribute('aria-busy', 'false');
  await dialog(page)
    .locator('.account-heading img')
    .evaluateAll((images) =>
      Promise.all(images.map((image) => (image as HTMLImageElement).decode().catch(() => {}))),
    );
  const result = await dialog(page).evaluate((element) => {
    const rgb = (value: string) => (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
    const luminance = (value: string) =>
      rgb(value)
        .map((n) => {
          const v = n / 255;
          return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        })
        .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    const contrast = (a: string, b: string) => {
      const x = luminance(a),
        y = luminance(b);
      return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    };
    const heading = element.querySelector('header')!,
      form = element.querySelector('form')!;
    const paper = getComputedStyle(form).backgroundColor;
    const controls = [...form.querySelectorAll('label,input,p,summary,button')].filter(
      (e) => !e.closest('details:not([open])') || e.tagName === 'SUMMARY',
    );
    const rect = (e: Element) => {
      const r = e.getBoundingClientRect();
      return {
        left: r.left,
        right: r.right,
        top: r.top,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
      };
    };
    return {
      dialog: rect(element),
      header: rect(heading),
      form: rect(form),
      viewport: { width: innerWidth, height: innerHeight },
      object: rect(heading.querySelector('img')!),
      overflow: element.scrollWidth > element.clientWidth + 1,
      textContrast: controls.map((e) => {
        const style = getComputedStyle(e);
        const background = e.matches('button[type=submit]') ? style.backgroundColor : paper;
        return { role: e.tagName, ratio: contrast(style.color, background) };
      }),
    };
  });
  observations.push({ name, project: test.info().project.name, ...result });
  expect(result.overflow).toBe(false);
  expect(result.dialog.left).toBeGreaterThanOrEqual(0);
  expect(result.dialog.right).toBeLessThanOrEqual(result.viewport.width);
  expect(result.dialog.height).toBeLessThan(660);
  if (result.viewport.width > 640) {
    expect(result.header.right).toBeLessThanOrEqual(result.form.left + 1);
    expect(result.object.width).toBeGreaterThanOrEqual(160);
  } else expect(result.header.bottom).toBeLessThanOrEqual(result.form.top + 1);
  for (const text of result.textContrast) expect(text.ratio).toBeGreaterThanOrEqual(4.5);
  await expect(dialog(page).locator('button[type=submit]')).toBeVisible();
  await expect(dialog(page).locator('button[type=submit]')).toBeEnabled();
}
async function capture(page: Page, name: string) {
  const selected: Record<string, string[]> = {
    'chromium-390-a80': ['register', 'verify', 'repair'],
    'chromium-1280-a80': ['login', 'reset'],
    'webkit-865-a80': ['verify-200'],
  };
  if (
    process.platform !== 'linux' ||
    process.env.ARCANA_CAPTURE_A80 !== '1' ||
    !selected[test.info().project.name]?.includes(name)
  )
    return;
  await mkdir(root, { recursive: true });
  await page.screenshot({
    path: resolve(root, `${test.info().project.name}-${name}.png`),
    fullPage: false,
  });
}
test.afterAll(async () => {
  await mkdir(root, { recursive: true });
  await writeFile(
    resolve(root, `${test.info().project.name}-observations.json`),
    JSON.stringify(observations, null, 2),
  );
});
test('A80 illustrated correspondence, writing contrast and accessible recovery', async ({
  page,
  viewport,
}) => {
  const wide = viewport?.width === 1280;
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(
    (pack) => localStorage.setItem('arcana.presentation.content-pack.v1', pack),
    wide ? 'arcana' : 'diagon-alley',
  );
  await page.goto('/');
  await expect(page.locator('[data-account-entry=register]')).toBeEnabled();
  if (wide) await changeLanguage(page, 'en');
  const entry = page.locator('[data-account-entry=register]');
  await entry.click();
  await inspect(page, 'register');
  await capture(page, 'register');
  await dialog(page).locator('input[name=email]').fill(`a80-${randomUUID()}@example.invalid`);
  await dialog(page).locator('button[type=submit]').click();
  await expect(dialog(page)).toHaveAttribute('data-account-step', 'verify');
  await inspect(page, 'verify');
  await capture(page, 'verify');
  if (viewport?.width === 865) {
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
    expect(await dialog(page).evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
    await capture(page, 'verify-200');
    await page.evaluate(() => (document.documentElement.style.fontSize = ''));
  }
  await dialog(page).locator('input[name=token]').fill('0'.repeat(64));
  await dialog(page).locator('input[name=password]').fill('A80 private fixture passphrase');
  await dialog(page).locator('button[type=submit]').click();
  await expect(dialog(page).getByRole('alert')).toBeVisible();
  await expect(
    dialog(page).getByRole('button', { name: /^(Solicitar otro código|Request another code)$/ }),
  ).toBeVisible();
  await capture(page, 'repair');
  await page.keyboard.press('Escape');
  await expect(entry).toBeFocused();
  await page.locator('[data-account-entry=login]').click();
  await inspect(page, 'login');
  await capture(page, 'login');
  await dialog(page).locator('summary').focus();
  await page.keyboard.press('Enter');
  await clickAccountAction(page, { name: /^(Olvidé mi contraseña|Forgot password)$/ });
  await clickAccountAction(page, { name: /^(Tengo el código|I have the code)$/ });
  await inspect(page, 'reset');
  await capture(page, 'reset');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-account-entry=login]')).toBeFocused();
  expect((await page.request.get('/api/state')).status()).toBe(401);
});
