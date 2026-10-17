import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
const files = process.argv.slice(2);
if (!files.length) throw Error('Pass one or more diagnostic-reference.json files');
const q = values => {
  const ordered = [...values].sort((a,b) => a-b);
  return { n: values.length, p50: ordered[Math.floor((ordered.length-1)*.5)] ?? null, p95: ordered[Math.floor((ordered.length-1)*.95)] ?? null, max: ordered.at(-1) ?? null, sum: values.reduce((a,b) => a+b,0) };
};
for (const file of files) {
  const report = JSON.parse(file.endsWith('.gz') ? gunzipSync(readFileSync(file)) : readFileSync(file));
  console.log(JSON.stringify({ file, sha: report.sha, records: report.records.map(r => {
    const metric = (name, from=0, to=Infinity) => q(r.warm.data.metrics.filter(m=>m.name===name && m.start>=from && m.start<to).map(m=>m.duration));
    return { kind:r.kind, pair:r.pair, gpu:r.startup.data.gpu, startupUsableUpperMs:r.startup.at,
      init:metric('renderer-init'), import:metric('module-import'), decode:metric('figure-decode'),
      startupFrames:q(r.startup.data.frames.map(f=>f.ms)),
      startupPaint:metric('paint',0,r.warmStart), startupSubmit:metric('render-submit',0,r.warmStart),
      startupTasks:r.startup.data.tasks,
      warmFrames:q(r.warm.data.frames.filter(f=>f.at>=r.warmStart).map(f=>f.ms)),
      warmPaint:metric('paint',r.warmStart), warmSubmit:metric('render-submit',r.warmStart),
      warmGeometry:metric('geometry',r.warmStart),
      warmTasks:r.warm.data.tasks.filter(t=>t.start>=r.warmStart),
      warmPaints:Number(r.warm.scene.renderCount)-Number(r.startup.scene.renderCount),
      textures:r.warm.scene.textureCount, textureRGBAEstimate:r.warm.scene.textureBytes,
    };
  })},null,2));
}
