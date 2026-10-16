# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: boss-a70.spec.ts >> A70 real authority journey: preview cancel battle loot next intention es diagon-alley
- Location: tests/browser-boss/boss-a70.spec.ts:120:5

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.focus: Test timeout of 180000ms exceeded.
Call log:
  - waiting for locator('[data-node="pasaje:6:0"] > button')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Saltar al contenido" [ref=e4] [cursor=pointer]:
    - /url: "#content"
  - banner [ref=e5]:
    - heading "Callejón Diagón Descubrimiento" [level=1] [ref=e6]:
      - text: Callejón Diagón
      - generic [ref=e7]: Descubrimiento
    - generic [ref=e8]:
      - status [ref=e9]
      - button "Una noche encantada" [ref=e10] [cursor=pointer]
    - button "Ajustes" [ref=e13] [cursor=pointer]
  - status [ref=e16]: Nodo 5 resuelto. El resultado está confirmado y guardado.
  - generic [ref=e17]:
    - strong [ref=e18]:
      - generic "Galeones" [ref=e20]: "80"
    - generic [ref=e21]:
      - generic [ref=e22]:
        - generic [ref=e24]: Energía
        - text: 45 / 50
        - meter "Energía mágica" [ref=e25]
      - generic [ref=e26]: Próximo punto a las 21:47:33.
      - button "Actualizar Energía" [ref=e27] [cursor=pointer]
    - generic [ref=e30]:
      - strong [aria-hidden] [ref=e32]: "0"
      - generic [ref=e33]: 0 Llaves de Oro
  - main [active] [ref=e34]:
    - status [ref=e35]
    - generic [ref=e36]:
      - generic:
        - complementary "Siguiente objetivo":
          - generic:
            - heading "Elige tu siguiente paso" [level=3]
            - group [ref=e37]:
              - generic "Siguiente objetivo" [ref=e38] [cursor=pointer]: "?"
            - 'generic "Etapas recorridas: 6 de 7"': 6 / 7
      - region "Resultado de nodo confirmado" [ref=e39]:
        - group [ref=e40]:
          - generic "Resultado de nodo confirmado" [ref=e41] [cursor=pointer]:
            - generic [aria-hidden] [ref=e45]:
              - generic [ref=e46]: "+20"
              - generic [ref=e48]: "+1"
            - generic [aria-hidden] [ref=e50]: ⌄
      - region "Tu Equipo" [ref=e51]:
        - heading "Tu Equipo" [level=2] [ref=e52]
        - button "Harry Potter" [ref=e54] [cursor=pointer]:
          - generic [ref=e56]: Copia propia
          - meter "Vida de Harry Potter" [ref=e59]
        - button "Ginny Weasley" [ref=e61] [cursor=pointer]:
          - generic [ref=e63]: Aliado temporal
          - meter "Vida de Ginny Weasley" [ref=e66]
        - button "Nicolás Flamel" [ref=e68] [cursor=pointer]:
          - generic [ref=e70]: Aliado temporal
          - meter "Vida de Nicolás Flamel" [ref=e73]
        - button "Ginny Weasley" [ref=e75] [cursor=pointer]:
          - generic [ref=e77]: Aliado temporal
          - meter "Vida de Ginny Weasley" [ref=e80]
        - button "Prepara tu expedición" [ref=e81] [cursor=pointer]
      - button "Ver lista de nodos" [ref=e84] [cursor=pointer]
      - generic [ref=e88]:
        - generic "Inicio"
        - button "Pacto Mágico Visitado" [disabled] [ref=e90]:
          - generic [aria-hidden] [ref=e93]: ✓
          - strong [ref=e94]: Pacto Mágico
          - generic [ref=e95]: Visitado
        - button "Pacto Mágico Visitado" [disabled] [ref=e97]:
          - generic [aria-hidden] [ref=e100]: ✓
          - strong [ref=e101]: Pacto Mágico
          - generic [ref=e102]: Visitado
        - button "Cofre de Botín Bloqueado" [disabled] [ref=e104]:
          - strong [ref=e107]: Cofre de Botín
          - generic [ref=e108]: Bloqueado
        - button "Pacto Mágico Visitado" [disabled] [ref=e110]:
          - generic [aria-hidden] [ref=e113]: ✓
          - strong [ref=e114]: Pacto Mágico
          - generic [ref=e115]: Visitado
        - button "Refugio Alquímico Bloqueado" [disabled] [ref=e117]:
          - strong [ref=e120]: Refugio Alquímico
          - generic [ref=e121]: Bloqueado
        - button "Duelo mágico Bloqueado" [disabled] [ref=e123]:
          - strong [ref=e126]: Duelo mágico
          - generic [ref=e127]: Bloqueado
        - button "Refugio Alquímico Visitado" [disabled] [ref=e129]:
          - generic [aria-hidden] [ref=e132]: ✓
          - strong [ref=e133]: Refugio Alquímico
          - generic [ref=e134]: Visitado
        - button "Encuentro Bloqueado" [disabled] [ref=e136]:
          - strong [ref=e139]: Encuentro
          - generic [ref=e140]: Bloqueado
        - button "Refugio Alquímico Bloqueado" [disabled] [ref=e142]:
          - strong [ref=e145]: Refugio Alquímico
          - generic [ref=e146]: Bloqueado
        - button "Fuego · quemadura Duelo mágico Bloqueado" [disabled] [ref=e148]:
          - generic: Fuego · quemadura
          - strong [ref=e151]: Duelo mágico
          - generic [ref=e152]: Bloqueado
        - button "Cofre de Botín Bloqueado" [disabled] [ref=e154]:
          - strong [ref=e157]: Cofre de Botín
          - generic [ref=e158]: Bloqueado
        - button "Cofre de Botín Visitado" [disabled] [ref=e160]:
          - generic [aria-hidden] [ref=e163]: ✓
          - strong [ref=e164]: Cofre de Botín
          - generic [ref=e165]: Visitado
        - button "Fuego · quemadura Duelo mágico Visitado" [disabled] [ref=e167]:
          - generic: Fuego · quemadura
          - generic [aria-hidden] [ref=e170]: ✓
          - strong [ref=e171]: Duelo mágico
          - generic [ref=e172]: Visitado
        - button "Encuentro Bloqueado" [disabled] [ref=e174]:
          - strong [ref=e177]: Encuentro
          - generic [ref=e178]: Bloqueado
        - button "Vanguardia · iniciativa Duelo mágico Bloqueado" [disabled] [ref=e180]:
          - generic: Vanguardia · iniciativa
          - strong [ref=e183]: Duelo mágico
          - generic [ref=e184]: Bloqueado
        - button "Jefe de Zona Disponible Combate · 5 Energía" [ref=e186] [cursor=pointer]:
          - generic [aria-hidden] [ref=e189]: ▴
          - strong [ref=e190]: Jefe de Zona
          - generic [ref=e191]: Disponible
          - generic [ref=e192]: Combate · 5 Energía
  - navigation "Navegación principal" [ref=e193]:
    - button "Mapa" [ref=e194] [cursor=pointer]
    - button "Álbum de Cromos" [ref=e197] [cursor=pointer]
    - button "Callejón" [ref=e200] [cursor=pointer]
    - button "Misiones" [ref=e203] [cursor=pointer]
```

# Test source

```ts
  42  |     ),
  43  |   );
  44  | }
  45  | async function preserved(page: Page) {
  46  |   return page.evaluate(() => ({
  47  |     battle: window.__a70Fixture.battle,
  48  |     game: window.__a70Fixture.game,
  49  |   }));
  50  | }
  51  | async function control(page: Page, name: string) {
  52  |   await page.locator(`[data-qa-${name}]`).evaluate((el: HTMLButtonElement) => el.click());
  53  | }
  54  | async function fits(page: Page, count: number) {
  55  |   await expect(page.locator('.pedestal')).toHaveCount(count);
  56  |   await expect
  57  |     .poll(() =>
  58  |       page.locator('.pedestal').evaluateAll((nodes) =>
  59  |         nodes.every((node) => {
  60  |           const r = node.getBoundingClientRect();
  61  |           return (
  62  |             r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1
  63  |           );
  64  |         }),
  65  |       ),
  66  |     )
  67  |     .toBe(true);
  68  |   expect(
  69  |     await page.evaluate(
  70  |       () =>
  71  |         document.documentElement.scrollHeight <= innerHeight + 1 &&
  72  |         document.documentElement.scrollWidth <= innerWidth + 1,
  73  |     ),
  74  |   ).toBe(true);
  75  | }
  76  | async function frozen(page: Page) {
  77  |   await page.evaluate(
  78  |     () =>
  79  |       new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done()))),
  80  |   );
  81  |   return page.locator('.scene-canvas').evaluate((el: HTMLElement) => ({
  82  |     angle: el.dataset.bossPropAngle,
  83  |     activity: el.dataset.bossPropActivity,
  84  |     layers: el.dataset.bossPropLayers,
  85  |     pose: el.dataset.bossPropPose,
  86  |     renders: el.dataset.renderCount,
  87  |   }));
  88  | }
  89  | async function freezeBossCast(page: Page) {
  90  |   await page.evaluate(
  91  |     () =>
  92  |       new Promise<void>((done, reject) => {
  93  |         const until = performance.now() + 15000;
  94  |         const observe = () => {
  95  |           const host = document.querySelector<HTMLElement>('.scene-canvas');
  96  |           const cursor = Number(
  97  |             document.querySelector<HTMLElement>('.battle-panel')?.dataset.replayCursor,
  98  |           );
  99  |           const event = JSON.parse(window.__a70Fixture.battle).events[cursor];
  100 |           if (
  101 |             host?.dataset.bossPropPose === 'cast' &&
  102 |             event?.kind === 'spell-cast' &&
  103 |             event.actorId === window.__a70Fixture.leader
  104 |           ) {
  105 |             document
  106 |               .querySelector<HTMLButtonElement>('.replay-controls button:first-child')!
  107 |               .click();
  108 |             done();
  109 |           } else if (performance.now() >= until)
  110 |             reject(Error('No real leader spell phase observed'));
  111 |           else requestAnimationFrame(observe);
  112 |         };
  113 |         observe();
  114 |       }),
  115 |   );
  116 | }
  117 | 
  118 | for (const language of ['es', 'en'] as const)
  119 |   for (const pack of ['diagon-alley', 'arcana'] as const) {
  120 |     test(`A70 real authority journey: preview cancel battle loot next intention ${language} ${pack}`, async ({
  121 |       page,
  122 |     }) => {
  123 |       const errors: string[] = [];
  124 |       page.on('pageerror', (error) => errors.push(error.message));
  125 |       await page.addInitScript(
  126 |         (pack) => localStorage.setItem('arcana.presentation.content-pack.v1', pack),
  127 |         pack,
  128 |       );
  129 |       if (pack === 'arcana') await page.emulateMedia({ reducedMotion: 'reduce' });
  130 |       await page.goto('/');
  131 |       if (language === 'en') await changeLanguage(page, language);
  132 |       await page.locator('.portal-enter').click();
  133 |       await startExpedition(page, language);
  134 |       const bossId = await reachNode(page, 'boss', language);
  135 |       await expectMapFits(page);
  136 |       const before = await readGame(page);
  137 |       const run = before.exploration!.run!;
  138 |       const plan = run.campaignSnapshot!.nodes.find((node) => node.nodeId === bossId)!;
  139 |       if (plan.kind !== 'boss') throw Error('Expected real saved boss plan');
  140 |       const leader = plan.opponents.find((unit) => unit.wizardId !== 'rival') ?? plan.opponents[0];
  141 |       const origin = page.locator(`[data-node="${bossId}"] > button`);
> 142 |       await origin.focus();
      |                    ^ Error: locator.focus: Test timeout of 180000ms exceeded.
  143 |       await origin.press('Enter');
  144 |       const prelude = page.locator('[data-boss-prelude]');
  145 |       await expect(prelude).toHaveAttribute('data-boss-leader', leader.id);
  146 |       await expect(prelude).toHaveAttribute('data-boss-roster-size', String(plan.opponents.length));
  147 |       expect(
  148 |         await prelude
  149 |           .locator('[data-boss-opponent]')
  150 |           .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-boss-opponent'))),
  151 |       ).toEqual(plan.opponents.map((unit) => unit.id));
  152 |       const rivalDetails = prelude.locator('.boss-opponent-details > summary');
  153 |       await rivalDetails.focus();
  154 |       await rivalDetails.press('Enter');
  155 |       await expect(prelude.locator('.boss-opponent-details')).toHaveAttribute('open', '');
  156 |       expect(await readGame(page)).toEqual(before);
  157 |       await rivalDetails.press('Enter');
  158 |       await expect(prelude.locator('.boss-opponent-details')).not.toHaveAttribute('open', '');
  159 |       expect(await readGame(page)).toEqual(before);
  160 |       if (language === 'es' && pack === 'diagon-alley') await capture(page, 'boss-preparation');
  161 |       await page.keyboard.press('Escape');
  162 |       await expect(prelude).toHaveCount(0);
  163 |       await expect(origin).toBeFocused();
  164 |       expect(await readGame(page)).toEqual(before);
  165 |       await origin.tap();
  166 |       await expect(prelude).toBeVisible();
  167 |       await changeLanguage(page, language === 'es' ? 'en' : 'es');
  168 |       await expect(prelude).toHaveAttribute('data-boss-leader', leader.id);
  169 |       await expect(prelude).toHaveAttribute('data-boss-roster-size', String(plan.opponents.length));
  170 |       expect(
  171 |         await prelude
  172 |           .locator('[data-boss-opponent]')
  173 |           .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-boss-opponent'))),
  174 |       ).toEqual(plan.opponents.map((unit) => unit.id));
  175 |       // The live locator resolves the translated dialog after the locale change.
  176 |       await rivalDetails.focus();
  177 |       await rivalDetails.press('Enter');
  178 |       await expect(prelude.locator('.boss-opponent-details')).toHaveAttribute('open', '');
  179 |       expect(await readGame(page)).toEqual(before);
  180 |       await rivalDetails.press('Enter');
  181 |       await expect(prelude.locator('.boss-opponent-details')).not.toHaveAttribute('open', '');
  182 |       expect(await readGame(page)).toEqual(before);
  183 |       await changeLanguage(page, language);
  184 |       const actionStarted = Date.now();
  185 |       await confirmEvent(page, language);
  186 |       const committed = await readGame(page);
  187 |       const receipt = committed.receipts.at(-1)!;
  188 |       if (receipt.kind !== 'advance-node' || !receipt.battle)
  189 |         throw Error('Expected committed boss receipt');
  190 |       const confirmedBattle = JSON.stringify(receipt.battle);
  191 |       await expect(page.locator('.battle-panel')).toHaveAttribute('data-boss-leader', leader.id);
  192 |       await fits(page, receipt.battle.input.player.length + receipt.battle.input.rival.length);
  193 |       const actionToUsableArenaMs = Date.now() - actionStarted;
  194 |       if (await skip(page, language).isEnabled()) await skip(page, language).click();
  195 |       await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  196 |       expect(JSON.stringify((await readGame(page)).receipts.at(-1))).toBe(JSON.stringify(receipt));
  197 |       await page
  198 |         .getByRole('button', {
  199 |           name: label(language, 'Volver al mapa', 'Back to map'),
  200 |           exact: true,
  201 |         })
  202 |         .click();
  203 |       const closure = page.locator('[data-expedition-closure="won"]');
  204 |       await expect(closure).toBeVisible();
  205 |       await expect(closure).toHaveAttribute('data-closure-boss', leader.wizardId);
  206 |       expect(await closure.locator('[data-boss-fact]').count()).toBeLessThanOrEqual(2);
  207 |       if (language === 'es' && pack === 'diagon-alley') await capture(page, 'boss-closure');
  208 |       await page.reload();
  209 |       await expect(closure).toBeVisible();
  210 |       expect(await readGame(page)).toEqual(committed);
  211 |       await expect(closure).toHaveAttribute('data-confirmed-motion', 'false');
  212 |       await closure.locator('[data-closure-action="frog"]').click();
  213 |       await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result', {
  214 |         timeout: 15000,
  215 |       });
  216 |       const opened = await readGame(page);
  217 |       expect(opened.inventory.crowns).toBe(committed.inventory.crowns);
  218 |       expect(opened.copies).toHaveLength(committed.copies.length + 1);
  219 |       await page.locator('.reveal-continue').click();
  220 |       await closure.locator('[data-closure-action="vault"]').click();
  221 |       await page.locator('.vault-lock-action').click();
  222 |       await page
  223 |         .getByRole('button', { name: label(language, 'Cancelar', 'Cancel'), exact: true })
  224 |         .click();
  225 |       expect(await readGame(page)).toEqual(opened);
  226 |       await page.locator('.vault-lock-action').click();
  227 |       await page
  228 |         .getByRole('button', {
  229 |           name: label(language, 'Confirmar canje', 'Confirm exchange'),
  230 |           exact: true,
  231 |         })
  232 |         .click();
  233 |       await expect(page.locator('.commerce-result')).toBeVisible();
  234 |       const used = await readGame(page);
  235 |       expect(used.inventory.goldKeys).toBe((opened.inventory.goldKeys ?? 0) - 1);
  236 |       await page
  237 |         .locator('nav')
  238 |         .getByRole('button', { name: label(language, 'Mapa', 'Map'), exact: true })
  239 |         .click();
  240 |       const choice = page.locator('[data-intention-choice] > button').first();
  241 |       await expect(choice).toBeVisible();
  242 |       await choice.focus();
```