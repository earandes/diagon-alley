import { pauseBattle, skipBattle } from '../browser-trial/battle-controls';
import { expect, test } from '../browser-trial/game-fixture';
test('five-unit arena text grows at 200 percent without clipping functional labels', async ({
  page,
}) => {
  await page.goto('/tests/arcana-arena-harness.html');
  await expect(page.locator('.pedestal')).toHaveCount(10);
  await skipBattle(page);
  const before = await page
    .locator('.pedestal strong')
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  const after = await page
    .locator('.pedestal strong')
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(after).toBeGreaterThanOrEqual(before * 1.99);
  expect(
    await page
      .locator('.pedestal')
      .evaluateAll((nodes) => nodes.every((el) => el.scrollHeight <= el.clientHeight + 1)),
  ).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
// Frame metrics exclude Playwright trace capture overhead; functional cases retain configured traces.
test.use({ trace: 'off' });
test('profiles sustained five-unit rendering at responsive sizes and stops drawing when paused', async ({
  page,
}, info) => {
  test.setTimeout(65_000);
  await page.goto('/tests/arcana-arena-harness.html?distinct-art');
  const host = page.locator('.arena-stage .scene-canvas');
  await expect(host).toHaveAttribute('data-renderer', 'webgl');
  const profiles = [];
  for (const viewport of [
    { width: 320, height: 844 },
    { width: 390, height: 844 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    const profile = await page.evaluate(async () => {
      const host = document.querySelector<HTMLElement>('.arena-stage .scene-canvas')!;
      await new Promise((resolve) => setTimeout(resolve, 500));
      const draws = Number(host.dataset.renderCount);
      const times: number[] = [];
      await new Promise<void>((resolve) => {
        const start = performance.now();
        const frame = (time: number) => {
          times.push(time);
          if (time - start < 10_000) requestAnimationFrame(frame);
          else resolve();
        };
        requestAnimationFrame(frame);
      });
      const intervals = times
        .slice(1)
        .map((time, i) => time - times[i])
        .sort((a, b) => a - b);
      const elapsed = times.at(-1)! - times[0];
      return {
        viewport: { width: innerWidth, height: innerHeight },
        unitsPerSide: 5,
        sampleMs: elapsed,
        loadedArtTextures: Number(host.dataset.textureCount),
        decodedArtTextureBytes: Number(host.dataset.textureBytes),
        jsHeapBytes:
          (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
            ?.usedJSHeapSize ?? null,
        displayFps: ((times.length - 1) * 1000) / elapsed,
        p95FrameMs: intervals[Math.floor(intervals.length * 0.95)],
        framesAbove25Ms: intervals.filter((ms) => ms > 25).length,
        rendererDraws: Number(host.dataset.renderCount) - draws,
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
        userAgent: navigator.userAgent,
        contentPack: localStorage.getItem('arcana.presentation.content-pack.v1'),
        artwork: [...document.querySelectorAll<HTMLImageElement>('.pedestal img[data-art]')].map(
          (image) => ({
            source: image.currentSrc,
            width: image.naturalWidth,
            height: image.naturalHeight,
          }),
        ),
      };
    });
    expect(profile.rendererDraws).toBeGreaterThan(100);
    expect(profile.loadedArtTextures).toBeGreaterThanOrEqual(10);
    expect(profile.decodedArtTextureBytes).toBeGreaterThan(0);
    expect(profile.horizontalOverflow).toBe(false);
    if (process.env.ARCANA_TEST_CONTENT_PACK === 'diagon-alley') {
      expect(profile.contentPack).toBe('diagon-alley');
      expect(profile.artwork.length).toBeGreaterThanOrEqual(10);
      expect(
        profile.artwork.every(
          (image) => image.source.includes('/character-illustrated-v2/') && image.width > 0,
        ),
      ).toBe(true);
    }
    profiles.push(profile);
  }
  await pauseBattle(page);
  const paused = await host.getAttribute('data-render-count');
  await page.waitForTimeout(500);
  expect(await host.getAttribute('data-render-count')).toBe(paused);
  await info.attach('five-unit-profile', {
    body: JSON.stringify(profiles),
    contentType: 'application/json',
  });
  const { writeFile } = await import('node:fs/promises');
  await writeFile(info.outputPath('five-unit-profile.json'), JSON.stringify(profiles, null, 2));
  if (process.env.ARCANA_ARENA_EVIDENCE_ROOT) {
    const { mkdir } = await import('node:fs/promises');
    const { resolve } = await import('node:path');
    const evidence = resolve(process.env.ARCANA_ARENA_EVIDENCE_ROOT);
    await mkdir(evidence, { recursive: true });
    await writeFile(
      resolve(evidence, `arena-profile-${info.project.name}.json`),
      JSON.stringify(profiles, null, 2),
    );
  }
});
