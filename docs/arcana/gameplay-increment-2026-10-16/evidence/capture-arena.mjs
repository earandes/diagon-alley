// Declared rendering fixture: no authority connection, economic writes or player session.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const out='docs/arcana/gameplay-increment-2026-10-16/evidence/arena-moments';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},recordVideo:{dir:out,size:{width:390,height:844}}});
try {
 await context.addInitScript(()=>localStorage.setItem('arcana.presentation.content-pack.v1','diagon-alley'));
 const page=await context.newPage();
 await page.goto('http://127.0.0.1:5362/tests/arcana-arena-a63-harness.html?player=5&rival=5');
 await page.getByRole('button',{name:'Pausa',exact:true}).click();
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 const original=await page.evaluate(()=>window.__arenaFixtureRecord);
 await page.screenshot({path:`${out}/01-five-per-side.png`});
 await page.getByRole('button',{name:'2x',exact:true}).click();
 await page.getByRole('button',{name:'Auto',exact:true}).click();
 // Freeze this presentation-only fixture through its actual Pause control in the same
 // mutation turn; a remote mouse round trip can pass a 325 ms effect at 2x.
 await page.evaluate(()=>new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>{observer.disconnect();reject(Error('No delta'));},10000);
  const pause=()=>{if(!document.querySelector('.arena-delta'))return;[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Pausa')).click();observer.disconnect();clearTimeout(timeout);requestAnimationFrame(()=>resolve());};
  const observer=new MutationObserver(pause);observer.observe(document.querySelector('.arena-stage'),{subtree:true,childList:true});pause();
 }));
 if(!await page.locator('.arena-delta').count()) throw Error('Delta was not captured');
 await page.screenshot({path:`${out}/02-event-delta.png`});
 await page.getByRole('button',{name:'Auto',exact:true}).click();
 await page.locator('[data-unit="p0"] .arena-inspect').click();
 const pausedCursor=await page.locator('.battle-panel').getAttribute('data-replay-cursor');
 await page.waitForTimeout(700);
 if(await page.locator('.battle-panel').getAttribute('data-replay-cursor')!==pausedCursor)throw Error('Inspector did not pause replay');
 await page.screenshot({path:`${out}/03-inspector.png`});
 await page.keyboard.press('Escape');
 await page.waitForTimeout(400);
 if(await page.locator('.battle-panel').getAttribute('data-replay-cursor')!==pausedCursor)throw Error('Inspector resumed without Auto');
 await page.getByRole('button',{name:'Omitir reproducción',exact:true}).click();
 await page.screenshot({path:`${out}/04-outcome.png`});
 await page.getByRole('button',{name:'Ajustes',exact:true}).click();
 await page.getByRole('button',{name:'English',exact:true}).click();
 await page.getByRole('button',{name:'Close',exact:true}).click();
 const result=await page.evaluate(()=>({unchanged:window.__arenaFixtureRecord,announcement:document.querySelector('.arena-a63 [role=status]')?.textContent,announcementLanguage:document.querySelector('.arena-a63 [role=status]')?.getAttribute('lang'),visibleOutcome:document.querySelector('[data-arena-outcome]')?.textContent}));
 if(result.unchanged!==original||result.announcementLanguage!=='es'||result.visibleOutcome!=='Draw') throw Error('Replay or language invariant failed');
 const video=page.video();
 await page.close();
 await video.saveAs(`${out}/fixture-five-per-side.webm`);
 await writeFile(`${out}/observations.json`,JSON.stringify({...result,unchanged:result.unchanged===original,inspectorPaused:true,doesNotAutoResume:true,fixture:true},null,2));
 console.log('Four fixture captures and one recording saved; record unchanged; final announcement retains original language.');
} finally {await context.close();await browser.close();}
