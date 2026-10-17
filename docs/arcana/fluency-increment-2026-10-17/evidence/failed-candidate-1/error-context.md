# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser-boss/boss-a70.spec.ts >> A70 real authority journey: preview cancel battle loot next intention es diagon-alley
- Location: tests/browser-boss/boss-a70.spec.ts:177:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 5

- Array []
+ Array [
+   "Illegal invocation",
+   "Illegal invocation",
+   "Illegal invocation",
+ ]
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - link "Saltar al contenido" [ref=f1e4] [cursor=pointer]:
    - /url: "#content"
  - banner [ref=f1e5]:
    - heading "Callejón Diagón Descubrimiento" [level=1] [ref=f1e6]:
      - text: Callejón Diagón
      - generic [ref=f1e7]: Descubrimiento
    - generic [ref=f1e8]:
      - status [ref=f1e9]
      - button "Una noche encantada" [ref=f1e10] [cursor=pointer]
    - button "Ajustes" [ref=f1e13] [cursor=pointer]
  - status [ref=f1e16]
  - generic [ref=f1e17]:
    - strong [ref=f1e18]:
      - generic "Galeones" [ref=f1e20]: "215"
    - generic [ref=f1e21]:
      - generic [ref=f1e22]:
        - generic [ref=f1e24]: Energía
        - text: 40 / 50
        - meter "Energía mágica" [ref=f1e25]
      - generic [ref=f1e26]: Próximo punto a las 11:21:44.
      - button "Actualizar Energía" [ref=f1e27] [cursor=pointer]
    - generic [ref=f1e30]:
      - strong [aria-hidden] [ref=f1e32]: "0"
      - generic [ref=f1e33]: 0 Llaves de Oro
  - main [active] [ref=f1e34]:
    - status [ref=f1e35]
    - generic [ref=f1e36]:
      - generic:
        - complementary "Siguiente objetivo":
          - generic:
            - heading "Un aliado más en el camino" [level=3]
            - group [ref=f1e37]:
              - generic "Siguiente objetivo" [ref=f1e38] [cursor=pointer]: "?"
            - 'generic "Etapas recorridas: 0 de 7"': 0 / 7
      - group [ref=f1e39]:
        - generic "Severus Snape En esta ruta" [ref=f1e40] [cursor=pointer]:
          - generic [ref=f1e42]:
            - text: Severus Snape
            - generic [ref=f1e43]: En esta ruta
          - generic [aria-hidden] [ref=f1e44]: ✦
      - region "Tu Equipo" [ref=f1e45]:
        - heading "Tu Equipo" [level=2] [ref=f1e46]
        - button "Harry Potter" [ref=f1e48] [cursor=pointer]:
          - generic [ref=f1e50]: Copia propia
          - meter "Vida de Harry Potter" [ref=f1e53]
        - button "Prepara tu expedición" [ref=f1e54] [cursor=pointer]
      - button "Ver lista de nodos" [ref=f1e57] [cursor=pointer]
      - generic [ref=f1e61]:
        - generic "Inicio"
        - button "Pacto Mágico Disponible Aliado temporal" [ref=f1e63] [cursor=pointer]:
          - generic [aria-hidden] [ref=f1e66]: ▴
          - strong [ref=f1e67]: Pacto Mágico
          - generic [ref=f1e68]: Disponible
          - generic [ref=f1e69]: Aliado temporal
        - button "Cofre de Botín Bloqueado" [disabled] [ref=f1e71]:
          - strong [ref=f1e74]: Cofre de Botín
          - generic [ref=f1e75]: Bloqueado
        - button "Pacto Mágico Bloqueado" [disabled] [ref=f1e77]:
          - strong [ref=f1e80]: Pacto Mágico
          - generic [ref=f1e81]: Bloqueado
        - button "Pacto Mágico Bloqueado" [disabled] [ref=f1e83]:
          - strong [ref=f1e86]: Pacto Mágico
          - generic [ref=f1e87]: Bloqueado
        - button "Cofre de Botín Bloqueado" [disabled] [ref=f1e89]:
          - strong [ref=f1e92]: Cofre de Botín
          - generic [ref=f1e93]: Bloqueado
        - button "Refugio Alquímico Bloqueado" [disabled] [ref=f1e95]:
          - strong [ref=f1e98]: Refugio Alquímico
          - generic [ref=f1e99]: Bloqueado
        - button "Vanguardia · iniciativa Duelo mágico Bloqueado" [disabled] [ref=f1e101]:
          - generic: Vanguardia · iniciativa
          - strong [ref=f1e104]: Duelo mágico
          - generic [ref=f1e105]: Bloqueado
        - button "Refugio Alquímico Bloqueado" [disabled] [ref=f1e107]:
          - strong [ref=f1e110]: Refugio Alquímico
          - generic [ref=f1e111]: Bloqueado
        - button "Refugio Alquímico Bloqueado" [disabled] [ref=f1e113]:
          - strong [ref=f1e116]: Refugio Alquímico
          - generic [ref=f1e117]: Bloqueado
        - button "Cofre de Botín Bloqueado" [disabled] [ref=f1e119]:
          - strong [ref=f1e122]: Cofre de Botín
          - generic [ref=f1e123]: Bloqueado
        - button "Vanguardia · iniciativa Duelo mágico Bloqueado" [disabled] [ref=f1e125]:
          - generic: Vanguardia · iniciativa
          - strong [ref=f1e128]: Duelo mágico
          - generic [ref=f1e129]: Bloqueado
        - button "Encuentro Bloqueado" [disabled] [ref=f1e131]:
          - strong [ref=f1e134]: Encuentro
          - generic [ref=f1e135]: Bloqueado
        - button "Fuego · quemadura Duelo mágico Bloqueado" [disabled] [ref=f1e137]:
          - generic: Fuego · quemadura
          - strong [ref=f1e140]: Duelo mágico
          - generic [ref=f1e141]: Bloqueado
        - button "Encuentro Bloqueado" [disabled] [ref=f1e143]:
          - strong [ref=f1e146]: Encuentro
          - generic [ref=f1e147]: Bloqueado
        - button "Fuego · quemadura Duelo mágico Bloqueado" [disabled] [ref=f1e149]:
          - generic: Fuego · quemadura
          - strong [ref=f1e152]: Duelo mágico
          - generic [ref=f1e153]: Bloqueado
        - button "Jefe de Zona Bloqueado" [disabled] [ref=f1e155]:
          - strong [ref=f1e158]: Jefe de Zona
          - generic [ref=f1e159]: Bloqueado
  - navigation "Navegación principal" [ref=f1e160]:
    - button "Mapa" [ref=f1e161] [cursor=pointer]
    - button "Álbum de Cromos" [ref=f1e164] [cursor=pointer]
    - button "Callejón" [ref=f1e167] [cursor=pointer]
    - button "Misiones" [ref=f1e170] [cursor=pointer]
```

# Test source

```ts
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
  274 |       if (await skip(page, language).isEnabled()) await skip(page, language).click();
  275 |       await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  276 |       expect(JSON.stringify((await readGame(page)).receipts.at(-1))).toBe(JSON.stringify(receipt));
  277 |       await page
  278 |         .getByRole('button', {
  279 |           name: label(language, 'Volver al mapa', 'Back to map'),
  280 |           exact: true,
  281 |         })
  282 |         .click();
  283 |       const closure = page.locator('[data-expedition-closure="won"]');
  284 |       await expect(closure).toBeVisible();
  285 |       await expect(closure).toHaveAttribute('data-closure-boss', leader.wizardId);
  286 |       expect(await closure.locator('[data-boss-fact]').count()).toBeLessThanOrEqual(2);
  287 |       if (language === 'es' && pack === 'diagon-alley') {
  288 |         await expect(closure.locator('.closure-spoils')).toHaveCSS('opacity', '1');
  289 |         await capture(page, 'boss-closure');
  290 |       }
  291 |       await page.reload();
  292 |       await expect(closure).toBeVisible();
  293 |       expect(await readGame(page)).toEqual(committed);
  294 |       await expect(closure).toHaveAttribute('data-confirmed-motion', 'false');
  295 |       await closure.locator('[data-closure-action="frog"]').click();
  296 |       await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result', {
  297 |         timeout: 15000,
  298 |       });
  299 |       const opened = await readGame(page);
  300 |       expect(opened.inventory.crowns).toBe(committed.inventory.crowns);
  301 |       expect(opened.copies).toHaveLength(committed.copies.length + 1);
  302 |       await page.locator('.reveal-continue').click();
  303 |       await closure.locator('[data-closure-action="vault"]').click();
  304 |       await page.locator('.vault-lock-action').click();
  305 |       await page
  306 |         .getByRole('button', { name: label(language, 'Cancelar', 'Cancel'), exact: true })
  307 |         .click();
  308 |       expect(await readGame(page)).toEqual(opened);
  309 |       await page.locator('.vault-lock-action').click();
  310 |       await page
  311 |         .getByRole('button', {
  312 |           name: label(language, 'Confirmar canje', 'Confirm exchange'),
  313 |           exact: true,
  314 |         })
  315 |         .click();
  316 |       await expect(page.locator('.commerce-result')).toBeVisible();
  317 |       const used = await readGame(page);
  318 |       expect(used.inventory.goldKeys).toBe((opened.inventory.goldKeys ?? 0) - 1);
  319 |       await page
  320 |         .locator('nav')
  321 |         .getByRole('button', { name: label(language, 'Mapa', 'Map'), exact: true })
  322 |         .click();
  323 |       const choice = page.locator('[data-intention-choice] > button').first();
  324 |       await expect(choice).toBeVisible();
  325 |       await choice.focus();
  326 |       await choice.press('Enter');
  327 |       await expect(choice).toHaveAttribute('aria-pressed', 'true');
  328 |       const selectedState = await readGame(page);
  329 |       expect(selectedState.inventory).toEqual(used.inventory);
  330 |       expect(selectedState.exploration!.run).toEqual(used.exploration!.run);
  331 |       await closure.locator('[data-closure-action="prepare"]').click();
  332 |       await expect(page.locator('.preparation-dialog[open]')).toBeVisible();
  333 |       expect(await readGame(page)).toEqual(selectedState);
  334 |       await page.keyboard.press('Escape');
  335 |       await expect(closure.locator('[data-closure-action="prepare"]')).toBeFocused();
  336 |       expect(await readGame(page)).toEqual(selectedState);
  337 |       await closure.locator('[data-closure-action="prepare"]').click();
  338 |       await startExpedition(page, language);
  339 |       const next = await readGame(page);
  340 |       expect(next.exploration!.run!.id).not.toBe(run.id);
  341 |       expect(next.inventory).toEqual(used.inventory);
  342 |       expect(next.exploration!.intention!.runId).toBe(next.exploration!.run!.id);
  343 |       expect(JSON.stringify(receipt.battle)).toBe(confirmedBattle);
> 344 |       expect(errors).toEqual([]);
      |                      ^ Error: expect(received).toEqual(expected) // deep equality
  345 |       await report(`${language}-${pack}-authority`, {
  346 |         fixture: false,
  347 |         isolatedAuthorityAccount: committed.playerId,
  348 |         runId: run.id,
  349 |         bossReceipt: receipt.id,
  350 |         leaderId: leader.id,
  351 |         leaderWizardId: leader.wizardId,
  352 |         reward: receipt.reward,
  353 |         firstVictory: receipt.firstVictory,
  354 |         actionToDomUsableUpperBoundMs,
  355 |         actionToFiguresReadyUpperBoundMs,
  356 |         battleUnchanged: true,
  357 |         reloadExact: true,
  358 |         selectionDidNotConsume: true,
  359 |         pageErrors: errors,
  360 |       });
  361 |     });
  362 |   }
  363 | 
  364 | test('A70 real boss profile fixtures: poses pause speed hidden inspector skip pack and teardown', async ({
  365 |   page,
  366 | }) => {
  367 |   for (const [profile, playerCount, rivalCount] of [
  368 |     ['discovery', 3, 3],
  369 |     ['tactical', 5, 4],
  370 |     ['mastery', 5, 5],
  371 |   ] as const) {
  372 |     await page.goto(`${fixture}?challenge=${profile}&player=${playerCount}`);
  373 |     const panel = page.locator('.battle-panel');
  374 |     const scene = page.locator('.scene-canvas');
  375 |     const leader = await page.evaluate(() => window.__a70Fixture.leader);
  376 |     await expect(panel).toHaveAttribute('data-boss-leader', leader);
  377 |     const genericAlias = await page.evaluate(() => window.__a70Fixture.bossAlias);
  378 |     await expect(panel.locator(`.arena-portrait[data-art="${genericAlias}"]`)).toHaveCount(0);
  379 |     await pause(page).click();
  380 |     await expect(scene).toHaveAttribute('data-art-ready', 'true');
  381 |     await expect(scene).toHaveAttribute('data-visible-figures', String(playerCount + rivalCount));
  382 |     await expect(scene).toHaveAttribute(
  383 |       'data-boss-prop-ready',
  384 |       profile === 'tactical' ? 'false' : 'true',
  385 |     );
  386 |     await fits(page, playerCount + rivalCount);
  387 |     const before = await preserved(page);
  388 |     const navigationToReadyMs = await page.evaluate(() => performance.now());
  389 |     if (profile === 'discovery') {
  390 |       await expect(scene).toHaveAttribute('data-boss-prop-ready', 'true');
  391 |       await auto(page).click();
  392 |       await freezeBossCast(page);
  393 |       const atCast = await frozen(page);
  394 |       expect(Number(atCast.activity)).toBeGreaterThan(0);
  395 |       expect(Number(atCast.layers)).toBeGreaterThan(0);
  396 |       await page.waitForTimeout(200);
  397 |       expect(await frozen(page)).toEqual(atCast);
  398 |       if (selected()) await capture(page, 'boss-object-cast');
  399 |     }
  400 |     await page.getByRole('button', { name: '2x', exact: true }).click();
  401 |     await expect(panel).toHaveAttribute('data-replay-speed', '2');
  402 |     const cursor = await panel.getAttribute('data-replay-cursor');
  403 |     const progress = await panel.getAttribute('data-replay-progress');
  404 |     const retiredHost = await scene.elementHandle();
  405 |     await control(page, 'pack');
  406 |     await expect(scene).toHaveAttribute('data-art-ready', 'true');
  407 |     await expect(scene).toHaveAttribute(
  408 |       'data-boss-prop-ready',
  409 |       profile === 'tactical' ? 'false' : 'true',
  410 |     );
  411 |     expect(await retiredHost!.evaluate((el: HTMLElement) => el.dataset.destroyed)).toBe('true');
  412 |     expect(await retiredHost!.evaluate((el: HTMLElement) => el.dataset.textureCount)).toBe('0');
  413 |     expect(await panel.getAttribute('data-replay-cursor')).toBe(cursor);
  414 |     expect(await panel.getAttribute('data-replay-progress')).toBe(progress);
  415 |     if (profile === 'discovery') {
  416 |       // The new ARCANA renderer samples the same paused cast. Check the actual
  417 |       // bowl Sprite transform, not just a pose name calculated by the model.
  418 |       const bowl = await frozen(page);
  419 |       expect(bowl.pose).toBe('cast');
  420 |       expect(Number(bowl.activity)).toBeGreaterThan(0);
  421 |       expect(Number(bowl.scaleX)).toBeLessThan(1);
  422 |       expect(Number(bowl.scaleY)).toBeGreaterThan(1);
  423 |       if (selected()) await capture(page, 'boss-object-arcana-cast');
  424 |     }
  425 |     await control(page, 'language');
  426 |     expect(await panel.getAttribute('data-replay-cursor')).toBe(cursor);
  427 |     await page.locator('.arena-inspect').first().tap();
  428 |     await expect(page.locator('dialog.arena-inspector[open]')).toBeVisible();
  429 |     await page.keyboard.press('Escape');
  430 |     await expect(page.locator('.arena-inspect').first()).toBeFocused();
  431 |     await auto(page, 'en').click();
  432 |     await page.evaluate(() => {
  433 |       Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  434 |       document.dispatchEvent(new Event('visibilitychange'));
  435 |     });
  436 |     const hidden = await frozen(page);
  437 |     await page.waitForTimeout(200);
  438 |     expect(await frozen(page)).toEqual(hidden);
  439 |     await page.evaluate(() => {
  440 |       Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
  441 |       document.dispatchEvent(new Event('visibilitychange'));
  442 |     });
  443 |     await skip(page, 'en').click();
  444 |     await expect(page.locator('[data-arena-outcome]')).toBeVisible();
```