# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser-boss-style/boss-style-a71.spec.ts >> A71 staged real boss: consult prepare cancel confirm loot en arcana
- Location: tests/browser-boss-style/boss-style-a71.spec.ts:114:5

# Error details

```
Error: The resized map and every actor must fit without scrolling

Timeout 10000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to content" [ref=e4] [cursor=pointer]:
    - /url: "#content"
  - banner [ref=e5]:
    - heading "The Crooked Passage" [level=1] [ref=e6]
    - generic [ref=e7]:
      - status [ref=e8]
      - button "An enchanted night" [ref=e9] [cursor=pointer]
    - button "Settings" [ref=e12] [cursor=pointer]
  - status [ref=e15]: Node 4 resolved. The result is confirmed and saved.
  - generic [ref=e16]:
    - strong [ref=e17]:
      - generic "Crowns" [ref=e19]: "80"
    - generic [ref=e20]:
      - generic [ref=e21]:
        - generic [ref=e23]: Essence
        - text: 40 / 50
        - meter "Runic Essence" [ref=e24]
      - generic [ref=e25]: Next point at 07:35:17 AM.
      - button "Refresh Essence" [ref=e26] [cursor=pointer]
    - generic [ref=e29]:
      - strong [aria-hidden] [ref=e31]: "0"
      - generic [ref=e32]: 0 Gold Keys
  - main [active] [ref=e33]:
    - status [ref=e34]
    - generic [ref=e35]:
      - region [ref=e36]:
        - generic [ref=e37]:
          - heading "Expedition ended" [level=2] [ref=e39]
          - paragraph [ref=e40]: The Crooked Passage
          - generic "Earned treasure" [ref=e41]
          - button "Another expedition Choose your copies and equipment" [ref=e43] [cursor=pointer]:
            - generic [ref=e45]:
              - text: Another expedition
              - generic [ref=e46]: Choose your copies and equipment
            - generic [aria-hidden] [ref=e47]: →
        - group [ref=e48]:
          - generic "Your journey" [ref=e49] [cursor=pointer]
      - region "Your next intention" [ref=e52]:
        - heading "Your next intention" [level=3] [ref=e53]
        - generic [ref=e55]:
          - button "Choose Try a flavour" [ref=e56] [cursor=pointer]:
            - generic [ref=e58]: Try a flavour
          - group [ref=e59]:
            - generic "How to try it" [ref=e60] [cursor=pointer]
        - group [ref=e61]:
          - generic "Your next intention" [ref=e62] [cursor=pointer]: "?"
  - navigation "Main navigation" [ref=e63]:
    - button "Map" [ref=e64] [cursor=pointer]
    - button "Chromodex" [ref=e67] [cursor=pointer]
    - button "Bazaar" [ref=e70] [cursor=pointer]
    - button "Missions" [ref=e73] [cursor=pointer]
```

# Test source

```ts
  1  | import { leaveBattle } from './battle-controls';
  2  | import { preparedRoutePath } from '../support/prepared-route';
  3  | import { expect, type Page } from '@playwright/test';
  4  | import type { GameState } from '../../src/arcana/application/game';
  5  | import type { NodeKind } from '../../src/arcana/domain/exploration/route';
  6  | export const readGame = async (page: Page): Promise<GameState> =>
  7  |   (await (await page.request.get('/api/state')).json()).state;
  8  | /** ResizeObserver/React can settle a frame after WebKit reports a new viewport. */
  9  | export async function expectMapFits(page: Page) {
  10 |   await expect
  11 |     .poll(
  12 |       () =>
  13 |         page.locator('.map-scroll').evaluate((el) => {
  14 |           const host = el.getBoundingClientRect();
  15 |           return (
  16 |             document.documentElement.scrollWidth <= innerWidth + 1 &&
  17 |             document.documentElement.scrollHeight <= innerHeight + 1 &&
  18 |             el.scrollHeight <= el.clientHeight + 1 &&
  19 |             el.scrollWidth <= el.clientWidth + 1 &&
  20 |             [...el.querySelectorAll('.map-node > button')].every((node) => {
  21 |               const box = node.getBoundingClientRect();
  22 |               return (
  23 |                 box.left >= host.left - 1 &&
  24 |                 box.right <= host.right + 1 &&
  25 |                 box.top >= host.top - 1 &&
  26 |                 box.bottom <= host.bottom + 1
  27 |               );
  28 |             })
  29 |           );
  30 |         }),
  31 |       { message: 'The resized map and every actor must fit without scrolling' },
  32 |     )
> 33 |     .toBe(true);
     |      ^ Error: The resized map and every actor must fit without scrolling
  34 | }
  35 | export async function pathTo(page: Page, kind: NodeKind) {
  36 |   await expect(page.locator('dialog[open]')).toHaveCount(0);
  37 |   await expect(page.locator('[data-map-phase]')).toHaveAttribute('data-map-phase', 'route');
  38 |   const run = (await readGame(page)).exploration!.run!;
  39 |   return preparedRoutePath(run, kind);
  40 | }
  41 | export async function confirmEvent(page: Page, language: 'es' | 'en') {
  42 |   const directRecruit = page.locator('[data-pact-action="recruit"]');
  43 |   if (await directRecruit.count()) {
  44 |     await expect(directRecruit).toBeEnabled();
  45 |     await directRecruit.click();
  46 |   } else {
  47 |     const confirm = page.locator('.node-confirm-action');
  48 |     const encounterPass = page.locator('[data-encounter-offer] [data-encounter-choice="pass"]');
  49 |     if (await encounterPass.count()) await encounterPass.click();
  50 |     const candidate = page.locator('[data-pact-candidate]').first();
  51 |     if (await candidate.count()) {
  52 |       if (await candidate.isEnabled()) await candidate.click();
  53 |       else await page.locator('[data-pact-choice="pass"]').click();
  54 |       const replacement = page.locator('[data-tactical-pact] [data-visual-value]').first();
  55 |       if (!(await confirm.isEnabled()) && (await replacement.count())) await replacement.click();
  56 |     }
  57 |     const pass = page.locator('[data-preparation="pact"] [data-visual-value="pass"]');
  58 |     if ((await pass.count()) && (await pass.isEnabled()) && !(await confirm.isEnabled()))
  59 |       await pass.click();
  60 |     await confirm.click();
  61 |   }
  62 |   await expect(page.locator('dialog[open]')).toHaveCount(0);
  63 |   // The committed response can precede React's route effect; await its observable destination.
  64 |   const receipt = (await readGame(page)).receipts.at(-1);
  65 |   if (receipt?.kind === 'advance-node' && receipt.battle)
  66 |     await expect(
  67 |       page.getByRole('heading', {
  68 |         name: language === 'es' ? 'Arena de Combate' : 'Combat Arena',
  69 |         exact: true,
  70 |       }),
  71 |     ).toBeVisible();
  72 |   else await expect(page.locator('[data-map-phase]')).toHaveAttribute('data-map-phase', 'route');
  73 | }
  74 | export async function reachNode(page: Page, kind: NodeKind, language: 'es' | 'en') {
  75 |   const path = await pathTo(page, kind);
  76 |   for (const id of path.slice(0, -1)) {
  77 |     await page.locator(`[data-node="${id}"]`).click();
  78 |     await confirmEvent(page, language);
  79 |     if (await page.locator('.battle-panel').count()) await leaveBattle(page);
  80 |   }
  81 |   return path.at(-1)!;
  82 | }
  83 | 
```