"""A59 storefront production. Preparation is CPU-only; generation requires GPU coordination.

Run via tools/visual/diagon-mlx.sh. Never modifies A58 sources, runtime pack or game state.
"""
from pathlib import Path
import argparse
import hashlib
import importlib.metadata
import json
import os
import time

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'design/diagon-alley/annotations-a59/storefronts'
MODEL=ROOT/'.tools/diagon-illustration/models/flux2-klein-4b-4bit'
A58=ROOT/'design/diagon-alley/illustrated-v2/evidence'
REVISION='860e87183ceb29e39627c0612ebd66d8ea66e68c'
MODEL_ID='mlx-community/flux2-klein-4b-4bit'
COMMON=(
 'An exquisitely hand painted architectural storybook illustration in editorial gouache and fine oil glaze on textured cotton paper, '
 'for a richly illustrated British wizard alley exploration game. One complete shop facade seen straight on at pedestrian eye level, '
 'balanced near-symmetrical frontal elevation, vertical portrait composition with the whole shop from roof cornice to doorstep fully '
 'visible and a small comfortable margin around every edge. Tactile worn materials, visible delicate brushwork, realistic architectural '
 'depth, elaborate handcrafted details. Amber light glows warmly from the windows into dusk; muted plum and indigo shadows, aged brass '
 'highlights, ivory plaster and dark weathered wood. The composition feels like a place one can enter, with a substantial door and '
 'clearly built display windows, not a rectangular UI panel, not an interior, not a flat vector icon, not a cartoon, not a photograph '
 'or a movie still. Nobody present. No people, faces, actors, animals or characters. No signs, no lettering, no writing, no numbers, '
 'no logos, no watermark, no readable text anywhere. Any lintel and sign-shaped area is completely blank unmarked wood or stone. '
 'The shop stands on a narrow cobblestone sidewalk with dark soft neighboring masonry at the very edges. '
)
SHOPS={
 'confectionery':{
  'name':{'es':'Dulcería del Callejón','en':'Alley Sweet Shop'},'seed':591201,
  'role':'shopfront.confectionery',
  'description':('A delightful Victorian magical confectionery exterior, deep midnight-violet painted wooden storefront, two large bowed '
   'multi-pane display windows flanking a narrow central violet wooden door with small clear glass panes. Hand-polished brass door '
   'handle, softly glowing hanging amber lantern. Display shelves packed with jewel-colored glass candy jars, exquisite ribboned '
   'purple and gold sweet boxes and tiny striped paper sweet bags behind the glass. Curving carved wooden cornice and worn brass '
   'trim make the facade playful and welcoming; architecture remains plausibly built and finely painted. Window displays contain '
   'only confections and packaging, no frog creatures or figures. Warm inviting coral-amber window light, violet and mahogany wood, '
   'tactile glass and subtle gold foil. A single elegant door is clearly reachable from the cobbled doorstep.')},
 'workshop':{
  'name':{'es':'Ollivanders','en':'Ollivanders'},'seed':591202,
  'role':'shopfront.workshop',
  'description':('An ancient British wandmaker exterior with tall forest-green and nearly black weathered wooden mullions and a narrow '
   'recessed dark green arched door to the right of one magnificent tall bay display window. The asymmetrical wooden facade is slender '
   'and slightly crooked with age, a plain blank weathered wooden fascia under the cornice, no sign or lettering. Behind the thick '
   'small glass panes, dozens of long slender ivory and burgundy wand boxes are stacked vertically and horizontally to the ceiling; '
   'two carefully displayed elegant wooden wands rest on a tiny velvet stand. Worn brass fittings, old amber lamp beside the door, '
   'chipped green paint revealing dark oak grain. Fine enchanted dust within the warm light, restrained austere atmosphere. Entire '
   'tall facade and stone step visible, authentic craftsmanship, distinctive vertical wand shop architecture.')},
 'vault':{
  'name':{'es':'Gringotts','en':'Gringotts'},'seed':591203,
  'role':'shopfront.vault',
  'description':('A grand miniature wizard bank entrance exterior of aged ivory marble and pale limestone. A deep vaulted stone arch '
   'with sculpted geometric keystone rises over a heavy double door of warm antique brass with a circular locking rosette. Two '
   'slender carved ivory stone columns and broad shallow marble doorstep anchor the stately facade. Tall narrow grilled windows '
   'glow amber on both sides of the doorway. Tiny hammered brass studs, deep plum shadows under the arch, delicate veins in the '
   'stone and strong readable physical depth. The architecture is monumental, elegant and secure, clearly a bank one enters from '
   'the street, not an interior safe door and not a fortress or castle. Full arch and column bases visible, no lettering on stone '
   'or door. No goblins, people or creatures, only architecture and warm lanterns.')},
}

def write_once(path, value):
    content=json.dumps(value,ensure_ascii=False,indent=2)+'\n' if not isinstance(value,str) else value
    if path.exists() and path.read_text()!=content:
        raise FileExistsError('Preserve prior source; choose a new explicit attempt instead of overwriting: '+str(path))
    if not path.exists():path.write_text(content)

def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()

def prepare():
    for sub in ['masters','prompts','manifests','exports','context','logs']:(OUT/sub).mkdir(parents=True,exist_ok=True)
    integrity=json.loads((A58/'model-integrity.json').read_text())
    if integrity['revision']!=REVISION or integrity['result']!='pass':raise RuntimeError('A58 pinned model verification does not match')
    for shop_id,shop in SHOPS.items():write_once(OUT/'prompts'/(shop_id+'.txt'),COMMON+shop['description']+'\n')
    plan={'version':1,'scope':'A59 storefronts only; A58 source and runtime untouched','model':MODEL_ID,'revision':REVISION,
      'modelPath':str(MODEL.relative_to(ROOT)),'software':'mflux 0.22.0 / local MLX','modelLicense':'Apache-2.0','softwareLicense':'MIT',
      'licenseEvidence':{'model':'design/diagon-alley/illustrated-v2/evidence/base-model-LICENSE.md','mflux':'design/diagon-alley/illustrated-v2/evidence/mflux-MIT-LICENSE.txt'},
      'modelIntegrityReference':'design/diagon-alley/illustrated-v2/evidence/model-integrity.json','weightSha256':{r['path']:r['sha256'] for r in integrity['files'] if r['path'].endswith('.safetensors')},
      'width':768,'height':1024,'steps':4,'guidance':1.0,'cashCost':0,'network':'offline; no hosted API or token',
      'direction':'Frontal painted storefronts; amber windows / plum shadows / tangible wood-stone-brass; no embedded functional text or people',
      'reviewGate':'Generate one confectionery sample first. Root inspects it in context before workshop/vault generation or any runtime mapping.',
      'runtimeTarget':{'width':430,'height':574,'format':'WebP','targetMaximumBytes':51200},
      'shops':{k:{'name':v['name'],'seed':v['seed'],'role':v['role'],'promptFile':str((OUT/'prompts'/(k+'.txt')).relative_to(ROOT))} for k,v in SHOPS.items()}}
    write_once(OUT/'plan.json',plan)
    print('PREPARED_CPU_ONLY',str(OUT.relative_to(ROOT)),flush=True)
    print('MODEL_LOCAL_EXISTS',all((MODEL/p).is_file() for p in plan['weightSha256']),flush=True)
    return plan

parser=argparse.ArgumentParser()
parser.add_argument('--prepare',action='store_true')
parser.add_argument('--id',choices=list(SHOPS),default='confectionery')
parser.add_argument('--attempt',type=int,default=1)
parser.add_argument('--generate',action='store_true')
parser.add_argument('--export',action='store_true',dest='export_image')
parser.add_argument('--trim-paper',action='store_true',help='CPU derivative: trim the model paper margin while preserving the master and first export')
parser.add_argument('--gpu-coordination-confirmed',action='store_true')
parser.add_argument('--root-sample-reviewed',action='store_true')
parser.add_argument('--contact',action='store_true',help='CPU-only three-storefront context composition and proposal metadata')
args=parser.parse_args()
if args.attempt<1:parser.error('Positive explicit attempt number required')
if args.generate and not args.gpu_coordination_confirmed:parser.error('GPU coordination flag required; do not run while browser benchmarks are active')
if args.generate and args.id!='confectionery' and not args.root_sample_reviewed:parser.error('Root must review the confectionery sample in context before producing the rest')
plan=prepare();shop=SHOPS[args.id];seed=shop['seed']+args.attempt-1
name=f'{args.id}--seed-{seed}--attempt-{args.attempt}'
master=OUT/'masters'/(name+'.png');manifest=OUT/'manifests'/(name+'.json')
if args.generate:
    if os.environ.get('HF_HUB_OFFLINE')!='1':parser.error('Use diagon-mlx.sh to enforce offline project-local inference')
    if master.exists() or manifest.exists() or master.with_suffix('.metadata.json').exists():raise FileExistsError('Attempt already exists; explicit new --attempt required: '+str(master))
    if not (MODEL/'transformer/0.safetensors').is_file():raise FileNotFoundError('Pinned local model missing; no inference or download attempted')
    # Verify pinned tensor bytes with streaming IO before initializing Metal.
    for relative,expected in plan['weightSha256'].items():
      path=MODEL/relative
      state=hashlib.sha256()
      with path.open('rb') as source:
        for chunk in iter(lambda:source.read(1024*1024),b''):state.update(chunk)
      if state.hexdigest()!=expected:raise RuntimeError('Pinned local tensor hash mismatch: '+relative)
    print('MODEL_SHA256_VERIFIED',len(plan['weightSha256']),'tensor files',flush=True)
    # Deferred imports: preparation and export do not initialize Metal.
    started=time.time();print('MODEL_LOAD_START',time.strftime('%Y-%m-%dT%H:%M:%S%z'),flush=True)
    import mlx.core as mx
    from mflux.models.common.config import ModelConfig
    from mflux.models.flux2.variants import Flux2Klein
    model=Flux2Klein(model_config=ModelConfig.flux2_klein_4b(),model_path=str(MODEL))
    load_seconds=time.time()-started;print('MODEL_LOAD_COMPLETE',round(load_seconds,2),'seconds',flush=True)
    prompt=(OUT/'prompts'/(args.id+'.txt')).read_text().strip()
    print('GENERATE_START',args.id,seed,flush=True);started=time.time()
    image=model.generate_image(seed=seed,prompt=prompt,num_inference_steps=4,width=768,height=1024,guidance=1.0)
    # Preserve exact attempt identity. Existing paths are rejected rather than accepting MFLUX _1/_2 suffixes.
    image.save(path=str(master),export_json_metadata=True,overwrite=False)
    if not master.is_file():raise RuntimeError('Exact declared master missing; no suffixed output will be silently selected: '+str(master))
    record={'id':args.id,'role':shop['role'],'attempt':args.attempt,'seed':seed,'master':str(master.relative_to(ROOT)),'sha256':digest(master),
      'promptFile':str((OUT/'prompts'/(args.id+'.txt')).relative_to(ROOT)),'promptSha256':digest(OUT/'prompts'/(args.id+'.txt')),
      'model':MODEL_ID,'modelRevision':REVISION,'modelIntegrityReference':plan['modelIntegrityReference'],'modelLicense':'Apache-2.0','verifiedWeightSha256':plan['weightSha256'],
      'width':768,'height':1024,'steps':4,'guidance':1.0,'mode':'offline local Metal text-to-image','cashCost':0,
      'loadSeconds':round(load_seconds,2),'generationSeconds':round(time.time()-started,2),'gpuPeakMemoryBytes':int(mx.get_peak_memory()),
      'tool':{'mflux':importlib.metadata.version('mflux'),'mlx':importlib.metadata.version('mlx')},'status':'sample awaiting root visual review; not mapped to runtime',
      'permission':'Private project prototype. Model license does not resolve franchise distribution permission.'}
    manifest.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
    print('GENERATE_COMPLETE',args.id,record['generationSeconds'],'seconds',record['gpuPeakMemoryBytes'],'peak bytes',flush=True)
    mx.clear_cache()
if args.export_image:
    from PIL import Image, ImageOps, ImageDraw, ImageFont
    if not master.is_file() or not manifest.is_file():raise FileNotFoundError('Export requires exact generated master and manifest')
    record=json.loads(manifest.read_text())
    if digest(master)!=record['sha256']:raise RuntimeError('Generated master hash changed')
    export_name=name+('--borderless' if args.trim_paper else '')
    export=OUT/'exports'/(export_name+'.webp')
    if export.exists():raise FileExistsError('Export already exists; preserve attempt: '+str(export))
    raw=Image.open(master).convert('RGB');crop=(0,0,raw.width,raw.height)
    if args.trim_paper:
      # A significant dark-content fraction rejects scattered paper grain at the edges.
      lum=raw.convert('L');px=lum.load()
      cols=[x for x in range(raw.width) if sum(px[x,y]<220 for y in range(raw.height))>raw.height*.25]
      rows=[y for y in range(raw.height) if sum(px[x,y]<220 for x in range(raw.width))>raw.width*.25]
      if not cols or not rows:raise RuntimeError('No reliable architectural bounds found; preserve source for manual review')
      crop=(min(cols),min(rows),max(cols)+1,max(rows)+1)
      if (crop[2]-crop[0])<raw.width*.85 or (crop[3]-crop[1])<raw.height*.85:raise RuntimeError('Automatic paper trim exceeded15%; explicit visual crop review required')
    image=ImageOps.fit(raw.crop(crop),(430,574),method=Image.Resampling.LANCZOS,centering=(.5,.5))
    for quality in [88,84,80,76,72,68]:
      image.save(export,'WEBP',quality=quality,method=6)
      if export.stat().st_size<=51200:break
    export_record={'id':args.id,'role':shop['role'],'source':record['master'],'sourceSha256':record['sha256'],'path':str(export.relative_to(ROOT)),
      'sha256':digest(export),'width':430,'height':574,'alpha':False,'pivot':[.5,.5],'quality':quality,'bytes':export.stat().st_size,
      'sourceCrop':list(crop),'transform':'Optional paper-margin trim, then Lanczos centered fit to430x574; no paint retouch or embedded text','alt':shop['name'],'status':'export awaiting root review; not mapped to runtime'}
    (OUT/'manifests'/(export_name+'--export.json')).write_text(json.dumps(export_record,ensure_ascii=False,indent=2)+'\n')
    # CPU-only context sketch. The label is review UI, not embedded in the delivered storefront.
    alley=Image.open(ROOT/'src/arcana/presentation/content-packs/diagon-alley/art/scene/diagon-alley.webp').convert('RGB')
    context=ImageOps.fit(alley,(1100,850),method=Image.Resampling.LANCZOS)
    overlay=Image.new('RGBA',context.size,(10,15,28,95));context=Image.alpha_composite(context.convert('RGBA'),overlay)
    portal=ImageOps.fit(image,(330,440),method=Image.Resampling.LANCZOS);context.alpha_composite(portal.convert('RGBA'),(385,255))
    draw=ImageDraw.Draw(context);draw.rounded_rectangle((380,218,720,256),radius=9,fill=(37,27,37,235),outline=(186,146,72,255),width=2)
    draw.text((398,229),shop['name']['en'],fill=(245,224,185,255));draw.text((32,36),'A59 · CPU context study / not a gameplay screenshot',fill=(245,224,185,255))
    context.convert('RGB').save(OUT/'context'/(export_name+'.png'))
    print('EXPORT_COMPLETE',args.id,export.stat().st_size,'bytes','quality',quality,flush=True)
if args.contact:
    from PIL import Image, ImageOps, ImageDraw, ImageFont
    areas={
      'confectionery':{'left':.12,'top':.205,'width':.76,'height':.07,'ink':'#f1d8a4'},
      'workshop':{'left':.12,'top':.168,'width':.76,'height':.066,'ink':'#e9d9ac'},
      'vault':{'left':.28,'top':.383,'width':.44,'height':.032,'ink':'#493722'},
    }
    alley=Image.open(ROOT/'src/arcana/presentation/content-packs/diagon-alley/art/scene/diagon-alley.webp').convert('RGB')
    context=ImageOps.fit(alley,(1100,850),method=Image.Resampling.LANCZOS).convert('RGBA')
    context=Image.alpha_composite(context,Image.new('RGBA',context.size,(10,15,28,85)))
    draw=ImageDraw.Draw(context)
    font_path=ROOT/'src/arcana/presentation/fonts/cinzel-latin-variable.ttf'
    font=ImageFont.truetype(str(font_path),16)
    note_font=ImageFont.truetype(str(font_path),13)
    proposals=[]
    for index,(shop_id,shop) in enumerate(SHOPS.items()):
      base=f"{shop_id}--seed-{shop['seed']}--attempt-1--borderless"
      export_path=OUT/'exports'/(base+'.webp')
      export_manifest_path=OUT/'manifests'/(base+'--export.json')
      if not export_path.is_file() or not export_manifest_path.is_file():raise FileNotFoundError('Three reviewed exports required for contact: '+str(export_path))
      record=json.loads(export_manifest_path.read_text())
      if digest(export_path)!=record['sha256']:raise RuntimeError('Export hash changed: '+shop_id)
      area=areas[shop_id]
      record['labelArea']={'coordinateSpace':'normalized export bounds; after sourceCrop and430x574 fit',**area,'textEmbeddedInRuntimeImage':False}
      export_manifest_path.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
      x=56+index*339;y=262;w=310;h=414
      portal=ImageOps.fit(Image.open(export_path).convert('RGBA'),(w,h),method=Image.Resampling.LANCZOS)
      context.alpha_composite(portal,(x,y))
      # Review-only labels illustrate placement. They are not written into export/master bitmaps.
      label=shop['name']['es'];label_font=ImageFont.truetype(str(font_path),12 if shop_id!='vault' else 10)
      box=draw.textbbox((0,0),label,font=label_font)
      draw.text((x+(area['left']+area['width']/2)*w-(box[2]-box[0])/2,y+(area['top']+area['height']/2)*h-(box[3]-box[1])/2-box[1]),label,font=label_font,fill=area['ink'])
      proposals.append({'id':shop['role'],'sourceExport':record['path'],'sourceSha256':record['sha256'],'bytes':record['bytes'],
        'runtimeState':'planned target, not installed or mapped','plannedRuntimePath':'art/storefronts-a59/'+shop_id+'.webp',
        'width':430,'height':574,'alpha':False,'pivot':[.5,.5],'alt':shop['name'],'labelArea':record['labelArea']})
    draw.text((35,28),'A59 · Tres fachadas pintadas / estudio CPU de contexto',font=font,fill='#f1d8a4')
    draw.text((35,55),'No es captura del juego. Rotulos de revision fuera del bitmap exportado.',font=note_font,fill='#ecdcb7')
    context.convert('RGB').save(OUT/'context/three-storefronts.png')
    (OUT/'runtime-proposal.json').write_text(json.dumps({'version':1,'runtimeMapping':'awaiting root review; no files installed','roles':proposals},ensure_ascii=False,indent=2)+'\n')
    print('CONTACT_COMPLETE_CPU_ONLY',flush=True)
if not args.generate and not args.export_image and not args.contact:print('No GPU inference, export or runtime mapping performed.',flush=True)
