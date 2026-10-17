import { text } from '../../src/arcana/presentation/translations';
import { startExpedition } from './game-fixture';
import { changeLanguage } from './game-fixture';
import { pathTo, confirmEvent, readGame } from './route-helpers';
import { test, expect } from './game-fixture';
for (const language of ['es', 'en'] as const)
  test(`authority HUD and boss result survives reload in ${language}`, async ({ page }) => {
    const en = language === 'en';
    const button = (es: string, english: string) =>
      page.getByRole('button', { name: en ? english : es, exact: true });
    await page.goto('/');
    if (en) await changeLanguage(page, 'en');
    await button('Comenzar ensayo local', 'Start local trial').click();
    const energy = page.getByRole('meter', {
      name: en ? 'Runic Essence' : 'Esencia Rúnica',
      exact: true,
    });
    await expect(energy).toHaveAttribute('value', '50');
    await startExpedition(page, language);
    await expect(page.locator('.branch-map')).toBeVisible();
    // This checks a saved victory receipt; choose the complete surviving path before branching.
    // Optimizing only to an intermediate encounter can strand this fixture before the boss.
    const path = await pathTo(page, 'boss');
    for (const id of path) {
      const kind = (await readGame(page)).exploration!.run!.graph.nodes.find(
        (n) => n.id === id,
      )!.kind;
      await page.locator(`[data-node="${id}"]`).click();
      const before =
        kind === 'encounter' ? (await (await page.request.get('/api/state')).json()).state : null;
      if (kind === 'encounter') {
        if (await page.locator('[data-encounter-offer]').count()) {
          await expect(
            page.locator('[data-encounter-choice]:not([data-encounter-choice="pass"])'),
          ).toHaveCount(2);
          await expect(page.locator('.node-confirm-action')).toBeDisabled();
        } else {
          await page.locator('.node-help summary').click();
          await expect(page.getByRole('dialog')).toContainText(
            en ? 'This encounter may grant loot' : 'Este encuentro puede entregar botín',
          );
        }
        await button('Cancelar', 'Cancel').click();
        expect((await (await page.request.get('/api/state')).json()).state).toEqual(before);
        await page.locator(`[data-node="${id}"]`).click();
      }
      if (kind === 'boss') {
        const beforeRejection = (await (await page.request.get('/api/state')).json()).state;
        const reject = async (route: import('@playwright/test').Route) =>
          route.fulfill({
            status: 409,
            contentType: 'application/json',
            body: JSON.stringify({
              error: { code: 'INSUFFICIENT_ESSENCE', recoverWithSameKey: false },
            }),
          });
        await page.route('**/api/nodes/advance', reject);
        await page.locator('.node-confirm-action').click();
        await expect(page.getByRole('dialog').getByRole('alert')).toContainText(
          en ? 'There is not enough Runic Essence.' : 'No hay suficiente Esencia Rúnica.',
        );
        expect((await (await page.request.get('/api/state')).json()).state).toEqual(
          beforeRejection,
        );
        await page.unroute('**/api/nodes/advance', reject);
        const nodeDialog = page.locator('dialog.node-event-dialog[open]');
        await nodeDialog
          .getByRole('button', { name: en ? 'Check again' : 'Volver a consultar', exact: true })
          .click();
        // Recovery keeps the same preparation open; a query does not advance or spend.
        await expect(nodeDialog).toBeVisible();
        await expect(nodeDialog).toHaveAttribute('data-event-kind', 'boss');
        await expect(nodeDialog.locator('[data-recovery-notice]')).toHaveCount(0);
        await expect(nodeDialog.locator('.node-confirm-action')).toBeEnabled();
        expect((await (await page.request.get('/api/state')).json()).state).toEqual(
          beforeRejection,
        );
      }
      await confirmEvent(page, language);
      if (
        kind === 'encounter' &&
        (await readGame(page)).receipts.at(-1)?.kind === 'advance-node' &&
        !(
          (await readGame(page)).receipts.at(
            -1,
          ) as import('../../src/arcana/application/run-contracts').NodeReceipt
        ).encounter
      ) {
        const saved = await readGame(page);
        await page.locator('.receipt-disclosure > summary').click();
        await expect(page.locator('.receipt-body')).toContainText(text(language, 'nodePassed'));
        await page.reload();
        await expect(page.locator('.branch-map')).toBeVisible();
        expect(await readGame(page)).toEqual(saved);
        await changeLanguage(page, en ? 'es' : 'en');
        expect(await readGame(page)).toEqual(saved);
        await changeLanguage(page, language);
      } else if (kind === 'encounter') {
        await page.locator('.receipt-disclosure > summary').click();
        const region = page.getByRole('region', {
          name: en ? 'Encounter outcome' : 'Resultado del encuentro',
          exact: true,
        });
        await expect(region).toBeVisible();
        const after = (await (await page.request.get('/api/state')).json()).state;
        const receipt = after.receipts.find(
          (r: { request?: { nodeId?: string } }) => r.request?.nodeId === id,
        );
        const resolution = receipt.encounter.resolution;
        await expect(region).toContainText(resolution.narrative.text[language]);
        await expect(region).toHaveAttribute('data-encounter-effect', resolution.effect.kind);
        expect(after.inventory.essence.points).toBe(before?.inventory.essence.points ?? 50);
        await page.reload();
        await page.locator('.receipt-disclosure > summary').click();
        await expect(region).toContainText(resolution.narrative.text[language]);
        await changeLanguage(page, en ? 'es' : 'en');
        await expect(
          page.getByRole('region', {
            name: en ? 'Resultado del encuentro' : 'Encounter outcome',
            exact: true,
          }),
        ).toContainText(resolution.narrative.text[en ? 'es' : 'en']);
        await changeLanguage(page, language);
        expect((await (await page.request.get('/api/state')).json()).state).toEqual(after);
        await button('Volver a la ruta', 'Return to route').click();
      }
      if (id === 'pasaje:0:0') {
        await expect(
          page.getByRole('region', {
            name: en ? 'Confirmed node result' : 'Resultado de nodo confirmado',
            exact: true,
          }),
        ).toContainText(en ? 'Magic Pact' : 'Pacto Mágico');
        await expect
          .poll(async () =>
            page.locator('.node-result').evaluate((region) => {
              const bounds = region.getBoundingClientRect(),
                nav = document.querySelector('nav')!.getBoundingClientRect();
              return bounds.top >= 0 && bounds.bottom <= nav.top;
            }),
          )
          .toBe(true);
      }
      if (kind === 'duel') await button('Volver al mapa', 'Back to map').click();
    }
    await expect(
      page.getByRole('heading', { name: en ? 'Combat Arena' : 'Arena de Combate', exact: true }),
    ).toBeVisible();
    await button('Volver al mapa', 'Back to map').click();
    await page.locator('.closure-history > summary').click();
    await page.locator('.receipt-disclosure > summary').click();
    const result = page.getByRole('region', {
      name: en ? 'Confirmed node result' : 'Resultado de nodo confirmado',
      exact: true,
    });
    await expect(result).toContainText(en ? '50 Crowns' : '50 Coronas');
    await expect(result).toContainText(en ? '1 Gold Key' : '1 Llave de Oro');
    await expect(result).toContainText(
      en
        ? 'The next location unlock is saved.'
        : 'El desbloqueo de la siguiente localización está guardado.',
    );
    const resolved = await readGame(page);
    const combatCount = resolved.receipts.filter(
      (r) => r.kind === 'advance-node' && r.battle,
    ).length;
    await expect(energy).toHaveAttribute('value', String(50 - combatCount * 5));
    const read = async () => (await (await page.request.get('/api/state')).json()).state;
    const before = await read();
    await button('Actualizar Esencia', 'Refresh Essence').click();
    expect(await read()).toEqual(before);
    await page.reload();
    await page.locator('.closure-history > summary').click();
    await expect(result).toContainText(en ? 'Zone Boss' : 'Jefe de Zona');
    await page.locator('.receipt-disclosure > summary').click();
    await button('Ver combate guardado', 'View saved battle').click();
    await expect(
      page.getByRole('heading', { name: en ? 'Combat Arena' : 'Arena de Combate', exact: true }),
    ).toBeVisible();
    expect(await read()).toEqual(before);
    await button('Volver al mapa', 'Back to map').click();
    await page.locator('.closure-history > summary').click();
    await page.locator('.receipt-disclosure > summary').click();
    await button('Ver localizaciones desbloqueadas', 'View unlocked locations').click();
    await expect(page).toHaveURL(/#\/missions$/);
    await page.reload();
    expect((await read()).exploration.unlockedZones).toContain('bosque');
    await expect(
      page.getByText(en ? 'Forest · coming later' : 'Bosque · próximamente', { exact: true }),
    ).toBeVisible();
    await expect(page.locator('.journey-atlas-page[data-future="true"]')).toContainText(
      en ? 'route not yet available' : 'ruta aún no disponible',
    );
  });
