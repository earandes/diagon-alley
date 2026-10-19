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
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
}
/** Exactly five selected screenshots across the suite. Explicit Linux opt-in, no automatic matrix. */
async function selected(
  page: Page,
  name: 'company' | 'collection' | 'forge' | 'beans' | 'battle',
  lang: string,
  pack: string,
) {
  if (
    process.platform !== 'linux' ||
    (process.env.ARCANA_CAPTURE_A89 !== '1' && process.env.ARCANA_CAPTURE_A76 !== '1') ||
    test.info().project.name !== 'chromium-390-a89' ||
    lang !== 'es' ||
    pack !== 'diagon-alley'
  )
    return;
  await mkdir(directory, { recursive: true });
  await page.screenshot({ path: resolve(directory, `selected-${name}-390.png`), fullPage: false });
}

test('A89 declared guide and company choices preserve resources, ownership and explicit confirmation', async ({
  page,
}) => {
  for (const [lang, pack] of pairs) {
    await freshPreferences(page);
    await load(page, 'guide', lang, pack, '&single=1');
    const before = economic(await read(page));
    const help = page.locator('.priority-guide-help');
    await help.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(help.locator('.priority-guide-body')).toBeVisible();
    expect(economic(await read(page))).toBe(before);
    await help.locator('.priority-guide-dismiss').click();
    expect(economic(await read(page))).toBe(before);
    await page.reload();
    await expect(page.locator('.priority-guide-trigger > span')).toHaveCount(0);
    await page.locator('.priority-guide-trigger').click();
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
    const choose = page.locator('[data-intention-choice=company] .intention-object');
    await expect(choose).toBeVisible();
    await choose.focus();
    await page.keyboard.press('Enter');
    await expect(choose).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(async () => (await read(page)).game.exploration.intention.version).toBe(2);
    const intent = (await read(page)).game.exploration.intention;
    expect(intent.choice).toEqual({ kind: 'company', focus: 'house', house: 'gryffindor' });
    expect(intent.runId).toBeNull();
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
    await selected(page, 'collection', lang, pack);
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
    expect((await read(page)).game.inventory).toEqual(initial.game.inventory);
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
    await selected(page, 'forge', lang, pack);
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
      lang === 'es' ? 'sin consumir' : 'not consumed',
    );
    await finishMeasurement(page, beanMark);
    await page.locator('.bean-context-help > summary').click();
    await expect(page.locator('.bean-risk-note')).toContainText('50');
    await expect(page.locator('.bean-context-help')).toContainText(
      lang === 'es' ? 'no permite elegirlo' : 'does not let you choose',
    );
    await expect(page.locator('[data-bean-mint-preview]')).toBeVisible();
    expect(economic(await read(page))).toBe(before);
    await page.locator('.bean-carrier').last().click();
    await expect
      .poll(async () => (await read(page)).assignments)
      .toEqual([{ unitId: 'a89-copy-2', beanId: 'a89-jar-0' }]);
    await page.locator('.bean-carrier').last().click();
    await expect.poll(async () => (await read(page)).assignments).toEqual([]);
    await page.locator('.bean-carrier').first().click();
    await page.locator('[data-qa-cancel-draft]').click();
    await expect.poll(async () => (await read(page)).assignments).toEqual([]);
    expect(economic(await read(page))).toBe(before);
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
  }
  let importsFailed = 0;
  await page.route(/\/assets\/pixi-scenes-[^/]+\.js/, async (route) => {
    importsFailed++;
    await route.abort();
  });
  await load(page, 'battle', 'en', 'arcana', '&reduced=1');
  const before = economic(await read(page));
  await expect.poll(() => importsFailed).toBeGreaterThan(0);
  await expect(page.locator('.scene-fallback')).toBeVisible();
  await skipBattle(page);
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
    await guide.locator('summary').click();
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
