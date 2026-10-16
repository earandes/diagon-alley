import { test, expect, type Page, type Locator } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { startExpedition } from './game-fixture';
import { reachNode, confirmEvent, readGame } from './route-helpers';

type ActionProbe = { begin: number; input: number|null; ready: number|null; frames: number[]; prior: number; tasks: number[]|null; stop: boolean; observer: PerformanceObserver|null; inputHandler: () => void };
declare global { interface Window { a63ActionProbe: ActionProbe } }
async function measure(page: Page, name: string, control: Locator, result: Locator) {
  await page.evaluate(() => {
    const supports = PerformanceObserver.supportedEntryTypes.includes('longtask');
    const p: ActionProbe = window.a63ActionProbe = { begin: performance.now(), input: null, ready: null, frames: [], prior: performance.now(), tasks: supports ? [] : null, stop: false, observer: null, inputHandler: () => {} };
    p.inputHandler = () => { p.input = performance.now(); };
    document.addEventListener('pointerdown', p.inputHandler, { once: true });
    if (supports) { p.observer = new PerformanceObserver(list => p.tasks?.push(...list.getEntries().map(e => e.duration))); p.observer.observe({ entryTypes: ['longtask'] }); }
    const frame = (now: number) => { p.frames.push(now-p.prior); p.prior=now; if (!p.stop) requestAnimationFrame(frame); };
    requestAnimationFrame(frame);
  });
  await control.click();
  await expect(result).toBeVisible();
  await page.evaluate(() => { window.a63ActionProbe.ready=performance.now(); });
  await expect.poll(() => result.evaluate(el => el.getAnimations({subtree:true}).some(a=>a.playState==='running')), { timeout: 15000 }).toBe(false);
  await page.evaluate(() => new Promise<void>(done => requestAnimationFrame(()=>requestAnimationFrame(()=>done()))));
  return result.evaluate((el, name) => {
    const p=window.a63ActionProbe, end=performance.now(), input=p.input??p.begin;
    p.stop=true; p.observer?.disconnect(); document.removeEventListener('pointerdown',p.inputHandler);
    const frames=[...p.frames].sort((a,b)=>a-b);
    return { name, scope: 'Isolated real GUI; pointer action through observed visible/settled DOM; includes network and animation, polling overhead, no user study', inputObserved: p.input!==null, inputToVisibleMs:(p.ready??end)-input, inputToSettledMs:end-input,
      frameCount:frames.length, maxFrameMs:Math.max(...frames), p95FrameMs:frames[Math.floor(frames.length*.95)], longtasks:p.tasks,
      network:performance.getEntriesByType('resource').filter(e=>e.startTime>=input&&e.name.includes('/api/')).map(e=>({path:new URL(e.name).pathname,durationMs:e.duration})),
      bounds:el.getBoundingClientRect().toJSON(), viewport:[innerWidth,innerHeight] };
  }, name);
}
test('A63 action-to-result profiles closure, owned loot and contextual preparation', async ({page}, info) => {
  await page.goto('/'); await page.locator('.portal-enter').click(); await startExpedition(page);
  const boss=await reachNode(page,'boss','es'); await page.locator(`[data-node="${boss}"]`).click(); await confirmEvent(page,'es');
  const won=await readGame(page), profiles=[];
  profiles.push(await measure(page,'boss-back-to-closure',page.getByRole('button',{name:'Volver al mapa',exact:true}),page.locator('.expedition-closure')));
  profiles.push(await measure(page,'explicit-next-preparation',page.locator('[data-closure-action="prepare"]'),page.locator('.preparation-dialog[open]')));
  await page.keyboard.press('Escape'); expect(await readGame(page)).toEqual(won);
  const start=await page.evaluate(()=>performance.now());
  await page.locator('[data-closure-action="frog"]').click();
  await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state','result',{timeout:15000});
  const resultTime=await page.evaluate(()=>performance.now());
  await expect(page.locator('[data-celebration]')).toHaveCount(0,{timeout:5000});
  profiles.push({name:'earned-frog-action-to-result',scope:'Timestamp before click, includes transaction and existing opening; visible result observed by polling',resultAtMs:resultTime-start,settledAtMs:await page.evaluate(()=>performance.now())-start});
  const opened=await readGame(page); expect(opened.inventory.crowns).toBe(won.inventory.crowns); expect(opened.copies.length).toBe(won.copies.length+1);
  await page.locator('.reveal-continue').click();
  await page.locator('nav').getByRole('button',{name:'Callejón',exact:true}).click(); await page.locator('[data-shop="confectionery"]').click();
  await page.getByRole('button',{name:'Grageas de Todos los Sabores',exact:true}).click();
  await page.getByRole('button',{name:'Comprar Grageas de Todos los Sabores · 5 Galeones',exact:true}).click();
  await expect.poll(async()=>(await readGame(page)).inventory.products.some(p=>p.kind==='random-beans'&&p.status==='available')).toBe(true);
  profiles.push(await measure(page,'owned-bean-to-context',page.locator('.bean-prepare-action'),page.locator('.preparation-beans-destination')));
  const root=resolve('docs/arcana/gameplay-increment-2026-10-16/evidence/action-profiles'); await mkdir(root,{recursive:true});
  await writeFile(resolve(root,`${info.project.name}.json`),JSON.stringify({browser:info.project.name,profiles},null,2));
});
