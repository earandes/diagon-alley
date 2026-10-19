# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: creatures-a87.spec.ts >> A87 creature poses and confirmed bond stay legible, pause exactly and survive skip and swap
- Location: tests/browser-creatures/creatures-a87.spec.ts:159:1

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.click: Test timeout of 180000ms exceeded.
Call log:
  - waiting for locator('.arena-caption button')
    - locator resolved to <button>Continuar</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <button data-qa-pack="true">Swap</button> from <footer class="a87-fixture-controls">…</footer> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <button data-qa-pack="true">Swap</button> from <footer class="a87-fixture-controls">…</footer> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    328 × waiting for element to be visible, enabled and stable
        - element is visible, enabled and stable
        - scrolling into view if needed
        - done scrolling
        - <button data-qa-pack="true">Swap</button> from <footer class="a87-fixture-controls">…</footer> subtree intercepts pointer events
      - retrying click action
        - waiting 500ms
    - waiting for element to be visible, enabled and stable

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - main [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - heading "Arena de Combate" [level=2] [ref=e8]: Duelo de magos
          - generic [ref=e9]: Ronda 6
        - button "Pausa" [ref=e10] [cursor=pointer]
      - generic [ref=e14]:
        - region "Tu Equipo" [ref=e15]:
          - generic [ref=e16]:
            - heading "Tu Equipo" [level=3] [ref=e17]
            - generic "Vínculos confirmados" [ref=e18]:
              - 'button "Consultar vínculo: Criaturas fantásticas · 4 · II" [ref=e19] [cursor=pointer]':
                - generic [ref=e22]: II
          - generic [ref=e23]:
            - article "Tu Equipo · Unidad 1 · Fawkes" [ref=e24]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 1 · Fawkes" [ref=e25] [cursor=pointer]':
                - generic "Fuera de combate" [ref=e28]: ×
                - strong [ref=e29]: Fawkes
                - generic [ref=e32]:
                  - meter "Vida de Tu Equipo · Unidad 1 · Fawkes" [ref=e33]
                  - generic [ref=e34]:
                    - text: "0"
                    - generic [ref=e35]: /80
            - article "Tu Equipo · Unidad 2 · Buckbeak" [ref=e36]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 2 · Buckbeak" [ref=e37] [cursor=pointer]':
                - generic "Fuera de combate" [ref=e40]: ×
                - strong [ref=e41]: Buckbeak
                - generic [ref=e44]:
                  - meter "Vida de Tu Equipo · Unidad 2 · Buckbeak" [ref=e45]
                  - generic [ref=e46]:
                    - text: "0"
                    - generic [ref=e47]: /95
            - article "Tu Equipo · Unidad 3 · Unicornio" [ref=e48]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 3 · Unicornio" [ref=e49] [cursor=pointer]':
                - generic "Fuera de combate" [ref=e52]: ×
                - strong [ref=e53]: Unicornio
                - generic [ref=e56]:
                  - meter "Vida de Tu Equipo · Unidad 3 · Unicornio" [ref=e57]
                  - generic [ref=e58]:
                    - text: "0"
                    - generic [ref=e59]: /90
            - article "Tu Equipo · Unidad 4 · Dragón galés verde" [ref=e60]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 4 · Dragón galés verde" [ref=e61] [cursor=pointer]':
                - strong [ref=e64]: Dragón galés verde
                - generic [ref=e67]:
                  - meter "Vida de Tu Equipo · Unidad 4 · Dragón galés verde" [ref=e68]
                  - generic [ref=e69]:
                    - text: "45"
                    - generic [ref=e70]: /100
            - article "Tu Equipo · Unidad 5 · Harry Potter" [ref=e71]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 5 · Harry Potter" [ref=e72] [cursor=pointer]':
                - strong [ref=e75]: Harry Potter
                - generic [ref=e79]:
                  - meter "Vida de Tu Equipo · Unidad 5 · Harry Potter" [ref=e80]
                  - generic [ref=e81]:
                    - text: "60"
                    - generic [ref=e82]: /100
          - paragraph [ref=e83]:
            - generic "Fuego II · Quemadura 2 PV/turno del objetivo" [ref=e84]: Fuego II
        - region "Rival" [ref=e85]:
          - generic [ref=e86]:
            - heading "Rival" [level=3] [ref=e87]
            - generic "Vínculos confirmados" [ref=e88]:
              - 'button "Consultar casa: Gryffindor · 4 · II" [ref=e89] [cursor=pointer]':
                - generic [ref=e93]: II
          - generic [ref=e94]:
            - article "Rival · Unidad 1 · Hermione Granger" [ref=e95]:
              - 'button "Inspeccionar: Rival · Unidad 1 · Hermione Granger" [ref=e96] [cursor=pointer]':
                - generic "Fuera de combate" [ref=e99]: ×
                - strong [ref=e100]: Hermione Granger
                - generic [ref=e104]:
                  - meter "Vida de Rival · Unidad 1 · Hermione Granger" [ref=e105]
                  - generic [ref=e106]:
                    - text: "0"
                    - generic [ref=e107]: /90
            - article "Rival · Unidad 2 · Ron Weasley" [ref=e108]:
              - 'button "Inspeccionar: Rival · Unidad 2 · Ron Weasley" [ref=e109] [cursor=pointer]':
                - generic "Fuera de combate" [ref=e112]: ×
                - strong [ref=e113]: Ron Weasley
                - generic [ref=e117]:
                  - meter "Vida de Rival · Unidad 2 · Ron Weasley" [ref=e118]
                  - generic [ref=e119]:
                    - text: "0"
                    - generic [ref=e120]: /90
            - article "Rival · Unidad 3 · Luna Lovegood" [ref=e121]:
              - 'button "Inspeccionar: Rival · Unidad 3 · Luna Lovegood" [ref=e122] [cursor=pointer]':
                - strong [ref=e125]: Luna Lovegood
                - generic [ref=e129]:
                  - meter "Vida de Rival · Unidad 3 · Luna Lovegood" [ref=e130]
                  - generic [ref=e131]:
                    - text: "54"
                    - generic [ref=e132]: /90
            - article "Rival · Unidad 4 · Ginny Weasley" [ref=e133]:
              - 'button "Inspeccionar: Rival · Unidad 4 · Ginny Weasley" [ref=e134] [cursor=pointer]':
                - strong [ref=e137]: Ginny Weasley
                - generic [ref=e141]:
                  - meter "Vida de Rival · Unidad 4 · Ginny Weasley" [ref=e142]
                  - generic [ref=e143]:
                    - text: "90"
                    - generic [ref=e144]: /90
            - article "Rival · Unidad 5 · Arthur Weasley" [ref=e145]:
              - 'button "Inspeccionar: Rival · Unidad 5 · Arthur Weasley" [ref=e146] [cursor=pointer]':
                - strong [ref=e149]: Arthur Weasley
                - generic [ref=e153]:
                  - meter "Vida de Rival · Unidad 5 · Arthur Weasley" [ref=e154]
                  - generic [ref=e155]:
                    - text: "90"
                    - generic [ref=e156]: /90
          - paragraph [ref=e157]:
            - generic "Fuego II · Quemadura 2 PV/turno del objetivo" [ref=e158]: Fuego II
            - generic "Sombras I · +2 iniciativa" [ref=e159]: Sombras I
      - generic [ref=e160]:
        - strong [ref=e161]: Empate
        - button "Continuar" [active] [ref=e162] [cursor=pointer]
      - status [ref=e163]: Empate
  - contentinfo [ref=e164]:
    - text: Declared presentation fixture
    - button "Swap" [ref=e165] [cursor=pointer]
    - button "Reduce" [ref=e166] [cursor=pointer]
```

# Test source

```ts
  1  | import { expect, type Page } from '@playwright/test';
  2  | 
  3  | /** Real user navigation for A86. No forced clicks, hidden actions or replay mutation. */
  4  | export async function openBattleOptions(page: Page) {
  5  |   if (!(await page.locator('.arena-pause').count())) return; // Frozen pre-A86 reference UI.
  6  |   const options = page.locator('#arena-options');
  7  |   if (!(await options.isVisible())) await page.locator('.arena-pause').click();
  8  |   await expect(options).toBeVisible();
  9  | }
  10 | export async function closeBattleOptions(page: Page) {
  11 |   if (await page.locator('#arena-options').isVisible())
  12 |     await page.locator('.arena-options-close').click();
  13 | }
  14 | export async function pauseBattle(page: Page) {
  15 |   if (await page.locator('.arena-pause').count()) {
  16 |     if (!(await page.locator('#arena-options').isVisible()))
  17 |       await page.locator('.arena-pause').click();
  18 |     await closeBattleOptions(page);
  19 |   } else await page.getByRole('button', { name: /^(Pausa|Pause)$/ }).click();
  20 | }
  21 | export async function resumeBattle(page: Page) {
  22 |   await openBattleOptions(page);
  23 |   if (await page.locator('.arena-pause').count())
  24 |     await page.locator('.replay-controls button').first().click();
  25 |   else await page.getByRole('button', { name: 'Auto', exact: true }).click();
  26 | }
  27 | export async function skipBattle(page: Page) {
  28 |   await openBattleOptions(page);
  29 |   const skip = page.locator('.replay-controls button').last();
  30 |   if (await skip.isEnabled()) await skip.click();
  31 |   else await closeBattleOptions(page);
  32 | }
  33 | export async function setDoubleBattleSpeed(page: Page) {
  34 |   await openBattleOptions(page);
  35 |   const choice = page.getByRole('button', { name: '2x', exact: true });
  36 |   if ((await choice.getAttribute('aria-pressed')) !== 'true') await choice.click();
  37 |   await closeBattleOptions(page);
  38 | }
  39 | export async function inspectBattleRecord(page: Page) {
  40 |   await openBattleOptions(page);
  41 |   await page.locator('.arena-record-trigger').click();
  42 | }
  43 | export async function leaveBattle(page: Page) {
  44 |   const resultAction = page.locator('.arena-caption button');
> 45 |   if (await resultAction.isVisible()) await resultAction.click();
     |                                                          ^ Error: locator.click: Test timeout of 180000ms exceeded.
  46 |   else if (await page.locator('.arena-pause').count()) {
  47 |     await openBattleOptions(page);
  48 |     await page.locator('.arena-exit').click();
  49 |   } else await page.getByRole('button', { name: /^(Volver al mapa|Back to map)$/ }).click();
  50 | }
  51 | 
```