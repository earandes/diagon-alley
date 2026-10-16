import { changeLanguage } from './game-fixture';
import { test, expect } from './game-fixture';
async function enter(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Comenzar ensayo local', exact: true }).click();
  await page.getByRole('button', { name: 'Bazar', exact: true }).click();
  await page.locator('[data-shop="confectionery"]').click();
}
test('confirmed opening finishes, language does not replay it, and reload retains its real reward', async ({
  page,
}) => {
  await enter(page);
  let openings = 0;
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().endsWith('/api/toads/buy-open')) openings++;
  });
  await page.getByRole('button', { name: 'Comprar y abrir 1 · 10 Coronas', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Cromo confirmado', exact: true })).toBeVisible();
  const server = (await (await page.request.get('/api/state')).json()).state;
  const receipt = server.receipts.find((r: { kind: string }) => r.kind === 'buy-open-toad');
  expect(server.copies.some((c: { copyId: string }) => c.copyId === receipt.copyId)).toBe(true);
  await changeLanguage(page, 'en');
  await expect(page.locator('[data-opening-state]')).toHaveAttribute(
    'data-opening-state',
    'result',
    { timeout: 10_000 },
  );
  await expect(page.getByRole('button', { name: 'Skip animation', exact: true })).toHaveCount(0);
  // A69 keeps the choreography in the reveal theatre; no second confetti layer.
  await expect(page.locator('.opening-theatre')).toHaveCount(1);
  await expect(page.locator('[data-celebration]')).toHaveCount(0);
  await changeLanguage(page, 'es');
  await expect(page.locator('[data-celebration]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Ver en Cromodex', exact: true }).click();
  await expect(page.locator('.reveal')).toHaveCount(0);
  await expect(
    page.locator('.album').getByRole('heading', { name: receipt.wizard.name.es, exact: true }),
  ).toBeVisible();
  await page.reload();
  expect((await (await page.request.get('/api/state')).json()).state).toEqual(server);
  await expect(page.locator('[data-celebration]')).toHaveCount(0);
  expect(openings).toBe(1);
});
test('reduced motion and missing art leave a confirmed result available without celebration', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/*.webp', (route) => route.abort());
  await enter(page);
  await page.getByRole('button', { name: 'Comprar y abrir 1 · 10 Coronas', exact: true }).click();
  await expect(page.locator('[data-opening-state]')).toHaveAttribute(
    'data-opening-state',
    'result',
  );
  await expect(page.getByRole('button', { name: 'Omitir animación', exact: true })).toHaveCount(0);
  await expect(page.locator('[data-celebration]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Ver en Cromodex', exact: true })).toBeVisible();
  const server = (await (await page.request.get('/api/state')).json()).state;
  expect(server.copies).toHaveLength(2);
  await page.reload();
  expect((await (await page.request.get('/api/state')).json()).state).toEqual(server);
});
test('zero balance disables purchases and preserves all confirmed openings', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await enter(page);
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: 'Comprar y abrir 1 · 10 Coronas', exact: true }).click();
    await expect(page.locator('[data-opening-state]')).toHaveAttribute(
      'data-opening-state',
      'result',
    );
    await page.locator('.reveal-continue').click();
    const saved = (await (await page.request.get('/api/state')).json()).state;
    expect(saved.inventory.crowns).toBe(50 - (i + 1) * 10);
    expect(saved.copies).toHaveLength(i + 2);
    expect(
      saved.inventory.products.filter(
        (p: { kind: string; status: string }) => p.kind === 'cacao-toad' && p.status === 'consumed',
      ),
    ).toHaveLength(i + 1);
  }
  const before = (await (await page.request.get('/api/state')).json()).state;
  expect(before.inventory.crowns).toBe(0);
  await expect(
    page.getByRole('button', { name: 'Comprar y abrir 1 · 10 Coronas', exact: true }),
  ).toBeDisabled();
  await expect(page.getByText('Sincronizando estado…', { exact: true })).toHaveCount(0);
  await page.reload();
  expect((await (await page.request.get('/api/state')).json()).state).toEqual(before);
});

test('a definitive server rejection clears synchronization and never grants an optimistic purchase', async ({
  page,
}) => {
  await enter(page);
  const before = (await (await page.request.get('/api/state')).json()).state;
  await page.route('**/api/toads/buy-open', (route) =>
    route.fulfill({
      status: 422,
      contentType: 'application/json',
      body: JSON.stringify({ error: { code: 'INSUFFICIENT_CROWNS', recoverWithSameKey: false } }),
    }),
  );
  await page.getByRole('button', { name: 'Comprar y abrir 1 · 10 Coronas', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByText('Sincronizando estado…', { exact: true })).toHaveCount(0);
  expect((await (await page.request.get('/api/state')).json()).state).toEqual(before);
});
