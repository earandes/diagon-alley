# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-polish.spec.ts >> confirmed opening finishes, language does not replay it, and reload retains its real reward
- Location: tests/browser-trial/visual-polish.spec.ts:9:1

# Error details

```
TypeError: Cannot read properties of undefined (reading 'copyId')
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Saltar al contenido" [ref=e4]:
    - /url: "#content"
  - banner [ref=e5]:
    - heading "ARCANA" [level=1] [ref=e6]
    - button "Ajustes" [ref=e7] [cursor=pointer]
  - status [ref=e10]
  - generic [ref=e11]:
    - strong [ref=e12]:
      - generic "Coronas" [ref=e14]: "40"
    - generic [ref=e15]:
      - generic [ref=e16]:
        - generic [ref=e18]: Esencia
        - text: 50 / 50
        - meter "Esencia Rúnica" [ref=e19]
      - generic [ref=e20]: Esencia al máximo.
      - button "Actualizar Esencia" [ref=e21] [cursor=pointer]
    - generic [ref=e24]:
      - strong [aria-hidden] [ref=e26]: "0"
      - generic [ref=e27]: 0 Llaves de Oro
  - main [ref=e28]:
    - status [ref=e29]
    - dialog "Cromo confirmado" [ref=e30]:
      - button "Ajustes" [ref=e31] [cursor=pointer]
      - heading "Cromo confirmado" [active] [level=2] [ref=e34]
      - status [ref=e35]: Nuevo descubrimiento
      - button "Omitir animación" [ref=e36] [cursor=pointer]
      - button "Continuar" [ref=e38] [cursor=pointer]
    - region "La Confitería Encantada" [ref=e41]:
      - generic [ref=e42]:
        - button "Volver al callejón" [ref=e43] [cursor=pointer]:
          - generic [ref=e49]: Callejón
        - heading "La Confitería Encantada" [level=2] [ref=e50]
      - group "Elige un dulce" [ref=e51]:
        - button "Sapo de Cacao" [pressed] [ref=e53] [cursor=pointer]:
          - generic [ref=e56]: "10"
        - generic [ref=e59]:
          - button "Grageas del Azar" [ref=e60] [cursor=pointer]:
            - generic [ref=e63]: "5"
          - button "Cómo usar tus grageas" [ref=e66] [cursor=pointer]:
            - generic [aria-hidden] [ref=e67]: i
            - generic [ref=e68]: Información
      - button "Comprar y abrir 1 · 10 Coronas" [ref=e70] [cursor=pointer]:
        - generic [ref=e72]:
          - strong [ref=e73]: Comprar y abrir
          - generic [ref=e74]: "10"
        - generic [aria-hidden] [ref=e75]: ↗
      - button "Probabilidades por cromo" [ref=e77] [cursor=pointer]:
        - generic [ref=e80]: Cromos
  - navigation "Navegación principal" [ref=e81]:
    - button "Mapa" [ref=e82] [cursor=pointer]
    - button "Cromodex" [ref=e85] [cursor=pointer]
    - button "Bazar" [ref=e88] [cursor=pointer]
    - button "Misiones" [ref=e91] [cursor=pointer]
```

# Test source

```ts
  1   | import { changeLanguage } from './game-fixture';
  2   | import { test, expect } from './game-fixture';
  3   | async function enter(page: import('@playwright/test').Page) {
  4   |   await page.goto('/');
  5   |   await page.getByRole('button', { name: 'Comenzar ensayo local', exact: true }).click();
  6   |   await page.getByRole('button', { name: 'Bazar', exact: true }).click();
  7   |   await page.locator('[data-shop="confectionery"]').click();
  8   | }
  9   | test('confirmed opening finishes, language does not replay it, and reload retains its real reward', async ({
  10  |   page,
  11  | }) => {
  12  |   await enter(page);
  13  |   let openings = 0;
  14  |   page.on('request', (request) => {
  15  |     if (request.method() === 'POST' && request.url().endsWith('/api/toads/buy-open')) openings++;
  16  |   });
  17  |   await page.getByRole('button', { name: 'Comprar y abrir 1 · 10 Coronas', exact: true }).click();
  18  |   await expect(page.getByRole('heading', { name: 'Cromo confirmado', exact: true })).toBeVisible();
  19  |   const server = (await (await page.request.get('/api/state')).json()).state;
  20  |   const receipt = server.receipts.find((r: { kind: string }) => r.kind === 'open-toad');
> 21  |   expect(server.copies.some((c: { copyId: string }) => c.copyId === receipt.copyId)).toBe(true);
      |                                                                             ^ TypeError: Cannot read properties of undefined (reading 'copyId')
  22  |   await changeLanguage(page, 'en');
  23  |   await expect(page.locator('[data-opening-state]')).toHaveAttribute(
  24  |     'data-opening-state',
  25  |     'result',
  26  |     { timeout: 10_000 },
  27  |   );
  28  |   await expect(page.getByRole('button', { name: 'Skip animation', exact: true })).toHaveCount(0);
  29  |   await expect(page.locator('[data-celebration]')).toHaveCount(1);
  30  |   await expect(page.locator('[data-celebration]')).toHaveCount(0);
  31  |   await changeLanguage(page, 'es');
  32  |   await expect(page.locator('[data-celebration]')).toHaveCount(0);
  33  |   await page.getByRole('button', { name: 'Ver en Cromodex', exact: true }).click();
  34  |   await expect(page.locator('.reveal')).toHaveCount(0);
  35  |   await expect(
  36  |     page.locator('.album').getByRole('heading', { name: receipt.wizard.name.es, exact: true }),
  37  |   ).toBeVisible();
  38  |   await page.reload();
  39  |   expect((await (await page.request.get('/api/state')).json()).state).toEqual(server);
  40  |   await expect(page.locator('[data-celebration]')).toHaveCount(0);
  41  |   expect(openings).toBe(1);
  42  | });
  43  | test('reduced motion and missing art leave a confirmed result available without celebration', async ({
  44  |   page,
  45  | }) => {
  46  |   await page.emulateMedia({ reducedMotion: 'reduce' });
  47  |   await page.route('**/*.webp', (route) => route.abort());
  48  |   await enter(page);
  49  |   await page.getByRole('button', { name: 'Comprar y abrir 1 · 10 Coronas', exact: true }).click();
  50  |   await expect(page.locator('[data-opening-state]')).toHaveAttribute(
  51  |     'data-opening-state',
  52  |     'result',
  53  |   );
  54  |   await expect(page.getByRole('button', { name: 'Omitir animación', exact: true })).toHaveCount(0);
  55  |   await expect(page.locator('[data-celebration]')).toHaveCount(0);
  56  |   await expect(page.getByRole('button', { name: 'Ver en Cromodex', exact: true })).toBeVisible();
  57  |   const server = (await (await page.request.get('/api/state')).json()).state;
  58  |   expect(server.copies).toHaveLength(2);
  59  |   await page.reload();
  60  |   expect((await (await page.request.get('/api/state')).json()).state).toEqual(server);
  61  | });
  62  | test('zero balance disables purchases and preserves all confirmed openings', async ({ page }) => {
  63  |   await page.emulateMedia({ reducedMotion: 'reduce' });
  64  |   await enter(page);
  65  |   for (let i = 0; i < 5; i++) {
  66  |     await page.getByRole('button', { name: 'Comprar y abrir 1 · 10 Coronas', exact: true }).click();
  67  |     await expect(page.locator('[data-opening-state]')).toHaveAttribute(
  68  |       'data-opening-state',
  69  |       'result',
  70  |     );
  71  |     await page.locator('.reveal-continue').click();
  72  |     const saved = (await (await page.request.get('/api/state')).json()).state;
  73  |     expect(saved.inventory.crowns).toBe(50 - (i + 1) * 10);
  74  |     expect(saved.copies).toHaveLength(i + 2);
  75  |     expect(
  76  |       saved.inventory.products.filter(
  77  |         (p: { kind: string; status: string }) => p.kind === 'cacao-toad' && p.status === 'consumed',
  78  |       ),
  79  |     ).toHaveLength(i + 1);
  80  |   }
  81  |   const before = (await (await page.request.get('/api/state')).json()).state;
  82  |   expect(before.inventory.crowns).toBe(0);
  83  |   await expect(
  84  |     page.getByRole('button', { name: 'Comprar y abrir 1 · 10 Coronas', exact: true }),
  85  |   ).toBeDisabled();
  86  |   await expect(page.getByText('Sincronizando estado…', { exact: true })).toHaveCount(0);
  87  |   await page.reload();
  88  |   expect((await (await page.request.get('/api/state')).json()).state).toEqual(before);
  89  | });
  90  | 
  91  | test('a definitive server rejection clears synchronization and never grants an optimistic purchase', async ({
  92  |   page,
  93  | }) => {
  94  |   await enter(page);
  95  |   const before = (await (await page.request.get('/api/state')).json()).state;
  96  |   await page.route('**/api/toads/buy-open', (route) =>
  97  |     route.fulfill({
  98  |       status: 422,
  99  |       contentType: 'application/json',
  100 |       body: JSON.stringify({ error: { code: 'INSUFFICIENT_CROWNS', recoverWithSameKey: false } }),
  101 |     }),
  102 |   );
  103 |   await page.getByRole('button', { name: 'Comprar y abrir 1 · 10 Coronas', exact: true }).click();
  104 |   await expect(page.getByRole('alert')).toBeVisible();
  105 |   await expect(page.getByText('Sincronizando estado…', { exact: true })).toHaveCount(0);
  106 |   expect((await (await page.request.get('/api/state')).json()).state).toEqual(before);
  107 | });
  108 | 
```