import { expect, type Page } from '@playwright/test';

/** Select a concrete unit through the real bounded stock navigator, never mutate its draft. */
export async function chooseBeanJar(page: Page, id: string) {
  const target = page.locator(`[data-bean-id="${id}"]`);
  if (await target.count()) {
    // Historical renderer fixtures can still use a button for each jar.
    if ((await target.evaluate((e) => e.tagName)) === 'BUTTON') await target.click();
    return;
  }
  const current = page.locator('.bean-stock-jar');
  await expect(current).toBeVisible();
  const previous = page.getByRole('button', { name: /^(Tarro anterior|Previous jar)$/ });
  const next = page.getByRole('button', { name: /^(Tarro siguiente|Next jar)$/ });
  const count = Number(await page.locator('.bean-stock-object').getAttribute('data-bean-stock'));
  if (!Number.isInteger(count) || count < 1) throw Error('No available jar navigator');
  for (let i = 0; i < count && (await previous.isEnabled()); i++) {
    const before = await current.getAttribute('data-bean-id');
    await previous.click();
    await expect(current).not.toHaveAttribute('data-bean-id', before!);
  }
  for (let i = 0; i < count; i++) {
    if ((await current.getAttribute('data-bean-id')) === id) return;
    if (!(await next.isEnabled())) break;
    const before = await current.getAttribute('data-bean-id');
    await next.click();
    await expect(current).not.toHaveAttribute('data-bean-id', before!);
  }
  throw Error('Requested fixture jar is not available');
}
