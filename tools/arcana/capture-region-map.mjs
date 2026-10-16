import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const baseURL = process.env.ARCANA_CAPTURE_URL ?? 'http://127.0.0.1:5194';
const root = 'docs/arcana/region-map-2026-10-15';
const browser = await chromium.launch();
const results = [];
try {
  for (const language of ['es', 'en']) {
    const context = await browser.newContext({
      baseURL,
      viewport: { width: 1280, height: 900 },
      hasTouch: true,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const btn = (es, en) =>
      page.getByRole('button', { name: language === 'es' ? es : en, exact: true });
    const read = async () => (await (await page.request.get('/api/state')).json()).state;
    const shot = async (name) => {
      await page.evaluate(async () => {
        await document.fonts.ready;
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
      });
      await page.screenshot({
        path: `${root}/capturas/after-${name}-${language}-${page.viewportSize().width}.png`,
      });
    };
    await page.goto('/');
    if (language === 'en') await btn('English', 'English').click();
    await btn('Comenzar ensayo local', 'Start local trial').click();
    await page.locator('[data-team-member]').first().waitFor();
    await shot('landing');
    await btn('Iniciar expedición', 'Start expedition').click();
    await page.locator('.map-scroll canvas').waitFor();
    await shot('route-start');
    for (const id of ['pasaje:0:0', 'pasaje:1:0']) {
      await page.locator(`[data-node="${id}"]`).click();
      await btn('Confirmar nodo', 'Confirm node').click();
      await page.locator('dialog').waitFor({ state: 'detached' });
    }
    await page.locator('[data-team-member]').nth(2).waitFor();
    await page.locator('#content').evaluate((e) => e.scrollIntoView({ block: 'start' }));
    await page.mouse.move(0, 0);
    await shot('route');
    const committed = await read();
    await page.locator('[data-team-member]').first().hover();
    await page.locator('.team-inspector').waitFor();
    await shot('hover-owned');
    await page.keyboard.press('Escape');
    await page.locator('[data-team-member]').nth(2).click();
    await page.locator('.team-inspector').waitFor();
    await shot('inspect-temporary');
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#content').evaluate((e) => e.scrollIntoView({ block: 'start' }));
    await page.mouse.move(0, 0);
    await shot('route');
    await page.locator('[data-team-member]').first().tap();
    await page.locator('.team-inspector').waitFor();
    await shot('touch');
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 320, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('#content').evaluate((e) => e.scrollIntoView({ block: 'start' }));
    await shot('reduced');
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await shot('text200');
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
      throw Error('Overflow');
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '';
    });
    await btn('Ver lista de nodos', 'View node list').click();
    await shot('list');
    await btn('Ver mapa ramificado', 'View branching map').click();
    if (JSON.stringify(await read()) !== JSON.stringify(committed))
      throw Error('Inspection changed authority');
    await page.reload();
    await page.locator('.region-map-art').waitFor();
    if (JSON.stringify(await read()) !== JSON.stringify(committed))
      throw Error('Reload changed authority');
    results.push({
      language,
      previewUnchanged: true,
      reloadUnchanged: true,
      zone: committed.exploration.run.zoneId,
      copies: committed.copies.length,
      team: committed.exploration.run.members.length,
      errors,
    });
    await context.close();
  }
} finally {
  await browser.close();
}
await writeFile(`${root}/capture-observations.json`, JSON.stringify(results, null, 2));
