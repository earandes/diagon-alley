import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
const root = resolve(
  process.env.ARCANA_CAPTURE_A69 === '1'
    ? 'docs/arcana/motion-audit-2026-10-16/evidence/linux/a84'
    : 'docs/arcana/audio-increment-2026-10-18/evidence/linux',
);
const samples: unknown[] = [];
const fixture = '/tests/browser-audio/audio-a84.html';
test.skip(
  ({ browserName, viewport }) =>
    !(
      (browserName === 'chromium' && [390, 1280].includes(viewport?.width ?? 0)) ||
      (browserName === 'webkit' && viewport?.width === 865)
    ),
  'A84 explicitly samples three engine/viewport pairs; other A69 pairs retain their motion tests',
);
const settings = (page: Page) => page.locator('dialog.settings-case[open]');
test.afterAll(async () => {
  await mkdir(root, { recursive: true });
  await writeFile(
    resolve(root, `${test.info().project.name}.json`),
    JSON.stringify(samples, null, 2),
  );
});

test('A84 opt-in settings, real decode, preferences and both worlds/languages', async ({
  page,
}) => {
  for (const pack of ['diagon-alley', 'arcana'])
    for (const lang of ['es', 'en']) {
      let requests = 0;
      const onRequest = (request: import('@playwright/test').Request) => {
        if (request.url().endsWith('.wav')) requests++;
      };
      page.on('request', onRequest);
      await page.goto(`${fixture}?pack=${pack}&lang=${lang}`);
      await page.evaluate(() => localStorage.removeItem('arcana.presentation.audio.v1'));
      await page.reload();
      expect(await page.evaluate(() => window.__a84.audio.diagnostics().context)).toBe(false);
      expect(requests).toBe(0);
      await page.locator('.settings-trigger').click();
      const dialog = settings(page);
      const music = dialog.getByRole('button', {
        name: lang === 'es' ? /Ambiente musical/ : /Musical ambience/,
      });
      const effects = dialog.getByRole('button', { name: lang === 'es' ? /^Efectos/ : /^Effects/ });
      await expect(music).toHaveAttribute('aria-pressed', 'false');
      await expect(effects).toHaveAttribute('aria-pressed', 'false');
      const started = Date.now();
      await music.focus();
      await page.keyboard.press('Enter');
      await expect.poll(() => page.evaluate(() => window.__a84.audio.getSnapshot())).toBe('ready');
      await expect
        .poll(() => page.evaluate(() => window.__a84.audio.diagnostics().musicVoices))
        .toBe(1);
      const ready = Date.now() - started;
      expect(requests).toBe(1);
      await effects.tap();
      await expect.poll(() => page.evaluate(() => window.__a84.audio.getSnapshot())).toBe('ready');
      await expect.poll(() => requests).toBe(9);
      await dialog.locator('.audio-volume summary').click();
      const slider = dialog.getByRole('slider', {
        name: lang === 'es' ? 'Volumen del ambiente' : 'Ambience volume',
      });
      await slider.focus();
      await page.keyboard.press('Home');
      for (let step = 0; step < 8; step++) await page.keyboard.press('ArrowRight');
      await expect(slider).toHaveAttribute('aria-valuetext', /^40\s*%$/);
      const geometry = await dialog.evaluate((e) => ({
        width: e.getBoundingClientRect().width,
        viewport: innerWidth,
        scrollWidth: e.scrollWidth,
        clientWidth: e.clientWidth,
      }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
      await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
      const enlarged = await dialog.evaluate((e) => ({
        scrollWidth: e.scrollWidth,
        clientWidth: e.clientWidth,
      }));
      expect(enlarged.scrollWidth).toBeLessThanOrEqual(enlarged.clientWidth + 1);
      await expect(music).toBeVisible();
      await expect(slider).toBeVisible();
      await page.evaluate(() => (document.documentElement.style.fontSize = ''));
      samples.push({
        kind: 'gesture-to-ready',
        project: test.info().project.name,
        pack,
        lang,
        wallMs: ready,
        geometry,
        text200: enlarged,
      });
      if (
        process.platform === 'linux' &&
        (process.env.ARCANA_CAPTURE_A84 === '1' || process.env.ARCANA_CAPTURE_A69 === '1') &&
        (test.info().project.use.browserName === 'webkit'
          ? pack === 'arcana' && lang === 'en'
          : pack === 'diagon-alley' && lang === 'es')
      ) {
        await mkdir(root, { recursive: true });
        await page.screenshot({
          path: resolve(root, `${test.info().project.name}-settings.png`),
          fullPage: false,
        });
      }
      // One bounded two-tab sample: native storage events propagate mute, never unlock audio.
      const other =
        test.info().project.name.includes('chromium-1280') &&
        pack === 'diagon-alley' &&
        lang === 'es'
          ? await page.context().newPage()
          : null;
      try {
        if (other) {
          await other.goto(`${new URL(fixture, page.url())}?pack=${pack}&lang=${lang}`);
          expect(await other.evaluate(() => window.__a84.preferences.getSnapshot().music)).toBe(
            true,
          );
          expect(await other.evaluate(() => window.__a84.audio.diagnostics().context)).toBe(false);
          await page.bringToFront();
        }
        await music.click();
        if (other) {
          await expect
            .poll(() => other.evaluate(() => window.__a84.preferences.getSnapshot().music))
            .toBe(false);
          expect(await other.evaluate(() => window.__a84.audio.diagnostics().context)).toBe(false);
        }
      } finally {
        await other?.close();
      }
      await expect
        .poll(() => page.evaluate(() => window.__a84.audio.diagnostics().musicVoices))
        .toBe(0);
      await page.keyboard.press('Escape');
      await expect(page.locator('.settings-trigger')).toBeFocused();
      await page.reload();
      expect(await page.evaluate(() => window.__a84.audio.diagnostics().context)).toBe(false);
      await page.locator('.settings-trigger').click();
      await expect(
        settings(page).getByRole('button', { name: lang === 'es' ? /^Efectos/ : /^Effects/ }),
      ).toHaveAttribute('aria-pressed', 'true');
      await settings(page)
        .getByRole('button', { name: lang === 'es' ? /^Efectos/ : /^Effects/ })
        .click();
      await page.keyboard.press('Escape');
      page.off('request', onRequest);
    }
});

test('A84 saved replay clock, pause, 2x, skip and reduced never change confirmed log', async ({
  page,
}) => {
  await page.goto(fixture);
  await page.locator('.settings-trigger').click();
  await settings(page)
    .getByRole('button', { name: /^Efectos/ })
    .click();
  await expect.poll(() => page.evaluate(() => window.__a84.audio.getSnapshot())).toBe('ready');
  await page.keyboard.press('Escape');
  const before = await page.evaluate(() => JSON.stringify(window.__a84.battle));
  // Observe real native source starts in the declared harness, not a synthetic audio engine.
  await page.evaluate(() => {
    (window as unknown as { __a84Sounds: number }).__a84Sounds = 0;
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...args: Parameters<typeof start>) {
      (window as unknown as { __a84Sounds: number }).__a84Sounds++;
      return start.apply(this, args);
    };
  });
  await page.locator('[data-fixture-start]').click();
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __a84Sounds: number }).__a84Sounds))
    .toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pausa', exact: true }).click();
  expect(await page.evaluate(() => window.__a84.audio.diagnostics().effectVoices)).toBe(0);
  const paused = await page.locator('.battle-panel').getAttribute('data-replay-cursor');
  await page.waitForTimeout(250);
  expect(await page.locator('.battle-panel').getAttribute('data-replay-cursor')).toBe(paused);
  await page.getByRole('button', { name: '2x', exact: true }).click();
  await page.getByRole('button', { name: 'Auto', exact: true }).click();
  await page.getByRole('button', { name: 'Omitir reproducción', exact: true }).click();
  await expect(page.locator('.battle-panel')).toHaveAttribute('data-replay-phase', 'finished');
  expect(await page.evaluate(() => window.__a84.audio.diagnostics().effectVoices)).toBe(0);
  expect(await page.evaluate(() => JSON.stringify(window.__a84.battle))).toBe(before);
  const sounds = await page.evaluate(
    () => (window as unknown as { __a84Sounds: number }).__a84Sounds,
  );
  await page.waitForTimeout(200);
  expect(
    await page.evaluate(() => (window as unknown as { __a84Sounds: number }).__a84Sounds),
  ).toBe(sounds);
  await page.evaluate(() => window.__a84.unmount());
  await page.evaluate(() => window.__a84.reduced());
  await page.locator('[data-fixture-start]').click();
  await expect(page.locator('.battle-panel')).toHaveAttribute('data-replay-phase', 'finished');
  expect(await page.evaluate(() => JSON.stringify(window.__a84.battle))).toBe(before);
});

test('A84 real offline mix, source bounds and missing sound remain recoverable', async ({
  page,
}) => {
  await page.goto(fixture);
  const decoded = await page.evaluate(async () => {
    const audio = new OfflineAudioContext(1, 48000, 48000);
    const results = [];
    for (const [name, url] of Object.entries(window.__a84.assets)) {
      const start = performance.now();
      const bytes = await fetch(url).then((r) => r.arrayBuffer());
      const buffer = await audio.decodeAudioData(bytes);
      results.push({
        name,
        duration: buffer.duration,
        decodedFloatBytes: buffer.length * buffer.numberOfChannels * 4,
        fetchAndDecodeWallMs: performance.now() - start,
      });
      if (name === 'heal') {
        const source = audio.createBufferSource();
        source.buffer = buffer;
        source.connect(audio.destination);
        source.start();
      }
    }
    const rendered = await audio.startRendering();
    const peak = rendered.getChannelData(0).reduce((m, v) => Math.max(m, Math.abs(v)), 0);
    return { results, peak };
  });
  expect(decoded.peak).toBeGreaterThan(0.01);
  expect(decoded.peak).toBeLessThan(1);
  expect(decoded.results).toHaveLength(9);
  samples.push({ kind: 'offline-real-decode', ...decoded });
  await page.route('**/*.wav', (route) => route.abort());
  await page.locator('.settings-trigger').click();
  await settings(page)
    .getByRole('button', { name: /Ambiente musical/ })
    .click();
  await expect(settings(page).getByRole('status')).toContainText('No se ha podido');
  await expect(
    settings(page).getByRole('button', { name: 'Activar sonido', exact: true }),
  ).toBeEnabled();
  await page.keyboard.press('Escape');
  await page.locator('[data-fixture-start]').click();
  await expect(page.locator('.battle-panel')).toBeVisible();
  await page.getByRole('button', { name: 'Omitir reproducción', exact: true }).click();
  await expect(page.locator('.battle-panel')).toHaveAttribute('data-replay-phase', 'finished');
});
