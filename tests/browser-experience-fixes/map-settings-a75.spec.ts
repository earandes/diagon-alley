import { selectedA75 } from './selected-evidence';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  test,
  expect,
  type Page,
  changeLanguage,
  startExpedition,
} from '../browser-trial/game-fixture';
import { reachNode, confirmEvent } from '../browser-trial/route-helpers';

test.use({ baseURL: 'http://127.0.0.1:5520', hasTouch: true });
test.beforeEach(async ({ browserName, viewport }) => {
  test.skip(
    browserName !== 'chromium' || viewport?.width !== 390,
    'A75 public-route and preference contracts use one Chromium mobile context; other suites cover rendering matrices.',
  );
});
const read = async (page: Page) => (await (await page.request.get('/api/state')).json()).state;
const settings = async (page: Page) => {
  await page.locator('.game-header > .settings-trigger').click();
  const dialog = page.locator('dialog.game-settings[open]');
  await expect(dialog).toBeVisible();
  return dialog;
};
const packPreference = async (page: Page, pack: string) =>
  page.addInitScript((value) => {
    localStorage.setItem('arcana.presentation.content-pack.v1', value);
  }, pack);

for (const pack of ['diagon-alley', 'arcana'])
  for (const language of ['es', 'en'] as const) {
    test(`A75 ${pack} ${language} route book distinguishes branches and consultation never advances`, async ({
      page,
    }) => {
      await packPreference(page, pack);
      await page.goto('/');
      if (language === 'en') await changeLanguage(page, language);
      await page.locator('.portal-enter').click();
      await startExpedition(page, language);
      const before = await read(page);
      let posts = 0;
      page.on('request', (request) => {
        if (request.method() === 'POST') posts++;
      });
      const future = page.locator('[data-node-state="locked"]').first();
      await expect(future).toBeEnabled();
      await future.focus();
      await page.keyboard.press('Enter');
      const inspection = page.locator('dialog.route-inspection[open]');
      await expect(inspection).toBeVisible();
      await expect(inspection).toContainText(language === 'es' ? 'Solo consulta' : 'Read only');
      await expect(inspection.locator('.node-confirm-action')).toHaveCount(0);
      if (language === 'es' && pack === 'diagon-alley') await selectedA75(page, 'route-inspection');
      await page.keyboard.press('Escape');
      await expect(inspection).toHaveCount(0);
      await expect(future).toBeFocused();
      await page.locator('.map-view-toggle').click();
      const entries = page.locator('.route-book-entry');
      expect(await entries.count()).toBe(before.exploration.run.graph.nodes.length);
      const names = await entries
        .locator('[data-node]')
        .evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-label')));
      expect(new Set(names).size).toBe(names.length);
      const branch = entries.filter({ has: page.locator('[data-node-state="locked"]') }).first();
      await branch.locator('summary').tap();
      await expect(branch).toContainText(language === 'es' ? 'Desde' : 'From');
      await expect(branch).toContainText(language === 'es' ? 'Continúa hacia' : 'Continues to');
      await branch.locator('.route-book-inspect').tap();
      await expect(inspection).toBeVisible();
      await inspection.locator('.route-inspection-relations button').first().click();
      await expect(inspection.locator('h2')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(branch.locator('.route-book-inspect')).toBeFocused();
      expect(posts).toBe(0);
      expect(await read(page)).toEqual(before);
    });

    test(`A75 ${pack} ${language} map and list retain visible fallback when both icons fail`, async ({
      page,
    }) => {
      await packPreference(page, pack);
      await page.goto('/');
      if (language === 'en') await changeLanguage(page, language);
      await page.locator('.portal-enter').click();
      await startExpedition(page, language);
      const toggle = page.locator('.map-view-toggle');
      await expect(toggle.locator('img')).toHaveAttribute('data-art', 'ui.missions');
      const missions = await toggle.locator('img').getAttribute('src');
      await toggle.click();
      await expect(toggle.locator('img')).toHaveAttribute('data-art', 'ui.map');
      const map = await toggle.locator('img').getAttribute('src');
      expect(missions).toBeTruthy();
      expect(map).toBeTruthy();
      // These assets may be inlined data: SVGs; HTTP interception cannot fail them.
      // Replace only this control's image with a real 404 and let Artwork's native
      // error handler run. No synthetic success or forced fallback visibility.
      await page.route('**/a75-missing-icon.svg', (route) =>
        route.fulfill({ status: 404, body: '' }),
      );
      const failIcon = async () => {
        await expect(toggle.locator('img')).toBeVisible();
        await toggle.locator('img').evaluate((image) => {
          image.setAttribute('src', '/a75-missing-icon.svg');
        });
      };
      const before = await read(page);
      await page.reload();
      await expect(toggle).toBeVisible();
      await failIcon();
      try {
        await expect(toggle.locator('img')).toHaveCount(0);
      } finally {
        const debug = await toggle.evaluate((e) => ({
          html: e.outerHTML,
          fallback: (() => {
            const s = e.querySelector('.map-view-fallback')!;
            const c = getComputedStyle(s);
            const r = s.getBoundingClientRect();
            return {
              display: c.display,
              visibility: c.visibility,
              opacity: c.opacity,
              width: r.width,
              height: r.height,
            };
          })(),
        }));
        const evidence = resolve('docs/arcana/experience-fixes-2026-10-17/evidence/linux');
        await mkdir(evidence, { recursive: true });
        await writeFile(
          resolve(evidence, `icon-fallback-${pack}-${language}.json`),
          JSON.stringify(
            { sha: process.env.GITHUB_SHA, pack, language, missions, map, debug },
            null,
            2,
          ),
        );
        await test.info().attach('icon-fallback-state', {
          body: JSON.stringify({ pack, language, missions, map, debug }, null, 2),
          contentType: 'application/json',
        });
      }
      await expect(toggle.locator('.map-view-fallback')).toBeVisible();
      await expect(toggle).toHaveText(language === 'es' ? 'Ver lista de nodos' : 'View node list');
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('.route-list')).toBeVisible();
      await failIcon();
      await expect(toggle.locator('img')).toHaveCount(0);
      await expect(toggle.locator('.map-view-fallback')).toBeVisible();
      await expect(toggle).toHaveText(language === 'es' ? 'Ver mapa' : 'View map');
      expect(await read(page)).toEqual(before);
    });
  }

for (const language of ['es', 'en'] as const)
  for (const system of [false, true])
    for (const own of [false, true])
      test(`A75 ${language} actual settings system=${system} own=${own} persists own choice and respects system`, async ({
        page,
      }) => {
        await page.emulateMedia({ reducedMotion: system ? 'reduce' : 'no-preference' });
        await page.addInitScript((initial) => {
          if (localStorage.getItem('arcana-reduced-motion') === null)
            localStorage.setItem('arcana-reduced-motion', String(initial));
        }, own);
        await page.goto('/');
        if (language === 'en') await changeLanguage(page, language);
        await page.locator('.portal-enter').click();
        const before = await read(page);
        let dialog = await settings(page);
        const choice = () => dialog.locator('.settings-motion');
        await expect(choice()).toHaveAttribute('aria-pressed', String(own));
        await expect(dialog.locator('#settings-motion-state')).toHaveAttribute(
          'data-motion-system',
          String(system),
        );
        await expect(dialog.locator('#settings-motion-state')).toHaveAttribute(
          'data-motion-effective',
          String(system || own),
        );
        await choice().click();
        await expect(choice()).toHaveAttribute('aria-pressed', String(!own));
        await expect(page.locator('.game-shell')).toHaveAttribute(
          'data-reduced',
          String(system || !own),
        );
        await dialog
          .getByRole('button', {
            name: language === 'es' ? 'Callejón Diagón' : 'Diagon Alley',
            exact: true,
          })
          .click();
        await expect(choice()).toHaveAttribute('aria-pressed', String(!own));
        await expect(dialog.locator('#settings-motion-state')).toHaveAttribute(
          'data-motion-effective',
          String(system || !own),
        );
        await page.reload();
        dialog = await settings(page);
        await expect(choice()).toHaveAttribute('aria-pressed', String(!own));
        await expect(dialog.locator('#settings-motion-state')).toHaveAttribute(
          'data-motion-effective',
          String(system || !own),
        );
        expect(await read(page)).toEqual(before);
      });

test('A75 settings preference during paused replay never restarts the confirmed log or alters resources', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.locator('.portal-enter').click();
  await startExpedition(page);
  const node = await reachNode(page, 'duel', 'es');
  await page.locator(`[data-node="${node}"]`).click();
  await confirmEvent(page, 'es');
  await page.getByRole('button', { name: 'Pausa', exact: true }).click();
  const arena = page.locator('[data-replay-cursor]');
  const cursor = await arena.getAttribute('data-replay-cursor');
  const before = await read(page);
  const dialog = await settings(page);
  await dialog.locator('.settings-motion').click();
  await expect(page.locator('.game-shell')).toHaveAttribute('data-reduced', 'true');
  await dialog.getByRole('button', { name: 'Cerrar', exact: true }).click();
  const total = await arena.getAttribute('data-replay-total');
  expect(Number(total)).toBeGreaterThanOrEqual(Number(cursor));
  await expect(arena).toHaveAttribute('data-replay-cursor', total!);
  const resumedSettings = await settings(page);
  await resumedSettings.locator('.settings-motion').click();
  await resumedSettings.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await expect(arena).toHaveAttribute('data-replay-cursor', total!);
  expect(await read(page)).toEqual(before);
});
