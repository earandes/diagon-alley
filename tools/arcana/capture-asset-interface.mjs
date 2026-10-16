import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const directory='docs/arcana/asset-interface-2026-10-14';
const baseURL=process.env.ARCANA_CAPTURE_URL ?? 'http://127.0.0.1:5194';
const browser=await chromium.launch();
const observations=[];
try {
 for(const language of ['es','en']) {
 const context=await browser.newContext({baseURL,viewport:{width:1280,height:900}});
 const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const button=(es,en)=>page.getByRole('button',{name:language==='es'?es:en,exact:true});
 const read=async()=>(await(await page.request.get('/api/state')).json()).state;
 const capture=async(name)=>{
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>{const b=i.getBoundingClientRect();return b.top<innerHeight&&b.bottom>0}).map(i=>{i.loading='eager';return i.decode().catch(()=>{})}));});
 await page.screenshot({path:`${directory}/capturas/after-${name}-${language}-${page.viewportSize().width}.png`});};
 await page.goto('/');if(language==='en')await button('English','English').click();
 await capture('welcome');await button('Comenzar ensayo local','Start local trial').click();
 await page.locator('.team-unit').waitFor();await capture('map');const initial=await read();
 await button('Bazar','Bazaar').click();await capture('shop');
 await button('Taller de Varitas','Wand Workshop').click();
 await page.getByRole('group',{name:language==='es'?'Madera':'Wood',exact:true}).locator('[data-visual-value="willow"]').click();
 await capture('workshop');
 await page.setViewportSize({width:390,height:844});await capture('workshop');
 await page.setViewportSize({width:1280,height:900});
 await button('Cromodex','Chromodex').click();
 await page.getByRole('group',{name:language==='es'?'Filtro de descubrimiento':'Discovery filter',exact:true}).locator('[data-visual-value="discovered"]').click();
 await page.getByText(language==='es'?'Inspeccionar copia 1':'Inspect copy 1',{exact:true}).click();
 await capture('equipment');
 if(JSON.stringify(initial)!==JSON.stringify(await read()))throw Error('Read/preview changed authority');
 await page.setViewportSize({width:320,height:844});await capture('collection');
 await page.evaluate(()=>{document.documentElement.style.fontSize='200%'});await capture('text200');
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow');
 await page.evaluate(()=>{document.documentElement.style.fontSize=''});await page.setViewportSize({width:390,height:844});
 await button('Mapa','Map').click();await button('Iniciar expedición','Start expedition').click();
 for(const id of ['pasaje:0:0','pasaje:1:0']){await page.locator(`[data-node="${id}"]`).click();await button('Confirmar nodo','Confirm node').click();await page.locator('dialog').waitFor({state:'detached'});}
 await page.locator('[data-node="pasaje:2:0"]').click();await capture('combat-ready');
 await button('Cancelar','Cancel').click();await page.setViewportSize({width:1280,height:900});
 await page.locator('.team').evaluate(e=>e.scrollIntoView({block:'start'}));await capture('formation');
 await page.emulateMedia({reducedMotion:'reduce'});await button('Bazar','Bazaar').click();await button('Taller de Varitas','Wand Workshop').click();await capture('reduced');
 const final=await read();await page.reload();await page.locator('.forge-materials').waitFor();
 if(JSON.stringify(final)!==JSON.stringify(await read()))throw Error('Reload changed authority');
 observations.push({language,previewUnchanged:true,reloadUnchanged:true,nativeFormControls:await page.locator('input,select,textarea').count(),errors});
 await context.close();
 }
} finally {await browser.close();}
await writeFile(`${directory}/capture-observations.json`,JSON.stringify(observations,null,2));
