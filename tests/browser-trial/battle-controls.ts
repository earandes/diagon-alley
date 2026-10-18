import { expect, type Page } from '@playwright/test';

/** Real user navigation for A86. No forced clicks, hidden actions or replay mutation. */
export async function openBattleOptions(page: Page) {
  if (!(await page.locator('.arena-pause').count())) return; // Frozen pre-A86 reference UI.
  const options = page.locator('#arena-options');
  if (!(await options.isVisible())) await page.locator('.arena-pause').click();
  await expect(options).toBeVisible();
}
export async function closeBattleOptions(page: Page) {
  if (await page.locator('#arena-options').isVisible())
    await page.locator('.arena-options-close').click();
}
export async function pauseBattle(page: Page) {
  if (await page.locator('.arena-pause').count()) {
    await page.locator('.arena-pause').click();
    await closeBattleOptions(page);
  } else await page.getByRole('button', { name: /^(Pausa|Pause)$/ }).click();
}
export async function resumeBattle(page: Page) {
  await openBattleOptions(page);
  if (await page.locator('.arena-pause').count())
    await page.locator('.replay-controls button').first().click();
  else await page.getByRole('button', { name: 'Auto', exact: true }).click();
}
export async function skipBattle(page: Page) {
  await openBattleOptions(page);
  const skip = page.locator('.replay-controls button').last();
  if (await skip.isEnabled()) await skip.click();
  else await closeBattleOptions(page);
}
export async function toggleBattleSpeed(page: Page) {
  await openBattleOptions(page);
  await page.getByRole('button', { name: '2x', exact: true }).click();
  await closeBattleOptions(page);
}
export async function inspectBattleRecord(page: Page) {
  await openBattleOptions(page);
  await page.locator('.arena-record-trigger').click();
}
export async function leaveBattle(page: Page) {
  const resultAction = page.locator('.arena-caption button');
  if (await resultAction.isVisible()) await resultAction.click();
  else if (await page.locator('.arena-pause').count()) {
    await openBattleOptions(page);
    await page.locator('.arena-exit').click();
  } else await page.getByRole('button', { name: /^(Volver al mapa|Back to map)$/ }).click();
}
