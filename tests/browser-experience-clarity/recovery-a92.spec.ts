import { randomUUID } from 'node:crypto';
import { readdir, readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import type { GameState } from '../../src/arcana/application/game';

const password = 'A92 isolated access passphrase!';
const dialog = (page: Page) => page.locator('[data-account-dialog][open]');

async function createAccount(page: Page) {
  const email = `a92-${randomUUID()}@example.invalid`;
  const headers = { Origin: new URL(page.url()).origin };
  const registered = await page.request.post('/api/auth/register', { headers, data: { email } });
  expect(registered.status()).toBe(200);
  const namespace = process.env.ARCANA_CLARITY_A92_NAMESPACE;
  if (!namespace || !/^(?:a76|a92)-[a-f0-9-]{36}$/.test(namespace))
    throw Error('Isolated A92 mailbox required');
  const directory = resolve('.local/arcana-mail', namespace);
  let token: string | undefined;
  await expect
    .poll(async () => {
      for (const file of await readdir(directory).catch(() => [])) {
        if (!/^[a-f0-9-]{36}\.json$/.test(file)) continue;
        const mail = JSON.parse(await readFile(resolve(directory, file), 'utf8'));
        if (mail.to === email && mail.purpose === 'verify') {
          token = mail.token;
          return true;
        }
      }
      return false;
    })
    .toBe(true);
  const verified = await page.request.post('/api/auth/verify', {
    headers,
    data: { token, password, allowPlayerChange: false },
  });
  expect(verified.status()).toBe(200);
  return email;
}
async function readGame(page: Page): Promise<GameState> {
  const response = await page.request.get('/api/state');
  expect(response.status()).toBe(200);
  return (await response.json()).state;
}
async function login(page: Page, email: string, lang: 'es' | 'en') {
  await dialog(page)
    .getByLabel(lang === 'es' ? 'Correo electrónico' : 'Email', { exact: true })
    .fill(email);
  await dialog(page)
    .getByLabel(lang === 'es' ? 'Contraseña' : 'Password', { exact: true })
    .fill(password);
  await dialog(page).locator('[data-account-action="login-submit"]').click();
}

for (const [lang, pack] of [
  ['es', 'diagon-alley'],
  ['en', 'diagon-alley'],
  ['es', 'arcana'],
  ['en', 'arcana'],
] as const) {
  test(`A92 ${lang}/${pack} expired access returns to the same inspection without replacing the game`, async ({
    page,
    context,
  }, info) => {
    test.skip(
      info.project.name !== 'chromium-390-a92',
      'Authority sampled once per language/pack; other projects cover layout.',
    );
    await page.addInitScript(
      ({ lang, pack }) => {
        localStorage.setItem('arcana-language', lang);
        localStorage.setItem('arcana.presentation.content-pack.v1', pack);
      },
      { lang, pack },
    );
    await page.goto('/');
    // Isolated real account setup via authoritative endpoints, not a simulated earned inventory.
    const email = await createAccount(page);
    await page.reload();
    await page.locator('[data-preparation-inspect]').first().click();
    const inspector = page.locator('.preparation-inspection[open]');
    await expect(inspector).toBeVisible();
    await inspector.locator('.preparation-gear-slot').first().click();
    const before = await readGame(page);
    await context.clearCookies();
    await inspector.locator('.preparation-gear-tray button:enabled').first().click();
    const access = inspector.locator('[data-recovery-sign-in]');
    await expect(access).toBeEnabled();
    await access.focus();
    await page.keyboard.press('Enter');
    await expect(dialog(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(access).toBeFocused();
    await access.click();
    await login(page, email, lang);
    await expect(dialog(page)).toHaveCount(0);
    await expect(inspector).toBeVisible();
    expect(await readGame(page)).toEqual(before);
    await expect(inspector.locator('[data-recovery-notice]')).toHaveCount(0);
    await expect(inspector.locator('.preparation-inspection-close')).toBeFocused();
  });
}

test('A92 a lost economic response keeps its owner across contextual sign-in and reload', async ({
  page,
  context,
  browser,
}, info) => {
  test.skip(
    info.project.name !== 'chromium-390-a92',
    'One bounded real persistence/recovery case.',
  );
  await page.goto('/');
  const email = await createAccount(page);
  await page.reload();
  const foreignContext = await browser.newContext({
    baseURL: 'http://127.0.0.1:5630',
    serviceWorkers: 'block',
  });
  try {
    const foreign = await foreignContext.newPage();
    await foreign.goto('/');
    const otherEmail = await createAccount(foreign);
    await page.goto('/#/shop/confectionery');
    let committed: GameState | undefined,
      key = '',
      posts = 0;
    await page.route('**/api/toads/buy-open', async (route) => {
      posts++;
      key = route.request().postDataJSON().key;
      const response = await route.fetch();
      expect(response.ok()).toBe(true);
      committed = (await response.json()).state;
      await route.abort('failed');
    });
    await page.locator('.shop-purchase-ticket').click();
    await expect.poll(() => !!committed).toBe(true);
    await expect(page.locator('[data-recovery-notice]:visible').first()).toHaveAttribute(
      'aria-busy',
      'false',
    );
    await context.clearCookies();
    await page.reload();
    const access = page.locator('[data-recovery-sign-in]:visible').first();
    await expect(access).toBeEnabled();
    await access.click();
    await login(page, otherEmail, 'es');
    await expect(dialog(page).getByRole('alert')).toBeVisible();
    expect((await page.request.get('/api/state')).status()).toBe(401);
    await login(page, email, 'es');
    await expect(dialog(page)).toHaveCount(0);
    expect(await readGame(page)).toEqual(committed);
    expect(posts).toBe(1);
    expect((await readGame(page)).receipts.filter((r) => r.id === key)).toHaveLength(1);
    const recovered = await page.request.get(`/api/operations/${key}`);
    expect(recovered.status()).toBe(200);
    expect((await recovered.json()).receipt.id).toBe(key);
    await page.reload();
    expect(await readGame(page)).toEqual(committed);
    if (process.platform === 'linux' && process.env.ARCANA_CAPTURE_A92 === '1') {
      const out = resolve(
        process.env.A92_EVIDENCE_ROOT ?? 'docs/arcana/experience-clarity-2026-10-19/evidence/linux',
      );
      await mkdir(out, { recursive: true });
      // No capture of credentials or mailbox. Only the recovered game is visible.
      await page.screenshot({ path: resolve(out, 'recovered-game.png'), fullPage: false });
    }
  } finally {
    await foreignContext.close();
  }
});
