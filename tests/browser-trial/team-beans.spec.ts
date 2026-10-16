import { inspectPreparationCopy, closePreparation } from './game-fixture';
import { startExpedition } from './game-fixture';
import { openAlbumFilters } from './game-fixture';
import { changeLanguage } from './game-fixture';
import { reachNode, confirmEvent } from './route-helpers';
import { test, expect } from './game-fixture';
for (const language of ['es', 'en'] as const) {
  test(`Album discovery, preparation equipment and bean confirmation in ${language}`, async ({
    page,
  }) => {
    const en = language === 'en';
    const button = (es: string, english: string) =>
      page.getByRole('button', { name: en ? english : es, exact: true });
    const read = async () => (await (await page.request.get('/api/state')).json()).state;
    await page.goto('/');
    if (en) await changeLanguage(page, 'en');
    await button('Comenzar ensayo local', 'Start local trial').click();
    await button('Cromodex', 'Chromodex').click();
    await openAlbumFilters(page);
    await page
      .getByRole('group', { name: en ? 'Rarity filter' : 'Filtro de rareza', exact: true })
      .locator('[data-visual-value=\"epic\"]')
      .click();
    await expect(
      page.getByRole('heading', {
        name: en ? 'Alchemy Apprentice' : 'Aprendiz de Alquimia',
        exact: true,
      }),
    ).toHaveCount(0);
    await page
      .getByRole('group', {
        name: en ? 'Discovery filter' : 'Filtro de descubrimiento',
        exact: true,
      })
      .locator('[data-visual-value="discovered"]')
      .click();
    await expect(
      page.getByText(
        en ? 'No cards match these filters.' : 'Ningún cromo coincide con estos filtros.',
        { exact: true },
      ),
    ).toBeVisible();
    await page
      .getByRole('group', { name: en ? 'Rarity filter' : 'Filtro de rareza', exact: true })
      .locator('[data-visual-value=\"all\"]')
      .click();
    await page.locator('.album-prepare-link').click();
    await inspectPreparationCopy(page);
    await button('Varita para copia 1', 'Wand for copy 1').click();
    const wand = page.getByRole('group', {
      name: en ? 'Wand for copy 1' : 'Varita para copia 1',
      exact: true,
    });
    await wand
      .getByRole('button', { name: en ? 'Unequipped' : 'Sin equipar', exact: true })
      .click();
    await expect(
      wand.getByRole('button', { name: en ? 'Unequipped' : 'Sin equipar', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(async () => (await read()).team.loadouts[0].wandId).toBe(null);
    await page.reload();
    // The album remains underneath preparation; reload restores that route and saved equipment.
    await button('Cromodex', 'Chromodex').click();
    await page.locator('.album-prepare-link').click();
    await inspectPreparationCopy(page);
    await button('Varita para copia 1', 'Wand for copy 1').click();
    await expect(
      wand.getByRole('button', { name: en ? 'Unequipped' : 'Sin equipar', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await wand.locator('[data-equipment-id="starter:wand"]').click();
    await expect.poll(async () => (await read()).team.loadouts[0].wandId).toBe('starter:wand');
    await closePreparation(page);
    await button('Bazar', 'Bazaar').click();
    await page.locator('[data-shop="confectionery"]').click();
    await button('Grageas del Azar', 'Chance Beans').click();
    await button('Comprar Grageas del Azar · 5 Coronas', 'Buy Chance Beans · 5 Crowns').click();
    await expect
      .poll(
        async () =>
          (await read()).inventory.products.filter(
            (p: { kind: string }) => p.kind === 'random-beans',
          ).length,
      )
      .toBe(1);
    await button('Mapa', 'Map').click();
    await startExpedition(page, language);
    for (const id of ['pasaje:0:0', 'pasaje:1:0']) {
      await page.locator(`[data-node="${id}"]`).click();
      await confirmEvent(page, language);
    }
    const duelId = await reachNode(page, 'duel', language);
    await page.locator(`[data-node="${duelId}"]`).click();
    await expect(page.locator('.event-opponents > div > img')).toHaveCount(3);
    await expect
      .poll(() =>
        page
          .locator('.event-opponents > div > img')
          .evaluateAll((images) =>
            images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
          ),
      )
      .toBe(true);
    await expect(page.locator('.node-bean-preparation')).not.toHaveAttribute('open', '');
    const confirmBox = await page.locator('.node-confirm-action').boundingBox();
    expect(confirmBox!.y + confirmBox!.height).toBeLessThan(844);
    await page.locator('.node-bean-preparation > summary').click();
    const before = await read();
    const bean = before.inventory.products.find((p: { kind: string }) => p.kind === 'random-beans');
    const unit = before.exploration.run.members[0].unit.id;
    await page.locator(`[data-bean-id="${bean.id}"]`).click();
    await page.locator(`[data-bean-unit="${unit}"]`).click();
    const otherUnit = before.exploration.run.members[1].unit.id;
    await page.locator(`[data-bean-unit="${otherUnit}"]`).click();
    await expect(page.locator(`[data-bean-unit="${unit}"]`)).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await expect(page.locator(`[data-bean-unit="${otherUnit}"]`)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.locator(`[data-bean-unit="${unit}"]`).click();
    await changeLanguage(page, en ? 'es' : 'en');
    await expect(page.locator(`[data-bean-unit="${unit}"]`)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await changeLanguage(page, language);
    await button('Cancelar', 'Cancel').click();
    expect(await read()).toEqual(before);
    await page.locator(`[data-node="${duelId}"]`).click();
    await page.locator('.node-bean-preparation > summary').click();
    await expect(page.locator(`[data-bean-unit="${unit}"]`)).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await page.locator(`[data-bean-id="${bean.id}"]`).click();
    await page.locator(`[data-bean-unit="${unit}"]`).click();
    await confirmEvent(page, language);
    await expect(
      page.getByRole('heading', { name: en ? 'Combat Arena' : 'Arena de Combate', exact: true }),
    ).toBeVisible();
    const after = await read();
    expect(after.inventory.products.find((p: { id: string }) => p.id === bean.id).status).toBe(
      'consumed',
    );
    expect(after.inventory.essence.points).toBe(before.inventory.essence.points - 5);
    const receipt = after.receipts.find(
      (r: { kind: string; battle?: unknown }) => r.kind === 'advance-node' && r.battle,
    );
    expect(receipt.request.assignments).toEqual([{ unitId: unit, beanId: bean.id }]);
    expect(
      receipt.battle.events.some(
        (e: { kind: string; unitId: string }) =>
          e.kind === 'bean-activated' && e.unitId === bean.id,
      ),
    ).toBe(true);
  });
}
