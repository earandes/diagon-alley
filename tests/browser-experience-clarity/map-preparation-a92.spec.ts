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
    (test.info().project.name !== 'chromium-390-a92' &&
      !(test.info().project.name === 'chromium-865-a92' && name === 'preparation-names'))
  )
    return;
  await mkdir(evidence, { recursive: true });
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => {})),
    );
  });
  await page.screenshot({
    path: resolve(evidence, `${test.info().project.name}-${name}.png`),
    fullPage: false,
  });
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
      await expect(page.locator('[data-boss-party] .team-bond-caption')).toBeVisible();
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
      expect(
        geometry.every((entry) => entry.fragments === 1 && entry.scrollWidth <= entry.width + 1),
      ).toBe(true);
      await members.first().focus();
      await page.keyboard.press('Enter');
      expect(await page.evaluate(() => window.__a92MapPrep.prepared)).toBe(1);
      expect(await page.evaluate(() => window.__a92MapPrep.read())).toBe(
        await page.evaluate(() => window.__a92MapPrep.before),
      );
      await expect(
        page.getByRole('button', { name: lang === 'es' ? 'Combatir · 5' : 'Battle · 5' }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: lang === 'es' ? 'Combatir · 5' : 'Battle · 5' }),
      ).toBeInViewport();
      if (pack === 'diagon-alley' && lang === 'es') await selected(page, 'preparation-names');
    });
    test(`A92 ${pack}/${lang} four and five posts keep real loot and preparation above the footer`, async ({
      page,
    }, info) => {
      test.skip(
        info.project.name !== 'chromium-390-a92',
        'Bounded mobile regression of the demonstrated overlap.',
      );
      for (const count of [4, 5]) {
        await page.goto(
          `${fixture}?pack=${pack}&lang=${lang}&mode=preparation&count=${count}&full=1`,
        );
        const dialog = page.locator('.node-event-dialog');
        await expect(page.locator('[data-boss-member]')).toHaveCount(count);
        await expect(page.locator('.event-loot')).toBeVisible();
        await expect(page.locator('.node-bean-preparation > summary')).toHaveAttribute(
          'data-bean-stock',
          '1',
        );
        expect(await dialog.evaluate((element) => element.scrollTop)).toBe(0);
        for (const selector of ['.node-team-prepare', '.node-bean-preparation > summary']) {
          await expect(page.locator(selector)).toBeInViewport({ ratio: 1 });
        }
        const geometry = await dialog.evaluate((element) => {
          const footer = element.querySelector('.node-combat-actions')!.getBoundingClientRect();
          return ['.node-team-prepare', '.node-bean-preparation > summary'].map((selector) => {
            const box = element.querySelector(selector)!.getBoundingClientRect();
            return {
              selector,
              bottom: box.bottom,
              footerTop: footer.top,
              gap: footer.top - box.bottom,
            };
          });
        });
        await mkdir(evidence, { recursive: true });
        await writeFile(
          resolve(evidence, `${info.project.name}-${pack}-${lang}-full-${count}.json`),
          JSON.stringify(
            {
              sha: process.env.GITHUB_SHA ?? null,
              fixture: true,
              count,
              lang,
              pack,
              coordinateSample: 'single synchronous layout read; no animation wait',
              geometry,
            },
            null,
            2,
          ),
        );
        if (pack === 'diagon-alley' && lang === 'es')
          await selected(page, `full-preparation-${count}`);
        for (const box of geometry) {
          expect(
            box.bottom,
            `${box.selector}, ${count} members, ${pack}/${lang}`,
          ).toBeLessThanOrEqual(box.footerTop);
        }
        await page.locator('.node-bean-preparation > summary').click();
        await expect(page.locator('.node-bean-preparation')).toHaveAttribute('open', '');
        await page.locator('.node-bean-preparation > summary').click();
        await expect(page.locator('.node-bean-preparation')).not.toHaveAttribute('open', '');
        expect(await page.evaluate(() => window.__a92MapPrep.read())).toBe(
          await page.evaluate(() => window.__a92MapPrep.before),
        );
      }
      const portraitUrls = await page
        .locator('[data-boss-party] img[data-art$=".portrait"]')
        .evaluateAll((images) => images.map((image) => (image as HTMLImageElement).src));
      expect(portraitUrls).toHaveLength(5);
      await page.route('**/*', (route) =>
        portraitUrls.includes(route.request().url()) ? route.abort() : route.continue(),
      );
      await page.reload();
      await expect(page.locator('[data-boss-party] img[data-art$=".portrait"]')).toHaveCount(0);
      await expect(page.locator('[data-boss-party] .boss-party-origin')).toHaveCount(5);
      const fallbackFrames = await page.locator('.boss-party-portrait').evaluateAll((frames) =>
        frames.map((frame) => {
          const box = frame.getBoundingClientRect();
          const marker = frame.querySelector('.boss-party-origin')!.getBoundingClientRect();
          return {
            height: box.height,
            markerContained:
              marker.top >= box.top &&
              marker.bottom <= box.bottom &&
              marker.left >= box.left &&
              marker.right <= box.right,
          };
        }),
      );
      expect(fallbackFrames.every((frame) => frame.height >= 60 && frame.markerContained)).toBe(
        true,
      );
      await expect(page.locator('.boss-party-name')).toHaveCount(5);
      expect(await page.evaluate(() => window.__a92MapPrep.read())).toBe(
        await page.evaluate(() => window.__a92MapPrep.before),
      );
    });
    test(`A92 ${pack}/${lang} preparation reflows at 320px with enlarged text`, async ({
      page,
    }, info) => {
      test.skip(
        info.project.name !== 'chromium-390-a92',
        'One bounded reflow sample per language/pack.',
      );
      await page.setViewportSize({ width: 320, height: 844 });
      await page.goto(`${fixture}?pack=${pack}&lang=${lang}&mode=preparation&count=5&large=1`);
      await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        .toBe(true);
      const names = page.locator('.boss-party-name');
      await expect(names).toHaveCount(5);
      expect(
        await names.evaluateAll((elements) =>
          elements.every((element) => element.scrollWidth <= element.clientWidth + 1),
        ),
      ).toBe(true);
      for (const member of await page.locator('[data-boss-member]').all()) {
        await member.focus();
        await expect(member).toBeFocused();
        await expect(member).toBeInViewport();
      }
      const confirm = page.getByRole('button', {
        name: lang === 'es' ? 'Combatir · 5' : 'Battle · 5',
      });
      await confirm.focus();
      await expect(confirm).toBeInViewport();
      expect(await page.evaluate(() => window.__a92MapPrep.read())).toBe(
        await page.evaluate(() => window.__a92MapPrep.before),
      );
    });
  }
