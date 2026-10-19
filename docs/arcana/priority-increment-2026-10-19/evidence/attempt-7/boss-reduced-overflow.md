# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser-boss/boss-a70.spec.ts >> A70 boss reduced and failed renderer retain actors outcome record and confirmed state
- Location: tests/browser-boss/boss-a70.spec.ts:470:1

# Error details

```
Error: Every actor, figure, name and health display must fit its pedestal and viewport without page scroll

Every actor, figure, name and health display must fit its pedestal and viewport without page scroll

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 14

- Array []
+ Array [
+   Object {
+     "kind": "document",
+     "scrollHeight": 1017,
+     "scrollWidth": 1280,
+     "viewport": Object {
+       "height": 900,
+       "width": 1280,
+     },
+     "violations": Array [
+       "page-overflow",
+     ],
+   },
+ ]

Call Log:
- Timeout 10000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- main [ref=e4]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - heading "Combat Arena" [level=2] [ref=e8]: Final duel
        - generic [ref=e9]: Round 60
      - button "Pause" [ref=e10] [cursor=pointer]
    - generic [ref=e14]:
      - region "Your Team" [ref=e15]:
        - generic [ref=e16]:
          - heading "Your Team" [level=3] [ref=e17]
          - generic "Active houses"
        - generic [ref=e18]:
          - article "Your Team · Unit 1 · Alchemy Apprentice" [ref=e19]:
            - 'button "Inspect: Your Team · Unit 1 · Alchemy Apprentice" [ref=e20] [cursor=pointer]':
              - generic "Defeated" [ref=e23]: ×
              - strong [ref=e24]: Alchemy Apprentice
              - generic [ref=e25]:
                - meter "Health of Your Team · Unit 1 · Alchemy Apprentice" [ref=e26]
                - generic [ref=e27]:
                  - text: "0"
                  - generic [ref=e28]: /350
          - article "Your Team · Unit 2 · Merlin" [ref=e29]:
            - 'button "Inspect: Your Team · Unit 2 · Merlin" [ref=e30] [cursor=pointer]':
              - generic "Defeated" [ref=e33]: ×
              - strong [ref=e34]: Merlin
              - generic [ref=e35]:
                - meter "Health of Your Team · Unit 2 · Merlin" [ref=e36]
                - generic [ref=e37]:
                  - text: "0"
                  - generic [ref=e38]: /350
          - article "Your Team · Unit 3 · Morgana Le Fay" [ref=e39]:
            - 'button "Inspect: Your Team · Unit 3 · Morgana Le Fay" [ref=e40] [cursor=pointer]':
              - generic "Defeated" [ref=e43]: ×
              - strong [ref=e44]: Morgana Le Fay
              - generic [ref=e45]:
                - meter "Health of Your Team · Unit 3 · Morgana Le Fay" [ref=e46]
                - generic [ref=e47]:
                  - text: "0"
                  - generic [ref=e48]: /350
          - article "Your Team · Unit 4 · Nicolas Flamel" [ref=e49]:
            - 'button "Inspect: Your Team · Unit 4 · Nicolas Flamel" [ref=e50] [cursor=pointer]':
              - strong [ref=e53]: Nicolas Flamel
              - generic [ref=e54]:
                - meter "Health of Your Team · Unit 4 · Nicolas Flamel" [ref=e55]
                - generic [ref=e56]:
                  - text: "216"
                  - generic [ref=e57]: /350
          - article "Your Team · Unit 5 · Paracelsus" [ref=e58]:
            - 'button "Inspect: Your Team · Unit 5 · Paracelsus" [ref=e59] [cursor=pointer]':
              - strong [ref=e62]: Paracelsus
              - generic [ref=e63]:
                - meter "Health of Your Team · Unit 5 · Paracelsus" [ref=e64]
                - generic [ref=e65]:
                  - text: "350"
                  - generic [ref=e66]: /350
        - paragraph [ref=e67]:
          - generic "Alchemy III · +3 HP/turn" [ref=e68]: Alchemy III
      - region "Opponent" [ref=e69]:
        - generic [ref=e70]:
          - heading "Opponent" [level=3] [ref=e71]
          - generic "Active houses"
        - generic [ref=e72]:
          - article "Opponent · Unit 1 · Circe" [ref=e73]:
            - 'button "Inspect: Opponent · Unit 1 · Circe" [ref=e74] [cursor=pointer]':
              - generic "Defeated" [ref=e77]: ×
              - strong [ref=e78]: Circe
              - generic [ref=e79]:
                - meter "Health of Opponent · Unit 1 · Circe" [ref=e80]
                - generic [ref=e81]:
                  - text: "0"
                  - generic [ref=e82]: /85
          - article "Opponent · Unit 2 · Ember Keeper" [ref=e83]:
            - 'button "Inspect: Opponent · Unit 2 · Ember Keeper" [ref=e84] [cursor=pointer]':
              - generic "Defeated" [ref=e87]: ×
              - strong [ref=e88]: Ember Keeper
              - generic [ref=e89]:
                - meter "Health of Opponent · Unit 2 · Ember Keeper" [ref=e90]
                - generic [ref=e91]:
                  - text: "0"
                  - generic [ref=e92]: /90
          - article "Opponent · Unit 3 · Copper Sage" [ref=e93]:
            - 'button "Inspect: Opponent · Unit 3 · Copper Sage" [ref=e94] [cursor=pointer]':
              - generic "Defeated" [ref=e97]: ×
              - strong [ref=e98]: Copper Sage
              - generic [ref=e99]:
                - meter "Health of Opponent · Unit 3 · Copper Sage" [ref=e100]
                - generic [ref=e101]:
                  - text: "0"
                  - generic [ref=e102]: /85
          - article "Opponent · Unit 4 · Storm Caller" [ref=e103]:
            - 'button "Inspect: Opponent · Unit 4 · Storm Caller" [ref=e104] [cursor=pointer]':
              - generic "Defeated" [ref=e107]: ×
              - strong [ref=e108]: Storm Caller
              - generic [ref=e109]:
                - meter "Health of Opponent · Unit 4 · Storm Caller" [ref=e110]
                - generic [ref=e111]:
                  - text: "0"
                  - generic [ref=e112]: /85
          - article "Opponent · Unit 5 · Mist Seer" [ref=e113]:
            - 'button "Inspect: Opponent · Unit 5 · Mist Seer" [ref=e114] [cursor=pointer]':
              - strong [ref=e117]: Mist Seer
              - generic [ref=e118]:
                - meter "Health of Opponent · Unit 5 · Mist Seer" [ref=e119]
                - generic [ref=e120]:
                  - text: "56"
                  - generic [ref=e121]: /95
        - paragraph [ref=e122]:
          - generic "Fire II · Burn 2 HP/target turn" [ref=e123]: Fire II
          - generic "Shadows I · +2 initiative" [ref=e124]: Shadows I
    - generic [ref=e125]:
      - strong [ref=e126]: Draw
      - button "In this battle" [ref=e127] [cursor=pointer]
      - button "Continue" [ref=e130] [cursor=pointer]
    - status [ref=e131]: Draw
```

# Test source

```ts
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
  57  |     .poll(
  58  |       () =>
  59  |         page.locator('.pedestal').evaluateAll((nodes) => {
  60  |           const viewport = { width: innerWidth, height: innerHeight };
  61  |           const offenders: object[] = [];
  62  |           for (const node of nodes) {
  63  |             const pedestal = node.getBoundingClientRect();
  64  |             const unit = node.getAttribute('data-unit');
  65  |             const targets = [
  66  |               { kind: 'pedestal', element: node },
  67  |               { kind: 'figure-space', element: node.querySelector('.arena-figure-space') },
  68  |               { kind: 'name', element: node.querySelector('.arena-inspect > strong') },
  69  |               { kind: 'health', element: node.querySelector('.arena-health') },
  70  |             ];
  71  |             for (const { kind, element } of targets) {
  72  |               if (!element) {
  73  |                 offenders.push({
  74  |                   unit,
  75  |                   kind,
  76  |                   violations: ['missing'],
  77  |                   pedestal: pedestal.toJSON(),
  78  |                   viewport,
  79  |                 });
  80  |                 continue;
  81  |               }
  82  |               const rect = element.getBoundingClientRect();
  83  |               const violations: string[] = [];
  84  |               if (rect.width <= 0 || rect.height <= 0) violations.push('empty');
  85  |               if (
  86  |                 rect.left < -1 ||
  87  |                 rect.top < -1 ||
  88  |                 rect.right > innerWidth + 1 ||
  89  |                 rect.bottom > innerHeight + 1
  90  |               )
  91  |                 violations.push('outside-viewport');
  92  |               if (
  93  |                 kind !== 'pedestal' &&
  94  |                 (rect.left < pedestal.left - 1 ||
  95  |                   rect.top < pedestal.top - 1 ||
  96  |                   rect.right > pedestal.right + 1 ||
  97  |                   rect.bottom > pedestal.bottom + 1)
  98  |               )
  99  |                 violations.push('outside-pedestal');
  100 |               if (violations.length)
  101 |                 offenders.push({
  102 |                   unit,
  103 |                   kind,
  104 |                   violations,
  105 |                   rect: rect.toJSON(),
  106 |                   pedestal: pedestal.toJSON(),
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
> 127 |     .toEqual([]);
      |      ^ Error: Every actor, figure, name and health display must fit its pedestal and viewport without page scroll
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
  207 |       expect(await consultation.evaluate((element) => element.scrollTop)).toBe(0);
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
```
