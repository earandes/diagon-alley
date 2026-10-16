import { test, expect, type Page } from '@playwright/test';
import { Pool } from 'pg';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { changeLanguage, startExpedition } from './game-fixture';
import { readGame } from './route-helpers';
import { preparedRoutePath } from '../support/prepared-route';
import { previewEncounterTrade } from '../../src/arcana/domain/exploration/encounter-trades';
import type { Language } from '../../src/arcana/domain/collection/wizards';
import type { NodeKind } from '../../src/arcana/domain/exploration/route';

const root = resolve('docs/arcana/progression-increment-2026-10-16/evidence/browser');
const sizes = [
  { width: 1280, height: 900 },
  { width: 390, height: 844 },
  { width: 865, height: 1079 },
];
const pool = new Pool({
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  database: 'arcana_dev',
  max: 2,
});
const created = new Set<string>();
test.afterAll(async () => {
  if (created.size)
    await pool.query('DELETE FROM arcana_accounts WHERE player_id=ANY($1::text[])', [[...created]]);
  await pool.end();
});
async function capture(page: Page, name: string, scrollAllowed = false) {
  await mkdir(root, { recursive: true });
  const geometry = [];
  for (const size of sizes) {
    await page.setViewportSize(size);
    const dialog = page.locator('.node-event-dialog[open]');
    if (await dialog.count()) {
      const metrics = await dialog.evaluate((el) => ({
        width: el.clientWidth,
        scrollWidth: el.scrollWidth,
        height: el.clientHeight,
        scrollHeight: el.scrollHeight,
      }));
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width + 1);
      if (!scrollAllowed) expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.height + 1);
      geometry.push({ ...size, ...metrics });
    }
    if (process.env.ARCANA_CAPTURE_EVIDENCE === '1') {
      await page.screenshot({
        path: resolve(root, `${test.info().project.name}-${name}-${size.width}.png`),
        fullPage: false,
        animations: 'disabled',
      });
    }
  }
  await page.setViewportSize(sizes[0]);
  return geometry;
}
async function enter(page: Page, language: Language, pack = 'diagon-alley', start = true) {
  await page.addInitScript(
    (pack) => localStorage.setItem('arcana.presentation.content-pack.v1', pack),
    pack,
  );
  await page.goto('/');
  if (language === 'en') await changeLanguage(page, language);
  await page.locator('.portal-enter').click();
  await expect(page.locator('[data-expedition-preparation="new"]')).toBeVisible();
  created.add((await readGame(page)).playerId);
  if (start) await startExpedition(page, language);
}
async function closeReplay(page: Page, language: Language) {
  if (!(await page.locator('.arena-a63').count())) return;
  const skip = page.getByRole('button', {
    name: language === 'es' ? 'Omitir reproducción' : 'Skip playback',
    exact: true,
  });
  if (await skip.isEnabled()) await skip.click();
  await page
    .getByRole('button', {
      name: language === 'es' ? 'Volver al mapa' : 'Back to map',
      exact: true,
    })
    .click();
  await expect(page.locator('[data-map-phase="route"]')).toBeVisible();
}
async function confirmEvent(page: Page, language: Language) {
  const pact = page.locator('[data-pact-candidate]');
  if (await pact.count()) {
    if (await pact.first().isEnabled()) await pact.first().click();
    else await page.locator('[data-pact-choice="pass"]').click();
    const replacements = page.locator('[data-tactical-pact] [data-visual-value]');
    if (!(await page.locator('.node-confirm-action').isEnabled()) && (await replacements.count()))
      await replacements.first().click();
  }
  const pass = page.locator('[data-encounter-choice="pass"]');
  if (await pass.count()) await pass.click();
  await page.locator('.node-confirm-action').click();
  await expect(page.locator('.node-event-dialog')).toHaveCount(0);
  await closeReplay(page, language);
}
async function reach(page: Page, kind: NodeKind, language: Language) {
  const run = (await readGame(page)).exploration!.run!;
  const path = preparedRoutePath(run, kind);
  for (const id of path.slice(0, -1)) {
    await page.locator(`[data-node="${id}"]`).click();
    await confirmEvent(page, language);
  }
  return path.at(-1)!;
}
/** Declared adverse-condition fixture, scoped only to the account created by this test.
 * No currencies, rewards, inventory or campaign snapshots are changed. */
async function conditionFixture(page: Page) {
  const state = await readGame(page);
  expect(created.has(state.playerId)).toBe(true);
  const currentRun = structuredClone(state.exploration!.run!);
  const run = {
    ...currentRun,
    members: currentRun.members.map((member) => ({
      ...member,
      unit: { ...member.unit, hp: member.unit.maxHp * 0.5, mana: member.unit.maxMana * 0.5 },
    })),
  };
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const locked = await client.query(
      'SELECT revision FROM arcana_accounts WHERE player_id=$1 FOR UPDATE',
      [state.playerId],
    );
    expect(Number(locked.rows[0].revision)).toBe(state.revision);
    const changed = await client.query(
      'UPDATE arcana_exploration SET run_state=$1::jsonb WHERE player_id=$2 AND run_id=$3',
      [JSON.stringify(run), state.playerId, run.id],
    );
    expect(changed.rowCount).toBe(1);
    await client.query('UPDATE arcana_accounts SET revision=revision+1 WHERE player_id=$1', [
      state.playerId,
    ]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  await page.reload();
  await expect(page.locator('.branch-map')).toBeVisible();
  return readGame(page);
}
async function mapGeometry(page: Page) {
  const game = await readGame(page);
  await expect(page.locator('.map-node')).toHaveCount(game.exploration!.run!.graph.nodes.length);
  // WebKit can deliver the viewport resize before ResizeObserver updates the scene layout.
  // Wait for the actual geometry, never clip or remove actors to satisfy the assertion.
  await expect
    .poll(
      () =>
        page.locator('.map-scroll').evaluate((el) => {
          const host = el.getBoundingClientRect();
          return (
            el.scrollHeight <= el.clientHeight + 1 &&
            el.scrollWidth <= el.clientWidth + 1 &&
            [...el.querySelectorAll('.map-node > button')].every((node) => {
              const box = node.getBoundingClientRect();
              return (
                box.left >= host.left - 1 &&
                box.right <= host.right + 1 &&
                box.top >= host.top - 1 &&
                box.bottom <= host.bottom + 1
              );
            })
          );
        }),
      { message: 'The resized map and every actor must fit without scrolling' },
    )
    .toBe(true);
}
for (const language of ['es', 'en'] as const)
  for (const pack of ['diagon-alley', 'arcana'] as const) {
    test(`A67 encounter full journey ${language} ${pack}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.emulateMedia({ reducedMotion: pack === 'arcana' ? 'reduce' : 'no-preference' });
      await enter(page, language, pack, false);
      const initial = await readGame(page);
      await page.locator('[data-challenge-picker]>summary').click();
      await expect(page.locator('[data-expedition-challenge]')).toHaveCount(3);
      for (const challenge of ['mastery', 'tactical', 'discovery']) {
        await page.locator(`[data-expedition-challenge="${challenge}"]`).click();
        expect(await readGame(page)).toEqual(initial);
      }
      await capture(page, `${pack}-${language}-challenge-picker`);
      await page.locator('[data-challenge-picker]>summary').click();
      await startExpedition(page, language);
      const started = (await readGame(page)).exploration!.run!;
      expect(started.challenge).toBe('discovery');
      expect(started.equipmentRulesVersion).toBe(2);
      for (const size of sizes) {
        await page.setViewportSize(size);
        await mapGeometry(page);
      }
      await capture(page, `${pack}-${language}-map-discovery`);
      const nodeId = await reach(page, 'encounter', language);
      const before = await conditionFixture(page);
      const run = before.exploration!.run!;
      const plan = run.campaignSnapshot!.nodes.find((plan) => plan.nodeId === nodeId)!;
      if (plan.kind !== 'encounter' || !plan.offer) throw Error('Expected A67 offer snapshot');
      const origin = page.locator(`[data-node="${nodeId}"]`);
      await origin.focus();
      await page.keyboard.press('Enter');
      const choices = page.locator('[data-encounter-choice]:not([data-encounter-choice="pass"])');
      await expect(choices).toHaveCount(2);
      await expect(page.locator('.node-confirm-action')).toBeDisabled();
      const id = plan.offer.options.find((option) => option.scope === 'unit')!.id;
      await page.locator(`[data-encounter-choice="${id}"]`).focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('.node-confirm-action')).toBeDisabled();
      await page.locator('[data-encounter-unit]').first().focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('.node-confirm-action')).toBeEnabled();
      const unitId = run.members[0].unit.id;
      const expected = previewEncounterTrade(run.members, plan.offer, id, unitId);
      const geometry = await capture(page, `${pack}-${language}-encounter-unit`);
      expect(await readGame(page)).toEqual(before);
      await page.locator('.encounter-help>summary').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('.encounter-help')).toHaveAttribute('open', '');
      await page.keyboard.press('Escape');
      await expect(page.locator('.node-event-dialog')).toHaveCount(0);
      await expect(origin).toBeFocused();
      expect(await readGame(page)).toEqual(before);
      await page.reload();
      await expect(page.locator('.branch-map')).toBeVisible();
      expect(
        (await readGame(page)).exploration!.run!.campaignSnapshot!.nodes.find(
          (plan) => plan.nodeId === nodeId,
        ),
      ).toEqual(plan);
      await page.locator(`[data-node="${nodeId}"]`).click();
      await page.locator(`[data-encounter-choice="${id}"]`).click();
      await page.locator(`[data-encounter-unit="${unitId}"]`).click();
      const startedAt = Date.now();
      await page.locator('.node-confirm-action').click();
      await expect(page.locator('.node-event-dialog')).toHaveCount(0);
      const committed = await readGame(page),
        receipt = committed.receipts.at(-1);
      expect(receipt?.kind).toBe('advance-node');
      if (receipt?.kind !== 'advance-node') throw Error('Expected encounter receipt');
      expect(receipt.encounter?.trade?.offer).toEqual(plan.offer);
      expect(receipt.encounter?.trade?.vitals).toEqual(expected.vitals);
      expect(committed.exploration!.run!.members).toEqual(expected.members);
      expect(committed.inventory).toEqual(before.inventory);
      expect(committed.copies).toEqual(before.copies);
      await page.locator('.receipt-disclosure>summary').click();
      await expect(page.locator('[data-encounter-trade]')).toBeVisible();
      const usableMs = Date.now() - startedAt;
      await capture(page, `${pack}-${language}-encounter-confirmed`, true);
      await page.reload();
      await expect(page.locator('.branch-map')).toBeVisible();
      expect(await readGame(page)).toEqual(committed);
      await writeFile(
        resolve(root, `${test.info().project.name}-${pack}-${language}-encounter-metrics.json`),
        JSON.stringify(
          {
            fixture:
              'Own isolated account; HP/MP set to50% viaSQL before encounter. Other nodes use real API.',
            geometry,
            usableMs,
            measurement:
              'Runner click to receipt visible; includes authority/network and runner overhead; not human timing or FPS.',
          },
          null,
          2,
        ),
      );
      expect(errors).toEqual([]);
    });
  }
for (const language of ['es', 'en'] as const) {
  test(`A67 group trade response recovery and pass ${language}`, async ({ page }) => {
    await enter(page, language);
    const id = await reach(page, 'encounter', language);
    const before = await conditionFixture(page),
      run = before.exploration!.run!;
    const plan = run.campaignSnapshot!.nodes.find((plan) => plan.nodeId === id)!;
    if (plan.kind !== 'encounter' || !plan.offer) throw Error('Expected trade');
    const group = plan.offer.options.find((option) => option.scope === 'team')!;
    await page.locator(`[data-node="${id}"]`).click();
    await page.locator(`[data-encounter-choice="${group.id}"]`).click();
    await expect(page.locator('[data-encounter-unit]')).toHaveCount(0);
    await capture(page, `${language}-encounter-group`);
    await page.locator('[data-encounter-choice="pass"]').click();
    await page.locator('.node-cancel-action').click();
    expect(await readGame(page)).toEqual(before);
    await page.locator(`[data-node="${id}"]`).click();
    await page.locator(`[data-encounter-choice="${group.id}"]`).click();
    let posts = 0;
    let responseLost = false;
    page.on('request', (r) => {
      if (r.method() === 'POST' && r.url().endsWith('/nodes/advance')) posts++;
    });
    await page.route('**/api/nodes/advance', async (route) => {
      const response = await route.fetch();
      expect(response.ok()).toBe(true);
      await route.abort('failed');
      responseLost = true;
    });
    await page.locator('.node-confirm-action').click();
    const recovery = page.locator('.node-event-dialog').getByRole('button', {
      name: language === 'es' ? 'Recuperar operación' : 'Recover operation',
      exact: true,
    });
    await expect.poll(() => responseLost).toBe(true);
    await expect(recovery).toBeVisible();
    const committed = await readGame(page);
    expect(committed.exploration!.run!.members).toEqual(
      previewEncounterTrade(run.members, plan.offer, group.id).members,
    );
    await recovery.click();
    await expect(page.locator('.node-event-dialog')).toHaveCount(0);
    await page.reload();
    await expect(page.locator('.branch-map')).toBeVisible();
    expect(await readGame(page)).toEqual(committed);
    expect(posts).toBe(1);
  });
  test(`A67 forge specializations equip V2 then replay ${language}`, async ({ page }) => {
    await enter(page, language, 'diagon-alley', false);
    await page.goto('/#/shop/workshop');
    await expect(page.locator('.shop-workshop')).toBeVisible();
    const initial = await readGame(page);
    for (const core of ['wyvern', 'phoenix']) {
      await page.locator(`[data-visual-value="${core}"]`).click();
      const beforeQuote = await readGame(page);
      await page.locator('.forge-action').click();
      await expect(page.locator('.shop-trade-confirmation')).toBeVisible();
      await page
        .locator('.shop-trade-confirmation')
        .getByRole('button', { name: language === 'es' ? 'Cancelar' : 'Cancel', exact: true })
        .click();
      const before = await readGame(page);
      expect(before).toEqual(beforeQuote);
      await page.locator('.forge-action').click();
      await page.locator('.shop-confirm-seal').click();
      await expect(page.locator('.shop-trade-confirmation')).toHaveCount(0);
      const state = await readGame(page),
        receipt = state.receipts.at(-1);
      expect(receipt?.kind).toBe('forge-wand');
      if (receipt?.kind !== 'forge-wand') throw Error('Expected forged item');
      expect(receipt.equipment.version).toBe(2);
      if (receipt.equipment.kind !== 'wand') throw Error('Expected wand');
      expect(state.inventory.crowns).toBe(before.inventory.crowns - 15);
      expect(
        core === 'wyvern' ? receipt.equipment.initiativeBonus : receipt.equipment.healing,
      ).toBe(core === 'wyvern' ? 3 : 2);
    }
    expect((await readGame(page)).inventory.crowns).toBe(initial.inventory.crowns - 30);
    await capture(page, `${language}-workshop-v2`);
    await page.goto('/#/map');
    await expect(page.locator('[data-expedition-preparation="new"]')).toBeVisible();
    const state = await readGame(page),
      own = state.copies[0],
      item = state.inventory.equipment!.find((item) => item.kind === 'wand' && item.healing === 2)!;
    await page.locator(`[data-preparation-inspect="${own.copyId}"]`).click();
    await expect(page.locator('.preparation-inspection[open]')).toBeVisible();
    await page.locator('.preparation-inspection .preparation-gear-slot').first().click();
    await page.locator(`[data-equipment-id="${item.id}"]`).click();
    await expect(page.locator(`[data-equipment-id="${item.id}"]`)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.keyboard.press('Escape');
    await page.locator('[data-challenge-picker]>summary').click();
    await page.locator('[data-expedition-challenge="tactical"]').click();
    await startExpedition(page, language);
    const run = (await readGame(page)).exploration!.run!;
    expect(run.challenge).toBe('tactical');
    expect(run.members[0].unit.wandHealing).toBe(2);
    await capture(page, `${language}-map-tactical`);
    const duel = await reach(page, 'duel', language);
    // Declared own-account condition fixture makes the new equipment effect observable.
    await conditionFixture(page);
    await page.locator(`[data-node="${duel}"]`).click();
    await page.locator('.node-confirm-action').click();
    await expect(page.locator('.arena-a63')).toBeVisible();
    const confirmed = await readGame(page),
      receipt = confirmed.receipts.at(-1);
    if (receipt?.kind !== 'advance-node' || !receipt.battle)
      throw Error('Missing confirmed battle');
    expect(receipt.battle.input.player[0].wandHealing).toBe(2);
    expect(
      receipt.battle.events.some(
        (event) => event.kind === 'healed' && event.source === 'equipment',
      ),
    ).toBe(true);
    await expect(page.locator('.arena-a63 [data-unit]')).toHaveCount(
      receipt.battle.input.player.length + receipt.battle.input.rival.length,
    );
    await capture(page, `${language}-specialized-arena`);
    const skip = page.getByRole('button', {
      name: language === 'es' ? 'Omitir reproducción' : 'Skip playback',
      exact: true,
    });
    if (await skip.isEnabled()) await skip.click();
    await page.locator('.arena-record-trigger').click();
    await expect(page.locator('.arena-inspector')).toContainText(
      language === 'es' ? 'con su varita' : 'with their wand',
    );
    await capture(page, `${language}-specialized-record`, true);
    await page.locator('.arena-inspector-close').click();
    await page.reload();
    await expect(page.locator('.arena-a63')).toBeVisible();
    expect(await readGame(page)).toEqual(confirmed);
  });
  test(`A67 missing art renderer reduced and enlarged encounter ${language}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route('**/*.webp', (route) => route.abort());
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        type: string,
        ...args: unknown[]
      ) {
        return type.includes('webgl') ? null : Reflect.apply(original, this, [type, ...args]);
      } as typeof original;
    });
    await enter(page, language);
    const id = await reach(page, 'encounter', language),
      before = await readGame(page);
    await page.locator(`[data-node="${id}"]`).focus();
    await page.keyboard.press('Enter');
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
    const pass = page.locator('[data-encounter-choice="pass"]');
    await pass.focus();
    await page.keyboard.press('Enter');
    await expect(pass).toHaveAttribute('aria-pressed', 'true');
    await capture(page, `${language}-adverse-encounter-200`, true);
    expect(await readGame(page)).toEqual(before);
    await page.locator('.node-confirm-action').click();
    await expect(page.locator('.node-event-dialog')).toHaveCount(0);
    const after = await readGame(page);
    expect(after.inventory).toEqual(before.inventory);
    expect(after.exploration!.run!.members).toEqual(before.exploration!.run!.members);
    const receipt = after.receipts.at(-1);
    expect(receipt?.kind === 'advance-node' && receipt.request.encounterAction).toBe('pass');
  });
}
