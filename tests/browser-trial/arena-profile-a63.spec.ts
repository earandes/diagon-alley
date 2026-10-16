import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {startExpedition} from './game-fixture';
import {reachNode} from './route-helpers';
const phase=process.env.A63_PROFILE_PHASE??'diagnostic';
for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
 test(`arena profile ${viewport.width}`,async({page},info)=>{
  await page.setViewportSize(viewport);await page.goto('/');await page.locator('.portal-enter').click();await startExpedition(page);
  const node=await reachNode(page,'duel','es');await page.locator(`[data-node="${node}"]`).click();
  const sample=page.evaluate(async()=>{
   const frames:number[]=[],longtasks:number[]=[];const start=performance.now();let prior=start,clickAt:number|null=null;
   const mark=()=>{clickAt=performance.now()-start};document.addEventListener('pointerdown',mark,{once:true});
   const supports=PerformanceObserver.supportedEntryTypes.includes('longtask');
   const observer=supports?new PerformanceObserver(list=>longtasks.push(...list.getEntries().map(e=>e.duration))):null;
   observer?.observe({entryTypes:['longtask']});
   await new Promise<void>(done=>{const step=(now:number)=>{frames.push(now-prior);prior=now;if(now-start<8000)requestAnimationFrame(step);else done();};requestAnimationFrame(step);});
   observer?.disconnect();document.removeEventListener('pointerdown',mark);const sorted=[...frames].sort((a,b)=>a-b);
   return {frames:frames.length,meanFps:1000/(frames.reduce((a,b)=>a+b,0)/frames.length),p95ms:sorted[Math.floor(sorted.length*.95)],maxFrameMs:Math.max(...frames),longtasks:supports?longtasks:null,clickAtMs:clickAt,sampleWindowMs:performance.now()-start,viewport:{width:innerWidth,height:innerHeight},document:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}};
  });
  await page.locator('.node-confirm-action').click();
  const result=await sample;await expect(page.locator('.battle-panel')).toBeVisible();const root=resolve(`docs/arcana/gameplay-increment-2026-10-16/evidence/${phase}/arena-profiles`);await mkdir(root,{recursive:true});
  await writeFile(resolve(root,`${info.project.name}-${viewport.width}.json`),JSON.stringify({phase,browser:info.project.name,scope:'Real isolated GUI 3vs3 combat, starts before action; no user or physical device',...result},null,2));
  await page.screenshot({path:resolve(root,`${info.project.name}-${viewport.width}.png`),fullPage:true});
 });
}
