# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser-boss-style/boss-style-a71.spec.ts >> A71 staged real boss: consult prepare cancel confirm loot en diagon-alley
- Location: tests/browser-boss-style/boss-style-a71.spec.ts:108:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-expedition-preparation="new"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('[data-expedition-preparation="new"]') with timeout 10000ms
  - waiting for locator('[data-expedition-preparation="new"]')

```

```yaml
- link "Skip to content":
  - /url: "#content"
- banner:
  - heading "DIAGON ALLEY" [level=1]
  - button "Settings"
- status
- main:
  - heading "The Diagon Alley" [level=2]
  - text: An apprentice, a wand and a path to discover. Explore, assemble your team and complete the Card Album.
  - paragraph: The trial session stays in this browser for seven days. Account recovery and cross-device sync are unavailable.
  - button "Start local trial": Enter
  - alert: The trial could not start. Check that the local server is available and try again.
```

# Test source

```ts
  1  | import { expect, test as base, type Page } from '@playwright/test';
  2  |
  3  | /** Historical journeys retain their original content assertions after the new default skin. */
  4  | export const test = base.extend({
  5  |   page: async ({ page }, use) => {
  6  |     const preferredPack =
  7  |       process.env.ARCANA_TEST_CONTENT_PACK === 'diagon-alley' ? 'diagon-alley' : 'arcana';
  8  |     await page.addInitScript((pack) => {
  9  |       try {
  10 |         const key = 'arcana.presentation.content-pack.v1';
  11 |         if (!localStorage.getItem(key)) localStorage.setItem(key, pack);
  12 |       } catch {
  13 |         /* Preferences can be unavailable before an origin is established. */
  14 |       }
  15 |     }, preferredPack);
  16 |     await use(page);
  17 |   },
  18 | });
  19 | export { expect };
  20 | export type { Page } from '@playwright/test';
  21 |
  22 | /** Exercise A59's explicit owned-copy choice; no auto-selection in production or API seeding. */
  23 | export async function startExpedition(page: Page, language: 'es' | 'en' = 'es') {
  24 |   const preparation = page.locator('[data-expedition-preparation="new"]');
> 25 |   await expect(preparation).toBeVisible();
     |                             ^ Error: expect(locator).toBeVisible() failed
  26 |   const first = preparation.locator('.preparation-card').first();
  27 |   await expect(first).toBeVisible();
  28 |   if ((await first.getAttribute('aria-pressed')) !== 'true') await first.click();
  29 |   const confirm = preparation.getByRole('button', {
  30 |     name: language === 'es' ? 'Entrar al mapa' : 'Enter the map',
  31 |     exact: true,
  32 |   });
  33 |   await expect(confirm).toBeEnabled();
  34 |   await confirm.click();
  35 |   await expect(page.locator('.branch-map')).toBeVisible();
  36 | }
  37 |
  38 | /** Exercise the actual settings UI, including inside a node/commerce confirmation. */
  39 | export async function changeLanguage(page: Page, language: 'es' | 'en') {
  40 |   const activeDialog = page.locator('dialog[open]').last();
  41 |   const reveal = page.locator('.reveal');
  42 |   const revealSettings = reveal.getByRole('button', { name: /^(Ajustes|Settings)$/, exact: true });
  43 |   const origin = (await activeDialog.count())
  44 |     ? activeDialog
  45 |     : (await revealSettings.count())
  46 |       ? reveal
  47 |       : page.locator('header');
  48 |   await origin.getByRole('button', { name: /^(Ajustes|Settings)$/, exact: true }).click();
  49 |   const settings = page.locator('dialog.game-settings[open]');
  50 |   await expect(settings).toBeVisible();
  51 |   await settings
  52 |     .getByRole('button', { name: language === 'es' ? 'Español' : 'English', exact: true })
  53 |     .click();
  54 |   await expect(page.locator('html')).toHaveAttribute('lang', language);
  55 |   await settings
  56 |     .getByRole('button', { name: language === 'es' ? 'Cerrar' : 'Close', exact: true })
  57 |     .click();
  58 |   await expect(settings).toHaveCount(0);
  59 | }
  60 |
  61 | export async function openAlbumFilters(page: Page) {
  62 |   const drawer = page.locator('.album-filter-drawer');
  63 |   if ((await drawer.getAttribute('open')) === null)
  64 |     await drawer.locator(':scope > summary').click();
  65 |   await expect(drawer).toHaveAttribute('open', '');
  66 | }
  67 |
  68 | /** A60 card inspection is an explicit secondary action, independent of roster selection. */
  69 | export async function inspectPreparationCopy(page: Page, index = 0) {
  70 |   const preparation = page.locator('.preparation-dialog');
  71 |   await expect(preparation).toBeVisible();
  72 |   await preparation.locator('[data-preparation-inspect]').nth(index).click();
  73 |   await expect(page.locator('.preparation-inspection[open]')).toBeVisible();
  74 | }
  75 | export async function closePreparation(page: Page) {
  76 |   if (await page.locator('.preparation-inspection[open]').count())
  77 |     await page.keyboard.press('Escape');
  78 |   if (await page.locator('.preparation-dialog[open]').count()) await page.keyboard.press('Escape');
  79 |   await expect(page.locator('dialog[open]')).toHaveCount(0);
  80 | }
  81 |
```
