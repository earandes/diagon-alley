# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tactical-pacts-a65.spec.ts >> A65 choose, compare, prepare and resolve en diagon-alley
- Location: tests/browser-trial/tactical-pacts-a65.spec.ts:136:5

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('[data-affinity-progress]')
Expected: 2
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('[data-affinity-progress]') with timeout 5000ms
  - waiting for locator('[data-affinity-progress]')
    14 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to content" [ref=e4] [cursor=pointer]:
    - /url: "#content"
  - banner [ref=e5]:
    - heading "Diagon Alley Tactical" [level=1] [ref=e6]:
      - text: Diagon Alley
      - generic [ref=e7]: Tactical
    - generic [ref=e8]:
      - status [ref=e9]
      - button "An enchanted night" [ref=e10] [cursor=pointer]
  - status [ref=e13]
  - generic [ref=e14]:
    - strong [ref=e15]:
      - generic "Galleons" [ref=e17]: "50"
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e21]: Energy
        - text: 50 / 50
        - meter "Magic energy" [ref=e22]
      - generic [ref=e23]: Energy is full.
      - button "Refresh Energy" [ref=e24] [cursor=pointer]
    - generic [ref=e27]:
      - strong [aria-hidden] [ref=e29]: "0"
      - generic [ref=e30]: 0 Gold Keys
  - main [ref=e31]:
    - status [ref=e32]
    - generic [ref=e33]:
      - generic:
        - complementary "Next objective":
          - generic:
            - heading "Another ally along the path" [level=3]
            - group [ref=e34]:
              - generic "Next objective" [ref=e35] [cursor=pointer]: "?"
            - 'generic "Stages visited: 0 of 7"': 0 / 7
      - region "Your Team" [ref=e36]:
        - heading "Your Team" [level=2] [ref=e37]
        - button "Harry Potter" [ref=e39] [cursor=pointer]:
          - generic [ref=e41]: Owned copy
          - meter "Health of Harry Potter" [ref=e44]
        - button "Prepare your expedition" [ref=e45] [cursor=pointer]
        - generic "Team houses" [ref=e48]:
          - group [ref=e49]:
            - generic "Gryffindor · 1/3" [ref=e50] [cursor=pointer]: Gryffindor 1/3
      - button "View node list" [ref=e55] [cursor=pointer]
      - generic [ref=e58]:
        - generic "Start"
        - button "Magic Pact · stage 1, option 1 · Available" [ref=e60] [cursor=pointer]:
          - generic [aria-hidden] [ref=e63]: ▴
          - strong [ref=e64]: Magic Pact
          - generic [ref=e65]: Available
          - generic [ref=e66]: Temporary ally
        - button "Loot Chest · stage 2, option 1 · Locked" [ref=e68] [cursor=pointer]:
          - strong [ref=e71]: Loot Chest
          - generic [ref=e72]: Locked
        - button "Magic Pact · stage 2, option 2 · Locked" [ref=e74] [cursor=pointer]:
          - strong [ref=e77]: Magic Pact
          - generic [ref=e78]: Locked
        - button "Magic Pact · stage 3, option 1 · Locked" [ref=e80] [cursor=pointer]:
          - strong [ref=e83]: Magic Pact
          - generic [ref=e84]: Locked
        - button "Wizard Duel · stage 3, option 2 · Locked" [ref=e86] [cursor=pointer]:
          - generic: Fire · burn
          - strong [ref=e89]: Wizard Duel
          - generic [ref=e90]: Locked
        - button "Wizard Duel · stage 3, option 3 · Locked" [ref=e92] [cursor=pointer]:
          - generic: Fire · burn
          - strong [ref=e95]: Wizard Duel
          - generic [ref=e96]: Locked
        - button "Alchemy Refuge · stage 4, option 1 · Locked" [ref=e98] [cursor=pointer]:
          - strong [ref=e101]: Alchemy Refuge
          - generic [ref=e102]: Locked
        - button "Wizard Duel · stage 4, option 2 · Locked" [ref=e104] [cursor=pointer]:
          - generic: Vanguard · initiative
          - strong [ref=e107]: Wizard Duel
          - generic [ref=e108]: Locked
        - button "Loot Chest · stage 4, option 3 · Locked" [ref=e110] [cursor=pointer]:
          - strong [ref=e113]: Loot Chest
          - generic [ref=e114]: Locked
        - button "Loot Chest · stage 5, option 1 · Locked" [ref=e116] [cursor=pointer]:
          - strong [ref=e119]: Loot Chest
          - generic [ref=e120]: Locked
        - button "Alchemy Refuge · stage 5, option 2 · Locked" [ref=e122] [cursor=pointer]:
          - strong [ref=e125]: Alchemy Refuge
          - generic [ref=e126]: Locked
        - button "Wizard Duel · stage 5, option 3 · Locked" [ref=e128] [cursor=pointer]:
          - generic: Vanguard · initiative
          - strong [ref=e131]: Wizard Duel
          - generic [ref=e132]: Locked
        - button "Alchemy Refuge · stage 6, option 1 · Locked" [ref=e134] [cursor=pointer]:
          - strong [ref=e137]: Alchemy Refuge
          - generic [ref=e138]: Locked
        - button "Encounter · stage 6, option 2 · Locked" [ref=e140] [cursor=pointer]:
          - strong [ref=e143]: Encounter
          - generic [ref=e144]: Locked
        - button "Encounter · stage 6, option 3 · Locked" [ref=e146] [cursor=pointer]:
          - strong [ref=e149]: Encounter
          - generic [ref=e150]: Locked
        - button "Zone Boss · stage 7, option 1 · Locked" [ref=e152] [cursor=pointer]:
          - strong [ref=e155]: Zone Boss
          - generic [ref=e156]: Locked
      - dialog "Node confirmation" [ref=e157]:
        - button "Settings" [ref=e159] [cursor=pointer]
        - heading "Magic Pact" [level=3] [ref=e162]
        - paragraph [ref=e163]: Resolve this event with your current team.
        - region "Choose an ally" [ref=e165]:
          - group "Choose an ally" [ref=e166]:
            - article [ref=e167]:
              - 'button "Recruit: Luna Lovegood · Temporary ally" [active] [pressed] [ref=e168] [cursor=pointer]':
                - strong [ref=e174]: Luna Lovegood
                - generic [ref=e175]: Ravenclaw 0 → 1
                - generic [ref=e180]: Shadows
                - generic [ref=e181]:
                  - generic [ref=e182]: 0 → 1 / 1
                  - generic [ref=e184]: Synergy active in the proposal
              - group:
                - 'generic "Inspect: Luna Lovegood" [ref=e185] [cursor=pointer]':
                  - generic [aria-hidden] [ref=e186]: i
            - article [ref=e187]:
              - 'button "Recruit: Buckbeak · Temporary ally" [ref=e188] [cursor=pointer]':
                - strong [ref=e193]: Buckbeak
                - generic [ref=e194]: Fantastic creatures 0 → 1
                - generic [ref=e198]: Neutral
              - group:
                - 'generic "Inspect: Buckbeak" [ref=e199] [cursor=pointer]':
                  - generic [aria-hidden] [ref=e200]: i
          - generic "Team houses" [ref=e201]:
            - group [ref=e202]:
              - generic "Gryffindor · 1/3" [ref=e203] [cursor=pointer]: Gryffindor 1/3
            - group [ref=e208]:
              - generic "Ravenclaw · 1/3" [ref=e209] [cursor=pointer]: Ravenclaw 1/3
          - group [ref=e214]:
            - generic "Affinity synergies" [ref=e215] [cursor=pointer]:
              - generic [ref=e217]:
                - text: Shadows
                - strong [ref=e218]: I
          - paragraph [ref=e219]: Choose and confirm to recruit
        - generic [ref=e220]:
          - button "Confirm pact" [ref=e221] [cursor=pointer]
          - button "Cancel" [ref=e224] [cursor=pointer]:
            - generic [aria-hidden] [ref=e225]: ×
  - navigation "Main navigation" [ref=e226]:
    - button "Map" [ref=e227] [cursor=pointer]
    - button "Card Album" [ref=e230] [cursor=pointer]
    - button "Diagon Alley" [ref=e233] [cursor=pointer]
    - button "Missions" [ref=e236] [cursor=pointer]
```

# Test source

```ts
  74  |   const path = routePath(run.graph, run.visited, 'duel');
  75  |   // Traversal reads real authoritative edges. It is technical QA, not an observation of a player.
  76  |   for (const id of path.slice(0, -1)) {
  77  |     await page.locator(`[data-node="${id}"]`).click();
  78  |     await confirm(page);
  79  |     if (await page.locator('.arena-a63').count()) {
  80  |       await skipBattle(page);
  81  |       await leaveBattle(page);
  82  |     }
  83  |   }
  84  |   return path.at(-1)!;
  85  | }
  86  | async function mapGeometry(page: Page) {
  87  |   const game = await readGame(page);
  88  |   const count = game.exploration!.run!.graph.nodes.length;
  89  |   await expect(page.locator('.map-node')).toHaveCount(count);
  90  |   await expectMapFits(page);
  91  |   const result = await page.evaluate(() => {
  92  |     const host = document.querySelector('.map-scroll')!,
  93  |       viewport = { width: innerWidth, height: innerHeight };
  94  |     const r = host.getBoundingClientRect();
  95  |     return {
  96  |       viewport,
  97  |       document: {
  98  |         width: document.documentElement.scrollWidth,
  99  |         height: document.documentElement.scrollHeight,
  100 |       },
  101 |       host: {
  102 |         width: host.clientWidth,
  103 |         height: host.clientHeight,
  104 |         scrollWidth: host.scrollWidth,
  105 |         scrollHeight: host.scrollHeight,
  106 |         top: r.top,
  107 |         bottom: r.bottom,
  108 |       },
  109 |       nodes: [...document.querySelectorAll('.map-node > button')].map((e) => {
  110 |         const b = e.getBoundingClientRect();
  111 |         return {
  112 |           id: e.getAttribute('data-node'),
  113 |           x: b.x,
  114 |           y: b.y,
  115 |           width: b.width,
  116 |           height: b.height,
  117 |         };
  118 |       }),
  119 |     };
  120 |   });
  121 |   expect(result.document.width).toBeLessThanOrEqual(result.viewport.width + 1);
  122 |   expect(result.document.height).toBeLessThanOrEqual(result.viewport.height + 1);
  123 |   expect(result.host.scrollHeight).toBeLessThanOrEqual(result.host.height + 1);
  124 |   expect(result.host.scrollWidth).toBeLessThanOrEqual(result.host.width + 1);
  125 |   for (const node of result.nodes) {
  126 |     expect(node.x).toBeGreaterThanOrEqual(-1);
  127 |     expect(node.x + node.width).toBeLessThanOrEqual(result.viewport.width + 1);
  128 |     expect(node.y).toBeGreaterThanOrEqual(result.host.top - 1);
  129 |     expect(node.y + node.height).toBeLessThanOrEqual(result.host.bottom + 1);
  130 |   }
  131 |   return result;
  132 | }
  133 | 
  134 | for (const language of ['es', 'en'] as const)
  135 |   for (const pack of ['diagon-alley', 'arcana'] as const) {
  136 |     test(`A65 choose, compare, prepare and resolve ${language} ${pack}`, async ({ page }) => {
  137 |       const errors: string[] = [];
  138 |       page.on('pageerror', (e) => errors.push(String(e)));
  139 |       await page.emulateMedia({ reducedMotion: pack === 'arcana' ? 'reduce' : 'no-preference' });
  140 |       await enter(page, language, pack);
  141 |       const metrics: Record<string, unknown> = {
  142 |         language,
  143 |         pack,
  144 |         engine: test.info().project.name,
  145 |         profile: 'pointerdown → usable DOM; includes network/renderer wait; not FPS',
  146 |       };
  147 |       const geometry = [];
  148 |       for (const size of sizes) {
  149 |         await page.setViewportSize(size);
  150 |         geometry.push(await mapGeometry(page));
  151 |         await shoot(page, `${pack}-${language}-map-${size.width}`);
  152 |       }
  153 |       await page.setViewportSize(sizes[0]);
  154 |       const initial = await readGame(page),
  155 |         run = initial.exploration!.run!;
  156 |       const first = run.graph.nodes.find((n) => n.row === 0)!;
  157 |       let posts = 0;
  158 |       page.on('request', (request) => {
  159 |         if (request.method() === 'POST' && request.url().endsWith('/nodes/advance')) posts++;
  160 |       });
  161 |       metrics.openPactMs = await measure(page, page.locator(`[data-node="${first.id}"]`), () =>
  162 |         expect(page.locator('[data-tactical-pact]')).toBeVisible(),
  163 |       );
  164 |       const candidates = page.locator('[data-pact-candidate]');
  165 |       await expect(candidates).toHaveCount(2);
  166 |       await expect(page.locator('.node-confirm-action')).toBeDisabled();
  167 |       const offered = await candidates.evaluateAll((items) =>
  168 |         items.map((e) => e.getAttribute('data-pact-candidate')),
  169 |       );
  170 |       metrics.selectCandidateMs = await measure(page, candidates.first(), () =>
  171 |         expect(candidates.first()).toHaveAttribute('aria-pressed', 'true'),
  172 |       );
  173 |       await expect(page.locator('.node-confirm-action')).toBeEnabled();
> 174 |       await expect(page.locator('[data-affinity-progress]')).toHaveCount(2);
      |                                                              ^ Error: expect(locator).toHaveCount(expected) failed
  175 |       expect(await readGame(page)).toEqual(initial);
  176 |       expect(posts).toBe(0);
  177 |       for (const size of sizes) {
  178 |         await page.setViewportSize(size);
  179 |         const geometry = await page
  180 |           .locator('.node-event-dialog')
  181 |           .evaluate((e) => ({ client: e.clientHeight, scroll: e.scrollHeight }));
  182 |         expect(geometry.scroll).toBeLessThanOrEqual(geometry.client + 1);
  183 |         await shoot(page, `${pack}-${language}-pact-selected-${size.width}`);
  184 |       }
  185 |       const inspector = page.locator('.tactical-pact-inspector > summary').first();
  186 |       await inspector.focus();
  187 |       await page.keyboard.press('Enter');
  188 |       await expect(page.locator('.tactical-pact-inspector').first()).toHaveAttribute('open', '');
  189 |       await shoot(page, `${pack}-${language}-pact-inspected`);
  190 |       await page.locator('.node-cancel-action').click();
  191 |       await expect(page.locator('.node-event-dialog')).toHaveCount(0);
  192 |       expect(await readGame(page)).toEqual(initial);
  193 |       await page.reload();
  194 |       await expect(page.locator('.branch-map')).toBeVisible();
  195 |       await page.locator(`[data-node="${first.id}"]`).click();
  196 |       expect(
  197 |         await candidates.evaluateAll((items) =>
  198 |           items.map((e) => e.getAttribute('data-pact-candidate')),
  199 |         ),
  200 |       ).toEqual(offered);
  201 |       await expect(page.locator('.node-confirm-action')).toBeDisabled();
  202 |       await candidates.first().click();
  203 |       metrics.confirmPactMs = await measure(page, page.locator('.node-confirm-action'), () =>
  204 |         expect(page.locator('.node-event-dialog')).toHaveCount(0),
  205 |       );
  206 |       const recruited = await readGame(page);
  207 |       expect(recruited.exploration!.run!.members).toHaveLength(run.members.length + 1);
  208 |       expect(recruited.copies).toEqual(initial.copies);
  209 |       expect(recruited.inventory).toEqual(initial.inventory);
  210 |       expect(recruited.exploration!.run!.members.at(-1)?.unit.id).toBe(offered[0]);
  211 |       const recruitmentReceipt = recruited.receipts.at(-1);
  212 |       expect(
  213 |         recruitmentReceipt?.kind === 'advance-node' && recruitmentReceipt.request.recruitId,
  214 |       ).toBe(offered[0]);
  215 |       expect(posts).toBe(1);
  216 | 
  217 |       const duelId = await reachDuel(page, language);
  218 |       const beforeDuel = await readGame(page);
  219 |       expect(beforeDuel.exploration!.run!.members.length).toBeGreaterThanOrEqual(3);
  220 |       const plan = beforeDuel.exploration!.run!.campaignSnapshot!.nodes.find(
  221 |         (n) => n.nodeId === duelId,
  222 |       )!;
  223 |       if (plan.kind !== 'duel') throw Error('Expected real duel');
  224 |       await expect(
  225 |         page.locator(`[data-node="${duelId}"] [data-threat="${plan.threat}"]`),
  226 |       ).toBeVisible();
  227 |       await page.locator(`[data-node="${duelId}"]`).click();
  228 |       await expect(page.locator('.tactical-threat-help')).toBeVisible();
  229 |       await page.locator('.tactical-threat-help > summary').click();
  230 |       await page.locator('.tactical-rival-inspector > summary').focus();
  231 |       await page.keyboard.press('Enter');
  232 |       await expect(page.locator('.tactical-rival-inspector[open] section')).toHaveCount(
  233 |         plan.opponents.length,
  234 |       );
  235 |       await shoot(page, `${pack}-${language}-rival-inspected`);
  236 |       await page.locator('.node-cancel-action').click();
  237 |       expect(await readGame(page)).toEqual(beforeDuel);
  238 |       // Buy one actual bean via the existing UI, then assign/cancel/confirm with this real rival.
  239 |       await page.goto('/#/shop/confectionery');
  240 |       await expect(page.locator('.sweetshop-scene')).toBeVisible();
  241 |       await page.locator('[data-product="random-beans"]').click();
  242 |       await page.locator('.shop-purchase-ticket').click();
  243 |       await expect.poll(async () => (await readGame(page)).revision).toBe(beforeDuel.revision + 1);
  244 |       await expect(page.locator('.bean-prepare-action')).toBeVisible();
  245 |       const bought = await readGame(page);
  246 |       expect(bought.inventory.crowns).toBe(beforeDuel.inventory.crowns - 5);
  247 |       await page.goto('/#/map');
  248 |       await page.locator(`[data-node="${duelId}"]`).click();
  249 |       await page.locator('.node-bean-preparation > summary').click();
  250 |       await page.locator('[data-bean-unit]').first().click();
  251 |       await expect(page.locator('[data-bean-unit][aria-pressed="true"]')).toHaveCount(1);
  252 |       expect(await readGame(page)).toEqual(bought);
  253 |       await page.locator('.node-cancel-action').click();
  254 |       expect(await readGame(page)).toEqual(bought);
  255 |       await page.locator(`[data-node="${duelId}"]`).click();
  256 |       await page.locator('.node-bean-preparation > summary').click();
  257 |       await expect(page.locator('[data-bean-unit][aria-pressed="true"]')).toHaveCount(0);
  258 |       await page.locator('[data-bean-unit]').first().click();
  259 |       await shoot(page, `${pack}-${language}-duel-preparation`);
  260 |       await page.locator('.node-confirm-action').click();
  261 |       await expect(page.locator('.arena-a63')).toBeVisible();
  262 |       const committed = await readGame(page),
  263 |         receipt = committed.receipts.at(-1);
  264 |       if (receipt?.kind !== 'advance-node' || !receipt.battle)
  265 |         throw Error('Missing committed combat');
  266 |       expect(receipt.battle.events.some((e) => e.kind === 'bean-activated')).toBe(true);
  267 |       const log = JSON.stringify(receipt.battle);
  268 |       await skipBattle(page);
  269 |       await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  270 |       await shoot(page, `${pack}-${language}-duel-result`);
  271 |       expect(await readGame(page)).toEqual(committed);
  272 |       const replayedReceipt = (await readGame(page)).receipts.at(-1);
  273 |       expect(
  274 |         JSON.stringify(replayedReceipt?.kind === 'advance-node' && replayedReceipt.battle),
```