import { startExpedition } from './game-fixture';
import { changeLanguage } from './game-fixture';
import { test, expect } from './game-fixture';
import { readGame, reachNode, confirmEvent } from './route-helpers';
import { mkdir, writeFile } from 'node:fs/promises';
const legacyRoot = process.env.ARCANA_NODES_EVIDENCE_ROOT ?? 'docs/arcana/pokelike-2026-10-15/legacy';
const evidence = `${legacyRoot}/captures`;
test.beforeAll(async () => { await mkdir(evidence, { recursive: true }); });
for (const language of ['es', 'en'] as const) {
  test(`A56 full map, six silhouettes and stable route ${language}`, async ({ page }, info) => {
    await page.goto('/');
    if (language === 'en') await changeLanguage(page, 'en');
    await page
      .getByRole('button', {
        name: language === 'es' ? 'Comenzar ensayo local' : 'Start local trial',
        exact: true,
      })
      .click();
    await startExpedition(page, language);
    await expect(page.locator('.branch-map canvas')).toBeVisible();
    const before = await readGame(page);
    expect(before.exploration!.run!.routeGeneration?.version).toBe(1);
    const profiles = [];
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
      { width: 320, height: 640 },
      { width: 320, height: 568 },
      { width: 844, height: 390 },
    ]) {
      await page.setViewportSize(viewport);
      await expect
        .poll(() =>
          page.locator('.branch-map').evaluate((element) => {
            const map = element.getBoundingClientRect(),
              header = document.querySelector('header')!.getBoundingClientRect(),
              nav = document.querySelector('nav')!.getBoundingClientRect();
            return {
              fillsMainView: map.height >= innerHeight / 2,
              fitsBetweenChrome: map.top >= header.bottom && map.bottom <= nav.top + 1,
            };
          }),
        )
        .toEqual({ fillsMainView: true, fitsBetweenChrome: true });
      await expect
        .poll(() =>
          page.locator('.map-node').evaluateAll((nodes) =>
            nodes.every((n) => {
              const r = n.getBoundingClientRect(),
                map = document.querySelector('.branch-map')!.getBoundingClientRect();
              return r.x >= 0 && r.right <= innerWidth && r.y >= map.top && r.bottom <= map.bottom;
            }),
          ),
        )
        .toBe(true);
      const layout = await page.evaluate(() => {
        const header = document.querySelector('header')!.getBoundingClientRect();
        const controls = [...document.querySelectorAll('header .settings-trigger')].map((e) => {
          const r = e.getBoundingClientRect();
          return {
            name: e.getAttribute('aria-label'),
            top: r.top,
            bottom: r.bottom,
            right: r.right,
            headerTop: header.top,
            headerBottom: header.bottom,
          };
        });
        const obstacles = [
          ...document.querySelectorAll(
            '.expedition-heading h2,.guide-help > summary,.expedition-guide small,.team-token',
          ),
        ];
        const overlaps = [...document.querySelectorAll('[data-node]')].flatMap((node) => {
          const a = node.getBoundingClientRect();
          return obstacles
            .filter((obstacle) => {
              const b = obstacle.getBoundingClientRect();
              return !(
                a.right <= b.left ||
                a.left >= b.right ||
                a.bottom <= b.top ||
                a.top >= b.bottom
              );
            })
            .map((obstacle) => ({
              node: node.getAttribute('data-node'),
              obstacle: obstacle.className || obstacle.tagName,
              text: obstacle.textContent?.slice(0, 60),
              nodeBox: node.getBoundingClientRect().toJSON(),
              obstacleBox: obstacle.getBoundingClientRect().toJSON(),
            }));
        });
        return { viewport: [innerWidth, innerHeight], controls, overlaps };
      });
      await writeFile(
        `${legacyRoot}/map-layout-${info.project.use.browserName}-${language}.json`,
        JSON.stringify(layout, null, 2),
      );
      await expect
        .poll(() =>
          page.evaluate(() => {
            const header = document.querySelector('header')!.getBoundingClientRect();
            const contained = [...document.querySelectorAll('header .settings-trigger')].every(
              (e) => {
                const r = e.getBoundingClientRect();
                return r.top >= header.top && r.bottom <= header.bottom && r.right <= innerWidth;
              },
            );
            const obstacles = [
              ...document.querySelectorAll(
                '.expedition-heading h2,.guide-help > summary,.expedition-guide small,.team-token',
              ),
            ].map((e) => {
              const range = document.createRange();
              range.selectNodeContents(e);
              return e.tagName === 'H2' ? range.getBoundingClientRect() : e.getBoundingClientRect();
            });
            const clear = [...document.querySelectorAll('[data-node]')].every((e) => {
              const a = e.getBoundingClientRect();
              return obstacles.every(
                (b) =>
                  a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom,
              );
            });
            return contained && clear;
          }),
        )
        .toBe(true);
      const profile = await page.evaluate(() => {
        const map = document.querySelector('.map-scroll')!,
          rect = map.getBoundingClientRect();
        return {
          viewport: [innerWidth, innerHeight],
          document: [document.documentElement.scrollWidth, document.documentElement.scrollHeight],
          map: [rect.width, rect.height, map.scrollWidth, map.scrollHeight],
          nodes: document.querySelectorAll('[data-node]').length,
          assets: [
            ...new Set(
              [...document.querySelectorAll('[data-node] img')].map((n) =>
                n.getAttribute('data-art'),
              ),
            ),
          ],
        };
      });
      expect(profile.document).toEqual([viewport.width, viewport.height]);
      expect(profile.map[2]).toBe(profile.map[0]);
      expect(profile.map[3]).toBe(profile.map[1]);
      expect(profile.nodes).toBe(16);
      expect(profile.assets).toHaveLength(6);
      for (const node of await page.locator('[data-node]').all()) {
        const box = await node.boundingBox();
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
      profiles.push(profile);
      await mkdir(evidence, { recursive: true });
      await page.screenshot({
        path: `${evidence}/${info.project.use.browserName}-${language}-${viewport.width}x${viewport.height}.png`,
      });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.arcana-shell')).toHaveAttribute('data-reduced', 'true');
    await expect(page.locator('.scene-canvas')).toHaveAttribute('data-render-count', /^\d+$/);
    const idle = await page.locator('.scene-canvas').getAttribute('data-render-count');
    await page.waitForTimeout(500);
    expect(await page.locator('.scene-canvas').getAttribute('data-render-count')).toBe(idle);
    await page.reload();
    await expect(page.locator('.branch-map')).toBeVisible();
    expect(await readGame(page)).toEqual(before);
    await info.attach('map-profiles', {
      body: JSON.stringify(profiles, null, 2),
      contentType: 'application/json',
    });
  });
  for (const kind of ['refuge', 'encounter', 'chest'] as const)
    test(`A56 ${kind} visual decision and persistence ${language}`, async ({ page }, info) => {
      const button = (es: string, en: string) =>
        page.getByRole('button', { name: language === 'es' ? es : en, exact: true });
      await page.goto('/');
      if (language === 'en') await changeLanguage(page, 'en');
      await button('Comenzar ensayo local', 'Start local trial').click();
      await startExpedition(page, language);
      const id = await reachNode(page, kind, language),
        before = await readGame(page);
      await page.locator(`[data-node="${id}"]`).click();
      await expect(page.locator(`[data-preparation="${kind}"]`)).toBeVisible();
      if (kind === 'refuge') await page.locator('[data-visual-value="focus"]').click();
      if (kind === 'encounter') await page.locator('[data-visual-value="pass"]').click();
      await mkdir(evidence, { recursive: true });
      await page.screenshot({
        path: `${evidence}/${info.project.use.browserName}-${language}-${kind}.png`,
      });
      expect(await readGame(page)).toEqual(before);
      await confirmEvent(page, language);
      const after = await readGame(page),
        receipt = after.receipts.at(-1)!;
      expect(receipt.kind).toBe('advance-node');
      if (receipt.kind !== 'advance-node') throw Error('Wrong receipt');
      if (kind === 'encounter') {
        expect(receipt.encounter).toBeNull();
        expect(after.inventory).toEqual(before.inventory);
        expect(receipt.request.encounterAction).toBe('pass');
      }
      if (kind === 'refuge') {
        expect(receipt.request.refugeAction).toBe('focus');
        expect(after.exploration!.run!.members.map((m) => m.unit.mana)).toEqual(
          before.exploration!.run!.members.map((m) =>
            m.unit.hp > 0
              ? Math.min(m.unit.maxMana, m.unit.mana + m.unit.maxMana * 0.4)
              : m.unit.mana,
          ),
        );
        expect(after.inventory).toEqual(before.inventory);
      }
      if (kind === 'chest') expect(after.inventory.crowns - before.inventory.crowns).toBe(10);
      await page.reload();
      await expect(page.locator('.branch-map')).toBeVisible();
      expect(await readGame(page)).toEqual(after);
    });
}
for (const language of ['es', 'en'] as const)
  test(`A56 lost response recovers the same visual choice ${language}`, async ({ page }) => {
    await page.goto('/');
    if (language === 'en') await changeLanguage(page, 'en');
    await page
      .getByRole('button', {
        name: language === 'es' ? 'Comenzar ensayo local' : 'Start local trial',
        exact: true,
      })
      .click();
    await startExpedition(page, language);
    const id = await reachNode(page, 'encounter', language);
    await page.locator(`[data-node="${id}"]`).click();
    await page.locator('[data-visual-value="pass"]').click();
    let posts = 0;
    await page.route('**/api/nodes/advance', async (route) => {
      posts++;
      const response = await route.fetch();
      expect(response.status()).toBe(200);
      await route.abort();
    });
    await page.locator('.node-confirm-action').click();
    await expect(page.locator('dialog').getByRole('alert')).toBeVisible();
    await expect(
      page.locator('[data-preparation="encounter"] [data-visual-value="pass"]'),
    ).toBeDisabled();
    const committed = await readGame(page);
    const receipt = committed.receipts.at(-1)!;
    expect(receipt.kind === 'advance-node' && receipt.request.encounterAction).toBe('pass');
    await page.unroute('**/api/nodes/advance');
    await page.reload();
    await expect(page.locator('.branch-map')).toBeVisible();
    await expect(page.locator('.node-result')).toBeVisible();
    expect(await readGame(page)).toEqual(committed);
    expect(posts).toBe(1);
    const pending = await page.evaluate(
      () =>
        new Promise((resolve, reject) => {
          const req = indexedDB.open('arcana-client-operations-v1');
          req.onerror = () => reject(req.error);
          req.onsuccess = () => {
            const db = req.result,
              tx = db.transaction('operations');
            const all = tx.objectStore('operations').getAll();
            all.onsuccess = () => resolve(all.result.map((row) => row.pending));
            tx.oncomplete = () => db.close();
          };
        }),
    );
    expect(pending).toEqual([null]);
  });
