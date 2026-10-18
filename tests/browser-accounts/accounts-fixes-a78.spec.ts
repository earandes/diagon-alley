import { randomUUID } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { changeLanguage, startExpedition } from '../browser-trial/game-fixture';

const password = 'A78 private fictitious passphrase!';
const dialog = (page: Page) => page.locator('[data-account-dialog][open]');
const primary = (page: Page) => dialog(page).locator('button[type=submit]');
const haveCode = (page: Page) =>
  dialog(page).getByRole('button', { name: /^(Tengo el código|I have the code)$/ });
const loginLink = (page: Page) =>
  dialog(page).getByRole('button', { name: /^(Iniciar sesión|Sign in)$/ });
const settings = (page: Page) => page.locator('dialog.game-settings[open]');
const observations: unknown[] = [];
const root = resolve('docs/arcana/accounts-fixes-2026-10-18/evidence/linux');

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
    'chromium-390-a78': ['mail-sent', 'verify', 'invalid-token', 'conflict', 'network-notice'],
    'chromium-1280-a78': ['welcome', 'login', 'request-reset', 'reset', 'stale-tab', 'uncertain'],
    'webkit-865-a78': ['verify-200'],
  };
  if (
    process.platform !== 'linux' ||
    process.env.ARCANA_CAPTURE_A78 !== '1' ||
    !selected[project]?.includes(name)
  )
    return;
  await mkdir(root, { recursive: true });
  // No real password/token is pictured. Verification captures precede valid secret input.
  await page.screenshot({
    path: resolve(root, `${project}-${name}.png`),
    fullPage: false,
  });
}
async function observe(page: Page, name: string) {
  // A visible status may still be Connecting. Observe the settled state explicitly.
  await expect(dialog(page)).toHaveAttribute('aria-busy', 'false');
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
  if (name === 'different-account-blocked' || name === 'invalid-token')
    expect(value.alertInViewport).toBe(true);
  if (name === 'registration-accepted') {
    expect(value.closeControl?.hitInside).toBe(true);
    expect(value.closeControl?.width).toBeGreaterThanOrEqual(44);
    expect(value.closeControl?.height).toBeGreaterThanOrEqual(44);
  }
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
  const namespace = process.env.ARCANA_ACCOUNTS_A78_NAMESPACE;
  if (!namespace || !/^a78-[a-f0-9-]{36}$/.test(namespace))
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

test('A78 remaining forms and error-state composition without game mutation', async ({
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
    .fill(`a78-unregistered-${randomUUID()}@example.invalid`);
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
    .fill(`a78-recovery-${randomUUID()}@example.invalid`);
  await primary(page).click();
  await expect(dialog(page).getByRole('status')).toBeVisible();
  await observe(page, 'reset-request-accepted');
  await expect(dialog(page).locator('form')).toHaveAttribute('data-account-action', 'reset');
  await expect(dialog(page).locator('input[name=password]')).toHaveAttribute('type', 'password');
  await expect(dialog(page)).toContainText('a78-recovery-');
  await observe(page, 'reset-after-show-password');
  await snapshot(page, 'reset');
  await page.keyboard.press('Escape');
  await expect(origin).toBeFocused();

  await page.locator('[data-account-entry=register]').click();
  await dialog(page)
    .locator('input[name=email]')
    .fill(`a78-review-${randomUUID()}@example.invalid`);
  await primary(page).click();
  await expect(dialog(page).getByRole('status')).toBeVisible();
  await observe(page, 'registration-accepted');
  await snapshot(page, 'mail-sent');
  await expect(dialog(page).locator('form')).toHaveAttribute('data-account-action', 'verify');
  await expect(dialog(page)).toContainText('a78-review-');
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
  await dialog(page)
    .getByRole('button', { name: /^(Solicitar otro código|Request another code)$/ })
    .click();
  await expect(dialog(page).locator('input[name=email]')).toHaveValue(/a78-review-/);
  await expect(primary(page)).toHaveAttribute('data-account-action', 'register-submit');
  await page.keyboard.press('Escape');
  expect((await page.request.get('/api/state')).status()).toBe(401);
  expect((await (await page.request.get('/api/auth/session')).json()).kind).toBe('anonymous');
});

test('A78 guest link after reload, real settings swap and explicit account conflict', async ({
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
  const email = `a78-linked-${randomUUID()}@example.invalid`;
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
  await expect(dialog(stale).locator('form')).toHaveCount(0);
  await expect(dialog(stale)).toContainText(email);
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

test('A78 transport-only registration failure and offline guidance diagnostic', async ({
  page,
  viewport,
}) => {
  test.skip(viewport?.width !== 390, 'Single declared transport sample, not a duplicated matrix.');
  await enter(page, false);
  await page.locator('[data-account-entry=register]').click();
  await dialog(page)
    .locator('input[name=email]')
    .fill(`a78-offline-${randomUUID()}@example.invalid`);
  await page.route('**/api/auth/register', (route) => route.abort('failed'));
  await primary(page).click();
  await expect(dialog(page).getByRole('alert')).toBeVisible();
  await observe(page, 'registration-network-failure');
  await snapshot(page, 'network-notice');
  await expect(dialog(page).getByRole('alert')).toContainText('solicitar el código de nuevo');
  await expect(dialog(page).getByRole('alert')).not.toContainText('Comprueba la sesión');
  await expect(
    dialog(page).getByRole('button', { name: 'Comprobar sesión', exact: true }),
  ).toHaveCount(0);
  await page.unroute('**/api/auth/register');
  await page.context().setOffline(true);
  await expect(primary(page)).toBeDisabled();
  await observe(page, 'offline');
  await page.context().setOffline(false);
  await expect(primary(page)).toBeEnabled();
  await page.keyboard.press('Escape');
  expect((await page.request.get('/api/state')).status()).toBe(401);
});

test('A78 Unicode typing, paste, policy boundaries and real credentials', async ({
  page,
  context,
  viewport,
}) => {
  test.skip(viewport?.width !== 1280, 'One bounded Chromium input and authority sample.');
  await enter(page, true);
  await page.locator('[data-account-entry=register]').click();
  const email = `a78-unicode-${randomUUID()}@example.invalid`;
  await dialog(page).locator('input[name=email]').fill(email);
  await primary(page).click();
  await expect(dialog(page).locator('form')).toHaveAttribute('data-account-action', 'verify');
  await dialog(page)
    .locator('input[name=token]')
    .fill(await privateToken(email));
  const field = dialog(page).locator('input[name=password]');
  let verifications = 0;
  page.on('request', (request) => {
    if (request.method() === 'POST' && new URL(request.url()).pathname === '/api/auth/verify')
      verifications++;
  });
  await field.pressSequentially('🦉'.repeat(14));
  await primary(page).click();
  await expect(dialog(page).getByRole('alert')).toContainText('15 to 128');
  expect(verifications).toBe(0);
  await field.fill('');
  await field.pressSequentially('🦉'.repeat(65));
  await expect(field).toHaveValue('🦉'.repeat(65));
  await field.pressSequentially('🦉'.repeat(64));
  await expect(field).toHaveValue('🦉'.repeat(129));
  await primary(page).click();
  await expect(dialog(page).getByRole('alert')).toContainText('15 to 128');
  expect(verifications).toBe(0);
  // Real browser clipboard in isolated Linux Chromium; not a password-manager/device claim.
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.evaluate((secret) => navigator.clipboard.writeText(secret), '🦉'.repeat(128));
  await field.fill('');
  await field.focus();
  await page.keyboard.press('Control+V');
  await expect(field).toHaveValue('🦉'.repeat(128));
  await primary(page).click();
  await expect(dialog(page)).toHaveCount(0);
  expect(verifications).toBe(1);
  const saved = await game(page);
  expect(
    (
      await page.request.post('/api/auth/login', {
        headers: { Origin: new URL(page.url()).origin },
        data: { email, password: '🦉'.repeat(128), expectedPlayerId: saved.playerId },
      })
    ).status(),
  ).toBe(200);
  expect(await game(page)).toEqual(saved);
  await page.evaluate(() => navigator.clipboard.writeText(''));
});

async function settingsRoundTrip(page: Page, origin: ReturnType<Page['locator']>) {
  const before = await game(page);
  const gear = origin.getByRole('button', { name: /^(Ajustes|Settings)$/ });
  await gear.click();
  const entry = settings(page).locator('[data-account-entry=settings]');
  await expect(entry).toContainText(/Guardar mi partida|Save my game/);
  await entry.click();
  await expect(dialog(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(entry).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(gear).toBeFocused();
  expect(await game(page)).toEqual(before);
}

test('A78 same account access across map, node, preparation, reveal and forge; owner change invalidates quote', async ({
  page,
  browser,
  viewport,
}) => {
  test.skip(
    viewport?.width === 865,
    'Two declared pack/language samples, no duplicated third journey.',
  );
  const wide = viewport?.width === 1280;
  await enter(page, wide);
  await page.locator('.portal-enter').click();
  const language = wide ? 'en' : 'es';
  await settingsRoundTrip(page, page.locator('header.game-header'));
  await startExpedition(page, language);
  await page.locator('[data-node-state=available]').first().click();
  const node = page.locator('dialog.node-event-dialog[open]');
  await expect(node).toBeVisible();
  await settingsRoundTrip(page, node);
  await page.keyboard.press('Escape');
  await page.locator('.team-prepare').click();
  const preparation = page.locator('dialog.preparation-dialog[open]');
  await expect(preparation).toBeVisible();
  await settingsRoundTrip(page, preparation);
  await page.keyboard.press('Escape');

  await page.goto('/#/shop/confectionery');
  await page.locator('[data-product=cacao-toad]').click();
  await page.locator('.shop-purchase-ticket').click();
  const reveal = page.locator('dialog.reveal[open]');
  await expect(reveal).toBeVisible();
  const committed = await game(page);
  await settingsRoundTrip(page, reveal);
  await page.locator('.reveal-continue').click();
  expect(await game(page)).toEqual(committed);
  await page.goto('/#/shop/workshop');
  await expect(page.locator('.forge-action')).toBeEnabled();
  await page.locator('.forge-action').click();
  const quote = page.locator('dialog.shop-trade-confirmation[open]');
  await expect(quote).toBeVisible();
  await settingsRoundTrip(page, quote);

  // Independent identity with its own server-initialized game, never a copied inventory.
  const other = await browser.newContext({
    baseURL: new URL(page.url()).origin,
    extraHTTPHeaders: { Origin: new URL(page.url()).origin },
  });
  try {
    const email = `a78-switch-${randomUUID()}@example.invalid`;
    expect((await other.request.post('/api/auth/register', { data: { email } })).status()).toBe(
      200,
    );
    expect(
      (
        await other.request.post('/api/auth/verify', {
          data: { token: await privateToken(email), password },
        })
      ).status(),
    ).toBe(200);
    const target = (await (await other.request.get('/api/state')).json()).state;
    const previous = await game(page);
    let forgePosts = 0;
    page.on('request', (request) => {
      if (request.method() === 'POST' && /forge/.test(new URL(request.url()).pathname))
        forgePosts++;
    });
    await quote.getByRole('button', { name: /^(Ajustes|Settings)$/ }).click();
    await settings(page).locator('[data-account-entry=settings]').click();
    await loginLink(page).click();
    await dialog(page).locator('input[name=email]').fill(email);
    await dialog(page).locator('input[name=password]').fill(password);
    await dialog(page)
      .getByRole('button', { name: /^(Abrir otra partida guardada|Open another saved game)$/ })
      .click();
    await primary(page).click();
    await expect(dialog(page)).toHaveCount(0);
    await expect(quote).toHaveCount(0);
    await expect(settings(page)).toHaveCount(0);
    expect(await game(page)).toEqual(target);
    expect(target.playerId).not.toBe(previous.playerId);
    expect(forgePosts).toBe(0);
    await expect(page.locator('#content')).toBeFocused();
  } finally {
    await other.close();
  }
});

test('A78 close target remains usable at all interior points and without art', async ({
  page,
  viewport,
}) => {
  await enter(page, viewport?.width === 1280);
  const entry = page.locator('[data-account-entry=register]');
  await entry.click();
  const close = dialog(page).locator('.account-close');
  await expect(close).toBeVisible();
  const hitPoints = () =>
    close.evaluate((element) => {
      const r = element.getBoundingClientRect();
      return [4, r.width / 2, r.width - 4].flatMap((x) =>
        [4, r.height / 2, r.height - 4].map((y) => {
          const hit = document.elementFromPoint(r.x + x, r.y + y);
          return hit === element || !!(hit && element.contains(hit));
        }),
      );
    });
  expect((await hitPoints()).every(Boolean)).toBe(true);
  await page.route('**/a78-absent.svg', (route) => route.fulfill({ status: 404, body: '' }));
  await close.locator('img').evaluate((img) => img.setAttribute('src', '/a78-absent.svg'));
  await expect(close.locator('img')).toHaveCount(0);
  await expect(close.locator('svg')).toBeVisible();
  if (viewport?.width === 390) {
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
    expect((await hitPoints()).every(Boolean)).toBe(true);
  }
  await close.tap();
  await expect(dialog(page)).toHaveCount(0);
  await expect(entry).toBeFocused();
});

test('A78 retained session response cannot reopen cancelled Settings', async ({
  page,
  viewport,
}) => {
  test.skip(viewport?.width !== 1280, 'One declared response ordering sample.');
  await enter(page, true);
  await page.locator('.portal-enter').click();
  await expect(page.locator('[data-expedition-preparation=new]')).toBeVisible();
  await page
    .locator('header.game-header')
    .getByRole('button', { name: 'Settings', exact: true })
    .click();
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/api/auth/session', async (route) => {
    await held;
    await route.continue();
  });
  const response = page.waitForResponse('**/api/auth/session');
  try {
    const entry = settings(page).locator('[data-account-entry=settings]');
    await entry.click();
    await expect(entry).toBeDisabled();
    await expect(entry).toContainText('Connecting');
    await page.keyboard.press('Escape');
    await expect(settings(page)).toHaveCount(0);
  } finally {
    release();
  }
  await response;
  await page.unroute('**/api/auth/session');
  // Opening the real Settings again would be blocked by an unsolicited modal.
  await page
    .locator('header.game-header')
    .getByRole('button', { name: 'Settings', exact: true })
    .click();
  await settings(page).locator('[data-account-entry=settings]').click();
  await expect(dialog(page).locator('form')).toHaveAttribute('data-account-action', 'register');
  await page.keyboard.press('Escape');
  await expect(settings(page).locator('[data-account-entry=settings]')).toBeFocused();
});

test('A78 lost recovery request has deliberate retry and invalid code has direct repair', async ({
  page,
  viewport,
}) => {
  test.skip(viewport?.width !== 390, 'One transport sample with a genuinely accepted request.');
  await enter(page, false);
  await page.locator('[data-account-entry=login]').click();
  await dialog(page).getByRole('button', { name: 'Olvidé mi contraseña', exact: true }).click();
  const email = `a78-recovery-lost-${randomUUID()}@example.invalid`;
  await dialog(page).locator('input[name=email]').fill(email);
  await page.route('**/api/auth/request-reset', async (route) => {
    expect((await route.fetch()).status()).toBe(200);
    await route.abort('failed');
  });
  await primary(page).click();
  await expect(dialog(page).getByRole('alert')).toContainText('solicitar el código de nuevo');
  await expect(
    dialog(page).getByRole('button', { name: 'Comprobar sesión', exact: true }),
  ).toHaveCount(0);
  await page.unroute('**/api/auth/request-reset');
  await primary(page).click();
  await expect(dialog(page).locator('form')).toHaveAttribute('data-account-action', 'reset');
  await expect(dialog(page)).toContainText(email);
  await dialog(page).locator('input[name=token]').fill('0'.repeat(64));
  await dialog(page).locator('input[name=password]').fill(password);
  await primary(page).click();
  await expect(dialog(page).getByRole('alert')).toBeVisible();
  await dialog(page).getByRole('button', { name: 'Solicitar otro código', exact: true }).click();
  await expect(dialog(page).locator('input[name=email]')).toHaveValue(email);
  await expect(primary(page)).toHaveAttribute('data-account-action', 'request-reset-submit');
  expect((await page.request.get('/api/state')).status()).toBe(401);
});
