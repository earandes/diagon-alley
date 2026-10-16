import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(process.env.ARCANA_CAPTURE_URL ?? 'http://127.0.0.1:5197');
  await page.getByRole('heading', { name: 'Elige tu próximo misterio', exact: true }).waitFor();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    await Promise.all(
      [...document.images]
        .filter((i) => {
          const b = i.getBoundingClientRect();
          return b.top < innerHeight && b.bottom > 0;
        })
        .map((i) => {
          i.loading = 'eager';
          return i.decode().catch(() => {});
        }),
    );
    const background = getComputedStyle(
      document.querySelector('.arcana-shell'),
      '::before',
    ).backgroundImage.match(/url\("?(.*?)"?\)/)?.[1];
    if (background) {
      const image = new Image();
      image.src = background;
      await image.decode();
    }
  });
  const metrics = await page.evaluate(async () => {
    const resources = new Map(
      performance
        .getEntriesByType('resource')
        .filter((r) => !new URL(r.name).pathname.startsWith('/api/'))
        .map((r) => [r.name, r.decodedBodySize]),
    );
    for (const key of (await caches.keys()).filter((k) => k.startsWith('arcana-shell-')))
      for (const request of await (await caches.open(key)).keys()) {
        const response = await (await caches.open(key)).match(request);
        resources.set(request.url, (await response.arrayBuffer()).byteLength);
      }
    return {
      viewport: [innerWidth, innerHeight],
      shellAndVisibleUniqueBytes: [...resources.values()].reduce((a, b) => a + b, 0),
      resources: [...resources].map(([url, bytes]) => ({ url, bytes })),
    };
  });
  await page.getByRole('button', { name: 'Comenzar ensayo local', exact: true }).click();
  await page.getByRole('button', { name: 'Iniciar expedición', exact: true }).click();
  await page.waitForFunction(
    () => document.querySelector('.scene-map')?.dataset.renderer === 'webgl',
  );
  const canvas = page.locator('.scene-map');
  const before = await canvas.getAttribute('data-render-count');
  await page.waitForTimeout(500);
  metrics.mapIdleRenders = { before, after: await canvas.getAttribute('data-render-count') };
  await writeFile(
    'docs/arcana/visual-nodes-2026-10-15/performance.json',
    JSON.stringify(metrics, null, 2),
  );
} finally {
  await browser.close();
}
