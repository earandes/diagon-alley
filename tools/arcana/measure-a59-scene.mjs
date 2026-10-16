import { chromium, webkit, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const url = process.env.ARCANA_A59_PERF_URL ?? 'http://127.0.0.1:5250';
const folder = resolve(
  process.env.ARCANA_SCENE_EVIDENCE_ROOT ?? 'docs/arcana/annotations-2026-10-15/qa/scene',
);
await mkdir(folder, { recursive: true });
const profiles = [];
for (const [engine, type] of Object.entries({ chromium, webkit })) {
  const browser = await type.launch({ headless: true });
  try {
    const context = await browser.newContext({ baseURL: url });
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('arcana.presentation.content-pack.v1', 'diagon-alley');
      localStorage.setItem('arcana-language', 'es');
    });
    await page.goto(url);
    await page.locator('.portal-enter').click();
    await page.locator('.preparation-card').first().click();
    await page.locator('[data-preparation-confirm]').click();
    await expect(page.locator('[data-map-phase]')).toHaveAttribute('data-map-phase', 'route');
    const state = (await (await page.request.get('/api/state')).json()).state;
    for (const viewport of [
      { width: 911, height: 1079 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
      );
      const result = await page.evaluate(async () => {
        const frames = [];
        const tasks = [];
        const supported = PerformanceObserver.supportedEntryTypes.includes('longtask');
        const observer = supported
          ? new PerformanceObserver((list) =>
              tasks.push(...list.getEntries().map((e) => e.duration)),
            )
          : null;
        observer?.observe({ type: 'longtask' });
        await new Promise((resolve) => {
          let first, previous;
          function frame(time) {
            first ??= time;
            if (previous !== undefined) frames.push(time - previous);
            previous = time;
            if (time - first < 5000) requestAnimationFrame(frame);
            else resolve();
          }
          requestAnimationFrame(frame);
        });
        observer?.disconnect();
        const sorted = [...frames].sort((a, b) => a - b);
        return {
          duration: frames.reduce((a, b) => a + b, 0),
          frames: frames.length,
          fps: (1000 * frames.length) / frames.reduce((a, b) => a + b, 0),
          maxFrameMs: Math.max(...frames),
          p95FrameMs: sorted[Math.floor(sorted.length * 0.95)],
          longTasksSupported: supported,
          longTasks: supported ? tasks : null,
          ambientMotes: document.querySelectorAll('.scene-mote').length,
          ambientPlayState: getComputedStyle(document.querySelector('.scene-mote'))
            .animationPlayState,
          documentWidth: document.documentElement.scrollWidth,
          documentHeight: document.documentElement.scrollHeight,
          viewport: { width: innerWidth, height: innerHeight },
        };
      });
      profiles.push({ engine, ...result });
      if (result.documentWidth > viewport.width || result.documentHeight > viewport.height + 2)
        throw Error('Map overflow');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.scene-atmosphere')).toHaveCount(0);
    const after = (await (await page.request.get('/api/state')).json()).state;
    expect(after).toEqual(state);
    await context.close();
  } finally {
    await browser.close();
  }
}
await writeFile(
  resolve(folder, 'profiles.json'),
  JSON.stringify(
    {
      profile:
        'Compiled idle map with six CSS motes, five seconds per size/engine; not physical device evidence or cold load',
      stateUnchanged: true,
      reducedAmbientAbsent: true,
      profiles,
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    profiles.map(({ engine, viewport, fps, maxFrameMs, p95FrameMs, longTasks, ambientMotes }) => ({
      engine,
      viewport,
      fps,
      maxFrameMs,
      p95FrameMs,
      longTasks,
      ambientMotes,
    })),
    null,
    2,
  ),
);
