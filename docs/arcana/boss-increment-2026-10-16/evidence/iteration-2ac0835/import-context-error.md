# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: boss-a70.spec.ts >> A70 absent art and failed renderer import have a usable static result
- Location: tests/browser-boss/boss-a70.spec.ts:541:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.scene-fallback')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.scene-fallback') with timeout 10000ms
  - waiting for locator('.scene-fallback')

```

```yaml
- banner:
  - heading "DIAGON ALLEY · QA" [level=1]
  - text: Declared fixture, modified player stats, not a campaign result.
- main:
  - button "Volver al mapa"
  - heading "Arena de Combate" [level=2]: Hermione Granger
  - text: Ronda 1
  - group "Reproducción del combate":
    - button "Pausa"
    - button "Auto" [pressed]
    - button "2x"
    - button "Omitir reproducción"
  - button "Registro del combate"
  - region "Tu Equipo":
    - heading "Tu Equipo" [level=3]
    - article "Tu Equipo · Unidad 1 · Harry Potter":
      - 'button "Inspeccionar: Tu Equipo · Unidad 1 · Harry Potter"':
        - strong: Harry Potter
        - meter "Vida de Tu Equipo · Unidad 1 · Harry Potter"
        - text: 297 / 350 PV
    - article "Tu Equipo · Unidad 2 · Albus Dumbledore":
      - 'button "Inspeccionar: Tu Equipo · Unidad 2 · Albus Dumbledore"':
        - strong: Albus Dumbledore
        - meter "Vida de Tu Equipo · Unidad 2 · Albus Dumbledore"
        - text: 350 / 350 PV
    - article "Tu Equipo · Unidad 3 · Minerva McGonagall":
      - 'button "Inspeccionar: Tu Equipo · Unidad 3 · Minerva McGonagall"':
        - strong: Minerva McGonagall
        - meter "Vida de Tu Equipo · Unidad 3 · Minerva McGonagall"
        - text: 350 / 350 PV
    - article "Tu Equipo · Unidad 4 · Nicolás Flamel":
      - 'button "Inspeccionar: Tu Equipo · Unidad 4 · Nicolás Flamel"':
        - strong: Nicolás Flamel
        - meter "Vida de Tu Equipo · Unidad 4 · Nicolás Flamel"
        - text: 350 / 350 PV
    - article "Tu Equipo · Unidad 5 · Severus Snape":
      - 'button "Inspeccionar: Tu Equipo · Unidad 5 · Severus Snape"':
        - strong: Severus Snape
        - meter "Vida de Tu Equipo · Unidad 5 · Severus Snape"
        - text: 350 / 350 PV
    - paragraph: Alquimia III
  - region "Rival":
    - heading "Rival" [level=3]
    - article "Rival · Unidad 1 · Hermione Granger":
      - 'button "Inspeccionar: Rival · Unidad 1 · Hermione Granger"':
        - strong: Hermione Granger
        - meter "Vida de Rival · Unidad 1 · Hermione Granger"
        - text: 70 / 85 PV
    - article "Rival · Unidad 2 · Ron Weasley":
      - 'button "Inspeccionar: Rival · Unidad 2 · Ron Weasley"':
        - strong: Ron Weasley
        - meter "Vida de Rival · Unidad 2 · Ron Weasley"
        - text: 90 / 90 PV
    - article "Rival · Unidad 3 · Arthur Weasley":
      - 'button "Inspeccionar: Rival · Unidad 3 · Arthur Weasley"':
        - strong: Arthur Weasley
        - meter "Vida de Rival · Unidad 3 · Arthur Weasley"
        - text: 85 / 85 PV
    - article "Rival · Unidad 4 · Nymphadora Tonks":
      - 'button "Inspeccionar: Rival · Unidad 4 · Nymphadora Tonks"':
        - strong: Nymphadora Tonks
        - meter "Vida de Rival · Unidad 4 · Nymphadora Tonks"
        - text: 85 / 85 PV
    - article "Rival · Unidad 5 · Luna Lovegood":
      - 'button "Inspeccionar: Rival · Unidad 5 · Luna Lovegood"':
        - strong: Luna Lovegood
        - meter "Vida de Rival · Unidad 5 · Luna Lovegood"
        - text: 95 / 95 PV
    - paragraph: Fuego II Sombras I
  - paragraph: Tu Equipo · Unidad 5 · Severus Snape inflige 3 a Rival · Unidad 1 · Hermione Granger.
  - status
```

# Test source

```ts
  465 |         },
  466 |         read: () => ({ samples: [...samples], tasks: supported ? [...tasks] : null }),
  467 |         stop: () => {
  468 |           running = false;
  469 |           cancelAnimationFrame(raf);
  470 |           observer?.disconnect();
  471 |         },
  472 |       },
  473 |     });
  474 |   });
  475 |   await page.goto(`${fixture}?player=5&challenge=mastery`);
  476 |   const scene = page.locator('.scene-canvas');
  477 |   await expect(scene).toHaveAttribute('data-art-ready', 'true');
  478 |   const before = await preserved(page);
  479 |   const startup = await page.evaluate(() => ({
  480 |     elapsed: performance.now(),
  481 |     ...window.__a70Perf.read(),
  482 |   }));
  483 |   // Warm window separate from startup, same10s as A69 but different actor/art fixture.
  484 |   await page.evaluate(() => window.__a70Perf.reset());
  485 |   const draws = Number(await scene.getAttribute('data-render-count'));
  486 |   await page.waitForTimeout(10000);
  487 |   const warm = await page.evaluate(() => window.__a70Perf.read());
  488 |   const actualPaints = Number(await scene.getAttribute('data-render-count')) - draws;
  489 |   expect(actualPaints).toBeGreaterThan(0);
  490 |   const resources: object[] = [];
  491 |   for (let i = 0; i < 8; i++) {
  492 |     if (i) await control(page, 'mount');
  493 |     await expect(scene).toHaveAttribute('data-art-ready', 'true');
  494 |     resources.push(await scene.evaluate((el: HTMLElement) => ({ ...el.dataset })));
  495 |     await control(page, 'unmount');
  496 |     await expect(page.locator('canvas')).toHaveCount(0);
  497 |     expect(
  498 |       await page.evaluate(() =>
  499 |         window.__a70Fixture.retired.every(
  500 |           (el) =>
  501 |             el.dataset.destroyed === 'true' &&
  502 |             el.dataset.textureCount === '0' &&
  503 |             el.dataset.activeTicking === 'false',
  504 |         ),
  505 |       ),
  506 |     ).toBe(true);
  507 |   }
  508 |   expect(await preserved(page)).toEqual(before);
  509 |   await page.evaluate(() => window.__a70Perf.stop());
  510 |   await report('performance-lifetimes', {
  511 |     fixture: true,
  512 |     startup,
  513 |     warm,
  514 |     actualPaints,
  515 |     warmWindowMs: 10000,
  516 |     resources,
  517 |     cycles: 8,
  518 |     traceVideoScreenshots: 'off',
  519 |     limitations: [
  520 |       'rAF intervals are not GPU frame times',
  521 |       'OS cache not reset',
  522 |       'Custom player stats',
  523 |       'No authoritative network latency in fixture',
  524 |       'Different composition from A69 baseline; no causal before-after claim',
  525 |       'Own texture counters, not GPU memory or heap proof',
  526 |     ],
  527 |     targetsNotMeasuredGuarantees: { p95FrameMs: 20, extraBossTexturesBytes: 2097152, skipMs: 100 },
  528 |   });
  529 | });
  530 | 
  531 | declare global {
  532 |   interface Window {
  533 |     __a70Perf: {
  534 |       reset: () => void;
  535 |       read: () => { samples: number[]; tasks: number[] | null };
  536 |       stop: () => void;
  537 |     };
  538 |   }
  539 | }
  540 | 
  541 | test('A70 absent art and failed renderer import have a usable static result', async ({ page }) => {
  542 |   let failedImages = 0;
  543 |   await page.route('**/*', async (route) => {
  544 |     if (route.request().resourceType() === 'image') {
  545 |       failedImages++;
  546 |       await route.abort();
  547 |     } else await route.continue();
  548 |   });
  549 |   await page.goto(`${fixture}?player=3`);
  550 |   await expect(page.locator('.pedestal')).toHaveCount(6);
  551 |   const absentArtState = await preserved(page);
  552 |   await skip(page).click();
  553 |   await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  554 |   await expect(page.locator('.arena-exit')).toBeEnabled();
  555 |   expect(failedImages).toBeGreaterThan(0);
  556 |   expect(await preserved(page)).toEqual(absentArtState);
  557 |   await page.unroute('**/*');
  558 |   let failedImports = 0;
  559 |   await page.route(/\/assets\/pixi-scenes-[^/]+\.js/, async (route) => {
  560 |     failedImports++;
  561 |     await route.abort();
  562 |   });
  563 |   await page.goto(`${fixture}?player=5&challenge=mastery`);
  564 |   const failedImportState = await preserved(page);
> 565 |   await expect(page.locator('.scene-fallback')).toBeVisible();
      |                                                 ^ Error: expect(locator).toBeVisible() failed
  566 |   await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  567 |   await expect(page.locator('.arena-exit')).toBeEnabled();
  568 |   await expect(page.locator('.pedestal')).toHaveCount(10);
  569 |   expect(failedImports).toBeGreaterThan(0);
  570 |   expect(await preserved(page)).toEqual(failedImportState);
  571 |   await report('art-import-fallback', {
  572 |     fixture: true,
  573 |     failedImages,
  574 |     failedImports,
  575 |     stateUnchanged: true,
  576 |   });
  577 | });
  578 | 
  579 | test('A70 missing overlay alone preserves original boss art and usable replay', async ({
  580 |   page,
  581 | }) => {
  582 |   let failedOverlayImages = 0;
  583 |   // Vite emits the >4kB cover as assets/book-cover-HASH.webp. Other small pieces
  584 |   // may be inlined, so block this specific real layer, never base character art.
  585 |   await page.route(/\/assets\/book-cover-[^/]+\.webp/, async (route) => {
  586 |     failedOverlayImages++;
  587 |     await route.abort();
  588 |   });
  589 |   await page.goto(`${fixture}?player=3&pack=diagon-alley`);
  590 |   const scene = page.locator('.scene-canvas');
  591 |   await expect(scene).toHaveAttribute('data-renderer', 'webgl');
  592 |   await expect(scene).toHaveAttribute('data-art-ready', 'true');
  593 |   await expect(scene).toHaveAttribute('data-visible-figures', '6');
  594 |   await expect(scene).toHaveAttribute('data-boss-prop-ready', 'false');
  595 |   const before = await preserved(page);
  596 |   expect(failedOverlayImages).toBeGreaterThan(0);
  597 |   await fits(page, 6);
  598 |   await skip(page).click();
  599 |   await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  600 |   await expect(page.locator('.arena-exit')).toBeEnabled();
  601 |   await page.locator('.arena-record-trigger').click();
  602 |   await expect(page.locator('.battle-log')).toBeVisible();
  603 |   await page.keyboard.press('Escape');
  604 |   expect(await preserved(page)).toEqual(before);
  605 |   await report('overlay-only-failure', {
  606 |     fixture: true,
  607 |     failedOverlayImages,
  608 |     baseFiguresReady: true,
  609 |     staticOriginalBossRetained: true,
  610 |     stateUnchanged: true,
  611 |   });
  612 | });
  613 | 
```