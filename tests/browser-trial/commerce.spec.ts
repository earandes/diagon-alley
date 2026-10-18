import { inspectPreparationCopy, closePreparation } from './game-fixture';
import { startExpedition } from './game-fixture';
import { changeLanguage } from './game-fixture';
import { pathTo, confirmEvent } from './route-helpers';
import { test, expect } from './game-fixture';
for (const language of ['es', 'en'] as const)
  test(`forge, equip and spend a boss key atomically in ${language}`, async ({ page }) => {
    const en = language === 'en',
      button = (es: string, english: string) =>
        page.getByRole('button', { name: en ? english : es, exact: true });
    const read = async () => (await (await page.request.get('/api/state')).json()).state;
    await page.goto('/');
    if (en) await changeLanguage(page, 'en');
    await button('Jugar como invitado', 'Play as guest').click();
    await button('Bazar', 'Bazaar').click();
    await button('Taller de Varitas', 'Wand Workshop').click();
    await page
      .getByRole('group', { name: en ? 'Wood' : 'Madera', exact: true })
      .locator('[data-visual-value="birch"]')
      .click();
    await page
      .getByRole('group', { name: en ? 'Core' : 'Núcleo', exact: true })
      .locator('[data-visual-value="dragon"]')
      .click();
    const before = await read();
    await button('Forjar varita · 15 Coronas', 'Forge wand · 15 Crowns').click();
    await changeLanguage(page, en ? 'es' : 'en');
    await changeLanguage(page, language);
    expect(await read()).toEqual(before);
    await button('Cancelar', 'Cancel').click();
    await expect(button('Forjar varita · 15 Coronas', 'Forge wand · 15 Crowns')).toBeFocused();
    expect(await read()).toEqual(before);
    await button('Forjar varita · 15 Coronas', 'Forge wand · 15 Crowns').click();
    await button('Confirmar forja', 'Confirm forge').click();
    await expect(
      page.getByRole('heading', { name: en ? 'Confirmed wand' : 'Varita confirmada', exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: en ? 'Confirmed wand' : 'Varita confirmada', exact: true }),
    ).toBeFocused();
    const forged = await read(),
      gear = forged.inventory.equipment.find(
        (e: { id: string }) =>
          !before.inventory.equipment.some((old: { id: string }) => old.id === e.id),
      );
    expect(forged.inventory.crowns).toBe(before.inventory.crowns - 15);
    await page.locator('.shop-result-kit').click();
    await inspectPreparationCopy(page);
    await button('Varita para copia 1', 'Wand for copy 1').click();
    await page
      .getByRole('group', { name: en ? 'Wand for copy 1' : 'Varita para copia 1', exact: true })
      .locator(`[data-equipment-id="${gear.id}"]`)
      .click();
    await expect.poll(async () => (await read()).team.loadouts[0].wandId).toBe(gear.id);
    await closePreparation(page);
    await button('Mapa', 'Map').click();
    await startExpedition(page, language);
    for (const id of await pathTo(page, 'boss')) {
      await page.locator(`[data-node="${id}"]`).click();
      await confirmEvent(page, language);
      if (
        (await read()).exploration.run.status === 'active' &&
        (await button('Volver al mapa', 'Back to map').count())
      )
        await button('Volver al mapa', 'Back to map').click();
    }
    await expect(
      page.getByRole('heading', { name: en ? 'Combat Arena' : 'Arena de Combate', exact: true }),
    ).toBeVisible();
    await button('Volver al mapa', 'Back to map').click();
    await button('Bazar', 'Bazaar').click();
    await button('Bóvedas de Obsidiana', 'Obsidian Vaults').click();
    const boss = await read();
    expect(boss.inventory.goldKeys).toBe(1);
    await button('Abrir bóveda · 1 Llave de Oro', 'Open vault · 1 Gold Key').click();
    await button('Cancelar', 'Cancel').click();
    expect(await read()).toEqual(boss);
    await button('Abrir bóveda · 1 Llave de Oro', 'Open vault · 1 Gold Key').click();
    await button('Confirmar canje', 'Confirm exchange').click();
    await expect(
      page.getByRole('heading', {
        name: en ? 'Confirmed vault loot' : 'Botín de bóveda confirmado',
        exact: true,
      }),
    ).toBeVisible();
    const opened = await read();
    expect(opened.inventory.goldKeys).toBe(0);
    expect(opened.inventory.equipment.length).toBe(boss.inventory.equipment.length + 1);
    expect(opened.inventory.products.length).toBe(boss.inventory.products.length + 2);
    await expect(button('Abrir bóveda · 1 Llave de Oro', 'Open vault · 1 Gold Key')).toBeDisabled();
    await page.reload();
    await button('Bazar', 'Bazaar').click();
    await button('Taller de Varitas', 'Wand Workshop').click();
    expect(await read()).toEqual(opened);
  });
