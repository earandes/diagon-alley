#!/usr/bin/env python3
"""Offline alpha metadata, not image generation. Uses existing Pillow, writes no artwork.
All alpha>0 pixels plus one source-pixel sampling guard are retained. Sources stay intact.
"""
import hashlib, json
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
PACKS=ROOT/'src/arcana/presentation/content-packs'
records={}
paths=set()
for pack in ('arcana','diagon-alley'):
    assets=json.loads((PACKS/pack/'assets.json').read_text())
    for key,record in assets.items():
        if key.endswith('.figure'):
            paths.add(Path(record.get('sourcePack',pack))/record['path'])
    paths.update(path.relative_to(PACKS) for path in (PACKS/pack/'art/boss-a71').glob('actor-*.webp'))
    paths.update(path.relative_to(PACKS) for path in (PACKS/pack/'art/boss-a70').glob('*.webp'))
for relative in sorted(paths):
    source=PACKS/relative
    with Image.open(source) as original:
        
        if getattr(original,'n_frames',1)!=1:continue
        image=original.convert('RGBA'); alpha=image.getchannel('A'); box=alpha.getbbox()
        if not box:continue
        x0,y0,x1,y1=box
        x0,y0=max(0,x0-1),max(0,y0-1)
        x1,y1=min(image.width,x1+1),min(image.height,y1+1)
        bands=[]
        for y in range(y0,y1,64):
            end=min(y+64,y1)
            b=alpha.crop((0,max(0,y-1),image.width,min(image.height,end+1))).getbbox()
            if not b:continue
            left,right=max(0,b[0]-1),min(image.width,b[2]+1)
            bands.append([left,y,right-left,end-y])
        if sum(b[2]*b[3] for b in bands) > .88*(x1-x0)*(y1-y0):bands=[]
        if (x0,y0,x1,y1)==(0,0,image.width,image.height) and not bands:continue
        # Independently prove that no nonzero source alpha exists outside the frame.
        outside=alpha.copy(); outside.paste(0,(x0,y0,x1,y1)); assert outside.getbbox() is None
        if bands:
            remaining=alpha.copy()
            for x,y,w,h in bands:remaining.paste(0,(x,y,x+w,y+h))
            assert remaining.getbbox() is None
        records[str(relative)]={'width':image.width,'height':image.height,'frame':[x0,y0,x1-x0,y1-y0],
            'sha256':hashlib.sha256(source.read_bytes()).hexdigest(), 'bands':bands}
target=ROOT/'src/arcana/presentation/scenes/scene-alpha.json'
target.write_text(json.dumps({'version':1,'guardPixels':1,'records':records},indent=2)+'\n')
print(f'{len(records)} source frames measured; no image bytes modified.')
