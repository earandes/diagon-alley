import { leaveBattle } from './battle-controls';
import { test, expect, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { changeLanguage, startExpedition } from './game-fixture';
import { readGame, reachNode, confirmEvent } from './route-helpers';
import type { GameState } from '../../src/arcana/application/game';
import { preparedRoutePath } from '../support/prepared-route';

const evidence = resolve('docs/arcana/tactical-increment-2026-10-16/evidence/after-intentions');
async function capture(page: Page, name: string) {
  await mkdir(evidence, { recursive: true });
  for (const size of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
    { width: 865, height: 1079 },
  ]) {
    await page.setViewportSize(size);
    await page.evaluate(
      () =>
        new Promise<void>((done) =>
          requestAnimationFrame(() => requestAnimationFrame(() => done())),
        ),
    );
    if (await page.locator('.branch-map').count()) {
      await expect
        .poll(
          async () =>
            page.locator('.map-node > button').evaluateAll((nodes) =>
              nodes.every((node) => {
                const box = node.getBoundingClientRect();
                return (
                  box.left >= -1 &&
                  box.top >= -1 &&
                  box.right <= innerWidth + 1 &&
                  box.bottom <= innerHeight + 1
                );
              }),
            ),
          { message: `Every map actor must fit at ${size.width}×${size.height}` },
        )
        .toBe(true);
      const reminder = page.locator('.expedition-panel > .intention-reminder > summary');
      if (await reminder.count()) {
        await expect
          .poll(
            async () =>
              reminder.evaluate((node) => {
                const box = node.getBoundingClientRect();
                const hit = document.elementFromPoint(
                  box.left + box.width / 2,
                  box.top + box.height / 2,
                );
                return !!hit?.closest('.intention-reminder');
              }),
            { message: 'Intention must be visible above the map, not hidden by its scene' },
          )
          .toBe(true);
      }
    }
    await page.screenshot({
      path: resolve(evidence, `${test.info().project.name}-${name}-${size.width}.png`),
      fullPage: true,
      animations: 'disabled',
    });
  }
  await page.setViewportSize({ width: 1280, height: 900 });
}
/** Technical setup on a fresh authority account. These API actions are not player observations. */
async function command(page: Page, path: string, state: GameState, request: unknown) {
  const response = await page.request.post(`/api/${path}`, {
    headers: {
      Origin: new URL(page.url()).origin,
      'X-Arcana-Player': state.playerId,
    },
    data: { key: randomUUID(), expectedRevision: state.revision, request },
  });
  const body = await response.json();
  expect(response.ok(), JSON.stringify(body)).toBe(true);
  return body.state as GameState;
}
async function technicalClosure(page: Page) {
  let state = await readGame(page);
  const original = state.exploration!.run!;
  const chosen = preparedRoutePath(original, 'boss');
  const setup: { nodeId: string; kind: string; revision: number }[] = [];
  for (const nodeId of chosen) {
    const run = state.exploration!.run!;
    const node = run.graph.nodes.find((n) => n.id === nodeId)!;
    const plan = run.campaignSnapshot?.nodes.find((n) => n.nodeId === nodeId);
    const options =
      node.kind === 'pact'
        ? run.members.length < 5
          ? {
              pactAction: 'recruit',
              ...(plan?.kind === 'pact' && plan.recruits ? { recruitId: plan.recruits[0].id } : {}),
            }
          : { pactAction: 'pass' }
        : node.kind === 'encounter'
          ? { encounterAction: 'pass' }
          : node.kind === 'refuge'
            ? { refugeAction: 'heal' }
            : {};
    state = await command(page, 'nodes/advance', state, {
      runId: run.id,
      nodeId,
      campaignVersion: run.campaignVersion,
      assignments: [],
      ...options,
    });
    setup.push({ nodeId, kind: node.kind, revision: state.revision });
    expect(state.exploration!.run!.status, `Technical safe path ended at ${nodeId}`).not.toBe(
      'lost',
    );
  }
  expect(state.exploration!.run!.status).toBe('won');
  if (
    !state.inventory.products.some((p) => p.kind === 'random-beans' && p.status === 'available')
  ) {
    const { shop } = await (await page.request.get('/api/content')).json();
    state = await command(page, 'purchases', state, {
      product: 'random-beans',
      quantity: 1,
      priceVersion: shop.version,
    });
  }
  await page.reload();
  await expect(page.locator('[data-expedition-closure="won"]')).toBeVisible();
  return { state, setup };
}
for (const language of ['es', 'en'] as const)
  for (const pack of ['diagon-alley', 'arcana'] as const) {
    test(`A65 intention selection preparation activation recovery ${language} ${pack}`, async ({
      page,
    }, info) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.addInitScript(
        (pack) => localStorage.setItem('arcana.presentation.content-pack.v1', pack),
        pack,
      );
      if (pack === 'arcana') await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      if (language === 'en') await changeLanguage(page, language);
      await page.locator('.portal-enter').click();
      await startExpedition(page, language);
      const { state: before, setup } = await technicalClosure(page);
      const choose = page.locator('[data-intention-choice="bean"] > button');
      await expect(choose).toBeVisible();
      await choose.focus();
      await choose.press('Enter');
      await expect(choose).toHaveAttribute('aria-pressed', 'true');
      await expect(choose).toBeFocused();
      const selected = await readGame(page);
      expect(selected.inventory).toEqual(before.inventory);
      expect(selected.copies).toEqual(before.copies);
      expect(selected.exploration!.run).toEqual(before.exploration!.run);
      expect(selected.exploration!.intention).toMatchObject({
        runId: null,
        choice: { kind: 'bean' },
      });
      await capture(page, `${pack}-${language}-selected`);
      await page.reload();
      await expect(choose).toHaveAttribute('aria-pressed', 'true');
      expect(await readGame(page)).toEqual(selected);
      await page.locator('.intention-release').click();
      await expect(page.locator('.intention-release')).toHaveCount(0);
      await expect(page.locator('#content')).toBeFocused();
      const cancelled = await readGame(page);
      expect(cancelled.exploration!.intention ?? null).toBeNull();
      expect(cancelled.inventory).toEqual(before.inventory);
      await choose.click();
      await expect(choose).toHaveAttribute('aria-pressed', 'true');
      const reselected = await readGame(page);
      await page.locator('[data-closure-action="prepare"]').click();
      await expect(
        page.locator('.preparation-dialog [data-intention-status="selected"]'),
      ).toBeVisible();
      expect(await readGame(page)).toEqual(reselected);
      await page.keyboard.press('Escape');
      expect(await readGame(page)).toEqual(reselected);
      await page.locator('[data-closure-action="prepare"]').click();
      await startExpedition(page, language);
      await expect(page.locator('[data-intention-status="active"]')).toBeVisible();
      const next = await readGame(page);
      expect(next.inventory).toEqual(before.inventory);
      expect(next.exploration!.run!.id).not.toBe(before.exploration!.run!.id);
      expect(next.exploration!.intention!.runId).toBe(next.exploration!.run!.id);
      await capture(page, `${pack}-${language}-active`);
      const duel = await reachNode(page, 'duel', language);
      await page.locator(`[data-node="${duel}"]`).click();
      await page.locator('.node-bean-preparation > summary').click();
      const beforeCombat = await readGame(page);
      const jar = beforeCombat.inventory.products.find(
        (p) => p.kind === 'random-beans' && p.status === 'available',
      )!;
      const unit = beforeCombat.exploration!.run!.members.find((m) => m.unit.hp > 0)!.unit.id;
      await page.locator(`[data-bean-id="${jar.id}"]`).click();
      await page.locator(`[data-bean-unit="${unit}"]`).click();
      expect(await readGame(page)).toEqual(beforeCombat);
      await confirmEvent(page, language);
      const afterCombat = await readGame(page);
      const receipt = afterCombat.receipts.at(-1)!;
      expect(receipt.kind).toBe('advance-node');
      if (receipt.kind !== 'advance-node' || !receipt.battle)
        throw Error('Missing committed battle');
      expect(
        receipt.battle.events.some(
          (event) => event.kind === 'bean-activated' && event.unitId === jar.id,
        ),
      ).toBe(true);
      expect(afterCombat.inventory.products.find((p) => p.id === jar.id)!.status).toBe('consumed');
      expect(afterCombat.exploration!.intention).toEqual(next.exploration!.intention);
      await leaveBattle(page);
      await expect(page.locator('[data-intention-status="completed"]')).toBeVisible();
      await capture(page, `${pack}-${language}-completed`);
      await page.reload();
      await expect(page.locator('[data-intention-status="completed"]')).toBeVisible();
      expect(await readGame(page)).toEqual(afterCombat);
      const history = page.locator('.closure-history > summary');
      if (await history.count()) await history.click();
      await page.locator('.receipt-disclosure > summary').click();
      const replay = page.getByRole('button', {
        name: language === 'es' ? 'Ver combate guardado' : 'View saved battle',
        exact: true,
      });
      await expect(replay).toBeVisible();
      await replay.click();
      await expect(page.locator('.battle-panel')).toBeVisible();
      expect(await readGame(page)).toEqual(afterCombat);
      await leaveBattle(page);
      expect(await readGame(page)).toEqual(afterCombat);
      expect(errors).toEqual([]);
      await mkdir(evidence, { recursive: true });
      await writeFile(
        resolve(evidence, `${info.project.name}-${pack}-${language}-authority.json`),
        JSON.stringify(
          {
            language,
            pack,
            technicalSetup: setup,
            playerId: before.playerId,
            selectionRevision: selected.revision,
            cancelledRevision: cancelled.revision,
            nextRunId: next.exploration!.run!.id,
            activationReceiptId: receipt.id,
            flavour: receipt.battle.events.find((e) => e.kind === 'bean-activated'),
            inventoryBeforeSelection: before.inventory,
            inventoryAfterCombat: afterCombat.inventory,
            reloadExact: true,
            pageErrors: errors,
          },
          null,
          2,
        ),
      );
    });
  }
