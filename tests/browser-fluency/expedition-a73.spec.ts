import { expect, test, type Locator, type Page } from '@playwright/test';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { changeLanguage } from '../browser-trial/game-fixture';
import { expectMapFits, readGame, reachNode } from '../browser-trial/route-helpers';
import { Pool } from 'pg';
import { runSnapshot, type Run } from '../../src/arcana/domain/exploration/run';

// Reuse the guarded A70 Linux process, not another browser/server battery. Four
// desktop Chromium accounts leave A71's 24-account namespace below its real quota.
test.use({ baseURL: 'http://127.0.0.1:5472' });
const evidence = resolve('docs/arcana/boss-increment-2026-10-16/evidence/linux/a73');
type Language = 'es' | 'en';
type Step = {
  name: string;
  clickAt: number;
  usableAt: number;
  actionToUsableUpperBoundMs: number;
  responseObservedAt?: number;
  actionToResponseObservedUpperBoundMs?: number;
  resourceResponseEnd?: number;
  actionToResponseEndMs?: number;
  figuresAt?: number;
  actionToFiguresUpperBoundMs?: number;
  choreographyAt?: number;
  actionToChoreographyUpperBoundMs?: number;
};
declare global {
  interface Window {
    __a73Action: { clickAt: number; dispose: () => void };
  }
}
const word = (language: Language, es: string, en: string) => (language === 'es' ? es : en);
const now = (page: Page) => page.evaluate(() => performance.now());

/** Declared isolated server-state fixture, not a promise every random first route wins.
 * Fix only the unvisited layout to seed0. Stats, inventory, opponents and all subsequent
 * commands remain the existing rules/authority. Never rewrite historical receipts. */
async function fixedRouteFixture(page: Page, owner: string) {
  if (process.platform !== 'linux') throw Error('A73 graph fixture is CI Linux only');
  const state = await readGame(page),
    run = state.exploration!.run!;
  expect(state.playerId).toBe(owner);
  expect(run.visited).toEqual([]);
  expect(run.status).toBe('active');
  // Plain JSON read avoids importing Vite's JSON modules through Node's browser-test loader.
  // A domain test compares every graph/node plan with the current campaign configuration.
  const fixture = JSON.parse(
    await readFile(new URL('../support/fixtures/a85-route-seed0.json', import.meta.url), 'utf8'),
  ) as {
    version: number;
    campaignVersion: number;
    graph: Run['graph'];
    nodes: NonNullable<Run['campaignSnapshot']>['nodes'];
  };
  expect(fixture.version).toBe(1);
  expect(run.campaignVersion).toBe(fixture.campaignVersion);
  expect(run.challenge ?? 'discovery').toBe('discovery');
  const graph = fixture.graph;
  const fixed = runSnapshot({
    ...run,
    graph,
    graphVersion: graph.version,
    routeGeneration: { version: 1, seed: 0 },
    campaignSnapshot: {
      ...run.campaignSnapshot!,
      graph,
      nodes: fixture.nodes,
    },
  });
  const pool = new Pool({
    host: '127.0.0.1',
    port: 55432,
    user: 'arcana_dev',
    password: 'arcana-local-development',
    database: 'arcana_dev',
    max: 1,
  });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const locked = await client.query(
      'SELECT revision FROM arcana_accounts WHERE player_id=$1 FOR UPDATE',
      [owner],
    );
    expect(Number(locked.rows[0].revision)).toBe(state.revision);
    const changed = await client.query(
      'UPDATE arcana_exploration SET run_state=$1::jsonb WHERE player_id=$2 AND run_id=$3',
      [JSON.stringify(fixed), owner, run.id],
    );
    expect(changed.rowCount).toBe(1);
    await client.query('UPDATE arcana_accounts SET revision=revision+1 WHERE player_id=$1', [
      owner,
    ]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
  // Refresh through the real controller without resetting performance.timeOrigin.
  const response = page.waitForResponse(
    (reply) => new URL(reply.url()).pathname === '/api/state' && reply.request().method() === 'GET',
  );
  const refresh = page.getByRole('button', {
    name: /^(Actualizar (Energía|Esencia)|Refresh (Energy|Essence))$/,
    exact: true,
  });
  await refresh.click();
  await response;
  await expect(refresh).toBeEnabled();
  await expect(page.locator('.branch-map')).toBeVisible();
}

/** The capture listener stamps the dispatched user click, after actionability.
 * Polling/automation completion is explicitly an upper bound, not renderer CPU. */
async function action(
  page: Page,
  name: string,
  trigger: Locator,
  usable: Locator,
  postPath?: string,
): Promise<Step> {
  await expect(trigger).toBeEnabled();
  await page.evaluate(() => {
    const stamp = () => {
      window.__a73Action.clickAt = performance.now();
    };
    window.__a73Action = {
      clickAt: 0,
      dispose: () => document.removeEventListener('click', stamp, true),
    };
    document.addEventListener('click', stamp, { once: true, capture: true });
  });
  const response = postPath
    ? page.waitForResponse(
        (reply) =>
          new URL(reply.url()).pathname === postPath && reply.request().method() === 'POST',
      )
    : undefined;
  let responseObservedAt: number | undefined;
  try {
    await trigger.click();
    if (response) {
      const reply = await response;
      expect(reply.ok(), `${name}: authority operation must succeed`).toBe(true);
      await reply.finished();
      responseObservedAt = await now(page);
    }
    await expect(usable).toBeVisible();
    const usableAt = await now(page);
    const clickAt = await page.evaluate(() => window.__a73Action.clickAt);
    expect(clickAt).toBeGreaterThan(0);
    const resourceResponseEnd = postPath
      ? await page.evaluate(
          ({ path, start }) => {
            const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
            return entries
              .filter((entry) => new URL(entry.name).pathname === path && entry.startTime >= start)
              .at(-1)?.responseEnd;
          },
          { path: postPath, start: clickAt },
        )
      : undefined;
    return {
      name,
      clickAt,
      usableAt,
      actionToUsableUpperBoundMs: usableAt - clickAt,
      ...(responseObservedAt === undefined
        ? {}
        : {
            responseObservedAt,
            actionToResponseObservedUpperBoundMs: responseObservedAt - clickAt,
          }),
      ...(resourceResponseEnd === undefined
        ? {}
        : {
            resourceResponseEnd,
            actionToResponseEndMs: resourceResponseEnd - clickAt,
          }),
    };
  } finally {
    await page.evaluate(() => window.__a73Action.dispose());
  }
}

async function figures(page: Page, step: Step, count: number) {
  await expect(page.locator('.pedestal')).toHaveCount(count);
  await expect(page.locator('.scene-canvas')).toHaveAttribute('data-art-ready', 'true');
  step.figuresAt = await now(page);
  step.actionToFiguresUpperBoundMs = step.figuresAt - step.clickAt;
  // Every unit/name/PV remains usable. Existing A70/A71 cover the full viewport matrix.
  for (const selector of ['.arena-figure-space', '.arena-inspect > strong', '.arena-health']) {
    const items = page.locator(selector);
    await expect(items).toHaveCount(count);
    for (const item of await items.all()) await expect(item).toBeInViewport({ ratio: 1 });
  }
}
async function omit(page: Page, language: Language, steps: Step[]) {
  const skip = page.getByRole('button', {
    name: word(language, 'Omitir reproducción', 'Skip playback'),
    exact: true,
  });
  if (await skip.isEnabled())
    steps.push(
      await action(page, 'omit-confirmed-replay', skip, page.locator('[data-arena-outcome]')),
    );
  else await expect(page.locator('[data-arena-outcome]')).toBeVisible();
}
async function enterMap(page: Page, language: Language, name: string) {
  const preparation = page.locator('[data-expedition-preparation="new"]');
  await expect(preparation).toBeVisible();
  const first = preparation.locator('.preparation-card').first();
  if ((await first.getAttribute('aria-pressed')) !== 'true') await first.click();
  return action(
    page,
    name,
    preparation.getByRole('button', {
      name: word(language, 'Entrar al mapa', 'Enter the map'),
      exact: true,
    }),
    page.locator('.branch-map'),
    '/api/runs',
  );
}

for (const language of ['es', 'en'] as const)
  for (const pack of ['diagon-alley', 'arcana'] as const)
    test(`A73 complete authoritative expedition fluency ${language} ${pack}`, async ({ page }) => {
      test.skip(
        test.info().project.use.browserName !== 'chromium' ||
          test.info().project.use.viewport?.width !== 1280,
        'Bounded full-route measurement: four desktop Chromium accounts; A70/A71 retain other engines/viewports.',
      );
      const steps: Step[] = [];
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.addInitScript((skin) => {
        localStorage.setItem('arcana.presentation.content-pack.v1', skin);
      }, pack);
      await page.goto('/');
      await expect(page.locator('.portal-enter')).toBeEnabled();
      const entryUsableFromNavigationMs = await now(page);
      if (language === 'en') await changeLanguage(page, language);
      steps.push(
        await action(
          page,
          'entry-to-preparation',
          page.locator('.portal-enter'),
          page.locator('[data-expedition-preparation="new"]'),
        ),
      );
      steps.push(await enterMap(page, language, 'first-expedition-to-map'));
      await expectMapFits(page);
      // Same declared route for all four language/pack samples; no account reroll,
      // reward grant, skipped victory assertion or difficulty adjustment.
      await fixedRouteFixture(page, (await readGame(page)).playerId);
      const initial = await readGame(page);
      const firstRun = initial.exploration!.run!;
      const firstDuel = await reachNode(page, 'duel', language);
      const firstBefore = await readGame(page);
      steps.push(
        await action(
          page,
          'first-node-to-preparation',
          page.locator(`[data-node="${firstDuel}"]`),
          page.locator('.node-event-dialog'),
        ),
      );
      expect(await readGame(page)).toEqual(firstBefore);
      const firstCombat = await action(
        page,
        'first-combat-confirm-to-arena',
        page.locator('.node-confirm-action'),
        page.locator('.arena-a63'),
        '/api/nodes/advance',
      );
      steps.push(firstCombat);
      const firstCommitted = await readGame(page);
      const firstReceipt = firstCommitted.receipts.at(-1)!;
      if (firstReceipt.kind !== 'advance-node' || !firstReceipt.battle)
        throw Error('Missing first BattleLog');
      await figures(
        page,
        firstCombat,
        firstReceipt.battle.input.player.length + firstReceipt.battle.input.rival.length,
      );
      await omit(page, language, steps);
      expect(JSON.stringify((await readGame(page)).receipts.at(-1))).toBe(
        JSON.stringify(firstReceipt),
      );
      steps.push(
        await action(
          page,
          'first-arena-return-to-map',
          page.getByRole('button', {
            name: word(language, 'Volver al mapa', 'Back to map'),
            exact: true,
          }),
          page.locator('.branch-map'),
        ),
      );
      await expectMapFits(page);
      const bossId = await reachNode(page, 'boss', language);
      const beforeBoss = await readGame(page);
      steps.push(
        await action(
          page,
          'boss-node-to-preparation',
          page.locator(`[data-node="${bossId}"]`),
          page.locator('[data-boss-prelude]'),
        ),
      );
      expect(await readGame(page)).toEqual(beforeBoss);
      await page.keyboard.press('Escape');
      expect(await readGame(page)).toEqual(beforeBoss);
      await page.locator(`[data-node="${bossId}"]`).click();
      const bossStep = await action(
        page,
        'boss-confirm-to-arena',
        page.locator('.node-confirm-action'),
        page.locator('.arena-a63'),
        '/api/nodes/advance',
      );
      steps.push(bossStep);
      const committed = await readGame(page);
      const bossReceipt = committed.receipts.at(-1)!;
      if (bossReceipt.kind !== 'advance-node' || !bossReceipt.battle)
        throw Error('Missing boss BattleLog');
      await figures(
        page,
        bossStep,
        bossReceipt.battle.input.player.length + bossReceipt.battle.input.rival.length,
      );
      await omit(page, language, steps);
      expect(JSON.stringify((await readGame(page)).receipts.at(-1))).toBe(
        JSON.stringify(bossReceipt),
      );
      const closure = page.locator('[data-expedition-closure="won"]');
      steps.push(
        await action(
          page,
          'boss-return-to-closure',
          page.getByRole('button', {
            name: word(language, 'Volver al mapa', 'Back to map'),
            exact: true,
          }),
          closure,
        ),
      );
      const frog = await action(
        page,
        'owned-loot-open-to-result',
        closure.locator('[data-closure-action="frog"]'),
        page.locator('.reveal'),
        '/api/toads/open',
      );
      steps.push(frog);
      await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result', {
        timeout: 15000,
      });
      frog.choreographyAt = await now(page);
      frog.actionToChoreographyUpperBoundMs = frog.choreographyAt - frog.clickAt;
      const opened = await readGame(page);
      expect(opened.inventory.crowns).toBe(committed.inventory.crowns);
      expect(opened.copies).toHaveLength(committed.copies.length + 1);
      steps.push(
        await action(page, 'loot-return-to-closure', page.locator('.reveal-continue'), closure),
      );
      steps.push(
        await action(
          page,
          'closure-to-deliberate-preparation',
          closure.locator('[data-closure-action="prepare"]'),
          page.locator('.preparation-dialog[open]'),
        ),
      );
      expect(await readGame(page)).toEqual(opened);
      await page.keyboard.press('Escape');
      await expect(closure.locator('[data-closure-action="prepare"]')).toBeFocused();
      expect(await readGame(page)).toEqual(opened);
      await closure.locator('[data-closure-action="prepare"]').click();
      steps.push(await enterMap(page, language, 'explicit-next-expedition-to-map'));
      const next = await readGame(page);
      expect(next.exploration!.run!.id).not.toBe(firstRun.id);
      expect(next.inventory).toEqual(opened.inventory);
      expect(errors).toEqual([]);
      await mkdir(evidence, { recursive: true });
      await writeFile(
        resolve(evidence, `${language}-${pack}-expedition.json`),
        JSON.stringify(
          {
            sha: process.env.GITHUB_SHA ?? null,
            engine: test.info().project.use.browserName,
            viewport: test.info().project.use.viewport,
            physicalDevice: false,
            fixture: true,
            fixtureDefinition:
              'Isolated unvisited route fixed to seed0; statistics/economy unchanged; real subsequent PG/Redis commands. Not comparable to prior random-route samples as a matched A/B.',
            isolatedAuthorityAccount: next.playerId,
            cache:
              'Fresh Playwright context, service workers blocked; origin/process/OS caches not purged. Not a cold-machine claim.',
            entryUsableFromNavigationMs,
            steps,
            routeGeneration: firstRun.routeGeneration ?? null,
            // Canonical authority snapshots make route/combat conditions reproducible
            // without adding client controls for seeds or inventing account progress.
            savedRun: committed.exploration!.run,
            firstBattle: firstReceipt.battle,
            bossBattle: bossReceipt.battle,
            limitations: [
              'Browser timestamps and polling give upper bounds; not GPU/decoder CPU timings.',
              'Repeated sustained generic/boss windows are measured in the separate bounded A73 profile.',
              'Route policy is technical QA using the existing prepared-route helper, not human play.',
              'Whole-frog choreography observed; combat completion here uses explicit omission.',
            ],
            pageErrors: errors,
          },
          null,
          2,
        ),
      );
    });
