import { test, expect, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  pauseBattle,
  skipBattle,
  setDoubleBattleSpeed,
  openBattleOptions,
  closeBattleOptions,
} from '../browser-trial/battle-controls';
import { changeLanguage, startExpedition } from '../browser-trial/game-fixture';
import { leaveBattle } from '../browser-trial/battle-controls';
import type { GameState } from '../../src/arcana/application/game';

const fixture = '/tests/browser-priorities/priorities-a89.html';
const pairs = [
  ['es', 'diagon-alley'],
  ['en', 'diagon-alley'],
  ['es', 'arcana'],
  ['en', 'arcana'],
] as const;
// The unchanged CI workflow already uploads this artifact tree. A89 stays in its own subfolder.
const directory = resolve(
  process.env.ARCANA_CAPTURE_A76 === '1'
    ? 'docs/arcana/accounts-2026-10-17/evidence/linux/a89'
    : 'docs/arcana/priority-increment-2026-10-19/evidence/linux',
);
type MeasuredAction = 'collection-goal' | 'wand-reference' | 'bean-draft' | 'battle-facts-book';
const measuredActions = new Map<MeasuredAction, unknown>();
/** Technical observation only: includes Playwright protocol/auto-wait/assertion overhead. */
async function beginMeasurement(page: Page, action: MeasuredAction, lang: string, pack: string) {
  if (
    process.platform !== 'linux' ||
    test.info().project.name !== 'chromium-390-a89' ||
    lang !== 'es' ||
    pack !== 'diagon-alley'
  )
    return null;
  const started = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return {
      at: performance.now(),
      navigation: navigation
        ? {
            type: navigation.type,
            durationMs: navigation.duration,
            responseStartMs: navigation.responseStart,
            domInteractiveMs: navigation.domInteractive,
            loadEventEndMs: navigation.loadEventEnd,
            transferBytes: navigation.transferSize,
            encodedBytes: navigation.encodedBodySize,
            decodedBytes: navigation.decodedBodySize,
          }
        : null,
      resources: {
        entriesObserved: resources.length,
        transferBytes: resources.reduce((sum, entry) => sum + entry.transferSize, 0),
        encodedBytes: resources.reduce((sum, entry) => sum + entry.encodedBodySize, 0),
        decodedBytes: resources.reduce((sum, entry) => sum + entry.decodedBodySize, 0),
      },
    };
  });
  return { action, ...started };
}
async function finishMeasurement(page: Page, mark: Awaited<ReturnType<typeof beginMeasurement>>) {
  if (!mark) return;
  const endedAt = await page.evaluate(() => performance.now());
  measuredActions.set(mark.action, {
    action: mark.action,
    elapsedMs: endedAt - mark.at,
    startMonotonicMs: mark.at,
    endMonotonicMs: endedAt,
    navigationAtStart: mark.navigation,
    resourcesAtStart: mark.resources,
  });
  await mkdir(directory, { recursive: true });
  await writeFile(
    resolve(directory, 'action-usable-a89.json'),
    JSON.stringify(
      {
        schemaVersion: 1,
        sha: process.env.GITHUB_SHA ?? null,
        origin: 'technical-automation',
        fixture: true,
        project: test.info().project.name,
        viewport: page.viewportSize(),
        language: 'es',
        pack: 'diagon-alley',
        clock: 'performance.now in the same document',
        measurement:
          'Before activation until the usable-state assertions complete; includes automation protocol, auto-wait and assertion overhead. No economic server operation in these four fixtures.',
        cache:
          'Uncontrolled browser defaults and preceding fixture visits; not a cold-start comparison.',
        resourceCaveat:
          'Navigation/resource transfer and encoded/decoded byte fields are browser entries at the observation point, not CPU decode time, GPU time or resident memory; zero transfer is not proof of a specific cache.',
        expectedActions: 4,
        complete: measuredActions.size === 4,
        observations: [...measuredActions.values()],
      },
      null,
      2,
    ),
  );
}
async function read(page: Page) {
  return page.evaluate(() => JSON.parse(window.__a89.read()));
}
function economic(value: Awaited<ReturnType<typeof read>>) {
  return JSON.stringify({
    inventory: value.game.inventory,
    copies: value.game.copies,
    team: value.game.team,
  });
}
async function load(page: Page, view: string, lang: string, pack: string, extra = '') {
  await page.goto(`${fixture}?view=${view}&lang=${lang}&pack=${pack}${extra}`);
  await expect.poll(() => page.evaluate(() => !!window.__a89)).toBe(true);
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
}
async function freshPreferences(page: Page) {
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch {
      /* New origin. */
    }
  });
}
async function widthFits(page: Page) {
  const geometry = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    outside: [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1);
      })
      .slice(0, 20)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          className: element.className,
          width: rect.width,
          left: rect.left,
          right: rect.right,
        };
      }),
  }));
  expect(geometry.document, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.viewport + 1);
}
/** Eight selected screenshots: five A89 + guide, reading and one desktop help view. Linux opt-in only. */
async function selected(
  page: Page,
  name:
    | 'company'
    | 'company-help'
    | 'collection'
    | 'forge'
    | 'beans'
    | 'battle'
    | 'guide'
    | 'reading',
  lang: string,
  pack: string,
) {
  if (
    process.platform !== 'linux' ||
    (process.env.ARCANA_CAPTURE_A89 !== '1' && process.env.ARCANA_CAPTURE_A76 !== '1') ||
    !(name === 'company-help'
      ? test.info().project.name === 'chromium-1280-a89' && lang === 'en' && pack === 'arcana'
      : test.info().project.name === 'chromium-390-a89' && lang === 'es' && pack === 'diagon-alley')
  )
    return;
  await mkdir(directory, { recursive: true });
  await page.screenshot({
    path: resolve(directory, `selected-${name}-${page.viewportSize()!.width}.png`),
    fullPage: false,
  });
}

test('A89 declared guide and company choices preserve resources, ownership and explicit confirmation', async ({
  page,
}) => {
  for (const [lang, pack] of pairs) {
    await freshPreferences(page);
    await load(page, 'guide', lang, pack, '&single=1');
    const before = economic(await read(page));
    const help = page.locator('.priority-guide-help');
    await expect(help.locator('summary')).toHaveAccessibleName(
      lang === 'es' ? 'Recluta aliados' : 'Recruit companions',
    );
    await help.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(help.locator('.priority-guide-body')).toBeVisible();
    expect(economic(await read(page))).toBe(before);
    await help.locator('.priority-guide-dismiss').click();
    expect(economic(await read(page))).toBe(before);
    await page.reload();
    await expect(page.locator('.priority-guide-trigger > span')).toHaveCount(0);
    await page.locator('.priority-guide-trigger').tap();
    await page
      .getByRole('button', {
        name: lang === 'es' ? 'Consultar orientación' : 'Show guidance',
        exact: true,
      })
      .click();
    await expect(page.locator('.priority-guide-trigger > span')).toBeVisible();
    await load(page, 'company', lang, pack, '&legacy=1');
    await expect(page.locator('[data-intention-choice=bean] .intention-object')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect((await read(page)).game.exploration.intention.version).toBe(1);
    const companyBefore = economic(await read(page));
    const intentionBefore = (await read(page)).game.exploration.intention;
    const planHelp = page.locator('.intention-purpose');
    await expect(planHelp.locator('summary')).toHaveCount(1);
    await planHelp.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(planHelp).toContainText(
      lang === 'es' ? 'identidades propias disponibles' : 'owned identities available',
    );
    await expect(planHelp.locator('section')).toHaveCount(
      await page.locator('[data-intention-choice]').count(),
    );
    expect((await read(page)).game.exploration.intention).toEqual(intentionBefore);
    expect(economic(await read(page))).toBe(companyBefore);
    await selected(page, 'company-help', lang, pack);
    await planHelp.locator('summary').click();
    const choose = page.locator('[data-intention-choice=company] .intention-object');
    await expect(choose).toBeVisible();
    await choose.focus();
    await page.keyboard.press('Enter');
    await expect(choose).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(async () => (await read(page)).game.exploration.intention.version).toBe(2);
    const intent = (await read(page)).game.exploration.intention;
    expect(intent.choice).toEqual({ kind: 'company', focus: 'house', house: 'gryffindor' });
    expect(intent.runId).toBeNull();
    await expect(page.locator('.intention-reminder [data-house=gryffindor]')).toBeVisible();
    expect(economic(await read(page))).toBe(companyBefore);
    await selected(page, 'company', lang, pack);
    await page.locator('.intention-release').click();
    await expect.poll(async () => (await read(page)).game.exploration.intention ?? null).toBeNull();
    expect(economic(await read(page))).toBe(companyBefore);
    await widthFits(page);
  }
});

test('A89 Cromodex goal persists per owner, keeps silhouettes and requires an owned acquisition', async ({
  page,
}) => {
  for (const [lang, pack] of pairs) {
    await freshPreferences(page);
    await load(page, 'collection', lang, pack);
    const initial = await read(page);
    const pending = page
      .getByRole('button', {
        name: lang === 'es' ? /^Consultar cromo pendiente / : /^Inspect undiscovered card /,
      })
      .first();
    await expect(pending).toBeVisible();
    await pending.focus();
    await page.keyboard.press('Enter');
    const folio = page.locator('.album-card-folio[open]');
    await expect(folio).toBeVisible();
    const goalMark = await beginMeasurement(page, 'collection-goal', lang, pack);
    await folio
      .getByRole('button', {
        name: lang === 'es' ? 'Seguir este cromo' : 'Track this card',
        exact: true,
      })
      .click();
    await expect(page.locator('[data-goal-state=searching]')).toBeVisible();
    await finishMeasurement(page, goalMark);
    const goal = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('arcana.collection-goal.v1.a89-fixture-owner-a')!),
    );
    expect(goal).toMatchObject({ version: 1, owner: 'a89-fixture-owner-a' });
    expect(economic(await read(page))).toBe(economic(initial));
    await page.keyboard.press('Escape');
    await expect(pending).toBeFocused();
    await page.reload();
    await expect(page.locator('[data-goal-state=searching]')).toBeVisible();
    await page.evaluate(() => window.__a89.switchOwner());
    await expect(page.locator('[data-goal-state]')).toHaveCount(0);
    await page.evaluate(() => window.__a89.switchOwner());
    await expect(page.locator('[data-goal-state=searching]')).toBeVisible();
    await page.evaluate((id) => window.__a89.acquireTarget(id, true), goal.wizardId);
    await expect(page.locator('[data-goal-state=searching]')).toBeVisible();
    expect((await read(page)).game.copies).toEqual(initial.game.copies);
    await page.evaluate((id) => window.__a89.acquireTarget(id), goal.wizardId);
    await expect(page.locator('[data-goal-state=acquired]')).toBeVisible();
    const acquired = (await read(page)).game;
    expect(acquired.inventory.crowns).toEqual(initial.game.inventory.crowns);
    expect(acquired.inventory.essence).toEqual(initial.game.inventory.essence);
    expect(acquired.inventory.equipment).toEqual(initial.game.inventory.equipment);
    const originalProductIds = new Set(
      initial.game.inventory.products.map((product: { id: string }) => product.id),
    );
    expect(
      acquired.inventory.products.filter((product: { id: string }) =>
        originalProductIds.has(product.id),
      ),
    ).toEqual(initial.game.inventory.products);
    expect(
      acquired.inventory.products.filter(
        (product: { id: string }) => !originalProductIds.has(product.id),
      ),
    ).toEqual([
      {
        id: 'a89-acquired-target-opening:unit',
        kind: 'cacao-toad',
        status: 'consumed',
        operationId: 'a89-acquired-target-opening',
      },
    ]);
    await expect(page.locator('.collection-progress progress')).toHaveAttribute('max', '34');
    await expect(page.locator('.collection-progress progress')).toHaveAttribute('value', '4');
    await widthFits(page);
  }
});

test('A89 wand fitting chooses exact copies, exposes trade-offs and cancels without forging', async ({
  page,
}) => {
  for (const [lang, pack] of pairs) {
    await freshPreferences(page);
    await load(page, 'forge', lang, pack);
    const before = economic(await read(page));
    const references = page.locator('[data-forge-reference]');
    await expect(references).toHaveCount(4);
    expect(
      await references
        .first()
        .locator('img')
        .first()
        .evaluate((image) => image.getBoundingClientRect().width),
    ).toBeGreaterThanOrEqual(40);
    await references.last().focus();
    const referenceMark = await beginMeasurement(page, 'wand-reference', lang, pack);
    await page.keyboard.press('Enter');
    await expect(references.last()).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.forge-reference-name')).toContainText(
      lang === 'es' ? 'copia 4' : 'copy 4',
    );
    await finishMeasurement(page, referenceMark);
    await page.locator('.forge-fitting-help > summary').click();
    await expect(page.locator('.forge-fitting-help')).toContainText(
      lang === 'es' ? 'no predice' : 'does not predict',
    );
    await expect(page.locator('[data-forge-value]')).toHaveCount(3);
    await page.locator('.forge-action').click();
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('.forge-action')).toBeFocused();
    expect((await read(page)).forgeRequests).toBe(0);
    expect(economic(await read(page))).toBe(before);
    await widthFits(page);
  }
});

test('A89 bean risk stays unknown, precise carriers and draft changes never consume or discover', async ({
  page,
}) => {
  for (const [lang, pack] of pairs) {
    await freshPreferences(page);
    await load(page, 'beans', lang, pack, '&temporary=1');
    const before = economic(await read(page));
    await expect(page.locator('.bean-stock-label')).toContainText('3');
    await expect(page.locator('.bean-carrier')).toHaveCount(3);
    await expect(page.locator('.bean-carrier').nth(1)).toBeDisabled();
    await page.locator('.bean-carrier').first().focus();
    const beanMark = await beginMeasurement(page, 'bean-draft', lang, pack);
    await page.keyboard.press('Enter');
    await expect(page.locator('.bean-carrier').first()).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.bean-draft-count')).toContainText(
      lang === 'es' ? 'borrador' : 'draft',
    );
    await finishMeasurement(page, beanMark);
    await page.locator('.bean-context-help > summary').click();
    await expect(page.locator('.bean-risk-note')).toContainText('50');
    await expect(page.locator('.bean-context-help')).toContainText(
      lang === 'es' ? 'no permite elegirlo' : 'does not let you choose',
    );
    await expect(page.locator('[data-bean-mint-preview]')).toBeVisible();
    expect(economic(await read(page))).toBe(before);
    await page.locator('.bean-carrier').last().tap();
    await expect
      .poll(async () => (await read(page)).assignments)
      .toEqual([{ unitId: 'a89-copy-2', beanId: 'a89-jar-0' }]);
    await page.locator('.bean-carrier').last().click();
    await expect.poll(async () => (await read(page)).assignments).toEqual([]);
    await page.locator('.bean-carrier').first().click();
    await page.locator('[data-qa-cancel-draft]').click();
    await expect.poll(async () => (await read(page)).assignments).toEqual([]);
    expect(economic(await read(page))).toBe(before);
    await page.locator('.bean-context-help > summary').click();
    await page.locator('.bean-risk-summary').scrollIntoViewIfNeeded();
    await selected(page, 'beans', lang, pack);
    await widthFits(page);
    await load(page, 'beans', lang, pack, '&empty=1');
    await expect(page.locator('.bean-stock-label')).toContainText('0');
    await expect(page.locator('.bean-jar-choice')).toHaveCount(0);
    await expect(page.locator('.bean-carrier')).toHaveCount(0);
  }
});

test('A89 reading is semantic, remembers the owner and does not override forced motion preferences', async ({
  page,
}) => {
  for (const [lang, pack] of pairs) {
    await freshPreferences(page);
    await page.emulateMedia({
      reducedMotion: 'reduce',
      contrast: 'no-preference',
      forcedColors: 'none',
    });
    await load(page, 'guide', lang, pack);
    const before = economic(await read(page));
    await page.locator('.game-header .settings-trigger').click();
    const settings = page.locator('.game-settings[open]');
    await expect(settings).toBeVisible();
    const sizeOptions = settings.getByRole('group', {
      name: lang === 'es' ? 'Tamaño del texto' : 'Text size',
      exact: true,
    });
    await expect(sizeOptions.getByRole('button')).toHaveCount(2);
    const sizeGeometry = await sizeOptions.getByRole('button').evaluateAll((buttons) =>
      buttons.map((button) => {
        const r = button.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, height: r.height };
      }),
    );
    // Alternative text sizes form one row; contrast is an independent option beneath them.
    expect(Math.abs(sizeGeometry[0].top - sizeGeometry[1].top)).toBeLessThanOrEqual(1);
    expect(sizeGeometry[1].left).toBeGreaterThanOrEqual(sizeGeometry[0].right);
    expect(sizeGeometry.every((box) => box.height >= 44)).toBe(true);
    await settings
      .getByRole('button', { name: lang === 'es' ? 'Texto ampliado' : 'Larger text', exact: true })
      .click();
    await settings
      .getByRole('button', {
        name: lang === 'es' ? 'Más contraste en la interfaz' : 'Higher interface contrast',
        exact: true,
      })
      .click();
    await expect(page.locator('html')).toHaveAttribute('data-reading-size', 'large');
    await expect(page.locator('html')).toHaveAttribute('data-reading-contrast', 'true');
    await expect(
      sizeOptions.locator('button[aria-pressed=true] [data-art="ui.seal"]'),
    ).toBeVisible();
    await expect(
      settings.locator('.reading-preferences > button [data-art="ui.seal"]'),
    ).toBeVisible();
    const contrastGeometry = await settings.locator('.reading-preferences > button').boundingBox();
    const refreshedSizes = await sizeOptions.boundingBox();
    expect(contrastGeometry!.y).toBeGreaterThanOrEqual(refreshedSizes!.y + refreshedSizes!.height);
    const ownMotion = settings.locator('.settings-motion');
    await expect(ownMotion).toHaveAttribute('aria-pressed', 'false');
    await ownMotion.click();
    await ownMotion.click();
    await expect(ownMotion).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('.arcana-shell')).toHaveAttribute('data-reduced', 'true');
    await page.keyboard.press('Escape');
    await expect(page.locator('.game-header .settings-trigger')).toBeFocused();
    await page.evaluate(() => window.__a89.switchOwner());
    await expect(page.locator('html')).toHaveAttribute('data-reading-size', 'normal');
    await expect(page.locator('html')).toHaveAttribute('data-reading-contrast', 'false');
    const normalSurface = await page
      .locator('.arcana-shell')
      .evaluate((element) =>
        getComputedStyle(element).getPropertyValue('--pack-surface').trim().toLowerCase(),
      );
    await page.locator('.game-header .settings-trigger').click();
    const contrastControl = settings.getByRole('button', {
      name: lang === 'es' ? 'Más contraste en la interfaz' : 'Higher interface contrast',
      exact: true,
    });
    await expect(contrastControl).toHaveAttribute('aria-pressed', 'false');
    await page.emulateMedia({ reducedMotion: 'reduce', contrast: 'more', forcedColors: 'none' });
    await expect(settings.locator('.reading-preferences p')).toHaveText(
      lang === 'es'
        ? 'El sistema mantiene el contraste reforzado.'
        : 'Your system keeps higher contrast enabled.',
    );
    await expect(contrastControl).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('html')).toHaveAttribute('data-reading-contrast', 'false');
    await expect
      .poll(() =>
        page
          .locator('.arcana-shell')
          .evaluate((element) =>
            getComputedStyle(element).getPropertyValue('--pack-surface').trim().toLowerCase(),
          ),
      )
      .toBe('#09111d');
    expect(normalSurface).not.toBe('#09111d');
    await page.emulateMedia({
      reducedMotion: 'reduce',
      contrast: 'no-preference',
      forcedColors: 'none',
    });
    await expect
      .poll(() =>
        page
          .locator('.arcana-shell')
          .evaluate((element) =>
            getComputedStyle(element).getPropertyValue('--pack-surface').trim().toLowerCase(),
          ),
      )
      .toBe(normalSurface);
    await page.keyboard.press('Escape');
    await page.evaluate(() => window.__a89.switchOwner());
    await expect(page.locator('html')).toHaveAttribute('data-reading-size', 'large');
    await expect(page.locator('html')).toHaveAttribute('data-reading-contrast', 'true');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-reading-size', 'large');
    expect(economic(await read(page))).toBe(before);
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
      true,
    );
    await widthFits(page);
  }
});

test('A89 battle book appears only after a usable outcome and keeps at most two confirmed facts', async ({
  page,
}) => {
  for (const [lang, pack] of pairs) {
    await freshPreferences(page);
    await load(page, 'battle', lang, pack, '&dense=1');
    const before = economic(await read(page)),
      savedBattle = (await read(page)).battle;
    await expect(page.locator('.arena-pause')).toBeVisible();
    await pauseBattle(page);
    const pausedCursor = await page.locator('.arena-a63').getAttribute('data-replay-cursor');
    expect(
      await page.locator('.pedestal').evaluateAll((nodes) =>
        nodes.every((node) => {
          const rect = node.getBoundingClientRect();
          return (
            rect.left >= -1 &&
            rect.top >= -1 &&
            rect.right <= innerWidth + 1 &&
            rect.bottom <= innerHeight + 1
          );
        }),
      ),
    ).toBe(true);
    await expect(page.locator('[data-arena-facts-trigger]')).toHaveCount(0);
    await expect(page.locator('[data-battle-facts]')).toHaveCount(0);
    await openBattleOptions(page);
    await page.locator('#arena-options .settings-trigger').click();
    await page
      .locator('.game-settings[open]')
      .getByRole('button', { name: lang === 'es' ? 'Texto ampliado' : 'Larger text', exact: true })
      .click();
    await selected(page, 'reading', lang, pack);
    await page.keyboard.press('Escape');
    await closeBattleOptions(page);
    await expect(page.locator('.arena-a63')).toHaveAttribute('data-replay-cursor', pausedCursor!);
    await expect(page.locator('.arena-a63')).toHaveAttribute('data-replay-playing', 'false');
    await setDoubleBattleSpeed(page);
    await skipBattle(page);
    const book = page.locator('[data-arena-facts-trigger]');
    await expect(book).toBeVisible();
    await book.focus();
    const factsMark = await beginMeasurement(page, 'battle-facts-book', lang, pack);
    await page.keyboard.press('Enter');
    const facts = page.locator('[data-battle-facts] [data-battle-fact]');
    await expect(facts.first()).toBeVisible();
    await expect(facts.first()).toHaveAttribute('data-battle-fact', 'house');
    expect(await facts.count()).toBeLessThanOrEqual(2);
    await finishMeasurement(page, factsMark);
    await expect(page.locator('[data-battle-facts]')).not.toContainText(
      /ganaste gracias|won because|decisiv/i,
    );
    await selected(page, 'battle', lang, pack);
    await page.keyboard.press('Escape');
    await expect(book).toBeFocused();
    expect(economic(await read(page))).toBe(before);
    expect((await read(page)).battle).toEqual(savedBattle);
    await expect(page.locator('.pedestal')).toHaveCount(10);
    await expect(page.locator('.arena-health meter')).toHaveCount(10);
    await widthFits(page);
  }
});

test('A89 narrow text reflow and missing renderer keep readable actions and facts', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'chromium-390-a89',
    'One declared narrow/failure cohort; regular matrix covers both engines and three sizes.',
  );
  await page.setViewportSize({ width: 320, height: 844 });
  for (const [lang, pack] of pairs) {
    await freshPreferences(page);
    await load(page, 'forge', lang, pack, '&reduced=1');
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
    await page.locator('.forge-fitting-help > summary').click();
    await widthFits(page);
    await expect(page.locator('.forge-action')).toBeVisible();
    await page.locator('.game-header .settings-trigger').click();
    const reading = page.locator('.game-settings[open] .reading-preferences');
    await reading.scrollIntoViewIfNeeded();
    await expect(
      reading.getByRole('group', {
        name: lang === 'es' ? 'Tamaño del texto' : 'Text size',
        exact: true,
      }),
    ).toBeVisible();
    await widthFits(page);
    await expect(reading.getByRole('button')).toHaveCount(3);
    await page.keyboard.press('Escape');
  }
  let importsFailed = 0;
  await page.route(/\/assets\/pixi-scenes-[^/]+\.js/, async (route) => {
    importsFailed++;
    await route.abort();
  });
  // A readable result action survives absent art as well as the failed renderer import.
  await page.route(/\/assets\/.*\.(?:webp|png|svg)$/, (route) => route.abort());
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [lang, pack] of pairs) {
    await freshPreferences(page);
    await load(page, 'guide', lang, pack, '&single=1');
    const guide = page.locator('.priority-guide-help');
    const unchanged = economic(await read(page));
    await guide.locator('summary').tap();
    await guide.locator('.priority-guide-dismiss').click();
    await page.reload();
    const trigger = guide.locator('summary');
    // Inline SVG URLs cannot be aborted by a network route. Explicitly inject their image-error event.
    if (await trigger.locator('img').count()) await trigger.locator('img').dispatchEvent('error');
    await expect(trigger).toHaveAccessibleName(
      lang === 'es' ? 'Consultar orientación' : 'Show guidance',
    );
    await expect(trigger.locator('img')).toHaveCount(0);
    await expect(trigger.locator('small')).toBeVisible();
    await trigger.focus();
    await page.keyboard.press('Enter');
    await guide
      .getByRole('button', {
        name: lang === 'es' ? 'Consultar orientación' : 'Show guidance',
        exact: true,
      })
      .click();
    await expect(trigger).toHaveAccessibleName(
      lang === 'es' ? 'Recluta aliados' : 'Recruit companions',
    );
    expect(economic(await read(page))).toBe(unchanged);
    await widthFits(page);
  }
  await page.setViewportSize({ width: 320, height: 844 });
  await load(page, 'battle', 'en', 'arcana', '&reduced=1');
  const before = economic(await read(page));
  await expect.poll(() => importsFailed).toBeGreaterThan(0);
  await expect(page.locator('.scene-fallback')).toBeVisible();
  await skipBattle(page);
  await expect(page.locator('[data-arena-facts-trigger] > span')).toBeVisible();
  await page.locator('[data-arena-facts-trigger]').click();
  await expect(page.locator('[data-battle-fact]').first()).toBeVisible();
  expect(economic(await read(page))).toBe(before);
  await mkdir(directory, { recursive: true });
  await writeFile(
    resolve(directory, 'renderer-fallback.json'),
    JSON.stringify(
      {
        sha: process.env.GITHUB_SHA,
        fixture: true,
        importsFailed,
        owner: 'fictitious',
        economicStateUnchanged: true,
      },
      null,
      2,
    ),
  );
});

test('A89 real compiled welcome, starter, guide and Pact consultation cancel without advancement', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'chromium-390-a89',
    'Live gateway contract runs once; component matrix covers the remaining presentations.',
  );
  await page.addInitScript(() => {
    const requested = new URLSearchParams(location.search).get('fixture_pack');
    if (requested === 'arcana' || requested === 'diagon-alley')
      localStorage.setItem('arcana.presentation.content-pack.v1', requested);
  });
  for (const [lang, pack] of pairs) {
    await freshPreferences(page);
    await page.goto(`http://127.0.0.1:5610/?fixture_pack=${pack}`);
    if (lang === 'en') await changeLanguage(page, 'en');
    await page.locator('.portal-enter').click();
    await startExpedition(page, lang);
    const before = (await (await page.request.get('http://127.0.0.1:5610/api/state')).json()).state;
    const guide = page.locator('.priority-guide');
    for (const viewport of [
      { width: 1280, height: 900 },
      { width: 865, height: 1079 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await expect
        .poll(() =>
          page.locator('.map-node').evaluateAll((nodes) => {
            const help = document.querySelector('.priority-guide-trigger')!.getBoundingClientRect();
            const map = document.querySelector('.branch-map')!.getBoundingClientRect();
            return (
              nodes.length > 0 &&
              nodes.every((node) => {
                const r = node.getBoundingClientRect();
                const clear =
                  r.right <= help.left ||
                  r.left >= help.right ||
                  r.bottom <= help.top ||
                  r.top >= help.bottom;
                return (
                  clear &&
                  r.top >= map.top &&
                  r.bottom <= map.bottom &&
                  r.left >= map.left &&
                  r.right <= map.right
                );
              })
            );
          }),
        )
        .toBe(true);
    }
    await selected(page, 'guide', lang, pack);
    await guide.locator('summary').tap();
    const consult = guide.getByRole('button', {
      name: lang === 'es' ? 'Consultar Pacto' : 'Inspect Pact',
      exact: true,
    });
    await expect(consult).toBeVisible();
    await consult.click();
    await expect(page.locator('.node-preparation[data-preparation=pact]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.node-preparation[data-preparation=pact]')).toHaveCount(0);
    expect(
      (await (await page.request.get('http://127.0.0.1:5610/api/state')).json()).state,
    ).toEqual(before);
    // Each next iteration is a separate guest context, never the regular player or a shared account.
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  }
});

test('A89 one connected expedition joins confirmed facts, collection source, wand fitting and preparation', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'chromium-390-a89',
    'One Spanish/Diagon connected cohort closes new App links; no additional rendering matrix.',
  );
  const origin = 'http://127.0.0.1:5610';
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const authoritative = async (): Promise<GameState> => {
    const response = await page.request.get(`${origin}/api/state`);
    expect(response.ok()).toBe(true);
    return (await response.json()).state;
  };
  await page.addInitScript(() => {
    localStorage.setItem('arcana.presentation.content-pack.v1', 'diagon-alley');
  });
  await page.goto(origin);
  if ((await page.locator('html').getAttribute('lang')) !== 'es') await changeLanguage(page, 'es');
  await page.locator('.portal-enter').click();
  await startExpedition(page, 'es');
  const started = await authoritative();
  expect(started.copies).toHaveLength(1);
  const run = started.exploration!.run!;
  // Public edges and node kinds only: no seeds, predicted outcomes, DB edits or forced rewards.
  const candidates: string[][] = [];
  const visit = (id: string, prefix: string[], size: number) => {
    const node = run.graph.nodes.find((entry) => entry.id === id)!;
    if (node.kind === 'duel' || node.kind === 'boss') {
      if (size >= 3) candidates.push([...prefix, id]);
      return;
    }
    const nextSize = node.kind === 'pact' ? Math.min(5, size + 1) : size;
    for (const next of node.next) visit(next, [...prefix, id], nextSize);
  };
  for (const first of run.graph.nodes.filter((entry) => entry.row === 0))
    visit(first.id, [], run.members.length);
  // An ordinary duel is preferred; a route whose first legal fight is the boss remains legitimate.
  candidates.sort((a, b) => {
    const boss = (path: string[]) =>
      Number(run.graph.nodes.find((entry) => entry.id === path.at(-1))!.kind === 'boss');
    return boss(a) - boss(b) || a.length - b.length || a.join('|').localeCompare(b.join('|'));
  });
  expect(
    candidates.length,
    'The starter must have a public route to a valid first combat',
  ).toBeGreaterThan(0);
  const path = candidates[0];
  for (const id of path.slice(0, -1)) {
    const before = await authoritative();
    await page.locator(`[data-node="${id}"]`).click();
    const candidate = page.locator('[data-pact-candidate]').first();
    if (await candidate.count()) await candidate.click();
    const pass = page.locator('[data-encounter-choice="pass"]');
    if (await pass.count()) await pass.click();
    expect(await authoritative()).toEqual(before);
    await page.locator('.node-confirm-action').click();
    await expect(page.locator('.node-event-dialog[open]')).toHaveCount(0);
    await expect
      .poll(async () => (await authoritative()).exploration!.run!.visited.includes(id))
      .toBe(true);
  }
  const party = await authoritative();
  expect(party.exploration!.run!.members.length).toBeGreaterThanOrEqual(3);
  expect(party.copies).toEqual(started.copies);

  await page.goto(`${origin}/#/shop/confectionery`);
  await expect(page.locator('.sweetshop-scene')).toBeVisible();
  await page.locator('[data-product="random-beans"]').click();
  await page.locator('.shop-purchase-ticket').click();
  await expect.poll(async () => (await authoritative()).revision).toBe(party.revision + 1);
  const bought = await authoritative();
  const purchase = bought.receipts.at(-1)!;
  expect(purchase.kind).toBe('purchase');
  if (purchase.kind !== 'purchase') throw Error('Expected one actual jar purchase');
  const jarId = purchase.unitIds[0];
  expect(bought.inventory.crowns).toBe(party.inventory.crowns - purchase.spentCrowns);
  await page.goto(`${origin}/#/map`);
  await page.locator(`[data-node="${path.at(-1)}"]`).click();
  await page.locator('.node-bean-preparation > summary').click();
  await page.locator(`[data-bean-id="${jarId}"]`).click();
  const carrier = bought.exploration!.run!.members.find((entry) => entry.unit.hp > 0)!.unit.id;
  await page.locator(`[data-bean-unit="${carrier}"]`).click();
  await expect(page.locator(`[data-bean-unit="${carrier}"]`)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(await authoritative()).toEqual(bought);
  await page.locator('.node-confirm-action').click();
  await expect(page.locator('.battle-panel')).toBeVisible();
  const committed = await authoritative();
  const receipt = committed.receipts.at(-1)!;
  if (receipt.kind !== 'advance-node' || !receipt.battle)
    throw Error('Missing confirmed first battle');
  expect(committed.inventory.products.find((entry) => entry.id === jarId)!.status).toBe('consumed');
  expect(receipt.battle.events).toContainEqual(
    expect.objectContaining({ kind: 'bean-activated', unitId: jarId }),
  );
  await skipBattle(page);
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await page.locator('[data-arena-facts-trigger]').click();
  const facts = page.locator('[data-battle-facts] [data-battle-fact]');
  await expect(facts.first()).toBeVisible();
  expect(await facts.count()).toBeLessThanOrEqual(2);
  await page.keyboard.press('Escape');
  await leaveBattle(page);
  await expect(page.locator('[data-map-phase]')).toBeVisible();
  expect(await authoritative()).toEqual(committed);

  await page.locator('nav').getByRole('button', { name: 'Álbum de Cromos', exact: true }).click();
  await expect(page.locator('.album')).toBeVisible();
  await page
    .getByRole('button', { name: /^Consultar cromo pendiente \d+$/ })
    .first()
    .click();
  const folio = page.locator('.album-card-folio[open]');
  await folio.getByRole('button', { name: 'Seguir este cromo', exact: true }).click();
  await expect(page.locator('[data-goal-state=searching]')).toBeVisible();
  await expect(folio.getByRole('region', { name: 'Cómo obtenerlo', exact: true })).toBeVisible();
  await selected(page, 'collection', 'es', 'diagon-alley');
  await folio.getByRole('button', { name: 'Ir a la confitería', exact: true }).click();
  await expect(page.locator('.sweetshop-scene')).toBeVisible();
  await expect(page.locator('.album-card-folio[open]')).toHaveCount(0);
  expect(await authoritative()).toEqual(committed);

  await page.goto(`${origin}/#/shop/workshop`);
  await expect(page.locator('[data-forge-comparison]')).toBeVisible();
  const ownReference = page.locator(`[data-forge-reference="${committed.copies[0].copyId}"]`);
  await ownReference.click();
  await expect(ownReference).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-forge-value]')).toHaveCount(3);
  await page.locator('.forge-action').click();
  const quote = page.locator('.shop-trade-confirmation[open]');
  await expect(quote).toBeVisible();
  await quote.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(quote).toHaveCount(0);
  await expect(page.locator('.forge-action')).toBeFocused();
  expect(await authoritative()).toEqual(committed);
  await selected(page, 'forge', 'es', 'diagon-alley');
  await page.locator('nav').getByRole('button', { name: 'Álbum de Cromos', exact: true }).click();
  await page.locator('.album-prepare-link').click();
  await expect(page.locator('.preparation-dialog[open]')).toBeVisible();
  expect(await authoritative()).toEqual(committed);
  await page.keyboard.press('Escape');
  await expect(page.locator('.album-prepare-link')).toBeFocused();
  await page.locator('nav').getByRole('button', { name: 'Mapa', exact: true }).click();
  await expect(page.locator('[data-map-phase]')).toBeVisible();
  expect(await authoritative()).toEqual(committed);
  expect(errors).toEqual([]);
  await mkdir(directory, { recursive: true });
  await writeFile(
    resolve(directory, 'connected-links-a89.json'),
    JSON.stringify(
      {
        sha: process.env.GITHUB_SHA ?? null,
        fixture: false,
        origin: 'technical-automation',
        isolatedGuest: true,
        language: 'es',
        pack: 'diagon-alley',
        viewport: page.viewportSize(),
        initialOwnedCopies: started.copies.length,
        preparedMembers: party.exploration!.run!.members.length,
        firstCombatKind: run.graph.nodes.find((entry) => entry.id === path.at(-1))!.kind,
        sourceLinkReachedSweetShop: true,
        forgeCancelledWithoutOperation: true,
        preparationCancelledWithoutOperation: true,
        limitations:
          'One connected cohort, no forced result, full boss/loot/next-run continuity covered separately by A63/A73 regressions. Company v2 remains composed UI and HTTP/PG evidence. Not human observation.',
      },
      null,
      2,
    ),
  );
});
