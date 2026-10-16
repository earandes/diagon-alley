/** Read-only A62 model. Imports current domain, writes only stdout. No UI/DB calls. */
import {registerHooks} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import crypto from 'node:crypto';
import ts from 'typescript';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
registerHooks({
 resolve(specifier,context,next){try{return next(specifier,context);}catch(e){if(specifier.startsWith('.'))return next(specifier+'.ts',context);throw e;}},
 load(url,context,next){if(url.endsWith('.json'))return {format:'module',shortCircuit:true,source:'export default '+JSON.stringify(JSON.parse(fs.readFileSync(fileURLToPath(url),'utf8')))+';'};if(url.endsWith('.ts'))return {format:'module',shortCircuit:true,source:ts.transpileModule(fs.readFileSync(fileURLToPath(url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText};return next(url,context);}
});
const {CombatEngine}=await import(pathToFileURL(root+'/src/arcana/domain/combat/engine.ts'));
const {SeededRandom}=await import(pathToFileURL(root+'/src/arcana/infrastructure/random/seeded-random.ts'));
const {trialConfiguration}=await import(pathToFileURL(root+'/src/arcana/infrastructure/content/trial-configuration.ts'));
const {campaign,opening}=trialConfiguration();const engine=new CombatEngine({fromSeed:seed=>new SeededRandom(seed)});
const owned=opening.catalog.wizards.slice(0,5).map((wizard,i)=>campaign.prepareOwned({copyId:'player-'+i,wizard,catalogVersion:opening.catalog.version,sourceId:'fixture',origin:'toad'}));
const boss=campaign.nodes.find(n=>n.kind==='boss');
const rivals=Array.from({length:5},(_,i)=>({...boss.opponents[i%3],id:'rival-'+i}));
const hashes=[];
for(let seed=0;seed<128;seed++)for(const scenario of ['base','alchemy','shadows-beans','fallen','five']){
 const count=scenario==='five'?5:3;let player=owned.slice(0,count).map(u=>({...u}));
 if(scenario==='alchemy')player=player.map(u=>({...u,affinity:'alchemy'}));
 if(scenario==='shadows-beans')player=player.map((u,i)=>({...u,affinity:'shadows',wandPowerBonus:2.5,wandMultiplier:1.15,broomInitiative:3.5,beanUnitId:'bean-'+i}));
 if(scenario==='fallen')player[0]={...player[0],hp:0};
 const record=engine.resolve({id:'equivalence-'+scenario+'-'+seed,seed,player,rival:rivals.slice(0,count),rules:campaign.combatRules});
 hashes.push({seed,scenario,sha256:crypto.createHash('sha256').update(JSON.stringify(record)).digest('hex')});
}
const result={scope:'Pure deterministic fixture characterization; no accounts or gameplay configuration writes',records:hashes.length,hashes};
const phase=process.argv[2]??'before';const output=root+'/docs/arcana/gameplay-increment-2026-10-16/evidence/combat-'+phase+'.json';fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
if(phase==='after'){const before=JSON.parse(fs.readFileSync(root+'/docs/arcana/gameplay-increment-2026-10-16/evidence/combat-before.json'));const equal=JSON.stringify(before.hashes)===JSON.stringify(hashes);textResult({records:hashes.length,identical:equal});if(!equal)process.exitCode=1;}else textResult({records:hashes.length,file:output});
function textResult(value){console.log(JSON.stringify(value));}
