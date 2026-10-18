import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { changeLanguage } from '../browser-trial/game-fixture';
import { clickAccountAction } from './account-controls';
const dialog = (page: Page) => page.locator('[data-account-dialog][open]');
const primary = (page: Page) => dialog(page).locator('button[type=submit]');
const root = resolve('docs/arcana/account-entry-redesign-2026-10-18/evidence/linux');
const observations: unknown[] = [];
async function enter(page: Page, wide: boolean) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(
    (pack) => localStorage.setItem('arcana.presentation.content-pack.v1', pack),
    wide ? 'arcana' : 'diagon-alley',
  );
  await page.goto('/');
  await expect(page.locator('[data-account-entry=register]')).toBeEnabled();
  if (wide) await changeLanguage(page, 'en');
}
async function measure(page: Page, name: string) {
  await expect(dialog(page)).toHaveAttribute('aria-busy', 'false');
  const value = await dialog(page).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      height: rect.height,
      width: rect.width,
      viewport: { width: innerWidth, height: innerHeight },
      words: (element as HTMLElement).innerText.trim().split(/\s+/).length,
      fields: element.querySelectorAll('input').length,
      overflow: element.scrollWidth > element.clientWidth + 1,
      helpOpen: element.querySelector('details')?.hasAttribute('open'),
      primary: element.querySelectorAll('.account-primary').length,
    };
  });
  // Native closed details may retain descendant geometry. Use the exposed
  // accessibility roles, not rectangles, to count the actual available actions.
  const visibleButtons = await dialog(page).getByRole('button').all();
  const buttons = await Promise.all(
    visibleButtons.map(async (button) => {
      await expect(button).toBeVisible();
      return (await button.textContent())?.trim() || (await button.getAttribute('aria-label'));
    }),
  );
  observations.push({ name, project: test.info().project.name, ...value, visibleButtons: buttons });
  expect(value.overflow).toBe(false);
  expect(buttons.length).toBeLessThanOrEqual(3);
  expect(value.words).toBeLessThanOrEqual(60);
  expect(value.primary).toBe(1);
  expect(value.helpOpen).toBe(false);
  if (value.viewport.width === 390) expect(value.height).toBeLessThan(784);
  return value;
}
async function capture(page: Page, name: string) {
  const selected: Record<string, string[]> = {
    'chromium-390-a79': ['register', 'verify', 'code-repair'],
    'chromium-1280-a79': ['login', 'reset', 'uncertain'],
    'webkit-865-a79': ['verify-200'],
  };
  if (
    process.platform !== 'linux' ||
    process.env.ARCANA_CAPTURE_A79 !== '1' ||
    !selected[test.info().project.name]?.includes(name)
  )
    return;
  await expect(dialog(page)).toHaveAttribute('aria-busy', 'false');
  await dialog(page)
    .locator('.account-heading img')
    .evaluateAll((images) =>
      Promise.all(images.map((image) => (image as HTMLImageElement).decode().catch(() => {}))),
    );
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

test('A79 one clear task, contextual help and direct code repair', async ({ page, viewport }) => {
  const wide = viewport?.width === 1280;
  await enter(page, wide);
  const origin = page.locator('[data-account-entry=register]');
  await origin.click();
  await expect(dialog(page)).toBeVisible();
  const signup = await measure(page, 'register');
  expect(signup.fields).toBe(1);
  await expect(dialog(page)).toContainText(wide ? 'No external email' : 'Sin correo externo');
  await capture(page, 'register');
  const email = `a79-${randomUUID()}@example.invalid`;
  await dialog(page).locator('input[name=email]').fill(email);
  await primary(page).click();
  await expect(dialog(page)).toHaveAttribute('data-account-step', 'verify');
  const code = await measure(page, 'verify');
  expect(code.fields).toBe(2);
  await expect(dialog(page)).toContainText(email);
  await expect(
    dialog(page).getByRole('button', { name: /^(Mostrar contraseña|Show password)$/ }),
  ).toHaveAttribute('aria-pressed', 'false');
  await capture(page, 'verify');
  if (viewport?.width === 865) {
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
    await capture(page, 'verify-200');
    await page.evaluate(() => (document.documentElement.style.fontSize = ''));
  }
  await dialog(page).locator('input[name=token]').fill('0'.repeat(64));
  await dialog(page).locator('input[name=password]').fill('A79 private fixture passphrase');
  await primary(page).click();
  await expect(dialog(page).getByRole('alert')).toBeVisible();
  await expect(
    dialog(page).getByRole('button', { name: /^(Solicitar otro código|Request another code)$/ }),
  ).toBeVisible();
  await capture(page, 'code-repair');
  await clickAccountAction(page, { name: /^(Solicitar otro código|Request another code)$/ });
  await expect(dialog(page).locator('input[name=email]')).toHaveValue(email);
  await page.keyboard.press('Escape');
  await expect(origin).toBeFocused();
  expect((await page.request.get('/api/state')).status()).toBe(401);
});

test('A79 sign in and recovery remain concise and accessible through actual help', async ({
  page,
  viewport,
}) => {
  const wide = viewport?.width === 1280;
  await enter(page, wide);
  await page.locator('[data-account-entry=login]').click();
  await expect(dialog(page)).toBeVisible();
  const login = await measure(page, 'login');
  expect(login.fields).toBe(2);
  await capture(page, 'login');
  await clickAccountAction(page, { name: /^(Mostrar contraseña|Show password)$/ });
  await expect(dialog(page).locator('input[name=password]')).toHaveAttribute('type', 'text');
  await dialog(page).locator('.account-help > summary').focus();
  await page.keyboard.press('Enter');
  await expect(dialog(page).locator('.account-help')).toHaveAttribute('open', '');
  await expect(
    dialog(page).getByRole('button', { name: /^(Olvidé mi contraseña|Forgot password)$/ }),
  ).toBeVisible();
  await clickAccountAction(page, { name: /^(Olvidé mi contraseña|Forgot password)$/ });
  await measure(page, 'request-reset');
  await clickAccountAction(page, { name: /^(Tengo el código|I have the code)$/ });
  await expect(dialog(page).locator('input[name=password]')).toHaveAttribute('type', 'password');
  await measure(page, 'reset');
  await capture(page, 'reset');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-account-entry=login]')).toBeFocused();
});

test('A79 uncertain authentication has one recovery action and Enter does not resubmit', async ({
  page,
  viewport,
}) => {
  test.skip(viewport?.width !== 1280, 'One declared transport and layout sample.');
  await enter(page, true);
  await page.locator('[data-account-entry=login]').click();
  await dialog(page)
    .locator('input[name=email]')
    .fill(`a79-uncertain-${randomUUID()}@example.invalid`);
  await dialog(page).locator('input[name=password]').fill('A79 private fixture passphrase');
  let requests = 0;
  await page.route('**/api/auth/login', (route) => {
    requests++;
    return route.abort('failed');
  });
  await primary(page).click();
  await expect(dialog(page).getByRole('alert')).toBeVisible();
  const check = dialog(page).getByRole('button', { name: 'Check session', exact: true });
  await expect(check).toBeEnabled();
  await expect(primary(page)).toHaveCount(0);
  await expect(dialog(page).locator('.account-primary')).toHaveCount(1);
  await dialog(page).locator('input[name=password]').focus();
  await page.keyboard.press('Enter');
  await expect(dialog(page)).toHaveAttribute('aria-busy', 'false');
  expect(requests).toBe(1);
  await capture(page, 'uncertain');
  await page.unroute('**/api/auth/login');
  await check.click();
  await expect(primary(page)).toBeEnabled();
  expect((await page.request.get('/api/state')).status()).toBe(401);
});
