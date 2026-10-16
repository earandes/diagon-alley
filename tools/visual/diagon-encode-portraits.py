"""Pre-render SVG illustrations to inexpensive runtime rasters; preserve sources."""
from pathlib import Path
import json
import hashlib
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
DESIGN=ROOT/'design/diagon-alley'
ART=ROOT/'src/arcana/presentation/content-packs/diagon-alley/art'
index=json.loads((DESIGN/'character-assets-index.json').read_text())
report=[]
for key, entry in index.items():
    _, id, kind=key.split('.')
    target=ART/'character'/id/(kind+'.webp')
    target.parent.mkdir(parents=True,exist_ok=True)
    with Image.open(DESIGN/'sources/portrait-renders'/(id+'.png')) as im:
        im.thumbnail({'figure':(342,428),'portrait':(512,640),'thumbnail':(96,120)}[kind],Image.Resampling.LANCZOS)
        im.save(target,'WEBP',quality=89 if kind!='thumbnail' else 84,method=6)
        entry.update(path='art/character/'+id+'/'+kind+'.webp',width=im.width,height=im.height)
        report.append({'id':key,**entry,'source':'art/character/'+id+'.svg','bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()})
(DESIGN/'character-assets-index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n')
(DESIGN/'portrait-runtime-manifest.json').write_text(json.dumps({'assets':report,'cashCost':0,'tool':'Local Chromium SVG raster + Pillow encode, no new model generation'},ensure_ascii=False,indent=2)+'\n')
print('Runtime portraits',len(index),'roles;',sum(x['bytes'] for x in report),'bytes; SVG sources preserved.')
