import { leaveBattle, skipBattle } from './battle-controls';
import { test, expect, type Page, type Locator } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { changeLanguage, startExpedition } from './game-fixture';
import { readGame, expectMapFits } from './route-helpers';
import { routePath } from '../support/arcana-route';
import type { Language } from '../../src/arcana/domain/collection/wizards';

const evidence = resolve(
  process.env.ARCANA_PACT_EVIDENCE ??
    'docs/arcana/tactical-increment-2026-10-16/evidence/after-pacts',
);
const sizes = [
  { width: 1280, height: 900 },
  { width: 390, height: 844 },
  { width: 865, height: 1079 },
];
async function shoot(page: Page, name: string) {
  await mkdir(evidence, { recursive: true });
  await page.screenshot({
    path: resolve(evidence, `${test.info().project.name}-${name}.png`),
    fullPage: true,
    animations: 'disabled',
  });
}
async function enter(page: Page, language: Language, pack = 'diagon-alley') {
  await page.addInitScript(
    (pack) => localStorage.setItem('arcana.presentation.content-pack.v1', pack),
    pack,
  );
  await page.goto('/');
  if (language === 'en') await changeLanguage(page, language);
  await page.locator('.portal-enter').click();
  await expect(page.locator('[data-expedition-preparation="new"]')).toBeVisible();
  const challenge = page.locator('[data-challenge-picker] > summary');
  if (await challenge.count()) {
    // A65 threat contracts belong to Tactical; Discovery intentionally has neutral intro duels.
    await challenge.click();
    await page.locator('[data-expedition-challenge="tactical"]').click();
    await challenge.click();
  }
  await startExpedition(page, language);
}
async function measure(page: Page, target: Locator, complete: () => Promise<unknown>) {
  await page.evaluate(() => {
    const scope = window as unknown as { a65Start?: number };
    document.addEventListener(
      'pointerdown',
      () => {
        scope.a65Start = performance.now();
      },
      { once: true, capture: true },
    );
  });
  await target.click();
  await complete();
  return page.evaluate(
    () => performance.now() - (window as unknown as { a65Start: number }).a65Start,
  );
}
async function confirm(page: Page) {
  const candidates = page.locator('[data-pact-candidate]');
  if (await candidates.count()) await candidates.first().click();
  const pass = page.locator(
    '[data-encounter-offer] [data-encounter-choice="pass"], [data-preparation="encounter"] [data-visual-value="pass"]',
  );
  if (await pass.count()) await pass.click();
  await page.locator('.node-confirm-action').click();
  await expect(page.locator('.node-event-dialog')).toHaveCount(0);
}
async function reachDuel(page: Page, _language: Language) {
  const run = (await readGame(page)).exploration!.run!;
  const path = routePath(run.graph, run.visited, 'duel');
  // Traversal reads real authoritative edges. It is technical QA, not an observation of a player.
  for (const id of path.slice(0, -1)) {
    await page.locator(`[data-node="${id}"]`).click();
    await confirm(page);
    if (await page.locator('.arena-a63').count()) {
      await skipBattle(page);
      await leaveBattle(page);
    }
  }
  return path.at(-1)!;
}
async function mapGeometry(page: Page) {
  const game = await readGame(page);
  const count = game.exploration!.run!.graph.nodes.length;
  await expect(page.locator('.map-node')).toHaveCount(count);
  await expectMapFits(page);
  const result = await page.evaluate(() => {
    const host = document.querySelector('.map-scroll')!,
      viewport = { width: innerWidth, height: innerHeight };
    const r = host.getBoundingClientRect();
    return {
      viewport,
      document: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      host: {
        width: host.clientWidth,
        height: host.clientHeight,
        scrollWidth: host.scrollWidth,
        scrollHeight: host.scrollHeight,
        top: r.top,
        bottom: r.bottom,
      },
      nodes: [...document.querySelectorAll('.map-node > button')].map((e) => {
        const b = e.getBoundingClientRect();
        return {
          id: e.getAttribute('data-node'),
          x: b.x,
          y: b.y,
          width: b.width,
          height: b.height,
        };
      }),
    };
  });
  expect(result.document.width).toBeLessThanOrEqual(result.viewport.width + 1);
  expect(result.document.height).toBeLessThanOrEqual(result.viewport.height + 1);
  expect(result.host.scrollHeight).toBeLessThanOrEqual(result.host.height + 1);
  expect(result.host.scrollWidth).toBeLessThanOrEqual(result.host.width + 1);
  for (const node of result.nodes) {
    expect(node.x).toBeGreaterThanOrEqual(-1);
    expect(node.x + node.width).toBeLessThanOrEqual(result.viewport.width + 1);
    expect(node.y).toBeGreaterThanOrEqual(result.host.top - 1);
    expect(node.y + node.height).toBeLessThanOrEqual(result.host.bottom + 1);
  }
  return result;
}

for (const language of ['es', 'en'] as const)
  for (const pack of ['diagon-alley', 'arcana'] as const) {
    test(`A65 choose, compare, prepare and resolve ${language} ${pack}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.emulateMedia({ reducedMotion: pack === 'arcana' ? 'reduce' : 'no-preference' });
      await enter(page, language, pack);
      const metrics: Record<string, unknown> = {
        language,
        pack,
        engine: test.info().project.name,
        profile: 'pointerdown → usable DOM; includes network/renderer wait; not FPS',
      };
      const geometry = [];
      for (const size of sizes) {
        await page.setViewportSize(size);
        geometry.push(await mapGeometry(page));
        await shoot(page, `${pack}-${language}-map-${size.width}`);
      }
      await page.setViewportSize(sizes[0]);
      const initial = await readGame(page),
        run = initial.exploration!.run!;
      const first = run.graph.nodes.find((n) => n.row === 0)!;
      let posts = 0;
      page.on('request', (request) => {
        if (request.method() === 'POST' && request.url().endsWith('/nodes/advance')) posts++;
      });
      metrics.openPactMs = await measure(page, page.locator(`[data-node="${first.id}"]`), () =>
        expect(page.locator('[data-tactical-pact]')).toBeVisible(),
      );
      const candidates = page.locator('[data-pact-candidate]');
      await expect(candidates).toHaveCount(2);
      await expect(page.locator('.node-confirm-action')).toBeDisabled();
      const offered = await candidates.evaluateAll((items) =>
        items.map((e) => e.getAttribute('data-pact-candidate')),
      );
      metrics.selectCandidateMs = await measure(page, candidates.first(), () =>
        expect(candidates.first()).toHaveAttribute('aria-pressed', 'true'),
      );
      await expect(page.locator('.node-confirm-action')).toBeEnabled();
      await expect(page.locator('[data-affinity-progress]')).toHaveCount(2);
      expect(await readGame(page)).toEqual(initial);
      expect(posts).toBe(0);
      for (const size of sizes) {
        await page.setViewportSize(size);
        const geometry = await page
          .locator('.node-event-dialog')
          .evaluate((e) => ({ client: e.clientHeight, scroll: e.scrollHeight }));
        expect(geometry.scroll).toBeLessThanOrEqual(geometry.client + 1);
        await shoot(page, `${pack}-${language}-pact-selected-${size.width}`);
      }
      const inspector = page.locator('.tactical-pact-inspector > summary').first();
      await inspector.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('.tactical-pact-inspector').first()).toHaveAttribute('open', '');
      await shoot(page, `${pack}-${language}-pact-inspected`);
      await page.locator('.node-cancel-action').click();
      await expect(page.locator('.node-event-dialog')).toHaveCount(0);
      expect(await readGame(page)).toEqual(initial);
      await page.reload();
      await expect(page.locator('.branch-map')).toBeVisible();
      await page.locator(`[data-node="${first.id}"]`).click();
      expect(
        await candidates.evaluateAll((items) =>
          items.map((e) => e.getAttribute('data-pact-candidate')),
        ),
      ).toEqual(offered);
      await expect(page.locator('.node-confirm-action')).toBeDisabled();
      await candidates.first().click();
      metrics.confirmPactMs = await measure(page, page.locator('.node-confirm-action'), () =>
        expect(page.locator('.node-event-dialog')).toHaveCount(0),
      );
      const recruited = await readGame(page);
      expect(recruited.exploration!.run!.members).toHaveLength(run.members.length + 1);
      expect(recruited.copies).toEqual(initial.copies);
      expect(recruited.inventory).toEqual(initial.inventory);
      expect(recruited.exploration!.run!.members.at(-1)?.unit.id).toBe(offered[0]);
      const recruitmentReceipt = recruited.receipts.at(-1);
      expect(
        recruitmentReceipt?.kind === 'advance-node' && recruitmentReceipt.request.recruitId,
      ).toBe(offered[0]);
      expect(posts).toBe(1);

      const duelId = await reachDuel(page, language);
      const beforeDuel = await readGame(page);
      expect(beforeDuel.exploration!.run!.members.length).toBeGreaterThanOrEqual(3);
      const plan = beforeDuel.exploration!.run!.campaignSnapshot!.nodes.find(
        (n) => n.nodeId === duelId,
      )!;
      if (plan.kind !== 'duel') throw Error('Expected real duel');
      await expect(
        page.locator(`[data-node="${duelId}"] [data-threat="${plan.threat}"]`),
      ).toBeVisible();
      await page.locator(`[data-node="${duelId}"]`).click();
      await expect(page.locator('.tactical-threat-help')).toBeVisible();
      await page.locator('.tactical-threat-help > summary').click();
      await page.locator('.tactical-rival-inspector > summary').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('.tactical-rival-inspector[open] section')).toHaveCount(
        plan.opponents.length,
      );
      await shoot(page, `${pack}-${language}-rival-inspected`);
      await page.locator('.node-cancel-action').click();
      expect(await readGame(page)).toEqual(beforeDuel);
      // Buy one actual bean via the existing UI, then assign/cancel/confirm with this real rival.
      await page.goto('/#/shop/confectionery');
      await expect(page.locator('.sweetshop-scene')).toBeVisible();
      await page.locator('[data-product="random-beans"]').click();
      await page.locator('.shop-purchase-ticket').click();
      await expect.poll(async () => (await readGame(page)).revision).toBe(beforeDuel.revision + 1);
      await expect(page.locator('.bean-prepare-action')).toBeVisible();
      const bought = await readGame(page);
      expect(bought.inventory.crowns).toBe(beforeDuel.inventory.crowns - 5);
      await page.goto('/#/map');
      await page.locator(`[data-node="${duelId}"]`).click();
      await page.locator('.node-bean-preparation > summary').click();
      await page.locator('[data-bean-unit]').first().click();
      await expect(page.locator('[data-bean-unit][aria-pressed="true"]')).toHaveCount(1);
      expect(await readGame(page)).toEqual(bought);
      await page.locator('.node-cancel-action').click();
      expect(await readGame(page)).toEqual(bought);
      await page.locator(`[data-node="${duelId}"]`).click();
      await page.locator('.node-bean-preparation > summary').click();
      await expect(page.locator('[data-bean-unit][aria-pressed="true"]')).toHaveCount(0);
      await page.locator('[data-bean-unit]').first().click();
      await shoot(page, `${pack}-${language}-duel-preparation`);
      await page.locator('.node-confirm-action').click();
      await expect(page.locator('.arena-a63')).toBeVisible();
      const committed = await readGame(page),
        receipt = committed.receipts.at(-1);
      if (receipt?.kind !== 'advance-node' || !receipt.battle)
        throw Error('Missing committed combat');
      expect(receipt.battle.events.some((e) => e.kind === 'bean-activated')).toBe(true);
      const log = JSON.stringify(receipt.battle);
      await skipBattle(page);
      await expect(page.locator('[data-arena-outcome]')).toBeVisible();
      await shoot(page, `${pack}-${language}-duel-result`);
      expect(await readGame(page)).toEqual(committed);
      const replayedReceipt = (await readGame(page)).receipts.at(-1);
      expect(
        JSON.stringify(replayedReceipt?.kind === 'advance-node' && replayedReceipt.battle),
      ).toBe(log);
      expect(errors).toEqual([]);
      metrics.geometry = geometry;
      await writeFile(
        resolve(evidence, `${test.info().project.name}-${pack}-${language}-measurements.json`),
        JSON.stringify(metrics, null, 2),
      );
    });
  }

test('A65 transport fixture: lost recruitment response recovers exactly one chosen ally', async ({
  page,
}) => {
  await enter(page, 'es');
  const before = await readGame(page),
    first = before.exploration!.run!.graph.nodes.find((n) => n.row === 0)!;
  await page.locator(`[data-node="${first.id}"]`).click();
  const candidate = page.locator('[data-pact-candidate]').last();
  const recruitId = await candidate.getAttribute('data-pact-candidate');
  await candidate.click();
  let posts = 0;
  let confirmDropped!: () => void;
  const dropped = new Promise<void>((resolve) => {
    confirmDropped = resolve;
  });
  await page.route('**/api/nodes/advance', async (route) => {
    posts++;
    const response = await route.fetch();
    expect(response.status()).toBe(200);
    await route.abort('failed');
    confirmDropped();
  });
  await page.locator('.node-confirm-action').click();
  await dropped;
  await expect(
    page
      .locator('.node-event-dialog')
      .getByRole('button', { name: 'Recuperar operación', exact: true }),
  ).toBeVisible();
  const committed = await readGame(page);
  expect(committed.exploration!.run!.members).toHaveLength(2);
  expect(committed.exploration!.run!.members.at(-1)?.unit.id).toBe(recruitId);
  await page.unroute('**/api/nodes/advance');
  await page.reload();
  await expect(page.locator('.branch-map')).toBeVisible();
  expect(await readGame(page)).toEqual(committed);
  expect(posts).toBe(1);
  await shoot(page, 'transport-lost-response-recovered');
});

test('A65 transport fixture: two tabs cannot recruit both offers from one pact', async ({
  page,
  context,
}) => {
  await enter(page, 'es');
  const before = await readGame(page),
    id = before.exploration!.run!.graph.nodes.find((n) => n.row === 0)!.id;
  await page.locator(`[data-node="${id}"]`).click();
  await page.locator('[data-pact-candidate]').first().click();
  const other = await context.newPage();
  await other.goto('/#/map');
  await other.locator(`[data-node="${id}"]`).click();
  await other.locator('[data-pact-candidate]').last().click();
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  let intercepted = 0;
  await other.route('**/api/nodes/advance', async (route) => {
    intercepted++;
    await held;
    await route.continue();
  });
  await other.locator('.node-confirm-action').click();
  await expect.poll(() => intercepted).toBe(1);
  let secondPosts = 0;
  page.on('request', (r) => {
    if (r.method() === 'POST' && r.url().endsWith('/nodes/advance')) secondPosts++;
  });
  await page.locator('.node-confirm-action').click();
  // The shared operation claim blocks a second command before transport. This is the
  // actual two-tab client behavior; independent server races are covered by PG tests.
  await expect(page.locator('.node-event-dialog').getByRole('alert')).toBeVisible();
  expect(secondPosts).toBe(0);
  expect(await readGame(page)).toEqual(before);
  release();
  await expect(other.locator('.node-event-dialog')).toHaveCount(0);
  const committed = await readGame(other);
  await page.reload();
  await expect(page.locator('.branch-map')).toBeVisible();
  expect(await readGame(page)).toEqual(committed);
  expect(committed.exploration!.run!.members).toHaveLength(2);
  expect(
    committed.receipts.filter((r) => r.kind === 'advance-node' && r.request.nodeId === id),
  ).toHaveLength(1);
  await other.close();
});
