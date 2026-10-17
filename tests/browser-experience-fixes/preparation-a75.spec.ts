import { selectedA75 } from './selected-evidence';
import { test, expect, type Page } from '@playwright/test';

// Component fixtures test interaction, never server persistence or human understanding.
const fixture = `${process.env.A75_FIXTURE_URL ?? 'http://127.0.0.1:5521'}/tests/browser-experience-fixes/preparation-a75.html`;
async function source(page: Page) {
  return page.evaluate(() =>
    (window as unknown as { __a75Preparation: { source(): string } }).__a75Preparation.source(),
  );
}
for (const language of ['es', 'en'] as const) {
  for (const pack of ['diagon-alley', 'arcana'] as const) {
    test(`A75 thirty copies preserve instance draft through filters and presentation changes ${language}/${pack}`, async ({
      page,
    }) => {
      await page.goto(`${fixture}?lang=${language}&pack=${pack}`);
      const before = await source(page);
      const filters = page.locator('.preparation-filters');
      await filters.locator(':scope > summary').click();
      await page.locator('.preparation-identity-filters > summary').click();
      await page.locator('[data-preparation-identity]').first().click();
      // Two identical owned portraits remain separate, with distinct equipment and ordinal.
      await expect(page.locator('[data-copy-id="a75-copy-0"]')).toBeVisible();
      await expect(page.locator('[data-copy-id="a75-copy-6"]')).toBeVisible();
      if (language === 'es' && pack === 'diagon-alley')
        await selectedA75(page, 'preparation-filter');
      for (const [copyId, expectedArt, absentArt] of [
        ['a75-copy-0', 'product.wand-birch', 'product.broom-cadet-zephyr'],
        ['a75-copy-6', 'product.broom-cadet-zephyr', 'product.wand-birch'],
      ]) {
        const trigger = page.locator(`[data-preparation-inspect="${copyId}"]`);
        await trigger.click();
        await expect(
          page.locator(
            `.preparation-inspection .preparation-gear-slots [data-art="${expectedArt}"]`,
          ),
        ).toBeVisible();
        await expect(
          page.locator(`.preparation-inspection .preparation-gear-slots [data-art="${absentArt}"]`),
        ).toHaveCount(0);
        await page.locator('.preparation-inspection-close').click();
        await expect(trigger).toBeFocused();
      }
      await page.locator('[data-copy-id="a75-copy-6"]').click();
      await page.locator('[data-copy-id="a75-copy-12"]').click();
      await expect(page.locator('[data-copy-id="a75-copy-12"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await page.getByRole('button', { name: 'QA language', exact: true }).click();
      await page.getByRole('button', { name: 'QA pack', exact: true }).click();
      await expect(page.locator('[data-copy-id="a75-copy-12"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      // An incompatible combination is honest, removable, and cannot clear the formation draft.
      await page.locator('[data-preparation-affinity="fire"]').click();
      await expect(page.locator('.preparation-filter-empty')).toBeVisible();
      await page.locator('.preparation-filter-empty button').click();
      await expect(page.locator('.preparation-filter-empty')).toHaveCount(0);
      await expect(page.locator('[data-copy-id]')).toHaveCount(6);
      await page.locator('[data-preparation-confirm]').click();
      await expect(page.locator('[data-fixture-confirmed]')).toHaveText('a75-copy-0,a75-copy-12');
      expect(await source(page)).toBe(before);
    });
    test(`A75 snapshot bean weights and assignment identity ${language}/${pack}`, async ({
      page,
    }) => {
      await page.goto(`${fixture}?view=beans&lang=${language}&pack=${pack}`);
      const before = await source(page);
      await page.locator('.preparation-synergies > summary').click();
      await expect(page.locator('[data-synergy-value="11"]')).toContainText('11');
      await page.locator('.bean-context-help > summary').click();
      const rows = page.locator('.bean-context-help > p');
      await expect(
        rows.filter({ has: page.locator('[data-art="product.bean-mint"]') }),
      ).toContainText('25');
      await expect(
        rows.filter({ has: page.locator('[data-art="product.bean-pepper"]') }),
      ).toContainText('75');
      await expect(page.locator('[data-art="product.bean-earth"]')).toHaveCount(0);
      await page.locator('[data-bean-unit="a75-copy-6"]').click();
      await expect(page.locator('[data-bean-unit="a75-copy-6"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await page.locator('[data-bean-unit="a75-pact-copy"]').click();
      await expect(page.locator('[data-bean-unit="a75-copy-6"]')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      await expect(page.locator('[data-bean-unit="a75-pact-copy"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await page.locator('[data-bean-unit="a75-pact-copy"]').click();
      await expect(page.locator('[data-bean-unit="a75-pact-copy"]')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(await source(page)).toBe(before);
    });
    test(`A75 zero and multiple jars distinguish stock from local draft ${language}/${pack}`, async ({
      page,
    }, info) => {
      test.skip(
        info.project.use.browserName !== 'chromium' || info.project.use.viewport?.width !== 390,
        'Bounded component coverage in Chromium 390; the real authority journey covers stock one.',
      );
      await page.goto(`${fixture}?view=supplies&empty&lang=${language}&pack=${pack}`);
      const emptySource = await source(page);
      const summary = page.locator('.boss-supplies > summary');
      await expect(summary).toHaveAttribute('data-bean-stock', '0');
      await expect(summary).toHaveAttribute('data-bean-draft', '0');
      await summary.click();
      await expect(page.locator('[data-bean-id]')).toHaveCount(0);
      await expect(page.locator('[data-bean-unit]')).toHaveCount(0);
      expect(await source(page)).toBe(emptySource);
      await page.goto(`${fixture}?view=supplies&lang=${language}&pack=${pack}`);
      const stockedSource = await source(page);
      await expect(summary).toHaveAttribute('data-bean-stock', '3');
      await expect(summary).toHaveAttribute('data-bean-draft', '0');
      await expect(summary).not.toContainText('/');
      await summary.click();
      await page.locator('[data-bean-id="a75-jar-0"]').click();
      await page.locator('[data-bean-unit="a75-copy-0"]').click();
      await page.locator('[data-bean-id="a75-jar-1"]').click();
      await page.locator('[data-bean-unit="a75-pact-copy"]').click();
      await expect(summary).toHaveAttribute('data-bean-draft', '2');
      await expect(summary).toHaveAttribute('data-bean-stock', '3');
      // A recipient has one slot: moving jar 1 onto the owned copy explicitly replaces jar 0.
      await page.locator('[data-bean-unit="a75-copy-0"]').click();
      await expect(summary).toHaveAttribute('data-bean-draft', '1');
      await expect(page.locator('[data-bean-unit="a75-pact-copy"]')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      await page.locator('[data-bean-unit="a75-copy-0"]').click();
      await expect(summary).toHaveAttribute('data-bean-draft', '0');
      await page.locator('[data-bean-unit="a75-pact-copy"]').click();
      await expect(summary).toHaveAttribute('data-bean-draft', '1');
      // QA parent drops the draft, mirroring cancellation; real node cancellation is tested by supplies-a75.
      await page.getByRole('button', { name: 'QA cancel draft', exact: true }).click();
      await expect(summary).toHaveAttribute('data-bean-draft', '0');
      await expect(summary).toHaveAttribute('data-bean-stock', '3');
      expect(await source(page)).toBe(stockedSource);
    });
    test(`A75 encounter identical copies have distinct labels and consequences ${language}/${pack}`, async ({
      page,
    }) => {
      await page.goto(`${fixture}?view=encounter&lang=${language}&pack=${pack}`);
      const before = await source(page);
      await page.locator('[data-encounter-choice="a75-single"]').click();
      const labels = await page
        .locator('[data-encounter-unit]')
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('aria-label')));
      expect(new Set(labels).size).toBe(3);
      await page.locator('[data-encounter-unit="a75-pact-copy"]').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('[data-encounter-unit="a75-pact-copy"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(page.locator('[data-encounter-preview-unit="a75-pact-copy"]')).toBeVisible();
      await expect(page.locator('[data-encounter-preview-unit="a75-pact-copy"]')).toContainText(
        language === 'es' ? 'Puesto 3' : 'Position 3',
      );
      await expect(page.locator('[data-encounter-preview-unit]')).toHaveCount(1);
      if (language === 'en' && pack === 'arcana') await selectedA75(page, 'encounter-instance');
      await page.locator('[data-encounter-choice="pass"]').click();
      await expect(page.locator('[data-encounter-preview-unit]')).toHaveCount(0);
      expect(await source(page)).toBe(before);
    });
  }
}
