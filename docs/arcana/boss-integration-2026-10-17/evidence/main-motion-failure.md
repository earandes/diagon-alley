# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: motion-a69.spec.ts >> A69 replay clock: pause, 2x, inspector, hidden, skip and renderer failure preserve result
- Location: tests/browser-motion/motion-a69.spec.ts:231:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "3"
Received: "4"
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "ARCANA · QA" [level=1] [ref=e5]
    - generic [ref=e6]: Declared fixture, not an earned reward
  - main [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e9]:
        - button "Volver al mapa" [ref=e10] [cursor=pointer]: ←
        - heading "Arena de Combate" [level=2] [ref=e11]
        - generic [ref=e12]: Ronda 1
      - generic [ref=e13]:
        - group "Reproducción del combate" [ref=e14]:
          - button "Pausa" [ref=e15] [cursor=pointer]: Ⅱ Pausa
          - button "Auto" [active] [pressed] [ref=e16] [cursor=pointer]: ▷ Auto
          - button "2x" [pressed] [ref=e17] [cursor=pointer]
          - button "Omitir reproducción" [ref=e18] [cursor=pointer]: ▸▸|
        - button "Registro del combate" [ref=e20] [cursor=pointer]
      - generic [ref=e24]:
        - region "Tu Equipo" [ref=e25]:
          - heading "Tu Equipo" [level=3] [ref=e26]
          - generic [ref=e27]:
            - article "Tu Equipo · Unidad 1 · Aprendiz de Alquimia" [ref=e28]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 1 · Aprendiz de Alquimia" [ref=e29] [cursor=pointer]':
                - strong [ref=e32]: Aprendiz de Alquimia
                - generic [aria-hidden] [ref=e33]: "1"
                - generic [ref=e34]:
                  - meter "Vida de Tu Equipo · Unidad 1 · Aprendiz de Alquimia" [ref=e35]
                  - generic [ref=e36]:
                    - text: "250"
                    - generic [ref=e37]: / 300 PV
            - article "Tu Equipo · Unidad 2 · Merlín" [ref=e38]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 2 · Merlín" [ref=e39] [cursor=pointer]':
                - strong [ref=e42]: Merlín
                - generic [aria-hidden] [ref=e43]: "2"
                - generic [ref=e44]:
                  - meter "Vida de Tu Equipo · Unidad 2 · Merlín" [ref=e45]
                  - generic [ref=e46]:
                    - text: "250"
                    - generic [ref=e47]: / 300 PV
            - article "Tu Equipo · Unidad 3 · Morgana Le Fay" [ref=e48]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 3 · Morgana Le Fay" [ref=e49] [cursor=pointer]':
                - strong [ref=e52]: Morgana Le Fay
                - generic [aria-hidden] [ref=e53]: "3"
                - generic [ref=e54]:
                  - meter "Vida de Tu Equipo · Unidad 3 · Morgana Le Fay" [ref=e55]
                  - generic [ref=e56]:
                    - text: "250"
                    - generic [ref=e57]: / 300 PV
            - article "Tu Equipo · Unidad 4 · Nicolás Flamel" [ref=e58]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 4 · Nicolás Flamel" [ref=e59] [cursor=pointer]':
                - strong [ref=e62]: Nicolás Flamel
                - generic [aria-hidden] [ref=e63]: "4"
                - generic [ref=e64]:
                  - meter "Vida de Tu Equipo · Unidad 4 · Nicolás Flamel" [ref=e65]
                  - generic [ref=e66]:
                    - text: "250"
                    - generic [ref=e67]: / 300 PV
            - article "Tu Equipo · Unidad 5 · Paracelso" [ref=e68]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 5 · Paracelso" [ref=e69] [cursor=pointer]':
                - strong [ref=e72]: Paracelso
                - generic [aria-hidden] [ref=e73]: "5"
                - generic [ref=e74]:
                  - meter "Vida de Tu Equipo · Unidad 5 · Paracelso" [ref=e75]
                  - generic [ref=e76]:
                    - text: "250"
                    - generic [ref=e77]: / 300 PV
          - paragraph [ref=e78]:
            - generic "Alquimia III · +3 PV/turno" [ref=e79]: Alquimia III
        - region "Rival" [ref=e80]:
          - heading "Rival" [level=3] [ref=e81]
          - generic [ref=e82]:
            - article "Rival · Unidad 1 · Circe" [ref=e83]:
              - 'button "Inspeccionar: Rival · Unidad 1 · Circe" [ref=e84] [cursor=pointer]':
                - strong [ref=e87]: Circe
                - generic [aria-hidden] [ref=e88]: "1"
                - generic [ref=e89]:
                  - meter "Vida de Rival · Unidad 1 · Circe" [ref=e90]
                  - generic [ref=e91]:
                    - text: "250"
                    - generic [ref=e92]: / 300 PV
            - article "Rival · Unidad 2 · Guardián de las Brasas" [ref=e93]:
              - 'button "Inspeccionar: Rival · Unidad 2 · Guardián de las Brasas" [ref=e94] [cursor=pointer]':
                - strong [ref=e97]: Guardián de las Brasas
                - generic [aria-hidden] [ref=e98]: "2"
                - generic [ref=e99]:
                  - meter "Vida de Rival · Unidad 2 · Guardián de las Brasas" [ref=e100]
                  - generic [ref=e101]:
                    - text: "250"
                    - generic [ref=e102]: / 300 PV
            - article "Rival · Unidad 3 · Vidente de la Bruma" [ref=e103]:
              - 'button "Inspeccionar: Rival · Unidad 3 · Vidente de la Bruma" [ref=e104] [cursor=pointer]':
                - strong [ref=e107]: Vidente de la Bruma
                - generic [aria-hidden] [ref=e108]: "3"
                - generic [ref=e109]:
                  - meter "Vida de Rival · Unidad 3 · Vidente de la Bruma" [ref=e110]
                  - generic [ref=e111]:
                    - text: "250"
                    - generic [ref=e112]: / 300 PV
            - article "Rival · Unidad 4 · Tejedora de Runas" [ref=e113]:
              - 'button "Inspeccionar: Rival · Unidad 4 · Tejedora de Runas" [ref=e114] [cursor=pointer]':
                - strong [ref=e117]: Tejedora de Runas
                - generic [aria-hidden] [ref=e118]: "4"
                - generic [ref=e119]:
                  - meter "Vida de Rival · Unidad 4 · Tejedora de Runas" [ref=e120]
                  - generic [ref=e121]:
                    - text: "250"
                    - generic [ref=e122]: / 300 PV
            - article "Rival · Unidad 5 · Sabio del Cobre" [ref=e123]:
              - 'button "Inspeccionar: Rival · Unidad 5 · Sabio del Cobre" [ref=e124] [cursor=pointer]':
                - strong [ref=e127]: Sabio del Cobre
                - generic [aria-hidden] [ref=e128]: "5"
                - generic [ref=e129]:
                  - meter "Vida de Rival · Unidad 5 · Sabio del Cobre" [ref=e130]
                  - generic [ref=e131]:
                    - text: "250"
                    - generic [ref=e132]: / 300 PV
          - paragraph [ref=e133]:
            - generic "Fuego II · Quemadura 2 PV/turno del objetivo" [ref=e134]: Fuego II
      - paragraph [ref=e136]: Turno de Tu Equipo · Unidad 1 · Aprendiz de Alquimia, iniciativa 8.
      - status [ref=e137]
```

# Test source

```ts
  186 |         const navigationToSceneReadyMs = await page.evaluate(() => performance.now());
  187 |         await pause(page, lang).click();
  188 |         const before = await preserved(page);
  189 |         const panel = page.locator('.battle-panel');
  190 |         expect(await panel.innerText()).not.toMatch(/Victoria|Derrota|Empate|Victory|Defeat|Draw/);
  191 |         expect(await panel.ariaSnapshot()).not.toMatch(
  192 |           /Victoria|Derrota|Empate|Victory|Defeat|Draw/,
  193 |         );
  194 |         await expectFits(page, player + rival);
  195 |         await page.locator('.arena-inspect').first().tap();
  196 |         await expect(page.locator('dialog.arena-inspector[open]')).toBeVisible();
  197 |         await page.keyboard.press('Escape');
  198 |         await expect(page.locator('.arena-inspect').first()).toBeFocused();
  199 |         await markAction(page, '.replay-controls button:last-child');
  200 |         await skip(page, lang).click();
  201 |         await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  202 |         const skipUsableMs = await actionElapsed(page);
  203 |         expect(await preserved(page)).toEqual(before);
  204 |         await report(page, `arena-${pack}-${lang}-${player}x${rival}`, {
  205 |           skipUsableMs,
  206 |           navigationToSceneReadyMs,
  207 |           freshContextFirstNavigation:
  208 |             pack === 'diagon-alley' && lang === 'es' && player === 3 && rival === 3,
  209 |           declaration:
  210 |             'Fixed-seed presentation fixture; no account operation or human play observation',
  211 |         });
  212 |         await control(page, 'unmount');
  213 |         await expect(page.locator('canvas')).toHaveCount(0);
  214 |         await expect
  215 |           .poll(() =>
  216 |             page.evaluate(() =>
  217 |               window.__a69Fixture.retired.every(
  218 |                 (el) =>
  219 |                   el.dataset.destroyed === 'true' &&
  220 |                   el.dataset.activeTicking === 'false' &&
  221 |                   Number(el.dataset.textureCount) === 0,
  222 |               ),
  223 |             ),
  224 |           )
  225 |           .toBe(true);
  226 |       }
  227 |     }
  228 |   expect(posts).toEqual([]);
  229 | });
  230 |
  231 | test('A69 replay clock: pause, 2x, inspector, hidden, skip and renderer failure preserve result', async ({
  232 |   page,
  233 | }) => {
  234 |   await page.goto(`${fixture}?player=5&rival=5`);
  235 |   const panel = page.locator('.battle-panel');
  236 |   const scene = page.locator('.scene-canvas');
  237 |   // Pause before the async renderer is ready: swapping layers must not fade actors away.
  238 |   await pause(page).click();
  239 |   await expect(scene).toHaveAttribute('data-art-ready', 'true');
  240 |   await expect(scene).toHaveAttribute('data-visible-figures', '10');
  241 |   const before = await preserved(page);
  242 |   await expect
  243 |     .poll(async () => Number(await scene.getAttribute('data-render-count')))
  244 |     .toBeGreaterThan(0);
  245 |   await pause(page).click();
  246 |   await settled(page);
  247 |   await expect(panel).toHaveAttribute('data-replay-playing', 'false');
  248 |   const frozen = await panel.getAttribute('data-replay-cursor');
  249 |   const phase = await panel.getAttribute('data-replay-progress');
  250 |   const renders = await scene.getAttribute('data-render-count');
  251 |   await page.waitForTimeout(180);
  252 |   expect(await panel.getAttribute('data-replay-cursor')).toBe(frozen);
  253 |   expect(await panel.getAttribute('data-replay-progress')).toBe(phase);
  254 |   expect(await scene.getAttribute('data-render-count')).toBe(renders);
  255 |   await page.getByRole('button', { name: '2x', exact: true }).click();
  256 |   await expect(panel).toHaveAttribute('data-replay-speed', '2');
  257 |   expect(await panel.getAttribute('data-replay-cursor')).toBe(frozen);
  258 |   expect(await panel.getAttribute('data-replay-progress')).toBe(phase);
  259 |   const retiredHost = await scene.elementHandle();
  260 |   await control(page, 'pack');
  261 |   await expect(scene).toHaveAttribute('data-art-ready', 'true');
  262 |   expect(await retiredHost!.evaluate((el: HTMLElement) => el.dataset.destroyed)).toBe('true');
  263 |   expect(await retiredHost!.evaluate((el: HTMLElement) => el.dataset.textureCount)).toBe('0');
  264 |   expect(await panel.getAttribute('data-replay-cursor')).toBe(frozen);
  265 |   expect(await panel.getAttribute('data-replay-progress')).toBe(phase);
  266 |   await expect(page.locator('.scene-canvas canvas')).toHaveCount(1);
  267 |   await auto(page).click();
  268 |   await expect
  269 |     .poll(async () => Number(await panel.getAttribute('data-replay-cursor')))
  270 |     .toBeGreaterThan(Number(frozen));
  271 |   await page.locator('.arena-inspect').first().click();
  272 |   const inspectedCursor = await panel.getAttribute('data-replay-cursor');
  273 |   await page.waitForTimeout(180);
  274 |   expect(await panel.getAttribute('data-replay-cursor')).toBe(inspectedCursor);
  275 |   await page.keyboard.press('Escape');
  276 |   // Synthetic Page Visibility condition is declared; this is not evidence from
  277 |   // physically backgrounding a phone. It exercises the real visibility listener.
  278 |   await auto(page).click();
  279 |   await page.evaluate(() => {
  280 |     Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  281 |     document.dispatchEvent(new Event('visibilitychange'));
  282 |   });
  283 |   const hiddenCursor = await panel.getAttribute('data-replay-cursor');
  284 |   const hiddenRenders = await scene.getAttribute('data-render-count');
  285 |   await page.waitForTimeout(300);
> 286 |   expect(await panel.getAttribute('data-replay-cursor')).toBe(hiddenCursor);
      |                                                          ^ Error: expect(received).toBe(expected) // Object.is equality
  287 |   expect(await scene.getAttribute('data-render-count')).toBe(hiddenRenders);
  288 |   await page.evaluate(() => {
  289 |     Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
  290 |     document.dispatchEvent(new Event('visibilitychange'));
  291 |   });
  292 |   await expect
  293 |     .poll(async () => Number(await scene.getAttribute('data-render-count')))
  294 |     .toBeGreaterThan(Number(hiddenRenders));
  295 |   await skip(page).click();
  296 |   await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  297 |   await report(page, 'controls', {
  298 |     fixtureStateUnchanged: (await preserved(page)).battle === before.battle,
  299 |   });
  300 |   expect(await preserved(page)).toEqual(before);
  301 |   await control(page, 'unmount');
  302 |   await page.goto(`${fixture}?player=5&rival=3`);
  303 |   await expect(page.locator('.scene-canvas canvas')).toHaveCount(1);
  304 |   const beforeFailure = await preserved(page);
  305 |   await page
  306 |     .locator('.scene-canvas canvas')
  307 |     .evaluate((el) =>
  308 |       el.dispatchEvent(new Event('webglcontextlost', { bubbles: true, cancelable: true })),
  309 |     );
  310 |   await expect(page.locator('.scene-fallback')).toBeVisible();
  311 |   await expect(page.locator('.arena-portrait').first()).not.toHaveCSS('opacity', '0');
  312 |   await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  313 |   await expect(page.locator('.arena-exit')).toBeEnabled();
  314 |   await expect(page.locator('.pedestal')).toHaveCount(8);
  315 |   expect(await preserved(page)).toEqual(beforeFailure);
  316 |   await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
  317 |   await expect
  318 |     .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
  319 |     .toBe(true);
  320 |   await page.goto(`${fixture}?player=5&rival=5&reduced`);
  321 |   await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  322 |   await expect(page.locator('.battle-panel')).toHaveAttribute('data-replay-playing', 'false');
  323 |   await expect(page.locator('.pedestal')).toHaveCount(10);
  324 | });
  325 |
  326 | test('A69 CardReveal actual: four ranks, new/repeat, skip, reduced, language/pack/remount and missing art', async ({
  327 |   page,
  328 | }) => {
  329 |   for (const pack of ['diagon-alley', 'arcana'])
  330 |     for (const lang of ['es', 'en']) {
  331 |       for (const rarity of ['common', 'unusual', 'epic', 'arcane-legendary']) {
  332 |         await page.goto(
  333 |           `${fixture}?kind=opening&pack=${pack}&lang=${lang}&rarity=${rarity}&manual`,
  334 |         );
  335 |         await expect(page.locator('[data-qa-start]')).toBeEnabled();
  336 |         const documentBootToReadyMs = await page.evaluate(() => performance.now());
  337 |         const before = await preserved(page);
  338 |         await markAction(page, '[data-qa-start]');
  339 |         await page.locator('[data-qa-start]').click();
  340 |         await expect(page.locator('.reveal[data-opening-state="result"]')).toBeVisible();
  341 |         await expect(page.locator('.holographic-card')).toBeVisible();
  342 |         expect(
  343 |           await page.locator('.card-stars').evaluate((el) => getComputedStyle(el).opacity),
  344 |         ).toBe('1');
  345 |         const resultUsableMs = await actionElapsed(page);
  346 |         expect(await preserved(page)).toEqual(before);
  347 |         await report(page, `opening-${pack}-${lang}-${rarity}`, {
  348 |           isNew: true,
  349 |           resultUsableMs,
  350 |           documentBootToReadyMs,
  351 |           freshContextFirstNavigation:
  352 |             pack === 'diagon-alley' && lang === 'es' && rarity === 'common',
  353 |           action:
  354 |             'Explicit fixture presentation, includes image/decode/animation; no network authority command in this declared fixture',
  355 |         });
  356 |       }
  357 |       await page.goto(`${fixture}?kind=opening&pack=${pack}&lang=${lang}&rarity=epic&repeat`);
  358 |       const before = await preserved(page);
  359 |       await expect(page.locator('.reveal[data-opening-state="result"]')).toBeVisible();
  360 |       await expect(page.locator('[data-celebration]')).toHaveCount(0);
  361 |       await control(page, 'language');
  362 |       await control(page, 'pack');
  363 |       await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result');
  364 |       await control(page, 'unmount');
  365 |       await control(page, 'mount');
  366 |       await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result');
  367 |       expect(await preserved(page)).toEqual(before);
  368 |       await report(page, `opening-${pack}-${lang}-repeat`, { isNew: false });
  369 |     }
  370 |   await page.goto(`${fixture}?kind=opening&rarity=epic&instance=skip`);
  371 |   const saved = await preserved(page);
  372 |   await page.getByRole('button', { name: 'Omitir animación' }).click();
  373 |   await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result');
  374 |   expect(await preserved(page)).toEqual(saved);
  375 |   await page.reload();
  376 |   await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result');
  377 |   await page.goto(`${fixture}?kind=opening&reduced&rarity=arcane-legendary&instance=reduced`);
  378 |   await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'result');
  379 |   await expect(page.locator('[data-effect="frog-magic"]')).toHaveCount(0);
  380 |   await page.goto(`${fixture}?kind=opening&rarity=common&instance=hidden`);
  381 |   await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state', 'playing');
  382 |   await expect
  383 |     .poll(() => page.locator('.opening-subject').evaluate((el) => getComputedStyle(el).transform))
  384 |     .not.toBe('none');
  385 |   await page.evaluate(() => {
  386 |     Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
```
