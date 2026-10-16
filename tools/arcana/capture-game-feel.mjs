import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const directory = 'docs/arcana/game-feel-2026-10-14';
const baseURL = process.env.ARCANA_CAPTURE_URL ?? 'http://127.0.0.1:5195';
const browser = await chromium.launch();
const observations = [];
try {
for (const language of ['es', 'en']) {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const button = (es, en) => page.getByRole('button', { name: language === 'es' ? es : en, exact: true });
  const state = async () => (await (await page.request.get('/api/state')).json()).state;
  const capture = async (name) => {
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.querySelectorAll('img')].filter(img => {
        const b = img.getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0;
      }).map(img => { img.loading = 'eager'; return img.decode().catch(() => {}); }));
    });
    await page.screenshot({ path: `${directory}/capturas/after-${name}-${language}-${page.viewportSize().width}.png` });
  };
  await page.goto(baseURL);
  if (language === 'en') await button('English', 'English').click();
  await button('Comenzar ensayo local', 'Start local trial').click();
  await page.locator('.team-unit').waitFor();
  await capture('map');
  const initial = await state();
  await button('Cromodex', 'Chromodex').click();
  await capture('collection');
  await button('Bazar', 'Bazaar').click();
  await capture('shop');
  if (JSON.stringify(await state()) !== JSON.stringify(initial)) throw Error('Reading changed authority');
  await button('Mapa', 'Map').click();
  await button('Iniciar expedición', 'Start expedition').click();
  await page.locator('.map-scroll canvas').waitFor();
  await capture('route');
  for (const id of ['pasaje:0:0', 'pasaje:1:0', 'pasaje:2:0']) {
    await page.locator(`[data-node="${id}"]`).click();
    await button('Confirmar nodo', 'Confirm node').click();
    await page.locator('dialog').waitFor({ state: 'detached' });
  }
  await page.locator('.arena-stage .scene-canvas[data-art-ready="true"]').waitFor();
  await capture('arena');
  await button('Volver al mapa', 'Back to map').click();
  await page.locator('#content').evaluate(el => el.scrollIntoView({ block: 'start' }));
  await capture('coven');
  await button('Bazar', 'Bazaar').click();
  await button('Comprar Sapo de Cacao · 10 Coronas', 'Buy Cocoa Toad · 10 Crowns').click();
  await page.locator('.operation-feedback:not([hidden])').waitFor();
  await page.locator('#content').evaluate(el => el.scrollIntoView({ block: 'start' }));
  await capture('purchase');
  await button('Abrir un Sapo de Cacao', 'Open a Cocoa Toad').click();
  await page.locator('[data-opening-state="result"]').waitFor();
  await capture('reward');
  await button('Cromodex', 'Chromodex').click();
  await page.getByRole('group', {name:language === 'es' ? 'Filtro de descubrimiento' : 'Discovery filter',exact:true}).locator('[data-visual-value="discovered"]').click();
  await page.locator('.card').first().evaluate(el => el.scrollIntoView({ block: 'start' }));
  await capture('owned');
  const committed = await state();
  await page.reload();
  await page.locator('.collection-progress').waitFor();
  if (JSON.stringify(await state()) !== JSON.stringify(committed)) throw Error('Reload changed authority');
  await page.setViewportSize({ width: 320, height: 844 });
  await capture('collection');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await capture('text200');
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error('Overflow');
  await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
  await page.setViewportSize({ width: 1280, height: 900 });
  await button('Mapa', 'Map').click();
  await page.locator('#content').evaluate(el => el.scrollIntoView({ block: 'start' }));
  await capture('coven');
  await button('Bazar', 'Bazaar').click();
  await button('Taller de Varitas', 'Wand Workshop').click();
  await capture('workshop');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await button('Cromodex', 'Chromodex').click();
  await capture('reduced');
  observations.push({ language, initial: { crowns: initial.inventory.crowns, copies: initial.copies.length },
    final: { crowns: committed.inventory.crowns, copies: committed.copies.length, visited: committed.exploration.run.visited },
    navigationUnchanged: true, reloadUnchanged: true, errors });
  await context.close();
}
} finally { await browser.close(); }
await writeFile(`${directory}/capture-observations.json`, JSON.stringify(observations, null, 2));
