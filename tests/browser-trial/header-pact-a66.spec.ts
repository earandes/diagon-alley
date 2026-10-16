import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { changeLanguage, startExpedition } from './game-fixture';
import { readGame } from './route-helpers';
const evidence = resolve('docs/arcana/header-pact-2026-10-16/evidence/after');
const sizes = [
  { width: 1280, height: 900 },
  { width: 865, height: 1079 },
  { width: 390, height: 844 },
];
for (const language of ['es', 'en'] as const)
  for (const pack of ['diagon-alley', 'arcana'] as const) {
    test(`A66 single header and framed pact ${language} ${pack}`, async ({ page }) => {
      await mkdir(evidence, { recursive: true });
      await page.emulateMedia({ reducedMotion: pack === 'arcana' ? 'reduce' : 'no-preference' });
      await page.addInitScript(
        (pack) => localStorage.setItem('arcana.presentation.content-pack.v1', pack),
        pack,
      );
      await page.goto('/');
      if (language === 'en') await changeLanguage(page, language);
      await page.locator('.portal-enter').click();
      await startExpedition(page, language);
      const initial = await readGame(page);
      const origin = page.locator('.map-node > button:enabled').first();
      const header = page.locator('.game-header');
      const name = await header.locator('h1').innerText();
      expect(name).toBeTruthy();
      await expect(page.locator('.expedition-heading h2')).toHaveCount(0);
      await expect(header.locator('.settings-trigger')).toBeVisible();
      for (const size of sizes) {
        await page.setViewportSize(size);
        await page.screenshot({
          path: resolve(
            evidence,
            `${test.info().project.name}-${pack}-${language}-map-${size.width}.png`,
          ),
        });
      }
      await origin.click();
      await expect(header.locator('.settings-trigger')).toBeHidden();
      const dialog = page.locator('.node-event-dialog');
      await expect(dialog.locator('.settings-trigger')).toBeVisible();
      await expect(dialog.locator('.tactical-pact-pass')).toHaveCount(0);
      await expect(dialog.locator('.node-confirm-action')).toBeDisabled();
      const candidate = dialog.locator('[data-pact-candidate]').first();
      await candidate.focus();
      await page.keyboard.press('Enter');
      await expect(candidate).toHaveAttribute('aria-pressed', 'true');
      await expect(dialog.locator('.node-confirm-action')).toBeEnabled();
      for (const size of sizes) {
        await page.setViewportSize(size);
        const geometry = await dialog.evaluate((e) => ({
          height: e.clientHeight,
          scroll: e.scrollHeight,
          width: e.clientWidth,
          scrollWidth: e.scrollWidth,
        }));
        expect(geometry.scroll).toBeLessThanOrEqual(geometry.height + 1);
        expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.width + 1);
        const fits = await dialog
          .locator('.tactical-pact-portrait-image > img')
          .evaluateAll((images) =>
            images.every((image) => {
              const frame = image.parentElement!.getBoundingClientRect(),
                r = image.getBoundingClientRect();
              return (
                r.left >= frame.left - 1 &&
                r.right <= frame.right + 1 &&
                r.top >= frame.top - 1 &&
                r.bottom <= frame.bottom + 1
              );
            }),
          );
        expect(fits).toBe(true);
        await page.screenshot({
          path: resolve(
            evidence,
            `${test.info().project.name}-${pack}-${language}-pact-${size.width}.png`,
          ),
        });
      }
      const info = dialog.locator('.tactical-pact-inspector > summary').first();
      await info.focus();
      await page.keyboard.press('Enter');
      await expect(dialog.locator('.tactical-pact-inspector').first()).toHaveAttribute('open', '');
      expect(await readGame(page)).toEqual(initial);
      // Settings must remain operable inside the native modal and return focus there.
      await dialog.locator('.settings-trigger').click();
      await expect(page.locator('.game-settings[open]')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.settings-trigger')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(origin).toBeFocused();
      await expect(header.locator('.settings-trigger')).toBeVisible();
      expect(await readGame(page)).toEqual(initial);
    });
  }
