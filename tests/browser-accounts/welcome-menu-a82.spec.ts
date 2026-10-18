import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { changeLanguage } from '../browser-trial/game-fixture';
const root = resolve('docs/arcana/welcome-menu-2026-10-18/evidence/linux');
const samples: unknown[] = [];
async function geometry(page: Page, name: string, ordinary = true) {
  const data = await page.locator('.welcome-menu').evaluate((main) => {
    const rect = (e: Element) => {
      const r = e.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom, right: r.right };
    };
    return {
      viewport: { width: innerWidth, height: innerHeight },
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      actions: [...main.querySelectorAll('.fantasy-action')].map(rect),
      title: rect(main.querySelector('h1')!),
      settings: rect(document.querySelector('.settings-trigger')!),
    };
  });
  samples.push({ name, project: test.info().project.name, ...data });
  expect(data.documentWidth).toBeLessThanOrEqual(data.viewport.width + 1);
  if (ordinary) expect(data.documentHeight).toBeLessThanOrEqual(data.viewport.height + 1);
  for (const button of data.actions) {
    expect(button.height).toBeGreaterThanOrEqual(56);
    expect(button.x).toBeGreaterThanOrEqual(0);
    expect(button.right).toBeLessThanOrEqual(data.viewport.width);
  }
  expect(data.settings.width).toBeGreaterThanOrEqual(44);
  expect(data.settings.height).toBeGreaterThanOrEqual(44);
  expect(data.title.y >= data.settings.bottom || data.title.right < data.settings.x).toBe(true);
}
async function capture(page: Page, name: string) {
  // Six selected menu views, one enlarged view. Never automatic failure screenshots.
  if (process.platform !== 'linux' || process.env.ARCANA_CAPTURE_A82 !== '1') return;
  if (name === 'enlarged' && test.info().project.name !== 'webkit-865-a82') return;
  await mkdir(root, { recursive: true });
  await page.screenshot({
    path: resolve(root, `${test.info().project.name}-${name}.png`),
    fullPage: false,
  });
}
test.afterAll(async () => {
  await mkdir(root, { recursive: true });
  await writeFile(
    resolve(root, `${test.info().project.name}-geometry.json`),
    JSON.stringify(samples, null, 2),
  );
});
test('A82 one identity, three coherent actions and reversible native account tasks', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const pack of ['diagon-alley', 'arcana']) {
    await page.evaluate((value) => {
      localStorage.setItem('arcana.presentation.content-pack.v1', value);
      localStorage.setItem('arcana-language', 'es');
    }, pack);
    await page.reload();
    const menu = page.locator('.welcome-menu');
    await expect(menu.locator('.portal-enter')).toBeEnabled();
    await page.evaluate(() => document.fonts.ready);
    await menu
      .locator('img')
      .evaluateAll((images) => Promise.all(images.map((i) => (i as HTMLImageElement).decode())));
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(menu.getByRole('heading', { level: 2 })).toHaveCount(0);
    const actions = menu.locator('.fantasy-action');
    await expect(actions).toHaveCount(3);
    await expect(actions.nth(0)).toHaveAccessibleName('Jugar como invitado');
    await expect(actions.nth(1)).toHaveAccessibleName('Iniciar sesión');
    await expect(actions.nth(2)).toHaveAccessibleName('Crear cuenta');
    // Legacy header material/flex rules must not obscure the actual scene.
    expect(
      await menu.locator('.welcome-brand').evaluate((e) => getComputedStyle(e).backgroundColor),
    ).toBe('rgba(0, 0, 0, 0)');
    const heading = await menu.locator('h1').boundingBox();
    expect(heading!.height).toBeLessThan(100);
    for (const action of await actions.all()) {
      const color = await action.evaluate((e) => getComputedStyle(e).color);
      await action.hover();
      expect(await action.evaluate((e) => getComputedStyle(e).color)).toBe(color);
    }
    await page.mouse.move(0, 0);
    await geometry(page, `${pack}-es`);
    await capture(page, pack);
    await actions.nth(0).focus();
    await page.keyboard.press('Tab');
    await expect(actions.nth(1)).toBeFocused();
    await page.keyboard.press('Enter');
    const dialog = page.locator('[data-account-dialog][open]');
    await expect(dialog).toHaveAttribute('data-account-step', 'login');
    await expect(dialog.locator('input[name=email]')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(actions.nth(1)).toBeFocused();
    await actions.nth(2).click();
    await expect(dialog).toHaveAttribute('data-account-step', 'register');
    await page.keyboard.press('Escape');
    await expect(actions.nth(2)).toBeFocused();
    await changeLanguage(page, 'en');
    await expect(actions.nth(0)).toHaveAccessibleName('Play as guest');
    await geometry(page, `${pack}-en`);
    expect((await page.request.get('/api/state')).status()).toBe(401);
  }
  await page.setViewportSize({ width: 320, height: 844 });
  await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
  await geometry(page, 'enlarged', false);
  const guest = page.locator('.portal-enter');
  await guest.scrollIntoViewIfNeeded();
  await expect(guest).toBeInViewport();
  await capture(page, 'enlarged');
  expect(await guest.evaluate((e) => getComputedStyle(e).transitionDuration)).toBe('0s');
});
test('A82 missing illustrations preserve all visible choices and guest operation feedback', async ({
  page,
}) => {
  await page.route('**/*.{svg,webp,png}', (route) => route.abort());
  await page.goto('/');
  const guest = page.locator('.portal-enter');
  await expect(guest).toBeEnabled();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-account-entry=register]')).toBeVisible();
  await expect(page.locator('[data-account-entry=login]')).toBeVisible();
  let requests = 0;
  let release!: () => void;
  const waiting = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/api/trial/session', async (route) => {
    requests++;
    await waiting;
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: { code: 'SERVICE_UNAVAILABLE' } }),
    });
  });
  await guest.click();
  await expect(guest).toBeDisabled();
  await expect(guest).toHaveAttribute('aria-busy', 'true');
  await expect(guest).toContainText(/Entrando|Entering/);
  await page.keyboard.press('Enter');
  await expect.poll(() => requests).toBe(1);
  release();
  await expect(guest).toBeEnabled();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(guest).not.toHaveAttribute('aria-busy', 'true');
});
