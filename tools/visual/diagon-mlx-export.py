"""CPU-only preparation of painted masters, masks, role exports and contact sheet.

Keep unmodified generated originals. Crops are recorded and never stretch art.
No game state or runtime pack registry is written by this production tool.
"""
import argparse
import hashlib
import json
import os
import shutil
import time
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
DESIGN=ROOT/'design/diagon-alley/illustrated-v2'
TOOLS=ROOT/'.tools/diagon-illustration'
os.environ['REMBG_HOME']=str(TOOLS/'models/segmentation')
os.environ['U2NET_HOME']=str(TOOLS/'models/segmentation')
os.environ['NUMBA_CACHE_DIR']=str(TOOLS/'cache/numba')
os.environ['OMP_NUM_THREADS']='4'
from PIL import Image, ImageOps, ImageDraw, ImageFont
import onnxruntime as ort
from rembg import new_session, remove

parser=argparse.ArgumentParser()
parser.add_argument('--ids',nargs='+',default=['apprentice','circe','merlin'])
parser.add_argument('--plan',default=str(DESIGN/'production-plan.json'))
parser.add_argument('--skip-segmentation',action='store_true')
args=parser.parse_args()
options=ort.SessionOptions()
options.intra_op_num_threads=4
options.inter_op_num_threads=2
session=new_session('u2net',providers=['CPUExecutionProvider'],sess_opts=options)
plan=json.loads(Path(args.plan).read_text())
labels=json.loads((ROOT/'src/arcana/presentation/content-packs/diagon-alley/characters.json').read_text())
THUMB_CROPS={'apprentice':(133,87,616,690),'circe':(120,62,652,727),'merlin':(116,127,636,777)}
CROPS={'circe':(40,38,728,988)}
overrides=json.loads((DESIGN/'export-crops.json').read_text()) if (DESIGN/'export-crops.json').exists() else {}
selections=json.loads((DESIGN/'selected-attempts.json').read_text()) if (DESIGN/'selected-attempts.json').exists() else {}
exports=json.loads((DESIGN/'exports-index.json').read_text()) if (DESIGN/'exports-index.json').exists() else {}
old_records=json.loads((DESIGN/'evidence/export-manifest.json').read_text()).get('characters',[]) if (DESIGN/'evidence/export-manifest.json').exists() else []
records=[record for record in old_records if record['id'] not in args.ids]
for id in args.ids:
    started=time.time()
    selected=selections.get(id)
    original=ROOT/selected['sourcePath'] if selected else DESIGN/'samples'/(id+'.png')
    if selected and hashlib.sha256(original.read_bytes()).hexdigest()!=selected['sha256']:
        raise ValueError('Selected source hash changed: '+id)
    with Image.open(original) as raw:
        master=raw.convert('RGB')
        crop=overrides.get(id,{}).get('masterCrop',CROPS.get(id))
        if crop:
            master=ImageOps.fit(master.crop(crop),(768,1024),Image.Resampling.LANCZOS)
    if id=='apprentice':
        # A small art-director-requested retouch, independently editable from the master.
        retouches=DESIGN/'retouches'
        retouches.mkdir(exist_ok=True)
        (retouches/'apprentice-scar.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="768" height="1024" viewBox="0 0 768 1024"><path d="M404 248 397 261 405 261 399 275" fill="none" stroke="#9c6856" stroke-opacity=".72" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>')
        overlay=Image.new('RGBA',master.size)
        ImageDraw.Draw(overlay).line([(404,248),(397,261),(405,261),(399,275)],fill=(156,104,86,184),width=3,joint='curve')
        master=Image.alpha_composite(master.convert('RGBA'),overlay).convert('RGB')
    masters=DESIGN/'masters'
    masters.mkdir(exist_ok=True)
    master_path=masters/(id+'.png')
    master.save(master_path)
    masks=DESIGN/'masks'
    masks.mkdir(exist_ok=True)
    if args.skip_segmentation and (masks/(id+'-cutout.png')).exists():
        clean=Image.open(masks/(id+'-cutout.png')).convert('RGBA')
    else:
        clean=remove(master,session=session,alpha_matting=True,
              alpha_matting_foreground_threshold=235,alpha_matting_background_threshold=10,
              alpha_matting_erode_size=3)
    clean.save(masks/(id+'-cutout.png'))
    clean.getchannel('A').save(masks/(id+'-alpha.png'))
    directory=DESIGN/'exports/character'/id
    directory.mkdir(parents=True,exist_ok=True)
    face_crop=overrides.get(id,{}).get('faceCrop',THUMB_CROPS.get(id,(130,90,650,740)))
    # Figure uses contain + transparent side padding: no part of the generated
    # silhouette is removed merely to match the historical role's aspect ratio.
    figure=Image.new('RGBA',(342,428))
    contained=ImageOps.contain(clean,(342,428),Image.Resampling.LANCZOS)
    figure.alpha_composite(contained,((342-contained.width)//2,428-contained.height))
    prepared={
      'portrait':ImageOps.fit(master,(512,640),Image.Resampling.LANCZOS,centering=(.5,0)),
      'figure':figure,
      'thumbnail':ImageOps.fit(clean.crop(face_crop),(96,120),Image.Resampling.LANCZOS),
    }
    for role, image in prepared.items():
        path=directory/(role+'.webp')
        image.save(path,'WEBP',quality=90 if role!='thumbnail' else 88,method=6)
        has_alpha='A' in image.getbands() and image.getchannel('A').getextrema()[0]<255
        exports['character.'+id+'.'+role]={'path':'art/character/'+id+'/'+role+'.webp',
          'productionFile':str(path.relative_to(ROOT)),'width':image.width,'height':image.height,
          'alpha':has_alpha,'pivot':[.5,.95],
          'alt':{'es':'Ilustración de '+labels[id]['name']['es'],'en':'Illustration of '+labels[id]['name']['en']}}
    records.append({'id':id,'original':str(original.relative_to(ROOT)),
      'master':str(master_path.relative_to(ROOT)),'sourceCrop':crop or 'unchanged',
      'masterSize':[768,1024],'transform':'Recorded crop and aspect-preserving fit, no stretching; original retained.',
      'retouch':'retouches/apprentice-scar.svg' if id=='apprentice' else None,
      'faceCrop':face_crop,'mask':'masks/'+id+'-alpha.png',
      'roleFit':'Portrait: proportional center-top cover, crop lower torso only. Figure: proportional contain with transparent side padding, complete source silhouette. Thumbnail: recorded facial crop.',
      'segmentation':'rembg2.0.85 / U2net / CPUExecutionProvider / alpha_matting',
      'seconds':round(time.time()-started,2),'cashCost':0})
    print('EXPORTED',id,round(time.time()-started,2),'seconds',flush=True)
(DESIGN/'exports-index.json').write_text(json.dumps(exports,ensure_ascii=False,indent=2)+'\n')
(DESIGN/'evidence/export-manifest.json').write_text(json.dumps({'characters':records,'providers':session.inner_session.get_providers(),'visualReview':'First three samples accepted by integrator; production portraits require individual source/mask/crop review.'},ensure_ascii=False,indent=2)+'\n')

# Static local composition in the current alley, made with Pillow, no browser GPU.
background=Image.open(ROOT/'src/arcana/presentation/content-packs/diagon-alley/art/scene/diagon-alley.webp').convert('RGBA')
board=ImageOps.fit(background,(1600,1060),Image.Resampling.LANCZOS)
board=Image.alpha_composite(board,Image.new('RGBA',board.size,(12,8,29,160)))
draw=ImageDraw.Draw(board)
serif='/System/Library/Fonts/Supplemental/Georgia.ttf'
regular=ImageFont.truetype(serif,34)
small=ImageFont.truetype(serif,21)
draw.text((800,35),'DIAGON ALLEY · ILUSTRACIÓN PINTADA',font=regular,fill='#f7e6b6',anchor='mt')
draw.text((800,84),'Muestras locales de producción · sin integración ni concesiones de juego',font=small,fill='#e3cfa0',anchor='mt')
for position,id in enumerate(['apprentice','circe','merlin']):
    x=90+position*515
    portrait=Image.open(DESIGN/'exports/character'/id/'portrait.webp').convert('RGBA').resize((420,525),Image.Resampling.LANCZOS)
    draw.rounded_rectangle((x-7,139,x+427,678),radius=18,fill='#8e6034',outline='#efd18a',width=5)
    board.alpha_composite(portrait,(x,146))
    draw.text((x+210,704),plan['samples'][id]['name'],font=regular,fill='#f7e6b6',anchor='mt')
    clean=Image.open(DESIGN/'exports/character'/id/'figure.webp').convert('RGBA')
    clean.thumbnail((175,218),Image.Resampling.LANCZOS)
    board.alpha_composite(clean,(x+28,790))
    thumb=Image.open(DESIGN/'exports/character'/id/'thumbnail.webp').convert('RGBA').resize((96,120))
    draw.rounded_rectangle((x+272,800,x+380,932),radius=20,fill='#30253b',outline='#cba970',width=3)
    board.alpha_composite(thumb,(x+278,806))
    draw.text((x+110,1018),'Arena',font=small,fill='#e3cfa0',anchor='mt')
    draw.text((x+327,950),'Rostro',font=small,fill='#e3cfa0',anchor='mt')
board.convert('RGB').save(DESIGN/'samples-in-context.jpg',quality=94)
print('CONTEXT_READY',DESIGN/'samples-in-context.jpg',flush=True)
