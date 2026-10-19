import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const base = process.env.A92_FIXTURE_URL ?? 'http://127.0.0.1:5621';
const fixture = `${base}/tests/browser-experience-clarity/map-preparation-a92.html`;
const evidence = resolve(
  process.env.A92_EVIDENCE_ROOT ?? 'docs/arcana/experience-clarity-2026-10-19/evidence/linux',
);
async function selected(page: import('@playwright/test').Page, name: string) {
  if (
    process.platform !== 'linux' ||
    process.env.ARCANA_CAPTURE_A92 !== '1' ||
    test.info().project.name !== 'chromium-390-a92'
  )
    return;
  await mkdir(evidence, { recursive: true });
  await page.screenshot({ path: resolve(evidence, `${name}.png`), fullPage: false });
}
for (const pack of ['diagon-alley', 'arcana'])
  for (const lang of ['es', 'en']) {
    test(`A92 ${pack}/${lang} public connections and read-only consultation`, async ({ page }) => {
      await page.goto(`${fixture}?pack=${pack}&lang=${lang}&mode=map`);
      const posts: string[] = [];
      page.on('request', (request) => {
        if (request.method() === 'POST') posts.push(request.url());
      });
      const edges = page.locator('[data-route-from]');
      const expected = await page.evaluate(() =>
        window.__a92MapPrep.graph.nodes.reduce((sum, node) => sum + node.next.length, 0),
      );
      await expect(edges).toHaveCount(expected);
      const locked = page
        .getByRole('button', { name: lang === 'es' ? /Bloqueado/ : /Locked/ })
        .first();
      await locked.focus();
      await expect(page.locator('[data-route-inspected="true"]').first()).toBeAttached();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog');
      await expect(dialog).toContainText(lang === 'es' ? 'Solo consulta' : 'Read only');
      await page.keyboard.press('Escape');
      await expect(locked).toBeFocused();
      expect(await page.evaluate(() => window.__a92MapPrep.read())).toBe(
        await page.evaluate(() => window.__a92MapPrep.before),
      );
      expect(await page.evaluate(() => window.__a92MapPrep.selected)).toBe('');
      expect(posts).toEqual([]);
      if (pack === 'diagon-alley' && lang === 'es') await selected(page, 'map-connections');
    });
    test(`A92 ${pack}/${lang} names, condition and preparation remain present`, async ({
      page,
    }) => {
      await page.goto(`${fixture}?pack=${pack}&lang=${lang}&mode=preparation&count=5`);
      const members = page.locator('[data-boss-member]');
      await expect(members).toHaveCount(5);
      await expect(
        page.getByText(lang === 'es' ? 'Vínculo' : 'Bond', { exact: true }).first(),
      ).toBeVisible();
      const geometry = await page.locator('.boss-party-name').evaluateAll((nodes) =>
        nodes.map((node) => {
          const element = node as HTMLElement;
          const range = document.createRange();
          range.selectNodeContents(element);
          const word =
            element.textContent?.split(/\s+/).sort((a, b) => b.length - a.length)[0] ?? '';
          const index = element.textContent?.indexOf(word) ?? 0;
          const text = element.firstChild!;
          range.setStart(text, index);
          range.setEnd(text, index + word.length);
          return {
            name: element.textContent,
            fragments: range.getClientRects().length,
            scrollWidth: element.scrollWidth,
            width: element.clientWidth,
            wrap: getComputedStyle(element).overflowWrap,
          };
        }),
      );
      expect(
        geometry.every((entry) => entry.fragments === 1 && entry.scrollWidth <= entry.width + 1),
      ).toBe(true);
      for (const member of await members.all()) await expect(member).toBeVisible();
      const measurements = {
        sha: process.env.GITHUB_SHA ?? null,
        pack,
        lang,
        viewport: test.info().project.use.viewport,
        physicalDevice: false,
        fixture: true,
        geometry,
      };
      await mkdir(evidence, { recursive: true });
      await writeFile(
        resolve(evidence, `${test.info().project.name}-${pack}-${lang}-names.json`),
        JSON.stringify(measurements, null, 2),
      );
      await members.first().focus();
      await page.keyboard.press('Enter');
      expect(await page.evaluate(() => window.__a92MapPrep.prepared)).toBe(1);
      expect(await page.evaluate(() => window.__a92MapPrep.read())).toBe(
        await page.evaluate(() => window.__a92MapPrep.before),
      );
      await expect(
        page.getByRole('button', { name: lang === 'es' ? 'Combatir · 5' : 'Battle · 5' }),
      ).toBeVisible();
      if (pack === 'diagon-alley' && lang === 'es') await selected(page, 'preparation-names');
    });
  }
