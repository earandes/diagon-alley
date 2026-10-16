import { chromium, webkit, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const baseURL = 'http://127.0.0.1:5276';
const root = 'docs/arcana/pokelike-2026-10-15/map-review';
await mkdir(root, { recursive: true });
const reports = [];
for (const [engine, type] of Object.entries({ chromium, webkit })) {
  const browser = await type.launch({ headless: true });
  try {
    for (const language of ['es', 'en']) {
      const context = await browser.newContext({ baseURL, viewport: { width: 911, height: 1079 } });
      await context.addInitScript(
        ({ language }) => {
          localStorage.setItem('arcana.presentation.content-pack.v1', 'diagon-alley');
          localStorage.setItem('arcana-language', language);
        },
        { language },
      );
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('/');
      await page.locator('.portal-enter').click();
      const prep = page.locator('[data-expedition-preparation="new"]');
      await expect(prep).toBeVisible();
      await prep.locator('.preparation-card').first().click();
      await prep.locator('[data-preparation-confirm]').click();
      await expect(page.locator('.branch-map')).toBeVisible();
      await expect(page.locator('.branch-map canvas')).toBeVisible();
      const before = (await (await page.request.get('/api/state')).json()).state;
      for (const viewport of [
        { width: 911, height: 1079 },
        { width: 1280, height: 900 },
        { width: 390, height: 844 },
        { width: 320, height: 568 },
        { width: 844, height: 390 },
      ]) {
        await page.setViewportSize(viewport);
        await page.evaluate(
          () =>
            new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
        );
        await expect
          .poll(async () =>
            page
              .locator('.branch-map')
              .evaluate((e) => Math.round(e.getBoundingClientRect().width)),
          )
          .toBe(viewport.width);
        const measurement = await page.evaluate(() => {
          const map = document.querySelector('.branch-map'),
            area = map.getBoundingClientRect();
          const rect = (el) => {
            const r = el.getBoundingClientRect();
            return {
              x: r.x,
              y: r.y,
              width: r.width,
              height: r.height,
              right: r.right,
              bottom: r.bottom,
            };
          };
          const nodes = [...document.querySelectorAll('[data-node]')].map((el) => ({
            id: el.dataset.node,
            kind: el.dataset.nodeKind,
            state: el.dataset.nodeState,
            rect: rect(el),
            disabled: el.disabled,
            material: getComputedStyle(el).backgroundColor,
            border: getComputedStyle(el).borderRadius,
          }));
          const origin = document.querySelector('[data-map-origin]');
          const originBox = rect(origin);
          return {
            viewport: [innerWidth, innerHeight],
            document: [document.documentElement.scrollWidth, document.documentElement.scrollHeight],
            map: rect(map),
            scroll: [map.scrollWidth, map.scrollHeight],
            nodes,
            origin: {
              tag: origin.tagName,
              rect: originBox,
              label: origin.innerText,
              pointerEvents: getComputedStyle(origin).pointerEvents,
            },
            originOverlaps: nodes
              .filter(
                (n) =>
                  originBox.x < n.rect.right &&
                  originBox.right > n.rect.x &&
                  originBox.y < n.rect.bottom &&
                  originBox.bottom > n.rect.y,
              )
              .map((n) => n.id),
          };
        });
        expect(measurement.document).toEqual([viewport.width, viewport.height]);
        expect(measurement.scroll[0]).toBeLessThanOrEqual(measurement.map.width + 1);
        expect(measurement.scroll[1]).toBeLessThanOrEqual(measurement.map.height + 1);
        expect(measurement.nodes).toHaveLength(before.exploration.run.graph.nodes.length);
        expect(new Set(measurement.nodes.map((n) => n.material)).size).toBe(6);
        expect(measurement.origin.tag).toBe('DIV');
        expect(measurement.origin.pointerEvents).toBe('none');
        expect(measurement.originOverlaps).toEqual([]);
        for (const node of measurement.nodes) {
          expect(node.rect.width).toBeGreaterThanOrEqual(44);
          expect(node.rect.height).toBeGreaterThanOrEqual(44);
          expect(node.rect.x).toBeGreaterThanOrEqual(0);
          expect(node.rect.right).toBeLessThanOrEqual(viewport.width + 1);
          expect(node.rect.y).toBeGreaterThanOrEqual(measurement.map.y - 1);
          expect(node.rect.bottom).toBeLessThanOrEqual(measurement.map.bottom + 1);
        }
        await page.screenshot({
          path: `${root}/${engine}-${language}-${viewport.width}x${viewport.height}.png`,
        });
        reports.push({ engine, language, ...measurement });
      }
      await page.setViewportSize({ width: 911, height: 1079 });
      const first = page.locator('[data-node-state="available"]').first();
      await first.focus();
      await expect(first.locator('.node-label')).toBeVisible();
      await first.press('Enter');
      await expect(page.locator('dialog.node-event-dialog[open]')).toBeVisible();
      await page.locator('dialog.node-event-dialog img').evaluateAll(async (images) => {
        await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
      });
      await page.screenshot({
        path: `${root}/${engine}-${language}-pact.png`,
        animations: 'disabled',
      });
      await page.keyboard.press('Escape');
      await expect(page.locator('dialog.node-event-dialog[open]')).toHaveCount(0);
      await expect(first).toBeFocused();
      expect((await (await page.request.get('/api/state')).json()).state).toEqual(before);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(page.locator('.arcana-shell')).toHaveAttribute('data-reduced', 'true');
      const animation = await first.evaluate((e) => getComputedStyle(e, '::before').animationName);
      expect(animation).toBe('none');
      await page.reload();
      await expect(page.locator('.branch-map')).toBeVisible();
      expect((await (await page.request.get('/api/state')).json()).state).toEqual(before);
      let advances = 0;
      page.on('request', (request) => {
        if (request.method() === 'POST' && request.url().endsWith('/api/nodes/advance')) advances++;
      });
      const activePact = page
        .locator('[data-node-kind="pact"][data-node-state="available"]')
        .first();
      const pactId = await activePact.getAttribute('data-node');
      await activePact.click();
      await expect(page.locator('[data-pact-action="recruit"]')).toBeEnabled();
      await expect(page.locator('.node-confirm-action')).toHaveCount(0);
      await page.locator('[data-pact-action="recruit"]').click();
      await expect(page.locator('dialog.node-event-dialog[open]')).toHaveCount(0);
      const recruited = (await (await page.request.get('/api/state')).json()).state;
      expect(recruited.exploration.run.visited).toEqual([pactId]);
      expect(recruited.exploration.run.members).toHaveLength(
        before.exploration.run.members.length + 1,
      );
      expect(recruited.copies).toEqual(before.copies);
      expect(recruited.inventory).toEqual(before.inventory);
      expect(advances).toBe(1);
      await expect(page.locator(`[data-node="${pactId}"]`)).toBeDisabled();
      const chest = page.locator('[data-node-kind="chest"][data-node-state="available"]').first();
      if (await chest.count()) {
        await chest.click();
        await expect(page.locator('.node-event-dialog[data-event-kind="chest"]')).toBeVisible();
        await page.locator('dialog.node-event-dialog img').evaluateAll(async (images) => {
          await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
        });
        await page.screenshot({
          path: `${root}/${engine}-${language}-chest.png`,
          animations: 'disabled',
        });
        await page.keyboard.press('Escape');
        expect((await (await page.request.get('/api/state')).json()).state).toEqual(recruited);
      }
      await page.screenshot({
        path: `${root}/${engine}-${language}-visited.png`,
        animations: 'disabled',
      });
      expect(errors).toEqual([]);
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
await writeFile(
  `${root}/profiles.json`,
  JSON.stringify(
    {
      notes:
        'Technical isolated browser inspection, not user testing or physical mobile evidence. Screens captured while A60 integration remains in progress.',
      reports,
      keyboardFocusReturned: true,
      nodeCancelStateUnchanged: true,
      reducedPulseAbsent: true,
      reloadStateUnchanged: true,
      explicitPactOnePost: true,
      pactPreservesCopiesAndInventory: true,
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({
    captures: reports.length + 12,
    profiles: reports.length,
    engines: ['chromium', 'webkit'],
    languages: ['es', 'en'],
  }),
);
