import { readFileSync } from 'node:fs';
const [beforeFile, afterFile] = process.argv.slice(2);
if (!beforeFile || !afterFile) throw Error('Pass reference and candidate diagnostic JSON');
import { gunzipSync } from 'node:zlib';
const read = f => JSON.parse(f.endsWith('.gz') ? gunzipSync(readFileSync(f)) : readFileSync(f));
const before = read(beforeFile), after = read(afterFile);
const percentile = (v,q=.95) => [...v].sort((a,b)=>a-b)[Math.floor((v.length-1)*q)] ?? null;
function sample(r) {
 const metrics = r.warm.data.metrics;
 const sum = (name,start=0,end=Infinity) => metrics.filter(m=>m.name===name && m.start>=start && m.start<end).reduce((n,m)=>n+m.duration,0);
 return { pair:r.pair,kind:r.kind,readyUpperMs:r.startup.at,
  startupP95RafMs:percentile(r.startup.data.frames.map(f=>f.ms)),startupMaxRafMs:Math.max(...r.startup.data.frames.map(f=>f.ms)),
  startupPaints:metrics.filter(m=>m.name==='paint'&&m.start<r.warmStart).length,
  startupPaintWallMs:sum('paint',0,r.warmStart),startupSubmitWallMs:sum('render-submit',0,r.warmStart),
  warmP95RafMs:percentile(r.warm.data.frames.filter(f=>f.at>=r.warmStart).map(f=>f.ms)),
  warmGeometryRebuilds:metrics.filter(m=>m.name==='geometry'&&m.start>=r.warmStart).length,
  warmPaintWallMs:sum('paint',r.warmStart),visibleFigures:r.warm.scene.visibleFigures,textures:r.warm.scene.textureCount,textureEstimate:r.warm.scene.textureBytes };
}
console.log(JSON.stringify({ beforeSha:before.sha,afterSha:after.sha,method:'Three ordered pairs per variant; software renderer and context cache conditions declared in raw reports. No hardware-wide claim.',before:before.records.map(sample),after:after.records.map(sample),objectives:{warmP95RafMs:20,genericReadyUpperMs:400,bossReadyUpperMs:550,startupMaxRafMs:100}},null,2));
