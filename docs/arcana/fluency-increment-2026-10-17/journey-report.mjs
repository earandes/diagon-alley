import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';
const q = values => {
  const sorted = values.filter(Number.isFinite).sort((a,b)=>a-b);
  return { n:sorted.length, min:sorted[0]??null, p50:sorted[Math.floor((sorted.length-1)*.5)]??null, max:sorted.at(-1)??null };
};
for (const folder of process.argv.slice(2)) {
  const reports = readdirSync(folder).filter(name=>/expedition\.json(?:\.gz)?$/.test(name)).map(name=>{
    const bytes = readFileSync(join(folder,name));
    return JSON.parse(name.endsWith('.gz')?gunzipSync(bytes):bytes);
  });
  if (reports.length!==4) throw Error(`Expected four declared ES/EN x pack accounts: ${folder}`);
  const names = [...new Set(reports.flatMap(r=>r.steps.map(s=>s.name)))];
  console.log(JSON.stringify({ folder, shas:[...new Set(reports.map(r=>r.sha))],
    method:'Four isolated authority journeys, polling upper bounds from captured actual clicks; origin/process caches and route outcomes not experimentally matched. No causal network or human timing claim.',
    entry:q(reports.map(r=>r.entryUsableFromNavigationMs)),
    steps:names.map(name=>({ name, ...Object.fromEntries(['actionToUsableUpperBoundMs','actionToResponseEndMs','actionToFiguresUpperBoundMs','actionToChoreographyUpperBoundMs'].map(field=>[field,q(reports.flatMap(r=>r.steps.filter(s=>s.name===name).map(s=>s[field])))])) })),
  },null,2));
}
