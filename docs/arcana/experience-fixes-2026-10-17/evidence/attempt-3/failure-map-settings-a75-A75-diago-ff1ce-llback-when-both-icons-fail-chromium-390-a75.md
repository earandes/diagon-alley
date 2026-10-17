# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: map-settings-a75.spec.ts >> A75 diagon-alley es map and list retain visible fallback when both icons fail
- Location: tests/browser-experience-fixes/map-settings-a75.spec.ts:78:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('.map-view-toggle').locator('.map-view-fallback')
Expected: visible
Received: hidden
Timeout:  12000ms

Call log:
  - Expect "toBeVisible" locator('.map-view-toggle').locator('.map-view-fallback') with timeout 12000ms
  - waiting for locator('.map-view-toggle').locator('.map-view-fallback')
    26 × locator resolved to <span aria-hidden="true" class="map-view-fallback">Ver lista de nodos</span>
       - unexpected value "hidden"

```

```yaml
- link "Saltar al contenido":
  - /url: "#content"
- banner:
  - heading "Callejón Diagón Descubrimiento" [level=1]
  - status
  - button "Una noche encantada"
  - button "Ajustes"
- status
- strong: "50"
- text: Energía 50 / 50
- meter "Energía mágica"
- text: Energía al máximo.
- button "Actualizar Energía"
- text: 0 Llaves de Oro
- main:
  - status
  - complementary "Siguiente objetivo":
    - heading "Un aliado más en el camino" [level=3]
    - group: "?"
    - text: 0 / 7
  - region "Tu Equipo":
    - heading "Tu Equipo" [level=2]
    - button "Harry Potter":
      - text: Copia propia
      - meter "Vida de Harry Potter"
    - button "Prepara tu expedición"
  - button "Ver lista de nodos"
  - text: Inicio
  - button "Pacto Mágico · etapa 1, opción 1 · Disponible":
    - strong: Pacto Mágico
    - text: Disponible Aliado temporal
  - button "Cofre de Botín · etapa 2, opción 1 · Bloqueado":
    - strong: Cofre de Botín
    - text: Bloqueado
  - button "Pacto Mágico · etapa 2, opción 2 · Bloqueado":
    - strong: Pacto Mágico
    - text: Bloqueado
  - button "Pacto Mágico · etapa 3, opción 1 · Bloqueado":
    - strong: Pacto Mágico
    - text: Bloqueado
  - button "Cofre de Botín · etapa 3, opción 2 · Bloqueado":
    - strong: Cofre de Botín
    - text: Bloqueado
  - button "Duelo mágico · etapa 3, opción 3 · Bloqueado":
    - strong: Duelo mágico
    - text: Bloqueado
  - button "Refugio Alquímico · etapa 4, opción 1 · Bloqueado":
    - strong: Refugio Alquímico
    - text: Bloqueado
  - button "Duelo mágico · etapa 4, opción 2 · Bloqueado":
    - text: Vanguardia · iniciativa
    - strong: Duelo mágico
    - text: Bloqueado
  - button "Encuentro · etapa 4, opción 3 · Bloqueado":
    - strong: Encuentro
    - text: Bloqueado
  - button "Duelo mágico · etapa 5, opción 1 · Bloqueado":
    - text: Fuego · quemadura
    - strong: Duelo mágico
    - text: Bloqueado
  - button "Refugio Alquímico · etapa 5, opción 2 · Bloqueado":
    - strong: Refugio Alquímico
    - text: Bloqueado
  - button "Cofre de Botín · etapa 5, opción 3 · Bloqueado":
    - strong: Cofre de Botín
    - text: Bloqueado
  - button "Refugio Alquímico · etapa 6, opción 1 · Bloqueado":
    - strong: Refugio Alquímico
    - text: Bloqueado
  - button "Encuentro · etapa 6, opción 2 · Bloqueado":
    - strong: Encuentro
    - text: Bloqueado
  - button "Duelo mágico · etapa 6, opción 3 · Bloqueado":
    - text: Fuego · quemadura
    - strong: Duelo mágico
    - text: Bloqueado
  - button "Jefe de Zona · etapa 7, opción 1 · Bloqueado":
    - strong: Jefe de Zona
    - text: Bloqueado
- navigation "Navegación principal":
  - button "Mapa"
  - button "Álbum de Cromos"
  - button "Callejón"
  - button "Misiones"
```

# Test source

```ts
  1   | import { selectedA75 } from './selected-evidence';
  2   | import {
  3   |   test,
  4   |   expect,
  5   |   type Page,
  6   |   changeLanguage,
  7   |   startExpedition,
  8   | } from '../browser-trial/game-fixture';
  9   | import { reachNode, confirmEvent } from '../browser-trial/route-helpers';
  10  | 
  11  | test.use({ baseURL: 'http://127.0.0.1:5520', hasTouch: true });
  12  | test.beforeEach(async ({ browserName, viewport }) => {
  13  |   test.skip(
  14  |     browserName !== 'chromium' || viewport?.width !== 390,
  15  |     'A75 public-route and preference contracts use one Chromium mobile context; other suites cover rendering matrices.',
  16  |   );
  17  | });
  18  | const read = async (page: Page) => (await (await page.request.get('/api/state')).json()).state;
  19  | const settings = async (page: Page) => {
  20  |   await page.locator('.game-header > .settings-trigger').click();
  21  |   const dialog = page.locator('dialog.game-settings[open]');
  22  |   await expect(dialog).toBeVisible();
  23  |   return dialog;
  24  | };
  25  | const packPreference = async (page: Page, pack: string) =>
  26  |   page.addInitScript((value) => {
  27  |     localStorage.setItem('arcana.presentation.content-pack.v1', value);
  28  |   }, pack);
  29  | 
  30  | for (const pack of ['diagon-alley', 'arcana'])
  31  |   for (const language of ['es', 'en'] as const) {
  32  |     test(`A75 ${pack} ${language} route book distinguishes branches and consultation never advances`, async ({
  33  |       page,
  34  |     }) => {
  35  |       await packPreference(page, pack);
  36  |       await page.goto('/');
  37  |       if (language === 'en') await changeLanguage(page, language);
  38  |       await page.locator('.portal-enter').click();
  39  |       await startExpedition(page, language);
  40  |       const before = await read(page);
  41  |       let posts = 0;
  42  |       page.on('request', (request) => {
  43  |         if (request.method() === 'POST') posts++;
  44  |       });
  45  |       const future = page.locator('[data-node-state="locked"]').first();
  46  |       await expect(future).toBeEnabled();
  47  |       await future.focus();
  48  |       await page.keyboard.press('Enter');
  49  |       const inspection = page.locator('dialog.route-inspection[open]');
  50  |       await expect(inspection).toBeVisible();
  51  |       await expect(inspection).toContainText(language === 'es' ? 'Solo consulta' : 'Read only');
  52  |       await expect(inspection.locator('.node-confirm-action')).toHaveCount(0);
  53  |       if (language === 'es' && pack === 'diagon-alley') await selectedA75(page, 'route-inspection');
  54  |       await page.keyboard.press('Escape');
  55  |       await expect(inspection).toHaveCount(0);
  56  |       await expect(future).toBeFocused();
  57  |       await page.locator('.map-view-toggle').click();
  58  |       const entries = page.locator('.route-book-entry');
  59  |       expect(await entries.count()).toBe(before.exploration.run.graph.nodes.length);
  60  |       const names = await entries
  61  |         .locator('[data-node]')
  62  |         .evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-label')));
  63  |       expect(new Set(names).size).toBe(names.length);
  64  |       const branch = entries.filter({ has: page.locator('[data-node-state="locked"]') }).first();
  65  |       await branch.locator('summary').tap();
  66  |       await expect(branch).toContainText(language === 'es' ? 'Desde' : 'From');
  67  |       await expect(branch).toContainText(language === 'es' ? 'Continúa hacia' : 'Continues to');
  68  |       await branch.locator('.route-book-inspect').tap();
  69  |       await expect(inspection).toBeVisible();
  70  |       await inspection.locator('.route-inspection-relations button').first().click();
  71  |       await expect(inspection.locator('h2')).toBeFocused();
  72  |       await page.keyboard.press('Escape');
  73  |       await expect(branch.locator('.route-book-inspect')).toBeFocused();
  74  |       expect(posts).toBe(0);
  75  |       expect(await read(page)).toEqual(before);
  76  |     });
  77  | 
  78  |     test(`A75 ${pack} ${language} map and list retain visible fallback when both icons fail`, async ({
  79  |       page,
  80  |     }) => {
  81  |       await packPreference(page, pack);
  82  |       await page.goto('/');
  83  |       if (language === 'en') await changeLanguage(page, language);
  84  |       await page.locator('.portal-enter').click();
  85  |       await startExpedition(page, language);
  86  |       const toggle = page.locator('.map-view-toggle');
  87  |       const missions = await toggle.locator('img').getAttribute('src');
  88  |       await toggle.click();
  89  |       const map = await toggle.locator('img').getAttribute('src');
  90  |       for (const source of [missions, map]) {
  91  |         expect(source).toBeTruthy();
  92  |         await page.route(new URL(source!, page.url()).href, (route) => route.abort());
  93  |       }
  94  |       const before = await read(page);
  95  |       await page.reload();
  96  |       await expect(toggle.locator('img')).toHaveCount(0);
> 97  |       await expect(toggle.locator('.map-view-fallback')).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  98  |       await expect(toggle).toHaveText(language === 'es' ? 'Ver lista de nodos' : 'View node list');
  99  |       await toggle.focus();
  100 |       await page.keyboard.press('Enter');
  101 |       await expect(page.locator('.route-list')).toBeVisible();
  102 |       await expect(toggle.locator('img')).toHaveCount(0);
  103 |       await expect(toggle.locator('.map-view-fallback')).toBeVisible();
  104 |       await expect(toggle).toHaveText(language === 'es' ? 'Ver mapa' : 'View map');
  105 |       expect(await read(page)).toEqual(before);
  106 |     });
  107 |   }
  108 | 
  109 | for (const language of ['es', 'en'] as const)
  110 |   for (const system of [false, true])
  111 |     for (const own of [false, true])
  112 |       test(`A75 ${language} actual settings system=${system} own=${own} persists own choice and respects system`, async ({
  113 |         page,
  114 |       }) => {
  115 |         await page.emulateMedia({ reducedMotion: system ? 'reduce' : 'no-preference' });
  116 |         await page.addInitScript((initial) => {
  117 |           if (localStorage.getItem('arcana-reduced-motion') === null)
  118 |             localStorage.setItem('arcana-reduced-motion', String(initial));
  119 |         }, own);
  120 |         await page.goto('/');
  121 |         if (language === 'en') await changeLanguage(page, language);
  122 |         await page.locator('.portal-enter').click();
  123 |         const before = await read(page);
  124 |         let dialog = await settings(page);
  125 |         const choice = () => dialog.locator('.settings-motion');
  126 |         await expect(choice()).toHaveAttribute('aria-pressed', String(own));
  127 |         await expect(dialog.locator('#settings-motion-state')).toHaveAttribute(
  128 |           'data-motion-system',
  129 |           String(system),
  130 |         );
  131 |         await expect(dialog.locator('#settings-motion-state')).toHaveAttribute(
  132 |           'data-motion-effective',
  133 |           String(system || own),
  134 |         );
  135 |         await choice().click();
  136 |         await expect(choice()).toHaveAttribute('aria-pressed', String(!own));
  137 |         await expect(page.locator('.game-shell')).toHaveAttribute(
  138 |           'data-reduced',
  139 |           String(system || !own),
  140 |         );
  141 |         await dialog
  142 |           .getByRole('button', {
  143 |             name: language === 'es' ? 'Callejón Diagón' : 'Diagon Alley',
  144 |             exact: true,
  145 |           })
  146 |           .click();
  147 |         await expect(choice()).toHaveAttribute('aria-pressed', String(!own));
  148 |         await expect(dialog.locator('#settings-motion-state')).toHaveAttribute(
  149 |           'data-motion-effective',
  150 |           String(system || !own),
  151 |         );
  152 |         await page.reload();
  153 |         dialog = await settings(page);
  154 |         await expect(choice()).toHaveAttribute('aria-pressed', String(!own));
  155 |         await expect(dialog.locator('#settings-motion-state')).toHaveAttribute(
  156 |           'data-motion-effective',
  157 |           String(system || !own),
  158 |         );
  159 |         expect(await read(page)).toEqual(before);
  160 |       });
  161 | 
  162 | test('A75 settings preference during paused replay never restarts the confirmed log or alters resources', async ({
  163 |   page,
  164 | }) => {
  165 |   await page.emulateMedia({ reducedMotion: 'no-preference' });
  166 |   await page.goto('/');
  167 |   await page.locator('.portal-enter').click();
  168 |   await startExpedition(page);
  169 |   const node = await reachNode(page, 'duel', 'es');
  170 |   await page.locator(`[data-node="${node}"]`).click();
  171 |   await confirmEvent(page, 'es');
  172 |   await page.getByRole('button', { name: 'Pausa', exact: true }).click();
  173 |   const arena = page.locator('[data-replay-cursor]');
  174 |   const cursor = await arena.getAttribute('data-replay-cursor');
  175 |   const before = await read(page);
  176 |   const dialog = await settings(page);
  177 |   await dialog.locator('.settings-motion').click();
  178 |   await expect(page.locator('.game-shell')).toHaveAttribute('data-reduced', 'true');
  179 |   await dialog.getByRole('button', { name: 'Cerrar', exact: true }).click();
  180 |   const total = await arena.getAttribute('data-replay-total');
  181 |   expect(Number(total)).toBeGreaterThanOrEqual(Number(cursor));
  182 |   await expect(arena).toHaveAttribute('data-replay-cursor', total!);
  183 |   const resumedSettings = await settings(page);
  184 |   await resumedSettings.locator('.settings-motion').click();
  185 |   await resumedSettings.getByRole('button', { name: 'Cerrar', exact: true }).click();
  186 |   await expect(arena).toHaveAttribute('data-replay-cursor', total!);
  187 |   expect(await read(page)).toEqual(before);
  188 | });
  189 | 
```