"""Technical bitmap exports: intact RGBA masters fitted/aligned on transparent canvases.
No repaint, fabricated articulation or runtime mutation. Uses an existing Pillow environment.
Attack and idle retain one scale and an authored contact anchor rather than fitting each
silhouette independently, which would shrink/grow the actor when its head moves.
"""
from pathlib import Path
from PIL import Image
import hashlib,json
ROOT=Path(__file__).resolve().parent
actors=json.loads((ROOT/'anchors.json').read_text())['actors']
roles={'portrait':(512,640,16),'figure':(342,428,12),'thumbnail':(96,120,4),'cast':(342,428,12)}
records=[]
for identity,actor in actors.items():
    idle=Image.open(ROOT/actor['idle']).convert('RGBA')
    for role,(w,h,pad) in roles.items():
        source=actor['cast'] if role=='cast' else actor['idle']
        original=Image.open(ROOT/source).convert('RGBA')
        assert original.size==idle.size, 'Recalibrate pose scale if a future master changes dimensions'
        scale=min((w-2*pad)/idle.width,(h-2*pad)/idle.height)
        size=(round(idle.width*scale),round(idle.height*scale))
        fitted=original.resize(size,Image.Resampling.LANCZOS)
        base=((w-size[0])/2,(h-size[1])/2)
        contact=actor['idleContact']
        pivot=((base[0]+contact[0]*size[0])/w,(base[1]+contact[1]*size[1])/h)
        delta=(0,0) if role!='cast' else tuple(round((a-b)*s) for a,b,s in zip(contact,actor['castContact'],size))
        offset=(round(base[0])+delta[0],round(base[1])+delta[1])
        # A shifted pose may crop only blank canvas, never its painted silhouette.
        box=fitted.getchannel('A').point(lambda a:255 if a>32 else 0).getbbox()
        assert box and offset[0]+box[0]>=0 and offset[1]+box[1]>=0 and offset[0]+box[2]<=w and offset[1]+box[3]<=h, (identity,role,box,offset)
        result=Image.new('RGBA',(w,h));result.alpha_composite(fitted,offset)
        path=ROOT/'exports'/identity/(role+'.webp');path.parent.mkdir(parents=True,exist_ok=True)
        result.save(path,'WEBP',quality=88,method=6,alpha_quality=100)
        check=Image.open(path)
        assert check.size==(w,h) and check.mode=='RGBA' and check.getchannel('A').getextrema()==(0,255)
        records.append(dict(id=f'character.{identity}.{role}',source=source,file=str(path.relative_to(ROOT)),
                            width=w,height=h,alpha=True,pivot=pivot,offset=offset,bytes=path.stat().st_size,
                            sha256=hashlib.sha256(path.read_bytes()).hexdigest(),transform='Common pose scale; intact alpha; transparent padding and contact-anchor alignment only'))
assert sum(r['bytes'] for r in records)<1000000
(ROOT/'exports-index.json').write_text(json.dumps(records,indent=2)+'\n')
print(f'{len(records)} alpha exports, {sum(r["bytes"] for r in records)} bytes; runtime unchanged')
