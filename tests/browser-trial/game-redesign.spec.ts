import { expect, test, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { changeLanguage, startExpedition } from './game-fixture';
import { readGame, reachNode, confirmEvent } from './route-helpers';

const evidenceRoot = resolve(
  process.env.ARCANA_REDESIGN_EVIDENCE_ROOT ??
    'docs/arcana/diagon-game-redesign-2026-10-15/captures',
);
async function captureViews(page: Page, scene: string, language: 'es' | 'en') {
  const savePixels = test.info().project.name === 'chromium-redesign';
  if (savePixels) await mkdir(evidenceRoot, { recursive: true });
  const prior = page.viewportSize();
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    if (scene.startsWith('frog-')) {
      await expect
        .poll(() =>
          page.locator('dialog.reveal').evaluate((element) => {
            const rect = element.getBoundingClientRect();
            return (
              Math.abs(rect.width - innerWidth) <= 1 &&
              Math.abs(rect.height - innerHeight) <= 1 &&
              Math.abs(rect.left) <= 1 &&
              Math.abs(rect.top) <= 1
            );
          }),
        )
        .toBe(true);
    }
    if (savePixels)
      await page.screenshot({
        path: resolve(evidenceRoot, `${language}-${scene}-${viewport.width}.png`),
        fullPage: true,
      });
  }
  if (prior) await page.setViewportSize(prior);
}
async function primaryContrast(page: Page) {
  const rows = await page.locator('.counter-buy, .open-frog-action').evaluateAll((elements) =>
    elements.map((element) => {
      const values = (color: string) => color.match(/[\d.]+/g)!.map(Number);
      const foreground = values(getComputedStyle(element.querySelector('span') ?? element).color),
        background = values(getComputedStyle(element).backgroundColor);
      const luminance = (rgb: number[]) =>
        rgb
          .slice(0, 3)
          .map((value) => {
            const c = value / 255;
            return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
          })
          .reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
      const fg = luminance(foreground),
        alpha = background[3] ?? 1;
      const contrasts = [0, 255].map((underneath) => {
        const bg = luminance(
          background.slice(0, 3).map((value) => value * alpha + underneath * (1 - alpha)),
        );
        return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
      });
      return {
        action: element.getAttribute('aria-label'),
        foreground,
        background,
        minimumContrastOverAnyScene: Math.min(...contrasts),
      };
    }),
  );
  await writeFile(
    resolve(evidenceRoot, '..', `cta-debug-${test.info().project.name}.json`),
    JSON.stringify(rows, null, 2),
  );
  expect(rows).toHaveLength(1);
  for (const row of rows)
    expect(row.minimumContrastOverAnyScene, String(row.action)).toBeGreaterThanOrEqual(4.5);
  return rows;
}
async function captureOpeningBudget(page: Page, language: 'es' | 'en') {
  await expect(page.locator('.frog-magic')).toHaveAttribute('data-renderer', /webgl|canvas2d/);
  const measured = await page.evaluate(async () => {
    const host = document.querySelector<HTMLElement>('.frog-magic');
    const before = Number(host?.dataset.renderCount ?? 0),
      times: number[] = [];
    await new Promise<void>((resolve) => {
      const start = performance.now();
      const frame = (time: number) => {
        times.push(time);
        if (time - start < 650) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
    const deltas = times.slice(1).map((value, index) => value - times[index]);
    const resources = performance.getEntriesByType('resource').map((entry) => {
      const r = entry as PerformanceResourceTiming;
      return {
        url: r.name,
        transferBytes: r.transferSize,
        encodedBytes: r.encodedBodySize,
        decodedBytes: r.decodedBodySize,
      };
    });
    return {
      viewport: { width: innerWidth, height: innerHeight },
      userAgent: navigator.userAgent,
      sampleMs: times.at(-1)! - times[0],
      browserFps: ((times.length - 1) * 1000) / (times.at(-1)! - times[0]),
      p95FrameMs: [...deltas].sort((a, b) => a - b)[Math.floor(deltas.length * 0.95)],
      maxFrameMs: Math.max(...deltas),
      framesAbove25Ms: deltas.filter((delta) => delta > 25).length,
      renderer: host?.dataset.renderer ?? 'not-initialized',
      draws: Number(host?.dataset.renderCount ?? 0) - before,
      resources,
      totalTransferBytes: resources.reduce((sum, resource) => sum + resource.transferBytes, 0),
    };
  });
  const profile = {
    runtime:
      process.env.ARCANA_REDESIGN_COMPILED_PREVIEW === '1' ? 'compiled-preview' : 'development',
    ...measured,
  };
  expect(profile.draws).toBeGreaterThan(0);
  await writeFile(
    resolve(evidenceRoot, '..', `opening-budget-${test.info().project.name}-${language}.json`),
    JSON.stringify(profile, null, 2),
  );
  await test.info().attach(`opening-budget-${language}`, {
    body: JSON.stringify(profile, null, 2),
    contentType: 'application/json',
  });
  await writeFile(
    test.info().outputPath(`opening-budget-${language}.json`),
    JSON.stringify(profile, null, 2),
  );
}

async function changeWorld(page: Page, world: 'arcana' | 'diagon-alley', language: 'es' | 'en') {
  const dialog = page.locator('dialog[open]').last();
  const origin = (await dialog.count()) ? dialog : page.locator('header');
  await origin
    .getByRole('button', { name: language === 'es' ? 'Ajustes' : 'Settings', exact: true })
    .click();
  const settings = page.locator('dialog.game-settings[open]');
  await settings
    .getByRole('button', {
      name: world === 'arcana' ? 'ARCANA' : language === 'es' ? 'Callejón Diagón' : 'Diagon Alley',
      exact: true,
    })
    .click();
  await settings
    .getByRole('button', { name: language === 'es' ? 'Cerrar' : 'Close', exact: true })
    .click();
  await expect(settings).toHaveCount(0);
  await expect(
    origin.getByRole('button', { name: language === 'es' ? 'Ajustes' : 'Settings', exact: true }),
  ).toBeFocused();
  await expect(page.locator('.arcana-shell')).toHaveAttribute('data-content-pack', world);
}
const enter = async (page: Page, language: 'es' | 'en') => {
  await page.goto('/');
  if (language === 'en') await changeLanguage(page, 'en');
  await page
    .getByRole('button', {
      name: language === 'es' ? 'Jugar como invitado' : 'Play as guest',
      exact: true,
    })
    .click();
  await expect(page.locator('.preparation-card').first()).toContainText('Harry Potter');
};

test('A57 starts in Diagon Alley with language confined to settings and no conventional forms', async ({
  page,
}) => {
  let posts = 0;
  page.on('request', (request) => {
    if (request.method() === 'POST') posts++;
  });
  await page.goto('/');
  await expect(page.locator('.arcana-shell')).toHaveAttribute('data-content-pack', 'diagon-alley');
  await expect(page.locator('header h1')).toHaveText('DIAGON ALLEY');
  await captureViews(page, 'welcome', 'es');
  await expect(page.getByRole('button', { name: /^(Español|English)$/, exact: true })).toHaveCount(
    0,
  );
  await expect(page.locator('input, select, textarea')).toHaveCount(0);
  await changeLanguage(page, 'en');
  await captureViews(page, 'welcome', 'en');
  await page.locator('header').getByRole('button', { name: 'Settings', exact: true }).click();
  await captureViews(page, 'settings', 'en');
  await page.getByRole('dialog').getByRole('button', { name: 'Close', exact: true }).click();
  await changeLanguage(page, 'es');
  await page.locator('header').getByRole('button', { name: 'Ajustes', exact: true }).click();
  await captureViews(page, 'settings', 'es');
  await page.getByRole('dialog').getByRole('button', { name: 'Cerrar', exact: true }).click();
  await changeLanguage(page, 'en');
  await expect(page.getByRole('button', { name: /^(Español|English)$/, exact: true })).toHaveCount(
    0,
  );
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.arcana-shell')).toHaveAttribute('data-content-pack', 'diagon-alley');
  expect(posts).toBe(0);
});

test('A57 swaps world and language over a saved expedition without rewriting authority state', async ({
  page,
}) => {
  await enter(page, 'es');
  await startExpedition(page, 'es');
  await page.locator('[data-node="pasaje:0:0"]').click();
  await confirmEvent(page, 'es');
  const before = await readGame(page);
  await captureViews(page, 'map', 'es');
  let commands = 0;
  page.on('request', (request) => {
    if (request.method() === 'POST') commands++;
  });
  await changeWorld(page, 'arcana', 'es');
  await expect(page.locator('header h1')).toHaveText('ARCANA');
  await captureViews(page, 'arcana-swap', 'es');
  await expect(
    page.getByRole('button', { name: 'Aprendiz de Alquimia', exact: true }),
  ).toBeVisible();
  await changeLanguage(page, 'en');
  expect(await readGame(page)).toEqual(before);
  await changeWorld(page, 'diagon-alley', 'en');
  await captureViews(page, 'map', 'en');
  await expect(page.getByRole('button', { name: 'Harry Potter', exact: true })).toBeVisible();
  expect(await readGame(page)).toEqual(before);
  await page.reload();
  await expect(page.locator('.arcana-shell')).toHaveAttribute('data-content-pack', 'diagon-alley');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await readGame(page)).toEqual(before);
  expect(commands).toBe(0);
});

for (const language of ['es', 'en'] as const) {
  test(`A57 tastes are discovered by committed use, not ownership, and survive swap/reload ${language}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await enter(page, language);
    const en = language === 'en';
    const button = (es: string, english: string) =>
      page.getByRole('button', { name: en ? english : es, exact: true });
    await button('Callejón', 'Diagon Alley').click();
    await page.locator('[data-shop="confectionery"]').click();
    await button('Grageas de Todos los Sabores', 'Every Flavour Beans').click();
    await button(
      'Comprar Grageas de Todos los Sabores · 5 Galeones',
      'Buy Every Flavour Beans · 5 Galleons',
    ).click();
    await expect
      .poll(
        async () =>
          (await readGame(page)).inventory.products.filter(
            (unit) => unit.kind === 'random-beans' && unit.status === 'available',
          ).length,
      )
      .toBe(1);
    const purchased = await readGame(page),
      bean = purchased.inventory.products.find(
        (unit) => unit.kind === 'random-beans' && unit.status === 'available',
      )!;
    expect(bean).toBeTruthy();
    await captureViews(page, 'sweetshop', language);
    // A60 keeps discovery in the album; buying a jar must not discover its flavour.
    await button('Álbum de Cromos', 'Card Album').click();
    await expect(page.locator('.flavour-cabinet .flavour-specimen')).toHaveCount(4);
    await expect(page.locator('.flavour-cabinet [data-discovered="true"]')).toHaveCount(0);
    expect(await readGame(page)).toEqual(purchased);
    await button('Mapa', 'Map').click();
    await startExpedition(page, language);
    const duel = await reachNode(page, 'duel', language);
    await page.locator(`[data-node="${duel}"]`).click();
    await page.locator('.node-bean-preparation > summary').click();
    const before = await readGame(page),
      actor = before.exploration!.run!.members[0].unit.id;
    await page.locator(`[data-bean-id="${bean.id}"]`).click();
    await page.locator(`[data-bean-unit="${actor}"]`).click();
    expect(await readGame(page)).toEqual(before);
    await confirmEvent(page, language);
    await expect(
      page.getByRole('heading', { name: en ? 'Combat Arena' : 'Arena de Combate', exact: true }),
    ).toBeVisible();
    const after = await readGame(page),
      receipt = after.receipts.find(
        (r) =>
          r.kind === 'advance-node' &&
          r.battle &&
          r.request.assignments.some((a) => a.beanId === bean.id),
      );
    if (receipt?.kind !== 'advance-node' || !receipt.battle) throw Error('Missing committed taste');
    expect(
      receipt.battle.events.some(
        (event) =>
          event.kind === 'bean-activated' && event.actorId === actor && event.unitId === bean.id,
      ),
    ).toBe(true);
    const activated = receipt.battle.events.find(
      (event) =>
        event.kind === 'bean-activated' && event.actorId === actor && event.unitId === bean.id,
    );
    if (activated?.kind !== 'bean-activated') throw Error('Missing activation');
    const flavourNames = {
      mint: { es: 'Menta', en: 'Mint' },
      pepper: { es: 'Pimienta', en: 'Pepper' },
      earth: { es: 'Tierra', en: 'Earth' },
      soap: { es: 'Jabón', en: 'Soap' },
    };

    await button('Volver al mapa', 'Back to map').click();
    await button('Álbum de Cromos', 'Card Album').click();
    await expect(page.locator('.album > article')).toHaveCount(4);
    await expect(page.locator('.album-filter-drawer')).not.toHaveAttribute('open', '');
    const firstPage = await page
      .locator('.album > article img[data-art]')
      .evaluateAll((images) => images.map((image) => image.getAttribute('data-art')));
    await button('Página siguiente', 'Next page').click();
    await expect(page.locator('.album-page-controls')).toContainText('2 / 8');
    expect(
      await page
        .locator('.album > article img[data-art]')
        .evaluateAll((images) => images.map((image) => image.getAttribute('data-art'))),
    ).not.toEqual(firstPage);
    expect(await readGame(page)).toEqual(after);
    await button('Página anterior', 'Previous page').click();
    await expect(page.locator('.album-page-controls')).toContainText('1 / 8');
    expect(
      await page
        .locator('.album > article img[data-art]')
        .evaluateAll((images) => images.map((image) => image.getAttribute('data-art'))),
    ).toEqual(firstPage);
    expect(await readGame(page)).toEqual(after);

    const cabinet = page.locator('.flavour-cabinet');
    await expect(cabinet.locator('.flavour-specimen')).toHaveCount(4);
    await expect(cabinet.locator('[data-discovered="true"]')).toHaveCount(1);
    await expect(
      cabinet.getByRole('button', {
        name: `${flavourNames[activated.flavour][language]} · ${en ? 'discovered' : 'descubierto'}`,
        exact: true,
      }),
    ).toBeVisible();
    await captureViews(page, 'collection', language);
    await cabinet.locator('[data-discovered="false"]').first().click();
    expect(await readGame(page)).toEqual(after);
    await changeLanguage(page, en ? 'es' : 'en');
    await changeWorld(page, 'arcana', en ? 'es' : 'en');
    await expect(cabinet.locator('[data-discovered="true"]')).toHaveCount(1);
    expect(await readGame(page)).toEqual(after);
    await page.reload();
    await expect(cabinet.locator('[data-discovered="true"]')).toHaveCount(1);
    expect(await readGame(page)).toEqual(after);
  });
  for (const reduced of [false, true]) {
    test(`A57 chocolate frog reveal is cosmetic, skippable and durable ${language} reduced=${reduced}`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
      await enter(page, language);
      const en = language === 'en';
      await page
        .getByRole('button', { name: en ? 'Diagon Alley' : 'Callejón', exact: true })
        .click();
      await page.locator('[data-shop="confectionery"]').click();
      const beforePurchase = await readGame(page);
      expect(
        beforePurchase.inventory.products.filter(
          (unit) => unit.kind === 'cacao-toad' && unit.status === 'available',
        ),
      ).toHaveLength(0);
      await expect(page.locator('.counter-buy')).toBeEnabled();
      await expect(page.locator('.open-frog-action')).toHaveCount(0);
      const contrast = [{ pack: 'diagon-alley', values: await primaryContrast(page) }];
      if (reduced) {
        await changeWorld(page, 'arcana', language);
        contrast.push({ pack: 'arcana', values: await primaryContrast(page) });
        await captureViews(page, 'sweetshop-arcana', language);
        await changeWorld(page, 'diagon-alley', language);
        await captureViews(page, 'sweetshop', language);
        expect(await readGame(page)).toEqual(beforePurchase);
      }
      await writeFile(
        resolve(
          evidenceRoot,
          '..',
          `cta-contrast-${test.info().project.name}-${language}-${reduced}.json`,
        ),
        JSON.stringify(contrast, null, 2),
      );
      let openings = 0;
      let separateOpenings = 0;
      page.on('request', (request) => {
        if (request.method() === 'POST' && request.url().endsWith('/api/toads/buy-open'))
          openings++;
        if (request.method() === 'POST' && request.url().endsWith('/api/toads/open'))
          separateOpenings++;
      });
      await page
        .getByRole('button', {
          name: en ? 'Buy and open 1 · 10 Galleons' : 'Comprar y abrir 1 · 10 Galeones',
          exact: true,
        })
        .click();
      const reveal = page.locator('[data-opening-state]');
      await expect(reveal).toBeVisible();
      const committed = await readGame(page);
      expect(committed.copies).toHaveLength(beforePurchase.copies.length + 1);
      expect(committed.inventory.crowns).toBe(beforePurchase.inventory.crowns - 10);
      const openingReceipt = committed.receipts.at(-1);
      expect(openingReceipt?.kind).toBe('buy-open-toad');
      if (openingReceipt?.kind !== 'buy-open-toad')
        throw Error('Missing atomic purchase/open receipt');
      expect(openingReceipt.spentCrowns).toBe(10);
      expect(
        committed.inventory.products.find((unit) => unit.id === openingReceipt.unitId)?.status,
      ).toBe('consumed');
      expect(committed.copies.some((copy) => copy.copyId === openingReceipt.copyId)).toBe(true);
      if (reduced) {
        await expect(reveal).toHaveAttribute('data-opening-state', 'result');
        await expect(page.locator('.frog-magic canvas')).toHaveCount(0);
        await expect(page.locator('[data-celebration]')).toHaveCount(0);
      } else {
        await expect(reveal).toHaveAttribute('data-opening-state', 'playing');
        await captureOpeningBudget(page, language);
        if (test.info().project.name === 'chromium-redesign') {
          await expect
            .poll(() =>
              page
                .locator('.opening-subject')
                .evaluate((element) => Number(getComputedStyle(element).opacity)),
            )
            .toBeGreaterThan(0.5);
          await captureViews(page, 'frog-opening', language);
        }

        await page
          .getByRole('button', { name: en ? 'Skip animation' : 'Omitir animación', exact: true })
          .click();
        await expect(reveal).toHaveAttribute('data-opening-state', 'result');
      }
      await captureViews(page, reduced ? 'frog-reduced' : 'frog-result', language);
      await changeLanguage(page, en ? 'es' : 'en');
      await expect(reveal).toHaveAttribute('data-opening-state', 'result');
      expect(await readGame(page)).toEqual(committed);
      await changeWorld(page, 'arcana', en ? 'es' : 'en');
      expect(await readGame(page)).toEqual(committed);
      await page.reload();
      expect(await readGame(page)).toEqual(committed);
      expect(openings).toBe(1);
      expect(separateOpenings).toBe(0);
    });
  }
}
