# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser-boss/boss-a70.spec.ts >> A70 real authority journey: preview cancel battle loot next intention es arcana
- Location: tests/browser-boss/boss-a70.spec.ts:177:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 6
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Saltar al contenido" [ref=e4]:
    - /url: "#content"
  - banner [ref=e5]:
    - heading "El Pasaje Torcido Descubrimiento" [level=1] [ref=e6]:
      - text: El Pasaje Torcido
      - generic [ref=e7]: Descubrimiento
    - generic [ref=e8]:
      - status [ref=e9]
      - button "Una noche encantada" [ref=e10] [cursor=pointer]
  - status [ref=e13]: Nodo 6 resuelto. El resultado está confirmado y guardado.
  - generic [ref=e14]:
    - strong [ref=e15]:
      - generic "Coronas" [ref=e17]: "50"
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e21]: Esencia
        - text: 50 / 50
        - meter "Esencia Rúnica" [ref=e22]
      - generic [ref=e23]: Esencia al máximo.
      - button "Actualizar Esencia" [ref=e24] [cursor=pointer]
    - generic [ref=e27]:
      - strong [aria-hidden] [ref=e29]: "0"
      - generic [ref=e30]: 0 Llaves de Oro
  - main [ref=e31]:
    - status [ref=e32]
    - generic [ref=e33]:
      - generic:
        - complementary "Siguiente objetivo":
          - generic:
            - heading "Elige tu siguiente paso" [level=3]
            - group [ref=e34]:
              - generic "Siguiente objetivo" [ref=e35] [cursor=pointer]: "?"
            - 'generic "Etapas recorridas: 6 de 7"': 6 / 7
      - region "Resultado de nodo confirmado" [ref=e36]:
        - group [ref=e37]:
          - generic "Resultado de nodo confirmado" [ref=e38] [cursor=pointer]:
            - generic [aria-hidden] [ref=e42]: ⌄
      - region "Tu Equipo" [ref=e43]:
        - heading "Tu Equipo" [level=2] [ref=e44]
        - button "Aprendiz de Alquimia" [ref=e46] [cursor=pointer]:
          - generic [ref=e48]: Copia propia
          - meter "Vida de Aprendiz de Alquimia" [ref=e51]
        - button "Paracelso" [ref=e53] [cursor=pointer]:
          - generic [ref=e55]: Aliado temporal
          - meter "Vida de Paracelso" [ref=e58]
        - button "Vidente de Obsidiana" [ref=e60] [cursor=pointer]:
          - generic [ref=e62]: Aliado temporal
          - meter "Vida de Vidente de Obsidiana" [ref=e65]
        - button "Prepara tu expedición" [ref=e66] [cursor=pointer]
        - generic "Casas del equipo" [ref=e69]:
          - group [ref=e70]:
            - generic "Compañía del León · 1/3" [ref=e71] [cursor=pointer]: Compañía del León 1/3
          - group [ref=e76]:
            - generic "Orden de la Serpiente · 2/3" [ref=e77] [cursor=pointer]: Orden de la Serpiente 2/3
      - button "Ver lista de nodos" [ref=e82] [cursor=pointer]
      - generic [ref=e85]:
        - generic "Inicio"
        - button "Pacto Mágico · etapa 1, opción 1 · Visitado" [disabled] [ref=e87]:
          - generic [aria-hidden] [ref=e90]: ✓
          - strong [ref=e91]: Pacto Mágico
          - generic [ref=e92]: Visitado
        - button "Cofre de Botín · etapa 2, opción 1 · Bloqueado" [ref=e94] [cursor=pointer]:
          - strong [ref=e97]: Cofre de Botín
          - generic [ref=e98]: Bloqueado
        - button "Pacto Mágico · etapa 2, opción 2 · Visitado" [disabled] [ref=e100]:
          - generic [aria-hidden] [ref=e103]: ✓
          - strong [ref=e104]: Pacto Mágico
          - generic [ref=e105]: Visitado
        - button "Pacto Mágico · etapa 3, opción 1 · Bloqueado" [ref=e107] [cursor=pointer]:
          - strong [ref=e110]: Pacto Mágico
          - generic [ref=e111]: Bloqueado
        - button "Encuentro · etapa 3, opción 2 · Visitado" [disabled] [ref=e113]:
          - generic [aria-hidden] [ref=e116]: ✓
          - strong [ref=e117]: Encuentro
          - generic [ref=e118]: Visitado
        - button "Refugio Alquímico · etapa 3, opción 3 · Bloqueado" [ref=e120] [cursor=pointer]:
          - strong [ref=e123]: Refugio Alquímico
          - generic [ref=e124]: Bloqueado
        - button "Cofre de Botín · etapa 4, opción 1 · Bloqueado" [ref=e126] [cursor=pointer]:
          - strong [ref=e129]: Cofre de Botín
          - generic [ref=e130]: Bloqueado
        - button "Refugio Alquímico · etapa 4, opción 2 · Visitado" [disabled] [ref=e132]:
          - generic [aria-hidden] [ref=e135]: ✓
          - strong [ref=e136]: Refugio Alquímico
          - generic [ref=e137]: Visitado
        - button "Duelo Arcano · etapa 4, opción 3 · Bloqueado" [ref=e139] [cursor=pointer]:
          - generic: Vanguardia · iniciativa
          - strong [ref=e142]: Duelo Arcano
          - generic [ref=e143]: Bloqueado
        - button "Duelo Arcano · etapa 5, opción 1 · Bloqueado" [ref=e145] [cursor=pointer]:
          - generic: Fuego · quemadura
          - strong [ref=e148]: Duelo Arcano
          - generic [ref=e149]: Bloqueado
        - button "Encuentro · etapa 5, opción 2 · Visitado" [disabled] [ref=e151]:
          - generic [aria-hidden] [ref=e154]: ✓
          - strong [ref=e155]: Encuentro
          - generic [ref=e156]: Visitado
        - button "Duelo Arcano · etapa 5, opción 3 · Bloqueado" [ref=e158] [cursor=pointer]:
          - generic: Fuego · quemadura
          - strong [ref=e161]: Duelo Arcano
          - generic [ref=e162]: Bloqueado
        - button "Duelo Arcano · etapa 6, opción 1 · Bloqueado" [ref=e164] [cursor=pointer]:
          - generic: Vanguardia · iniciativa
          - strong [ref=e167]: Duelo Arcano
          - generic [ref=e168]: Bloqueado
        - button "Refugio Alquímico · etapa 6, opción 2 · Visitado" [disabled] [ref=e170]:
          - generic [aria-hidden] [ref=e173]: ✓
          - strong [ref=e174]: Refugio Alquímico
          - generic [ref=e175]: Visitado
        - button "Cofre de Botín · etapa 6, opción 3 · Bloqueado" [ref=e177] [cursor=pointer]:
          - strong [ref=e180]: Cofre de Botín
          - generic [ref=e181]: Bloqueado
        - button "Jefe de Zona · etapa 7, opción 1 · Disponible" [ref=e183] [cursor=pointer]:
          - generic [aria-hidden] [ref=e186]: ▴
          - strong [ref=e187]: Jefe de Zona
          - generic [ref=e188]: Disponible
          - generic [ref=e189]: Combate · 5 Esencia
      - dialog "Confirmación de nodo" [ref=e190]:
        - button "Ajustes" [ref=e191] [cursor=pointer]
        - heading "Jefe de Zona" [level=3] [ref=e194]
        - paragraph [ref=e195]: Consume 5 Esencia. Combate automático con el equipo actual.
        - generic [ref=e196]:
          - region "Circe" [ref=e197]:
            - generic [ref=e198]:
              - generic [ref=e199]:
                - heading "Circe" [level=4] [ref=e200]
                - generic [ref=e201]: Fuego
                - generic [ref=e202]: 3 · Rivales
              - generic "Rivales" [ref=e203]:
                - generic [ref=e208]:
                  - generic [ref=e209]: Rival
                  - generic [ref=e210]: Neutral
                - generic [ref=e213]:
                  - generic [ref=e214]: Rival
                  - generic [ref=e215]: Neutral
            - group [ref=e216]:
              - generic "Conocer al rival" [ref=e217] [cursor=pointer]
          - generic "Botín si ganas; entrega fija en cofres" [ref=e220]:
            - generic "Coronas" [ref=e221]:
              - strong [ref=e223]: "50"
            - generic "Llaves de Oro" [ref=e224]:
              - strong [ref=e226]: "1"
            - strong [ref=e229]: "1"
            - generic [ref=e230]: 50 Coronas, 1 llaves, 1 sapos, 0 grageas.
        - generic [ref=e231]:
          - region "Tu equipo" [ref=e232]:
            - heading "Tu equipo" [level=4] [ref=e233]
            - generic [ref=e234]:
              - 'button "Preparar Aprendiz de Alquimia, puesto 1. Copia propia. PV 100/100, PM 40/40. Equipo: Varita de Abedul · Sin núcleo · +2 · ×1, Céfiro Cadete." [ref=e235] [cursor=pointer]':
                - generic [aria-hidden] [ref=e238]: "1"
                - generic [aria-hidden] [ref=e240]: Aprendiz de Alquimia
                - generic [aria-hidden] [ref=e241]:
                  - generic [ref=e242]: PV 100/100
                  - generic [ref=e243]: PM 40/40
              - button "Preparar Paracelso, puesto 2. Solo esta expedición. PV 80/80, PM 40/40." [ref=e249] [cursor=pointer]:
                - generic [aria-hidden] [ref=e252]: "2"
                - generic [aria-hidden] [ref=e254]: Paracelso
                - generic [aria-hidden] [ref=e255]:
                  - generic [ref=e256]: PV 80/80
                  - generic [ref=e257]: PM 40/40
              - button "Preparar Vidente de Obsidiana, puesto 3. Solo esta expedición. PV 80/80, PM 40/40." [ref=e258] [cursor=pointer]:
                - generic [aria-hidden] [ref=e261]: "3"
                - generic [aria-hidden] [ref=e263]: Vidente de Obsidiana
                - generic [aria-hidden] [ref=e264]:
                  - generic [ref=e265]: PV 80/80
                  - generic [ref=e266]: PM 40/40
            - button "Preparar equipo" [ref=e267] [cursor=pointer]
            - generic "Casas del equipo" [ref=e269]:
              - group [ref=e270]:
                - generic "Compañía del León · 1/3" [ref=e271] [cursor=pointer]: Compañía del León 1/3
              - group [ref=e276]:
                - generic "Orden de la Serpiente · 2/3" [ref=e277] [cursor=pointer]: Orden de la Serpiente 2/3
            - group [ref=e282]:
              - generic "Sinergias de afinidad" [ref=e283] [cursor=pointer]: Sin bono de afinidad
          - group [ref=e286]:
            - 'generic "Preparar Grageas. Reserva: 0." [ref=e287] [cursor=pointer]':
              - generic [ref=e289]:
                - generic [ref=e290]: Grageas del Azar
                - strong [aria-hidden] [ref=e291]: ×0
              - text: ⌄
        - generic [ref=e292]:
          - button "Desafiar al jefe" [active] [ref=e293] [cursor=pointer]:
            - generic "Consume 5 Esencia. Combate automático con el equipo actual." [ref=e296]:
              - strong [ref=e298]: "5"
          - button "Cancelar" [ref=e299] [cursor=pointer]:
            - generic [aria-hidden] [ref=e300]: ×
  - navigation "Navegación principal" [ref=e301]:
    - button "Mapa" [ref=e302] [cursor=pointer]
    - button "Cromodex" [ref=e305] [cursor=pointer]
    - button "Bazar" [ref=e308] [cursor=pointer]
    - button "Misiones" [ref=e311] [cursor=pointer]
```

# Test source

```ts
  107 |                   viewport,
  108 |                 });
  109 |             }
  110 |           }
  111 |           const root = document.documentElement;
  112 |           if (root.scrollHeight > innerHeight + 1 || root.scrollWidth > innerWidth + 1)
  113 |             offenders.push({
  114 |               kind: 'document',
  115 |               violations: ['page-overflow'],
  116 |               scrollWidth: root.scrollWidth,
  117 |               scrollHeight: root.scrollHeight,
  118 |               viewport,
  119 |             });
  120 |           return offenders;
  121 |         }),
  122 |       {
  123 |         message:
  124 |           'Every actor, figure, name and health display must fit its pedestal and viewport without page scroll',
  125 |       },
  126 |     )
  127 |     .toEqual([]);
  128 | }
  129 | 
  130 | async function frozen(page: Page) {
  131 |   await page.evaluate(
  132 |     () =>
  133 |       new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done()))),
  134 |   );
  135 |   return page.locator('.scene-canvas').evaluate((el: HTMLElement) => ({
  136 |     angle: el.dataset.bossPropAngle,
  137 |     activity: el.dataset.bossPropActivity,
  138 |     scaleX: el.dataset.bossPropScaleX,
  139 |     scaleY: el.dataset.bossPropScaleY,
  140 |     layers: el.dataset.bossPropLayers,
  141 |     pose: el.dataset.bossPropPose,
  142 |     renders: el.dataset.renderCount,
  143 |   }));
  144 | }
  145 | async function freezeBossCast(page: Page) {
  146 |   await page.evaluate(
  147 |     () =>
  148 |       new Promise<void>((done, reject) => {
  149 |         const events = JSON.parse(window.__a70Fixture.battle).events;
  150 |         const until = performance.now() + 15000;
  151 |         const observe = () => {
  152 |           const host = document.querySelector<HTMLElement>('.scene-canvas');
  153 |           const cursor = Number(
  154 |             document.querySelector<HTMLElement>('.battle-panel')?.dataset.replayCursor,
  155 |           );
  156 |           const event = events[cursor];
  157 |           if (
  158 |             host?.dataset.bossPropPose === 'cast' &&
  159 |             event?.kind === 'spell-cast' &&
  160 |             event.actorId === window.__a70Fixture.leader
  161 |           ) {
  162 |             document.querySelector<HTMLButtonElement>('.arena-pause')!.click();
  163 |             done();
  164 |           } else if (performance.now() >= until)
  165 |             reject(Error('No real leader spell phase observed'));
  166 |           else requestAnimationFrame(observe);
  167 |         };
  168 |         observe();
  169 |       }),
  170 |   );
  171 |   await expect(page.locator('#arena-options')).toBeVisible();
  172 |   await closeBattleOptions(page);
  173 | }
  174 | 
  175 | for (const language of ['es', 'en'] as const)
  176 |   for (const pack of ['diagon-alley', 'arcana'] as const) {
  177 |     test(`A70 real authority journey: preview cancel battle loot next intention ${language} ${pack}`, async ({
  178 |       page,
  179 |     }) => {
  180 |       const errors: string[] = [];
  181 |       page.on('pageerror', (error) => errors.push(error.message));
  182 |       await page.addInitScript(
  183 |         (pack) => localStorage.setItem('arcana.presentation.content-pack.v1', pack),
  184 |         pack,
  185 |       );
  186 |       if (pack === 'arcana') await page.emulateMedia({ reducedMotion: 'reduce' });
  187 |       await page.goto('/');
  188 |       if (language === 'en') await changeLanguage(page, language);
  189 |       await page.locator('.portal-enter').click();
  190 |       await startExpedition(page, language);
  191 |       const bossId = await reachNode(page, 'boss', language);
  192 |       await expectMapFits(page);
  193 |       const before = await readGame(page);
  194 |       const run = before.exploration!.run!;
  195 |       const plan = run.campaignSnapshot!.nodes.find((node) => node.nodeId === bossId)!;
  196 |       if (plan.kind !== 'boss') throw Error('Expected real saved boss plan');
  197 |       const leader = plan.opponents.find((unit) => unit.wizardId !== 'rival') ?? plan.opponents[0];
  198 |       const origin = page.locator(`button[data-node="${bossId}"]`);
  199 |       await origin.focus();
  200 |       await origin.press('Enter');
  201 |       const prelude = page.locator('[data-boss-prelude]');
  202 |       await expect(prelude).toHaveAttribute('data-boss-leader', leader.id);
  203 |       await expect(prelude).toHaveAttribute('data-boss-roster-size', String(plan.opponents.length));
  204 |       // Initial consultation must expose preparation, not place it under the sticky fight footer.
  205 |       // Visibility alone does not detect an overlapping sibling or auto-scroll on click.
  206 |       const consultation = page.locator('.node-event-dialog');
> 207 |       expect(await consultation.evaluate((element) => element.scrollTop)).toBe(0);
      |                                                                           ^ Error: expect(received).toBe(expected) // Object.is equality
  208 |       const footerBox = await page.locator('.node-combat-actions').boundingBox();
  209 |       for (const control of [
  210 |         page.locator('.node-team-prepare'),
  211 |         page.locator('.node-bean-preparation > summary'),
  212 |       ]) {
  213 |         await expect(control).toBeInViewport({ ratio: 1 });
  214 |         const box = await control.boundingBox();
  215 |         expect(box!.y + box!.height).toBeLessThanOrEqual(footerBox!.y);
  216 |       }
  217 |       expect(
  218 |         await prelude
  219 |           .locator('[data-boss-opponent]')
  220 |           .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-boss-opponent'))),
  221 |       ).toEqual(plan.opponents.map((unit) => unit.id));
  222 |       const rivalDetails = prelude.locator('.boss-opponent-details > summary');
  223 |       await rivalDetails.focus();
  224 |       await rivalDetails.press('Enter');
  225 |       await expect(prelude.locator('.boss-opponent-details')).toHaveAttribute('open', '');
  226 |       expect(await readGame(page)).toEqual(before);
  227 |       await rivalDetails.press('Enter');
  228 |       await expect(prelude.locator('.boss-opponent-details')).not.toHaveAttribute('open', '');
  229 |       expect(await readGame(page)).toEqual(before);
  230 |       if (language === 'es' && pack === 'diagon-alley') await capture(page, 'boss-preparation');
  231 |       await page.keyboard.press('Escape');
  232 |       await expect(prelude).toHaveCount(0);
  233 |       await expect(origin).toBeFocused();
  234 |       expect(await readGame(page)).toEqual(before);
  235 |       await origin.tap();
  236 |       await expect(prelude).toBeVisible();
  237 |       await changeLanguage(page, language === 'es' ? 'en' : 'es');
  238 |       await expect(prelude).toHaveAttribute('data-boss-leader', leader.id);
  239 |       await expect(prelude).toHaveAttribute('data-boss-roster-size', String(plan.opponents.length));
  240 |       expect(
  241 |         await prelude
  242 |           .locator('[data-boss-opponent]')
  243 |           .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-boss-opponent'))),
  244 |       ).toEqual(plan.opponents.map((unit) => unit.id));
  245 |       // The live locator resolves the translated dialog after the locale change.
  246 |       await rivalDetails.focus();
  247 |       await rivalDetails.press('Enter');
  248 |       await expect(prelude.locator('.boss-opponent-details')).toHaveAttribute('open', '');
  249 |       expect(await readGame(page)).toEqual(before);
  250 |       await rivalDetails.press('Enter');
  251 |       await expect(prelude.locator('.boss-opponent-details')).not.toHaveAttribute('open', '');
  252 |       expect(await readGame(page)).toEqual(before);
  253 |       await changeLanguage(page, language);
  254 |       const prepareTeam = page.locator('.node-team-prepare');
  255 |       await prepareTeam.click();
  256 |       await expect(page.locator('.preparation-dialog[open]')).toBeVisible();
  257 |       expect(await readGame(page)).toEqual(before);
  258 |       await page.keyboard.press('Escape');
  259 |       await expect(prepareTeam).toBeFocused();
  260 |       await expect(prelude).toBeVisible();
  261 |       expect(await readGame(page)).toEqual(before);
  262 |       const actionStarted = Date.now();
  263 |       await confirmEvent(page, language);
  264 |       const committed = await readGame(page);
  265 |       const receipt = committed.receipts.at(-1)!;
  266 |       if (receipt.kind !== 'advance-node' || !receipt.battle)
  267 |         throw Error('Expected committed boss receipt');
  268 |       const confirmedBattle = JSON.stringify(receipt.battle);
  269 |       await expect(page.locator('.battle-panel')).toHaveAttribute('data-boss-leader', leader.id);
  270 |       await fits(page, receipt.battle.input.player.length + receipt.battle.input.rival.length);
  271 |       const actionToDomUsableUpperBoundMs = Date.now() - actionStarted;
  272 |       await expect(page.locator('.scene-canvas')).toHaveAttribute('data-art-ready', 'true');
  273 |       const actionToFiguresReadyUpperBoundMs = Date.now() - actionStarted;
  274 |       await skipBattle(page);
  275 |       await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  276 |       expect(JSON.stringify((await readGame(page)).receipts.at(-1))).toBe(JSON.stringify(receipt));
  277 |       await leaveBattle(page);
  278 |       const closure = page.locator('[data-expedition-closure="won"]');
  279 |       await expect(closure).toBeVisible();
  280 |       await expect(closure).toHaveAttribute('data-closure-boss', leader.wizardId);
  281 |       expect(await closure.locator('[data-boss-fact]').count()).toBeLessThanOrEqual(2);
  282 |       if (language === 'es' && pack === 'diagon-alley') {
  283 |         await expect(closure.locator('.closure-spoils')).toHaveCSS('opacity', '1');
  284 |         await capture(page, 'boss-closure');
  285 |       }
  286 |       await page.reload();
  287 |       await expect(closure).toBeVisible();
  288 |       expect(await readGame(page)).toEqual(committed);
  289 |       await expect(closure).toHaveAttribute('data-confirmed-motion', 'false');
  290 |       await closure.locator('[data-closure-action="frog"]').click();
  291 |       await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result', {
  292 |         timeout: 15000,
  293 |       });
  294 |       const opened = await readGame(page);
  295 |       expect(opened.inventory.crowns).toBe(committed.inventory.crowns);
  296 |       expect(opened.copies).toHaveLength(committed.copies.length + 1);
  297 |       await page.locator('.reveal-continue').click();
  298 |       await closure.locator('[data-closure-action="vault"]').click();
  299 |       await page.locator('.vault-lock-action').click();
  300 |       await page
  301 |         .getByRole('button', { name: label(language, 'Cancelar', 'Cancel'), exact: true })
  302 |         .click();
  303 |       expect(await readGame(page)).toEqual(opened);
  304 |       await page.locator('.vault-lock-action').click();
  305 |       await page
  306 |         .getByRole('button', {
  307 |           name: label(language, 'Confirmar canje', 'Confirm exchange'),
```