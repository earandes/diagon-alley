# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: houses-a85.spec.ts >> A85 the actual mastery roster discloses its active house before confirmation
- Location: tests/browser-houses/houses-a85.spec.ts:263:1

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 754.9307250976562
Received:    762.0534057617188
```

# Page snapshot

```yaml
- generic [ref=f2e3]:
  - banner [ref=f2e4]:
    - heading "ARCANA" [level=1] [ref=f2e5]
  - main [ref=f2e6]:
    - dialog "Declared boss fixture" [ref=f2e7]:
      - button "Ajustes" [active] [ref=f2e8] [cursor=pointer]
      - generic [ref=f2e11]:
        - region "Circe" [ref=f2e12]:
          - generic [ref=f2e13]:
            - generic [ref=f2e14]:
              - heading "Circe" [level=4] [ref=f2e15]
              - generic [ref=f2e16]: Fuego
              - generic "+2 daño en el primer impacto acertado." [ref=f2e17]: Compañía del León · I
              - generic [ref=f2e21]: 5 · Rivales
            - generic "Rivales" [ref=f2e22]:
              - generic [ref=f2e27]:
                - generic [ref=f2e28]: Guardián de las Brasas
                - generic [ref=f2e29]: Fuego
              - generic [ref=f2e32]:
                - generic [ref=f2e33]: Sabio del Cobre
                - generic [ref=f2e34]: Fuego
              - generic [ref=f2e37]:
                - generic [ref=f2e38]: Invocadora de Tormentas
                - generic [ref=f2e39]: Sombras
              - generic [ref=f2e42]:
                - generic [ref=f2e43]: Vidente de la Bruma
                - generic [ref=f2e44]: Sombras
          - group [ref=f2e45]:
            - generic "Conocer al rival" [ref=f2e46] [cursor=pointer]
        - generic "Botín si ganas; entrega fija en cofres" [ref=f2e49]:
          - generic "Coronas" [ref=f2e50]:
            - strong [ref=f2e52]: "50"
          - generic "Llaves de Oro" [ref=f2e53]:
            - strong [ref=f2e55]: "1"
          - strong [ref=f2e58]: "1"
          - generic [ref=f2e59]: 50 Coronas, 1 llaves, 1 sapos, 0 grageas.
      - generic [ref=f2e60]:
        - region "Tu equipo" [ref=f2e61]:
          - heading "Tu equipo" [level=4] [ref=f2e62]
          - generic [ref=f2e63]:
            - 'button "Preparar Herborista Lunar, puesto 1. Copia propia. PV 90/90, PM 40/40. Equipo: Varita de Abedul · Sin núcleo · +2 · ×1, Céfiro Cadete. Gragea asignada en borrador." [ref=f2e64] [cursor=pointer]':
              - generic [aria-hidden] [ref=f2e67]: "1"
              - generic [aria-hidden] [ref=f2e69]: Herborista Lunar
              - generic [aria-hidden] [ref=f2e70]:
                - generic [ref=f2e71]: PV 90/90
                - generic [ref=f2e72]: PM 40/40
            - 'button "Preparar Invocadora de Tormentas, puesto 2. Copia propia. PV 85/85, PM 40/40. Equipo: Varita de Abedul · Sin núcleo · +2 · ×1, Céfiro Cadete. Gragea asignada en borrador." [ref=f2e80] [cursor=pointer]':
              - generic [aria-hidden] [ref=f2e83]: "2"
              - generic [aria-hidden] [ref=f2e85]: Invocadora de Tormentas
              - generic [aria-hidden] [ref=f2e86]:
                - generic [ref=f2e87]: PV 85/85
                - generic [ref=f2e88]: PM 40/40
            - 'button "Preparar Enlazadora de Estrellas, puesto 3. Copia propia. PV 90/90, PM 40/40. Equipo: Varita de Abedul · Sin núcleo · +2 · ×1, Céfiro Cadete. Gragea asignada en borrador." [ref=f2e96] [cursor=pointer]':
              - generic [aria-hidden] [ref=f2e99]: "3"
              - generic [aria-hidden] [ref=f2e101]: Enlazadora de Estrellas
              - generic [aria-hidden] [ref=f2e102]:
                - generic [ref=f2e103]: PV 90/90
                - generic [ref=f2e104]: PM 40/40
            - 'button "Preparar Sabia de la Aurora, puesto 4. Copia propia. PV 85/85, PM 40/40. Equipo: Varita de Abedul · Sin núcleo · +2 · ×1, Céfiro Cadete. Gragea asignada en borrador." [ref=f2e112] [cursor=pointer]':
              - generic [aria-hidden] [ref=f2e115]: "4"
              - generic [aria-hidden] [ref=f2e117]: Sabia de la Aurora
              - generic [aria-hidden] [ref=f2e118]:
                - generic [ref=f2e119]: PV 85/85
                - generic [ref=f2e120]: PM 40/40
            - 'button "Preparar Aprendiz de Alquimia, puesto 5. Copia propia. PV 100/100, PM 40/40. Equipo: Varita de Abedul · Sin núcleo · +2 · ×1, Céfiro Cadete. Gragea asignada en borrador." [ref=f2e128] [cursor=pointer]':
              - generic [aria-hidden] [ref=f2e131]: "5"
              - generic [aria-hidden] [ref=f2e133]: Aprendiz de Alquimia
              - generic [aria-hidden] [ref=f2e134]:
                - generic [ref=f2e135]: PV 100/100
                - generic [ref=f2e136]: PM 40/40
          - button "Preparar equipo" [ref=f2e144] [cursor=pointer]
          - generic "Casas del equipo" [ref=f2e146]:
            - group [ref=f2e147]:
              - generic "Compañía del León · 1/3" [ref=f2e148] [cursor=pointer]: Compañía del León 1/3
            - group [ref=f2e153]:
              - generic "Hermandad del Tejón · Activo nivel 2" [ref=f2e154] [cursor=pointer]: Hermandad del Tejón 4 · II
          - group [ref=f2e159]:
            - generic "Sinergias de afinidad" [ref=f2e160] [cursor=pointer]:
              - generic [ref=f2e162]:
                - text: Sombras
                - strong [ref=f2e163]: I
        - group [ref=f2e164]:
          - 'generic "Preparar Grageas. Reserva: 5." [ref=f2e165] [cursor=pointer]':
            - generic [ref=f2e167]:
              - generic [ref=f2e168]: Grageas del Azar
              - strong [aria-hidden] [ref=f2e169]: ×5
              - generic [ref=f2e170]: 5 asignados · sin consumir
            - text: ⌄
      - generic [ref=f2e171]:
        - button "Desafiar al jefe Consume 5 Esencia. Combate automático con el equipo actual." [ref=f2e172] [cursor=pointer]:
          - generic [ref=f2e174]: Desafiar al jefe
          - generic "Consume 5 Esencia. Combate automático con el equipo actual." [ref=f2e175]:
            - strong [ref=f2e177]: "5"
        - button "Cancelar" [ref=f2e178] [cursor=pointer]:
          - generic [aria-hidden] [ref=f2e179]: ×
  - contentinfo [ref=f2e180]:
    - text: Declared fixture
    - button "Swap" [ref=f2e181] [cursor=pointer]
    - button "Reduce" [ref=f2e182] [cursor=pointer]
```

# Test source

```ts
  263 | test('A85 the actual mastery roster discloses its active house before confirmation', async ({
  264 |   page,
  265 | }, info) => {
  266 |   test.skip(!allowed(info.project.name), 'Protected Linux matrix only.');
  267 |   for (const [lang, pack] of pairs) {
  268 |     await page.goto(`${fixture}?mode=boss&dense=1&lang=${lang}&pack=${pack}`);
  269 |     await expect(page.locator('.boss-house-mark')).toHaveCount(1);
  270 |     await expect(page.locator('.boss-house-mark')).toBeVisible();
  271 |     await expect(page.locator('.boss-party-member')).toHaveCount(5);
  272 |     await expect(page.locator('[data-boss-party-gear]')).toHaveCount(10);
  273 |     await expect(page.locator('[data-boss-party-bean]')).toHaveCount(5);
  274 |     await expect(page.locator('.node-bean-preparation > summary')).toHaveAttribute(
  275 |       'data-bean-draft',
  276 |       '5',
  277 |     );
  278 |     await expect
  279 |       .poll(() =>
  280 |         page
  281 |           .locator('.boss-party-portrait > img:first-child')
  282 |           .evaluateAll((images) =>
  283 |             images.map(
  284 |               (image) =>
  285 |                 (image as HTMLImageElement).complete &&
  286 |                 (image as HTMLImageElement).naturalWidth > 0,
  287 |             ),
  288 |           ),
  289 |       )
  290 |       .toEqual([true, true, true, true, true]);
  291 |     const figures = await page
  292 |       .locator('.boss-party-portrait > img:first-child')
  293 |       .evaluateAll(async (images) => {
  294 |         await Promise.all(images.map((image) => (image as HTMLImageElement).decode()));
  295 |         await new Promise(requestAnimationFrame);
  296 |         await new Promise(requestAnimationFrame);
  297 |         return images.map((image) => {
  298 |           const box = image.getBoundingClientRect(),
  299 |             style = getComputedStyle(image);
  300 |           return {
  301 |             width: box.width,
  302 |             height: box.height,
  303 |             opacity: style.opacity,
  304 |             visibility: style.visibility,
  305 |             naturalWidth: (image as HTMLImageElement).naturalWidth,
  306 |           };
  307 |         });
  308 |       });
  309 |     if (lang === 'es' && pack === 'diagon-alley' && info.project.name.startsWith('chromium-390'))
  310 |       await picture(page, 'boss-390-es-diagon');
  311 |     const footer = await page.locator('.node-combat-actions').boundingBox();
  312 |     // Faithful production action: illustration, label and visible cost share
  313 |     // one row rather than the legacy grid button accidentally used by the fixture.
  314 |     const actionParts = await page.locator('.node-confirm-action > *').evaluateAll((elements) =>
  315 |       elements.map((el) => {
  316 |         const box = el.getBoundingClientRect();
  317 |         return { top: box.top, height: box.height, middle: box.top + box.height / 2 };
  318 |       }),
  319 |     );
  320 |     await mkdir(root, { recursive: true });
  321 |     await writeFile(
  322 |       resolve(root, `${info.project.name}-boss-${lang}-${pack}.json`),
  323 |       JSON.stringify(
  324 |         {
  325 |           sha: process.env.GITHUB_SHA,
  326 |           fixture: true,
  327 |           scope: 'Mastery5x5; five equipped allies with five draft beans; production footer',
  328 |           footer,
  329 |           actionParts,
  330 |           figures,
  331 |           layout: await page
  332 |             .locator(
  333 |               '.boss-prelude-hero, .boss-opponent-details, .event-loot, .boss-party-members, .node-team-prepare, .node-bean-preparation > summary',
  334 |             )
  335 |             .evaluateAll((elements) =>
  336 |               elements.map((el) => ({
  337 |                 className: el.className,
  338 |                 top: el.getBoundingClientRect().top,
  339 |                 bottom: el.getBoundingClientRect().bottom,
  340 |                 height: el.getBoundingClientRect().height,
  341 |               })),
  342 |             ),
  343 |         },
  344 |         null,
  345 |         2,
  346 |       ),
  347 |     );
  348 |     for (const figure of figures) {
  349 |       expect(figure.width).toBeGreaterThanOrEqual(32);
  350 |       expect(figure.height).toBeGreaterThanOrEqual(60);
  351 |       expect(Number(figure.opacity)).toBe(1);
  352 |       expect(figure.visibility).toBe('visible');
  353 |     }
  354 |     expect(
  355 |       Math.max(...actionParts.map((p) => p.middle)) - Math.min(...actionParts.map((p) => p.middle)),
  356 |     ).toBeLessThanOrEqual(1);
  357 |     for (const control of [
  358 |       page.locator('.node-team-prepare'),
  359 |       page.locator('.node-bean-preparation > summary'),
  360 |     ]) {
  361 |       await expect(control).toBeInViewport({ ratio: 1 });
  362 |       const box = await control.boundingBox();
> 363 |       expect(box!.y + box!.height).toBeLessThanOrEqual(footer!.y);
      |                                    ^ Error: expect(received).toBeLessThanOrEqual(expected)
  364 |     }
  365 |     const book = page.locator('.boss-opponent-details > summary');
  366 |     await book.press('Enter');
  367 |     await expect(page.locator('.boss-opponent-details')).toHaveAttribute('open', '');
  368 |     await expect(page.locator('.boss-opponent-stats section')).toHaveCount(5);
  369 |     expect((await bounds(page)).scroll).toBeLessThanOrEqual((await bounds(page)).width + 1);
  370 |     await book.press('Enter');
  371 |     await expect(page.locator('.boss-opponent-details')).not.toHaveAttribute('open', '');
  372 |     await expect(book).toBeFocused();
  373 |     const size = await bounds(page);
  374 |     expect(size.scroll).toBeLessThanOrEqual(size.width + 1);
  375 |     await immutable(page);
  376 |   }
  377 | });
  378 | test('A85 pending route actions wait while locked nodes remain read-only consultations', async ({
  379 |   page,
  380 | }, info) => {
  381 |   test.skip(
  382 |     info.project.name !== 'chromium-390-motion-a69',
  383 |     'One deterministic pending-state fixture; domain semantics and real seasonal journey cover the integration.',
  384 |   );
  385 |   await page.goto(`${fixture}?mode=map&busy=1`);
  386 |   const available = page.locator('[data-node-state=available]').first();
  387 |   await expect(available).toBeDisabled();
  388 |   await page.locator('[data-node-state=locked]').first().click();
  389 |   await expect(page.getByRole('dialog', { name: 'Consultar ruta', exact: true })).toBeVisible();
  390 |   await page.keyboard.press('Escape');
  391 |   await page.locator('[data-qa-ready]').click();
  392 |   await expect(available).toBeEnabled();
  393 |   await available.click();
  394 |   await expect(page.locator('.tactical-pact')).toBeVisible();
  395 |   await expect(page.getByRole('dialog', { name: 'Consultar ruta', exact: true })).toHaveCount(0);
  396 |   await immutable(page);
  397 | });
  398 | test('A85 an active intention and house party reserve separate usable route space', async ({
  399 |   page,
  400 | }, info) => {
  401 |   test.skip(!allowed(info.project.name), 'Protected six-pair Linux matrix only.');
  402 |   for (const [lang, pack] of pairs) {
  403 |     await page.goto(`${fixture}?mode=map&visited=1&intention=1&lang=${lang}&pack=${pack}`);
  404 |     const reminder = page.locator('.expedition-panel > .intention-reminder');
  405 |     await expect(reminder).toHaveAttribute('data-intention-status', 'active');
  406 |     await expect(page.locator('.team-compact .house-band')).toBeVisible();
  407 |     await expect
  408 |       .poll(() =>
  409 |         page.locator('[data-node]').evaluateAll((nodes) =>
  410 |           nodes
  411 |             .filter((node) => {
  412 |               const box = node.getBoundingClientRect();
  413 |               return !node.contains(
  414 |                 document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2),
  415 |               );
  416 |             })
  417 |             .map((node) => node.getAttribute('data-node')),
  418 |         ),
  419 |       )
  420 |       .toEqual([]);
  421 |     const summary = reminder.locator(':scope > summary');
  422 |     expect(
  423 |       await summary.evaluate((node) => {
  424 |         const box = node.getBoundingClientRect();
  425 |         return node.contains(
  426 |           document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2),
  427 |         );
  428 |       }),
  429 |     ).toBe(true);
  430 |     const size = await bounds(page);
  431 |     expect(size.scroll).toBeLessThanOrEqual(size.width + 1);
  432 |     expect(size.body).toBeLessThanOrEqual(size.height + 1);
  433 |     await immutable(page);
  434 |     if (lang === 'es' && pack === 'diagon-alley' && info.project.name === 'chromium-390-motion-a69')
  435 |       await picture(page, 'map-intention-390-es-diagon');
  436 |   }
  437 | });
  438 |
  439 | test('A86 duel scene has one pause, recorded house access and remembered presentation speed', async ({
  440 |   page,
  441 | }, info) => {
  442 |   test.skip(!allowed(info.project.name), 'Protected six-pair Linux matrix; no local graphics.');
  443 |   for (const pack of ['diagon-alley', 'arcana'])
  444 |     for (const lang of ['es', 'en'] as const) {
  445 |       await page.goto(`${fixture}?mode=battle&lang=${lang}&pack=${pack}`);
  446 |       await expect(page.locator('.scene-canvas')).toHaveAttribute('data-art-ready', 'true');
  447 |       await pauseBattle(page);
  448 |       await expect(page.locator('.arena-playback-tools')).toBeHidden();
  449 |       await expect(page.locator('.game-header')).toBeHidden();
  450 |       await expect(page.locator('.arena-position')).toHaveCount(0);
  451 |       await expect(page.locator('.arena-pause')).toHaveCount(1);
  452 |       await expect(page.locator('.arena-caption')).not.toContainText(
  453 |         /Combate guardado|Battle saved/,
  454 |       );
  455 |       for (const item of await page.locator('.arena-inspect > strong, .arena-health').all())
  456 |         await expect(item).toBeInViewport({ ratio: 1 });
  457 |       const house = page.locator('.arena-house').first();
  458 |       await expect(house).toBeVisible();
  459 |       await house.tap();
  460 |       await expect(page.locator('.arena-inspector[open]')).toContainText(
  461 |         lang === 'es' ? 'PV al comenzar' : 'HP at each turn',
  462 |       );
  463 |       await page.keyboard.press('Escape');
```
