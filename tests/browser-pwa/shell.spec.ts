import { readFile, writeFile } from 'node:fs/promises';
import { test, expect, changeLanguage } from '../browser-trial/game-fixture';
for (const language of ['es', 'en'] as const)
  test(`PWA shell, offline authority isolation and reconnect in ${language}`, async ({
    page,
    context,
    browserName,
  }) => {
    const en = language === 'en';
    const button = (es: string, english: string) =>
      page.getByRole('button', { name: en ? english : es, exact: true });
    await page.goto('/');
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
    const manifest = await (await page.request.get('/manifest.webmanifest')).json();
    expect(manifest).toMatchObject({ name: 'DIAGON ALLEY', display: 'standalone' });
    for (const size of [192, 512]) {
      const dimensions = await page.evaluate(async (size) => {
        const image = await createImageBitmap(await (await fetch(`/arcana-${size}.png`)).blob());
        return { width: image.width, height: image.height };
      }, size);
      expect(dimensions).toEqual({ width: size, height: size });
    }
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller)
        await new Promise<void>((resolve) =>
          navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), {
            once: true,
          }),
        );
    });
    if (browserName === 'chromium') {
      const cdp = await context.newCDPSession(page);
      const app = await cdp.send('Page.getAppManifest');
      expect(app.errors).toEqual([]);
      if (!app.data) throw Error('Manifest was not read');
      expect(JSON.parse(app.data).name).toBe('DIAGON ALLEY');
      expect((await cdp.send('Page.getInstallabilityErrors')).installabilityErrors).toEqual([]);
      await cdp.detach();
    }
    if (en) await changeLanguage(page, 'en');
    await button('Comenzar ensayo local', 'Start local trial').click();
    await button('Bazar', 'Bazaar').click();
    await page.locator('[data-shop="confectionery"]').click();
    await page.locator('[data-product="random-beans"]').click();
    const buy = button('Comprar Grageas del Azar · 5 Coronas', 'Buy Chance Beans · 5 Crowns');
    await buy.click();
    await expect(page.locator('.bean-prepare-action')).toBeVisible();
    const before = (await (await page.request.get('/api/state')).json()).state;
    expect(
      before.inventory.products.filter(
        (unit: { kind: string; status: string }) =>
          unit.kind === 'random-beans' && unit.status === 'available',
      ),
    ).toHaveLength(1);
    await context.setOffline(true);
    await expect(
      page.getByRole('status').filter({ hasText: en ? 'Offline.' : 'Sin conexión.' }),
    ).toBeVisible();
    await expect(buy).toBeDisabled();
    // Preparation is navigation; only the economic action must be disabled offline.
    await expect(page.locator('.shop-purchase-ticket')).toBeDisabled();
    const api = await page.evaluate(async () => {
      try {
        await fetch('/api/state');
        return 'returned-state';
      } catch {
        return 'network-unavailable';
      }
    });
    expect(api).toBe('network-unavailable');
    await page.reload();
    await expect(
      page.getByRole('heading', {
        name: en ? 'The Hidden Boulevard' : 'El Bulevar Oculto',
        exact: true,
      }),
    ).toBeVisible();
    await expect(button('Comenzar ensayo local', 'Start local trial')).toBeDisabled();
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    const urls = await page.evaluate(async () =>
      (
        await Promise.all(
          (await caches.keys())
            .filter((key) => key.startsWith('arcana-shell-'))
            .map(async (key) =>
              (await (await caches.open(key)).keys()).map((request) => request.url),
            ),
        )
      ).flat(),
    );
    expect(urls.length).toBeGreaterThan(4);
    expect(urls.some((url) => new URL(url).pathname.startsWith('/api/'))).toBe(false);
    expect(urls.some((url) => new URL(url).pathname.endsWith('/index.html'))).toBe(true);
    await context.setOffline(false);
    await expect(page).toHaveURL(/#\/shop\/confectionery$/);
    await expect(
      page.getByRole('heading', {
        name: en ? 'The Enchanted Confectionery' : 'La Confitería Encantada',
        exact: true,
      }),
    ).toBeVisible();
    await page.locator('[data-product="random-beans"]').click();
    await expect(page.locator('.bean-prepare-action')).toBeEnabled();
    await expect(buy).toBeEnabled();
    expect((await (await page.request.get('/api/state')).json()).state).toEqual(before);
  });

test('blocked worker registration retains the normal online game without an unhandled rejection', async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  let blocked = false;
  await context.route('**/service-worker.js', (route) => {
    blocked = true;
    return route.abort();
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Comenzar ensayo local', exact: true }).click();
  await expect(page.locator('.preparation-card').first()).toBeEnabled();
  await expect(page.locator('[data-preparation-confirm]')).toBeDisabled();
  await expect.poll(() => blocked).toBe(true);
  expect(errors).toEqual([]);
});

test('a shell update waits for existing clients and activation preserves other app caches', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), {
          once: true,
        }),
      );
    await caches.open('another-app-pwa-test');
  });
  const path = 'dist/service-worker.js';
  const original = await readFile(path, 'utf8');
  const updated = original.replace(
    /const CACHE_NAME="arcana-shell-[^"]+";/,
    'const CACHE_NAME="arcana-shell-browser-update";',
  );
  expect(updated).not.toBe(original);
  // Native update fetches bypass routing in these engines. Serve a real changed local file and always restore it.
  try {
    await writeFile(path, updated);
    const sameController = await page.evaluate(async () => {
      const controller = navigator.serviceWorker.controller;
      document.body.dataset.pwaUpdateMarker = 'retained';
      await (await navigator.serviceWorker.ready).update();
      return navigator.serviceWorker.controller === controller;
    });
    expect(sameController).toBe(true);
    await expect
      .poll(() => page.evaluate(async () => (await navigator.serviceWorker.ready).waiting?.state))
      .toBe('installed');
    await expect(page.locator('body')).toHaveAttribute('data-pwa-update-marker', 'retained');
    const waiting = await page.evaluate(() => caches.keys());
    expect(waiting.filter((key) => key.startsWith('arcana-shell-'))).toHaveLength(2);
    await page.close();
    const reopened = await context.newPage();
    await reopened.goto('/');
    await expect
      .poll(() => reopened.evaluate(() => caches.keys()))
      .toEqual(['another-app-pwa-test', 'arcana-shell-browser-update']);
  } finally {
    await writeFile(path, original);
  }
});

for (const language of ['es', 'en'] as const)
  test(`lost buy-open response survives offline reload with the original operation in ${language}`, async ({
    page,
    context,
  }) => {
    const en = language === 'en';
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const button = (es: string, english: string) =>
      page.getByRole('button', { name: en ? english : es, exact: true });
    await page.addInitScript(() => {
      const actual = window.fetch.bind(window);
      const testState = { posts: 0, committed: null as unknown };
      (window as unknown as { arcanaPwaTest: typeof testState }).arcanaPwaTest = testState;
      window.fetch = async (...args: Parameters<typeof fetch>) => {
        const [input, options] = args;
        const url = new URL(input instanceof Request ? input.url : String(input), location.href);
        const purchase = url.pathname === '/api/toads/buy-open' && options?.method === 'POST';
        if (purchase) testState.posts++;
        const response = await actual(...args);
        if (purchase && response.ok) {
          testState.committed = await response.clone().json();
          throw new TypeError('Simulated response loss after the real server committed');
        }
        return response;
      };
    });
    await page.goto('/');
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    if (en) await changeLanguage(page, 'en');
    await button('Comenzar ensayo local', 'Start local trial').click();
    await button('Bazar', 'Bazaar').click();
    await page.locator('[data-shop="confectionery"]').click();
    const before = (await (await page.request.get('/api/state')).json()).state;
    await page.locator('.shop-purchase-ticket').click();
    await expect(button('Recuperar operación', 'Recover operation')).toBeVisible();
    const initial = await page.evaluate(
      () =>
        (
          window as unknown as {
            arcanaPwaTest: {
              posts: number;
              committed: {
                state: {
                  revision: number;
                  inventory: { crowns: number; products: { kind: string; status: string }[] };
                  copies: unknown[];
                };
                receipt: { id: string; kind: string };
              } | null;
            };
          }
        ).arcanaPwaTest,
    );
    expect(initial.posts).toBe(1);
    if (!initial.committed) throw Error('Server commitment was not observed');
    const original = initial.committed;
    expect(original.receipt.kind).toBe('buy-open-toad');
    expect(original.state.revision).toBe(before.revision + 1);
    expect(original.state.inventory.crowns).toBe(before.inventory.crowns - 10);
    expect(original.state.copies).toHaveLength(before.copies.length + 1);
    expect(original.state.inventory.products.at(-1)).toMatchObject({
      kind: 'cacao-toad',
      status: 'consumed',
    });
    await expect(page.locator('dialog.reveal')).toHaveCount(0);
    await context.setOffline(true);
    await page.reload();
    await expect(button('Comenzar ensayo local', 'Start local trial')).toBeDisabled();
    await context.setOffline(false);
    await expect(page).toHaveURL(/#\/shop\/confectionery$/);
    // Recovery returns the durable combined result, not an unopened stock unit.
    await expect(page.locator('dialog.reveal')).toHaveAttribute('data-opening-state', 'result');
    const recovered = (await (await page.request.get('/api/state')).json()).state;
    expect(recovered).toEqual(original.state);
    expect(
      recovered.receipts.filter((receipt: { id: string }) => receipt.id === original.receipt.id),
    ).toHaveLength(1);
    expect(
      await page.evaluate(
        () => (window as unknown as { arcanaPwaTest: { posts: number } }).arcanaPwaTest.posts,
      ),
    ).toBe(0);
    await expect(page.locator('main > section[role="alert"]')).toHaveCount(0);
    await page.locator('.reveal-continue').click();
    await expect(
      page.getByRole('heading', {
        name: en ? 'The Enchanted Confectionery' : 'La Confitería Encantada',
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator('.open-frog-action')).toHaveCount(0);
    await expect(page.locator('.shop-purchase-ticket')).toBeEnabled();
    await expect(button('Recuperar operación', 'Recover operation')).toHaveCount(0);
  });
