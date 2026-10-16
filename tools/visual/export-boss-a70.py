#!/usr/bin/env python3
"""CPU-only A70 prop derivation. Requires the existing project Pillow environment.
No inference, Blender, browser, network, account or game-state access.
"""
from __future__ import annotations
import base64
import hashlib
import io
import json
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
SCALE = 4


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def polygon_mask(size, points):
    mask = Image.new('L', (size[0] * SCALE, size[1] * SCALE))
    ImageDraw.Draw(mask).polygon([(x*SCALE, y*SCALE) for x,y in points], fill=255)
    return mask.resize(size, Image.Resampling.LANCZOS)


def save_layer(pack, name, image, svg, rect, pivot, motion, source):
    design = ROOT / 'design' / pack / 'boss-a70'
    runtime = ROOT / 'src/arcana/presentation/content-packs' / pack / 'art/boss-a70'
    design.mkdir(parents=True, exist_ok=True)
    runtime.mkdir(parents=True, exist_ok=True)
    (design / f'{name}.svg').write_text(svg)
    image.save(design / f'{name}.png')
    image.save(runtime / f'{name}.webp', lossless=True, method=6)
    return {
        'id': name, 'motion': motion, 'source': source,
        'editable': str((design / f'{name}.svg').relative_to(ROOT)),
        'runtime': str((runtime / f'{name}.webp').relative_to(ROOT)),
        'rectPixels': rect, 'pivot': pivot, 'dimensions': list(image.size),
        'bytes': (runtime/f'{name}.webp').stat().st_size,
        'rgbaBytes': image.width*image.height*4,
        'sha256': sha(runtime/f'{name}.webp'),
    }


def textured_svg(image, points):
    data = io.BytesIO(); image.save(data, format='PNG')
    embedded = base64.b64encode(data.getvalue()).decode()
    coords = ' '.join(f'{x},{y}' for x,y in points)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{image.width}" height="{image.height}" viewBox="0 0 {image.width} {image.height}"><defs><clipPath id="piece"><polygon points="{coords}"/></clipPath></defs><image width="{image.width}" height="{image.height}" href="data:image/png;base64,{embedded}" clip-path="url(#piece)"/></svg>\n'''


def book():
    pack='diagon-alley'
    source=ROOT/'src/arcana/presentation/content-packs/diagon-alley/art/character-illustrated-v2/circe/figure.webp'
    figure=Image.open(source).convert('RGBA')
    # Only the visible front cover: no arm, sleeve, skin or fabricated anatomy.
    rect=[170,316,96,109]
    crop=figure.crop((170,316,266,425))
    points=[(45,2),(87,17),(94,25),(91,56),(77,65),(65,69),(56,82),(39,85),(24,92),(13,99),(0,108),(6,92)]
    cover=crop.copy(); cover.putalpha(polygon_mask(crop.size,points))
    layers=[]
    # Pages use the same cover registration and stay hidden behind the front cover at rest.
    page=Image.new('RGBA',(96*SCALE,109*SCALE))
    draw=ImageDraw.Draw(page)
    page_points=[(42,2),(91,20),(90,56),(74,66),(55,82),(0,106),(8,85)]
    for j in range(7):
        shifted=[((x-j*.65)*SCALE,(y-j*.2)*SCALE) for x,y in page_points]
        draw.polygon(shifted,fill=(222+j*3,201+j*3,156+j*3,255))
    for j in range(5):
        draw.line([(int((42-j*.8)*SCALE),int((6+j*1.3)*SCALE)),(int((87-j*.5)*SCALE),int((22+j*1.3)*SCALE))],fill=(139,111,73,170),width=1*SCALE)
    page=page.resize((96,109),Image.Resampling.LANCZOS)
    page_svg='''<svg xmlns="http://www.w3.org/2000/svg" width="96" height="109" viewBox="0 0 96 109"><defs><linearGradient id="paper" x2=".9" y2="1"><stop stop-color="#efe3bf"/><stop offset="1" stop-color="#bda675"/></linearGradient></defs><path d="M42 2 91 20 90 56 74 66 55 82 0 106 8 85Z" fill="url(#paper)" stroke="#a28b5f" stroke-width=".7"/><g fill="none" stroke="#8b6f49" stroke-width=".6" opacity=".7"><path d="m40 7 46 17M39 10 46 17M37 13 46 17M35 16 46 17"/></g></svg>\n'''
    layers.append(save_layer(pack,'book-pages',page,page_svg,rect,[.43,.04],'book-pages',str(source.relative_to(ROOT))))
    layers.append(save_layer(pack,'book-cover',cover,textured_svg(crop,points),rect,[.43,.04],'book-cover',str(source.relative_to(ROOT))))
    return figure, layers, [211/342,321/428],source


def bowl():
    pack='arcana'
    source=ROOT/'src/arcana/presentation/content-packs/arcana/art/character/circe/figure.webp'
    figure=Image.open(source).convert('RGBA')
    rect=[234,158,43,19]
    image=Image.new('RGBA',(43*SCALE,19*SCALE)); draw=ImageDraw.Draw(image)
    # Small translucent surface ribbons: not a new potion, status or spell type.
    for box,color,width in [((3,3,39,14),(223,187,111,145),1.1),((8,5,34,12),(245,223,169,150),.75),((13,7,30,10),(176,212,185,95),.6)]:
        draw.arc(tuple(round(v*SCALE) for v in box),185,345,fill=color,width=max(1,round(width*SCALE)))
    content=image.resize((43,19),Image.Resampling.LANCZOS)
    svg='''<svg xmlns="http://www.w3.org/2000/svg" width="43" height="19" viewBox="0 0 43 19"><g fill="none" stroke-linecap="round"><path d="M4 9Q21 1 38 9" stroke="#dfbb6f" stroke-opacity=".57" stroke-width="1.1"/><path d="M9 9Q21 4 33 9" stroke="#f5dfa9" stroke-opacity=".59" stroke-width=".75"/><path d="M14 9Q21 6 29 9" stroke="#b0d4b9" stroke-opacity=".37" stroke-width=".6"/></g></svg>\n'''
    layers=[save_layer(pack,'bowl-contents',content,svg,rect,[.5,.55],'bowl-contents',str(source.relative_to(ROOT)))]
    rect_rim=[237,162,38,8]
    crop=figure.crop((237,162,275,170))
    points=[(1,3),(36,0),(37,3),(3,7)]
    rim=crop.copy(); rim.putalpha(polygon_mask(crop.size,points))
    layers.append(save_layer(pack,'bowl-rim',rim,textured_svg(crop,points),rect_rim,[.5,.55],'bowl-rim',str(source.relative_to(ROOT))))
    return figure,layers,[255/342,160/512],source


def preview(pack,figure,layers):
    # Three selected CPU composites, not browser/renderer captures or proof of movement.
    sheet=Image.new('RGB',(figure.width*3,figure.height),(22,29,40))
    for index,label in enumerate(['rest','anticipation','release']):
        canvas=Image.new('RGBA',figure.size);canvas.alpha_composite(figure)
        for item in layers:
            layer=Image.open(ROOT/item['runtime']).convert('RGBA')
            x,y,_,_=item['rectPixels']
            if item['motion']=='book-pages':
                if index==0: continue
                canvas.alpha_composite(layer,(x,y))
            elif item['motion']=='book-cover':
                if index:
                    # Preview around local pivot with transparent registration margin.
                    pad=Image.new('RGBA',(layer.width*3,layer.height*3))
                    pad.alpha_composite(layer,(layer.width,layer.height))
                    rotated=pad.rotate(-1*index,Image.Resampling.BICUBIC,center=(layer.width+item['pivot'][0]*layer.width,layer.height+item['pivot'][1]*layer.height))
                    canvas.alpha_composite(rotated,(x-layer.width,y-layer.height))
                else: canvas.alpha_composite(layer,(x,y))
            elif item['motion']=='bowl-contents':
                if index: canvas.alpha_composite(layer,(x,y-index))
            else:
                canvas.alpha_composite(layer,(x,y))
        sheet.paste(canvas,(figure.width*index,0),canvas)
        ImageDraw.Draw(sheet).text((figure.width*index+8,figure.height-18),label,fill=(242,224,180))
    sheet.save(ROOT/'design'/pack/'boss-a70'/'selected-composites.png')


def main():
    for pack,fn in [('diagon-alley',book),('arcana',bowl)]:
        figure,layers,origin,source=fn()
        manifest={
            'id':f'a70-circe-{pack}','version':1,'identityId':'circe','pack':pack,
            'sourceFigure':str(source.relative_to(ROOT)),'sourceSha256':sha(source),
            'figureSize':list(figure.size),'origin':origin,'layers':layers,
            'production':'CPU Pillow derivation, crop/mask plus original vector-like paper/ripple paths; no inference or GPU',
            'scope':'Object articulation only. Existing body, face, anatomy and base figure unchanged.',
            'provenance':'Existing A58 Diagon master and ARCANA production-v1 master; source manifests retained. New paths authored for this project.',
            'rights':'Existing provenance is not a Harry Potter distribution licence. Private technical sample; no publication authorised.',
            'fallback':'Original figure and generic confirmed BattleLog projectile; no new rule or item.',
            'totalRuntimeBytes':sum(x['bytes'] for x in layers),'totalRgbaBytes':sum(x['rgbaBytes'] for x in layers),
            'preview':'selected-composites.png: selected CPU composites only, not screenshots or timing evidence',
        }
        (ROOT/'design'/pack/'boss-a70'/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
        preview(pack,figure,layers)
        print(pack,manifest['totalRuntimeBytes'],manifest['totalRgbaBytes'])

if __name__=='__main__': main()
