import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test, expect, type Page, type Locator } from '@playwright/test';
import { changeLanguage } from '../browser-trial/game-fixture';
const root = resolve('docs/arcana/account-identity-art-2026-10-18/evidence/linux');
const measurements: unknown[] = [];
const dialog = (page: Page) => page.locator('[data-account-dialog][open]');
async function loaded(image: Locator) {
  await expect(image).toBeVisible();
  await image.evaluate((element) => (element as HTMLImageElement).decode());
  const value = await image.evaluate((element) => {
    const img = element as HTMLImageElement,
      rect = img.getBoundingClientRect();
    return {
      id: img.dataset.art,
      width: rect.width,
      height: rect.height,
      naturalWidth: img.naturalWidth,
      complete: img.complete,
    };
  });
  expect(value.complete).toBe(true);
  expect(value.naturalWidth).toBe(512);
  measurements.push({ project: test.info().project.name, ...value });
}
async function capture(page: Page, name: string) {
  const selected: Record<string, string[]> = {
    'chromium-390-a81': ['welcome', 'register', 'login'],
    'chromium-1280-a81': ['welcome', 'register', 'login'],
    'webkit-865-a81': ['login-200'],
  };
  if (
    process.platform !== 'linux' ||
    process.env.ARCANA_CAPTURE_A81 !== '1' ||
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
    resolve(root, `${test.info().project.name}-measurements.json`),
    JSON.stringify(measurements, null, 2),
  );
});
test('A81 own identity and access objects retain native tasks and cancellation', async ({
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
  await loaded(page.locator('header.game-header img[data-art="brand.emblem"]'));
  const register = page.locator('[data-account-entry=register]');
  const login = page.locator('[data-account-entry=login]');
  await loaded(register.locator('img'));
  await loaded(login.locator('img'));
  await capture(page, 'welcome');
  for (const [entry, role] of [
    [register, 'register'],
    [login, 'login'],
  ] as const) {
    await entry.click();
    await expect(dialog(page)).toHaveAttribute('data-account-step', role);
    await loaded(dialog(page).locator(`img[data-art="account.${role}"]`));
    await expect(dialog(page).getByRole('heading')).toBeVisible();
    await expect(dialog(page).locator('input[name=email]')).toBeFocused();
    await expect(dialog(page).locator('button[type=submit]')).toBeEnabled();
    expect(
      await dialog(page).evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
    ).toBe(true);
    await capture(page, role);
    if (viewport?.width === 865 && role === 'login') {
      await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
      expect(
        await dialog(page).evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
      ).toBe(true);
      const emblem = page.locator('header.game-header img[data-art="brand.emblem"]');
      const bounds = await emblem.evaluate((image) => {
        const rect = image.getBoundingClientRect();
        const header = image.closest('header')!.getBoundingClientRect();
        return {
          top: rect.top,
          bottom: rect.bottom,
          headerTop: header.top,
          headerBottom: header.bottom,
        };
      });
      expect(bounds.top).toBeGreaterThanOrEqual(0);
      expect(bounds.top).toBeGreaterThanOrEqual(bounds.headerTop);
      expect(bounds.bottom).toBeLessThanOrEqual(bounds.headerBottom);
      await capture(page, 'login-200');
      await page.evaluate(() => (document.documentElement.style.fontSize = ''));
    }
    await page.keyboard.press('Escape');
    await expect(entry).toBeFocused();
  }
  expect((await page.request.get('/api/state')).status()).toBe(401);
});
