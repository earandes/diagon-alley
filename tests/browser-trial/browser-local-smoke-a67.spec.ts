import { test, expect } from '@playwright/test';
import { startExpedition, changeLanguage } from './game-fixture';
import { readGame, confirmEvent, expectMapFits } from './route-helpers';
import { preparedRoutePath } from '../support/prepared-route';
/** Sole bounded Mac exception: one Chromium/context/viewport, no media, 30s test/60s watchdog.
 * A68 extends the short journey; no matrices or automated retries. Fresh trial account only. */
test('bounded local pact cancellation and Halloween keepsake journey', async ({ page }) => {
  page.setDefaultTimeout(4000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/confectionery-*.webp', (route) => route.abort());
  await page.goto('/');
  await page.locator('.portal-enter').click();
  await expect(page.locator('[data-seasonal-open]')).toBeVisible();
  await expect
    .poll(() =>
      page.locator('[data-seasonal-open]').evaluate((button) => {
        const box = button.getBoundingClientRect();
        return button.contains(
          document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2),
        );
      }),
    )
    .toBe(true);
  await page.locator('.seasonal-invitation-art img').dispatchEvent('error');
  await expect(page.locator('.seasonal-lantern-fallback')).toBeVisible();
  const before = await readGame(page);
  await page.locator('[data-seasonal-open]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-seasonal-dialog]')).toBeVisible();
  await expect(page.locator('[data-seasonal-window]')).toHaveCount(3);
  await page.keyboard.press('Escape');
  expect(await readGame(page)).toEqual(before);
  await expect(page.locator('[data-seasonal-open]')).toBeFocused();
  await page.locator('[data-seasonal-open]').click();
  await page.locator('[data-seasonal-join]').click();
  await expect.poll(async () => (await readGame(page)).seasonal?.participations.length).toBe(1);
  expect((await readGame(page)).inventory).toEqual(before.inventory);
  await page.keyboard.press('Escape');
  await startExpedition(page, 'es');
  const initial = await readGame(page);
  await page.locator('.map-node > button[data-node-state="available"]').first().click();
  await expect(page.locator('[data-pact-candidate]')).toHaveCount(2);
  await page.locator('[data-pact-candidate]').first().click();
  await expect(page.locator('.node-confirm-action')).toBeEnabled();
  await page.keyboard.press('Escape');
  expect(await readGame(page)).toEqual(initial);
  const path = preparedRoutePath(initial.exploration!.run!, 'boss');
  const timings: number[] = [];
  for (const [i, id] of path.slice(0, 4).entries()) {
    await page.locator(`[data-node="${id}"]`).click();
    await confirmEvent(page, 'es');
    const result = (await readGame(page)).receipts.at(-1);
    if (result?.kind === 'advance-node' && result.battle) {
      const skip = page.getByRole('button', { name: 'Omitir reproducción', exact: true });
      if (await skip.isEnabled()) await skip.click();
      await page.getByRole('button', { name: 'Volver al mapa', exact: true }).click();
    }
    if (i >= 1) {
      await page.locator('[data-seasonal-open]').click();
      await page.locator('[data-seasonal-choice="dispel"]').tap();
      const started = Date.now();
      await page.locator('[data-seasonal-confirm="dispel"]').click();
      await expect(page.locator('[data-seasonal-window][data-lit="true"]')).toHaveCount(i);
      timings.push(Date.now() - started);
      await page.keyboard.press('Escape');
    }
  }
  const completed = await readGame(page);
  expect(completed.seasonal?.keepsakes).toHaveLength(1);
  await expectMapFits(page);
  await changeLanguage(page, 'en');
  await page.locator('header').getByRole('button', { name: 'Settings', exact: true }).click();
  await page
    .locator('dialog.game-settings')
    .getByRole('button', { name: 'ARCANA', exact: true })
    .click();
  await page
    .locator('dialog.game-settings')
    .getByRole('button', { name: 'Close', exact: true })
    .click();
  await page.locator('[data-seasonal-open]').click();
  await expect(page.locator('[data-seasonal-keepsake]')).toBeVisible();
  await expect(page.locator('[data-seasonal-dialog]')).toContainText('shines again');
  expect(await readGame(page)).toEqual(completed);
  await page.keyboard.press('Escape');
  await page.reload();
  await page.locator('[data-seasonal-open]').click();
  await expect(page.locator('[data-seasonal-keepsake]')).toBeVisible();
  expect(await readGame(page)).toEqual(completed);
  console.log(
    JSON.stringify({
      a68ActionToUsableMs: timings,
      scope:
        'one context, one viewport, reduced, lantern error-handler fixture and blocked facade image, keyboard cancel, ES/EN and pack switch; no media',
    }),
  );
});
