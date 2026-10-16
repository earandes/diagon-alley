# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: team-beans.spec.ts >> Album discovery, preparation equipment and bean confirmation in en
- Location: tests/browser-trial/team-beans.spec.ts:7:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.album-prepare-link')

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - link "Skip to content" [ref=f1e4] [cursor=pointer]:
    - /url: "#content"
  - banner [ref=f1e5]:
    - heading "ARCANA" [level=1] [ref=f1e6]
    - button "Settings" [ref=f1e7] [cursor=pointer]
  - status [ref=f1e10]
  - generic [ref=f1e11]:
    - strong [ref=f1e12]:
      - generic "Crowns" [ref=f1e14]: "50"
    - generic [ref=f1e15]:
      - generic [ref=f1e16]:
        - generic [ref=f1e18]: Essence
        - text: 50 / 50
        - meter "Runic Essence" [ref=f1e19]
      - generic [ref=f1e20]: Essence is full.
      - button "Refresh Essence" [ref=f1e21] [cursor=pointer]
    - generic [ref=f1e24]:
      - strong [aria-hidden] [ref=f1e26]: "0"
      - generic [ref=f1e27]: 0 Gold Keys
  - main [ref=f1e28]:
    - status [ref=f1e29]
    - generic [ref=f1e30]:
      - generic:
        - heading "The Crooked Passage" [level=2] [ref=f1e31]
        - complementary "Next objective":
          - generic:
            - heading "Gather your first coven" [level=3]
            - group [ref=f1e32]:
              - generic "Next objective" [ref=f1e33] [cursor=pointer]: "?"
      - region "Prepare your expedition" [ref=f1e35]:
        - heading "Prepare your expedition" [level=2] [ref=f1e37]
        - generic "0/5 companions" [ref=f1e38]:
          - generic "Empty slot 1" [ref=f1e40]: "1"
          - generic "Empty slot 2" [ref=f1e42]: "2"
          - generic "Empty slot 3" [ref=f1e44]: "3"
          - generic "Empty slot 4" [ref=f1e46]: "4"
          - generic "Empty slot 5" [ref=f1e48]: "5"
        - paragraph [ref=f1e49]: 0/5 companions
        - generic [ref=f1e51]:
          - heading "Choose your companions" [level=3] [ref=f1e52]
          - button "Alchemy Apprentice · copy 1 · select or remove" [ref=f1e54] [cursor=pointer]:
            - generic [ref=f1e56]: Alchemy Apprentice
            - generic [ref=f1e57]: Copy 1
        - generic [ref=f1e58]:
          - paragraph [ref=f1e59]: Explore with 1–5. Duels need 3–5 allies; Pacts can help.
          - button "Enter the map" [disabled] [ref=f1e60]
  - navigation "Main navigation" [ref=f1e63]:
    - button "Map" [ref=f1e64] [cursor=pointer]
    - button "Chromodex" [ref=f1e67] [cursor=pointer]
    - button "Bazaar" [ref=f1e70] [cursor=pointer]
    - button "Missions" [ref=f1e73] [cursor=pointer]
```

# Test source

```ts
  1   | import { startExpedition } from './game-fixture';
  2   | import { openAlbumFilters } from './game-fixture';
  3   | import { changeLanguage } from './game-fixture';
  4   | import { reachNode } from './route-helpers';
  5   | import { test, expect } from './game-fixture';
  6   | for (const language of ['es', 'en'] as const) {
  7   |   test(`Album discovery, preparation equipment and bean confirmation in ${language}`, async ({
  8   |     page,
  9   |   }) => {
  10  |     const en = language === 'en';
  11  |     const button = (es: string, english: string) =>
  12  |       page.getByRole('button', { name: en ? english : es, exact: true });
  13  |     const read = async () => (await (await page.request.get('/api/state')).json()).state;
  14  |     await page.goto('/');
  15  |     if (en) await changeLanguage(page, 'en');
  16  |     await button('Comenzar ensayo local', 'Start local trial').click();
  17  |     await button('Cromodex', 'Chromodex').click();
  18  |     await openAlbumFilters(page);
  19  |     await page
  20  |       .getByRole('group', { name: en ? 'Rarity filter' : 'Filtro de rareza', exact: true })
  21  |       .locator('[data-visual-value=\"epic\"]')
  22  |       .click();
  23  |     await expect(
  24  |       page.getByRole('heading', {
  25  |         name: en ? 'Alchemy Apprentice' : 'Aprendiz de Alquimia',
  26  |         exact: true,
  27  |       }),
  28  |     ).toHaveCount(0);
  29  |     await page
  30  |       .getByRole('group', {
  31  |         name: en ? 'Discovery filter' : 'Filtro de descubrimiento',
  32  |         exact: true,
  33  |       })
  34  |       .locator('[data-visual-value="discovered"]')
  35  |       .click();
  36  |     await expect(
  37  |       page.getByText(
  38  |         en ? 'No cards match these filters.' : 'Ningún cromo coincide con estos filtros.',
  39  |         { exact: true },
  40  |       ),
  41  |     ).toBeVisible();
  42  |     await page
  43  |       .getByRole('group', { name: en ? 'Rarity filter' : 'Filtro de rareza', exact: true })
  44  |       .locator('[data-visual-value=\"all\"]')
  45  |       .click();
  46  |     await page.locator('.album-prepare-link').click();
  47  |     await page.locator('.preparation-dialog .preparation-card').first().click();
  48  |     await button('Varita para copia 1', 'Wand for copy 1').click();
  49  |     const wand = page.getByRole('group', {
  50  |       name: en ? 'Wand for copy 1' : 'Varita para copia 1',
  51  |       exact: true,
  52  |     });
  53  |     await wand
  54  |       .getByRole('button', { name: en ? 'Unequipped' : 'Sin equipar', exact: true })
  55  |       .click();
  56  |     await expect(
  57  |       wand.getByRole('button', { name: en ? 'Unequipped' : 'Sin equipar', exact: true }),
  58  |     ).toHaveAttribute('aria-pressed', 'true');
  59  |     await expect.poll(async () => (await read()).team.loadouts[0].wandId).toBe(null);
  60  |     await page.reload();
> 61  |     await page.locator('.album-prepare-link').click();
      |                                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
  62  |     await page.locator('.preparation-dialog .preparation-card').first().click();
  63  |     await button('Varita para copia 1', 'Wand for copy 1').click();
  64  |     await expect(
  65  |       wand.getByRole('button', { name: en ? 'Unequipped' : 'Sin equipar', exact: true }),
  66  |     ).toHaveAttribute('aria-pressed', 'true');
  67  |     await wand.locator('[data-equipment-id="starter:wand"]').click();
  68  |     await expect.poll(async () => (await read()).team.loadouts[0].wandId).toBe('starter:wand');
  69  |     await page.keyboard.press('Escape');
  70  |     await button('Bazar', 'Bazaar').click();
  71  |     await page.locator('[data-shop="confectionery"]').click();
  72  |     await button('Grageas del Azar', 'Chance Beans').click();
  73  |     await button('Comprar Grageas del Azar · 5 Coronas', 'Buy Chance Beans · 5 Crowns').click();
  74  |     await expect
  75  |       .poll(
  76  |         async () =>
  77  |           (await read()).inventory.products.filter(
  78  |             (p: { kind: string }) => p.kind === 'random-beans',
  79  |           ).length,
  80  |       )
  81  |       .toBe(1);
  82  |     await button('Mapa', 'Map').click();
  83  |     await startExpedition(page, language);
  84  |     for (const id of ['pasaje:0:0', 'pasaje:1:0']) {
  85  |       await page.locator(`[data-node="${id}"]`).click();
  86  |       await button('Confirmar nodo', 'Confirm node').click();
  87  |     }
  88  |     const duelId = await reachNode(page, 'duel', language);
  89  |     await page.locator(`[data-node="${duelId}"]`).click();
  90  |     await expect(page.locator('.event-opponents > div > img')).toHaveCount(3);
  91  |     await expect
  92  |       .poll(() =>
  93  |         page
  94  |           .locator('.event-opponents > div > img')
  95  |           .evaluateAll((images) =>
  96  |             images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
  97  |           ),
  98  |       )
  99  |       .toBe(true);
  100 |     await expect(page.locator('.node-bean-preparation')).not.toHaveAttribute('open', '');
  101 |     const confirmBox = await button('Confirmar nodo', 'Confirm node').boundingBox();
  102 |     expect(confirmBox!.y + confirmBox!.height).toBeLessThan(844);
  103 |     await page.locator('.node-bean-preparation > summary').click();
  104 |     const before = await read();
  105 |     const bean = before.inventory.products.find((p: { kind: string }) => p.kind === 'random-beans');
  106 |     const unit = before.exploration.run.members[0].unit.id;
  107 |     await page.locator(`[data-bean-unit="${unit}"] [data-visual-value="${bean.id}"]`).click();
  108 |     const otherUnit = before.exploration.run.members[1].unit.id;
  109 |     await expect(
  110 |       page.locator(`[data-bean-unit="${otherUnit}"] [data-visual-value="${bean.id}"]`),
  111 |     ).toHaveAttribute('disabled', '');
  112 |     await changeLanguage(page, en ? 'es' : 'en');
  113 |     await expect(
  114 |       page.locator(`[data-bean-unit="${unit}"] [data-visual-value="${bean.id}"]`),
  115 |     ).toHaveAttribute('aria-pressed', 'true');
  116 |     await changeLanguage(page, language);
  117 |     await button('Cancelar', 'Cancel').click();
  118 |     expect(await read()).toEqual(before);
  119 |     await page.locator(`[data-node="${duelId}"]`).click();
  120 |     await page.locator('.node-bean-preparation > summary').click();
  121 |     await expect(page.locator(`[data-bean-unit="${unit}"] [data-visual-value=""]`)).toHaveAttribute(
  122 |       'aria-pressed',
  123 |       'true',
  124 |     );
  125 |     await page.locator(`[data-bean-unit="${unit}"] [data-visual-value="${bean.id}"]`).click();
  126 |     await button('Confirmar nodo', 'Confirm node').click();
  127 |     await expect(
  128 |       page.getByRole('heading', { name: en ? 'Combat Arena' : 'Arena de Combate', exact: true }),
  129 |     ).toBeVisible();
  130 |     const after = await read();
  131 |     expect(after.inventory.products.find((p: { id: string }) => p.id === bean.id).status).toBe(
  132 |       'consumed',
  133 |     );
  134 |     expect(after.inventory.essence.points).toBe(before.inventory.essence.points - 5);
  135 |     const receipt = after.receipts.find(
  136 |       (r: { kind: string; battle?: unknown }) => r.kind === 'advance-node' && r.battle,
  137 |     );
  138 |     expect(receipt.request.assignments).toEqual([{ unitId: unit, beanId: bean.id }]);
  139 |     expect(
  140 |       receipt.battle.events.some(
  141 |         (e: { kind: string; unitId: string }) =>
  142 |           e.kind === 'bean-activated' && e.unitId === bean.id,
  143 |       ),
  144 |     ).toBe(true);
  145 |   });
  146 | }
  147 | 
```