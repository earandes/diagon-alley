# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser-boss/boss-a70.spec.ts >> A70 real boss profile fixtures: poses pause speed hidden inspector skip pack and teardown
- Location: tests/browser-boss/boss-a70.spec.ts:310:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false

Call Log:
- Timeout 10000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=f2e3]:
  - banner [ref=f2e4]:
    - heading "DIAGON ALLEY · QA" [level=1] [ref=f2e5]
    - generic [ref=f2e6]: Declared fixture, modified player stats, not a campaign result.
  - main [ref=f2e7]:
    - generic [ref=f2e8]:
      - generic [ref=f2e9]:
        - button "Volver al mapa" [ref=f2e10] [cursor=pointer]: ←
        - heading "Arena de Combate" [level=2] [ref=f2e11]: Hermione Granger
        - generic [ref=f2e12]: Ronda 0
      - generic [ref=f2e13]:
        - group "Reproducción del combate" [ref=f2e14]:
          - button "Pausa" [active] [pressed] [ref=f2e15] [cursor=pointer]: Ⅱ Pausa
          - button "Auto" [ref=f2e16] [cursor=pointer]: ▷ Auto
          - button "2x" [ref=f2e17] [cursor=pointer]
          - button "Omitir reproducción" [ref=f2e18] [cursor=pointer]: ▸▸|
        - button "Registro del combate" [ref=f2e20] [cursor=pointer]
      - generic [ref=f2e24]:
        - region "Tu Equipo" [ref=f2e25]:
          - heading "Tu Equipo" [level=3] [ref=f2e26]
          - generic [ref=f2e27]:
            - article "Tu Equipo · Unidad 1 · Harry Potter" [ref=f2e28]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 1 · Harry Potter" [ref=f2e29] [cursor=pointer]':
                - strong [ref=f2e32]: Harry Potter
                - generic [aria-hidden] [ref=f2e33]: "1"
                - generic [ref=f2e34]:
                  - meter "Vida de Tu Equipo · Unidad 1 · Harry Potter" [ref=f2e35]
                  - generic [ref=f2e36]:
                    - text: "350"
                    - generic [ref=f2e37]: / 350 PV
            - article "Tu Equipo · Unidad 2 · Albus Dumbledore" [ref=f2e38]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 2 · Albus Dumbledore" [ref=f2e39] [cursor=pointer]':
                - strong [ref=f2e42]: Albus Dumbledore
                - generic [aria-hidden] [ref=f2e43]: "2"
                - generic [ref=f2e44]:
                  - meter "Vida de Tu Equipo · Unidad 2 · Albus Dumbledore" [ref=f2e45]
                  - generic [ref=f2e46]:
                    - text: "350"
                    - generic [ref=f2e47]: / 350 PV
            - article "Tu Equipo · Unidad 3 · Minerva McGonagall" [ref=f2e48]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 3 · Minerva McGonagall" [ref=f2e49] [cursor=pointer]':
                - strong [ref=f2e52]: Minerva McGonagall
                - generic [aria-hidden] [ref=f2e53]: "3"
                - generic [ref=f2e54]:
                  - meter "Vida de Tu Equipo · Unidad 3 · Minerva McGonagall" [ref=f2e55]
                  - generic [ref=f2e56]:
                    - text: "350"
                    - generic [ref=f2e57]: / 350 PV
            - article "Tu Equipo · Unidad 4 · Nicolás Flamel" [ref=f2e58]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 4 · Nicolás Flamel" [ref=f2e59] [cursor=pointer]':
                - strong [ref=f2e62]: Nicolás Flamel
                - generic [aria-hidden] [ref=f2e63]: "4"
                - generic [ref=f2e64]:
                  - meter "Vida de Tu Equipo · Unidad 4 · Nicolás Flamel" [ref=f2e65]
                  - generic [ref=f2e66]:
                    - text: "350"
                    - generic [ref=f2e67]: / 350 PV
            - article "Tu Equipo · Unidad 5 · Severus Snape" [ref=f2e68]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 5 · Severus Snape" [ref=f2e69] [cursor=pointer]':
                - strong [ref=f2e72]: Severus Snape
                - generic [aria-hidden] [ref=f2e73]: "5"
                - generic [ref=f2e74]:
                  - meter "Vida de Tu Equipo · Unidad 5 · Severus Snape" [ref=f2e75]
                  - generic [ref=f2e76]:
                    - text: "350"
                    - generic [ref=f2e77]: / 350 PV
          - paragraph [ref=f2e78]
        - region "Rival" [ref=f2e79]:
          - heading "Rival" [level=3] [ref=f2e80]
          - generic [ref=f2e81]:
            - article "Rival · Unidad 1 · Hermione Granger" [ref=f2e82]:
              - 'button "Inspeccionar: Rival · Unidad 1 · Hermione Granger" [ref=f2e83] [cursor=pointer]':
                - strong [ref=f2e86]: Hermione Granger
                - generic [aria-hidden] [ref=f2e87]: "1"
                - generic [ref=f2e88]:
                  - meter "Vida de Rival · Unidad 1 · Hermione Granger" [ref=f2e89]
                  - generic [ref=f2e90]:
                    - text: "85"
                    - generic [ref=f2e91]: / 85 PV
            - article "Rival · Unidad 2 · Ron Weasley" [ref=f2e92]:
              - 'button "Inspeccionar: Rival · Unidad 2 · Ron Weasley" [ref=f2e93] [cursor=pointer]':
                - strong [ref=f2e96]: Ron Weasley
                - generic [aria-hidden] [ref=f2e97]: "2"
                - generic [ref=f2e98]:
                  - meter "Vida de Rival · Unidad 2 · Ron Weasley" [ref=f2e99]
                  - generic [ref=f2e100]:
                    - text: "90"
                    - generic [ref=f2e101]: / 90 PV
            - article "Rival · Unidad 3 · Arthur Weasley" [ref=f2e102]:
              - 'button "Inspeccionar: Rival · Unidad 3 · Arthur Weasley" [ref=f2e103] [cursor=pointer]':
                - strong [ref=f2e106]: Arthur Weasley
                - generic [aria-hidden] [ref=f2e107]: "3"
                - generic [ref=f2e108]:
                  - meter "Vida de Rival · Unidad 3 · Arthur Weasley" [ref=f2e109]
                  - generic [ref=f2e110]:
                    - text: "85"
                    - generic [ref=f2e111]: / 85 PV
            - article "Rival · Unidad 4 · Nymphadora Tonks" [ref=f2e112]:
              - 'button "Inspeccionar: Rival · Unidad 4 · Nymphadora Tonks" [ref=f2e113] [cursor=pointer]':
                - strong [ref=f2e116]: Nymphadora Tonks
                - generic [aria-hidden] [ref=f2e117]: "4"
                - generic [ref=f2e118]:
                  - meter "Vida de Rival · Unidad 4 · Nymphadora Tonks" [ref=f2e119]
                  - generic [ref=f2e120]:
                    - text: "85"
                    - generic [ref=f2e121]: / 85 PV
            - article "Rival · Unidad 5 · Luna Lovegood" [ref=f2e122]:
              - 'button "Inspeccionar: Rival · Unidad 5 · Luna Lovegood" [ref=f2e123] [cursor=pointer]':
                - strong [ref=f2e126]: Luna Lovegood
                - generic [aria-hidden] [ref=f2e127]: "5"
                - generic [ref=f2e128]:
                  - meter "Vida de Rival · Unidad 5 · Luna Lovegood" [ref=f2e129]
                  - generic [ref=f2e130]:
                    - text: "95"
                    - generic [ref=f2e131]: / 95 PV
          - paragraph [ref=f2e132]
      - paragraph [ref=f2e134]: Comienza el duelo.
      - status [ref=f2e135]
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | import { mkdir, writeFile } from 'node:fs/promises';
  3   | import { resolve } from 'node:path';
  4   | import { changeLanguage, startExpedition } from '../browser-trial/game-fixture';
  5   | import { readGame, reachNode, confirmEvent, expectMapFits } from '../browser-trial/route-helpers';
  6   |
  7   | const evidence = resolve('docs/arcana/boss-increment-2026-10-16/evidence/linux');
  8   | const fixture = 'http://127.0.0.1:5471/tests/browser-boss/boss-a70.html';
  9   | const selected = () =>
  10  |   process.platform === 'linux' &&
  11  |   process.env.ARCANA_CAPTURE_A70 === '1' &&
  12  |   test.info().project.name === 'chromium-1280-boss-a70';
  13  | const label = (lang: 'es' | 'en', es: string, en: string) => (lang === 'es' ? es : en);
  14  | const skip = (page: Page, lang: 'es' | 'en' = 'es') =>
  15  |   page.getByRole('button', {
  16  |     name: label(lang, 'Omitir reproducción', 'Skip playback'),
  17  |     exact: true,
  18  |   });
  19  | const pause = (page: Page, lang: 'es' | 'en' = 'es') =>
  20  |   page.getByRole('button', { name: label(lang, 'Pausa', 'Pause'), exact: true });
  21  | const auto = (page: Page, _lang: 'es' | 'en' = 'es') =>
  22  |   page.getByRole('button', { name: 'Auto', exact: true });
  23  | async function capture(page: Page, name: string) {
  24  |   if (!selected()) return;
  25  |   await mkdir(evidence, { recursive: true });
  26  |   await page.screenshot({ path: resolve(evidence, `selected-${name}.png`), fullPage: false });
  27  | }
  28  | async function report(name: string, data: object) {
  29  |   await mkdir(evidence, { recursive: true });
  30  |   await writeFile(
  31  |     resolve(evidence, `${test.info().project.name}-${name}.json`),
  32  |     JSON.stringify(
  33  |       {
  34  |         sha: process.env.GITHUB_SHA ?? null,
  35  |         engine: test.info().project.use.browserName,
  36  |         viewport: test.info().project.use.viewport,
  37  |         physicalDevice: false,
  38  |         ...data,
  39  |       },
  40  |       null,
  41  |       2,
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
> 67  |     .toBe(true);
      |      ^ Error: expect(received).toBe(expected) // Object.is equality
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
  161 |         expect(box!.y + box!.height).toBeLessThanOrEqual(footerBox!.y);
  162 |       }
  163 |       expect(
  164 |         await prelude
  165 |           .locator('[data-boss-opponent]')
  166 |           .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-boss-opponent'))),
  167 |       ).toEqual(plan.opponents.map((unit) => unit.id));
```
