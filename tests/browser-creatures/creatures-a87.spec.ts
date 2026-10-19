import { expect, test, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  closeBattleOptions,
  openBattleOptions,
  inspectBattleRecord,
  leaveBattle,
  setDoubleBattleSpeed,
  skipBattle,
} from '../browser-trial/battle-controls';
test.use({ actionTimeout: 10000 });
const fixture = '/tests/browser-creatures/creatures-a87.html';
const root = resolve('docs/arcana/motion-audit-2026-10-16/evidence/linux/a87');
const capture = process.platform === 'linux' && process.env.ARCANA_CAPTURE_A69 === '1';
const pairs = [
  ['es', 'diagon-alley'],
  ['en', 'diagon-alley'],
  ['es', 'arcana'],
  ['en', 'arcana'],
] as const;
async function immutable(page: Page) {
  expect(
    await page.evaluate(() => (window as unknown as { __a87: { check(): boolean } }).__a87.check()),
  ).toBe(true);
}
async function report(name: string, value: unknown) {
  await mkdir(root, { recursive: true });
  await writeFile(
    resolve(root, name + '.json'),
    JSON.stringify({ sha: process.env.GITHUB_SHA, fixture: true, value }, null, 2) + '\n',
  );
}
async function picture(page: Page, name: string) {
  if (capture) {
    await mkdir(root, { recursive: true });
    await page.screenshot({ path: resolve(root, name + '.png'), animations: 'disabled' });
  }
}
async function fits(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  expect(
    await page.locator('.pedestal').evaluateAll((nodes) =>
      nodes.every((n) => {
        const r = n.getBoundingClientRect();
        return (
          r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1
        );
      }),
    ),
  ).toBe(true);
  await expect(page.locator('.pedestal')).toHaveCount(10);
  await expect(page.locator('.arena-health meter')).toHaveCount(10);
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1)).toBe(
    true,
  );
}
async function swapPausedPack(page: Page, pack: string) {
  await openBattleOptions(page);
  await page.locator('#arena-options .settings-trigger').click();
  const settings = page.locator('.game-settings[open]');
  await settings
    .getByRole('button', { name: pack === 'arcana' ? /ARCANA/ : /Diagon|Callejón/ })
    .click();
  await page.keyboard.press('Escape');
  await expect(settings).toHaveCount(0);
  await closeBattleOptions(page);
  await expect(page.locator('.scene-arena')).toHaveAttribute('data-art-ready', 'true');
  await expect(page.locator('.scene-arena')).toHaveAttribute('data-creature-textures', '4');
}
async function castAndPause(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((done, reject) => {
        const until = performance.now() + 15000;
        const observe = () => {
          const host = document.querySelector<HTMLElement>('.scene-arena');
          if (host?.dataset.creaturePose === 'cast' && Number(host.dataset.castOffset) > 5) {
            document.querySelector<HTMLButtonElement>('.arena-pause')!.click();
            done();
          } else if (performance.now() > until) reject(Error('No prepared creature cast observed'));
          else requestAnimationFrame(observe);
        };
        observe();
      }),
  );
  await expect(page.locator('#arena-options')).toBeVisible();
  await closeBattleOptions(page);
}
test('A87 route, Cromodex and formation draft keep classification, ownership and the same game', async ({
  page,
}, info) => {
  for (const [lang, pack] of pairs) {
    await page.goto(`${fixture}?mode=map&visited=1&intention=1&lang=${lang}&pack=${pack}`);
    const band = page.locator('.team-compact [data-bond-progress=creatures]');
    await expect(band).toHaveAttribute('data-active', 'true');
    await expect(page.locator('.team-token')).toHaveCount(5);
    expect(
      await page.locator('[data-node-state=available]').evaluateAll(
        (nodes) =>
          nodes.filter((n) => {
            const r = n.getBoundingClientRect();
            return !n.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
          }).length,
      ),
    ).toBe(0);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollHeight <= innerHeight + 1 &&
          document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await band.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(band.locator('.house-detail')).toBeVisible();
    await expect(band.locator('li')).toHaveCount(4);
    await band.locator('summary').press('Enter');
    await immutable(page);
    await page.goto(`${fixture}?mode=collection&lang=${lang}&pack=${pack}`);
    await page.locator('.album-filter-drawer>summary').click();
    await page
      .getByRole('group', { name: /Clasificación|Classification/ })
      .getByRole('button', { name: /Criaturas fantásticas|Fantastic creatures|Bestiario|Bestiary/ })
      .click();
    await expect(page.locator('.album article')).toHaveCount(4);
    await page.locator('.album article').first().getByRole('button').first().click();
    await expect(page.locator('.album-card-folio[open]')).toBeVisible();
    expect(
      await page
        .locator('.album-card-folio')
        .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
    if (info.project.name === 'chromium-390-motion-a69' && lang === 'es')
      await picture(page, `creature-folio-${pack}-390`);
    await page.keyboard.press('Escape');
    await immutable(page);
    await page
      .getByRole('group', { name: /Clasificación|Classification/ })
      .getByRole('button', { name: /Mortífagos|Death Eaters|Cónclave de la Máscara|Mask Conclave/ })
      .click();
    await expect(page.locator('.album article')).toHaveCount(4);
    await page.locator('.album article').first().getByRole('button').first().click();
    await expect(page.locator('.album-card-folio .trait-affiliations > span')).toHaveCount(2);
    await expect(page.locator('.album-card-folio')).toContainText(/descriptivos|descriptive/);
    if (info.project.name === 'chromium-390-motion-a69' && lang === 'es')
      await picture(page, `dual-affiliation-folio-${pack}-390`);
    await page.keyboard.press('Escape');
    await page
      .getByRole('group', { name: /Clasificación|Classification/ })
      .getByRole('button', {
        name: /Ejército de Dumbledore|Dumbledore’s Army|Círculo de Aprendices|Apprentice Circle/,
      })
      .click();
    await page.locator('.album article').first().getByRole('button').first().click();
    await expect(page.locator('.album-card-folio .trait-affiliations > span')).toHaveCount(1);
    await expect(page.locator('.album-card-folio')).toContainText(/descriptivos|descriptive/);
    await page.keyboard.press('Escape');
    await immutable(page);
    await page.goto(`${fixture}?mode=prepare&lang=${lang}&pack=${pack}`);
    await page.locator('.bond-selector>summary').click();
    await expect(page.locator('.bond-choices button')).toHaveCount(5);
    expect(
      await page.locator('.bond-choices').evaluate((el) => el.getBoundingClientRect().height),
    ).toBeLessThanOrEqual(220);
    if (info.project.name === 'chromium-390-motion-a69' && lang === 'es')
      await picture(page, `bond-preparation-${pack}-390`);
    await page.locator('[data-bond-mode=houses]').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-bond-mode=houses]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.preparation-confirm')).toBeEnabled();
    await page.locator('.preparation-back').click();
    await expect(page.locator('.team-compact [data-bond-progress=creatures]')).toHaveAttribute(
      'data-active',
      'true',
    );
    await immutable(page);
    await page.goto(`${fixture}?mode=prepare&lang=${lang}&pack=${pack}`);
    await page.locator('.bond-selector>summary').click();
    await page.locator('[data-bond-mode=houses]').click();
    await page.locator('.preparation-confirm').click();
    expect(
      await page.evaluate(
        () =>
          (window as unknown as { __a87: { lastTeam: { bondFocus: string; copyIds: string[] } } })
            .__a87.lastTeam,
      ),
    ).toMatchObject({ bondFocus: 'houses', copyIds: expect.any(Array) });
    await immutable(page);
  }
  await report(`${info.project.name}-classification`, {
    pairs,
    scope:
      'Declared 34-identity presentation fixture; cancellation and dispatch verified, no server grant or commit inferred',
  });
});
test('A87 creature poses and confirmed bond stay legible, pause exactly and survive skip and swap', async ({
  page,
}, info) => {
  for (const [lang, pack] of [pairs[0], pairs[3]]) {
    await page.goto(`${fixture}?mode=battle&lang=${lang}&pack=${pack}`);
    await expect(page.locator('.arena-heading h2')).toHaveText(
      lang === 'es' ? 'Duelo mágico' : 'Magical duel',
    );
    await expect(page.locator('.scene-arena')).toHaveAttribute('data-art-ready', 'true');
    await castAndPause(page);
    await fits(page);
    const host = page.locator('.scene-arena');
    const paused = await host.evaluate((el: HTMLElement) => ({
      pose: el.dataset.creaturePose,
      actor: el.dataset.creatureActor,
      offset: el.dataset.castOffset,
      profile: el.dataset.castProfile,
      textures: el.dataset.textureCount,
    }));
    expect(paused.pose).toBe('cast');
    expect(['phoenix', 'unicorn', 'hippogriff']).toContain(paused.profile);
    await page.waitForTimeout(150);
    expect(await host.getAttribute('data-cast-offset')).toBe(paused.offset);
    if (info.project.name === 'chromium-390-motion-a69')
      await picture(page, `creature-cast-${pack}-390`);
    await swapPausedPack(page, pack === 'diagon-alley' ? 'arcana' : 'diagon-alley');
    await expect(host).toHaveAttribute('data-creature-pose', 'cast');
    expect(await host.getAttribute('data-cast-offset')).toBe(paused.offset);
    await fits(page);
    await immutable(page);
    await page.locator('[data-bond-passive=creatures].arena-house').click();
    await expect(page.locator('.arena-inspector')).toBeVisible();
    await expect(page.locator('.arena-inspector li')).toHaveCount(4);
    await page.keyboard.press('Escape');
    await setDoubleBattleSpeed(page);
    await inspectBattleRecord(page);
    await expect(page.locator('.arena-inspector')).toBeVisible();
    await page.keyboard.press('Escape');
    await closeBattleOptions(page);
    const old = await host.elementHandle();
    await skipBattle(page);
    await expect(page.locator('[data-arena-outcome]')).toBeVisible();
    await immutable(page);
    await leaveBattle(page);
    await expect.poll(() => old!.evaluate((el: HTMLElement) => el.dataset.textureCount)).toBe('0');
    await old!.dispose();
    await page.locator('[data-qa-pack]').click();
    await expect(page.locator('.team-compact [data-bond-progress=creatures]')).toHaveAttribute(
      'data-active',
      'true',
    );
    await immutable(page);
    await report(`${info.project.name}-pose-${pack}`, {
      paused,
      scope:
        'Shared clock pose/offset frozen; all 10 DOM units/meters in viewport; detached texture counters zero, not global GPU leak proof',
    });
  }
});
test('A87 representative group scenes, missing pose, renderer loss and reduced motion preserve confirmed results', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'chromium-390-motion-a69',
    'One selected adverse-state sample; shared fallbacks also covered by original matrices.',
  );
  for (const bond of ['order', 'death'])
    for (const [lang, pack] of [pairs[0], pairs[3]]) {
      await page.goto(`${fixture}?mode=battle&bond=${bond}&lang=${lang}&pack=${pack}`);
      await expect(page.locator(`.arena-house[data-bond-passive=${bond}]`)).toBeVisible();
      await fits(page);
      await page.evaluate(
        (wanted) =>
          new Promise<void>((done, reject) => {
            const record = JSON.parse(
              (window as unknown as { __a87: { record: string } }).__a87.record,
            );
            const until = performance.now() + 20000;
            let watched = -1,
              sawFlight = false;
            const observe = () => {
              const cursor = Number(
                  document.querySelector<HTMLElement>('.battle-panel')!.dataset.replayCursor,
                ),
                event = record.battle.events[cursor];
              const host = document.querySelector<HTMLElement>('.scene-arena');
              if (cursor !== watched) {
                watched = cursor;
                sawFlight = false;
              }
              let ready = false;
              if (wanted === 'order')
                ready =
                  event?.kind === 'healed' &&
                  event.source === 'order' &&
                  Number(
                    document.querySelector<HTMLElement>('.battle-panel')!.dataset.replayProgress,
                  ) >= 0.78 &&
                  !!document.querySelector('[data-aid=true]');
              else if (
                event?.kind === 'spell-cast' &&
                event.bondBoost > 0 &&
                host?.dataset.castProfile === 'death'
              ) {
                if (Number(host.dataset.castOffset) < -1) sawFlight = true;
                ready = sawFlight && Math.abs(Number(host.dataset.castOffset)) < 0.01;
              }
              if (ready) {
                document.querySelector<HTMLButtonElement>('.arena-pause')!.click();
                done();
              } else if (performance.now() > until)
                reject(Error(`No confirmed ${wanted} effect observed`));
              else requestAnimationFrame(observe);
            };
            observe();
          }),
        bond,
      );
      await closeBattleOptions(page);
      if (bond === 'order') {
        await expect(page.locator('.pedestal[data-aid=true]')).toHaveCount(1);
        await expect(page.locator('.pedestal[data-acting=true]')).toHaveCount(1);
        expect(await page.locator('.pedestal[data-aid=true]').getAttribute('data-unit')).not.toBe(
          await page.locator('.pedestal[data-acting=true]').getAttribute('data-unit'),
        );
      }
      if (lang === 'es') await picture(page, `bond-${bond}-effect-390`);
      await skipBattle(page);
      await immutable(page);
    }
  // A declared reversed composition tests renderer orientation, not new campaign enemies.
  await page.goto(`${fixture}?mode=battle&rival-creatures=1&lang=es&pack=arcana`);
  await expect(page.locator('.pedestal[data-side=rival][data-creature]')).toHaveCount(4);
  await castAndPause(page);
  await fits(page);
  await expect(page.locator('.scene-arena')).toHaveAttribute('data-creature-facing', 'left');
  await picture(page, 'creature-rival-declared-390');
  await skipBattle(page);
  await immutable(page);
  await page.goto(`${fixture}?mode=opening&lang=es&pack=diagon-alley`);
  await expect(page.locator('dialog.reveal')).toHaveAttribute('data-opening-phase', 'reveal', {
    timeout: 15000,
  });
  await picture(page, 'creature-reveal-390');
  await immutable(page);
  let missingPoses = 0;
  await page.route(/\/cast(?:-[^/]+)?\.webp(?:\?.*)?$/, (route) => {
    missingPoses++;
    return route.abort();
  });
  await page.goto(`${fixture}?mode=battle&lang=es&pack=diagon-alley`);
  await expect(page.locator('.scene-arena')).toHaveAttribute('data-art-ready', 'true');
  await fits(page);
  await expect.poll(() => missingPoses).toBeGreaterThan(0);
  await expect(page.locator('.scene-arena')).not.toHaveAttribute('data-creature-textures', '4');
  await expect(page.locator('.pedestal[data-acting=true][data-creature]')).toHaveCount(1);
  await expect(page.locator('.scene-arena')).toHaveAttribute('data-creature-pose', 'rest');
  await immutable(page);
  await page
    .locator('.scene-arena canvas')
    .evaluate((el) =>
      el.dispatchEvent(new Event('webglcontextlost', { bubbles: true, cancelable: true })),
    );
  await expect(page.locator('.scene-fallback')).toBeVisible();
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await expect(page.locator('.arena-caption button:not([data-arena-facts-trigger])')).toBeEnabled();
  await immutable(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${fixture}?mode=battle&reduced=1&lang=en&pack=arcana`);
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await immutable(page);
  await page.goto(`${fixture}?mode=pact&lang=es&pack=diagon-alley`);
  await expect(page.locator('[data-pact-candidate]')).toHaveCount(2);
  await page.locator('[data-pact-candidate$=":creature"]').click();
  await expect(page.locator('[data-bond-progress=creatures]')).toHaveAttribute(
    'data-active',
    'true',
  );
  await expect(page.locator('[data-preparation-synergies]>summary')).toContainText(
    /afinidad|affinity/,
  );
  await immutable(page);
  await picture(page, 'creature-pact-390');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('**/pixi-scenes-*.js', (route) => route.abort());
  await page.goto(`${fixture}?mode=battle&lang=es&pack=diagon-alley`);
  await expect(page.locator('.scene-fallback')).toBeVisible();
  await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  await immutable(page);
  await page.unroute('**/pixi-scenes-*.js');
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(`${fixture}?mode=prepare&lang=en&pack=arcana`);
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  await page.locator('.bond-selector>summary').click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await expect(page.locator('[data-bond-mode=creatures]')).toBeEnabled();
  await immutable(page);

  let missingSealRequests = 0;
  await page.route('**/a87-missing-bond.svg', (route) => {
    missingSealRequests++;
    return route.abort();
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${fixture}?mode=map&lang=es&pack=diagon-alley`);
  const missingSeal = page.locator('.team-compact [data-bond-progress=creatures] summary');
  const bundledSeal = await missingSeal.locator('img[data-art]').getAttribute('src');
  // Small SVGs may be inlined by Vite, so intercepting their source filename
  // cannot cause a failure. Exercise the real native error and Artwork handler.
  await missingSeal.locator('img[data-art]').evaluate((image: HTMLImageElement) => {
    image.src = '/a87-missing-bond.svg';
  });
  await expect.poll(() => missingSealRequests).toBeGreaterThan(0);
  await expect(missingSeal.locator('img[data-art]')).toHaveCount(0);
  await expect(missingSeal).toContainText('Criaturas fantásticas');
  expect(
    await missingSeal
      .locator('span')
      .last()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThan(0);
  await missingSeal.press('Enter');
  await expect(page.locator('.team-compact .house-detail')).toBeVisible();
  await immutable(page);
  await report('representative-adverse-states', {
    groups: ['order', 'death'],
    declaredRivalCreatureOrientation: true,
    missingCast: true,
    missingBondSeal: true,
    missingSealRequests,
    bundledSealWasInline: bundledSeal?.startsWith('data:') ?? false,
    rendererLoss: true,
    importFailure: true,
    text320x200: true,
    reduced: true,
    pactPreview: true,
    scope: 'Presentation fixtures; persistence and actual node commits covered separately',
  });
});

test('A87 bounded creature workload measures action, pose loading and sustained replay in fresh contexts', async ({
  browser,
}, info) => {
  test.skip(
    info.project.name !== 'chromium-390-motion-a69',
    'Six bounded fresh-context samples on one declared Linux environment; not a device claim.',
  );
  const rows = [];
  for (const pack of ['diagon-alley', 'arcana'])
    for (let sample = 0; sample < 3; sample++) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        serviceWorkers: 'block',
        reducedMotion: 'no-preference',
      });
      try {
        const p = await context.newPage();
        await p.goto(`${fixture}?mode=map&lang=es&pack=${pack}`);
        await expect(p.locator('.team-compact')).toBeVisible();
        await p.evaluate(() => {
          const durations: number[] = [];
          const observer = new PerformanceObserver((list) => {
            for (const e of list.getEntries()) durations.push(e.duration);
          });
          if (PerformanceObserver.supportedEntryTypes.includes('longtask'))
            observer.observe({ type: 'longtask' });
          Object.assign(window, {
            __a87Performance: { durations, stop: () => observer.disconnect() },
          });
        });
        await p.locator('[data-qa-combat]').click();
        await expect(p.locator('.scene-arena')).toHaveAttribute('data-art-ready', 'true');
        await fits(p);
        const ready = await p.evaluate(() => ({
          now: performance.now(),
          start: (window as unknown as { __a87: { entryStarted: number } }).__a87.entryStarted,
        }));
        // Pose textures are recorded separately; their cost remains inside action→prepared, not hidden in another screen.
        await expect(p.locator('.scene-arena')).toHaveAttribute('data-creature-textures', '4');
        const prepared = await p.evaluate(() => performance.now());
        const sustained = await p.evaluate(async () => {
          const values: number[] = [];
          let last = performance.now();
          let firstReportedCastAt: number | null = null;
          for (let i = 0; i < 300; i++)
            await new Promise<void>((done) =>
              requestAnimationFrame((now) => {
                values.push(now - last);
                last = now;
                if (
                  firstReportedCastAt === null &&
                  document.querySelector<HTMLElement>('.scene-arena')?.dataset.creaturePose ===
                    'cast'
                )
                  firstReportedCastAt = now;
                done();
              }),
            );
          const sorted = [...values].sort((a, b) => a - b);
          const data = (
            window as unknown as { __a87Performance: { durations: number[]; stop(): void } }
          ).__a87Performance;
          data.stop();
          const host = document.querySelector<HTMLElement>('.scene-arena')!;
          return {
            firstReportedCastAt,
            intervals: values,
            p95: sorted[Math.ceil(0.95 * sorted.length) - 1],
            max: sorted.at(-1),
            longTasks: data.durations,
            textureCount: host.dataset.textureCount,
            textureRgbaEstimate: host.dataset.textureBytes,
          };
        });
        rows.push({
          pack,
          sample,
          actionToFiguresMs: ready.now - ready.start,
          actionToCastTexturesRegisteredMs: prepared - ready.start,
          ...sustained,
        });
        await report('creature-performance-progress', {
          complete: false,
          rows,
          scope:
            'Incremental raw evidence retained even if a later budget assertion fails. Texture registration is not a GPU-upload measurement.',
        });
        await immutable(p);
        expect(sustained.p95).toBeLessThanOrEqual(20);
        expect(Number(sustained.textureRgbaEstimate)).toBeLessThanOrEqual(32 * 1024 * 1024);
      } finally {
        await context.close();
      }
    }
  await report('creature-performance', {
    conditions:
      'Chromium390x844 ES; three fresh contexts per pack, sequential; modules already evaluated on map. Local HTTP, unthrottled. Not OS cold cache, mobile physical device or GPU time. 300 sustained rAF intervals after the separately measured action→figures and action→CPU texture-registration costs; registration is not a GPU-upload measurement; long tasks include startup through the window.',
    targets: {
      sustainedP95RafMs: 20,
      startupFiguresMs: 1000,
      castTexturesRegisteredMs: 1500,
      startupAreTrialGoalsNotUniversalGuarantees: true,
    },
    rows,
  });
});

// Observes native audio starts after real Settings consent. No synthetic sound engine.
test('A87 creature launch cues reach native audio only after consent and stop on pause or skip', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'chromium-390-motion-a69',
    'One bounded native sample; real decoding in all A84 audio projects covers all seven new files.',
  );
  let wavRequests = 0;
  page.on('request', (r) => {
    if (r.url().endsWith('.wav')) wavRequests++;
  });
  await page.goto(`${fixture}?mode=map&lang=es&pack=diagon-alley`);
  expect(wavRequests).toBe(0);
  await page.locator('.settings-trigger').click();
  await page
    .locator('dialog.settings-case[open]')
    .getByRole('button', { name: /^Efectos/ })
    .click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (
          window as unknown as { __a87: { audio: { getSnapshot(): string } } }
        ).__a87.audio.getSnapshot(),
      ),
    )
    .toBe('ready');
  expect(wavRequests).toBe(15);
  await page.keyboard.press('Escape');
  await page.evaluate(() => {
    const rows: { cue: string; nativeStarted: boolean }[] = [];
    let starts = 0;
    const native = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...args: Parameters<typeof native>) {
      starts++;
      return native.apply(this, args);
    };
    const data = (
      window as unknown as {
        __a87: { audio: { play(name: string): void }; audioCues: typeof rows };
      }
    ).__a87;
    const play = data.audio.play.bind(data.audio);
    data.audio.play = (cue: string) => {
      const before = starts;
      play(cue);
      rows.push({ cue, nativeStarted: starts > before });
    };
    data.audioCues = rows;
  });
  await page.locator('[data-qa-combat]').click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as unknown as { __a87: { audioCues: { cue: string; nativeStarted: boolean }[] } }
          ).__a87.audioCues.filter(
            (r) => r.nativeStarted && /^cast-(phoenix|hippogriff|unicorn|dragon)$/.test(r.cue),
          ).length,
      ),
    )
    .toBeGreaterThan(0);
  await page.locator('.arena-pause').click();
  const before = await page.evaluate(
    () => (window as unknown as { __a87: { audioCues: unknown[] } }).__a87.audioCues.length,
  );
  await page.waitForTimeout(200);
  await swapPausedPack(page, 'arcana');
  expect(
    await page.evaluate(
      () => (window as unknown as { __a87: { audioCues: unknown[] } }).__a87.audioCues.length,
    ),
  ).toBe(before);
  await skipBattle(page);
  await immutable(page);
  await report('creature-native-audio', {
    wavRequests,
    cues: await page.evaluate(
      () => (window as unknown as { __a87: { audioCues: unknown[] } }).__a87.audioCues,
    ),
    scope: 'Native source start observed, not human listening or acoustic balance.',
  });
});
