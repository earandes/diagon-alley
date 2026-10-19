# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: creatures-a87.spec.ts >> A87 representative group scenes, missing pose, renderer loss and reduced motion preserve confirmed results
- Location: tests/browser-creatures/creatures-a87.spec.ts:258:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.team-compact [data-bond-progress=creatures] summary').locator('img[data-art]')
Expected: 0
Received: 1
Timeout:  10000ms

Call log:
  - Expect "toHaveCount" locator('.team-compact [data-bond-progress=creatures] summary').locator('img[data-art]') with timeout 10000ms
  - waiting for locator('.team-compact [data-bond-progress=creatures] summary').locator('img[data-art]')
    24 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [ref=f11e3]:
  - banner [ref=f11e4]:
    - heading "DIAGON ALLEY" [level=1] [ref=f11e5]
    - button "Ajustes" [ref=f11e6] [cursor=pointer]
  - main [ref=f11e9]:
    - generic [ref=f11e10]:
      - region "Tu Equipo" [ref=f11e11]:
        - heading "Tu Equipo" [level=2] [ref=f11e12]
        - button "Fawkes" [ref=f11e14] [cursor=pointer]:
          - generic [ref=f11e16]: Copia propia
          - meter "Vida de Fawkes" [ref=f11e19]
        - button "Buckbeak" [ref=f11e21] [cursor=pointer]:
          - generic [ref=f11e23]: Copia propia
          - meter "Vida de Buckbeak" [ref=f11e26]
        - button "Unicornio" [ref=f11e28] [cursor=pointer]:
          - generic [ref=f11e30]: Copia propia
          - meter "Vida de Unicornio" [ref=f11e33]
        - button "Dragón galés verde" [ref=f11e35] [cursor=pointer]:
          - generic [ref=f11e37]: Copia propia
          - meter "Vida de Dragón galés verde" [ref=f11e40]
        - button "Harry Potter" [ref=f11e42] [cursor=pointer]:
          - generic [ref=f11e44]: Copia propia
          - meter "Vida de Harry Potter" [ref=f11e47]
        - button "Prepara tu expedición" [ref=f11e48] [cursor=pointer]
        - generic "Vínculo del equipo" [ref=f11e51]:
          - group [ref=f11e52]:
            - generic "Criaturas fantásticas · Activo nivel 2" [ref=f11e53] [cursor=pointer]: Criaturas fantásticas 4 · II
      - button "Ver lista de nodos" [ref=f11e57] [cursor=pointer]
      - generic [ref=f11e60]:
        - generic "Inicio"
        - button "Pacto Mágico · etapa 1, opción 1 · Disponible" [ref=f11e62] [cursor=pointer]:
          - generic [aria-hidden] [ref=f11e65]: ▴
          - strong [ref=f11e66]: Pacto Mágico
          - generic [ref=f11e67]: Disponible
          - generic [ref=f11e68]: Aliado temporal
        - button "Pacto Mágico · etapa 2, opción 1 · Bloqueado" [ref=f11e70] [cursor=pointer]:
          - strong [ref=f11e73]: Pacto Mágico
          - generic [ref=f11e74]: Bloqueado
        - button "Cofre de Botín · etapa 2, opción 2 · Bloqueado" [ref=f11e76] [cursor=pointer]:
          - strong [ref=f11e79]: Cofre de Botín
          - generic [ref=f11e80]: Bloqueado
        - button "Pacto Mágico · etapa 3, opción 1 · Bloqueado" [ref=f11e82] [cursor=pointer]:
          - strong [ref=f11e85]: Pacto Mágico
          - generic [ref=f11e86]: Bloqueado
        - button "Encuentro · etapa 3, opción 2 · Bloqueado" [ref=f11e88] [cursor=pointer]:
          - strong [ref=f11e91]: Encuentro
          - generic [ref=f11e92]: Bloqueado
        - button "Duelo mágico · etapa 3, opción 3 · Bloqueado" [ref=f11e94] [cursor=pointer]:
          - strong [ref=f11e97]: Duelo mágico
          - generic [ref=f11e98]: Bloqueado
        - button "Refugio Alquímico · etapa 4, opción 1 · Bloqueado" [ref=f11e100] [cursor=pointer]:
          - strong [ref=f11e103]: Refugio Alquímico
          - generic [ref=f11e104]: Bloqueado
        - button "Refugio Alquímico · etapa 4, opción 2 · Bloqueado" [ref=f11e106] [cursor=pointer]:
          - strong [ref=f11e109]: Refugio Alquímico
          - generic [ref=f11e110]: Bloqueado
        - button "Cofre de Botín · etapa 4, opción 3 · Bloqueado" [ref=f11e112] [cursor=pointer]:
          - strong [ref=f11e115]: Cofre de Botín
          - generic [ref=f11e116]: Bloqueado
        - button "Cofre de Botín · etapa 5, opción 1 · Bloqueado" [ref=f11e118] [cursor=pointer]:
          - strong [ref=f11e121]: Cofre de Botín
          - generic [ref=f11e122]: Bloqueado
        - button "Duelo mágico · etapa 5, opción 2 · Bloqueado" [ref=f11e124] [cursor=pointer]:
          - generic: Vanguardia · iniciativa
          - strong [ref=f11e127]: Duelo mágico
          - generic [ref=f11e128]: Bloqueado
        - button "Duelo mágico · etapa 5, opción 3 · Bloqueado" [ref=f11e130] [cursor=pointer]:
          - generic: Vanguardia · iniciativa
          - strong [ref=f11e133]: Duelo mágico
          - generic [ref=f11e134]: Bloqueado
        - button "Refugio Alquímico · etapa 6, opción 1 · Bloqueado" [ref=f11e136] [cursor=pointer]:
          - strong [ref=f11e139]: Refugio Alquímico
          - generic [ref=f11e140]: Bloqueado
        - button "Duelo mágico · etapa 6, opción 2 · Bloqueado" [ref=f11e142] [cursor=pointer]:
          - generic: Fuego · quemadura
          - strong [ref=f11e145]: Duelo mágico
          - generic [ref=f11e146]: Bloqueado
        - button "Encuentro · etapa 6, opción 3 · Bloqueado" [ref=f11e148] [cursor=pointer]:
          - strong [ref=f11e151]: Encuentro
          - generic [ref=f11e152]: Bloqueado
        - button "Jefe de Zona · etapa 7, opción 1 · Bloqueado" [ref=f11e154] [cursor=pointer]:
          - strong [ref=f11e157]: Jefe de Zona
          - generic [ref=f11e158]: Bloqueado
  - contentinfo [ref=f11e159]:
    - text: Declared presentation fixture
    - button "Combat fixture" [ref=f11e160] [cursor=pointer]
    - button "Swap" [ref=f11e161] [cursor=pointer]
    - button "Reduce" [ref=f11e162] [cursor=pointer]
```

# Test source

```ts
  305 |               }
  306 |               if (ready) {
  307 |                 document.querySelector<HTMLButtonElement>('.arena-pause')!.click();
  308 |                 done();
  309 |               } else if (performance.now() > until)
  310 |                 reject(Error(`No confirmed ${wanted} effect observed`));
  311 |               else requestAnimationFrame(observe);
  312 |             };
  313 |             observe();
  314 |           }),
  315 |         bond,
  316 |       );
  317 |       await closeBattleOptions(page);
  318 |       if (bond === 'order') {
  319 |         await expect(page.locator('.pedestal[data-aid=true]')).toHaveCount(1);
  320 |         await expect(page.locator('.pedestal[data-acting=true]')).toHaveCount(1);
  321 |         expect(await page.locator('.pedestal[data-aid=true]').getAttribute('data-unit')).not.toBe(
  322 |           await page.locator('.pedestal[data-acting=true]').getAttribute('data-unit'),
  323 |         );
  324 |       }
  325 |       if (lang === 'es') await picture(page, `bond-${bond}-effect-390`);
  326 |       await skipBattle(page);
  327 |       await immutable(page);
  328 |     }
  329 |   // A declared reversed composition tests renderer orientation, not new campaign enemies.
  330 |   await page.goto(`${fixture}?mode=battle&rival-creatures=1&lang=es&pack=arcana`);
  331 |   await expect(page.locator('.pedestal[data-side=rival][data-creature]')).toHaveCount(4);
  332 |   await castAndPause(page);
  333 |   await fits(page);
  334 |   await expect(page.locator('.scene-arena')).toHaveAttribute('data-creature-facing', 'left');
  335 |   await picture(page, 'creature-rival-declared-390');
  336 |   await skipBattle(page);
  337 |   await immutable(page);
  338 |   await page.goto(`${fixture}?mode=opening&lang=es&pack=diagon-alley`);
  339 |   await expect(page.locator('dialog.reveal')).toHaveAttribute('data-opening-phase', 'reveal', {
  340 |     timeout: 15000,
  341 |   });
  342 |   await picture(page, 'creature-reveal-390');
  343 |   await immutable(page);
  344 |   let missingPoses = 0;
  345 |   await page.route(/\/cast(?:-[^/]+)?\.webp(?:\?.*)?$/, (route) => {
  346 |     missingPoses++;
  347 |     return route.abort();
  348 |   });
  349 |   await page.goto(`${fixture}?mode=battle&lang=es&pack=diagon-alley`);
  350 |   await expect(page.locator('.scene-arena')).toHaveAttribute('data-art-ready', 'true');
  351 |   await fits(page);
  352 |   await expect.poll(() => missingPoses).toBeGreaterThan(0);
  353 |   await expect(page.locator('.scene-arena')).not.toHaveAttribute('data-creature-textures', '4');
  354 |   await expect(page.locator('.pedestal[data-acting=true][data-creature]')).toHaveCount(1);
  355 |   await expect(page.locator('.scene-arena')).toHaveAttribute('data-creature-pose', 'rest');
  356 |   await immutable(page);
  357 |   await page
  358 |     .locator('.scene-arena canvas')
  359 |     .evaluate((el) =>
  360 |       el.dispatchEvent(new Event('webglcontextlost', { bubbles: true, cancelable: true })),
  361 |     );
  362 |   await expect(page.locator('.scene-fallback')).toBeVisible();
  363 |   await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  364 |   await expect(page.locator('.arena-caption button')).toBeEnabled();
  365 |   await immutable(page);
  366 |   await page.emulateMedia({ reducedMotion: 'reduce' });
  367 |   await page.goto(`${fixture}?mode=battle&reduced=1&lang=en&pack=arcana`);
  368 |   await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  369 |   await immutable(page);
  370 |   await page.goto(`${fixture}?mode=pact&lang=es&pack=diagon-alley`);
  371 |   await expect(page.locator('[data-pact-candidate]')).toHaveCount(2);
  372 |   await page.locator('[data-pact-candidate$=":creature"]').click();
  373 |   await expect(page.locator('[data-bond-progress=creatures]')).toHaveAttribute(
  374 |     'data-active',
  375 |     'true',
  376 |   );
  377 |   await expect(page.locator('[data-preparation-synergies]>summary')).toContainText(
  378 |     /afinidad|affinity/,
  379 |   );
  380 |   await immutable(page);
  381 |   await picture(page, 'creature-pact-390');
  382 |   await page.emulateMedia({ reducedMotion: 'no-preference' });
  383 |   await page.route('**/pixi-scenes-*.js', (route) => route.abort());
  384 |   await page.goto(`${fixture}?mode=battle&lang=es&pack=diagon-alley`);
  385 |   await expect(page.locator('.scene-fallback')).toBeVisible();
  386 |   await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  387 |   await immutable(page);
  388 |   await page.unroute('**/pixi-scenes-*.js');
  389 |   await page.setViewportSize({ width: 320, height: 844 });
  390 |   await page.goto(`${fixture}?mode=prepare&lang=en&pack=arcana`);
  391 |   await page.evaluate(() => {
  392 |     document.documentElement.style.fontSize = '200%';
  393 |   });
  394 |   await page.locator('.bond-selector>summary').click();
  395 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
  396 |     true,
  397 |   );
  398 |   await expect(page.locator('[data-bond-mode=creatures]')).toBeEnabled();
  399 |   await immutable(page);
  400 | 
  401 |   await page.route(/\/bond-creatures(?:-[^/]+)?\.svg(?:\?.*)?$/, (route) => route.abort());
  402 |   await page.setViewportSize({ width: 390, height: 844 });
  403 |   await page.goto(`${fixture}?mode=map&lang=es&pack=diagon-alley`);
  404 |   const missingSeal = page.locator('.team-compact [data-bond-progress=creatures] summary');
> 405 |   await expect(missingSeal.locator('img[data-art]')).toHaveCount(0);
      |                                                      ^ Error: expect(locator).toHaveCount(expected) failed
  406 |   await expect(missingSeal).toContainText('Criaturas fantásticas');
  407 |   expect(
  408 |     await missingSeal
  409 |       .locator('span')
  410 |       .last()
  411 |       .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  412 |   ).toBeGreaterThan(0);
  413 |   await missingSeal.press('Enter');
  414 |   await expect(page.locator('.team-compact .house-detail')).toBeVisible();
  415 |   await immutable(page);
  416 |   await report('representative-adverse-states', {
  417 |     groups: ['order', 'death'],
  418 |     declaredRivalCreatureOrientation: true,
  419 |     missingCast: true,
  420 |     missingBondSeal: true,
  421 |     rendererLoss: true,
  422 |     importFailure: true,
  423 |     text320x200: true,
  424 |     reduced: true,
  425 |     pactPreview: true,
  426 |     scope: 'Presentation fixtures; persistence and actual node commits covered separately',
  427 |   });
  428 | });
  429 | 
  430 | test('A87 bounded creature workload measures action, pose loading and sustained replay in fresh contexts', async ({
  431 |   browser,
  432 | }, info) => {
  433 |   test.skip(
  434 |     info.project.name !== 'chromium-390-motion-a69',
  435 |     'Six bounded fresh-context samples on one declared Linux environment; not a device claim.',
  436 |   );
  437 |   const rows = [];
  438 |   for (const pack of ['diagon-alley', 'arcana'])
  439 |     for (let sample = 0; sample < 3; sample++) {
  440 |       const context = await browser.newContext({
  441 |         viewport: { width: 390, height: 844 },
  442 |         serviceWorkers: 'block',
  443 |         reducedMotion: 'no-preference',
  444 |       });
  445 |       try {
  446 |         const p = await context.newPage();
  447 |         await p.goto(`${fixture}?mode=map&lang=es&pack=${pack}`);
  448 |         await expect(p.locator('.team-compact')).toBeVisible();
  449 |         await p.evaluate(() => {
  450 |           const durations: number[] = [];
  451 |           const observer = new PerformanceObserver((list) => {
  452 |             for (const e of list.getEntries()) durations.push(e.duration);
  453 |           });
  454 |           if (PerformanceObserver.supportedEntryTypes.includes('longtask'))
  455 |             observer.observe({ type: 'longtask' });
  456 |           Object.assign(window, {
  457 |             __a87Performance: { durations, stop: () => observer.disconnect() },
  458 |           });
  459 |         });
  460 |         await p.locator('[data-qa-combat]').click();
  461 |         await expect(p.locator('.scene-arena')).toHaveAttribute('data-art-ready', 'true');
  462 |         await fits(p);
  463 |         const ready = await p.evaluate(() => ({
  464 |           now: performance.now(),
  465 |           start: (window as unknown as { __a87: { entryStarted: number } }).__a87.entryStarted,
  466 |         }));
  467 |         // Pose textures are recorded separately; their cost remains inside action→prepared, not hidden in another screen.
  468 |         await expect(p.locator('.scene-arena')).toHaveAttribute('data-creature-textures', '4');
  469 |         const prepared = await p.evaluate(() => performance.now());
  470 |         const sustained = await p.evaluate(async () => {
  471 |           const values: number[] = [];
  472 |           let last = performance.now();
  473 |           let firstReportedCastAt: number | null = null;
  474 |           for (let i = 0; i < 300; i++)
  475 |             await new Promise<void>((done) =>
  476 |               requestAnimationFrame((now) => {
  477 |                 values.push(now - last);
  478 |                 last = now;
  479 |                 if (
  480 |                   firstReportedCastAt === null &&
  481 |                   document.querySelector<HTMLElement>('.scene-arena')?.dataset.creaturePose ===
  482 |                     'cast'
  483 |                 )
  484 |                   firstReportedCastAt = now;
  485 |                 done();
  486 |               }),
  487 |             );
  488 |           const sorted = [...values].sort((a, b) => a - b);
  489 |           const data = (
  490 |             window as unknown as { __a87Performance: { durations: number[]; stop(): void } }
  491 |           ).__a87Performance;
  492 |           data.stop();
  493 |           const host = document.querySelector<HTMLElement>('.scene-arena')!;
  494 |           return {
  495 |             firstReportedCastAt,
  496 |             intervals: values,
  497 |             p95: sorted[Math.ceil(0.95 * sorted.length) - 1],
  498 |             max: sorted.at(-1),
  499 |             longTasks: data.durations,
  500 |             textureCount: host.dataset.textureCount,
  501 |             textureRgbaEstimate: host.dataset.textureBytes,
  502 |           };
  503 |         });
  504 |         rows.push({
  505 |           pack,
```