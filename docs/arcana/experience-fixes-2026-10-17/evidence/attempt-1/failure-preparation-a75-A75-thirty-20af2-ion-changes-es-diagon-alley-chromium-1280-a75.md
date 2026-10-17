# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: preparation-a75.spec.ts >> A75 thirty copies preserve instance draft through filters and presentation changes es/diagon-alley
- Location: tests/browser-experience-fixes/preparation-a75.spec.ts:13:5

# Error details

```
TimeoutError: locator.click: Timeout 12000ms exceeded.
Call log:
  - waiting for locator('.preparation-filters').locator(':scope > summary')
    - locator resolved to <summary>Buscar compañero</summary>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <output data-fixture-confirmed="true"></output> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <output data-fixture-confirmed="true"></output> intercepts pointer events
    - retrying click action
      - waiting 100ms
    23 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <output data-fixture-confirmed="true"></output> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation "QA fixture controls" [ref=e4]:
    - button "QA language" [ref=e5] [cursor=pointer]
    - button "QA pack" [ref=e6] [cursor=pointer]
  - region "Prepara tu expedición" [ref=e7]:
    - heading "Prepara tu expedición" [level=2] [ref=e9]
    - generic "3/5 acompañantes" [ref=e10]:
      - button "Consultar Harry Potter" [ref=e12] [cursor=pointer]:
        - generic [ref=e14]: "1"
        - generic [ref=e16]: Copia propia · 30/100 PV
      - button "Consultar Harry Potter" [ref=e18] [cursor=pointer]:
        - generic [ref=e20]: "2"
        - generic [ref=e22]: Copia propia · 30/100 PV
      - button "Consultar Harry Potter" [ref=e24] [cursor=pointer]:
        - generic [ref=e26]: "3"
        - generic [ref=e28]: Solo esta expedición · 30/100 PV
      - generic "Puesto 4 vacío" [ref=e30]: "4"
      - generic "Puesto 5 vacío" [ref=e32]: "5"
    - generic [ref=e33]:
      - generic [ref=e34]:
        - generic [aria-hidden] [ref=e35]: 3/5
        - generic [ref=e36]: 3/5 acompañantes
      - generic "Te acompañan solo en esta ruta. No son copias de tu álbum." [ref=e37]: Solo esta ruta
      - group [ref=e41]:
        - generic "Cómo formar el equipo" [ref=e42] [cursor=pointer]:
          - generic [aria-hidden] [ref=e43]: "?"
    - group [ref=e44]:
      - generic "Sinergias del equipo" [ref=e45] [cursor=pointer]:
        - generic [ref=e47]:
          - text: Alquimia
          - strong [ref=e48]: III
    - generic [ref=e50]:
      - heading "Tus cromos" [level=3] [ref=e51]
      - group [ref=e52]:
        - generic "Buscar compañero" [ref=e53] [cursor=pointer]
      - generic [ref=e54]:
        - generic [ref=e55]:
          - button "Harry Potter · copia 1 · elegir o retirar" [pressed] [ref=e56] [cursor=pointer]:
            - generic [ref=e58]: Harry Potter
            - generic [ref=e59]: Copia 1
          - button "Consultar Harry Potter" [ref=e61] [cursor=pointer]
        - generic [ref=e64]:
          - button "Albus Dumbledore · copia 1 · elegir o retirar" [ref=e65] [cursor=pointer]:
            - generic [ref=e67]: Albus Dumbledore
            - generic [ref=e68]: Copia 1
          - button "Consultar Albus Dumbledore" [ref=e69] [cursor=pointer]
        - generic [ref=e72]:
          - button "Minerva McGonagall · copia 1 · elegir o retirar" [ref=e73] [cursor=pointer]:
            - generic [ref=e75]: Minerva McGonagall
            - generic [ref=e76]: Copia 1
          - button "Consultar Minerva McGonagall" [ref=e77] [cursor=pointer]
        - generic [ref=e80]:
          - button "Nicolás Flamel · copia 1 · elegir o retirar" [ref=e81] [cursor=pointer]:
            - generic [ref=e83]: Nicolás Flamel
            - generic [ref=e84]: Copia 1
          - button "Consultar Nicolás Flamel" [ref=e85] [cursor=pointer]
        - generic [ref=e88]:
          - button "Severus Snape · copia 1 · elegir o retirar" [ref=e89] [cursor=pointer]:
            - generic [ref=e91]: Severus Snape
            - generic [ref=e92]: Copia 1
          - button "Consultar Severus Snape" [ref=e93] [cursor=pointer]
        - generic [ref=e96]:
          - button "Hermione Granger · copia 1 · elegir o retirar" [ref=e97] [cursor=pointer]:
            - generic [ref=e99]: Hermione Granger
            - generic [ref=e100]: Copia 1
          - button "Consultar Hermione Granger" [ref=e101] [cursor=pointer]
      - generic [ref=e104]:
        - button "Página anterior" [disabled] [ref=e105]
        - generic [ref=e107]: 1/5
        - button "Página siguiente" [ref=e108] [cursor=pointer]
    - button "Formación guardada" [disabled] [ref=e111]
  - status [ref=e114]
```

# Test source

```ts
  1   | import { selectedA75 } from './selected-evidence';
  2   | import { test, expect, type Page } from '@playwright/test';
  3   | 
  4   | // Component fixtures test interaction, never server persistence or human understanding.
  5   | const fixture = `${process.env.A75_FIXTURE_URL ?? 'http://127.0.0.1:5521'}/tests/browser-experience-fixes/preparation-a75.html`;
  6   | async function source(page: Page) {
  7   |   return page.evaluate(() =>
  8   |     (window as unknown as { __a75Preparation: { source(): string } }).__a75Preparation.source(),
  9   |   );
  10  | }
  11  | for (const language of ['es', 'en'] as const) {
  12  |   for (const pack of ['diagon-alley', 'arcana'] as const) {
  13  |     test(`A75 thirty copies preserve instance draft through filters and presentation changes ${language}/${pack}`, async ({
  14  |       page,
  15  |     }) => {
  16  |       await page.goto(`${fixture}?lang=${language}&pack=${pack}`);
  17  |       const before = await source(page);
  18  |       const filters = page.locator('.preparation-filters');
> 19  |       await filters.locator(':scope > summary').click();
      |                                                 ^ TimeoutError: locator.click: Timeout 12000ms exceeded.
  20  |       await page.locator('.preparation-identity-filters > summary').click();
  21  |       await page.locator('[data-preparation-identity]').first().click();
  22  |       // Two identical owned portraits remain separate, with distinct equipment and ordinal.
  23  |       await expect(page.locator('[data-copy-id="a75-copy-0"]')).toBeVisible();
  24  |       await expect(page.locator('[data-copy-id="a75-copy-6"]')).toBeVisible();
  25  |       if (language === 'es' && pack === 'diagon-alley')
  26  |         await selectedA75(page, 'preparation-filter');
  27  |       for (const [copyId, expectedArt, absentArt] of [
  28  |         ['a75-copy-0', 'product.wand-birch', 'product.broom-cadet-zephyr'],
  29  |         ['a75-copy-6', 'product.broom-cadet-zephyr', 'product.wand-birch'],
  30  |       ]) {
  31  |         const trigger = page.locator(`[data-preparation-inspect="${copyId}"]`);
  32  |         await trigger.click();
  33  |         await expect(
  34  |           page.locator(
  35  |             `.preparation-inspection .preparation-gear-slots [data-art="${expectedArt}"]`,
  36  |           ),
  37  |         ).toBeVisible();
  38  |         await expect(
  39  |           page.locator(`.preparation-inspection .preparation-gear-slots [data-art="${absentArt}"]`),
  40  |         ).toHaveCount(0);
  41  |         await page.locator('.preparation-inspection-close').click();
  42  |         await expect(trigger).toBeFocused();
  43  |       }
  44  |       await page.locator('[data-copy-id="a75-copy-6"]').click();
  45  |       await page.locator('[data-copy-id="a75-copy-12"]').click();
  46  |       await expect(page.locator('[data-copy-id="a75-copy-12"]')).toHaveAttribute(
  47  |         'aria-pressed',
  48  |         'true',
  49  |       );
  50  |       await page.getByRole('button', { name: 'QA language', exact: true }).click();
  51  |       await page.getByRole('button', { name: 'QA pack', exact: true }).click();
  52  |       await expect(page.locator('[data-copy-id="a75-copy-12"]')).toHaveAttribute(
  53  |         'aria-pressed',
  54  |         'true',
  55  |       );
  56  |       // An incompatible combination is honest, removable, and cannot clear the formation draft.
  57  |       await page.locator('[data-preparation-affinity="fire"]').click();
  58  |       await expect(page.locator('.preparation-filter-empty')).toBeVisible();
  59  |       await page.locator('.preparation-filter-empty button').click();
  60  |       await expect(page.locator('.preparation-filter-empty')).toHaveCount(0);
  61  |       await expect(page.locator('[data-copy-id]')).toHaveCount(6);
  62  |       await page.locator('[data-preparation-confirm]').click();
  63  |       await expect(page.locator('[data-fixture-confirmed]')).toHaveText('a75-copy-0,a75-copy-12');
  64  |       expect(await source(page)).toBe(before);
  65  |     });
  66  |     test(`A75 snapshot bean weights and assignment identity ${language}/${pack}`, async ({
  67  |       page,
  68  |     }) => {
  69  |       await page.goto(`${fixture}?view=beans&lang=${language}&pack=${pack}`);
  70  |       const before = await source(page);
  71  |       await page.locator('.preparation-synergies > summary').click();
  72  |       await expect(page.locator('[data-synergy-value="11"]')).toContainText('11');
  73  |       await page.locator('.bean-context-help > summary').click();
  74  |       const rows = page.locator('.bean-context-help > p');
  75  |       await expect(
  76  |         rows.filter({ has: page.locator('[data-art="product.bean-mint"]') }),
  77  |       ).toContainText('25');
  78  |       await expect(
  79  |         rows.filter({ has: page.locator('[data-art="product.bean-pepper"]') }),
  80  |       ).toContainText('75');
  81  |       await expect(page.locator('[data-art="product.bean-earth"]')).toHaveCount(0);
  82  |       await page.locator('[data-bean-unit="a75-copy-6"]').click();
  83  |       await expect(page.locator('[data-bean-unit="a75-copy-6"]')).toHaveAttribute(
  84  |         'aria-pressed',
  85  |         'true',
  86  |       );
  87  |       await page.locator('[data-bean-unit="a75-pact-copy"]').click();
  88  |       await expect(page.locator('[data-bean-unit="a75-copy-6"]')).toHaveAttribute(
  89  |         'aria-pressed',
  90  |         'false',
  91  |       );
  92  |       await expect(page.locator('[data-bean-unit="a75-pact-copy"]')).toHaveAttribute(
  93  |         'aria-pressed',
  94  |         'true',
  95  |       );
  96  |       await page.locator('[data-bean-unit="a75-pact-copy"]').click();
  97  |       await expect(page.locator('[data-bean-unit="a75-pact-copy"]')).toHaveAttribute(
  98  |         'aria-pressed',
  99  |         'false',
  100 |       );
  101 |       expect(await source(page)).toBe(before);
  102 |     });
  103 |     test(`A75 encounter identical copies have distinct labels and consequences ${language}/${pack}`, async ({
  104 |       page,
  105 |     }) => {
  106 |       await page.goto(`${fixture}?view=encounter&lang=${language}&pack=${pack}`);
  107 |       const before = await source(page);
  108 |       await page.locator('[data-encounter-choice="a75-single"]').click();
  109 |       const labels = await page
  110 |         .locator('[data-encounter-unit]')
  111 |         .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('aria-label')));
  112 |       expect(new Set(labels).size).toBe(3);
  113 |       await page.locator('[data-encounter-unit="a75-pact-copy"]').focus();
  114 |       await page.keyboard.press('Enter');
  115 |       await expect(page.locator('[data-encounter-unit="a75-pact-copy"]')).toHaveAttribute(
  116 |         'aria-pressed',
  117 |         'true',
  118 |       );
  119 |       await expect(page.locator('[data-encounter-preview-unit="a75-pact-copy"]')).toBeVisible();
```