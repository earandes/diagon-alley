# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: game-feel.spec.ts >> A52 confirmed feedback and orientation es reduced=false
- Location: tests/browser-trial/game-feel.spec.ts:9:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Identidades descubiertas: 1 de 30')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Identidades descubiertas: 1 de 30') with timeout 5000ms
  - waiting for getByText('Identidades descubiertas: 1 de 30')

```

```yaml
- link "Saltar al contenido":
  - /url: "#content"
- banner:
  - heading "ARCANA" [level=1]
  - status
  - button "Una noche encantada"
  - button "Ajustes"
- status: Nodo 2 resuelto. El resultado está confirmado y guardado.
- strong: "50"
- text: Esencia 50 / 50
- meter "Esencia Rúnica"
- text: Esencia al máximo.
- button "Actualizar Esencia"
- text: 0 Llaves de Oro
- main:
  - status
  - heading "Cromodex" [level=2]
  - text: "Identidades descubiertas: 1 de 34"
  - progressbar "Progreso de descubrimientos"
  - paragraph: 1 copia guardada
  - button "Preparar expedición"
  - region "Sabores descubiertos":
    - heading "Sabores descubiertos" [level=3]
    - text: 0/4
    - button "Menta · por descubrir"
    - button "Pimienta · por descubrir"
    - button "Tierra · por descubrir"
    - button "Jabón · por descubrir"
    - button "¿Cómo descubrirlos?": El secreto de los sabores
  - group: Filtrar cromos
  - article "Aprendiz de Alquimia":
    - button "Consultar Aprendiz de Alquimia"
    - heading "Aprendiz de Alquimia" [level=3]
    - text: Compañía del León
    - paragraph: Común
    - paragraph: 1 estrella
    - paragraph: "Copias: 1"
    - paragraph: En tu equipo
  - article "Cromo por descubrir":
    - button "Cromo por descubrir" [disabled]
    - heading "Cromo por descubrir" [level=3]
    - paragraph: Común
    - paragraph: 1 estrella
    - paragraph: Bloqueado
  - article "Cromo por descubrir":
    - button "Cromo por descubrir" [disabled]
    - heading "Cromo por descubrir" [level=3]
    - paragraph: Común
    - paragraph: 1 estrella
    - paragraph: Bloqueado
  - article "Cromo por descubrir":
    - button "Cromo por descubrir" [disabled]
    - heading "Cromo por descubrir" [level=3]
    - paragraph: Común
    - paragraph: 1 estrella
    - paragraph: Bloqueado
  - button "Página anterior" [disabled]
  - text: 1 / 9
  - button "Página siguiente"
- navigation "Navegación principal":
  - button "Mapa"
  - button "Cromodex"
  - button "Bazar"
  - button "Misiones"
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
  17  |           name: language === 'es' ? 'Jugar como invitado' : 'Play as guest',
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
> 49  |       ).toBeVisible();
      |         ^ Error: expect(locator).toBeVisible() failed
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
  97  |           name: language === 'es' ? 'Volver a consultar' : 'Check again',
  98  |           exact: true,
  99  |         })
  100 |         .click();
  101 |       // Reconsulting preserves the selected product and clears the rejection without spending.
  102 |       await expect(page.locator('[data-recovery-notice]')).toHaveCount(0);
  103 |       await expect(page.locator('[data-product="random-beans"]')).toHaveAttribute(
  104 |         'aria-pressed',
  105 |         'true',
  106 |       );
  107 |       await expect(purchase).toBeEnabled();
  108 |       expect(await state()).toEqual(before);
  109 |       await purchase.click();
  110 |       await expect(page.locator('.operation-feedback')).toBeVisible();
  111 |       const afterPurchase = await state();
  112 |       const receipt = afterPurchase.receipts.find((r: { kind: string }) => r.kind === 'purchase');
  113 |       expect(receipt).toBeTruthy();
  114 |       await expect(page.locator('.operation-feedback')).toHaveAttribute(
  115 |         'data-confirmed-operation',
  116 |         receipt.id,
  117 |       );
  118 |       const announcement = await page.locator('main > [role="status"]').textContent();
  119 |       if (reduced)
  120 |         expect(
  121 |           await page.locator('.operation-feedback').evaluate((el) => el.getAnimations().length),
  122 |         ).toBe(0);
  123 |       await changeLanguage(page, language === 'es' ? 'en' : 'es');
  124 |       expect(await page.locator('main > [role="status"]').textContent()).toBe(announcement);
  125 |       expect(await state()).toEqual(afterPurchase);
  126 |       await page.setViewportSize({ width: 320, height: 844 });
  127 |       await page.evaluate(() => {
  128 |         document.documentElement.style.fontSize = '200%';
  129 |       });
  130 |       expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
  131 |         true,
  132 |       );
  133 |       await page.reload();
  134 |       expect(await state()).toEqual(afterPurchase);
  135 |     });
  136 |   }
  137 | }
  138 | 
```