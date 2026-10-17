import { expect, test, type Page } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const evidence = resolve('docs/arcana/experience-fixes-2026-10-17/evidence/linux');
const phase = JSON.parse(await readFile('tools/verification/a75-phase.json', 'utf8'))
  .phase as string;

async function geometry(page: Page) {
  return page.evaluate(async () => {
    const box = (e: Element) => {
      const r = e.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom, right: r.right };
    };
    const rows = await Promise.all(
      [...document.querySelectorAll<HTMLElement>('.pedestal')].map(async (p) => {
        const space = p.querySelector<HTMLElement>('.arena-figure-space')!,
          img = p.querySelector<HTMLImageElement>('.arena-portrait');
        let alpha: null | { width: number; height: number; ratio: number } = null;
        if (img?.complete && img.naturalWidth) {
          await img.decode().catch(() => {});
          const c = document.createElement('canvas');
          c.width = img.naturalWidth;
          c.height = img.naturalHeight;
          const ctx = c.getContext('2d', { willReadFrequently: true })!;
          ctx.drawImage(img, 0, 0);
          const data = ctx.getImageData(0, 0, c.width, c.height).data;
          let left = c.width,
            top = c.height,
            right = -1,
            bottom = -1;
          for (let y = 0; y < c.height; y++)
            for (let x = 0; x < c.width; x++)
              if (data[(y * c.width + x) * 4 + 3] > 8) {
                left = Math.min(left, x);
                right = Math.max(right, x);
                top = Math.min(top, y);
                bottom = Math.max(bottom, y);
              }
          const scale = space.getBoundingClientRect().height / c.height;
          alpha = {
            width: (right - left + 1) * scale,
            height: (bottom - top + 1) * scale,
            ratio: (bottom - top + 1) / c.height,
          };
          c.width = 0;
          c.height = 0;
        }
        return {
          id: p.dataset.unit,
          boss: p.dataset.bossActor === 'true',
          pedestal: box(p),
          figure: box(space),
          name: box(p.querySelector('.arena-inspect > strong')!),
          health: box(p.querySelector('.arena-health')!),
          alphaSourceFootprint: alpha,
        };
      }),
    );
    return {
      viewport: { width: innerWidth, height: innerHeight },
      header: box(document.querySelector('.game-header')!),
      heading: box(document.querySelector('.arena-heading')!),
      tools: box(document.querySelector('.arena-playback-tools')!),
      stage: box(document.querySelector('.arena-stage')!),
      caption: box(document.querySelector('.arena-caption')!),
      scroll: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      rows,
    };
  });
}

test('A75 arena geometry and source footprint before and after layout', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const samples = [];
  const shapes = [
    { player: 3, challenge: 'discovery', rival: 3 },
    { player: 5, challenge: 'discovery', rival: 3 },
    { player: 5, challenge: 'mastery', rival: 5 },
  ];
  for (const pack of ['diagon-alley', 'arcana'])
    for (const shape of shapes) {
      const url = `http://127.0.0.1:5521/tests/browser-boss/boss-a70.html?player=${shape.player}&challenge=${shape.challenge}&pack=${pack}`;
      const started = Date.now();
      await page.goto(url);
      const panel = page.locator('.battle-panel'),
        scene = page.locator('.scene-canvas');
      await expect(scene).toHaveAttribute('data-art-ready', 'true');
      await expect(scene).toHaveAttribute('data-boss-actor-ready', 'true');
      await page.getByRole('button', { name: 'Pausa', exact: true }).click();
      await expect(panel).toHaveAttribute('data-replay-playing', 'false');
      await expect(page.locator('.pedestal')).toHaveCount(shape.player + shape.rival);
      const g = await geometry(page);
      for (const r of g.rows)
        for (const b of [r.pedestal, r.figure, r.name, r.health]) {
          expect(b.x).toBeGreaterThanOrEqual(-1);
          expect(b.y).toBeGreaterThanOrEqual(-1);
          expect(b.right).toBeLessThanOrEqual(g.viewport.width + 1);
          expect(b.bottom).toBeLessThanOrEqual(g.viewport.height + 1);
        }
      expect(g.scroll.width).toBeLessThanOrEqual(g.viewport.width + 1);
      expect(g.scroll.height).toBeLessThanOrEqual(g.viewport.height + 1);
      samples.push({ pack, shape, actionToPausedReadyWallMs: Date.now() - started, geometry: g });
      if (
        process.platform === 'linux' &&
        process.env.ARCANA_CAPTURE_A75 === '1' &&
        test.info().project.name === 'chromium-390-a75' &&
        shape.rival === 5
      ) {
        await mkdir(evidence, { recursive: true });
        await page.screenshot({
          path: resolve(evidence, `${phase}-${pack}-dense.png`),
          fullPage: false,
        });
      }
    }
  expect(errors).toEqual([]);
  await mkdir(evidence, { recursive: true });
  await writeFile(
    resolve(evidence, `${phase}-${test.info().project.name}-geometry.json`),
    JSON.stringify(
      {
        sha: process.env.GITHUB_SHA,
        phase,
        fixture: true,
        physicalDevice: false,
        alphaMethod:
          'Alpha>8 source bounding box projected to renderer figure height; not a GPU pixel/memory measurement.',
        samples,
        errors,
      },
      null,
      2,
    ),
  );
});
