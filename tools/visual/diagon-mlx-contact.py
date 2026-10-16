"""CPU-only review sheets from generated sources or prepared role exports."""
import argparse
import json
import math
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[2]
DESIGN=ROOT/'design/diagon-alley/illustrated-v2'
parser=argparse.ArgumentParser()
parser.add_argument('--ids',nargs='*')
parser.add_argument('--source',choices=['samples','masters','portraits','figures','thumbnails'],default='samples')
parser.add_argument('--name',default='production-contact')
args=parser.parse_args()
plan=json.loads((DESIGN/'production-plan.json').read_text())
ids=args.ids or [id for id in plan['samples'] if (DESIGN/'samples'/(id+'.png')).exists()]
columns=3 if len(ids)<=9 else 6
cellw=420 if columns==3 else 250
cellh=560 if columns==3 else 356
board=Image.new('RGB',(columns*cellw,math.ceil(len(ids)/columns)*cellh),'#211a2b')
draw=ImageDraw.Draw(board)
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Georgia.ttf',20 if columns==3 else 16)
for position,id in enumerate(ids):
    x=position%columns*cellw;y=position//columns*cellh
    if args.source in ['portraits','figures','thumbnails']:
        filename={'portraits':'portrait.webp','figures':'figure.webp','thumbnails':'thumbnail.webp'}[args.source]
        path=DESIGN/'exports/character'/id/filename
    else:path=DESIGN/args.source/(id+'.png')
    if not path.exists():continue
    im=Image.open(path).convert('RGBA')
    im.thumbnail((cellw-24,cellh-55),Image.Resampling.LANCZOS)
    backdrop=Image.new('RGBA',im.size,'#484455')
    backdrop=Image.alpha_composite(backdrop,im)
    board.paste(backdrop.convert('RGB'),(x+(cellw-im.width)//2,y+10))
    draw.text((x+cellw//2,y+cellh-34),plan['samples'][id]['name'],font=font,fill='#f2d79d',anchor='mt')
out=DESIGN/(args.name+'.jpg')
board.save(out,quality=96)
print('CONTACT_READY',out,len(ids),args.source)
