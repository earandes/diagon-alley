# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser-fluency/expedition-a73.spec.ts >> A73 complete authoritative expedition fluency en diagon-alley
- Location: tests/browser-fluency/expedition-a73.spec.ts:149:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-expedition-closure="won"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('[data-expedition-closure="won"]') with timeout 10000ms
  - waiting for locator('[data-expedition-closure="won"]')

```

```yaml
- link "Skip to content":
  - /url: "#content"
- banner:
  - heading "Diagon Alley" [level=1]
  - status
  - button "An enchanted night"
  - button "Settings"
- status: Node 6 resolved. The result is confirmed and saved.
- strong: "110"
- text: Energy 30 / 50
- meter "Magic energy"
- text: Next point at 11:41:30 AM.
- button "Refresh Energy"
- text: 0 Gold Keys
- main:
  - status
  - region "Expedition ended":
    - heading "Expedition ended" [level=2]
    - paragraph: Diagon Alley
    - paragraph: Last duel · Hermione Granger
    - button "Another expedition Choose your copies and equipment"
    - group: Your journey
  - region "Your next intention":
    - heading "Your next intention" [level=3]
    - button "Choose Try a flavour": Try a flavour
    - group: How to try it
    - group: "?"
- navigation "Main navigation":
  - button "Map"
  - button "Card Album"
  - button "Diagon Alley"
  - button "Missions"
```

# Test source

```ts
  1   | import { expect, test, type Locator, type Page } from '@playwright/test';
  2   | import { mkdir, writeFile } from 'node:fs/promises';
  3   | import { resolve } from 'node:path';
  4   | import { changeLanguage } from '../browser-trial/game-fixture';
  5   | import { expectMapFits, readGame, reachNode } from '../browser-trial/route-helpers';
  6   | 
  7   | // Reuse the guarded A70 Linux process, not another browser/server battery. Four
  8   | // desktop Chromium accounts leave A71's 24-account namespace below its real quota.
  9   | test.use({ baseURL: 'http://127.0.0.1:5472' });
  10  | const evidence = resolve('docs/arcana/boss-increment-2026-10-16/evidence/linux/a73');
  11  | type Language = 'es' | 'en';
  12  | type Step = {
  13  |   name: string;
  14  |   clickAt: number;
  15  |   usableAt: number;
  16  |   actionToUsableUpperBoundMs: number;
  17  |   responseObservedAt?: number;
  18  |   actionToResponseObservedUpperBoundMs?: number;
  19  |   resourceResponseEnd?: number;
  20  |   actionToResponseEndMs?: number;
  21  |   figuresAt?: number;
  22  |   actionToFiguresUpperBoundMs?: number;
  23  |   choreographyAt?: number;
  24  |   actionToChoreographyUpperBoundMs?: number;
  25  | };
  26  | declare global {
  27  |   interface Window {
  28  |     __a73Action: { clickAt: number; dispose: () => void };
  29  |   }
  30  | }
  31  | const word = (language: Language, es: string, en: string) => (language === 'es' ? es : en);
  32  | const now = (page: Page) => page.evaluate(() => performance.now());
  33  | 
  34  | /** The capture listener stamps the dispatched user click, after actionability.
  35  |  * Polling/automation completion is explicitly an upper bound, not renderer CPU. */
  36  | async function action(
  37  |   page: Page,
  38  |   name: string,
  39  |   trigger: Locator,
  40  |   usable: Locator,
  41  |   postPath?: string,
  42  | ): Promise<Step> {
  43  |   await expect(trigger).toBeEnabled();
  44  |   await page.evaluate(() => {
  45  |     const stamp = () => {
  46  |       window.__a73Action.clickAt = performance.now();
  47  |     };
  48  |     window.__a73Action = {
  49  |       clickAt: 0,
  50  |       dispose: () => document.removeEventListener('click', stamp, true),
  51  |     };
  52  |     document.addEventListener('click', stamp, { once: true, capture: true });
  53  |   });
  54  |   const response = postPath
  55  |     ? page.waitForResponse(
  56  |         (reply) =>
  57  |           new URL(reply.url()).pathname === postPath && reply.request().method() === 'POST',
  58  |       )
  59  |     : undefined;
  60  |   let responseObservedAt: number | undefined;
  61  |   try {
  62  |     await trigger.click();
  63  |     if (response) {
  64  |       const reply = await response;
  65  |       expect(reply.ok(), `${name}: authority operation must succeed`).toBe(true);
  66  |       await reply.finished();
  67  |       responseObservedAt = await now(page);
  68  |     }
> 69  |     await expect(usable).toBeVisible();
      |                          ^ Error: expect(locator).toBeVisible() failed
  70  |     const usableAt = await now(page);
  71  |     const clickAt = await page.evaluate(() => window.__a73Action.clickAt);
  72  |     expect(clickAt).toBeGreaterThan(0);
  73  |     const resourceResponseEnd = postPath
  74  |       ? await page.evaluate(
  75  |           ({ path, start }) => {
  76  |             const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  77  |             return entries
  78  |               .filter((entry) => new URL(entry.name).pathname === path && entry.startTime >= start)
  79  |               .at(-1)?.responseEnd;
  80  |           },
  81  |           { path: postPath, start: clickAt },
  82  |         )
  83  |       : undefined;
  84  |     return {
  85  |       name,
  86  |       clickAt,
  87  |       usableAt,
  88  |       actionToUsableUpperBoundMs: usableAt - clickAt,
  89  |       ...(responseObservedAt === undefined
  90  |         ? {}
  91  |         : {
  92  |             responseObservedAt,
  93  |             actionToResponseObservedUpperBoundMs: responseObservedAt - clickAt,
  94  |           }),
  95  |       ...(resourceResponseEnd === undefined
  96  |         ? {}
  97  |         : {
  98  |             resourceResponseEnd,
  99  |             actionToResponseEndMs: resourceResponseEnd - clickAt,
  100 |           }),
  101 |     };
  102 |   } finally {
  103 |     await page.evaluate(() => window.__a73Action.dispose());
  104 |   }
  105 | }
  106 | 
  107 | async function figures(page: Page, step: Step, count: number) {
  108 |   await expect(page.locator('.pedestal')).toHaveCount(count);
  109 |   await expect(page.locator('.scene-canvas')).toHaveAttribute('data-art-ready', 'true');
  110 |   step.figuresAt = await now(page);
  111 |   step.actionToFiguresUpperBoundMs = step.figuresAt - step.clickAt;
  112 |   // Every unit/name/PV remains usable. Existing A70/A71 cover the full viewport matrix.
  113 |   for (const selector of ['.arena-figure-space', '.arena-inspect > strong', '.arena-health']) {
  114 |     const items = page.locator(selector);
  115 |     await expect(items).toHaveCount(count);
  116 |     for (const item of await items.all()) await expect(item).toBeInViewport({ ratio: 1 });
  117 |   }
  118 | }
  119 | async function omit(page: Page, language: Language, steps: Step[]) {
  120 |   const skip = page.getByRole('button', {
  121 |     name: word(language, 'Omitir reproducción', 'Skip playback'),
  122 |     exact: true,
  123 |   });
  124 |   if (await skip.isEnabled())
  125 |     steps.push(
  126 |       await action(page, 'omit-confirmed-replay', skip, page.locator('[data-arena-outcome]')),
  127 |     );
  128 |   else await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  129 | }
  130 | async function enterMap(page: Page, language: Language, name: string) {
  131 |   const preparation = page.locator('[data-expedition-preparation="new"]');
  132 |   await expect(preparation).toBeVisible();
  133 |   const first = preparation.locator('.preparation-card').first();
  134 |   if ((await first.getAttribute('aria-pressed')) !== 'true') await first.click();
  135 |   return action(
  136 |     page,
  137 |     name,
  138 |     preparation.getByRole('button', {
  139 |       name: word(language, 'Entrar al mapa', 'Enter the map'),
  140 |       exact: true,
  141 |     }),
  142 |     page.locator('.branch-map'),
  143 |     '/api/runs',
  144 |   );
  145 | }
  146 | 
  147 | for (const language of ['es', 'en'] as const)
  148 |   for (const pack of ['diagon-alley', 'arcana'] as const)
  149 |     test(`A73 complete authoritative expedition fluency ${language} ${pack}`, async ({ page }) => {
  150 |       test.skip(
  151 |         test.info().project.use.browserName !== 'chromium' ||
  152 |           test.info().project.use.viewport?.width !== 1280,
  153 |         'Bounded full-route measurement: four desktop Chromium accounts; A70/A71 retain other engines/viewports.',
  154 |       );
  155 |       const steps: Step[] = [];
  156 |       const errors: string[] = [];
  157 |       page.on('pageerror', (error) => errors.push(error.message));
  158 |       await page.addInitScript((skin) => {
  159 |         localStorage.setItem('arcana.presentation.content-pack.v1', skin);
  160 |       }, pack);
  161 |       await page.goto('/');
  162 |       await expect(page.locator('.portal-enter')).toBeEnabled();
  163 |       const entryUsableFromNavigationMs = await now(page);
  164 |       if (language === 'en') await changeLanguage(page, language);
  165 |       steps.push(
  166 |         await action(
  167 |           page,
  168 |           'entry-to-preparation',
  169 |           page.locator('.portal-enter'),
```