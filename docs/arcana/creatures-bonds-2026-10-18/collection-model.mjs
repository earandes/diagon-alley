// Exact finite-state model, not game authority or human behaviour.
// node docs/arcana/creatures-bonds-2026-10-18/collection-model.mjs
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
const raw = JSON.parse(readFileSync(new URL('../../../src/arcana/content/trial-v1.json', import.meta.url)));
assert.equal(raw.toadTable.entries.length, 29);
const extension = JSON.parse(readFileSync(new URL('../../../src/arcana/content/creatures-v1.json',import.meta.url)));
const traits = JSON.parse(readFileSync(new URL('../../../src/arcana/content/traits-v2.json',import.meta.url)));
assert.equal(extension.wizards.length,4);
assert.equal(new Set([...raw.catalog.wizards,...extension.wizards].map(w=>w.id)).size,34);
assert(raw.toadTable.entries.every(e => e.weight === 1));
const histogram = (total, subset, steps) => {
 let p = Array(subset+1).fill(0); p[0]=1;
 const history = [p];
 for(let t=1;t<=steps;t++){
  const next=Array(subset+1).fill(0);
  for(let k=0;k<=subset;k++){
   const fresh=(subset-k)/total;
   next[k]+=p[k]*(1-fresh);
   if(k<subset)next[k+1]+=p[k]*fresh;
  }
  assert(Math.abs(next.reduce((a,b)=>a+b,0)-1)<1e-11);
  p=next;history.push(p);
 }
 return history;
};
assert.equal(histogram(1,1,1)[1][1],1);
assert.equal(histogram(2,2,2)[2][2],.5);
assert.equal(histogram(2,2,3)[3][2],.75);
const harmonic=n=>Array.from({length:n},(_,i)=>1/(i+1)).reduce((a,b)=>a+b,0);
assert.equal(3*harmonic(3),5.5);
const quantiles=(h,k)=>Object.fromEntries([.5,.9,.95].map(q=>[String(q),h.findIndex(p=>p.slice(k).reduce((a,b)=>a+b,0)>=q)]));
const scenario=n=>{
 const h=histogram(n,n,2500);
 return {randomIdentities:n,starterIdentities:1,baseTotal:n+1,identityProbability:1/n,
  enchantedIdentityProbability:1/(100*n),
  thresholds:[.25,.5,.75,1].map(f=>{
   const k=Math.max(0,Math.ceil(f*(n+1))-1);
   const mean=n*(harmonic(n)-harmonic(n-k));
   return {baseFraction:f,distinctDrawnNeeded:k,openings:quantiles(h,k),meanOpenings:mean,meanDuplicatesAtFirstThreshold:mean-k};
  }),
  missingSpecificAt:[30,60,100,150,200].map(t=>({openings:t,probability:((n-1)/n)**t}))};
};
const creatureHistory=histogram(33,4,2500);
const result={status:'Configured a87 catalogue4/table4; runtime constructor uniform33 tickets is checked in creature-content-a87.test.ts; technical graphical acceptance pending',
 method:'Exact occupancy DP, uniform tickets. No Monte Carlo, human time, income or pity assumption.',
 baseline:scenario(29),proposal:scenario(33),
 affiliationAcquisition:['order','death'].map(group=>{const count=Object.values(traits.characters).filter(t=>t.affiliations.includes(group)).length;return {group,available:count,threeDistinct:quantiles(histogram(33,count,2500),3),meanOpeningsToThree:33*(harmonic(count)-harmonic(count-3))};}),
 newCreatures:[3,4].map(k=>({distinctNeeded:k,openings:quantiles(creatureHistory,k),meanOpenings:33*(harmonic(4)-harmonic(4-k))})),
 alreadyCompletedOldCollection:{missing:4,meanOpenings:33*harmonic(4),openings:quantiles(creatureHistory,4)},
 firstEnchantedUnchanged:Object.fromEntries([.5,.9,.95].map(q=>[q,Math.ceil(Math.log(1-q)/Math.log(.99))])),
 limits:['Assumes repeated independent uniform draws from the proposed fixed table','Duplicates are not converted','No route victory or monetary gain is inferred','No calendar or human duration inferred','No grant or inventory mutation']};
writeFileSync(new URL('./collection-model.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({baseline:result.baseline.thresholds.at(-1),proposal:result.proposal.thresholds.at(-1),creatures:result.newCreatures}));
