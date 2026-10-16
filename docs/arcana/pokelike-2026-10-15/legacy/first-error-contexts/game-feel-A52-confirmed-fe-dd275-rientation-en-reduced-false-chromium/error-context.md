# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: game-feel.spec.ts >> A52 confirmed feedback and orientation en reduced=false
- Location: tests/browser-trial/game-feel.spec.ts:9:5

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator: getByRole('button', { name: 'Buy Chance Beans · 5 Crowns', exact: true })
Expected: enabled
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeEnabled" getByRole('button', { name: 'Buy Chance Beans · 5 Crowns', exact: true }) with timeout 5000ms
  - waiting for getByRole('button', { name: 'Buy Chance Beans · 5 Crowns', exact: true })

```

```yaml
- link "Skip to content":
  - /url: "#content"
- banner:
  - heading "ARCANA" [level=1]
  - button "Settings"
- status: Node 2 resolved. The result is confirmed and saved.
- strong: "50"
- text: Essence 50 / 50
- meter "Runic Essence"
- text: Essence is full.
- button "Refresh Essence"
- text: 0 Gold Keys
- main:
  - status
  - region "The Enchanted Confectionery":
    - button "Back to the alley": Alley
    - heading "The Enchanted Confectionery" [level=2]
    - group "Choose a sweet":
      - button "Cocoa Toad" [pressed]: Cocoa Toad 10
      - button "Chance Beans": Chance Beans 5
      - button "How to use your beans": Information
    - button "Buy and open 1 · 10 Crowns":
      - strong: Buy and open
      - text: "10"
    - button "Card probabilities": Cards
- navigation "Main navigation":
  - button "Map"
  - button "Chromodex"
  - button "Bazaar"
  - button "Missions"
```

# Test source

```ts
  1   | import { startExpedition } from './game-fixture';
  2   | import { openAlbumFilters } from './game-fixture';
  3   | import { confirmEvent } from './route-helpers';
  4   | import { changeLanguage } from './game-fixture';
  5   | import { expect, test } from './game-fixture';
  6   | 
  7   | for (const language of ['es', 'en'] as const) {
  8   |   for (const reduced of [false, true]) {
  9   |     test(`A52 confirmed feedback and orientation ${language} reduced=${reduced}`, async ({
  10  |       page,
  11  |     }) => {
  12  |       await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
  13  |       await page.goto('/');
  14  |       if (language === 'en') await changeLanguage(page, 'en');
  15  |       await page
  16  |         .getByRole('button', {
  17  |           name: language === 'es' ? 'Comenzar ensayo local' : 'Start local trial',
  18  |           exact: true,
  19  |         })
  20  |         .click();
  21  |       const guide = page.locator('[data-expedition-cue]');
  22  |       await expect(guide).toHaveAttribute('data-expedition-cue', 'begin');
  23  |       await startExpedition(page, language);
  24  |       await expect(guide).toHaveAttribute('data-expedition-cue', 'recruit');
  25  |       for (const id of ['pasaje:0:0', 'pasaje:1:0']) {
  26  |         await page.locator(`[data-node="${id}"]`).click();
  27  |         await confirmEvent(page, language);
  28  |       }
  29  |       await expect(guide).toHaveAttribute('data-expedition-cue', 'choose');
  30  |       await expect(page.locator('.team-unit')).toHaveCount(3);
  31  |       await expect(
  32  |         page
  33  |           .locator('.team-source')
  34  |           .filter({ hasText: language === 'es' ? 'Aliado temporal' : 'Temporary ally' }),
  35  |       ).toHaveCount(2);
  36  |       // Both the canvas and DOM share the route; guidance/filter/language never send a command.
  37  |       await expect(page.locator('.map-scroll canvas')).toBeVisible();
  38  |       const state = async () => (await (await page.request.get('/api/state')).json()).state;
  39  |       const before = await state();
  40  |       await page
  41  |         .getByRole('button', { name: language === 'es' ? 'Cromodex' : 'Chromodex', exact: true })
  42  |         .click();
  43  |       await expect(
  44  |         page.getByText(
  45  |           language === 'es'
  46  |             ? 'Identidades descubiertas: 1 de 30'
  47  |             : 'Identities discovered: 1 of 30',
  48  |         ),
  49  |       ).toBeVisible();
  50  |       await expect(page.locator('.card-team-state')).toHaveCount(1);
  51  |       await openAlbumFilters(page);
  52  |       await page
  53  |         .getByRole('group', {
  54  |           name: language === 'es' ? 'Filtro de descubrimiento' : 'Discovery filter',
  55  |           exact: false,
  56  |         })
  57  |         .locator('[data-visual-value="discovered"]')
  58  |         .click();
  59  |       await expect(page.locator('.album .card')).toHaveCount(1);
  60  |       await changeLanguage(page, language === 'es' ? 'en' : 'es');
  61  |       expect(await state()).toEqual(before);
  62  |       await changeLanguage(page, language);
  63  |       await page
  64  |         .getByRole('button', { name: language === 'es' ? 'Bazar' : 'Bazaar', exact: true })
  65  |         .click();
  66  |       await page.locator('[data-shop="confectionery"]').click();
  67  |       await page
  68  |         .getByRole('button', {
  69  |           name: language === 'es' ? 'Grageas del Azar' : 'Chance Beans',
  70  |           exact: true,
  71  |         })
  72  |         .click();
  73  |       const purchase = page.getByRole('button', {
  74  |         name:
  75  |           language === 'es'
  76  |             ? 'Comprar Grageas del Azar · 5 Coronas'
  77  |             : 'Buy Chance Beans · 5 Crowns',
  78  |         exact: true,
  79  |       });
  80  |       await page.route('**/api/purchases', (route) =>
  81  |         route.fulfill({
  82  |           status: 422,
  83  |           contentType: 'application/json',
  84  |           body: JSON.stringify({
  85  |             error: { code: 'INSUFFICIENT_CROWNS', recoverWithSameKey: false },
  86  |           }),
  87  |         }),
  88  |       );
  89  |       // A rejected command cannot generate an optimistic success banner.
  90  |       await purchase.click();
  91  |       await expect(page.locator('.operation-feedback')).toBeHidden();
  92  |       await expect(page.getByRole('alert')).toBeVisible();
  93  |       expect(await state()).toEqual(before);
  94  |       await page.unroute('**/api/purchases');
  95  |       await page
  96  |         .getByRole('button', {
  97  |           name: language === 'es' ? 'Actualizar estado' : 'Refresh state',
  98  |           exact: true,
  99  |         })
  100 |         .click();
> 101 |       await expect(purchase).toBeEnabled();
      |                              ^ Error: expect(locator).toBeEnabled() failed
  102 |       await purchase.click();
  103 |       await expect(page.locator('.operation-feedback')).toBeVisible();
  104 |       const afterPurchase = await state();
  105 |       const receipt = afterPurchase.receipts.find((r: { kind: string }) => r.kind === 'purchase');
  106 |       expect(receipt).toBeTruthy();
  107 |       await expect(page.locator('.operation-feedback')).toHaveAttribute(
  108 |         'data-confirmed-operation',
  109 |         receipt.id,
  110 |       );
  111 |       const announcement = await page.locator('main > [role="status"]').textContent();
  112 |       if (reduced)
  113 |         expect(
  114 |           await page.locator('.operation-feedback').evaluate((el) => el.getAnimations().length),
  115 |         ).toBe(0);
  116 |       await changeLanguage(page, language === 'es' ? 'en' : 'es');
  117 |       expect(await page.locator('main > [role="status"]').textContent()).toBe(announcement);
  118 |       expect(await state()).toEqual(afterPurchase);
  119 |       await page.setViewportSize({ width: 320, height: 844 });
  120 |       await page.evaluate(() => {
  121 |         document.documentElement.style.fontSize = '200%';
  122 |       });
  123 |       expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
  124 |         true,
  125 |       );
  126 |       await page.reload();
  127 |       expect(await state()).toEqual(afterPurchase);
  128 |     });
  129 |   }
  130 | }
  131 | 
```