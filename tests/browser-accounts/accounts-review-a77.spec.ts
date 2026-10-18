import { randomUUID } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { changeLanguage } from '../browser-trial/game-fixture';

const password = 'A77 private fictitious passphrase!';
const dialog = (page: Page) => page.locator('[data-account-dialog][open]');
const primary = (page: Page) => dialog(page).locator('button[type=submit]');
const haveCode = (page: Page) =>
  dialog(page).getByRole('button', { name: /^(Tengo el código|I have the token)$/ });
const loginLink = (page: Page) =>
  dialog(page).getByRole('button', { name: /^(Iniciar sesión|Sign in)$/ });
const settings = (page: Page) => page.locator('dialog.game-settings[open]');
const observations: unknown[] = [];
const root = resolve('docs/arcana/accounts-design-review-2026-10-18/evidence/linux');

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
async function snapshot(page: Page, name: string) {
  const project = test.info().project.name;
  const selected: Record<string, string[]> = {
    'chromium-390-a77': ['mail-sent', 'verify', 'invalid-token', 'conflict', 'network-notice'],
    'chromium-1280-a77': ['welcome', 'login', 'request-reset', 'reset', 'stale-tab', 'uncertain'],
    'webkit-865-a77': ['verify-200'],
  };
  if (
    process.platform !== 'linux' ||
    process.env.ARCANA_CAPTURE_A77 !== '1' ||
    !selected[project]?.includes(name)
  )
    return;
  await mkdir(root, { recursive: true });
  // No real password/token is pictured. Verification captures precede valid secret input.
  await page.screenshot({ path: resolve(root, `${project}-${name}.png`), fullPage: false });
}
async function observe(page: Page, name: string) {
  const value = await dialog(page).evaluate((element) => {
    const box = element.getBoundingClientRect();
    const alert = element.querySelector('[role=alert]');
    const rect = alert?.getBoundingClientRect();
    const closer = element.querySelector<HTMLButtonElement>('.account-close');
    const closeRect = closer?.getBoundingClientRect();
    const closeHit = closeRect
      ? document.elementFromPoint(
          closeRect.x + closeRect.width / 2,
          closeRect.y + closeRect.height / 2,
        )
      : null;
    return {
      language: document.documentElement.lang,
      pack: document.querySelector('[data-content-pack]')?.getAttribute('data-content-pack'),
      step: element.querySelector('form')?.getAttribute('data-account-action') ?? 'manage',
      width: box.width,
      left: box.left,
      right: box.right,
      top: box.top,
      bottom: box.bottom,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
      scrollTop: element.scrollTop,
      activeTag: document.activeElement?.tagName,
      activeName: document.activeElement?.getAttribute('name'),
      passwordType: element.querySelector<HTMLInputElement>('input[name=password]')?.type,
      closeControl: closeRect
        ? {
            left: closeRect.left,
            top: closeRect.top,
            width: closeRect.width,
            height: closeRect.height,
            hitInside: closer === closeHit || !!closer?.contains(closeHit),
          }
        : null,
      alertText: alert?.textContent,
      alertInViewport: rect
        ? rect.top >= box.top && rect.bottom <= Math.min(box.bottom, innerHeight)
        : null,
      controls: [...element.querySelectorAll('button')].map((button) => ({
        text: button.textContent?.trim() || button.getAttribute('aria-label'),
        disabled: button.disabled,
        pressed: button.getAttribute('aria-pressed'),
        height: button.getBoundingClientRect().height,
      })),
    };
  });
  observations.push({ project: test.info().project.name, test: test.info().title, name, ...value });
  expect(value.left).toBeGreaterThanOrEqual(-1);
  expect(value.right).toBeLessThanOrEqual((page.viewportSize()?.width ?? 390) + 1);
  expect(value.scrollWidth).toBeLessThanOrEqual(value.clientWidth + 1);
}
test.afterAll(async () => {
  await mkdir(root, { recursive: true });
  await writeFile(
    resolve(root, `${test.info().project.name}-observations.json`),
    JSON.stringify(observations, null, 2),
  );
});
async function openFromSettings(page: Page) {
  await expect(page.locator('.game-shell[data-view]')).not.toHaveAttribute('data-view', 'welcome');
  const active = page.locator('dialog[open]').last();
  const activeGear = active.getByRole('button', { name: /^(Ajustes|Settings)$/ });
  const origin = (await activeGear.count()) ? active : page.locator('header').first();
  await origin.getByRole('button', { name: /^(Ajustes|Settings)$/ }).click();
  await settings(page).locator('[data-account-entry=settings]').click();
  await expect(dialog(page)).toBeVisible();
}
async function dismissSettings(page: Page) {
  if (await settings(page).count()) await page.keyboard.press('Escape');
}
async function game(page: Page) {
  const response = await page.request.get('/api/state');
  expect(response.status()).toBe(200);
  return (await response.json()).state;
}
async function privateToken(email: string) {
  const namespace = process.env.ARCANA_ACCOUNTS_A77_NAMESPACE;
  if (!namespace || !/^a77-[a-f0-9-]{36}$/.test(namespace))
    throw Error('Refusing an ordinary mailbox');
  const dir = resolve('.local/arcana-mail', namespace);
  let token = '';
  await expect
    .poll(async () => {
      for (const file of await readdir(dir).catch(() => [])) {
        if (!/^[a-f0-9-]{36}\.json$/.test(file)) continue;
        const item = JSON.parse(await readFile(resolve(dir, file), 'utf8'));
        if (item.to === email && item.purpose === 'verify') token = item.token;
      }
      return /^[a-f0-9]{64}$/.test(token);
    })
    .toBe(true);
  return token;
}

test('A77 remaining forms and error-state composition without game mutation', async ({
  page,
  viewport,
}) => {
  const wide = viewport?.width === 1280;
  await enter(page, wide);
  await snapshot(page, 'welcome');
  const origin = page.locator('[data-account-entry=login]');
  await origin.click();
  await snapshot(page, 'login');
  await dialog(page)
    .locator('input[name=email]')
    .fill(`a77-unregistered-${randomUUID()}@example.invalid`);
  await dialog(page).locator('input[name=password]').fill(password);
  await primary(page).click();
  await expect(dialog(page).getByRole('alert')).toBeVisible();
  await observe(page, 'wrong-credentials');
  await dialog(page)
    .getByRole('button', { name: /^(Mostrar contraseña|Show password)$/ })
    .click();
  await dialog(page)
    .getByRole('button', { name: /^(Olvidé mi contraseña|Forgot password)$/ })
    .click();
  await snapshot(page, 'request-reset');
  await dialog(page)
    .locator('input[name=email]')
    .fill(`a77-recovery-${randomUUID()}@example.invalid`);
  await primary(page).click();
  await expect(dialog(page).getByRole('status')).toBeVisible();
  await observe(page, 'reset-request-accepted');
  await haveCode(page).click();
  await observe(page, 'reset-after-show-password');
  await snapshot(page, 'reset');
  await page.keyboard.press('Escape');
  await expect(origin).toBeFocused();

  await page.locator('[data-account-entry=register]').click();
  await dialog(page)
    .locator('input[name=email]')
    .fill(`a77-review-${randomUUID()}@example.invalid`);
  await primary(page).click();
  await expect(dialog(page).getByRole('status')).toBeVisible();
  await observe(page, 'registration-accepted');
  await snapshot(page, 'mail-sent');
  await haveCode(page).click();
  await observe(page, 'verify-empty');
  await snapshot(page, 'verify');
  if (viewport?.width === 865) {
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
    await observe(page, 'verify-200');
    await snapshot(page, 'verify-200');
    await page.evaluate(() => (document.documentElement.style.fontSize = ''));
  }
  await dialog(page).locator('input[name=token]').fill('0'.repeat(64));
  await dialog(page).locator('input[name=password]').fill(password);
  await primary(page).click();
  await expect(dialog(page).getByRole('alert')).toBeVisible();
  await observe(page, 'invalid-token');
  await snapshot(page, 'invalid-token');
  await page.keyboard.press('Escape');
  expect((await page.request.get('/api/state')).status()).toBe(401);
  expect((await (await page.request.get('/api/auth/session')).json()).kind).toBe('anonymous');
});

test('A77 guest link after reload, real settings swap and explicit account conflict', async ({
  page,
  viewport,
}) => {
  const wide = viewport?.width === 1280;
  await enter(page, wide);
  await page.locator('.portal-enter').click();
  await expect.poll(async () => (await page.request.get('/api/state')).status()).toBe(200);
  const saved = await game(page);
  // Same cookies, independent React state: the second tab knows the guest before binding.
  const stale = await page.context().newPage();
  await stale.goto('/');
  await expect.poll(async () => (await stale.request.get('/api/state')).status()).toBe(200);
  await openFromSettings(stale);
  await stale.keyboard.press('Escape');
  await expect(settings(stale)).toBeVisible();
  const email = `a77-linked-${randomUUID()}@example.invalid`;
  await openFromSettings(page);
  await dialog(page).locator('input[name=email]').fill(email);
  await primary(page).click();
  await expect(dialog(page).getByRole('status')).toBeVisible();
  const token = await privateToken(email);
  await page.keyboard.press('Escape');
  await page.reload();
  expect(await game(page)).toEqual(saved);

  await openFromSettings(page);
  await haveCode(page).click();
  await dialog(page).locator('input[name=token]').fill(token);
  await dialog(page).locator('input[name=password]').fill(password);
  await primary(page).click();
  await expect(dialog(page)).toHaveCount(0);
  expect(await game(page)).toEqual(saved);

  const refreshed = stale.waitForResponse(
    (response) => new URL(response.url()).pathname === '/api/auth/session',
  );
  await settings(stale).locator('[data-account-entry=settings]').click();
  expect((await (await refreshed).json()).kind).toBe('account');
  await expect(settings(stale).locator('[data-account-entry=settings]')).toContainText(
    /Mi cuenta|My account/,
  );
  await observe(stale, 'bound-in-other-tab-mode');
  await snapshot(stale, 'stale-tab');
  expect(await game(stale)).toEqual(saved);
  await stale.close();

  // Change presentation only using Settings, not storage mutation during play.
  await expect(settings(page)).toBeVisible();
  await settings(page).getByRole('button', { name: 'English', exact: true }).click();
  await settings(page).locator('.world-medallion-arcana').locator('..').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('[data-content-pack]')).toHaveAttribute('data-content-pack', 'arcana');
  await settings(page).locator('[data-account-entry=settings]').click();
  await expect(dialog(page)).toContainText(email);
  await observe(page, 'linked-after-swap');
  await snapshot(page, 'manage');
  expect(await game(page)).toEqual(saved);
  await dialog(page).locator('[data-account-action=logout]').click();
  await expect(dialog(page)).toHaveCount(0);
  await dismissSettings(page);
  await page.locator('.portal-enter').click();
  await expect.poll(async () => (await page.request.get('/api/state')).status()).toBe(200);
  const guest = await game(page);
  expect(guest.playerId).not.toBe(saved.playerId);
  await openFromSettings(page);
  await loginLink(page).click();
  await dialog(page).locator('input[name=email]').fill(email);
  await dialog(page).locator('input[name=password]').fill(password);
  await primary(page).click();
  await expect(dialog(page).getByRole('alert')).toBeVisible();
  await observe(page, 'different-account-blocked');
  await snapshot(page, 'conflict');
  expect(await game(page)).toEqual(guest);
  await dialog(page).getByRole('button', { name: 'Open another saved game', exact: true }).click();
  await observe(page, 'different-account-explicit');
  await primary(page).click();
  await expect(dialog(page)).toHaveCount(0);
  expect(await game(page)).toEqual(saved);
  await dismissSettings(page);

  if (wide) {
    await openFromSettings(page);
    await dialog(page).locator('[data-account-action=logout]').click();
    await expect(dialog(page)).toHaveCount(0);
    await dismissSettings(page);
    await page.locator('[data-account-entry=login]').click();
    await dialog(page).locator('input[name=email]').fill(email);
    await dialog(page).locator('input[name=password]').fill(password);
    // Real server confirmation, only its response transport is lost.
    await page.route('**/api/auth/login', async (route) => {
      expect((await route.fetch()).ok()).toBe(true);
      await route.abort('failed');
    });
    await primary(page).click();
    await expect(
      dialog(page).getByRole('button', { name: 'Check session', exact: true }),
    ).toBeVisible();
    await observe(page, 'lost-login-response');
    await snapshot(page, 'uncertain');
    await page.unroute('**/api/auth/login');
    await dialog(page).getByRole('button', { name: 'Check session', exact: true }).click();
    await expect
      .poll(() =>
        page.evaluate(() => {
          const element = document.querySelector('[data-account-dialog][open]');
          return !element || element.getAttribute('aria-busy') === 'false';
        }),
      )
      .toBe(true);
    if (await dialog(page).count()) {
      await dialog(page).locator('input[name=email]').fill(email);
      await dialog(page).locator('input[name=password]').fill(password);
      await primary(page).click();
    }
    await expect(dialog(page)).toHaveCount(0);
    expect(await game(page)).toEqual(saved);
  }
});

test('A77 transport-only registration failure and offline guidance diagnostic', async ({
  page,
  viewport,
}) => {
  test.skip(viewport?.width !== 390, 'Single declared transport sample, not a duplicated matrix.');
  await enter(page, false);
  await page.locator('[data-account-entry=register]').click();
  await dialog(page)
    .locator('input[name=email]')
    .fill(`a77-offline-${randomUUID()}@example.invalid`);
  await page.route('**/api/auth/register', (route) => route.abort('failed'));
  await primary(page).click();
  await expect(dialog(page).getByRole('alert')).toBeVisible();
  await observe(page, 'registration-network-failure');
  await snapshot(page, 'network-notice');
  await page.unroute('**/api/auth/register');
  await page.context().setOffline(true);
  await expect(primary(page)).toBeDisabled();
  await observe(page, 'offline');
  await page.context().setOffline(false);
  await expect(primary(page)).toBeEnabled();
  await page.keyboard.press('Escape');
  expect((await page.request.get('/api/state')).status()).toBe(401);
});
