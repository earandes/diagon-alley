import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
const bytes = readFileSync(process.argv[2]);
const data = JSON.parse(process.argv[2].endsWith('.gz') ? gunzipSync(bytes) : bytes);
const q = values => {
  const s = [...values].sort((a,b) => a-b);
  return { n:s.length, p50:s[Math.floor((s.length-1)*.5)]??null, p95:s[Math.floor((s.length-1)*.95)]??null, max:s.at(-1)??null, sum:s.reduce((a,b)=>a+b,0) };
};
const windowSummary = (a,b,start) => ({
  raf:q(b.data.frames.filter(f=>f.at>=start).map(f=>f.ms)),
  metrics:Object.fromEntries(['paint','render-submit','geometry','react-commit-wall'].map(name=>[name,q(b.data.metrics.filter(m=>m.name===name&&m.start>=start).map(m=>m.duration))])),
  gl:Object.fromEntries(Object.keys(b.data.gl).map(k=>[k,b.data.gl[k]-(a.data.gl[k]??0)])),
});
console.log(JSON.stringify({sha:data.sha,records:data.records.map(r=>({
  pair:r.pair,kind:r.kind,variant:r.variant,readyUpperMs:r.startup.at,
  startup:q(r.startup.data.frames.map(f=>f.ms)),
  native:Object.fromEntries([...new Set(r.warm.data.metrics.filter(m=>m.name.startsWith('native-')).map(m=>m.name))].map(name=>[name,q(r.warm.data.metrics.filter(m=>m.name===name).map(m=>m.duration))])),
  shaderSamplers:r.warm.data.shaderSamplers??null,
  scene:r.warm.scene,
  warm:windowSummary(r.startup,r.warm,r.warmStart),
  remount:r.remount?windowSummary(r.remount.started,r.remount.ended,r.remount.started.at):null,
}))},null,2));
