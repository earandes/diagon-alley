import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { startExpedition, changeLanguage } from './game-fixture';
import { readGame } from './route-helpers';
for (const language of ['es', 'en'] as const)
  test(`A65 ${language} missing character art and renderer retain keyboard choice and reduced motion`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route('**/*.webp', (route) => route.abort());
    await page.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        type: string,
        ...args: unknown[]
      ) {
        if (type.includes('webgl')) return null;
        return Reflect.apply(getContext, this, [type, ...args]);
      } as typeof getContext;
    });
    await page.goto('/');
    if (language === 'en') await changeLanguage(page, language);
    await page.locator('.portal-enter').click();
    await startExpedition(page, language);
    const before = await readGame(page),
      id = before.exploration!.run!.graph.nodes.find((n) => n.row === 0)!.id;
    await page.locator(`[data-node="${id}"]`).focus();
    await page.keyboard.press('Enter');
    const candidate = page.locator('[data-pact-candidate]').first();
    await expect(candidate).toBeVisible();
    await expect(candidate).toBeFocused();
    await expect(page.locator('[data-pact-candidate]')).toHaveCount(2);
    await candidate.focus();
    await page.keyboard.press('Enter');
    await expect(candidate).toHaveAttribute('aria-pressed', 'true');
    expect(await readGame(page)).toEqual(before);
    await expect(candidate).toHaveCSS('transform', 'none');
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
    await page.locator('.tactical-pact-inspector > summary').first().click();
    await mkdir('docs/arcana/tactical-increment-2026-10-16/evidence/adverse', { recursive: true });
    await page.screenshot({
      path: `docs/arcana/tactical-increment-2026-10-16/evidence/adverse/${language}-missing-renderer-art-200.png`,
      fullPage: true,
    });
    await page.locator('.node-confirm-action').click();
    await expect(page.locator('.node-event-dialog[open]')).toHaveCount(0);
    const committed = await readGame(page);
    expect(committed.exploration!.run!.members).toHaveLength(2);
    expect(committed.inventory).toEqual(before.inventory);
    expect(committed.copies).toEqual(before.copies);
    await page.reload();
    await expect(page.locator('.branch-map')).toBeVisible();
    expect(await readGame(page)).toEqual(committed);
  });
