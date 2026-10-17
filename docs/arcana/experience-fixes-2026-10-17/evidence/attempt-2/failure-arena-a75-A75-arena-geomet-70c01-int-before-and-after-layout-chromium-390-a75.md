# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: arena-a75.spec.ts >> A75 arena geometry and source footprint before and after layout
- Location: tests/browser-experience-fixes/arena-a75.spec.ts:75:1

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 845
Received:    1041
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - banner [ref=f1e4]:
    - heading "DIAGON ALLEY · QA" [level=1] [ref=f1e5]
    - generic [ref=f1e6]: Declared fixture, modified player stats, not a campaign result.
  - main [ref=f1e7]:
    - generic [ref=f1e8]:
      - generic [ref=f1e9]:
        - button "Volver al mapa" [ref=f1e10] [cursor=pointer]: ←
        - heading "Arena de Combate" [level=2] [ref=f1e11]: Hermione Granger
        - generic [ref=f1e12]: Ronda 0
      - generic [ref=f1e13]:
        - group "Reproducción del combate" [ref=f1e14]:
          - button "Pausa" [active] [pressed] [ref=f1e15] [cursor=pointer]: Ⅱ Pausa
          - button "Auto" [ref=f1e16] [cursor=pointer]: ▷ Auto
          - button "2x" [ref=f1e17] [cursor=pointer]
          - button "Omitir reproducción" [ref=f1e18] [cursor=pointer]: ▸▸|
        - button "Registro del combate" [ref=f1e20] [cursor=pointer]
      - generic [ref=f1e24]:
        - region "Tu Equipo" [ref=f1e25]:
          - heading "Tu Equipo" [level=3] [ref=f1e26]
          - generic [ref=f1e27]:
            - article "Tu Equipo · Unidad 1 · Harry Potter" [ref=f1e28]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 1 · Harry Potter" [ref=f1e29] [cursor=pointer]':
                - strong [ref=f1e32]: Harry Potter
                - generic [aria-hidden] [ref=f1e33]: "1"
                - generic [ref=f1e34]:
                  - meter "Vida de Tu Equipo · Unidad 1 · Harry Potter" [ref=f1e35]
                  - generic [ref=f1e36]:
                    - text: "350"
                    - generic [ref=f1e37]: / 350 PV
            - article "Tu Equipo · Unidad 2 · Albus Dumbledore" [ref=f1e38]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 2 · Albus Dumbledore" [ref=f1e39] [cursor=pointer]':
                - strong [ref=f1e42]: Albus Dumbledore
                - generic [aria-hidden] [ref=f1e43]: "2"
                - generic [ref=f1e44]:
                  - meter "Vida de Tu Equipo · Unidad 2 · Albus Dumbledore" [ref=f1e45]
                  - generic [ref=f1e46]:
                    - text: "350"
                    - generic [ref=f1e47]: / 350 PV
            - article "Tu Equipo · Unidad 3 · Minerva McGonagall" [ref=f1e48]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 3 · Minerva McGonagall" [ref=f1e49] [cursor=pointer]':
                - strong [ref=f1e52]: Minerva McGonagall
                - generic [aria-hidden] [ref=f1e53]: "3"
                - generic [ref=f1e54]:
                  - meter "Vida de Tu Equipo · Unidad 3 · Minerva McGonagall" [ref=f1e55]
                  - generic [ref=f1e56]:
                    - text: "350"
                    - generic [ref=f1e57]: / 350 PV
            - article "Tu Equipo · Unidad 4 · Nicolás Flamel" [ref=f1e58]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 4 · Nicolás Flamel" [ref=f1e59] [cursor=pointer]':
                - strong [ref=f1e62]: Nicolás Flamel
                - generic [aria-hidden] [ref=f1e63]: "4"
                - generic [ref=f1e64]:
                  - meter "Vida de Tu Equipo · Unidad 4 · Nicolás Flamel" [ref=f1e65]
                  - generic [ref=f1e66]:
                    - text: "350"
                    - generic [ref=f1e67]: / 350 PV
            - article "Tu Equipo · Unidad 5 · Severus Snape" [ref=f1e68]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 5 · Severus Snape" [ref=f1e69] [cursor=pointer]':
                - strong [ref=f1e72]: Severus Snape
                - generic [aria-hidden] [ref=f1e73]: "5"
                - generic [ref=f1e74]:
                  - meter "Vida de Tu Equipo · Unidad 5 · Severus Snape" [ref=f1e75]
                  - generic [ref=f1e76]:
                    - text: "350"
                    - generic [ref=f1e77]: / 350 PV
          - paragraph [ref=f1e78]
        - region "Rival" [ref=f1e79]:
          - heading "Rival" [level=3] [ref=f1e80]
          - generic [ref=f1e81]:
            - article "Rival · Unidad 1 · Hermione Granger" [ref=f1e82]:
              - 'button "Inspeccionar: Rival · Unidad 1 · Hermione Granger" [ref=f1e83] [cursor=pointer]':
                - strong [ref=f1e86]: Hermione Granger
                - generic [aria-hidden] [ref=f1e87]: "1"
                - generic [ref=f1e88]:
                  - meter "Vida de Rival · Unidad 1 · Hermione Granger" [ref=f1e89]
                  - generic [ref=f1e90]:
                    - text: "85"
                    - generic [ref=f1e91]: / 85 PV
            - article "Rival · Unidad 2 · Rival mágico" [ref=f1e92]:
              - 'button "Inspeccionar: Rival · Unidad 2 · Rival mágico" [ref=f1e93] [cursor=pointer]':
                - strong [ref=f1e96]: Rival mágico
                - generic [aria-hidden] [ref=f1e97]: "2"
                - generic [ref=f1e98]:
                  - meter "Vida de Rival · Unidad 2 · Rival mágico" [ref=f1e99]
                  - generic [ref=f1e100]:
                    - text: "80"
                    - generic [ref=f1e101]: / 80 PV
            - article "Rival · Unidad 3 · Rival mágico" [ref=f1e102]:
              - 'button "Inspeccionar: Rival · Unidad 3 · Rival mágico" [ref=f1e103] [cursor=pointer]':
                - strong [ref=f1e106]: Rival mágico
                - generic [aria-hidden] [ref=f1e107]: "3"
                - generic [ref=f1e108]:
                  - meter "Vida de Rival · Unidad 3 · Rival mágico" [ref=f1e109]
                  - generic [ref=f1e110]:
                    - text: "80"
                    - generic [ref=f1e111]: / 80 PV
          - paragraph [ref=f1e112]
      - paragraph [ref=f1e114]: Combate guardado
      - status [ref=f1e115]
```

# Test source

```ts
  28  |             top = c.height,
  29  |             right = -1,
  30  |             bottom = -1;
  31  |           for (let y = 0; y < c.height; y++)
  32  |             for (let x = 0; x < c.width; x++)
  33  |               if (data[(y * c.width + x) * 4 + 3] > 8) {
  34  |                 left = Math.min(left, x);
  35  |                 right = Math.max(right, x);
  36  |                 top = Math.min(top, y);
  37  |                 bottom = Math.max(bottom, y);
  38  |               }
  39  |           const scale = space.getBoundingClientRect().height / c.height;
  40  |           alpha = {
  41  |             width: (right - left + 1) * scale,
  42  |             height: (bottom - top + 1) * scale,
  43  |             ratio: (bottom - top + 1) / c.height,
  44  |           };
  45  |           c.width = 0;
  46  |           c.height = 0;
  47  |         }
  48  |         return {
  49  |           id: p.dataset.unit,
  50  |           boss: p.dataset.bossActor === 'true',
  51  |           pedestal: box(p),
  52  |           figure: box(space),
  53  |           name: box(p.querySelector('.arena-inspect > strong')!),
  54  |           health: box(p.querySelector('.arena-health')!),
  55  |           alphaSourceFootprint: alpha,
  56  |         };
  57  |       }),
  58  |     );
  59  |     return {
  60  |       viewport: { width: innerWidth, height: innerHeight },
  61  |       header: box(document.querySelector('.game-header')!),
  62  |       heading: box(document.querySelector('.arena-heading')!),
  63  |       tools: box(document.querySelector('.arena-playback-tools')!),
  64  |       stage: box(document.querySelector('.arena-stage')!),
  65  |       caption: box(document.querySelector('.arena-caption')!),
  66  |       scroll: {
  67  |         width: document.documentElement.scrollWidth,
  68  |         height: document.documentElement.scrollHeight,
  69  |       },
  70  |       rows,
  71  |     };
  72  |   });
  73  | }
  74  | 
  75  | test('A75 arena geometry and source footprint before and after layout', async ({ page }) => {
  76  |   const errors: string[] = [];
  77  |   page.on('pageerror', (e) => errors.push(String(e)));
  78  |   const samples = [];
  79  |   const shapes = [
  80  |     { player: 3, challenge: 'discovery', rival: 3 },
  81  |     { player: 5, challenge: 'discovery', rival: 3 },
  82  |     { player: 5, challenge: 'mastery', rival: 5 },
  83  |   ];
  84  |   for (const language of phase === 'baseline' ? ['es'] : ['es', 'en'])
  85  |     for (const pack of ['diagon-alley', 'arcana'])
  86  |       for (const shape of shapes) {
  87  |         const url = `http://127.0.0.1:5521/tests/browser-boss/boss-a70.html?player=${shape.player}&challenge=${shape.challenge}&pack=${pack}&lang=${language}`;
  88  |         const started = Date.now();
  89  |         await page.goto(url);
  90  |         const panel = page.locator('.battle-panel'),
  91  |           scene = page.locator('.scene-canvas');
  92  |         await expect(scene).toHaveAttribute('data-art-ready', 'true');
  93  |         await expect(scene).toHaveAttribute('data-boss-actor-ready', 'true');
  94  |         await page
  95  |           .getByRole('button', { name: language === 'es' ? 'Pausa' : 'Pause', exact: true })
  96  |           .click();
  97  |         await expect(panel).toHaveAttribute('data-replay-playing', 'false');
  98  |         await expect(page.locator('.pedestal')).toHaveCount(shape.player + shape.rival);
  99  |         const g = await geometry(page);
  100 |         samples.push({
  101 |           pack,
  102 |           language,
  103 |           shape,
  104 |           actionToPausedReadyWallMs: Date.now() - started,
  105 |           geometry: g,
  106 |         });
  107 |         await mkdir(evidence, { recursive: true });
  108 |         await writeFile(
  109 |           resolve(evidence, `${phase}-${test.info().project.name}-geometry.json`),
  110 |           JSON.stringify(
  111 |             {
  112 |               sha: process.env.GITHUB_SHA,
  113 |               phase,
  114 |               fixture: true,
  115 |               physicalDevice: false,
  116 |               samples,
  117 |               errors,
  118 |             },
  119 |             null,
  120 |             2,
  121 |           ),
  122 |         );
  123 |         for (const r of g.rows)
  124 |           for (const b of [r.pedestal, r.figure, r.name, r.health]) {
  125 |             expect(b.x).toBeGreaterThanOrEqual(-1);
  126 |             expect(b.y).toBeGreaterThanOrEqual(-1);
  127 |             expect(b.right).toBeLessThanOrEqual(g.viewport.width + 1);
> 128 |             expect(b.bottom).toBeLessThanOrEqual(g.viewport.height + 1);
      |                              ^ Error: expect(received).toBeLessThanOrEqual(expected)
  129 |           }
  130 |         expect(g.scroll.width).toBeLessThanOrEqual(g.viewport.width + 1);
  131 |         expect(g.scroll.height).toBeLessThanOrEqual(g.viewport.height + 1);
  132 |         if (
  133 |           process.platform === 'linux' &&
  134 |           process.env.ARCANA_CAPTURE_A75 === '1' &&
  135 |           test.info().project.name === 'chromium-390-a75' &&
  136 |           shape.rival === 5 &&
  137 |           language === 'es'
  138 |         ) {
  139 |           await mkdir(evidence, { recursive: true });
  140 |           await page.screenshot({
  141 |             path: resolve(evidence, `${phase}-${pack}-dense.png`),
  142 |             fullPage: false,
  143 |           });
  144 |         }
  145 |       }
  146 |   expect(errors).toEqual([]);
  147 |   await mkdir(evidence, { recursive: true });
  148 |   await writeFile(
  149 |     resolve(evidence, `${phase}-${test.info().project.name}-geometry.json`),
  150 |     JSON.stringify(
  151 |       {
  152 |         sha: process.env.GITHUB_SHA,
  153 |         phase,
  154 |         fixture: true,
  155 |         physicalDevice: false,
  156 |         alphaMethod:
  157 |           'Alpha>8 source bounding box projected to renderer figure height; not a GPU pixel/memory measurement.',
  158 |         samples,
  159 |         errors,
  160 |       },
  161 |       null,
  162 |       2,
  163 |     ),
  164 |   );
  165 | });
  166 | 
  167 | test('A75 dense arena retains readable actors and inspector with enlarged text at 320', async ({
  168 |   page,
  169 | }) => {
  170 |   test.skip(
  171 |     test.info().project.name !== 'chromium-390-a75',
  172 |     'One explicit reflow check, not physical zoom or device acceptance.',
  173 |   );
  174 |   const measurements = [];
  175 |   for (const pack of ['diagon-alley', 'arcana']) {
  176 |     await page.goto(
  177 |       `http://127.0.0.1:5521/tests/browser-boss/boss-a70.html?challenge=mastery&player=5&lang=en&pack=${pack}`,
  178 |     );
  179 |     await page.getByRole('button', { name: 'Pause', exact: true }).click();
  180 |     const before = await page.evaluate(() => window.__a70Fixture.battle);
  181 |     await page.setViewportSize({ width: 320, height: 844 });
  182 |     await page.evaluate(() => {
  183 |       document.documentElement.style.fontSize = '200%';
  184 |     });
  185 |     await expect(page.locator('.arena-inspect > strong')).toHaveCount(10);
  186 |     for (const name of await page.locator('.arena-inspect > strong').all()) {
  187 |       await expect(name).toBeVisible();
  188 |       await expect(name).toHaveCSS('font-size', '26px');
  189 |     }
  190 |     expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
  191 |       321,
  192 |     );
  193 |     await page.locator('.arena-inspect').last().click();
  194 |     await expect(page.locator('.arena-inspector[open]')).toBeVisible();
  195 |     await page.keyboard.press('Escape');
  196 |     await expect(page.locator('.arena-inspect').last()).toBeFocused();
  197 |     expect(await page.evaluate(() => window.__a70Fixture.battle)).toBe(before);
  198 |     measurements.push({
  199 |       pack,
  200 |       geometry: await geometry(page),
  201 |       expandedText: true,
  202 |       physicalZoom: false,
  203 |     });
  204 |   }
  205 |   await mkdir(evidence, { recursive: true });
  206 |   await writeFile(
  207 |     resolve(evidence, 'text-reflow.json'),
  208 |     JSON.stringify({ sha: process.env.GITHUB_SHA, fixture: true, measurements }, null, 2),
  209 |   );
  210 | });
  211 | 
```