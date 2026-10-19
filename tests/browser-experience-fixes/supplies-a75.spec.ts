import { chooseBeanJar } from '../browser-trial/bean-controls';
import { leaveBattle } from '../browser-trial/battle-controls';
import { test, expect } from '@playwright/test';
import { changeLanguage, startExpedition } from '../browser-trial/game-fixture';
import { readGame, reachNode, confirmEvent } from '../browser-trial/route-helpers';
import { flavourCollection } from '../../src/arcana/application/client/flavour-collection';

// Four isolated authority sessions at most. Existing route helper is a technical QA policy,
// not an observation of a player or a new recommendation inside the application.
test.use({ baseURL: 'http://127.0.0.1:5520' });
for (const language of ['es', 'en'] as const) {
  for (const pack of ['diagon-alley', 'arcana'] as const) {
    test(`A75 bought jar remains stock until explicit duel commit ${language}/${pack}`, async ({
      page,
    }, info) => {
      test.skip(
        info.project.use.browserName !== 'chromium' || info.project.use.viewport?.width !== 390,
        'Authority quota: this journey runs only in Chromium 390.',
      );
      await page.addInitScript(
        (chosen) => localStorage.setItem('arcana.presentation.content-pack.v1', chosen),
        pack,
      );
      await page.goto('/');
      if (language === 'en') await changeLanguage(page, 'en');
      await page.locator('.portal-enter').click();
      await expect(page.locator('[data-expedition-preparation="new"]')).toBeVisible();
      const initial = await readGame(page);
      await page
        .locator('nav button')
        .filter({ has: page.locator('[data-art="ui.shop"]') })
        .click();
      await page.locator('[data-shop="confectionery"]').click();
      await page.locator('[data-product="random-beans"]').click();
      await expect(page.locator('.sweetshop-object[data-product="random-beans"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await page.locator('.sweetshop-scene .counter-buy').click();
      await expect
        .poll(
          async () =>
            (await readGame(page)).inventory.products.filter(
              (p) => p.kind === 'random-beans' && p.status === 'available',
            ).length,
        )
        .toBe(1);
      const purchased = await readGame(page);
      expect(purchased.inventory.crowns).toBe(initial.inventory.crowns - 5);
      const purchasedJar = purchased.inventory.products.find(
        (product) =>
          product.kind === 'random-beans' &&
          !initial.inventory.products.some((prior) => prior.id === product.id),
      )!;
      expect(purchasedJar).toBeTruthy();
      expect(flavourCollection(purchased).every((entry) => !entry.discovered)).toBe(true);
      await page
        .locator('nav button')
        .filter({ has: page.locator('[data-art="ui.map"]') })
        .click();
      await startExpedition(page, language);
      const duelId = await reachNode(page, 'duel', language);
      const before = await readGame(page);
      expect(
        before.exploration!.run!.members.filter((member) => member.source === 'temporary').length,
      ).toBeGreaterThanOrEqual(2);
      const stock = before.inventory.products.filter(
        (product) => product.kind === 'random-beans' && product.status === 'available',
      ).length;
      const jar = before.inventory.products.find((product) => product.id === purchasedJar.id)!;
      expect(jar.status).toBe('available');
      const carrier = before.exploration!.run!.members[0].unit.id;
      const alternate = before.exploration!.run!.members[1].unit.id;
      await page.locator(`[data-node="${duelId}"]`).click();
      const summary = page.locator('.node-event-dialog .boss-supplies > summary');
      await expect(summary).toHaveAttribute('data-bean-stock', String(stock));
      await expect(summary).toHaveAttribute('data-bean-draft', '0');
      await expect(summary).not.toContainText('/');
      await summary.click();
      await chooseBeanJar(page, jar.id);
      await page.locator(`[data-bean-unit="${carrier}"]`).click();
      await expect(summary).toHaveAttribute('data-bean-draft', '1');
      await expect(summary).toHaveAttribute('data-bean-stock', String(stock));
      await page.locator(`[data-bean-unit="${alternate}"]`).click();
      await expect(page.locator(`[data-bean-unit="${carrier}"]`)).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      await expect(page.locator(`[data-bean-unit="${alternate}"]`)).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await page.locator(`[data-bean-unit="${alternate}"]`).click();
      await expect(summary).toHaveAttribute('data-bean-draft', '0');
      await page.locator(`[data-bean-unit="${carrier}"]`).click();
      expect(await readGame(page)).toEqual(before);
      expect(flavourCollection(await readGame(page)).every((entry) => !entry.discovered)).toBe(
        true,
      );
      await page
        .locator('.node-event-dialog')
        .getByRole('button', { name: language === 'es' ? 'Cancelar' : 'Cancel', exact: true })
        .click();
      expect(await readGame(page)).toEqual(before);
      await page.locator(`[data-node="${duelId}"]`).click();
      await expect(summary).toHaveAttribute('data-bean-draft', '0');
      await expect(summary).toHaveAttribute('data-bean-stock', String(stock));
      await summary.click();
      await chooseBeanJar(page, jar.id);
      await page.locator(`[data-bean-unit="${carrier}"]`).click();
      let advancePosts = 0;
      page.on('request', (request) => {
        if (request.method() === 'POST' && request.url().endsWith('/nodes/advance')) advancePosts++;
      });
      if (language === 'es' && pack === 'diagon-alley') {
        // Adverse transport only: the unmodified server commits and its response is lost.
        await page.route('**/api/nodes/advance', async (route) => {
          const response = await route.fetch();
          expect(response.ok()).toBe(true);
          await route.abort('failed');
        });
        await page.locator('.node-confirm-action').click();
        await expect(page.locator('.node-event-dialog [data-recovery-notice]')).toBeVisible();
        await expect(
          page.locator('.node-event-dialog').getByRole('button', {
            name: 'Recuperar operación',
            exact: true,
          }),
        ).toBeEnabled();
        const committed = await readGame(page);
        expect(committed.inventory.products.find((p) => p.id === jar.id)?.status).toBe('consumed');
        await page
          .locator('.node-event-dialog')
          .getByRole('button', { name: 'Recuperar operación', exact: true })
          .click();
        await expect(page.locator('.node-event-dialog')).toHaveCount(0);
      } else {
        await confirmEvent(page, language);
      }
      await expect(page.locator('.battle-panel')).toBeVisible();
      const after = await readGame(page);
      const receipt = [...after.receipts]
        .reverse()
        .find((candidate) => candidate.kind === 'advance-node');
      if (receipt?.kind !== 'advance-node' || !receipt.battle)
        throw Error('Missing confirmed duel receipt');
      expect(receipt.request.assignments).toEqual([{ unitId: carrier, beanId: jar.id }]);
      expect(after.inventory.products.find((p) => p.id === jar.id)).toMatchObject({
        status: 'consumed',
        operationId: receipt.id,
      });
      expect(
        after.inventory.products.filter(
          (product) => product.kind === 'random-beans' && product.status === 'available',
        ),
      ).toHaveLength(
        stock - 1 + receipt.reward.products.filter((kind) => kind === 'random-beans').length,
      );
      for (const product of before.inventory.products.filter((product) => product.id !== jar.id))
        expect(after.inventory.products.find((candidate) => candidate.id === product.id)).toEqual(
          product,
        );
      expect(after.inventory.essence.points).toBe(before.inventory.essence.points - 5);
      expect(after.receipts.filter((candidate) => candidate.id === receipt.id)).toHaveLength(1);
      const activations = receipt.battle.events.filter(
        (event) => event.kind === 'bean-activated' && event.unitId === jar.id,
      );
      expect(activations).toHaveLength(1);
      if (activations[0].kind !== 'bean-activated') throw Error('Missing activation');
      expect(activations[0].actorId).toBe(carrier);
      const discovered = flavourCollection(after).filter((entry) => entry.discovered);
      expect(discovered).toHaveLength(1);
      expect(discovered[0]).toMatchObject({
        flavour: activations[0].flavour,
        activations: 1,
        firstDiscovery: { operationId: receipt.id, beanUnitId: jar.id },
      });
      expect(advancePosts).toBe(1);
      // Reload recovers the same committed log/consumption; querying never replays an operation.
      await page.reload();
      await expect(page.locator('.battle-panel')).toBeVisible();
      expect(await readGame(page)).toEqual(after);
      expect(advancePosts).toBe(1);
      // The arena deliberately folds the navigation dock. Return through its
      // real exit before consulting the discovered flavour in the collection.
      await leaveBattle(page);
      await expect(page.locator('.battle-panel')).toHaveCount(0);
      await page
        .locator('nav button')
        .filter({ has: page.locator('[data-art="ui.collection"]') })
        .click();
      await expect(page.locator('.flavour-cabinet [data-discovered="true"]')).toHaveCount(1);
      await expect(
        page.locator(
          `.flavour-cabinet [data-discovered="true"] [data-art="product.bean-${activations[0].flavour}"]`,
        ),
      ).toBeVisible();
      await expect(page.locator('.flavour-cabinet [data-discovered="false"]')).toHaveCount(3);
      expect(await readGame(page)).toEqual(after);
    });
  }
}
