import { expect, test, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
test.use({ actionTimeout: 10000 });
const fixture = '/tests/browser-houses/houses-a85.html';
const root = resolve('docs/arcana/motion-audit-2026-10-16/evidence/linux/a85');
const capture = process.platform === 'linux' && process.env.ARCANA_CAPTURE_A69 === '1';
const pairs = [
  ['es', 'diagon-alley'],
  ['en', 'diagon-alley'],
  ['es', 'arcana'],
  ['en', 'arcana'],
] as const;
function allowed(name: string) {
  return /^(chromium|webkit)-(1280|390|865)-motion-a69$/.test(name);
}
async function bounds(page: Page) {
  return page.evaluate(() => ({
    width: innerWidth,
    height: innerHeight,
    scroll: document.documentElement.scrollWidth,
    body: document.documentElement.scrollHeight,
  }));
}
async function immutable(page: Page) {
  expect(
    await page.evaluate(() => (window as unknown as { __a85: { check(): boolean } }).__a85.check()),
  ).toBe(true);
}
async function picture(page: Page, name: string) {
  if (!capture) return;
  await mkdir(root, { recursive: true });
  await page.screenshot({ path: resolve(root, name + '.png'), animations: 'disabled' });
}
test('A85 houses are visible and inspectable on the route in both packs/languages', async ({
  page,
}, info) => {
  test.skip(!allowed(info.project.name), 'Protected six-pair Linux matrix; no local graphics.');
  for (const [lang, pack] of pairs) {
    await page.goto(`${fixture}?mode=map&visited=1&lang=${lang}&pack=${pack}`);
    const band = page.locator('.team-compact .house-band');
    await expect(band).toBeVisible();
    await expect(band.locator('[data-house-progress=hufflepuff]')).toHaveAttribute(
      'data-active',
      'true',
    );
    await expect(page.locator('.team-token')).toHaveCount(5);
    const covered = await page.locator('[data-node-state=available]').evaluateAll((nodes) =>
      nodes
        .filter((node) => {
          const r = node.getBoundingClientRect();
          return !node.contains(
            document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2),
          );
        })
        .map((n) => n.getAttribute('data-node')),
    );
    expect(covered).toEqual([]);
    const measured = await bounds(page);
    expect(measured.scroll).toBeLessThanOrEqual(measured.width + 1);
    expect(measured.body).toBeLessThanOrEqual(measured.height + 1);
    const summary = band.locator('[data-house-progress=hufflepuff] summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(band.locator('[data-house-progress=hufflepuff] .house-detail')).toBeVisible();
    const box = await band.locator('[data-house-progress=hufflepuff] .house-detail').boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(measured.width + 1);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    const other = band.locator('[data-house-progress=gryffindor] summary');
    await other.press('Enter');
    await expect(band.locator('[data-house-progress=hufflepuff]')).not.toHaveAttribute('open', '');
    await expect(band.locator('[data-house-progress=gryffindor]')).toHaveAttribute('open', '');
    await other.press('Enter');
    await immutable(page);
    if (lang === 'es' && pack === 'diagon-alley' && info.project.name.startsWith('chromium-390'))
      await picture(page, 'map-390-es-diagon');
  }
});
test('A85 enchanted reveal is finite, skippable and retains its finish in the collection and after swap', async ({
  page,
}, info) => {
  test.skip(!allowed(info.project.name), 'Protected six-pair Linux matrix.');
  for (const [lang, pack] of pairs) {
    await page.goto(`${fixture}?mode=opening&lang=${lang}&pack=${pack}`);
    const reveal = page.locator('dialog.reveal');
    await expect(reveal).toHaveAttribute('data-finish', 'enchanted');
    await expect(reveal).toHaveAttribute('data-opening-phase', 'reveal', { timeout: 15000 });
    const motion = await reveal.locator('.enchanted-finish').evaluate(async (el) => {
      const samples: string[] = [];
      for (let i = 0; i < 24; i++) {
        await new Promise(requestAnimationFrame);
        samples.push(`${getComputedStyle(el).transform}|${getComputedStyle(el).opacity}`);
      }
      return samples;
    });
    expect(new Set(motion).size).toBeGreaterThan(1);
    await expect(reveal).toHaveAttribute('data-opening-state', 'result');
    await expect(reveal.locator('.enchanted-label')).toBeVisible();
    await immutable(page);
    if (lang === 'es' && pack === 'diagon-alley' && info.project.name.startsWith('chromium-390'))
      await picture(page, 'enchanted-390-es-diagon');
    await reveal.locator('.reveal-collect').click();
    await page.locator('.album-filter-drawer summary').click();
    await page
      .getByRole('button', {
        name: lang === 'es' ? 'Cromo Encantado' : 'Enchanted Card',
        exact: true,
      })
      .click();
    await expect(page.locator('.album article')).toHaveCount(1);
    await expect(page.locator('.album .enchanted-finish')).toBeVisible();
    await page.locator('.album-card-inspect').click();
    await expect(page.locator('.album-card-folio .enchanted-label')).toBeVisible();
    const tokens = page.locator('.album-copy-tokens button');
    await expect(tokens).toHaveCount(2);
    await tokens.nth(1).click();
    await expect(page.locator('.album-card-folio .enchanted-label')).toHaveCount(0);
    await tokens.nth(0).click();
    await expect(page.locator('.album-card-folio .enchanted-label')).toBeVisible();
    await page.locator('.album-card-folio .folio-close').click();
    await page.locator('[data-qa-pack]').click();
    await immutable(page);
  }
  await page.goto(`${fixture}?mode=opening&instance=skip`);
  await page.getByRole('button', { name: 'Omitir animación', exact: true }).click();
  await expect(page.locator('dialog.reveal')).toHaveAttribute('data-opening-state', 'result');
  await expect(page.locator('.holographic-card .enchanted-label')).toBeVisible();
  await page.reload();
  await expect(page.locator('dialog.reveal')).toHaveAttribute('data-opening-state', 'result');
  await immutable(page);
  await page.goto(`${fixture}?mode=opening&reduced=1`);
  await expect(page.locator('dialog.reveal')).toHaveAttribute('data-opening-state', 'result');
  expect(
    await page.locator('.enchanted-finish').evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await immutable(page);
});
test('A85 preparation, Pact comparison, confirmed battle and truthful odds remain usable', async ({
  page,
}, info) => {
  test.skip(!allowed(info.project.name), 'Protected six-pair Linux matrix.');
  for (const [lang, pack] of pairs) {
    await page.goto(`${fixture}?mode=pact&lang=${lang}&pack=${pack}`);
    await expect(page.locator('[data-pact-candidate]')).toHaveCount(2);
    await expect(page.locator('.pact-house')).toHaveCount(2);
    await page.locator('[data-pact-candidate]').first().click();
    await expect(page.locator('.house-band [data-active=true]')).toHaveCount(1);
    await immutable(page);
    if (lang === 'en' && pack === 'arcana' && info.project.name.startsWith('webkit-865'))
      await picture(page, 'pact-865-en-arcana');
    await page.goto(`${fixture}?mode=prepare&lang=${lang}&pack=${pack}`);
    await expect(page.locator('.preparation-card')).toHaveCount(6);
    await expect(page.locator('.house-band')).toBeVisible();
    await page.locator('.preparation-filters > summary').click();
    await page.locator('[data-preparation-house=hufflepuff]').click();
    await expect(page.locator('.preparation-card')).toHaveCount(5);
    await immutable(page);
    await page.goto(`${fixture}?mode=battle&lang=${lang}&pack=${pack}`);
    await expect(page.locator('[data-unit]')).toHaveCount(10);
    await page
      .getByRole('button', {
        name: lang === 'es' ? 'Omitir reproducción' : 'Skip playback',
        exact: true,
      })
      .click();
    await immutable(page);
    await page.goto(`${fixture}?mode=shop&lang=${lang}&pack=${pack}`);
    await page
      .getByRole('button', {
        name: lang === 'es' ? 'Probabilidades por cromo' : 'Card probabilities',
        exact: true,
      })
      .click();
    await expect(page.locator('.finish-odds')).toContainText('1');
    await expect(page.locator('.shop-card-catalogue article')).toHaveCount(29);
    await immutable(page);
  }
  const data = await bounds(page);
  await mkdir(root, { recursive: true });
  await writeFile(
    resolve(root, `${info.project.name}.json`),
    JSON.stringify(
      {
        project: info.project.name,
        fixture: true,
        scope: 'A85 declared UI; SQL separate',
        lastBounds: data,
      },
      null,
      2,
    ),
  );
});
test('A85 reduced motion, text growth and absent art preserve the same cosmetic result', async ({
  page,
}, info) => {
  test.skip(
    !info.project.name.startsWith('chromium-390'),
    'One explicit adverse sample; existing regressions cover all base failures.',
  );
  await page.route(/\.(webp|png)(\?.*)?$/, (r) => r.abort());
  await page.goto(`${fixture}?mode=opening&instance=absent`);
  await expect(page.locator('dialog.reveal')).toHaveAttribute('data-opening-state', 'result');
  await expect(page.locator('.holographic-card .enchanted-label')).toBeVisible();
  await immutable(page);
  await page.goto(`${fixture}?mode=collection`);
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  const size = await bounds(page);
  expect(size.scroll).toBeLessThanOrEqual(size.width + 1);
  await immutable(page);
});
test('A85 recorded house trajectory moves on the shared clock and pause/2x/skip keep its result', async ({
  page,
}, info) => {
  test.skip(!allowed(info.project.name), 'Protected six-pair Linux matrix; no local graphics.');
  await page.goto(`${fixture}?mode=battle&lang=en&pack=arcana`);
  const scene = page.locator('.scene-canvas[data-renderer=webgl]');
  await expect(scene).toBeVisible();
  await page.waitForFunction(
    () => {
      const scene = document.querySelector<HTMLElement>('.scene-canvas[data-renderer=webgl]');
      return scene?.dataset.castHouse === 'hufflepuff' && Number(scene.dataset.castOffset) > 5;
    },
    {},
    { timeout: 15000 },
  );
  const positions = await scene.evaluate(async (host) => {
    const samples: { house: string | undefined; offset: number }[] = [];
    for (let i = 0; i < 12; i++) {
      await new Promise(requestAnimationFrame);
      samples.push({
        house: (host as HTMLElement).dataset.castHouse,
        offset: Number((host as HTMLElement).dataset.castOffset),
      });
    }
    return samples;
  });
  expect(positions.some((s) => s.house === 'hufflepuff' && s.offset > 5)).toBe(true);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const cursor = await page.locator('[data-replay-cursor]').getAttribute('data-replay-cursor');
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 160)));
  expect(await page.locator('[data-replay-cursor]').getAttribute('data-replay-cursor')).toBe(
    cursor,
  );
  await page.getByRole('button', { name: '2x', exact: true }).click();
  await page.getByRole('button', { name: 'Skip playback', exact: true }).click();
  await immutable(page);
  await mkdir(root, { recursive: true });
  await writeFile(
    resolve(root, `${info.project.name}-trajectory.json`),
    JSON.stringify(
      {
        fixture: true,
        clock: 'shared BattleLog replay',
        positions,
        pausedCursor: cursor,
        unchangedConfirmedRecord: true,
      },
      null,
      2,
    ),
  );
});
test('A85 the actual mastery roster discloses its active house before confirmation', async ({
  page,
}, info) => {
  test.skip(!allowed(info.project.name), 'Protected Linux matrix only.');
  for (const [lang, pack] of pairs) {
    await page.goto(`${fixture}?mode=boss&dense=1&lang=${lang}&pack=${pack}`);
    await expect(page.locator('.boss-house-mark')).toHaveCount(1);
    await expect(page.locator('.boss-house-mark')).toBeVisible();
    await expect(page.locator('.boss-party-member')).toHaveCount(5);
    await expect(page.locator('[data-boss-party-gear]')).toHaveCount(10);
    await expect(page.locator('[data-boss-party-bean]')).toHaveCount(5);
    await expect(page.locator('.node-bean-preparation > summary')).toHaveAttribute(
      'data-bean-draft',
      '5',
    );
    await expect
      .poll(() =>
        page
          .locator('.boss-party-portrait > img:first-child')
          .evaluateAll((images) =>
            images.map(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toEqual([true, true, true, true, true]);
    const footer = await page.locator('.node-combat-actions').boundingBox();
    for (const control of [
      page.locator('.node-team-prepare'),
      page.locator('.node-bean-preparation > summary'),
    ]) {
      await expect(control).toBeInViewport({ ratio: 1 });
      const box = await control.boundingBox();
      expect(box!.y + box!.height).toBeLessThanOrEqual(footer!.y);
    }
    const size = await bounds(page);
    expect(size.scroll).toBeLessThanOrEqual(size.width + 1);
    await immutable(page);
    if (lang === 'es' && pack === 'diagon-alley' && info.project.name.startsWith('chromium-390'))
      await picture(page, 'boss-390-es-diagon');
  }
});
test('A85 pending route actions wait while locked nodes remain read-only consultations', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'chromium-390-motion-a69',
    'One deterministic pending-state fixture; domain semantics and real seasonal journey cover the integration.',
  );
  await page.goto(`${fixture}?mode=map&busy=1`);
  const available = page.locator('[data-node-state=available]').first();
  await expect(available).toBeDisabled();
  await page.locator('[data-node-state=locked]').first().click();
  await expect(page.getByRole('dialog', { name: 'Consultar ruta', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.locator('[data-qa-ready]').click();
  await expect(available).toBeEnabled();
  await available.click();
  await expect(page.locator('.tactical-pact')).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Consultar ruta', exact: true })).toHaveCount(0);
  await immutable(page);
});
