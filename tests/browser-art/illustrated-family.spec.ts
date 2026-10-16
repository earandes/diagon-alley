import { expect, test } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { changeLanguage } from '../browser-trial/game-fixture';

const evidence = resolve(
  process.env.ARCANA_ART_EVIDENCE_ROOT ?? 'docs/arcana/illustrated-assets-2026-10-15/captures',
);
for (const language of ['es', 'en'] as const) {
  test(`A58 all thirty illustrated characters decode and swap coherently ${language}`, async ({
    page,
  }, info) => {
    await page.addInitScript(() =>
      localStorage.setItem('arcana.presentation.content-pack.v1', 'diagon-alley'),
    );
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/tests/arcana-art-harness.html');
    if (language === 'en') await changeLanguage(page, 'en');
    await expect(page.locator('.art-family-grid > figure')).toHaveCount(30);
    const images = page.locator('.art-family-grid img[data-art]');
    await expect(images).toHaveCount(90);
    await expect
      .poll(() =>
        images.evaluateAll((nodes) =>
          nodes.every(
            (node) =>
              (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0,
          ),
        ),
      )
      .toBe(true);
    const urls = await images.evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLImageElement).currentSrc),
    );
    expect(new Set(urls).size).toBe(90);
    expect(urls.every((url) => url.includes('/character-illustrated-v2/'))).toBe(true);
    if (process.env.ARCANA_ART_EVIDENCE_ROOT) {
      await mkdir(evidence, { recursive: true });
      await writeFile(
        resolve(evidence, `${info.project.name}-${language}-runtime-webp.json`),
        JSON.stringify(urls, null, 2) + '\n',
      );
    }
    await expect(page.locator('[data-character="apprentice"] figcaption')).toHaveText(
      'Harry Potter',
    );
    if (info.project.name === 'chromium-art') {
      await mkdir(evidence, { recursive: true });
      await page.screenshot({
        path: resolve(evidence, `${language}-family-1280.png`),
        fullPage: true,
      });
      await page.setViewportSize({ width: 390, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.screenshot({
        path: resolve(evidence, `${language}-family-390.png`),
        fullPage: true,
      });
    }
    await page.locator('header .settings-trigger').click();
    await page.getByRole('button', { name: 'ARCANA', exact: true }).click();
    await page.locator('dialog.game-settings .settings-close').click();
    await expect(page.locator('[data-character="apprentice"] figcaption')).not.toHaveText(
      'Harry Potter',
    );
    await expect
      .poll(() =>
        images.evaluateAll((nodes) =>
          nodes.every(
            (node) =>
              (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0,
          ),
        ),
      )
      .toBe(true);
    expect(await images.first().getAttribute('src')).not.toContain('/character-illustrated-v2/');
    if (language === 'es' && info.project.name === 'chromium-art') {
      // Production component over explicitly labelled visual receipts, not granted copies.
      for (const character of ['merlin', 'morgana', 'night-forger']) {
        await page.goto(`/tests/arcana-art-harness.html?reveal=${character}`);
        await expect(page.locator('dialog.reveal')).toHaveAttribute('data-opening-state', 'result');
        await expect
          .poll(() =>
            page
              .locator('.opening-portrait')
              .evaluate((node) => (node as HTMLImageElement).naturalWidth),
          )
          .toBe(512);
        for (const viewport of [
          { width: 1280, height: 900 },
          { width: 390, height: 844 },
        ]) {
          await page.setViewportSize(viewport);
          await page.screenshot({
            path: resolve(evidence, `es-frame-${character}-${viewport.width}.png`),
          });
        }
      }
    }
    expect(errors).toEqual([]);
  });
}
