import { selectedA75 } from './selected-evidence';
import { test, expect, type Page } from '../browser-trial/game-fixture';
import { changeLanguage } from '../browser-trial/game-fixture';
import type { GameState } from '../../src/arcana/application/game';

test.use({ baseURL: 'http://127.0.0.1:5520' });
test.beforeEach(async ({ browserName, viewport }) => {
  test.skip(
    browserName !== 'chromium' || viewport?.width !== 390,
    'Recovery contracts are scoped to Chromium mobile; other matrices cover the scene.',
  );
});
async function enter(page: Page, language: 'es' | 'en') {
  await page.goto('/');
  if (language === 'en') await changeLanguage(page, language);
  await page.locator('.portal-enter').click();
  await expect(page.locator('[data-preparation-inspect]').first()).toBeVisible();
}
async function inspectGear(page: Page) {
  await page.locator('[data-preparation-inspect]').first().click();
  const inspector = page.locator('.preparation-inspection[open]');
  await expect(inspector).toBeVisible();
  await inspector.locator('.preparation-gear-slot').first().click();
  return inspector;
}
async function read(page: Page): Promise<GameState> {
  return (await (await page.request.get('/api/state')).json()).state;
}
for (const language of ['es', 'en'] as const) {
  test(`A75 ${language} entry is exclusive from activation through authority load`, async ({
    page,
  }) => {
    await page.goto('/');
    if (language === 'en') await changeLanguage(page, language);
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    let posts = 0;
    await page.route('**/api/trial/session', async (route) => {
      posts++;
      await held;
      await route.continue();
    });
    const entry = page.locator('.portal-enter');
    try {
      await entry.click();
      await expect(entry).toBeDisabled();
      await expect(
        page.getByRole('status').filter({ hasText: language === 'es' ? 'Entrando' : 'Entering' }),
      ).toBeVisible();
      await page.keyboard.press('Enter');
      await entry.dispatchEvent('click');
      await expect.poll(() => posts).toBe(1);
    } finally {
      release();
    }
    await expect(page.locator('[data-preparation-inspect]').first()).toBeVisible();
    const game = await read(page);
    expect(game.playerId).toMatch(/^trial-/);
    expect(game.receipts.map((receipt) => receipt.kind)).toEqual(['starter-kit']);
    expect(posts).toBe(1);
  });

  test(`A75 ${language} failed entry permits one deliberate new attempt`, async ({ page }) => {
    await page.goto('/');
    if (language === 'en') await changeLanguage(page, language);
    let posts = 0;
    await page.route('**/api/trial/session', async (route) => {
      posts++;
      if (posts === 1) await route.fulfill({ status: 503, json: { error: { code: 'STORAGE' } } });
      else await route.continue();
    });
    await page.locator('.portal-enter').click();
    await expect(page.locator('.portal-enter')).toBeEnabled();
    await expect(page.getByRole('alert')).toBeVisible();
    expect(posts).toBe(1);
    await page.locator('.portal-enter').click();
    await expect(page.locator('[data-preparation-inspect]').first()).toBeVisible();
    expect(posts).toBe(2);
  });

  test(`A75 ${language} expired cookie remains actionable after closing the gear inspector`, async ({
    page,
    context,
  }) => {
    await enter(page, language);
    const before = await read(page);
    const inspector = await inspectGear(page);
    // Only this test's isolated session cookie is removed; no production account is touched.
    await context.clearCookies();
    let entryPosts = 0;
    page.on('request', (request) => {
      if (request.method() === 'POST' && request.url().endsWith('/api/trial/session')) entryPosts++;
    });
    await inspector.locator('.preparation-gear-tray button:enabled').first().click();
    const notice = inspector.locator('[data-recovery-notice]');
    await expect(notice).toBeVisible();
    if (language === 'es') await selectedA75(page, 'recovery-inspector');
    await expect(
      notice.getByRole('button', {
        name: language === 'es' ? 'Comprobar sesión' : 'Check session',
      }),
    ).toBeEnabled();
    await page.keyboard.press('Escape');
    await expect(inspector).toHaveCount(0);
    const visibleNotice = page.locator('[data-recovery-notice]:visible').first();
    await expect(visibleNotice).toBeVisible();
    await visibleNotice
      .getByRole('button', { name: language === 'es' ? 'Comprobar sesión' : 'Check session' })
      .click();
    await expect(visibleNotice).toBeVisible();
    expect(entryPosts).toBe(0);
    // The client retains the player's visible roster; reconsulting does not create an account.
    expect(before.playerId).toMatch(/^trial-/);
    await expect(page.locator('[data-preparation-inspect]').first()).toBeVisible();
    if (language === 'es') {
      await visibleNotice.locator('.recovery-new-entry > summary').click();
      await visibleNotice
        .getByRole('button', { name: 'Entrar en otro ensayo', exact: true })
        .click();
      await expect(page.locator('[data-recovery-notice]')).toHaveCount(0);
      await expect.poll(async () => (await read(page)).playerId).not.toBe(before.playerId);
      await expect(page.locator('[data-expedition-preparation="new"]')).toBeVisible();
      await expect(page.locator('.preparation-inspection')).toHaveCount(0);
      await expect(page.locator('.preparation-card[aria-pressed="true"]')).toHaveCount(0);
      await expect(page.locator('[data-preparation-confirm]')).toBeDisabled();
    }
  });

  test(`A75 ${language} uncertain gear commit recovers in the active inspector with the same key`, async ({
    page,
  }) => {
    await enter(page, language);
    const inspector = await inspectGear(page);
    let posts = 0,
      committedKey = '';
    await page.route('**/api/equipment', async (route) => {
      posts++;
      committedKey = route.request().postDataJSON().key;
      const response = await route.fetch();
      expect(response.ok()).toBe(true);
      await route.abort('failed');
    });
    await inspector.locator('.preparation-gear-tray button:enabled').first().click();
    const notice = inspector.locator('[data-recovery-notice]');
    await expect(notice).toBeVisible();
    await expect(
      notice.getByRole('button', {
        name: language === 'es' ? 'Recuperar operación' : 'Recover operation',
        exact: true,
      }),
    ).toBeEnabled();
    const confirmed = await read(page);
    expect(confirmed.receipts.at(-1)?.id).toBe(committedKey);
    const recovery = page.waitForRequest((request) =>
      request.url().endsWith('/api/operations/' + committedKey),
    );
    await notice
      .getByRole('button', {
        name: language === 'es' ? 'Recuperar operación' : 'Recover operation',
        exact: true,
      })
      .click();
    await recovery;
    await expect(inspector.locator('[data-recovery-notice]')).toHaveCount(0);
    expect(await read(page)).toEqual(confirmed);
    expect(posts).toBe(1);
    await expect(inspector).toBeVisible();
  });
}
