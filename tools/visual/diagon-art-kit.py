"""Local asset kit: existing private raster + newly authored SVG, no paid API.

Use bundled Python with Pillow. Existing images remain intact; exports are resized
and encoded. Vector props, masks and effects are reproducible and text-free.
"""
from pathlib import Path
import hashlib
import json
import math
import random
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
ART = ROOT / 'src/arcana/presentation/content-packs/diagon-alley/art'
DESIGN = ROOT / 'design/diagon-alley'
entries = {}
provenance = []

def register(key, relative, width, height, alpha=True, pivot=(.5, .5), es='', en='', source=''):
    entries[key] = {'path': 'art/'+relative, 'width': width, 'height': height,
                    'alpha': alpha, 'pivot': list(pivot), 'alt': {'es': es, 'en': en}}
    file = ART / relative
    provenance.append({'id': key, **entries[key], 'bytes': file.stat().st_size,
                       'sha256': hashlib.sha256(file.read_bytes()).hexdigest(),
                       'source': source or 'tools/visual/diagon-art-kit.py',
                       'tool': 'Local Python/Pillow encode or authored SVG',
                       'permission': 'Private project use. Franchise distribution permission unresolved.',
                       'status': 'local-production-private-prototype', 'version': 1})

def encode(key, relative, source, maximum, es, en, pivot=(.5,.5)):
    path = ART / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(ROOT/source) as im:
        im.thumbnail(maximum, Image.Resampling.LANCZOS)
        alpha = 'A' in im.getbands() and im.getextrema()[-1][0] < 255
        im.save(path, 'WEBP', quality=86, method=6)
        register(key, relative, *im.size, alpha, pivot, es, en, source)

def crop_export(key, relative, source, box, es, en):
    path = ART / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(ROOT/source) as im:
        cropped = im.crop(box)
        cropped.save(path,'WEBP',quality=90,method=6)
        register(key,relative,*cropped.size,False,(.5,.5),es,en,source)
        provenance[-1]['crop'] = list(box)

DEFS = '''<defs>
<linearGradient id="gold" x2=".8" y2="1"><stop stop-color="#fff1ae"/><stop offset=".3" stop-color="#e9be64"/><stop offset=".7" stop-color="#986023"/><stop offset="1" stop-color="#f0ce7b"/></linearGradient>
<linearGradient id="plum" x2=".75" y2="1"><stop stop-color="#6d3778"/><stop offset=".5" stop-color="#392047"/><stop offset="1" stop-color="#1b1428"/></linearGradient>
<linearGradient id="paper" x2=".7" y2="1"><stop stop-color="#faecc7"/><stop offset=".6" stop-color="#d8b67b"/><stop offset="1" stop-color="#94734e"/></linearGradient>
<radialGradient id="glow"><stop stop-color="#fff8c1" stop-opacity=".9"/><stop offset=".25" stop-color="#e5b2ff" stop-opacity=".4"/><stop offset="1" stop-color="#a663db" stop-opacity="0"/></radialGradient>
<filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity=".5"/></filter>
</defs>'''

def star(x, y, r=12, color='url(#gold)', points=4):
    values=[]
    for i in range(points*2):
        a=-math.pi/2+i*math.pi/points
        d=r if i%2==0 else r*.25
        values.append(f'{x+math.cos(a)*d:.1f},{y+math.sin(a)*d:.1f}')
    return '<polygon points="'+' '.join(values)+f'" fill="{color}"/>'

def svg(key, relative, content, es, en, width=512, height=512, pivot=(.5,.5)):
    path = ART / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">{DEFS}{content}</svg>')
    register(key, relative, width, height, True, pivot, es, en)

encode('scene.boulevard', 'scene/diagon-alley.webp', 'design/assets/preparation-v1/callejon-background-v1.png', (1536,1024), 'Callejón Diagón ilustrado al anochecer', 'Illustrated Diagon Alley at dusk')
encode('scene.confectionery', 'scene/sweetshop.webp', 'src/arcana/presentation/content-packs/arcana/art/scene/confectionery.webp', (1280,854), 'Mostrador de dulces y frascos iluminados', 'Illuminated sweet counter and jars')
encode('toad.box', 'frog/closed.webp', 'design/assets/preparation-v1/frog-box-closed-v1.png', (768,768), 'Caja pentagonal de rana de chocolate', 'Pentagonal Chocolate Frog box', (.5,.85))
encode('toad.subject', 'frog/chocolate-frog.webp', 'design/assets/preparation-v1/chocolate-frog-v1.png', (1024,683), 'Rana de chocolate', 'Chocolate Frog', (.5,.85))
encode('beans.jar', 'props/beans-jar.webp', 'src/arcana/presentation/content-packs/arcana/art/beans/jar.webp', (512,512), 'Tarro de grageas de todos los sabores', 'Every Flavour Beans jar', (.5,.9))
crop_export('character.dumbledore.historical','character/dumbledore-historical.webp','design/concepts/weasley-flow-v1/03-wizard-card-revealed-es.png',(278,459,589,873),'Ilustración histórica de Albus Dumbledore','Historical Albus Dumbledore illustration')

# Playful illustrated atlas: the whole object is a map, with vellum folds and streets.
map_body = '''<g filter="url(#shadow)" transform="rotate(-7 256 256)">
<path d="M67 103 194 72 324 109 448 75 448 395 326 431 195 395 67 428Z" fill="url(#paper)" stroke="#754f2d" stroke-width="9"/>
<path d="M194 76V393M326 112V427" fill="none" stroke="#956e45" stroke-width="3" opacity=".7"/>
<path d="M106 341Q124 239 191 251T280 227 397 141M109 199 192 216 262 173 375 215M259 175 272 351 386 355" fill="none" stroke="#8d6742" stroke-width="26" opacity=".36"/>
<path d="M106 341Q124 239 191 251T280 227 397 141" fill="none" stroke="#665038" stroke-width="4" stroke-dasharray="4 11"/>
<g fill="#8c6446" stroke="#5e422f" stroke-width="3">
<path d="m106 157 19-25 20 28v43h-39zM157 297l16-21 22 19v39h-38zM298 142l17-24 23 27v39h-40zM347 273l20-29 24 27v51h-44z"/>
</g><g fill="#f4d682"><path d="M118 166h14v23h-14zM310 153h15v22h-15zM362 280h14v23h-14z"/></g>
<circle cx="107" cy="341" r="14" fill="#913e41" stroke="#edc77a" stroke-width="4"/>
<circle cx="280" cy="227" r="14" fill="#913e41" stroke="#edc77a" stroke-width="4"/>
'''+star(399,138,27)+'''</g><g transform="translate(344 345)"><circle r="62" fill="url(#plum)" stroke="url(#gold)" stroke-width="8"/>'''+star(0,0,45, points=8)+'''<circle r="12" fill="#f5d783"/></g>'''
svg('ui.map','props/map.svg',map_body,'Explorar el mapa','Explore map')

# Album, individual paper/card, and party miniatures share the same gold tooling.
book = '''<g filter="url(#shadow)"><path d="M91 89Q166 64 255 106 348 65 425 88V400Q346 378 256 421 168 378 91 401Z" fill="#38203c" stroke="url(#gold)" stroke-width="11"/>
<path d="M106 104Q173 86 248 121V399Q176 368 106 383ZM264 121Q341 85 409 105V383Q337 369 264 400Z" fill="url(#paper)" stroke="#ad8750" stroke-width="3"/>
<path d="M255 110V413" stroke="#6c462c" stroke-width="10"/>
<g fill="url(#plum)" stroke="url(#gold)" stroke-width="4"><rect x="129" y="144" width="91" height="120" rx="8"/><rect x="288" y="144" width="91" height="120" rx="8"/><rect x="129" y="283" width="91" height="66" rx="6"/><rect x="288" y="283" width="91" height="66" rx="6"/></g>
<circle cx="175" cy="184" r="20" fill="#bd8d61"/><path d="M146 247q0-53 29-51 29 0 29 51" fill="#d1b98a"/>
<path d="m334 159 27 52h-54z" fill="#baa0cc"/><path d="M310 245q3-47 25-45 22-2 25 45" fill="#baa0cc"/>
'''+star(174,316,22)+star(333,316,22)+'''</g>'''
svg('ui.collection','props/album.svg',book,'Álbum de cromos de magos','Wizard card album')

party = '''<g filter="url(#shadow)"><ellipse cx="256" cy="408" rx="181" ry="43" fill="#1c1427" stroke="url(#gold)" stroke-width="8"/>
<path d="M85 381q11-117 72-116 59 0 71 116M285 381q10-117 71-116 60 0 72 116" fill="#44364d" stroke="url(#gold)" stroke-width="5"/>
<circle cx="157" cy="232" r="38" fill="#b77f54"/><circle cx="356" cy="232" r="38" fill="#bf9672"/>
<path d="m99 217 59-102 56 102zm201 0 55-102 59 102z" fill="#643777" stroke="url(#gold)" stroke-width="4"/>
<path d="M169 393q6-161 87-154 79-6 86 154" fill="url(#plum)" stroke="url(#gold)" stroke-width="6"/>
<circle cx="256" cy="204" r="47" fill="#d0a078"/><path d="M205 184q-2-81 52-81 62 1 52 81l-21-25-63 10z" fill="#34222b"/>
<path d="m312 326 87-139" stroke="#795034" stroke-width="15" stroke-linecap="round"/>
'''+star(402,182,31)+'''</g>'''
svg('ui.team','props/team.svg',party,'Preparar equipo','Prepare party')

market = '''<g filter="url(#shadow)"><path d="M97 198h318v224H97Z" fill="url(#plum)" stroke="url(#gold)" stroke-width="8"/>
<path d="m76 199 56-107h248l56 107Z" fill="#e6c286" stroke="url(#gold)" stroke-width="8"/>
<path d="m137 94-25 105h63l11-105zm102 0v105h62l-12-105zm101 0 28 105h64L378 94Z" fill="#643263"/>
<path d="M90 199q20 42 45 0 25 42 50 0 25 42 50 0 25 42 50 0 25 42 50 0 25 42 50 0 25 42 45 0" fill="#4c2a57" stroke="#e0b767" stroke-width="6"/>
<rect x="135" y="257" width="111" height="115" rx="12" fill="#151725" stroke="#ba8b47" stroke-width="6"/>
<path d="M289 417V270q0-35 33-35 35 0 35 35v147" fill="#392031" stroke="#b68b51" stroke-width="6"/>
<circle cx="336" cy="333" r="6" fill="#f6d58d"/>
'''+star(190,312,43)+'''</g>'''
svg('ui.market','props/sweetshop.svg',market,'Dulcería','Sweetshop')
entries['ui.shop'] = entries['ui.market']

settings = '''<g filter="url(#shadow)"><path d="m209 65 95 1 12 52 39 23 50-14 47 83-38 35v46l38 34-48 82-50-13-39 24-12 50h-95l-13-51-39-23-50 13-47-82 38-35v-45l-38-34 48-83 49 13 39-23Z" fill="url(#gold)" stroke="#704322" stroke-width="9"/>
<circle cx="256" cy="267" r="116" fill="url(#plum)" stroke="#eacb8e" stroke-width="8"/>
<circle cx="256" cy="267" r="74" fill="#171829" stroke="#b58b4f" stroke-width="5"/>
'''+star(256,267,57,points=8)+'''<circle cx="256" cy="267" r="17" fill="#362039" stroke="#f1cf87" stroke-width="4"/></g>'''
svg('ui.settings','props/settings.svg',settings,'Ajustes','Settings')

letter = '''<g filter="url(#shadow)"><path d="M82 140 252 52 431 139V414H82Z" fill="#9b6b39" stroke="url(#gold)" stroke-width="8"/>
<path d="M112 96h285v260H112Z" fill="url(#paper)" stroke="#c39859" stroke-width="7"/>
<path d="M83 165 256 290 431 165V415H83Z" fill="url(#paper)" stroke="#9d713d" stroke-width="6"/>
<path d="m86 411 142-135m198 135L286 276" fill="none" stroke="#b78d54" stroke-width="5"/>
<circle cx="256" cy="293" r="47" fill="#71394e" stroke="url(#gold)" stroke-width="5"/>
'''+star(256,293,29,points=8)+'''</g>'''
svg('ui.missions','props/letter.svg',letter,'Encargos y regiones','Quests and regions')

lantern='''<g filter="url(#shadow)"><path d="M255 20v64m-37 7q0-48 38-48 38 0 38 48" fill="none" stroke="url(#gold)" stroke-width="15"/>
<path d="m151 149 105-64 105 64-19 241-86 51-87-51Z" fill="#352639" stroke="url(#gold)" stroke-width="12"/>
<path d="m180 174 67-32v240l-52-24zm82-32 71 32-15 184-56 24Z" fill="#e6b560" fill-opacity=".73" stroke="#6f4634" stroke-width="5"/>
<path d="m151 149 105 43 105-43m-105 43v249M178 400l78 43 78-43" fill="none" stroke="url(#gold)" stroke-width="9"/>
<path d="M249 325q-42-44 0-96-2 36 21 45 11-23 6-44 50 60-7 98Z" fill="#ffe7aa"/>
<path d="m218 438 38 36 39-36" fill="url(#gold)"/></g>'''
svg('prop.lantern','props/lantern.svg',lantern,'Farol del Callejón','Alley lantern',pivot=(.5,.07))
bag='''<g filter="url(#shadow)"><path d="m132 56 47 20 75-18 74 17 52-19-27 404-96 28-100-28Z" fill="url(#paper)" stroke="#795034" stroke-width="7"/>
<path d="m170 71 26 395 30 11-5-411zm84-11 4 425 35-10-2-407zm70 15-10 391 28-5 20-399z" fill="#a24743"/>
<path d="m142 147 230-1-10 236-210-1Z" fill="#e4c785" stroke="url(#gold)" stroke-width="6"/>
<ellipse cx="256" cy="260" rx="83" ry="95" fill="#563a44" stroke="url(#gold)" stroke-width="6"/>
<g stroke="#50342c" stroke-width="3"><path d="M220 214q-26-6-22 22 2 30 25 14 20-12-3-36" fill="#b96343"/><path d="M278 213q-24-10-26 14-6 29 20 21 27-8 6-35" fill="#79956a"/><path d="M229 268q-27-5-23 21 4 29 28 15 21-13-5-36" fill="#dfc594"/><path d="M282 268q-29-6-26 23 1 27 25 12 20-14 1-35" fill="#b789ab"/></g>
'''+star(256,169,17)+'''</g>'''
svg('beans.packet','props/beans-packet.svg',bag,'Bolsa de grageas de todos los sabores','Every Flavour Beans packet',pivot=(.5,.9))

# Transparent, bounded effects for a finite timeline, never ambient infinite loops.
random.seed(57)
sparkles = ''.join(star(random.randint(45,467),random.randint(30,482),random.randint(3,14),'#ffdf8c') for _ in range(32))
svg('fx.sparkles','fx/sparkles.svg',sparkles,'Destellos dorados decorativos','Decorative golden sparkles')
svg('fx.halo','fx/halo.svg','<circle cx="256" cy="256" r="245" fill="url(#glow)"/>','Halo mágico decorativo','Decorative magical halo')
entries['fx.portal'] = entries['fx.halo']
svg('fx.ring','fx/ring.svg','<ellipse cx="256" cy="256" rx="218" ry="151" fill="none" stroke="url(#gold)" stroke-width="5"/><ellipse cx="256" cy="256" rx="231" ry="164" fill="none" stroke="#b6a0dc" stroke-width="2" stroke-dasharray="3 19"/>'+''.join(star(256+218*math.cos(i*math.tau/8),256+151*math.sin(i*math.tau/8),12) for i in range(8)),'Anillo mágico decorativo','Decorative magical ring')
svg('fx.shadow','fx/shadow.svg','<defs><radialGradient id="shade"><stop stop-color="#05020d" stop-opacity=".8"/><stop offset="1" stop-color="#05020d" stop-opacity="0"/></radialGradient></defs><ellipse cx="256" cy="330" rx="230" ry="80" fill="url(#shade)"/>','Sombra decorativa de rana','Decorative frog shadow',pivot=(.5,.65))
svg('fx.spell-trail','fx/spell-trail.svg','<path d="M55 440C433 424 438 245 279 286S78 134 433 61" fill="none" stroke="#e5bf78" stroke-width="8" stroke-linecap="round"/><path d="M57 449C427 436 449 245 281 282S73 127 433 56" fill="none" stroke="#fff0c3" stroke-width="2"/>'+star(433,61,27),'Estela de hechizo decorativa','Decorative spell trail')

back = '''<path d="M36 22 256 4 476 22 497 604 256 636 15 604Z" fill="url(#plum)" stroke="url(#gold)" stroke-width="12"/>
<path d="M57 47 256 28 455 47 474 583 256 611 38 583Z" fill="none" stroke="#b4894a" stroke-width="3"/>
<ellipse cx="256" cy="320" rx="165" ry="236" fill="none" stroke="url(#gold)" stroke-width="5"/>
'''+star(256,320,128,points=8)+''.join(star(256+155*math.cos(i*math.tau/10),320+221*math.sin(i*math.tau/10),18,points=6) for i in range(10))
svg('card.back','card/back.svg',back,'Reverso de cromo mágico','Wizard card back',512,640)
frame = '''<path d="M35 22 256 4 477 22 497 604 256 636 15 604Z M66 64 446 64 461 566 256 598 51 566Z" fill="url(#gold)" fill-rule="evenodd"/>
<path d="M45 35 256 16 467 35 483 595 256 623 29 595Z" fill="none" stroke="#5d3f31" stroke-width="6"/>
<path d="M72 75 440 75 454 553 256 584 58 553Z" fill="none" stroke="#fce8ad" stroke-width="4"/>
'''+''.join(star(x,y,21,points=8) for x,y in [(61,65),(451,65),(51,566),(461,566)])
svg('card.frame','card/frame.svg',frame,'Marco de cromo mágico','Wizard card frame',512,640)

# Optional Blender props exported on the exact same camera/canvas for alignment.
for part in ['closed','base','lid','interior','seal']:
    source = f'design/diagon-alley/sources/frog-box/{part}.png'
    if (ROOT/source).exists():
        key = 'toad.box' if part == 'closed' else 'toad.'+part
        relative = 'frog/model-'+part+'.webp' if part == 'closed' else 'frog/'+part+'.webp'
        encode(key,relative,source,(768,768),'Pieza pentagonal de rana: '+part,'Pentagonal frog box part: '+part,(.5,.72 if part != 'lid' else .49))

(DESIGN/'assets-index.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n')
(DESIGN/'manifest.json').write_text(json.dumps({'version':1,'date':'2026-10-15','cashCost':0,
    'direction':'Callejón de maravillas — violet velvet, amber windows, gold foil, tactile paper',
    'sourcePolicy':'Reuse existing private concept art; local authoring and Blender; no new imagegen calls.',
    'license':'Authored code/SVG under repository terms. Historical AI concept rasters retain their original provenance. Franchise distribution permission is unresolved.',
    'functionalText':'None embedded. Localized names, costs and errors remain DOM.',
    'rigging':'Box is real separate geometry in blend. Frog is a flat raster cutout, no articulation.',
    'assets':provenance},ensure_ascii=False,indent=2)+'\n')
print('DIAGON_ART_KIT',len(entries),'assets',sum(x['bytes'] for x in provenance),'bytes')
