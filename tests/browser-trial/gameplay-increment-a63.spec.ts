import { leaveBattle } from './battle-controls';
import { test, expect, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { changeLanguage, startExpedition } from './game-fixture';
import { readGame, reachNode, confirmEvent } from './route-helpers';

const evidence = resolve(
  process.env.A63_EVIDENCE_ROOT ?? 'docs/arcana/gameplay-increment-2026-10-16/evidence/after',
);
async function capture(page: Page, name: string) {
  await mkdir(evidence, { recursive: true });
  for (const size of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
    { width: 865, height: 1079 },
  ]) {
    await page.setViewportSize(size);
    await page.screenshot({
      path: resolve(evidence, `${test.info().project.name}-${name}-${size.width}.png`),
      fullPage: true,
      animations: 'disabled',
    });
  }
  await page.setViewportSize({ width: 1280, height: 900 });
}

test('A63 repeated boss keeps previous stock separate from the new reward', async ({ page }) => {
  await page.goto('/');
  await page.locator('.portal-enter').click();
  await startExpedition(page);
  const win = async () => {
    const id = await reachNode(page, 'boss', 'es');
    await page.locator(`[data-node="${id}"]`).click();
    await confirmEvent(page, 'es');
    await leaveBattle(page);
    await expect(page.locator('[data-expedition-closure="won"]')).toBeVisible();
    return readGame(page);
  };
  const first = await win();
  await page.locator('[data-closure-action="prepare"]').click();
  await startExpedition(page);
  const second = await win();
  const receipt = second.receipts.at(-1);
  expect(receipt?.kind).toBe('advance-node');
  if (receipt?.kind !== 'advance-node') throw Error('Missing boss receipt');
  expect(receipt.firstVictory).toBe(false);
  expect(receipt.reward).toEqual({ crowns: 5, goldKeys: 0, products: [] });
  expect(second.inventory.goldKeys).toBe(first.inventory.goldKeys);
  expect(
    second.inventory.products.filter((p) => p.kind === 'cacao-toad' && p.status === 'available'),
  ).toHaveLength(1);
  await expect(page.locator('.closure-spoils [data-art="product.gold-key"]')).toHaveCount(0);
  await expect(page.locator('[data-closure-action="vault"]')).toBeVisible();
  await capture(page, 'es-closure-repeat');
});

test('A63 earned frog recovers lost response and reload during reveal without another charge', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('.portal-enter').click();
  await startExpedition(page);
  const id = await reachNode(page, 'boss', 'es');
  await page.locator(`[data-node="${id}"]`).click();
  await confirmEvent(page, 'es');
  await leaveBattle(page);
  const before = await readGame(page);
  let posts = 0;
  page.on('request', (r) => {
    if (r.method() === 'POST' && r.url().endsWith('/toads/open')) posts++;
  });
  // Adverse transport fixture only: server really commits, its response is lost.
  await page.route('**/api/toads/open', async (route) => {
    const response = await route.fetch();
    expect(response.ok()).toBe(true);
    await route.abort('failed');
  });
  await page.locator('[data-closure-action="frog"]').click();
  await expect(
    page.getByRole('button', { name: 'Recuperar operación', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.reveal')).toHaveCount(0);
  const committed = await readGame(page);
  expect(committed.copies).toHaveLength(before.copies.length + 1);
  expect(committed.inventory.crowns).toBe(before.inventory.crowns);
  await page.getByRole('button', { name: 'Recuperar operación', exact: true }).click();
  await expect(page.locator('.reveal')).toBeVisible();
  await page.reload();
  await expect(page.locator('.sweetshop-scene')).toBeVisible();
  expect(await readGame(page)).toEqual(committed);
  expect(posts).toBe(1);
  await page.locator('nav').getByRole('button', { name: 'Mapa', exact: true }).click();
  await expect(page.locator('[data-expedition-closure="won"]')).toBeVisible();
  await expect(page.locator('[data-closure-action="frog"]')).toHaveCount(0);
});
for (const language of ['es', 'en'] as const)
  for (const pack of ['diagon-alley', 'arcana'] as const) {
    test(`A63 closing journey uses earned loot then starts deliberately ${language} ${pack}`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.addInitScript(
        (pack) => localStorage.setItem('arcana.presentation.content-pack.v1', pack),
        pack,
      );
      if (pack === 'arcana') await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      if (language === 'en') await changeLanguage(page, language);
      await page.locator('.portal-enter').click();
      await startExpedition(page, language);
      const bossId = await reachNode(page, 'boss', language);
      await page.locator(`[data-node="${bossId}"]`).click();
      await confirmEvent(page, language);
      const won = await readGame(page);
      expect(won.exploration!.run!.status).toBe('won');
      await leaveBattle(page);
      const closure = page.locator('[data-expedition-closure="won"]');
      await expect(closure).toBeVisible();
      await expect(page.locator('.preparation-entry')).toHaveCount(0);
      await expect(closure.locator('[data-closure-action="vault"]')).toHaveClass(/closure-primary/);
      await capture(page, `${pack}-${language}-closure-won`);
      await page.reload();
      await expect(closure).toBeVisible();
      expect(await readGame(page)).toEqual(won);
      await page.locator('header .settings-trigger').click();
      const settings = page.locator('dialog.game-settings[open]');
      await settings
        .getByRole('button', {
          name:
            pack === 'arcana' ? (language === 'es' ? 'Callejón Diagón' : 'Diagon Alley') : 'ARCANA',
          exact: true,
        })
        .click();
      await expect(page.locator('.game-shell')).toHaveAttribute(
        'data-content-pack',
        pack === 'arcana' ? 'diagon-alley' : 'arcana',
      );
      expect(await readGame(page)).toEqual(won);
      await settings
        .getByRole('button', {
          name:
            pack === 'arcana' ? 'ARCANA' : language === 'es' ? 'Callejón Diagón' : 'Diagon Alley',
          exact: true,
        })
        .click();
      await settings
        .getByRole('button', { name: language === 'es' ? 'Cerrar' : 'Close', exact: true })
        .click();

      await closure.locator('[data-closure-action="frog"]').click();
      await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result', {
        timeout: 15000,
      });
      const opened = await readGame(page);
      expect(opened.inventory.crowns).toBe(won.inventory.crowns);
      expect(opened.copies).toHaveLength(won.copies.length + 1);
      expect(opened.receipts.at(-1)?.kind).toBe('open-toad');
      await page.locator('.reveal-continue').click();
      await expect(closure).toBeVisible();
      await expect(closure.locator('[data-closure-action="frog"]')).toHaveCount(0);
      await closure.locator('[data-closure-action="vault"]').click();
      await expect(page.locator('.shop-vault')).toBeVisible();
      await page.locator('.vault-lock-action').click();
      await page
        .getByRole('button', { name: language === 'es' ? 'Cancelar' : 'Cancel', exact: true })
        .click();
      expect(await readGame(page)).toEqual(opened);
      await page.locator('.vault-lock-action').click();
      await page
        .getByRole('button', {
          name: language === 'es' ? 'Confirmar canje' : 'Confirm exchange',
          exact: true,
        })
        .click();
      await expect(page.locator('.commerce-result')).toBeVisible();
      const vault = await readGame(page);
      expect(vault.inventory.goldKeys).toBe((opened.inventory.goldKeys ?? 0) - 1);
      await page
        .locator('nav')
        .getByRole('button', { name: language === 'es' ? 'Mapa' : 'Map', exact: true })
        .click();
      await expect(closure.locator('[data-closure-action="vault"]')).toHaveCount(0);
      await capture(page, `${pack}-${language}-closure-used`);
      await closure.locator('[data-closure-action="prepare"]').click();
      await expect(page.locator('.preparation-dialog[open]')).toBeVisible();
      // Merely opening/cancelling a formation does not start a new expedition.
      expect(await readGame(page)).toEqual(vault);
      await page.keyboard.press('Escape');
      await expect(closure).toBeVisible();
      await expect(closure.locator('[data-closure-action="prepare"]')).toBeFocused();
      await page.locator('.closure-history > summary').click();
      await page.locator('.closure-history .receipt-disclosure > summary').click();
      const historyPrepare = page
        .locator('.closure-history')
        .getByRole('button', {
          name: language === 'es' ? 'Otra expedición' : 'Another expedition',
          exact: true,
        });
      await historyPrepare.click();
      await expect(page.locator('.preparation-dialog[open]')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(historyPrepare).toBeFocused();
      expect(await readGame(page)).toEqual(vault);
      await page.locator('.closure-history > summary').click();
      await closure.locator('[data-closure-action="prepare"]').click();
      await startExpedition(page, language);
      const next = await readGame(page);
      expect(next.exploration!.run!.id).not.toBe(won.exploration!.run!.id);
      expect(next.copies).toEqual(vault.copies);
      expect(next.inventory).toEqual(vault.inventory);
      await page.reload();
      await expect(page.locator('.branch-map')).toBeVisible();
      expect(await readGame(page)).toEqual(next);
      expect(errors).toEqual([]);
    });
  }

for (const language of ['es', 'en'] as const) {
  test(`A63 two tabs dismiss a node resolved elsewhere without another operation ${language}`, async ({
    page,
    context,
  }, info) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    if (language === 'en') await changeLanguage(page, language);
    await page.locator('.portal-enter').click();
    await startExpedition(page, language);
    const nodeId = await reachNode(page, 'chest', language);
    await page.locator(`[data-node="${nodeId}"]`).click();
    await expect(page.locator('.node-event-dialog[open]')).toBeVisible();
    const before = await readGame(page);
    let advances = 0;
    context.on('request', (request) => {
      if (request.method() === 'POST' && request.url().endsWith('/nodes/advance')) advances++;
    });
    const other = await context.newPage();
    other.on('pageerror', (error) => errors.push(error.message));
    try {
      await other.goto('/');
      await expect(other.locator('.branch-map')).toBeVisible();
      // Same isolated browser context shares the real authority session, never the owner's cookies.
      expect((await readGame(other)).playerId).toBe(before.playerId);
      await other.locator(`[data-node="${nodeId}"]`).click();
      await confirmEvent(other, language);
      const committed = await readGame(other);
      expect(committed.revision).toBe(before.revision + 1);
      expect(committed.exploration!.run!.visited.at(-1)).toBe(nodeId);
      expect(committed.inventory.crowns).toBe(before.inventory.crowns + 10);
      expect(
        committed.inventory.products.filter(
          (p) => p.kind === 'random-beans' && p.status === 'available',
        ),
      ).toHaveLength(
        before.inventory.products.filter(
          (p) => p.kind === 'random-beans' && p.status === 'available',
        ).length + 1,
      );
      expect(advances).toBe(1);
      const refreshed = page.waitForResponse(
        (response) =>
          response.url().endsWith('/api/state') && response.request().method() === 'GET',
      );
      await page.bringToFront();
      await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
      await refreshed;
      await expect(page.locator('.node-event-dialog[open]')).toHaveCount(0);
      await expect(page.locator('.node-confirm-action')).toHaveCount(0);
      await expect(page.locator('#content')).toBeFocused();
      expect(await readGame(page)).toEqual(committed);
      expect(advances).toBe(1);
      expect(errors).toEqual([]);
      await info.attach('two-tab-node-authority', {
        body: JSON.stringify(
          {
            language,
            nodeId,
            playerId: before.playerId,
            revisionBefore: before.revision,
            revisionAfter: committed.revision,
            advancePosts: advances,
            refreshedStateExact: true,
            pageErrors: errors,
          },
          null,
          2,
        ),
        contentType: 'application/json',
      });
    } finally {
      await other.close();
    }
  });
}
