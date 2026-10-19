import { clickAccountAction, clickAccountControl } from './account-controls';
import { randomUUID } from 'node:crypto';
import { mkdir, readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import type { GameState } from '../../src/arcana/application/game';
import type { PublicContent } from '../../src/arcana/application/public-content';
import { changeLanguage, startExpedition } from '../browser-trial/game-fixture';

type Language = 'es' | 'en';
type Pack = 'diagon-alley' | 'arcana';
const password = 'A76 fictitious passphrase 2026!';
const replacement = 'A76 replacement passphrase 2026!';
const dialog = (page: Page) => page.locator('[data-account-dialog][open]');
const submit = (page: Page, action: string) =>
  dialog(page).locator(`button[data-account-action="${action}-submit"]`);
const labels = (language: Language) => ({
  email: language === 'es' ? 'Correo electrónico' : 'Email',
  password: language === 'es' ? /^(Contraseña|Nueva contraseña)$/ : /^(Password|New password)$/,
  token: language === 'es' ? 'Código' : 'Code',
  haveCode: language === 'es' ? 'Tengo el código' : 'I have the code',
  login: language === 'es' ? 'Iniciar sesión' : 'Sign in',
  forgot: language === 'es' ? 'Olvidé mi contraseña' : 'Forgot password',
  close: language === 'es' ? 'Cerrar' : 'Close',
});

async function welcome(page: Page, language: Language, pack: Pack) {
  // Fixture preference only; the actual language control remains exclusively in Settings.
  await page.addInitScript((pack) => {
    localStorage.setItem('arcana.presentation.content-pack.v1', pack);
  }, pack);
  await page.goto('/');
  await expect(page.locator('[data-account-entry="register"]')).toBeEnabled();
  if (language === 'en') await changeLanguage(page, language);
  await expect(page.locator('[data-content-pack]')).toHaveAttribute('data-content-pack', pack);
}

async function selected(page: Page, name: 'welcome' | 'register' | 'settings-account') {
  if (
    process.platform !== 'linux' ||
    process.env.ARCANA_CAPTURE_A76 !== '1' ||
    test.info().project.name !== 'chromium-390-a76'
  )
    return;
  const directory = resolve('docs/arcana/accounts-2026-10-17/evidence/linux');
  await mkdir(directory, { recursive: true });
  await page.screenshot({ path: resolve(directory, `selected-${name}.png`), fullPage: false });
}

async function mailToken(email: string, purpose: 'verify' | 'reset') {
  const namespace = process.env.ARCANA_ACCOUNTS_A76_NAMESPACE;
  if (!namespace || !/^a76-[a-f0-9-]{36}$/.test(namespace))
    throw Error('Refusing to read a mailbox outside the isolated A76 namespace');
  const directory = resolve('.local/arcana-mail', namespace);
  let token: string | undefined;
  await expect
    .poll(
      async () => {
        const files = await readdir(directory).catch((error: NodeJS.ErrnoException) => {
          if (error.code === 'ENOENT') return [];
          throw error;
        });
        for (const file of files) {
          if (!/^[a-f0-9-]{36}\.json$/.test(file)) continue;
          const value = JSON.parse(await readFile(resolve(directory, file), 'utf8')) as {
            to?: string;
            purpose?: string;
            token?: string;
            expiresAt?: number;
          };
          if (value.to === email && value.purpose === purpose) {
            if (!/^[a-f0-9]{64}$/.test(value.token ?? '')) throw Error('Invalid test mail token');
            token = value.token;
            return true;
          }
        }
        return false;
      },
      { message: 'The private test mailbox receives this fictitious recipient’s message' },
    )
    .toBe(true);
  return token!;
}

async function readGame(page: Page): Promise<GameState> {
  const response = await page.request.get('/api/state');
  expect(response.status()).toBe(200);
  return (await response.json()).state;
}

async function accountFromSettings(page: Page) {
  const settings = page.locator('dialog.game-settings[open]');
  if (!(await settings.count())) {
    const active = page.locator('dialog[open]').last();
    const activeSettings = active.getByRole('button', { name: /^(Ajustes|Settings)$/ });
    const origin = (await activeSettings.count()) ? active : page.locator('header').first();
    await origin.getByRole('button', { name: /^(Ajustes|Settings)$/ }).click();
  }
  await expect(settings).toBeVisible();
  await settings.locator('[data-account-entry="settings"]').click();
  await expect(dialog(page)).toBeVisible();
}

async function dismissSettings(page: Page) {
  const settings = page.locator('dialog.game-settings[open]');
  if (await settings.count()) {
    const close = settings.locator('.settings-close');
    await close.focus();
    await expect(close).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(settings).toHaveCount(0);
  }
}

async function register(page: Page, email: string, language: Language) {
  const words = labels(language);
  await dialog(page).getByLabel(words.email, { exact: true }).fill(email);
  await submit(page, 'register').click();
  await expect(dialog(page).getByRole('status')).toBeVisible();
  const token = await mailToken(email, 'verify');
  await expect(submit(page, 'verify')).toBeVisible();
  await dialog(page).getByLabel(words.token, { exact: true }).fill(token);
  await dialog(page).getByLabel(words.password, { exact: true }).fill(password);
  await expect(dialog(page).getByLabel(words.password, { exact: true })).toHaveAttribute(
    'autocomplete',
    'new-password',
  );
  await submit(page, 'verify').click();
  await expect(dialog(page)).toHaveCount(0);
  await dismissSettings(page);
}

async function signIn(page: Page, email: string, language: Language, value = password) {
  const words = labels(language);
  await dialog(page).getByLabel(words.email, { exact: true }).fill(email);
  await dialog(page).getByLabel(words.password, { exact: true }).fill(value);
  await submit(page, 'login').click();
}

async function purchaseFrogFixture(page: Page) {
  const before = await readGame(page);
  const content = (await (await page.request.get('/api/content')).json()) as PublicContent;
  const response = await page.request.post('/api/toads/buy-open', {
    headers: { Origin: new URL(page.url()).origin },
    data: {
      key: `a76-frog-${randomUUID()}`,
      expectedRevision: before.revision,
      request: {
        priceVersion: content.shop.version,
        catalogVersion: content.catalog.version,
        tableVersion: content.toadTable.version,
      },
    },
  });
  expect(response.status()).toBe(200);
  const state = (await response.json()).state as GameState;
  expect(state.copies).toHaveLength(before.copies.length + 1);
  await page.reload();
  return state;
}

test('A76 first activation excludes double registration through retained response', async ({
  page,
  browserName,
  viewport,
}) => {
  test.skip(browserName !== 'chromium' || viewport?.width !== 390, 'One bounded transport case.');
  await welcome(page, 'es', 'diagon-alley');
  await page.locator('[data-account-entry="register"]').click();
  await dialog(page)
    .getByLabel('Correo electrónico', { exact: true })
    .fill(`a76-exclusive-${randomUUID()}@example.invalid`);
  let posts = 0;
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/api/auth/register', async (route) => {
    posts++;
    await held;
    await route.continue();
  });
  try {
    await submit(page, 'register').click();
    await expect(submit(page, 'register')).toBeDisabled();
    await expect(dialog(page).getByRole('status')).toContainText('Conectando');
    await page.keyboard.press('Enter');
    await submit(page, 'register').dispatchEvent('click');
    await expect.poll(() => posts).toBe(1);
  } finally {
    release();
  }
  await expect(submit(page, 'verify')).toBeEnabled();
  await expect(dialog(page).getByRole('status')).toContainText('Solicitud recibida');
  await page.keyboard.press('Escape');
  await expect(dialog(page)).toHaveCount(0);
  expect((await page.request.get('/api/state')).status()).toBe(401);
  expect(posts).toBe(1);
});

test('A76 missing illustration preserves account labels, actions and keyboard return', async ({
  page,
  browserName,
  viewport,
}) => {
  test.skip(browserName !== 'chromium' || viewport?.width !== 390, 'One bounded missing-art case.');
  await page.route('**/*.{svg,webp,png}', (route) => route.abort('failed'));
  await welcome(page, 'es', 'diagon-alley');
  const entry = page.locator('[data-account-entry="register"]');
  await entry.focus();
  await page.keyboard.press('Enter');
  await expect(dialog(page).getByLabel('Correo electrónico', { exact: true })).toBeVisible();
  await expect(submit(page, 'register')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(entry).toBeFocused();
  expect((await page.request.get('/api/auth/session')).status()).toBe(200);
});

for (const pack of ['diagon-alley', 'arcana'] as const) {
  for (const language of ['es', 'en'] as const) {
    test(`A76 ${language} ${pack} entry forms, focus, cancellation and enlarged text`, async ({
      page,
      browserName,
      viewport,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await welcome(page, language, pack);
      if (language === 'es' && pack === 'diagon-alley') await selected(page, 'welcome');
      let mutations = 0;
      page.on('request', (request) => {
        if (request.method() === 'POST' && new URL(request.url()).pathname.startsWith('/api/'))
          mutations++;
      });
      const registerEntry = page.locator('[data-account-entry="register"]');
      await registerEntry.focus();
      await page.keyboard.press('Enter');
      await expect(dialog(page)).toBeVisible();
      await expect(
        dialog(page).getByLabel(labels(language).email, { exact: true }),
      ).toHaveAttribute('autocomplete', 'email');
      await expect(dialog(page).locator('input[type="password"]')).toHaveCount(0);
      if (language === 'es' && pack === 'diagon-alley') await selected(page, 'register');
      await page.keyboard.press('Escape');
      await expect(dialog(page)).toHaveCount(0);
      await expect(registerEntry).toBeFocused();
      await page.locator('[data-account-entry="login"]').click();
      const passwordInput = dialog(page).getByLabel(labels(language).password, { exact: true });
      await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
      await passwordInput.fill(password);
      await clickAccountAction(page, {
        name: language === 'es' ? 'Mostrar contraseña' : 'Show password',
        exact: true,
      });
      await expect(passwordInput).toHaveAttribute('type', 'text');
      await clickAccountAction(page, { name: labels(language).forgot, exact: true });
      await expect(dialog(page).locator('[data-account-action="request-reset"]')).toBeVisible();
      await clickAccountAction(page, { name: labels(language).haveCode, exact: true });
      await expect(
        dialog(page).getByLabel(labels(language).token, { exact: true }),
      ).toHaveAttribute('autocomplete', 'one-time-code');
      // One deliberate reflow check per project, not an automated capture matrix.
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const geometry = await dialog(page).evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return {
          width: rect.width,
          left: rect.left,
          right: rect.right,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
        };
      });
      expect(geometry.left).toBeGreaterThanOrEqual(-1);
      expect(geometry.right).toBeLessThanOrEqual((viewport?.width ?? 390) + 1);
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
      await page.keyboard.press('Escape');
      await expect(dialog(page)).toHaveCount(0);
      expect(mutations).toBe(0);
      expect((await page.request.get('/api/auth/session')).status()).toBe(200);
      expect((await (await page.request.get('/api/auth/session')).json()).kind).toBe('anonymous');
      expect((await page.request.get('/api/state')).status()).toBe(401);
      // Declared coverage dimensions are attached as text, never secrets or mailbox contents.
      test.info().annotations.push({
        type: 'coverage',
        description: `${browserName}/${viewport?.width}/${language}/${pack}/reduced/reflow200`,
      });
    });

    test(`A76 ${language} ${pack} real account, guest binding, cross-context login and recovery`, async ({
      page,
      browser,
      browserName,
      viewport,
      baseURL,
    }) => {
      test.skip(
        browserName !== 'chromium' || viewport?.width !== 390,
        'Authority journeys are sampled once per language/pack; forms have the full serial matrix.',
      );
      const words = labels(language);
      const firstEmail = `a76-first-${randomUUID()}@example.invalid`;
      const guestEmail = `a76-guest-${randomUUID()}@example.invalid`;
      await welcome(page, language, pack);
      await page.locator('[data-account-entry="register"]').click();
      await register(page, firstEmail, language);
      const created = await readGame(page);
      expect(created.receipts.filter((receipt) => receipt.kind === 'starter-kit')).toHaveLength(1);
      await startExpedition(page, language);
      const firstProgress = await purchaseFrogFixture(page);
      expect(firstProgress.exploration?.run).not.toBeNull();

      const other = await browser.newContext({ baseURL, viewport, serviceWorkers: 'block' });
      try {
        const second = await other.newPage();
        await welcome(second, language, pack);
        await second.locator('[data-account-entry="login"]').click();
        await signIn(second, firstEmail, language);
        await expect(dialog(second)).toHaveCount(0);
        expect(await readGame(second)).toEqual(firstProgress);
        await second.reload();
        expect(await readGame(second)).toEqual(firstProgress);

        await accountFromSettings(page);
        await clickAccountControl(dialog(page).locator('[data-account-action="logout"]'));
        await expect(dialog(page)).toHaveCount(0);
        await dismissSettings(page);
        await expect(page.locator('.portal-enter')).toBeEnabled();
        await page.locator('.portal-enter').click();
        await startExpedition(page, language);
        const guestProgress = await purchaseFrogFixture(page);
        expect(guestProgress.playerId).not.toBe(firstProgress.playerId);
        await accountFromSettings(page);
        await page.keyboard.press('Escape');
        await dismissSettings(page);
        expect(await readGame(page)).toEqual(guestProgress);
        await accountFromSettings(page);
        await register(page, guestEmail, language);
        expect(await readGame(page)).toEqual(guestProgress);
        await page.reload();
        expect(await readGame(page)).toEqual(guestProgress);
        await accountFromSettings(page);
        await expect(dialog(page)).toContainText(guestEmail);
        if (language === 'es' && pack === 'diagon-alley') await selected(page, 'settings-account');
        await clickAccountControl(dialog(page).locator('[data-account-action="logout"]'));
        await expect(dialog(page)).toHaveCount(0);
        await dismissSettings(page);
        await page.locator('[data-account-entry="login"]').click();
        await signIn(page, guestEmail, language);
        await expect(dialog(page)).toHaveCount(0);
        expect(await readGame(page)).toEqual(guestProgress);

        // Economic commit is real; only its transport response is lost in this isolated context.
        await page.goto('/#/shop/confectionery');
        await expect(page.locator('.shop-purchase-ticket')).toBeVisible();
        let posts = 0;
        let committed: GameState | undefined;
        let operationKey = '';
        await page.route('**/api/toads/buy-open', async (route) => {
          posts++;
          operationKey = route.request().postDataJSON().key;
          const response = await route.fetch();
          expect(response.ok()).toBe(true);
          committed = (await response.json()).state;
          await route.abort('failed');
        });
        await page.locator('.shop-purchase-ticket').click();
        await expect.poll(() => committed?.playerId).toBe(guestProgress.playerId);
        await expect(page.locator('[data-recovery-notice]:visible').first()).toHaveAttribute(
          'aria-busy',
          'false',
        );
        expect(committed).toBeDefined();
        await page.context().clearCookies();
        await page.reload();
        await accountFromSettings(page);
        if (!(await dialog(page).locator('form[data-account-action="login"]').count()))
          await clickAccountAction(page, { name: words.login, exact: true });
        await signIn(page, firstEmail, language);
        await expect(dialog(page).getByRole('alert')).toBeVisible();
        await expect(
          dialog(page).getByRole('button', {
            name: language === 'es' ? 'Abrir otra partida guardada' : 'Open another saved game',
            exact: true,
          }),
        ).toHaveCount(0);
        await signIn(page, guestEmail, language);
        await expect(dialog(page)).toHaveCount(0);
        await dismissSettings(page);
        expect(await readGame(page)).toEqual(committed);
        expect(posts).toBe(1);
        const recovered = await page.request.get(`/api/operations/${operationKey}`);
        expect(recovered.status()).toBe(200);
        expect((await recovered.json()).receipt.id).toBe(operationKey);
        expect(
          (await readGame(page)).receipts.filter((receipt) => receipt.id === operationKey),
        ).toHaveLength(1);

        // Reset delivery is the private local mailbox, not a claim about external email delivery.
        await accountFromSettings(page);
        await clickAccountAction(page, {
          name: language === 'es' ? 'Recuperar acceso' : 'Recover access',
          exact: true,
        });
        await dialog(page).getByLabel(words.email, { exact: true }).fill(guestEmail);
        await submit(page, 'request-reset').click();
        await expect(dialog(page).getByRole('status')).toBeVisible();
        const token = await mailToken(guestEmail, 'reset');
        await expect(submit(page, 'reset')).toBeVisible();
        await dialog(page).getByLabel(words.token, { exact: true }).fill(token);
        await dialog(page).getByLabel(words.password, { exact: true }).fill(replacement);
        await submit(page, 'reset').click();
        await expect(dialog(page).locator('[data-account-action="login"]')).toBeVisible();
        expect((await page.request.get('/api/state')).status()).toBe(401);
        await signIn(page, guestEmail, language, replacement);
        await expect(dialog(page)).toHaveCount(0);
        await dismissSettings(page);
        expect(await readGame(page)).toEqual(committed);
        expect(await readGame(second)).toEqual(firstProgress);
      } finally {
        await other.close();
      }
    });
  }
}
