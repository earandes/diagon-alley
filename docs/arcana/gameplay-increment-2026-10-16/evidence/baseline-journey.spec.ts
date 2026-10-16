import { test, expect, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { changeLanguage, startExpedition, closePreparation, inspectPreparationCopy } from '../../../../tests/browser-trial/game-fixture';
import { readGame, confirmEvent } from '../../../../tests/browser-trial/route-helpers';
const root=resolve('docs/arcana/gameplay-increment-2026-10-16/evidence/before');
const captures=resolve(root,'captures');
const geometryPath=resolve(root,'geometry.json');
const ledger:any[]=existsSync(geometryPath)?JSON.parse(readFileSync(geometryPath,'utf8')):[];
async function photo(page:Page,id:string,sizes=[{width:1280,height:900},{width:390,height:844}]){
  await mkdir(captures,{recursive:true});
  const prior=page.viewportSize();
  for(const size of sizes){
    await page.setViewportSize(size);
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.getBoundingClientRect().width).map(i=>Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,1000))])));});
    await page.screenshot({path:resolve(captures,`${id}-${size.width}.png`),fullPage:true,animations:'disabled'});
    const geometry=await page.evaluate(()=>({viewport:{width:innerWidth,height:innerHeight},document:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},map:document.querySelector('.branch-map')?.getBoundingClientRect().toJSON(),active:document.activeElement?.getAttribute('aria-label'),smallControls:[...document.querySelectorAll('button,summary')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&(r.width<44||r.height<44)}).map(e=>({label:e.getAttribute('aria-label')||e.textContent?.trim().slice(0,100),class:e.className,rect:e.getBoundingClientRect().toJSON()}))}));
    ledger.push({id,size,geometry,url:page.url()});
  }
  if(prior)await page.setViewportSize(prior);
  await writeFile(resolve(captures,`${id}.yml`),await page.locator('body').ariaSnapshot());
  await writeFile(resolve(root,'geometry.json'),JSON.stringify(ledger,null,2));
}
async function state(page:Page,id:string){
 const s=await readGame(page);await writeFile(resolve(root,`${id}-state.json`),JSON.stringify(s,null,2));return s;
}
function paths(graph:any,visited:string[]=[]){
 const last=graph.nodes.find((n:any)=>n.id===visited.at(-1));
 const walk=(id:string):string[][]=>{const n=graph.nodes.find((n:any)=>n.id===id);return n.next.length?n.next.flatMap((k:string)=>walk(k).map(p=>[id,...p])):[[id]]};
 return (last?last.next:graph.nodes.filter((n:any)=>n.row===0).map((n:any)=>n.id)).flatMap(walk);
}
for(const language of ['es','en'] as const){
 test(`current complete isolated journey ${language}`,async({page})=>{
 const en=language==='en'; const b=(es:string,english:string)=>page.getByRole('button',{name:en?english:es,exact:true});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(String(e)));const posts:string[]=[];page.on('request',r=>{if(r.method()==='POST'&&r.url().includes('/api/'))posts.push(new URL(r.url()).pathname)});
 await page.goto('/');if(en)await changeLanguage(page,'en');await photo(page,`${language}-01-entry`);
 await page.locator('header .settings-trigger').click();await photo(page,`${language}-02-settings`);await page.keyboard.press('Escape');
 await page.locator('.portal-enter').click();await expect(page.locator('.preparation-card')).toHaveCount(1);await photo(page,`${language}-03-preparation`);
 await page.locator('[data-preparation-inspect]').first().click();await photo(page,`${language}-04-inspector`);
 await b('Varita para copia 1','Wand for copy 1').click();await photo(page,`${language}-05-gear-tray`);await page.keyboard.press('Escape');
 await startExpedition(page,language);await photo(page,`${language}-06-map`,[{width:1280,height:900},{width:865,height:1079},{width:390,height:844}]);
 await b('Misiones','Missions').click();await photo(page,`${language}-07-missions-start`);await page.locator('.journey-next').click();await expect(page.locator('[data-shop="confectionery"]')).toBeVisible();await photo(page,`${language}-08-alley`);
 await page.locator('[data-shop="vault"]').click();await photo(page,`${language}-09-vault-empty`);await page.locator('.shop-street-exit').click();
 await page.locator('[data-shop="confectionery"]').click();await photo(page,`${language}-10-sweetshop`);
 await b('Grageas de Todos los Sabores','Every Flavour Beans').click();await page.locator('.shop-info-object').first().click();await photo(page,`${language}-11-beans-help`);await page.keyboard.press('Escape');
 await b('Comprar Grageas de Todos los Sabores · 5 Galeones','Buy Every Flavour Beans · 5 Galleons').click();await expect.poll(async()=>(await readGame(page)).inventory.products.filter(p=>p.kind==='random-beans'&&p.status==='available').length).toBe(1);await photo(page,`${language}-12-beans-owned`);
 await b('Rana de Chocolate','Chocolate Frog').click();await page.locator('.shop-purchase-ticket').click();await expect(page.locator('.reveal')).toBeVisible();await page.waitForTimeout(1200);await page.screenshot({path:resolve(captures,`${language}-13-opening-live-1280.png`)});
 await expect(page.locator('.reveal')).toHaveAttribute('data-opening-state','result',{timeout:10000});await expect.poll(()=>page.locator('.card-stars').evaluate(e=>getComputedStyle(e).opacity)).toBe('1');await photo(page,`${language}-14-reveal`);await page.locator('.reveal-continue').click();
 await b('Álbum de Cromos','Card Album').click();await photo(page,`${language}-15-album`);await page.locator('.album-filter-drawer>summary').click();await photo(page,`${language}-16-album-filters`);await page.locator('.album-filter-drawer>summary').click();
 await page.locator('nav').getByRole('button',{name:en?'Map':'Mapa',exact:true}).click();
 const game=await readGame(page);const all=paths(game.exploration!.run!.graph);const graph=game.exploration!.run!.graph;
 const route=all.sort((a,b)=>new Set(b.map(id=>graph.nodes.find(n=>n.id===id)!.kind)).size-new Set(a.map(id=>graph.nodes.find(n=>n.id===id)!.kind)).size)[0];
 await writeFile(resolve(root,`${language}-chosen-route.json`),JSON.stringify({method:'Read real authority graph; choose maximal type coverage for technical inspection, not blind player test',route,kinds:route.map(id=>graph.nodes.find(n=>n.id===id)!.kind)},null,2));
 let beanAssigned=false; const seen=new Set<string>();
 for(const id of route){
  const kind=graph.nodes.find(n=>n.id===id)!.kind;
  await page.locator(`[data-node="${id}"]`).click();await expect(page.locator('.node-event-dialog')).toBeVisible();
  if(!seen.has(kind)){await photo(page,`${language}-node-${kind}`);seen.add(kind);}
  if(kind==='refuge'){await page.locator('[data-visual-value="focus"]').click();await photo(page,`${language}-node-refuge-focus`);await page.locator('[data-visual-value="heal"]').click();}
  if((kind==='duel'||kind==='boss')&&!beanAssigned){
   const s=await readGame(page);const bean=s.inventory.products.find(p=>p.kind==='random-beans'&&p.status==='available');
   if(bean){await page.locator('.node-bean-preparation>summary').click();const actor=s.exploration!.run!.members[0].unit.id;await page.locator(`[data-bean-unit="${actor}"] [data-visual-value="${bean.id}"]`).click();await photo(page,`${language}-17-bean-assignment`);beanAssigned=true;}
  }
  await confirmEvent(page,language);
  if(kind==='duel'||kind==='boss'){
   const pause=b('Pausa','Pause');if(await pause.isEnabled())await pause.click();
   await photo(page,`${language}-arena-${kind}-early`);
   const skip=b('Omitir reproducción','Skip playback');if(await skip.isEnabled())await skip.click();await photo(page,`${language}-arena-${kind}-result`);
   await b('Volver al mapa','Back to map').click();
  }
  if(kind==='pact'&& (await readGame(page)).exploration!.run!.members.length===3){await page.locator('.team-prepare').click();await photo(page,`${language}-18-preparation-active`);await closePreparation(page);}
 }
 const boss=await state(page,`${language}-19-boss`);expect(boss.exploration!.run!.status).toBe('won');await photo(page,`${language}-19-after-map`);
 await page.locator('.receipt-disclosure>summary').click();await photo(page,`${language}-20-boss-receipt`);await b('Ver localizaciones desbloqueadas','View unlocked locations').click();await photo(page,`${language}-21-missions-after-boss`);
 await page.locator('.journey-next').click();await expect(page.locator('.shop-vault')).toBeVisible();await photo(page,`${language}-22-vault-key`);await page.locator('.vault-lock-action').click();await photo(page,`${language}-23-vault-confirm`);await b('Cancelar','Cancel').click();expect(await readGame(page)).toEqual(boss);
 await page.locator('.vault-lock-action').click();await b('Confirmar canje','Confirm exchange').click();await expect(page.locator('.commerce-result')).toBeVisible();await photo(page,`${language}-24-vault-result`);
 await page.locator('.shop-street-exit').click();await page.locator('[data-shop="workshop"]').click();await photo(page,`${language}-25-workshop`);
 await page.getByRole('group',{name:en?'Wood':'Madera',exact:true}).locator('[data-visual-value="birch"]').click();await page.getByRole('group',{name:en?'Core':'Núcleo',exact:true}).locator('[data-visual-value="dragon"]').click();await page.locator('.forge-action').click();await photo(page,`${language}-26-forge-confirm`);await b('Confirmar forja','Confirm forge').click();await expect(page.locator('.commerce-result')).toBeVisible();await photo(page,`${language}-27-forge-result`);
 await page.locator('.shop-result-kit').click();await inspectPreparationCopy(page);await b('Varita para copia 1','Wand for copy 1').click();const gear=(await readGame(page)).inventory.equipment!.filter(e=>e.kind==='wand').at(-1)!;await page.locator(`[data-equipment-id="${gear.id}"]`).click();await expect.poll(async()=>(await readGame(page)).team!.loadouts[0].wandId).toBe(gear.id);await photo(page,`${language}-28-equipped`);await closePreparation(page);
 await b('Álbum de Cromos','Card Album').click();await photo(page,`${language}-29-flavours`);await b('Misiones','Missions').click();await photo(page,`${language}-30-next-intention`);
 await page.locator('nav').getByRole('button',{name:en?'Map':'Mapa',exact:true}).click();await page.locator('.preparation-card').first().click();await photo(page,`${language}-31-next-expedition`);await startExpedition(page,language);await photo(page,`${language}-32-map-repeat`);
 const last=await state(page,`${language}-final`);await page.reload();await expect(page.locator('.branch-map')).toBeVisible();expect(await readGame(page)).toEqual(last);
 await writeFile(resolve(root,`${language}-journey-log.json`),JSON.stringify({language,observedKinds:[...seen],posts,errors,finalRevision:last.revision,source:'isolated GUI technical review, not user test'},null,2));
 });
}

for(const language of ['es','en'] as const){
 test(`contextual consultations and preparation destination ${language}`,async({page})=>{
  const en=language==='en',b=(es:string,english:string)=>page.getByRole('button',{name:en?english:es,exact:true});
  await page.goto('/');if(en)await changeLanguage(page,'en');await page.locator('.portal-enter').click();await startExpedition(page,language);
  await page.locator('nav').getByRole('button',{name:en?'Card Album':'Álbum de Cromos',exact:true}).click();
  const before=await readGame(page);await page.locator('.album-card-inspect:not(:disabled)').first().click();await photo(page,`${language}-E01-album-folio`);await page.keyboard.press('Escape');expect(await readGame(page)).toEqual(before);
  await page.locator('nav').getByRole('button',{name:en?'Diagon Alley':'Callejón',exact:true}).click();await page.locator('[data-shop="confectionery"]').click();
  await page.locator('.shop-counter-tools .shop-book-object').click();await photo(page,`${language}-E02-odds`);await page.keyboard.press('Escape');expect(await readGame(page)).toEqual(before);
  await b('Grageas de Todos los Sabores','Every Flavour Beans').click();await b('Comprar Grageas de Todos los Sabores · 5 Galeones','Buy Every Flavour Beans · 5 Galleons').click();await expect.poll(async()=>(await readGame(page)).inventory.products.filter(p=>p.kind==='random-beans'&&p.status==='available').length).toBe(1);
  const bought=await readGame(page);await page.locator('.bean-prepare-action').click();await expect(page.locator('.preparation-dialog[open]')).toBeVisible();await expect(page.locator('.preparation-dialog [data-bean-unit]')).toHaveCount(0);await photo(page,`${language}-E03-bean-destination`);expect(await readGame(page)).toEqual(bought);await closePreparation(page);
  await page.locator('.map-view-toggle').click();await photo(page,`${language}-E04-node-list`);await page.locator('.map-view-toggle').click();
  await page.locator('header .settings-trigger').click();await page.locator('.game-settings').getByRole('button',{name:'ARCANA',exact:true}).click();await page.keyboard.press('Escape');await photo(page,`${language}-E05-arcana-swap`);expect(await readGame(page)).toEqual(bought);
  await writeFile(resolve(root,`${language}-contextual-observations.json`),JSON.stringify({language,albumConsultPreservesState:true,oddsConsultPreservesState:true,beanPrepareDestination:'map preparation dialog',beanAssignmentsInThatDialog:0,beanAvailablePreserved:true,packSwapPreservesAuthority:true,fixture:false},null,2));
 });
}
