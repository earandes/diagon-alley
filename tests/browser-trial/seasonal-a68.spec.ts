import { test, expect } from '@playwright/test';
import { startExpedition, changeLanguage } from './game-fixture';
import { readGame, confirmEvent, expectMapFits } from './route-helpers';
import { preparedRoutePath } from '../support/prepared-route';
import { Pool } from 'pg';
import { PostgresGameTransactions } from '../../src/arcana/infrastructure/postgres/game-transactions';
import { gameSnapshot } from '../../src/arcana/application/game';
import { previewSeasonalPreparation } from '../../src/arcana/domain/seasonal/events';
/** Linux-only extended seasonal journey. Declared condition fixture is scoped to this fresh account. */
test('seasonal decisions, preparation, history and recovery', async ({ page }, testInfo) => {
  page.setDefaultTimeout(10000);
  const journeyStarted = Date.now();
  // Declared renderer-failure fixture keeps this extended check on the accessible DOM fallback.
  // The previous shorter recorded run exercised the normal renderer.
  if (testInfo.project.metadata.rendererFailure)
    await page.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        type: string,
        ...args: unknown[]
      ) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
        return Reflect.apply(getContext, this, [type, ...args]);
      } as typeof getContext;
    });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/confectionery-*.webp', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('.portal-enter')).toBeEnabled();
  const navigationToReadyMs = await page.evaluate(() => performance.now());
  await page.locator('.portal-enter').click();
  await expect(page.locator('[data-seasonal-open]')).toBeVisible();
  await expect
    .poll(() =>
      page.locator('[data-seasonal-open]').evaluate((button) => {
        const box = button.getBoundingClientRect();
        return button.contains(
          document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2),
        );
      }),
    )
    .toBe(true);
  await page.locator('.seasonal-invitation-art img').dispatchEvent('error');
  await expect(page.locator('.seasonal-lantern-fallback')).toBeVisible();
  const before = await readGame(page);
  await page.locator('[data-seasonal-open]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-seasonal-dialog]')).toBeVisible();
  await expect(page.locator('[data-seasonal-window]')).toHaveCount(3);
  await page.keyboard.press('Escape');
  expect(await readGame(page)).toEqual(before);
  await expect(page.locator('[data-seasonal-open]')).toBeFocused();
  await page.locator('[data-seasonal-open]').click();
  await page.locator('[data-seasonal-join]').click();
  await expect.poll(async () => (await readGame(page)).seasonal?.participations.length).toBe(1);
  expect((await readGame(page)).inventory).toEqual(before.inventory);
  await page.keyboard.press('Escape');
  await startExpedition(page, 'es');
  const initial = await readGame(page);
  await page.locator('.map-node > button[data-node-state="available"]').first().click();
  await expect(page.locator('[data-pact-candidate]')).toHaveCount(2);
  await page.locator('[data-pact-candidate]').first().click();
  await expect(page.locator('.node-confirm-action')).toBeEnabled();
  await page.keyboard.press('Escape');
  expect(await readGame(page)).toEqual(initial);
  const path = preparedRoutePath(initial.exploration!.run!, 'boss');
  const timings: number[] = [];
  for (const [i, id] of path.slice(0, 5).entries()) {
    await page.locator(`[data-node="${id}"]`).click();
    await confirmEvent(page, 'es');
    const result = (await readGame(page)).receipts.at(-1);
    if (result?.kind === 'advance-node' && result.battle) {
      const skip = page.getByRole('button', { name: 'Omitir reproducción', exact: true });
      if (await skip.isEnabled()) await skip.click();
      await page.getByRole('button', { name: 'Volver al mapa', exact: true }).click();
    }
    if (i >= 1) {
      if (i === 2) {
        // Declared condition fixture, only this fresh isolated player's active run.
        // No public cheat endpoint, inventory grant, route or economic modification.
        const pool = new Pool({
          host: '127.0.0.1',
          port: 55432,
          user: 'arcana_dev',
          password: 'arcana-local-development',
          database: 'arcana_dev',
          max: 1,
          connectionTimeoutMillis: 3000,
        });
        try {
          await new PostgresGameTransactions(pool).transact(before.playerId, (current) =>
            gameSnapshot({
              ...current,
              revision: current.revision + 1,
              exploration: {
                ...current.exploration!,
                run: {
                  ...current.exploration!.run!,
                  members: current.exploration!.run!.members.map((m) => ({
                    ...m,
                    unit: { ...m.unit, hp: m.unit.maxHp * 0.75, mana: m.unit.maxMana },
                  })),
                },
              },
            }),
          );
        } finally {
          await pool.end();
        }
        await page.getByRole('button', { name: 'Actualizar Energía', exact: true }).click();
        await expect
          .poll(async () => page.locator('.hud .energy-status button').isEnabled())
          .toBe(true);
        const draftBefore = await readGame(page);
        await page.locator('[data-seasonal-open]').click();
        await page.locator('[data-seasonal-choice="prepare"]').tap();
        await expect(page.locator('.seasonal-trade-preview')).toBeVisible();
        await page.keyboard.press('Escape');
        expect(await readGame(page)).toEqual(draftBefore);
        await page.locator('[data-seasonal-open]').click();
        await page.locator('[data-seasonal-choice="prepare"]').tap();
        const projection = previewSeasonalPreparation(draftBefore.exploration!.run!.members);
        await page.locator('[data-seasonal-confirm="prepare"]').click();
        await expect(page.locator('[data-seasonal-last-action="prepare"]')).toBeVisible();
        const prepared = await readGame(page);
        expect(prepared.exploration!.run!.members).toEqual(projection.members);
        expect(prepared.inventory).toEqual(draftBefore.inventory);
        expect(prepared.seasonal?.participations[0].completedObjectiveIds).toHaveLength(1);
        await page.keyboard.press('Escape');
        continue;
      }
      await page.locator('[data-seasonal-open]').click();
      await page.locator('[data-seasonal-choice="dispel"]').tap();
      const started = Date.now();
      await page.locator('[data-seasonal-confirm="dispel"]').click();
      await expect(page.locator('[data-seasonal-window][data-lit="true"]')).toHaveCount(
        i === 1 ? 1 : i - 1,
      );
      timings.push(Date.now() - started);
      await page.keyboard.press('Escape');
    }
  }
  const completed = await readGame(page);
  expect(completed.seasonal?.keepsakes).toHaveLength(1);
  await expectMapFits(page);
  await changeLanguage(page, 'en');
  await page.locator('header').getByRole('button', { name: 'Settings', exact: true }).click();
  await page
    .locator('dialog.game-settings')
    .getByRole('button', { name: 'ARCANA', exact: true })
    .click();
  await page
    .locator('dialog.game-settings')
    .getByRole('button', { name: 'Close', exact: true })
    .click();
  await page.locator('[data-seasonal-open]').click();
  await expect(page.locator('[data-seasonal-keepsake]')).toBeVisible();
  await expect(page.locator('[data-seasonal-dialog]')).toContainText('shines again');
  expect(await readGame(page)).toEqual(completed);
  await page.keyboard.press('Escape');
  await page.reload();
  await page.locator('[data-seasonal-open]').click();
  await expect(page.locator('[data-seasonal-keepsake]')).toBeVisible();
  expect(await readGame(page)).toEqual(completed);
  console.log(
    JSON.stringify({
      a68ActionToUsableMs: timings,
      navigationToReadyMs,
      completeJourneyMs: Date.now() - journeyStarted,
      scope:
        'one context, one viewport, reduced, lantern error-handler fixture and blocked facade image, keyboard cancel, ES/EN and pack switch; no media',
    }),
  );
});
