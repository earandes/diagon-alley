import { test, expect } from '@playwright/test';
import { startExpedition, changeLanguage } from '../../../../tests/browser-trial/game-fixture';
import { reachNode, confirmEvent, readGame } from '../../../../tests/browser-trial/route-helpers';
import { writeFile } from 'node:fs/promises';
const root = 'docs/arcana/gameplay-increment-2026-10-16/evidence/after';
for (const language of ['es', 'en'] as const) {
 test(`contextual beans complete journey ${language}`, async ({ page }, testInfo) => {
  const engine = testInfo.project.name;
  const en = language === 'en';
  const errors: string[] = []; page.on('pageerror', (e) => errors.push(e.message));
  const b = (es: string, eng: string) => page.getByRole('button', { name: en ? eng : es, exact: true });
  const shot = async (id: string) => { for (const width of [390, 1280]) { await page.setViewportSize({ width, height: width === 390 ? 844 : 900 }); await page.screenshot({ path: `${root}/${language}${engine === 'webkit' ? '-webkit' : ''}-prep-${id}-${width}.png`, fullPage: true, animations: 'disabled' }); } await page.setViewportSize({ width: 390, height: 844 }); };
  await page.goto('/'); if (en) await changeLanguage(page, 'en');
  await b('Comenzar ensayo local', 'Start local trial').click();
  await b('Callejón', 'Diagon Alley').click();
  await page.locator('[data-shop="confectionery"]').click();
  await b('Grageas de Todos los Sabores', 'Every Flavour Beans').click();
  await b('Comprar Grageas de Todos los Sabores · 5 Galeones', 'Buy Every Flavour Beans · 5 Galleons').click();
  await expect.poll(async () => (await readGame(page)).inventory.products.filter((p) => p.kind === 'random-beans' && p.status === 'available').length).toBe(1);
  const bought = await readGame(page);
  await page.locator('.bean-prepare-action').click();
  await expect(page.locator('.preparation-beans-destination')).toBeVisible();
  await expect(page.locator('[data-prepare-combat]')).toHaveCount(0);
  await shot('no-combat');
  await page.keyboard.press('Escape');
  await expect(page.locator('.bean-prepare-action')).toBeFocused();
  expect(await readGame(page)).toEqual(bought);
  await b('Mapa', 'Map').click();
  await startExpedition(page, language);
  for (let i = 0; i < 2; i++) { const state = await readGame(page); const run = state.exploration!.run!; const node = run.graph.nodes.find((n) => n.kind === 'pact' && !run.visited.includes(n.id) && (run.visited.length === 0 ? n.row === 0 : run.graph.nodes.find((n) => n.id === run.visited.at(-1))!.next.includes(n.id)))!; await page.locator(`[data-node="${node.id}"]`).click(); await confirmEvent(page, language); }
  const duel = await reachNode(page, 'duel', language);
  await b('Callejón', 'Diagon Alley').click(); await page.locator('[data-shop="confectionery"]').click();
  await b('Grageas de Todos los Sabores', 'Every Flavour Beans').click(); await page.locator('.bean-prepare-action').click();
  await shot('combat-destination');
  if (await page.locator(`[data-prepare-combat="${duel}"]`).count()) await page.locator(`[data-prepare-combat="${duel}"]`).click();
  else { await page.locator('.preparation-beans-destination > button').click(); await page.locator(`[data-node="${duel}"]`).click(); }
  await expect(page.locator('.node-confirm-action')).toBeVisible();
  await page.locator('.node-team-prepare').click();
  await expect(page.locator('.preparation-dialog [data-active-synergy="alchemy"]')).toBeVisible();
  await shot('formation');
  await page.locator('.preparation-position button').first().click();
  await expect(page.locator('.preparation-inspection[open]')).toBeVisible();
  await page.locator('.preparation-gear-slot').first().click();
  await shot('equipment');
  await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  const summary = page.locator('.node-bean-preparation > summary'); await summary.click();
  const before = await readGame(page); const bean = before.inventory.products.find((p) => p.kind === 'random-beans' && p.status === 'available')!;
  const [one, two] = before.exploration!.run!.members;
  await page.locator(`[data-bean-id="${bean.id}"]`).click(); await page.locator(`[data-bean-unit="${one.unit.id}"]`).click();
  await page.locator(`[data-bean-unit="${two.unit.id}"]`).click(); await expect(page.locator(`[data-bean-unit="${one.unit.id}"]`)).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator(`[data-bean-unit="${two.unit.id}"]`)).toHaveAttribute('aria-pressed', 'true');
  await shot('assigned');
  for (const selector of ['.node-confirm-action', '.node-cancel-action']) { const box = await page.locator(selector).boundingBox(); expect(box!.y).toBeGreaterThanOrEqual(0); expect(box!.y + box!.height).toBeLessThanOrEqual(844); }
  expect(await readGame(page)).toEqual(before);
  console.log('changing assignment language');
  await changeLanguage(page, en ? 'es' : 'en'); await expect(page.locator(`[data-bean-unit="${two.unit.id}"]`)).toHaveAttribute('aria-pressed', 'true'); await changeLanguage(page, language);
  console.log('cancel draft');
  await b('Cancelar', 'Cancel').click(); expect(await readGame(page)).toEqual(before);
  await page.locator(`[data-node="${duel}"]`).click(); await page.locator('.node-bean-preparation > summary').click(); await expect(page.locator(`[data-bean-unit="${two.unit.id}"]`)).toHaveAttribute('aria-pressed', 'false');
  await page.locator(`[data-bean-id="${bean.id}"]`).click(); await page.locator(`[data-bean-unit="${two.unit.id}"]`).click();
  console.log('confirm combat');
  await confirmEvent(page, language);
  const after = await readGame(page); expect(after.inventory.products.find((p) => p.id === bean.id)!.status).toBe('consumed');
  expect(after.inventory.essence.points).toBe(before.inventory.essence.points - 5);
  const receipt = after.receipts.findLast((r) => r.kind === 'advance-node' && r.battle)!;
  expect(receipt.kind === 'advance-node' && receipt.request.assignments).toEqual([{ unitId: two.unit.id, beanId: bean.id }]);
  await page.reload(); expect(await readGame(page)).toEqual(after);
  await b('Omitir reproducción', 'Skip playback').click();
  await b('Volver al mapa', 'Back to map').click();
  await b('Álbum de Cromos', 'Card Album').click(); await expect(page.locator('.flavour-cabinet')).toBeVisible(); await shot('flavour');
  await page.locator('.album-prepare-link').click(); await expect(page.locator('.preparation-dialog[open]')).toBeVisible(); await page.keyboard.press('Escape'); await expect(page.locator('.album-prepare-link')).toBeFocused();
  await b('Mapa', 'Map').click(); await page.locator('.team-prepare').click(); await expect(page.locator('.preparation-dialog[open]')).toBeVisible(); await page.keyboard.press('Escape'); await expect(page.locator('.team-prepare')).toBeFocused();
  expect(await readGame(page)).toEqual(after);
  expect(errors).toEqual([]);
  await writeFile(`docs/arcana/gameplay-increment-2026-10-16/evidence/${language}-${engine}-preparation-observations.json`, JSON.stringify({ errors, before, after, realOperations: after.revision - 1 }, null, 2));
 });
}

test('revision from saved equipment invalidates a prior bean draft', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Comenzar ensayo local', exact: true }).click();
  await startExpedition(page, 'es');
  for (let i = 0; i < 2; i++) { const game = await readGame(page); const run = game.exploration!.run!; const node = run.graph.nodes.find((n) => n.kind === 'pact' && !run.visited.includes(n.id) && (run.visited.length === 0 ? n.row === 0 : run.graph.nodes.find((n) => n.id === run.visited.at(-1))!.next.includes(n.id)))!; await page.locator(`[data-node="${node.id}"]`).click(); await confirmEvent(page, 'es'); }
  const duel = await reachNode(page, 'duel', 'es');
  await page.getByRole('button', { name: 'Callejón', exact: true }).click(); await page.locator('[data-shop="confectionery"]').click(); await page.getByRole('button', { name: 'Grageas de Todos los Sabores', exact: true }).click(); await page.getByRole('button', { name: 'Comprar Grageas de Todos los Sabores · 5 Galeones', exact: true }).click();
  await expect.poll(async () => (await readGame(page)).inventory.products.some((p) => p.kind === 'random-beans' && p.status === 'available')).toBe(true);
  await page.getByRole('button', { name: 'Mapa', exact: true }).click(); await page.locator(`[data-node="${duel}"]`).click(); await page.locator('.node-bean-preparation > summary').click();
  const before = await readGame(page); const bean = before.inventory.products.find((p) => p.kind === 'random-beans' && p.status === 'available')!; const unit = before.exploration!.run!.members[0].unit.id;
  await page.locator(`[data-bean-id="${bean.id}"]`).click(); await page.locator(`[data-bean-unit="${unit}"]`).click(); await expect(page.locator(`[data-bean-unit="${unit}"]`)).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.node-team-prepare').click(); await page.locator('.preparation-position button').first().click(); await page.locator('.preparation-gear-slot').first().click(); await page.locator('.preparation-gear-tray').getByRole('button', { name: 'Sin equipar', exact: true }).click();
  await expect.poll(async () => (await readGame(page)).revision).toBe(before.revision + 1);
  await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  await expect(page.locator(`[data-bean-unit="${unit}"]`)).toHaveAttribute('aria-pressed', 'false');
  const after = await readGame(page); expect(after.inventory.products).toEqual(before.inventory.products); expect(after.inventory.crowns).toBe(before.inventory.crowns); expect(after.inventory.essence).toEqual(before.inventory.essence); expect(after.copies).toEqual(before.copies);
  expect(after.team!.loadouts.find((l) => l.copyId === unit)!.wandId).toBe(null);
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click(); expect(await readGame(page)).toEqual(after);
  await writeFile('docs/arcana/gameplay-increment-2026-10-16/evidence/preparation-revision-observations.json', JSON.stringify({ beforeRevision: before.revision, afterRevision: after.revision, assignmentsReset: true, noConsumption: true }, null, 2));
});
