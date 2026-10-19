# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: arena-performance-a75.spec.ts >> A75 paired mobile sustained replay and lifecycle preserve confirmed log
- Location: tests/browser-experience-fixes/arena-performance-a75.spec.ts:21:1

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 20
Received:    22
```

# Test source

```ts
  120 |       const metrics = await page.evaluate(() => {
  121 |         window.__a75Perf.stop();
  122 |         const p = window.__a75Perf;
  123 |         return { start: p.start, ready: p.ready, frames: p.frames, tasks: p.tasks };
  124 |       });
  125 |       const steady = metrics.frames.filter(
  126 |         (f) => f.at >= metrics.ready! + 500 && f.at < metrics.ready! + 10500,
  127 |       );
  128 |       await mkdir(evidence, { recursive: true });
  129 |       await writeFile(
  130 |         resolve(evidence, `paired-${engine}-last-sample.json`),
  131 |         JSON.stringify(
  132 |           { sha: process.env.GITHUB_SHA, engine, pair, variant, metrics, steady },
  133 |           null,
  134 |           2,
  135 |         ),
  136 |       );
  137 |       expect(steady.length).toBeGreaterThan(150);
  138 |       const scene = page.locator('.scene-canvas'),
  139 |         panel = page.locator('.battle-panel');
  140 |       await pauseBattle(page);
  141 |       const cursor = await panel.getAttribute('data-replay-cursor');
  142 |       await setDoubleBattleSpeed(page);
  143 |       await page.locator('.arena-inspect').first().click();
  144 |       await expect(page.locator('.arena-inspector[open]')).toBeVisible();
  145 |       await page.keyboard.press('Escape');
  146 |       expect(await panel.getAttribute('data-replay-cursor')).toBe(cursor);
  147 |       const renders = await scene.getAttribute('data-render-count');
  148 |       await page.evaluate(() => {
  149 |         Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  150 |         document.dispatchEvent(new Event('visibilitychange'));
  151 |       });
  152 |       await page.evaluate(
  153 |         () =>
  154 |           new Promise<void>((done) =>
  155 |             requestAnimationFrame(() => requestAnimationFrame(() => done())),
  156 |           ),
  157 |       );
  158 |       expect(await panel.getAttribute('data-replay-cursor')).toBe(cursor);
  159 |       expect(await scene.getAttribute('data-render-count')).toBe(renders);
  160 |       await page.evaluate(() => {
  161 |         Reflect.deleteProperty(document, 'hidden');
  162 |         document.dispatchEvent(new Event('visibilitychange'));
  163 |       });
  164 |       await skipBattle(page);
  165 |       await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  166 |       expect(
  167 |         await page.evaluate(() => ({
  168 |           battle: window.__a70Fixture.battle,
  169 |           game: window.__a70Fixture.game,
  170 |         })),
  171 |       ).toEqual(source);
  172 |       expect(errors).toEqual([]);
  173 |       results.push({
  174 |         pair,
  175 |         variant,
  176 |         battleHash: createHash('sha256').update(source.battle).digest('hex'),
  177 |         moduleReadyAt,
  178 |         actionToReadyFrameMs: metrics.ready! - metrics.start!,
  179 |         navigationToReadyFrameMs: metrics.ready,
  180 |         sustained: {
  181 |           samples: steady.length,
  182 |           p95: percentile(
  183 |             steady.map((f) => f.ms),
  184 |             0.95,
  185 |           ),
  186 |           maximum: Math.max(...steady.map((f) => f.ms)),
  187 |         },
  188 |         temporalFrames: steady.map((f, i) => (i % 12 === 0 ? f : null)).filter(Boolean),
  189 |         longTasks: metrics.tasks,
  190 |         pausedCursor: cursor,
  191 |         preservedBattleAndGame: true,
  192 |         errors,
  193 |       });
  194 |       await context.close();
  195 |     }
  196 |   await mkdir(evidence, { recursive: true });
  197 |   await writeFile(
  198 |     resolve(
  199 |       evidence,
  200 |       engine === 'webkit' ? 'paired-webkit-performance.json' : 'paired-mobile-performance.json',
  201 |     ),
  202 |     JSON.stringify(
  203 |       {
  204 |         sha: process.env.GITHUB_SHA,
  205 |         baseline: '937a0a1f00bdbca7009a80cd99b7b4b450f652f0',
  206 |         fixture: true,
  207 |         physicalDevice: false,
  208 |         engine,
  209 |         profile:
  210 |           '390x844 / ES Diagon / declared mastery5x5 / AB-BA-AB / fresh isolated browser contexts; application module evaluated before explicit fixture mount. rAF is not GPU time.',
  211 |         results,
  212 |       },
  213 |       null,
  214 |       2,
  215 |     ),
  216 |   );
  217 |   const before = results.filter((r) => r.variant === 'baseline').map((r) => r.sustained.p95),
  218 |     after = results.filter((r) => r.variant === 'current').map((r) => r.sustained.p95);
  219 |   expect(new Set(results.map((result) => result.battleHash)).size).toBe(1);
> 220 |   expect(percentile(after, 0.5)).toBeLessThanOrEqual(Math.max(20, percentile(before, 0.5) + 1));
      |                                  ^ Error: expect(received).toBeLessThanOrEqual(expected)
  221 | });
  222 | 
```