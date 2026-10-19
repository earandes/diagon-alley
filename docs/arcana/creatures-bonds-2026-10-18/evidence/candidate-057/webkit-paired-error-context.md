# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: arena-performance-a75.spec.ts >> A75 paired mobile sustained replay and lifecycle preserve confirmed log
- Location: tests/browser-experience-fixes/arena-performance-a75.spec.ts:24:1

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 20
Received:    23
```

# Test source

```ts
  125 |       const metrics = await page.evaluate(() => {
  126 |         window.__a75Perf.stop();
  127 |         const p = window.__a75Perf;
  128 |         return { start: p.start, ready: p.ready, frames: p.frames, tasks: p.tasks };
  129 |       });
  130 |       const steady = metrics.frames.filter(
  131 |         (f) => f.at >= metrics.ready! + 500 && f.at < metrics.ready! + 10500,
  132 |       );
  133 |       await mkdir(evidence, { recursive: true });
  134 |       await writeFile(
  135 |         resolve(evidence, `paired-${engine}-last-sample.json`),
  136 |         JSON.stringify(
  137 |           { sha: process.env.GITHUB_SHA, engine, pair, variant, metrics, steady },
  138 |           null,
  139 |           2,
  140 |         ),
  141 |       );
  142 |       expect(steady.length).toBeGreaterThan(150);
  143 |       const scene = page.locator('.scene-canvas'),
  144 |         panel = page.locator('.battle-panel');
  145 |       await pauseBattle(page);
  146 |       const cursor = await panel.getAttribute('data-replay-cursor');
  147 |       await setDoubleBattleSpeed(page);
  148 |       await page.locator('.arena-inspect').first().click();
  149 |       await expect(page.locator('.arena-inspector[open]')).toBeVisible();
  150 |       await page.keyboard.press('Escape');
  151 |       expect(await panel.getAttribute('data-replay-cursor')).toBe(cursor);
  152 |       const renders = await scene.getAttribute('data-render-count');
  153 |       await page.evaluate(() => {
  154 |         Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  155 |         document.dispatchEvent(new Event('visibilitychange'));
  156 |       });
  157 |       await page.evaluate(
  158 |         () =>
  159 |           new Promise<void>((done) =>
  160 |             requestAnimationFrame(() => requestAnimationFrame(() => done())),
  161 |           ),
  162 |       );
  163 |       expect(await panel.getAttribute('data-replay-cursor')).toBe(cursor);
  164 |       expect(await scene.getAttribute('data-render-count')).toBe(renders);
  165 |       await page.evaluate(() => {
  166 |         Reflect.deleteProperty(document, 'hidden');
  167 |         document.dispatchEvent(new Event('visibilitychange'));
  168 |       });
  169 |       await skipBattle(page);
  170 |       await expect(page.locator('[data-arena-outcome]')).toBeVisible();
  171 |       expect(
  172 |         await page.evaluate(() => ({
  173 |           battle: window.__a70Fixture.battle,
  174 |           game: window.__a70Fixture.game,
  175 |         })),
  176 |       ).toEqual(source);
  177 |       expect(errors).toEqual([]);
  178 |       results.push({
  179 |         pair,
  180 |         variant,
  181 |         battleHash: createHash('sha256').update(source.battle).digest('hex'),
  182 |         moduleReadyAt,
  183 |         actionToReadyFrameMs: metrics.ready! - metrics.start!,
  184 |         navigationToReadyFrameMs: metrics.ready,
  185 |         sustained: {
  186 |           samples: steady.length,
  187 |           p95: percentile(
  188 |             steady.map((f) => f.ms),
  189 |             0.95,
  190 |           ),
  191 |           maximum: Math.max(...steady.map((f) => f.ms)),
  192 |         },
  193 |         temporalFrames: steady.map((f, i) => (i % 12 === 0 ? f : null)).filter(Boolean),
  194 |         longTasks: metrics.tasks,
  195 |         pausedCursor: cursor,
  196 |         preservedBattleAndGame: true,
  197 |         errors,
  198 |       });
  199 |       await context.close();
  200 |     }
  201 |   await mkdir(evidence, { recursive: true });
  202 |   await writeFile(
  203 |     resolve(
  204 |       evidence,
  205 |       engine === 'webkit' ? 'paired-webkit-performance.json' : 'paired-mobile-performance.json',
  206 |     ),
  207 |     JSON.stringify(
  208 |       {
  209 |         sha: process.env.GITHUB_SHA,
  210 |         baseline: '937a0a1f00bdbca7009a80cd99b7b4b450f652f0',
  211 |         fixture: true,
  212 |         physicalDevice: false,
  213 |         engine,
  214 |         profile:
  215 |           '390x844 / ES Diagon / declared mastery5x5 / AB-BA-AB / fresh isolated browser contexts; application module evaluated before explicit fixture mount. rAF is not GPU time.',
  216 |         results,
  217 |       },
  218 |       null,
  219 |       2,
  220 |     ),
  221 |   );
  222 |   const before = results.filter((r) => r.variant === 'baseline').map((r) => r.sustained.p95),
  223 |     after = results.filter((r) => r.variant === 'current').map((r) => r.sustained.p95);
  224 |   expect(new Set(results.map((result) => result.battleHash)).size).toBe(1);
> 225 |   expect(percentile(after, 0.5)).toBeLessThanOrEqual(Math.max(20, percentile(before, 0.5) + 1));
      |                                  ^ Error: expect(received).toBeLessThanOrEqual(expected)
  226 | });
  227 | 
```