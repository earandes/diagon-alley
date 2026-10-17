#!/usr/bin/env python3
"""CPU-only painted cut-paper study. No inference, browser, GPU or game-state access.

The editable polygons separate one existing sleeve/forearm with its object. Small
occluded clothing areas are restored with cloned local fabric, not new anatomy.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
FRAME = (384, 512)
SAMPLES = {
    'diagon-alley': {
        'source': 'art/character-illustrated-v2/circe/figure.webp',
        'crop': [0, 0, 342, 428], 'scale': .98, 'offset': [24, 48],
        'arm': [(259,222),(284,249),(315,296),(333,350),(341,428),(156,428),(176,382),(207,312),(242,326),(254,288)],
        'restore': [(246,218),(264,262),(267,428),(145,428),(158,326),(205,291)],
        'clone': [112,218,174,428], 'armPivot': [271,250], 'origin': [216,337],
        'swing': -11,
    },
    'arcana': {
        'source': 'art/character/circe/figure.webp',
        'crop': [80,65,290,279], 'scale': 1.8, 'offset': [3,60],
        'arm': [(208,194),(221,180),(239,171),(242,149),(277,135),(286,155),(266,182),(240,189),(224,209),(212,208)],
        'restore': [(205,185),(228,183),(237,198),(218,213),(205,210)],
        'clone': [184,164,210,211], 'armPivot': [214,199], 'origin': [255,158],
        'swing': -13,
    },
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def mask(size, points):
    result = Image.new('L', (size[0]*4, size[1]*4))
    ImageDraw.Draw(result).polygon([(int(x*4),int(y*4)) for x,y in points],fill=255)
    return result.resize(size,Image.Resampling.LANCZOS)


def register(image, spec):
    crop=image.crop(tuple(spec['crop']))
    crop=crop.resize((round(crop.width*spec['scale']),round(crop.height*spec['scale'])),Image.Resampling.LANCZOS)
    frame=Image.new('RGBA',FRAME)
    frame.alpha_composite(crop,tuple(spec['offset']))
    return frame


def point(p,spec):
    return [(p[0]-spec['crop'][0])*spec['scale']+spec['offset'][0],
            (p[1]-spec['crop'][1])*spec['scale']+spec['offset'][1]]


def transform_arm(image, degrees, pivot):
    return image.rotate(degrees,Image.Resampling.BICUBIC,center=tuple(pivot))


def main():
    for pack,spec in SAMPLES.items():
        src=ROOT/'src/arcana/presentation/content-packs'/pack/spec['source']
        original=Image.open(src).convert('RGBA')
        arm_mask=mask(original.size,spec['arm'])
        arm=original.copy()
        arm.putalpha(ImageChops.multiply(original.getchannel('A'),arm_mask))
        base=original.copy()
        base.putalpha(ImageChops.multiply(original.getchannel('A'),ImageChops.invert(arm_mask)))
        # Texture repair is deliberately limited to clothing underneath the cut.
        repair_mask=ImageChops.multiply(arm_mask,mask(original.size,spec['restore']))
        fabric=original.crop(tuple(spec['clone'])).resize(original.size,Image.Resampling.BICUBIC)
        fabric.putalpha(repair_mask)
        base.alpha_composite(fabric)
        base=register(base,spec)
        arm=register(arm,spec)
        pivot=point(spec['armPivot'],spec)
        origin=point(spec['origin'],spec)
        rest=base.copy();rest.alpha_composite(arm)
        cast=base.copy();cast.alpha_composite(transform_arm(arm,spec['swing'],pivot))
        # A theatrical waist crop has a fixed baseline across limb poses.
        baseline=round(spec['offset'][1]+(spec['crop'][3]-spec['crop'][1])*spec['scale'])
        for composition in [rest,cast]:
            ImageDraw.Draw(composition).rectangle((0,baseline,FRAME[0],FRAME[1]),fill=(0,0,0,0))
        design=ROOT/'design'/pack/'boss-a71';design.mkdir(parents=True,exist_ok=True)
        runtime=ROOT/'src/arcana/presentation/content-packs'/pack/'art/boss-a71';runtime.mkdir(parents=True,exist_ok=True)
        arm_mask.save(design/'arm-mask.png')
        repair_mask.save(design/'clothing-repair-mask.png')
        files=[]
        for name,img in [('actor-base',base),('actor-arm',arm),('actor-rest',rest),('actor-cast',cast)]:
            img.save(design/f'{name}.png')
            if name=='actor-cast':
                # Pose study only; runtime samples the shared clock, not a second replay.
                continue
            img.save(runtime/f'{name}.webp',quality=95,method=6,exact=True)
            files.append({'id':name,'runtime':str((runtime/f'{name}.webp').relative_to(ROOT)),
                          'editable':str((design/f'{name}.png').relative_to(ROOT)),
                          'dimensions':list(img.size),'bytes':(runtime/f'{name}.webp').stat().st_size,
                          'rgbaBytes':img.width*img.height*4,'sha256':sha(runtime/f'{name}.webp'),
                          'encoding':'WebP quality95, method6, alpha lossless; editable PNG lossless'})
        preview=Image.new('RGB',(768,512),(20,27,35))
        preview.paste(rest,(0,0),rest);preview.paste(cast,(384,0),cast)
        d=ImageDraw.Draw(preview);d.text((12,490),'REST - CPU composition',fill='#f1dfba');d.text((396,490),'CAST - CPU composition',fill='#f1dfba')
        preview.save(design/'selected-composites.png')
        decoded=Image.open(runtime/'actor-rest.webp').convert('RGBA')
        assert ImageChops.difference(rest.getchannel('A'),decoded.getchannel('A')).getbbox() is None
        comparison=Image.new('RGB',(768,512),(20,27,35))
        comparison.paste(rest,(0,0),rest);comparison.paste(decoded,(384,0),decoded)
        d=ImageDraw.Draw(comparison)
        d.text((12,490),'SOURCE PNG',fill='#f1dfba')
        d.text((396,490),'RUNTIME WEBP QUALITY 95',fill='#f1dfba')
        comparison.save(design/'compression-comparison.png')
        manifest={'id':f'a71-circe-{pack}','version':1,'identityId':'circe','pack':pack,
                  'source':str(src.relative_to(ROOT)),'sourceSha256':sha(src),'frame':list(FRAME),
                  'production':'CPU Pillow: hand-authored cut-paper masks, local cloned clothing restoration, registered upper-body crop. No inference or articulated skeleton.',
                  'editableScript':'tools/visual/export-boss-a71.py','sourceCoordinates':spec,
                  'armPivot':pivot,'origin':origin,'pivot':[.5,.9],'baseline':baseline,
                  'license':'Derivative of existing project A58 / ARCANA v1 sources. No additional distribution rights. Script/masks authored for this project.',
                  'fallback':'actor-rest then unchanged character figure; failed layers never block replay/actions.',
                  'files':files,'totalRuntimeBytes':sum(f['bytes'] for f in files),
                  'runtimeLayerRgbaBytes':2*FRAME[0]*FRAME[1]*4,
                  'preview':'Selected CPU composites, not game screenshot or animation proof.'}
        (design/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
        print(pack,manifest['totalRuntimeBytes'],pivot,origin)


if __name__=='__main__':main()
