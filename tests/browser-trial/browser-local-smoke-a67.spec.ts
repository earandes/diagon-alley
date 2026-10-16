import { test, expect } from '@playwright/test';
import { startExpedition } from './game-fixture';
/** One isolated short flow. No recording, screenshots, viewport matrix or personal account. */
test('bounded local map and pact cancellation', async ({ page }) => {
  await page.goto('/');
  await page.locator('.portal-enter').click();
  await startExpedition(page, 'es');
  await expect(page.locator('.game-header h1')).toBeVisible();
  const read = async () => (await (await page.request.get('/api/state')).json()).state;
  const initial = await read();
  await page.locator('.map-node > button:enabled').first().click();
  await expect(page.locator('[data-pact-candidate]')).toHaveCount(2);
  await page.locator('[data-pact-candidate]').first().click();
  await expect(page.locator('.node-confirm-action')).toBeEnabled();
  await page.keyboard.press('Escape');
  await expect(page.locator('.node-event-dialog')).toHaveCount(0);
  expect(await read()).toEqual(initial);
});
