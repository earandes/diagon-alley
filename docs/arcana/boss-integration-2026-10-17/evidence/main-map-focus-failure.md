# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: replay.spec.ts >> branching map and equivalent list keep identical accessible actions with WebGL absent
- Location: tests/browser-trial/replay.spec.ts:63:1

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator: locator('[data-pact-candidate]:not(:disabled), [data-pact-choice]:not(:disabled), .node-confirm-action:not(:disabled), [data-pact-action="recruit"]').first()
Expected: focused
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeFocused" locator('[data-pact-candidate]:not(:disabled), [data-pact-choice]:not(:disabled), .node-confirm-action:not(:disabled), [data-pact-action="recruit"]').first() with timeout 5000ms
  - waiting for locator('[data-pact-candidate]:not(:disabled), [data-pact-choice]:not(:disabled), .node-confirm-action:not(:disabled), [data-pact-action="recruit"]').first()

```

```yaml
- link "Saltar al contenido":
  - /url: "#content"
- banner:
  - heading "El Pasaje Torcido Descubrimiento" [level=1]
  - status
  - button "Una noche encantada"
- status: Nodo 4 resuelto. El resultado está confirmado y guardado.
- strong: "70"
- text: Esencia 45 / 50
- meter "Esencia Rúnica"
- text: Próximo punto a las 09:33:03.
- button "Actualizar Esencia"
- text: 0 Llaves de Oro
- main:
  - status
  - complementary "Siguiente objetivo":
    - heading "Elige tu siguiente paso" [level=3]
    - group: "?"
    - text: 5 / 7
  - region "Resultado de nodo confirmado":
    - group
  - region "Tu Equipo":
    - heading "Tu Equipo" [level=2]
    - button "Aprendiz de Alquimia":
      - text: Copia propia
      - meter "Vida de Aprendiz de Alquimia"
    - button "Tejedora de Runas":
      - text: Aliado temporal
      - meter "Vida de Tejedora de Runas"
    - button "Nicolás Flamel":
      - text: Aliado temporal
      - meter "Vida de Nicolás Flamel"
    - button "Tejedora de Runas":
      - text: Aliado temporal
      - meter "Vida de Tejedora de Runas"
    - button "Prepara tu expedición"
  - button "Ver mapa ramificado"
  - button "Jefe de Zona Bloqueado" [disabled]:
    - strong: Jefe de Zona
    - text: Bloqueado
  - button "Encuentro Disponible Botín, cura o daño":
    - strong: Encuentro
    - text: Disponible Botín, cura o daño
  - button "Vanguardia · iniciativa Duelo Arcano Bloqueado" [disabled]:
    - text: Vanguardia · iniciativa
    - strong: Duelo Arcano
    - text: Bloqueado
  - button "Encuentro Bloqueado" [disabled]:
    - strong: Encuentro
    - text: Bloqueado
  - button "Vanguardia · iniciativa Duelo Arcano Visitado" [disabled]:
    - text: Vanguardia · iniciativa
    - strong: Duelo Arcano
    - text: Visitado
  - button "Fuego · quemadura Duelo Arcano Bloqueado" [disabled]:
    - text: Fuego · quemadura
    - strong: Duelo Arcano
    - text: Bloqueado
  - button "Cofre de Botín Bloqueado" [disabled]:
    - strong: Cofre de Botín
    - text: Bloqueado
  - button "Refugio Alquímico Bloqueado" [disabled]:
    - strong: Refugio Alquímico
    - text: Bloqueado
  - button "Fuego · quemadura Duelo Arcano Bloqueado" [disabled]:
    - text: Fuego · quemadura
    - strong: Duelo Arcano
    - text: Bloqueado
  - button "Refugio Alquímico Visitado" [disabled]:
    - strong: Refugio Alquímico
    - text: Visitado
  - button "Cofre de Botín Bloqueado" [disabled]:
    - strong: Cofre de Botín
    - text: Bloqueado
  - button "Refugio Alquímico Bloqueado" [disabled]:
    - strong: Refugio Alquímico
    - text: Bloqueado
  - button "Pacto Mágico Visitado" [disabled]:
    - strong: Pacto Mágico
    - text: Visitado
  - button "Pacto Mágico Visitado" [disabled]:
    - strong: Pacto Mágico
    - text: Visitado
  - button "Cofre de Botín Bloqueado" [disabled]:
    - strong: Cofre de Botín
    - text: Bloqueado
  - button "Pacto Mágico Visitado" [disabled]:
    - strong: Pacto Mágico
    - text: Visitado
  - dialog "Confirmación de nodo":
    - button "Ajustes"
    - heading "Encuentro" [level=3]
    - paragraph: Resolver este evento con el equipo actual.
    - heading "Un remedio a tiempo" [level=4]
    - text: Nicolás Flamel
    - group
    - group "Elige tu trato":
      - 'button "Un integrante Recibes: +40 % PV Entregas: −20 % PM"':
        - strong: Un integrante
        - text: "Recibes: +40 % PV Entregas: −20 % PM"
      - 'button "Todo el equipo Recibes: +15 % PV Entregas: −10 % PM"':
        - strong: Todo el equipo
        - text: "Recibes: +15 % PV Entregas: −10 % PM"
    - paragraph: Elige un trato para ver cómo queda tu equipo.
    - button "Seguir de largo"
    - button "Aceptar trato" [disabled]
    - button "Cancelar"
- navigation "Navegación principal":
  - button "Mapa"
  - button "Cromodex"
  - button "Bazar"
  - button "Misiones"
```

# Test source

```ts
  1   | import { startExpedition } from './game-fixture';
  2   | import { changeLanguage } from './game-fixture';
  3   | import { reachNode, confirmEvent } from './route-helpers';
  4   | import { expect, test, type Page } from './game-fixture';
  5   | import { writeFile } from 'node:fs/promises';
  6   | const battle = async (page: Page) => {
  7   |   await page.goto('/');
  8   |   await page.getByRole('button', { name: 'Comenzar ensayo local', exact: true }).click();
  9   |   await startExpedition(page);
  10  |   const duelId = await reachNode(page, 'duel', 'es');
  11  |   await page.locator(`[data-node="${duelId}"]`).click();
  12  |   await confirmEvent(page, 'es');
  13  |   await expect(page.getByRole('heading', { name: 'Arena de Combate' })).toBeVisible();
  14  | };
  15  | const economic = (page: Page) =>
  16  |   page.evaluate(async () => {
  17  |     const { state } = await (await fetch('/api/state')).json();
  18  |     return {
  19  |       revision: state.revision,
  20  |       inventory: state.inventory,
  21  |       run: state.exploration?.run ?? null,
  22  |       receiptCount: state.receipts.length,
  23  |     };
  24  |   });
  25  | test('keeps the first available map node above the fixed navigation after starting', async ({
  26  |   page,
  27  | }) => {
  28  |   await page.goto('/');
  29  |   await page.getByRole('button', { name: 'Comenzar ensayo local', exact: true }).click();
  30  |   await startExpedition(page);
  31  |   const first = page.locator('[data-node="pasaje:0:0"]');
  32  |   await expect(first).toBeInViewport();
  33  |   const box = await first.boundingBox();
  34  |   expect(box!.y + box!.height).toBeLessThan(760);
  35  | });
  36  | test('pause, Auto, 2x, language and skip only replay the committed log', async ({ page }) => {
  37  |   let posts = 0;
  38  |   page.on('request', (r) => {
  39  |     if (r.method() === 'POST') posts++;
  40  |   });
  41  |   await battle(page);
  42  |   const arena = page.locator('[data-replay-cursor]');
  43  |   await page.getByRole('button', { name: 'Pausa', exact: true }).click();
  44  |   const cursor = await arena.getAttribute('data-replay-cursor'),
  45  |     before = await economic(page),
  46  |     count = posts;
  47  |   await page.waitForTimeout(900);
  48  |   expect(await arena.getAttribute('data-replay-cursor')).toBe(cursor);
  49  |   await page.getByRole('button', { name: '2x', exact: true }).click();
  50  |   await expect(page.getByRole('button', { name: '2x', exact: true })).toHaveAttribute(
  51  |     'aria-pressed',
  52  |     'true',
  53  |   );
  54  |   await page.getByRole('button', { name: 'Auto', exact: true }).click();
  55  |   await expect.poll(() => arena.getAttribute('data-replay-cursor')).not.toBe(cursor);
  56  |   await changeLanguage(page, 'en');
  57  |   await expect(page.getByRole('heading', { name: 'Combat Arena' })).toBeVisible();
  58  |   await page.getByRole('button', { name: 'Skip playback', exact: true }).click();
  59  |   await expect(page.getByRole('status').filter({ hasText: /^Victory$/ })).toBeVisible();
  60  |   expect(await economic(page)).toEqual(before);
  61  |   expect(posts).toBe(count);
  62  | });
  63  | test('branching map and equivalent list keep identical accessible actions with WebGL absent', async ({
  64  |   page,
  65  | }) => {
  66  |   await page.addInitScript(() => {
  67  |     const original = HTMLCanvasElement.prototype.getContext;
  68  |     HTMLCanvasElement.prototype.getContext = function (
  69  |       this: HTMLCanvasElement,
  70  |       type: string,
  71  |       ...args: unknown[]
  72  |     ) {
  73  |       return type === 'webgl' || type === 'webgl2'
  74  |         ? null
  75  |         : Reflect.apply(original, this, [type, ...args]);
  76  |     } as typeof original;
  77  |   });
  78  |   await page.emulateMedia({ reducedMotion: 'reduce' });
  79  |   await battle(page);
  80  |   await expect(page.getByRole('status').filter({ hasText: /^Victoria$/ })).toBeVisible();
  81  |   await expect(
  82  |     page
  83  |       .getByText(
  84  |         'Visualización gráfica no disponible. Todas las acciones y resultados siguen accesibles.',
  85  |       )
  86  |       .first(),
  87  |   ).toBeVisible();
  88  |   await page.getByRole('button', { name: 'Volver al mapa', exact: true }).click();
  89  |   await page.getByRole('button', { name: 'Ver lista de nodos', exact: true }).click();
  90  |   const next = page.locator('[data-node]:not(:disabled)').first();
  91  |   await expect(next).toBeEnabled();
  92  |   await next.click();
  93  |   await expect(
  94  |     page
  95  |       .locator(
  96  |         '[data-pact-candidate]:not(:disabled), [data-pact-choice]:not(:disabled), .node-confirm-action:not(:disabled), [data-pact-action="recruit"]',
  97  |       )
  98  |       .first(),
> 99  |   ).toBeFocused();
      |     ^ Error: expect(locator).toBeFocused() failed
  100 |   await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  101 |   await expect(next).toBeFocused();
  102 | });
  103 | test('measures real WebGL rendering and responsive layout, without attributing emulation to a phone', async ({
  104 |   page,
  105 | }, info) => {
  106 |   await battle(page);
  107 |   const canvas = page.locator('.arena-stage .scene-canvas');
  108 |   await expect(canvas).toHaveAttribute('data-renderer', 'webgl');
  109 |   const profiles = [];
  110 |   for (const viewport of [
  111 |     { width: 320, height: 844 },
  112 |     { width: 390, height: 844 },
  113 |     { width: 1280, height: 900 },
  114 |   ]) {
  115 |     await page.setViewportSize(viewport);
  116 |     const profile = await page.evaluate(async () => {
  117 |       await new Promise<void>((resolve) => {
  118 |         const start = performance.now();
  119 |         const warm = (time: number) => {
  120 |           if (time - start < 500) requestAnimationFrame(warm);
  121 |           else resolve();
  122 |         };
  123 |         requestAnimationFrame(warm);
  124 |       });
  125 |       const host = document.querySelector<HTMLElement>('.arena-stage .scene-canvas')!,
  126 |         before = Number(host.dataset.renderCount),
  127 |         times: number[] = [];
  128 |       await new Promise<void>((resolve) => {
  129 |         const start = performance.now();
  130 |         const sample = (time: number) => {
  131 |           times.push(time);
  132 |           if (time - start < 2200) requestAnimationFrame(sample);
  133 |           else resolve();
  134 |         };
  135 |         requestAnimationFrame(sample);
  136 |       });
  137 |       const elapsed = times.at(-1)! - times[0];
  138 |       return {
  139 |         viewport: { width: innerWidth, height: innerHeight },
  140 |         userAgent: navigator.userAgent,
  141 |         displayFps: ((times.length - 1) * 1000) / elapsed,
  142 |         rendererDraws: Number(host.dataset.renderCount) - before,
  143 |         sampleMs: elapsed,
  144 |         resizeWarmupMs: 500,
  145 |         horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
  146 |       };
  147 |     });
  148 |     expect(profile.rendererDraws).toBeGreaterThan(0);
  149 |     expect(profile.horizontalOverflow).toBe(false);
  150 |     profiles.push(profile);
  151 |   }
  152 |   await writeFile(info.outputPath('webgl-profile.json'), JSON.stringify(profiles, null, 2));
  153 |   await info.attach('WebGL profile', {
  154 |     body: JSON.stringify(profiles),
  155 |     contentType: 'application/json',
  156 |   });
  157 | });
  158 | test('skipping a GSAP reveal and changing language preserves the confirmed card without another POST', async ({
  159 |   page,
  160 | }) => {
  161 |   let posts = 0;
  162 |   page.on('request', (r) => {
  163 |     if (r.method() === 'POST') posts++;
  164 |   });
  165 |   await page.goto('/');
  166 |   await page.getByRole('button', { name: 'Comenzar ensayo local', exact: true }).click();
  167 |   await page.getByRole('button', { name: 'Bazar', exact: true }).click();
  168 |   await page.locator('[data-shop="confectionery"]').click();
  169 |   await page.getByRole('button', { name: 'Comprar y abrir 1 · 10 Coronas', exact: true }).click();
  170 |   await expect(page.getByRole('heading', { name: 'Cromo confirmado' })).toBeVisible();
  171 |   const before = await economic(page),
  172 |     count = posts;
  173 |   await page.getByRole('button', { name: 'Omitir animación', exact: true }).click();
  174 |   await changeLanguage(page, 'en');
  175 |   await expect(page.getByRole('heading', { name: 'Confirmed card' })).toBeVisible();
  176 |   expect(await economic(page)).toEqual(before);
  177 |   expect(posts).toBe(count);
  178 | });
  179 | test('falls back to the static confirmed result after a WebGL context loss event without another operation', async ({
  180 |   page,
  181 | }) => {
  182 |   await battle(page);
  183 |   await expect(page.locator('.arena-stage .scene-canvas')).toHaveAttribute(
  184 |     'data-renderer',
  185 |     'webgl',
  186 |   );
  187 |   const before = await economic(page);
  188 |   await page
  189 |     .locator('.arena-stage canvas')
  190 |     .evaluate((canvas) =>
  191 |       canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })),
  192 |     );
  193 |   await expect(
  194 |     page.getByText(
  195 |       'Visualización gráfica no disponible. Todas las acciones y resultados siguen accesibles.',
  196 |     ),
  197 |   ).toBeVisible();
  198 |   await expect(page.getByRole('status').filter({ hasText: /^Victoria$/ })).toBeVisible();
  199 |   expect(await economic(page)).toEqual(before);
```
