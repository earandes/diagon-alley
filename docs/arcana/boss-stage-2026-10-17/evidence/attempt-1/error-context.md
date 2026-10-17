# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser-boss/boss-a70.spec.ts >> A70 real authority journey: preview cancel battle loot next intention es diagon-alley
- Location: tests/browser-boss/boss-a70.spec.ts:123:5

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 181.29856872558594
Received:    611.123779296875
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
  - status [ref=e13]: Nodo 6 resuelto. El resultado está confirmado y guardado.
  - generic [ref=e14]:
    - strong [ref=e15]:
      - generic "Galeones" [ref=e17]: "60"
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e21]: Energía
        - text: 50 / 50
        - meter "Energía mágica" [ref=e22]
      - generic [ref=e23]: Energía al máximo.
      - button "Actualizar Energía" [ref=e24] [cursor=pointer]
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
        - button "Harry Potter" [ref=e46] [cursor=pointer]:
          - generic [ref=e48]: Copia propia
          - meter "Vida de Harry Potter" [ref=e51]
        - button "Ginny Weasley" [ref=e53] [cursor=pointer]:
          - generic [ref=e55]: Aliado temporal
          - meter "Vida de Ginny Weasley" [ref=e58]
        - button "Nicolás Flamel" [ref=e60] [cursor=pointer]:
          - generic [ref=e62]: Aliado temporal
          - meter "Vida de Nicolás Flamel" [ref=e65]
        - button "Ginny Weasley" [ref=e67] [cursor=pointer]:
          - generic [ref=e69]: Aliado temporal
          - meter "Vida de Ginny Weasley" [ref=e72]
        - button "Prepara tu expedición" [ref=e73] [cursor=pointer]
      - button "Ver lista de nodos" [ref=e76] [cursor=pointer]
      - generic [ref=e80]:
        - generic "Inicio"
        - button "Pacto Mágico Visitado" [disabled] [ref=e82]:
          - generic [aria-hidden] [ref=e85]: ✓
          - strong [ref=e86]: Pacto Mágico
          - generic [ref=e87]: Visitado
        - button "Cofre de Botín Bloqueado" [disabled] [ref=e89]:
          - strong [ref=e92]: Cofre de Botín
          - generic [ref=e93]: Bloqueado
        - button "Pacto Mágico Visitado" [disabled] [ref=e95]:
          - generic [aria-hidden] [ref=e98]: ✓
          - strong [ref=e99]: Pacto Mágico
          - generic [ref=e100]: Visitado
        - button "Pacto Mágico Visitado" [disabled] [ref=e102]:
          - generic [aria-hidden] [ref=e105]: ✓
          - strong [ref=e106]: Pacto Mágico
          - generic [ref=e107]: Visitado
        - button "Duelo mágico Bloqueado" [disabled] [ref=e109]:
          - strong [ref=e112]: Duelo mágico
          - generic [ref=e113]: Bloqueado
        - button "Encuentro Bloqueado" [disabled] [ref=e115]:
          - strong [ref=e118]: Encuentro
          - generic [ref=e119]: Bloqueado
        - button "Cofre de Botín Visitado" [disabled] [ref=e121]:
          - generic [aria-hidden] [ref=e124]: ✓
          - strong [ref=e125]: Cofre de Botín
          - generic [ref=e126]: Visitado
        - button "Refugio Alquímico Bloqueado" [disabled] [ref=e128]:
          - strong [ref=e131]: Refugio Alquímico
          - generic [ref=e132]: Bloqueado
        - button "Vanguardia · iniciativa Duelo mágico Bloqueado" [disabled] [ref=e134]:
          - generic: Vanguardia · iniciativa
          - strong [ref=e137]: Duelo mágico
          - generic [ref=e138]: Bloqueado
        - button "Refugio Alquímico Visitado" [disabled] [ref=e140]:
          - generic [aria-hidden] [ref=e143]: ✓
          - strong [ref=e144]: Refugio Alquímico
          - generic [ref=e145]: Visitado
        - button "Fuego · quemadura Duelo mágico Bloqueado" [disabled] [ref=e147]:
          - generic: Fuego · quemadura
          - strong [ref=e150]: Duelo mágico
          - generic [ref=e151]: Bloqueado
        - button "Vanguardia · iniciativa Duelo mágico Bloqueado" [disabled] [ref=e153]:
          - generic: Vanguardia · iniciativa
          - strong [ref=e156]: Duelo mágico
          - generic [ref=e157]: Bloqueado
        - button "Encuentro Visitado" [disabled] [ref=e159]:
          - generic [aria-hidden] [ref=e162]: ✓
          - strong [ref=e163]: Encuentro
          - generic [ref=e164]: Visitado
        - button "Refugio Alquímico Bloqueado" [disabled] [ref=e166]:
          - strong [ref=e169]: Refugio Alquímico
          - generic [ref=e170]: Bloqueado
        - button "Cofre de Botín Bloqueado" [disabled] [ref=e172]:
          - strong [ref=e175]: Cofre de Botín
          - generic [ref=e176]: Bloqueado
        - button "Jefe de Zona Disponible Combate · 5 Energía" [ref=e178] [cursor=pointer]:
          - generic [aria-hidden] [ref=e181]: ▴
          - strong [ref=e182]: Jefe de Zona
          - generic [ref=e183]: Disponible
          - generic [ref=e184]: Combate · 5 Energía
      - dialog "Confirmación de nodo" [ref=e185]:
        - button "Ajustes" [ref=e186] [cursor=pointer]
        - heading "Jefe de Zona" [level=3] [ref=e189]
        - paragraph [ref=e190]: Consume 5 Energía. Combate automático con el equipo actual.
        - generic [ref=e191]:
          - region "Hermione Granger" [ref=e192]:
            - generic [ref=e193]:
              - generic [ref=e194]:
                - heading "Hermione Granger" [level=4] [ref=e195]
                - generic [ref=e196]: Fuego
                - generic [ref=e197]: 3 · Rivales
              - generic "Rivales" [ref=e198]:
                - generic [ref=e203]:
                  - generic [ref=e204]: Rival
                  - generic [ref=e205]: Neutral
                - generic [ref=e208]:
                  - generic [ref=e209]: Rival
                  - generic [ref=e210]: Neutral
            - group [ref=e211]:
              - generic "Conocer al rival" [ref=e212] [cursor=pointer]
          - generic "Botín si ganas; entrega fija en cofres" [ref=e215]:
            - generic "Galeones" [ref=e216]:
              - strong [ref=e218]: "50"
            - generic "Llaves de Oro" [ref=e219]:
              - strong [ref=e221]: "1"
            - strong [ref=e224]: "1"
            - generic [ref=e225]: 50 Galeones, 1 llaves, 1 ranas, 0 grageas.
        - generic [ref=e226]:
          - region "Tu equipo" [ref=e227]:
            - heading "Tu equipo" [level=4] [ref=e228]
            - generic [ref=e229]:
              - 'button "Preparar Harry Potter, puesto 1. Copia propia. PV 100/100, PM 40/40. Equipo: Varita de Abedul · Sin núcleo · +2 · ×1, Cometa." [ref=e230] [cursor=pointer]':
                - generic [aria-hidden] [ref=e233]: "1"
                - generic [aria-hidden] [ref=e235]: Harry Potter
                - generic [aria-hidden] [ref=e236]:
                  - generic [ref=e237]: PV 100/100
                  - generic [ref=e238]: PM 40/40
              - button "Preparar Ginny Weasley, puesto 2. Solo esta expedición. PV 80/80, PM 40/40." [ref=e244] [cursor=pointer]:
                - generic [aria-hidden] [ref=e247]: "2"
                - generic [aria-hidden] [ref=e249]: Ginny Weasley
                - generic [aria-hidden] [ref=e250]:
                  - generic [ref=e251]: PV 80/80
                  - generic [ref=e252]: PM 40/40
              - button "Preparar Nicolás Flamel, puesto 3. Solo esta expedición. PV 95/95, PM 40/40." [ref=e253] [cursor=pointer]:
                - generic [aria-hidden] [ref=e256]: "3"
                - generic [aria-hidden] [ref=e258]: Nicolás Flamel
                - generic [aria-hidden] [ref=e259]:
                  - generic [ref=e260]: PV 95/95
                  - generic [ref=e261]: PM 40/40
              - button "Preparar Ginny Weasley, puesto 4. Solo esta expedición. PV 80/80, PM 40/40." [ref=e262] [cursor=pointer]:
                - generic [aria-hidden] [ref=e265]: "4"
                - generic [aria-hidden] [ref=e267]: Ginny Weasley
                - generic [aria-hidden] [ref=e268]:
                  - generic [ref=e269]: PV 80/80
                  - generic [ref=e270]: PM 40/40
            - button "Preparar equipo" [ref=e271] [cursor=pointer]
            - group [ref=e274]:
              - generic "Sinergias del equipo" [ref=e275] [cursor=pointer]:
                - generic [ref=e277]:
                  - text: Alquimia
                  - strong [ref=e278]: III
          - group [ref=e279]:
            - 'generic "Preparar Grageas. Reserva: 1." [ref=e280] [cursor=pointer]':
              - generic [ref=e282]:
                - generic [ref=e283]: Grageas de Todos los Sabores
                - strong [aria-hidden] [ref=e284]: ×1
              - text: ⌄
        - generic [ref=e285]:
          - button "Desafiar al jefe" [active] [ref=e286] [cursor=pointer]:
            - generic "Consume 5 Energía. Combate automático con el equipo actual." [ref=e289]:
              - strong [ref=e291]: "5"
          - button "Cancelar" [ref=e292] [cursor=pointer]:
            - generic [aria-hidden] [ref=e293]: ×
  - navigation "Navegación principal" [ref=e294]:
    - button "Mapa" [ref=e295] [cursor=pointer]
    - button "Álbum de Cromos" [ref=e298] [cursor=pointer]
    - button "Callejón" [ref=e301] [cursor=pointer]
    - button "Misiones" [ref=e304] [cursor=pointer]
```

# Test source

```ts
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
  84  |     scaleX: el.dataset.bossPropScaleX,
  85  |     scaleY: el.dataset.bossPropScaleY,
  86  |     layers: el.dataset.bossPropLayers,
  87  |     pose: el.dataset.bossPropPose,
  88  |     renders: el.dataset.renderCount,
  89  |   }));
  90  | }
  91  | async function freezeBossCast(page: Page) {
  92  |   await page.evaluate(
  93  |     () =>
  94  |       new Promise<void>((done, reject) => {
  95  |         const events = JSON.parse(window.__a70Fixture.battle).events;
  96  |         const until = performance.now() + 15000;
  97  |         const observe = () => {
  98  |           const host = document.querySelector<HTMLElement>('.scene-canvas');
  99  |           const cursor = Number(
  100 |             document.querySelector<HTMLElement>('.battle-panel')?.dataset.replayCursor,
  101 |           );
  102 |           const event = events[cursor];
  103 |           if (
  104 |             host?.dataset.bossPropPose === 'cast' &&
  105 |             event?.kind === 'spell-cast' &&
  106 |             event.actorId === window.__a70Fixture.leader
  107 |           ) {
  108 |             document
  109 |               .querySelector<HTMLButtonElement>('.replay-controls button:first-child')!
  110 |               .click();
  111 |             done();
  112 |           } else if (performance.now() >= until)
  113 |             reject(Error('No real leader spell phase observed'));
  114 |           else requestAnimationFrame(observe);
  115 |         };
  116 |         observe();
  117 |       }),
  118 |   );
  119 | }
  120 |
  121 | for (const language of ['es', 'en'] as const)
  122 |   for (const pack of ['diagon-alley', 'arcana'] as const) {
  123 |     test(`A70 real authority journey: preview cancel battle loot next intention ${language} ${pack}`, async ({
  124 |       page,
  125 |     }) => {
  126 |       const errors: string[] = [];
  127 |       page.on('pageerror', (error) => errors.push(error.message));
  128 |       await page.addInitScript(
  129 |         (pack) => localStorage.setItem('arcana.presentation.content-pack.v1', pack),
  130 |         pack,
  131 |       );
  132 |       if (pack === 'arcana') await page.emulateMedia({ reducedMotion: 'reduce' });
  133 |       await page.goto('/');
  134 |       if (language === 'en') await changeLanguage(page, language);
  135 |       await page.locator('.portal-enter').click();
  136 |       await startExpedition(page, language);
  137 |       const bossId = await reachNode(page, 'boss', language);
  138 |       await expectMapFits(page);
  139 |       const before = await readGame(page);
  140 |       const run = before.exploration!.run!;
  141 |       const plan = run.campaignSnapshot!.nodes.find((node) => node.nodeId === bossId)!;
  142 |       if (plan.kind !== 'boss') throw Error('Expected real saved boss plan');
  143 |       const leader = plan.opponents.find((unit) => unit.wizardId !== 'rival') ?? plan.opponents[0];
  144 |       const origin = page.locator(`button[data-node="${bossId}"]`);
  145 |       await origin.focus();
  146 |       await origin.press('Enter');
  147 |       const prelude = page.locator('[data-boss-prelude]');
  148 |       await expect(prelude).toHaveAttribute('data-boss-leader', leader.id);
  149 |       await expect(prelude).toHaveAttribute('data-boss-roster-size', String(plan.opponents.length));
  150 |       // Initial consultation must expose preparation, not place it under the sticky fight footer.
  151 |       // Visibility alone does not detect an overlapping sibling or auto-scroll on click.
  152 |       const consultation = page.locator('.node-event-dialog');
  153 |       expect(await consultation.evaluate((element) => element.scrollTop)).toBe(0);
  154 |       const footerBox = await page.locator('.node-combat-actions').boundingBox();
  155 |       for (const control of [
  156 |         page.locator('.node-team-prepare'),
  157 |         page.locator('.node-bean-preparation > summary'),
  158 |       ]) {
  159 |         await expect(control).toBeInViewport({ ratio: 1 });
  160 |         const box = await control.boundingBox();
> 161 |         expect(box!.y + box!.height).toBeLessThanOrEqual(footerBox!.y);
      |                                      ^ Error: expect(received).toBeLessThanOrEqual(expected)
  162 |       }
  163 |       expect(
  164 |         await prelude
  165 |           .locator('[data-boss-opponent]')
  166 |           .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-boss-opponent'))),
  167 |       ).toEqual(plan.opponents.map((unit) => unit.id));
  168 |       const rivalDetails = prelude.locator('.boss-opponent-details > summary');
  169 |       await rivalDetails.focus();
  170 |       await rivalDetails.press('Enter');
  171 |       await expect(prelude.locator('.boss-opponent-details')).toHaveAttribute('open', '');
  172 |       expect(await readGame(page)).toEqual(before);
  173 |       await rivalDetails.press('Enter');
  174 |       await expect(prelude.locator('.boss-opponent-details')).not.toHaveAttribute('open', '');
  175 |       expect(await readGame(page)).toEqual(before);
  176 |       if (language === 'es' && pack === 'diagon-alley') await capture(page, 'boss-preparation');
  177 |       await page.keyboard.press('Escape');
  178 |       await expect(prelude).toHaveCount(0);
  179 |       await expect(origin).toBeFocused();
  180 |       expect(await readGame(page)).toEqual(before);
  181 |       await origin.tap();
  182 |       await expect(prelude).toBeVisible();
  183 |       await changeLanguage(page, language === 'es' ? 'en' : 'es');
  184 |       await expect(prelude).toHaveAttribute('data-boss-leader', leader.id);
  185 |       await expect(prelude).toHaveAttribute('data-boss-roster-size', String(plan.opponents.length));
  186 |       expect(
  187 |         await prelude
  188 |           .locator('[data-boss-opponent]')
  189 |           .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-boss-opponent'))),
  190 |       ).toEqual(plan.opponents.map((unit) => unit.id));
  191 |       // The live locator resolves the translated dialog after the locale change.
  192 |       await rivalDetails.focus();
  193 |       await rivalDetails.press('Enter');
  194 |       await expect(prelude.locator('.boss-opponent-details')).toHaveAttribute('open', '');
  195 |       expect(await readGame(page)).toEqual(before);
  196 |       await rivalDetails.press('Enter');
  197 |       await expect(prelude.locator('.boss-opponent-details')).not.toHaveAttribute('open', '');
  198 |       expect(await readGame(page)).toEqual(before);
  199 |       await changeLanguage(page, language);
  200 |       const prepareTeam = page.locator('.node-team-prepare');
  201 |       await prepareTeam.click();
  202 |       await expect(page.locator('.preparation-dialog[open]')).toBeVisible();
  203 |       expect(await readGame(page)).toEqual(before);
  204 |       await page.keyboard.press('Escape');
  205 |       await expect(prepareTeam).toBeFocused();
  206 |       await expect(prelude).toBeVisible();
  207 |       expect(await readGame(page)).toEqual(before);
  208 |       const actionStarted = Date.now();
  209 |       await confirmEvent(page, language);
  210 |       const committed = await readGame(page);
  211 |       const receipt = committed.receipts.at(-1)!;
  212 |       if (receipt.kind !== 'advance-node' || !receipt.battle)
  213 |         throw Error('Expected committed boss receipt');
  214 |       const confirmedBattle = JSON.stringify(receipt.battle);
  215 |       await expect(page.locator('.battle-panel')).toHaveAttribute('data-boss-leader', leader.id);
  216 |       await fits(page, receipt.battle.input.player.length + receipt.battle.input.rival.length);
  217 |       const actionToDomUsableUpperBoundMs = Date.now() - actionStarted;
  218 |       await expect(page.locator('.scene-canvas')).toHaveAttribute('data-art-ready', 'true');
  219 |       const actionToFiguresReadyUpperBoundMs = Date.now() - actionStarted;
  220 |       if (await skip(page, language).isEnabled()) await skip(page, language).click();
  221 |       await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  222 |       expect(JSON.stringify((await readGame(page)).receipts.at(-1))).toBe(JSON.stringify(receipt));
  223 |       await page
  224 |         .getByRole('button', {
  225 |           name: label(language, 'Volver al mapa', 'Back to map'),
  226 |           exact: true,
  227 |         })
  228 |         .click();
  229 |       const closure = page.locator('[data-expedition-closure="won"]');
  230 |       await expect(closure).toBeVisible();
  231 |       await expect(closure).toHaveAttribute('data-closure-boss', leader.wizardId);
  232 |       expect(await closure.locator('[data-boss-fact]').count()).toBeLessThanOrEqual(2);
  233 |       if (language === 'es' && pack === 'diagon-alley') {
  234 |         await expect(closure.locator('.closure-spoils')).toHaveCSS('opacity', '1');
  235 |         await capture(page, 'boss-closure');
  236 |       }
  237 |       await page.reload();
  238 |       await expect(closure).toBeVisible();
  239 |       expect(await readGame(page)).toEqual(committed);
  240 |       await expect(closure).toHaveAttribute('data-confirmed-motion', 'false');
  241 |       await closure.locator('[data-closure-action="frog"]').click();
  242 |       await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result', {
  243 |         timeout: 15000,
  244 |       });
  245 |       const opened = await readGame(page);
  246 |       expect(opened.inventory.crowns).toBe(committed.inventory.crowns);
  247 |       expect(opened.copies).toHaveLength(committed.copies.length + 1);
  248 |       await page.locator('.reveal-continue').click();
  249 |       await closure.locator('[data-closure-action="vault"]').click();
  250 |       await page.locator('.vault-lock-action').click();
  251 |       await page
  252 |         .getByRole('button', { name: label(language, 'Cancelar', 'Cancel'), exact: true })
  253 |         .click();
  254 |       expect(await readGame(page)).toEqual(opened);
  255 |       await page.locator('.vault-lock-action').click();
  256 |       await page
  257 |         .getByRole('button', {
  258 |           name: label(language, 'Confirmar canje', 'Confirm exchange'),
  259 |           exact: true,
  260 |         })
  261 |         .click();
```
