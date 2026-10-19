import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

test('A92 same route and names before/after; bounded technical action comparison', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'chromium-390-a92',
    'One declared paired fixture, not a capture matrix.',
  );
  const out = resolve(
    process.env.A92_EVIDENCE_ROOT ?? 'docs/arcana/experience-clarity-2026-10-19/evidence/linux',
  );
  await mkdir(out, { recursive: true });
  const measurements: unknown[] = [];
  let originalGraph = '';
  for (const [pair, variants] of [
    ['AB', ['baseline', 'current']],
    ['BA', ['current', 'baseline']],
    ['AB', ['baseline', 'current']],
  ] as const) {
    for (const variant of variants) {
      const port = variant === 'baseline' ? 5623 : 5621;
      await page.goto(
        `http://127.0.0.1:${port}/tests/browser-experience-clarity/map-preparation-a92.html?mode=map&pack=diagon-alley&lang=es`,
      );
      await expect(page.locator('[data-node]').first()).toBeVisible();
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
      });
      const graph = await page.evaluate(() => JSON.stringify(window.__a92MapPrep.graph));
      if (!originalGraph) originalGraph = graph;
      else expect(graph).toBe(originalGraph);
      const locked = page.getByRole('button', { name: /Bloqueado/ }).first();
      const start = await page.evaluate(() => performance.now());
      await locked.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      const end = await page.evaluate(() => performance.now());
      measurements.push({
        pair,
        variant,
        action: 'consult-public-node',
        actionToUsableMs: end - start,
        graphIdentical: true,
        includesAutomationOverhead: true,
      });
      await page.keyboard.press('Escape');
      if (measurements.length <= 2 && process.env.ARCANA_CAPTURE_A92 === '1')
        await page.screenshot({ path: resolve(out, `${variant}-same-route.png`), fullPage: false });
    }
  }
  for (const variant of ['baseline', 'current']) {
    const port = variant === 'baseline' ? 5623 : 5621;
    await page.goto(
      `http://127.0.0.1:${port}/tests/browser-experience-clarity/map-preparation-a92.html?mode=preparation&pack=diagon-alley&lang=es&count=5`,
    );
    await expect(page.locator('[data-boss-member]')).toHaveCount(5);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
      await Promise.all(
        document
          .getAnimations()
          .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
          .map((a) => a.finished.catch(() => {})),
      );
    });
    const shape = await page.locator('.boss-party-name').evaluateAll((names) =>
      names.map((n) => ({
        name: n.textContent,
        width: n.getBoundingClientRect().width,
        height: n.getBoundingClientRect().height,
        overflowWrap: getComputedStyle(n).overflowWrap,
      })),
    );
    const presentation = await page.locator('dialog').evaluate((element) => ({
      opacity: getComputedStyle(element).opacity,
      background: getComputedStyle(element).background,
      box: element.getBoundingClientRect().toJSON(),
      scrollHeight: element.scrollHeight,
      clientHeight: element.clientHeight,
    }));
    measurements.push({ variant, fixture: 'same-five-names', shape, presentation });
    if (process.env.ARCANA_CAPTURE_A92 === '1')
      await page.screenshot({
        path: resolve(out, `${variant}-same-preparation.png`),
        fullPage: false,
      });
  }
  await writeFile(
    resolve(out, 'paired-comparison.json'),
    JSON.stringify(
      {
        baseline: '86d6a92665f63616034a4fcd668c5df6ffe3e322',
        candidate: process.env.GITHUB_SHA ?? null,
        observations: measurements,
        cache: 'uncontrolled browser default; not cold start',
        limitations:
          '3 paired technical consultations include Playwright timing overhead; no human duration, GPU or causal performance attribution',
      },
      null,
      2,
    ),
  );
});
