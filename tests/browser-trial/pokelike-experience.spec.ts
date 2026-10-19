import { leaveBattle } from './battle-controls';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { changeLanguage, startExpedition } from './game-fixture';
import { readGame } from './route-helpers';
import { routePath } from '../support/arcana-route';
import type { NodeKind } from '../../src/arcana/domain/exploration/route';
import type { PublicContent } from '../../src/arcana/application/public-content';

const evidence = resolve(process.env.ARCANA_POKELIKE_EVIDENCE_ROOT ?? 'docs/arcana/pokelike-2026-10-15/after');
type Language = 'es' | 'en';
async function photo(page: Page, name: string, info: TestInfo) {
  if (info.project.name !== 'chromium-pokelike') return;
  await mkdir(evidence, { recursive: true });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((image) => image.getBoundingClientRect().width)
        .map((image) =>
          Promise.race([
            image.decode().catch(() => {}),
            new Promise((done) => setTimeout(done, 800)),
          ]),
        ),
    );
    // Capture the settled modal, not a half-transparent entry frame. This is capture-only;
    // production timing and the separate performance probes remain unchanged.
    const animations = Array.from(document.querySelectorAll('dialog[open]'))
      .flatMap((dialog) => dialog.getAnimations({ subtree: true }))
      .filter((animation) => {
        const timing = animation.effect?.getComputedTiming();
        return timing && Number.isFinite(timing.iterations) && Number(timing.endTime) <= 4000;
      });
    await Promise.all(animations.map((animation) => animation.finished.catch(() => {})));
  });
  await expect
    .poll(() =>
      page
        .locator('dialog[open]')
        .evaluateAll((dialogs) =>
          dialogs.every((dialog) => Number(getComputedStyle(dialog).opacity) >= 0.99),
        ),
    )
    .toBe(true);
  await page.screenshot({ path: resolve(evidence, `${name}.png`) });
}
async function enter(page: Page, language: Language) {
  await page.addInitScript(() =>
    localStorage.setItem('arcana.presentation.content-pack.v1', 'diagon-alley'),
  );
  await page.setViewportSize({ width: language === 'es' ? 865 : 1008, height: 1079 });
  await page.goto('/');
  if (language === 'en') await changeLanguage(page, language);
  await page.locator('.portal-enter').click();
  await expect(page.locator('[data-expedition-preparation="new"]')).toBeVisible();
}
async function counter(page: Page) {
  await page.locator('nav button').nth(2).click();
  await page.locator('[data-shop="confectionery"]').click();
  await expect(page.locator('.sweetshop-scene')).toBeVisible();
}
async function result(page: Page, language: Language, skip = true) {
  const reveal = page.locator('dialog.reveal');
  await expect(reveal).toBeVisible();
  if (skip && (await reveal.getAttribute('data-opening-state')) === 'playing')
    await reveal
      .getByRole('button', {
        name: language === 'es' ? 'Omitir animación' : 'Skip animation',
        exact: true,
      })
      .click();
  await expect(reveal).toHaveAttribute('data-opening-state', 'result', { timeout: 12_000 });
  return reveal;
}
function posts(page: Page) {
  const calls: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().includes('/api/'))
      calls.push(new URL(request.url()).pathname);
  });
  return calls;
}

/** A60's Pacts resolve directly; other events keep a single labelled confirmation. */
async function resolveEvent(page: Page) {
  const recruit = page.locator('[data-pact-action="recruit"]');
  if (await recruit.count()) await recruit.click();
  else await page.locator('.node-confirm-action').click();
  await expect(page.locator('.node-event-dialog')).toHaveCount(0);
  const receipt = (await readGame(page)).receipts.at(-1);
  if (receipt?.kind === 'advance-node' && receipt.battle)
    await expect(page.locator('.battle-panel')).toBeVisible();
  else await expect(page.locator('[data-map-phase]')).toHaveAttribute('data-map-phase', 'route');
}
async function reachTarget(page: Page, kind: NodeKind, _language: Language) {
  const run = (await readGame(page)).exploration!.run!;
  const path = routePath(run.graph, run.visited, kind);
  for (const id of path.slice(0, -1)) {
    await page.locator(`[data-node="${id}"]`).click();
    await resolveEvent(page);
    const receipt = (await readGame(page)).receipts.at(-1);
    if (receipt?.kind === 'advance-node' && receipt.battle) {
      await leaveBattle(page);
      await expect(page.locator('[data-map-phase]')).toHaveAttribute('data-map-phase', 'route');
    }
  }
  return path.at(-1)!;
}

for (const language of ['es', 'en'] as const) {
  test.describe(`legacy-content UI fixture ${language}`, () => {
    // This test changes a GET response. Block the worker only for this fixture so it
    // cannot bypass route interception; all normal-flow cases keep the real worker.
    test.use({ serviceWorkers: 'block' });
    test(`A60 legacy public-content UI fixture retains a real pact confirmation ${language}`, async ({
      page,
    }, info) => {
      test.info().annotations.push({
        type: 'ui-fixture',
        description:
          'Only the GET response omits campaign.nodes; real authority, run graph, balances and commands remain unchanged.',
      });
      const contentResponses: Promise<PublicContent>[] = [];
      page.on('response', (response) => {
        if (new URL(response.url()).pathname === '/api/content' && response.ok())
          contentResponses.push(response.json() as Promise<PublicContent>);
      });
      await page.route('**/api/content', async (route) => {
        const response = await route.fetch();
        const content = (await response.json()) as PublicContent;
        const { nodes: _nodes, ...legacyCampaign } = content.campaign;
        await route.fulfill({ response, json: { ...content, campaign: legacyCampaign } });
      });
      await enter(page, language);
      await startExpedition(page, language);
      const receivedContent = await Promise.all(contentResponses);
      expect(receivedContent.length).toBeGreaterThan(0);
      for (const received of receivedContent) expect(received.campaign).not.toHaveProperty('nodes');
      const before = await readGame(page),
        writes = posts(page);
      const run = before.exploration!.run!,
        first = run.graph.nodes.find((node) => node.row === 0)!;
      expect(first.kind).toBe('pact');
      await page.locator(`[data-node="${first.id}"]`).click();
      const dialog = page.locator('.node-event-dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('[data-pact-action]')).toHaveCount(0);
      const confirm = dialog.locator('.node-confirm-action');
      await expect(confirm).toBeVisible();
      await expect(confirm).toBeEnabled();
      expect(await readGame(page)).toEqual(before);
      // Label the altered GET fixture in its screenshot; this banner has no command/state role.
      await dialog.evaluate((element) => {
        const note = document.createElement('p');
        note.dataset.uiFixture = 'legacy-content-without-plans';
        note.textContent = 'UI fixture · legacy content without plans · real server';
        note.style.cssText = 'font:12px system-ui;color:#ffe2a2;text-align:center';
        element.append(note);
      });
      await photo(page, `${language}-14-legacy-content-fixture`, info);
      await confirm.click();
      await expect(dialog).toHaveCount(0);
      const after = await readGame(page);
      expect(writes).toEqual(['/api/nodes/advance']);
      expect(after.revision).toBe(before.revision + 1);
      expect(after.exploration!.run!.graph).toEqual(run.graph);
      expect(after.exploration!.run!.visited).toEqual([...run.visited, first.id]);
      expect(
        after.exploration!.run!.members.filter((member) => member.source === 'temporary'),
      ).toHaveLength(1);
      expect(after.copies).toEqual(before.copies);
      expect(after.inventory).toEqual(before.inventory);
      expect(after.receipts.at(-1)?.kind).toBe('advance-node');
    });
  });

  test(`A60 compact preparation, genuine origin and event scenes ${language}`, async ({
    page,
  }, info) => {
    await enter(page, language);
    const original = await readGame(page),
      writes = posts(page);
    const preparation = page.locator('.expedition-preparation');
    await expect(preparation.locator('.preparation-inspection')).toHaveCount(0);
    await expect(preparation.locator('.preparation-card[aria-pressed="true"]')).toHaveCount(0);
    await expect(preparation.locator('[data-preparation-confirm]')).toBeDisabled();
    await photo(page, `${language}-01-preparation`, info);
    await preparation.locator('.preparation-card').first().click();
    const inspect = preparation.locator('[data-preparation-inspect]').first();
    await inspect.click();
    const card = page.locator('dialog.preparation-inspection[open]');
    await expect(card).toBeVisible();
    await expect(card.locator('.preparation-gear-slot')).toHaveCount(2);
    await photo(page, `${language}-02-inspection`, info);
    await page.keyboard.press('Escape');
    await expect(card).toHaveCount(0);
    await expect(inspect).toBeFocused();
    // Test focus preview directly; the browser/OS's sequential Tab preference is outside this case.
    await preparation.locator('.preparation-card').first().focus();
    await expect(preparation.locator('.preparation-card').first()).toBeFocused();
    await expect(preparation.locator('.preparation-peek').first()).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await photo(page, `${language}-02-preparation-mobile-closed`, info);
    await inspect.click();
    await expect(card).toBeVisible();
    const inspectorBounds = await card.boundingBox();
    expect(inspectorBounds!.x).toBeGreaterThanOrEqual(0);
    expect(inspectorBounds!.x + inspectorBounds!.width).toBeLessThanOrEqual(390);
    await photo(page, `${language}-02-inspection-mobile`, info);
    await page.keyboard.press('Escape');
    await expect(inspect).toBeFocused();
    await page.setViewportSize({ width: language === 'es' ? 865 : 1008, height: 1079 });
    expect(await readGame(page)).toEqual(original);
    expect(writes).toEqual([]);
    await preparation.locator('[data-preparation-confirm]').click();
    await expect(page.locator('.branch-map')).toBeVisible();
    const started = await readGame(page);
    expect(started.copies).toEqual(original.copies);
    expect(started.exploration!.run!.members).toHaveLength(1);
    await expect(page.locator('[data-map-origin="true"]')).toBeVisible();
    await expect(page.locator('[data-map-origin="true"] button')).toHaveCount(0);
    for (const viewport of [
      { width: 1008, height: 1079 },
      { width: 865, height: 1079 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <= innerWidth &&
            document.documentElement.scrollHeight <= innerHeight + 2,
        ),
      ).toBe(true);
      const targets = await page.locator('.map-node button').evaluateAll((buttons) =>
        buttons.map((button) => {
          const box = button.getBoundingClientRect();
          return { width: box.width, height: box.height };
        }),
      );
      expect(targets.every((box) => box.width >= 44 && box.height >= 44)).toBe(true);
      await photo(page, `${language}-03-map-${viewport.width}`, info);
    }
    await page.setViewportSize({ width: language === 'es' ? 865 : 1008, height: 1079 });
    const first = started.exploration!.run!.graph.nodes.find((node) => node.row === 0)!;
    expect(first.kind).toBe('pact');
    const pact = page.locator(`[data-node="${first.id}"]`);
    await expect(pact).toBeEnabled();
    await pact.click();
    await expect(page.locator('.node-event-dialog')).toBeVisible();
    await expect(page.locator('.pact-preview')).toBeVisible();
    await photo(page, `${language}-04-pact`, info);
    expect(await readGame(page)).toEqual(started);
    await resolveEvent(page);
    const recruited = await readGame(page);
    expect(recruited.copies).toEqual(original.copies);
    expect(
      recruited.exploration!.run!.members.filter((member) => member.source === 'temporary'),
    ).toHaveLength(1);
    await expect(pact).toBeDisabled();
    await page.locator('.team-prepare').click();
    const active = page.locator('.preparation-dialog[open]');
    await expect(active.locator('.preparation-inspection')).toHaveCount(0);
    await active.locator('[data-preparation-inspect]').first().click();
    await expect(page.locator('.preparation-inspection[open]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(active).toBeVisible();
    await expect(active.locator('[data-preparation-inspect]').first()).toBeFocused();
    await photo(page, `${language}-05-preparation-active`, info);
    await page.keyboard.press('Escape');
    await expect(active).toHaveCount(0);
    expect(await readGame(page)).toEqual(recruited);
    const chestId = await reachTarget(page, 'chest', language);
    await page.locator(`[data-node="${chestId}"]`).click();
    await expect(page.locator('.node-event-dialog')).toBeVisible();
    await expect(page.locator('.event-loot')).toBeVisible();
    const beforeChest = await readGame(page);
    await photo(page, `${language}-06-chest`, info);
    await page.keyboard.press('Escape');
    expect(await readGame(page)).toEqual(beforeChest);
  });

  test(`A60 one explicit frog purchase opens once and beans explain their next action ${language}`, async ({
    page,
  }, info) => {
    await enter(page, language);
    await counter(page);
    const content: PublicContent = await (await page.request.get('/api/content')).json();
    const price = content.shop.products.find((product) => product.kind === 'cacao-toad')!.crowns;
    const before = await readGame(page),
      writes = posts(page);
    await page.locator('[data-product="random-beans"]').click();
    const information = page.locator('.shop-info-object');
    await information.click();
    await expect(page.locator('.bean-use-story')).toBeVisible();
    await photo(page, `${language}-07-beans-information`, info);
    await page.keyboard.press('Escape');
    await expect(information).toBeFocused();
    await expect(page.locator('.sweetshop-scene .flavour-cabinet')).toHaveCount(0);
    await page.locator('[data-product="cacao-toad"]').click();
    expect(await readGame(page)).toEqual(before);
    expect(writes).toEqual([]);
    await photo(page, `${language}-08-buy-open`, info);
    const buy = page.locator('.shop-purchase-ticket[data-primary-action]');
    await expect(buy).toHaveAccessibleName(
      new RegExp(language === 'es' ? 'Comprar y abrir' : 'Buy and open'),
    );
    await expect(buy).toHaveAccessibleName(new RegExp(String(price)));
    await buy.click();
    await result(page, language, false);
    const opened = await readGame(page);
    expect(writes).toEqual(['/api/toads/buy-open']);
    expect(opened.revision).toBe(before.revision + 1);
    expect(opened.inventory.crowns).toBe(before.inventory.crowns - price);
    expect(opened.copies).toHaveLength(before.copies.length + 1);
    expect(opened.receipts).toHaveLength(before.receipts.length + 1);
    expect(opened.receipts.at(-1)?.kind).toBe('buy-open-toad');
    expect(
      opened.inventory.products.filter(
        (product) => product.kind === 'cacao-toad' && product.status === 'available',
      ),
    ).toHaveLength(0);
    await photo(page, `${language}-09-frog-result`, info);
    await changeLanguage(page, language === 'es' ? 'en' : 'es');
    await changeLanguage(page, language);
    expect(await readGame(page)).toEqual(opened);
    await page.reload();
    await expect(page.locator('.sweetshop-scene')).toBeVisible();
    await expect(page.locator('.reveal')).toHaveCount(0);
    expect(await readGame(page)).toEqual(opened);
    await page.locator('[data-product="random-beans"]').click();
    const beforeBeans = await readGame(page);
    const beansPrice = content.shop.products.find(
      (product) => product.kind === 'random-beans',
    )!.crowns;
    await page.locator('.shop-purchase-ticket').click();
    await expect.poll(async () => (await readGame(page)).revision).toBe(beforeBeans.revision + 1);
    const beans = await readGame(page);
    expect(beans.inventory.crowns).toBe(beforeBeans.inventory.crowns - beansPrice);
    expect(beans.receipts.at(-1)?.kind).toBe('purchase');
    await expect(page.locator('.bean-prepare-action[data-primary-action]')).toBeVisible();
    await photo(page, `${language}-10-beans-next`, info);
    await page.locator('.bean-prepare-action').click();
    await expect(page.locator('.preparation-dialog[open]')).toBeVisible();
    expect(await readGame(page)).toEqual(beans);
    await page.keyboard.press('Escape');
    expect(writes).toEqual(['/api/toads/buy-open', '/api/purchases']);
    await mkdir(evidence, { recursive: true });
    await writeFile(
      resolve(evidence, `${info.project.name}-${language}-atomic-flow.json`),
      JSON.stringify(
        {
          price,
          beansPrice,
          writes,
          beforeRevision: before.revision,
          afterRevision: beans.revision,
          openingReceipt: opened.receipts.at(-1),
        },
        null,
        2,
      ),
    );
  });

  test(`A60 earned sealed frog opens without a second purchase ${language}`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await enter(page, language);
    await startExpedition(page, language);
    const bossId = await reachTarget(page, 'boss', language);
    await page.locator(`[data-node="${bossId}"]`).click();
    await resolveEvent(page);
    await expect(page.locator('.arena-caption button:not([data-arena-facts-trigger])')).toBeVisible();
    await leaveBattle(page);
    await counter(page);
    const before = await readGame(page);
    expect(
      before.inventory.products.some(
        (product) => product.kind === 'cacao-toad' && product.status === 'available',
      ),
    ).toBe(true);
    await expect(page.locator('.shop-purchase-ticket')).toHaveCount(0);
    const open = page.locator('.open-frog-action[data-primary-action]');
    await expect(open).toHaveAccessibleName(
      new RegExp(language === 'es' ? 'Sin coste adicional' : 'No additional cost'),
    );
    await photo(page, `${language}-11-owned-frog`, info);
    const writes = posts(page);
    await open.click();
    await result(page, language);
    const after = await readGame(page);
    expect(writes).toEqual(['/api/toads/open']);
    expect(after.inventory.crowns).toBe(before.inventory.crowns);
    expect(after.copies).toHaveLength(before.copies.length + 1);
    expect(after.receipts).toHaveLength(before.receipts.length + 1);
    expect(after.receipts.at(-1)?.kind).toBe('open-toad');
    await expect(page.locator('.celebration-a59')).toHaveCount(0);
    await expect(page.locator('.frog-magic canvas')).toHaveCount(0);
    await photo(page, `${language}-12-owned-reduced-result`, info);
    await page.reload();
    await expect(page.locator('.sweetshop-scene')).toBeVisible();
    await expect(page.locator('.reveal')).toHaveCount(0);
    expect(await readGame(page)).toEqual(after);
    expect(writes).toHaveLength(1);
  });

  test(`A60 reduced-motion purchase has a static confirmed result on a narrow screen ${language}`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await enter(page, language);
    await counter(page);
    await page.setViewportSize({ width: 390, height: 844 });
    const before = await readGame(page),
      writes = posts(page);
    await page.locator('.shop-purchase-ticket').click();
    await result(page, language);
    const after = await readGame(page);
    expect(after.copies).toHaveLength(before.copies.length + 1);
    expect(after.inventory.crowns).toBe(before.inventory.crowns - 10);
    await expect(page.locator('.celebration-a59')).toHaveCount(0);
    await expect(page.locator('.frog-magic canvas')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await photo(page, `${language}-13-reduced-mobile`, info);
    await page.locator('.reveal-continue').click();
    await page.locator('.shop-street-exit').click();
    await expect(page.locator('.shop-alley')).toBeVisible();
    expect(await readGame(page)).toEqual(after);
    expect(writes).toEqual(['/api/toads/buy-open']);
  });
}
