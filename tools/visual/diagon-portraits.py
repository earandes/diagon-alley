"""Book-inspired, locally authored character illustrations with editable SVG.

The artwork depicts distinguishing book traits, not actors or traced photos.
This is a coherent provisional illustration family, not final painted art.
"""
import json
import math
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
ART=ROOT/'src/arcana/presentation/content-packs/diagon-alley/art/character'
DESIGN=ROOT/'design/diagon-alley'
characters=json.loads((ROOT/'src/arcana/presentation/content-packs/diagon-alley/characters.json').read_text())
# hair, robe, accent, hair silhouette, distinguishing features, skin.
CONFIG={
'apprentice':('#261c24','#292535','#9e3d45','messy','glasses scar scarf','#d9a67c'),
'merlin':('#e7dfcd','#4c335d','#e4bc74','long','beard glasses hat old','#d2aa8d'),
'morgana':('#514a43','#193e36','#c0a06e','bun','glasses hat old','#cfa88a'),
'flamel':('#ded0b5','#665542','#d4b476','short','beard glasses old flask','#c9a689'),
'paracelso':('#14151e','#20222d','#b7a5a1','long','nose','#d3c7b4'),
'circe':('#613c2d','#34303e','#a74841','curly','book scarf','#d7a37b'),
'ember-keeper':('#bd6031','#39313b','#ac4340','messy','freckles scarf','#e0af88'),
'mist-seer':('#e6ce8b','#52637b','#a0bccf','long','radish','#ecd1ac'),
'rune-weaver':('#b95a2b','#38333e','#a94640','long','freckles scarf','#e0b08b'),
'copper-sage':('#aa6239','#6a5d3e','#bc9958','receding','glasses old','#d4ab86'),
'moon-herbalist':('#806c43','#656640','#b9aa5d','curly','hat old plant','#dbb791'),
'ash-wanderer':('#85634a','#63584b','#b5a283','short','scars moustache','#c8a180'),
'shadow-scribe':('#332c29','#383a41','#b2a496','long','moustache beardshort','#c5a389'),
'storm-caller':('#ad4b83','#3c3648','#c69fc0','spiky','earring','#d6aa87'),
'dew-alchemist':('#725039','#383c3e','#ad4946','short','scarf plant','#dbb28d'),
'dawn-oracle':('#967149','#6c4a58','#c7a570','curly','glasses shawl','#cba480'),
'crystal-watch':('#394453','#4c5363','#b4cad3','short','glasses beardshort old','#c5aa91'),
'night-forger':('#3c2b26','#715044','#b89766','huge','beard giant','#c49670'),
'moss-guardian':('#aa5a36','#754d47','#b99a65','curly','old','#dbaf8a'),
'comet-scholar':('#22222a','#33415c','#9daec6','long','scarf','#ca9a75'),
'cinder-dancer':('#c66b36','#574452','#d1a35e','messy','freckles','#dfad81'),
'wind-reader':('#ba5c2e','#5c4b42','#c89a63','short','freckles','#dfad81'),
'star-binder':('#70513b','#333840','#c6a75a','short','scarf','#d8ae8a'),
'root-speaker':('#8d8372','#4a5047','#a6a16b','messy','eye scars old','#bd9979'),
'obsidian-seer':('#25212a','#302834','#a18b9f','curly','pale','#d0bba8'),
'silver-sentinel':('#29222a','#2c3b5d','#c8ad73','bald','earring','#8e5c43'),
'sun-priestess':('#e6d4a3','#6783a2','#bdd1df','long','hatblue','#ead2ad'),
'echo-mage':('#e1cf9c','#303e3c','#8bb69b','slick','scarf','#e3c7a3'),
'veil-walker':('#c9c4b1','#172e2d','#8baaa1','bald','noseless pale','#c5c8b5'),
'aurora-sage':('#9b663c','#42616a','#c7a26b','messy','case','#d7ae8b'),
}

def illustration(id):
    hair,robe,accent,style,features,skin=CONFIG[id]
    features=set(features.split())
    older='old' in features
    defs=f'''<defs>
    <linearGradient id="skin" x1="0" x2="1" y2=".8"><stop stop-color="{skin}"/><stop offset=".5" stop-color="{skin}"/><stop offset="1" stop-color="#896047"/></linearGradient>
    <linearGradient id="hair" x2=".85" y2="1"><stop stop-color="{hair}"/><stop offset="1" stop-color="#211e25"/></linearGradient>
    <linearGradient id="robe" x2=".7" y2="1"><stop stop-color="{robe}"/><stop offset=".65" stop-color="{robe}"/><stop offset="1" stop-color="#171a24"/></linearGradient>
    <linearGradient id="gold" x2="1" y2="1"><stop stop-color="#f6e1a4"/><stop offset=".5" stop-color="#c8a56b"/><stop offset="1" stop-color="#7e5737"/></linearGradient>
    <filter id="paper" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence baseFrequency=".52" numOctaves="2" seed="57" type="fractalNoise" result="grain"/><feColorMatrix in="grain" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".07"/></feComponentTransfer><feComposite in2="SourceAlpha" operator="in" result="texture"/><feBlend in="SourceGraphic" in2="texture" mode="multiply"/><feComposite in2="SourceAlpha" operator="in"/></filter>
    </defs>'''
    # Shape language: broad cloth, asymmetrical seams, warm rim and silhouette.
    backhair=''
    if style in ['long','curly','huge']:
        backhair='<path d="M177 154q-58 49-50 145-21 100 1 169 52 31 126-8 89 43 134-7 0-85-8-143 3-112-70-158z" fill="url(#hair)"/>'
    robe_shape='M102 581q12-155 30-233 25-48 88-63l70-2q65 16 88 63 25 101 30 235z'
    if 'giant' in features:
        robe_shape='M65 581q8-176 47-246 31-50 104-55h85q70 16 101 62 39 95 45 239z'
    body=f'''<path d="{robe_shape}" fill="url(#robe)" stroke="#1a1921" stroke-width="5"/>
    <path d="M149 356 200 306l52 88 58-89 50 44-62 178-43 54-45-54Z" fill="#1d202a" opacity=".67"/>
    <path d="M202 303 251 335 301 302l-15 94-35 43-35-43Z" fill="#d3c6ac"/>
    <path d="m251 337-13 22 9 20-10 55 15 21 15-22-12-54 10-20Z" fill="{accent}"/>
    <path d="M198 310 162 373l54 35-27 45 62 128M305 308l47 65-57 35 28 46-68 127" fill="none" stroke="{accent}" stroke-width="5" opacity=".78"/>
    <path d="m129 386 22 138m222-138-19 138M200 480l-13 88m117-92 22 93" fill="none" stroke="#f4d399" stroke-width="3" opacity=".13"/>
    <path d="M221 267v55q34 26 67-2v-57" fill="url(#skin)"/>
    <ellipse cx="180" cy="213" rx="19" ry="30" fill="{skin}" stroke="#87664f" stroke-width="3"/>
    <ellipse cx="328" cy="213" rx="19" ry="30" fill="{skin}" stroke="#87664f" stroke-width="3"/>
    <path d="M180 174q3-83 74-81 75-4 77 83l-6 70q-13 57-70 66-54-9-69-63Z" fill="url(#skin)" stroke="#765640" stroke-width="3"/>
    <path d="M196 232q8 33 23 43M314 231q-5 34-23 46" fill="none" stroke="#efd2a0" stroke-width="4" opacity=".43"/>
    '''
    # Every face has brows, shaped eye sockets, catchlights and asymmetric nose.
    eyes='''<path d="M196 203q17-13 36 0M276 202q19-13 35 1" fill="none" stroke="#4b362d" stroke-width="6" stroke-linecap="round"/>
    <path d="M197 221q17-12 34 0-18 8-34 0m79 0q18-13 35 0-18 8-35 0" fill="#e5d5b6"/>
    <ellipse cx="215" cy="219" rx="5" ry="7" fill="#465749"/><ellipse cx="294" cy="219" rx="5" ry="7" fill="#465749"/>
    <circle cx="214" cy="217" r="2" fill="#fff2cc"/><circle cx="293" cy="217" r="2" fill="#fff2cc"/>
    <path d="M254 217 245 247q8 7 16 0" fill="none" stroke="#9a7154" stroke-width="3" stroke-linecap="round"/>
    <path d="M234 272q20 10 41-1" fill="none" stroke="#845845" stroke-width="3" stroke-linecap="round"/>
    <path d="M245 281h19" stroke="#f0c69d" stroke-width="2" opacity=".5"/>'''
    if 'noseless' in features:
        eyes='''<path d="M193 209q22-16 42-3m41 0q22-13 40 2" stroke="#586459" stroke-width="6" fill="none"/><ellipse cx="216" cy="225" rx="6" ry="9" fill="#84352f"/><ellipse cx="295" cy="225" rx="6" ry="9" fill="#84352f"/><path d="m247 243-2 11m16-11 2 11" stroke="#657366" stroke-width="3"/><path d="M232 276q24-6 44 2" stroke="#68705e" stroke-width="3"/>'''
    hairfront=''
    if style in ['messy','spiky']:
        hairfront='<path d="m176 197-14-45 28-3-6-25 32 6 3-32 32 12 20-25 20 32 34-2-4 26 24 12-14 47-17-30-26 7-18-15-20 25-20-8-31 31 6-29Z" fill="url(#hair)" stroke="#231d22" stroke-width="3"/>'
    elif style=='short':
        hairfront='<path d="M177 191q-4-53 25-74 46-34 92-10 43 17 39 84l-20-30q-59 18-111-5Z" fill="url(#hair)"/>'
    elif style=='slick':
        hairfront='<path d="M177 195q-9-67 34-88 44-25 92 0 36 29 30 87l-14-36q-66 12-120-1Z" fill="url(#hair)"/><path d="M193 150q37-42 111-25M195 159q52-30 114-22" fill="none" stroke="#f0dda9" stroke-width="4" opacity=".6"/>'
    elif style=='receding':
        hairfront='<path d="M177 203q-14-61 35-90l-12 54-8 32zm155 0 2-49q-8-31-34-39l14 56 3 27" fill="url(#hair)"/>'
    elif style in ['long','huge']:
        hairfront='<path d="M176 230q-19-86 25-119 47-36 101 0 43 26 32 126l-23-42q9-31-36-57-23 34-77 38l-1 47z" fill="url(#hair)"/><path d="M182 250q-12 72-20 97m169-97q13 50 17 93" stroke="'+hair+'" stroke-width="10" fill="none"/>'
    elif style=='curly':
        curls=[]
        for i in range(19):
            a=math.pi*.9+i/18*math.pi*1.2
            x=255+91*math.cos(a)
            y=198+115*math.sin(a)
            curls.append(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="28" ry="35" fill="url(#hair)" stroke="{hair}" stroke-width="3"/>')
        hairfront=''.join(curls)+'<path d="M177 168q1-71 77-79 74 4 79 79l-37-14-20-29-31 38-32-17-26 29Z" fill="url(#hair)"/>'
    elif style=='bun':
        hairfront='<ellipse cx="255" cy="107" rx="52" ry="43" fill="url(#hair)"/><path d="M177 192q-3-80 78-78 81 1 79 79l-23-39-51-14-62 26Z" fill="url(#hair)"/>'
    else:
        hairfront='<path d="M186 169q13-65 70-67 57 1 70 67" fill="none" stroke="#f1e2b9" stroke-width="4" opacity=".25"/>'
    accessories=''
    if 'glasses' in features:
        accessories+='<g fill="none" stroke="#372b28" stroke-width="5"><circle cx="215" cy="222" r="28"/><circle cx="294" cy="222" r="28"/><path d="M243 222h23m-80-7-13-5m150 5 13-5"/></g><path d="m197 212 11-8m69 9 11-8" stroke="#ffefc9" stroke-width="3" opacity=".6"/>'
    if 'scar' in features:
        accessories+='<path d="m278 162-12 17h13l-11 19" stroke="#aa6655" stroke-width="3" fill="none"/>'
    if 'freckles' in features:
        accessories+=''.join(f'<circle cx="{x}" cy="{y}" r="2" fill="#9c633f"/>' for x,y in [(204,242),(216,246),(225,241),(282,241),(294,245),(306,240)])
    if 'beard' in features:
        accessories+='<path d="M191 248q4 37 22 55 9 65 41 106 36-45 48-106 20-22 19-56-17 37-65 34-48 5-65-33Z" fill="'+hair+'" stroke="#b9a98d" stroke-width="2"/><path d="M218 291q17 22 17 68m36-66q-1 37-15 86m35-78q-11 30-13 51" stroke="#8e826e" stroke-width="2" opacity=".5"/><path d="M225 270q29-25 59 1l-29-4Z" fill="'+hair+'"/>'
    elif 'beardshort' in features:
        accessories+='<path d="M191 247q18 36 63 37 47-3 66-37-2 51-65 71-56-13-64-71Z" fill="'+hair+'"/>'
    if 'moustache' in features:
        accessories+='<path d="M226 264q28-19 57 2-15 5-28-1-17 8-29-1Z" fill="'+hair+'"/>'
    if 'hat' in features or 'hatblue' in features:
        hat='#354b48' if id=='morgana' else '#59406b' if id=='merlin' else '#667a94' if 'hatblue' in features else '#766a44'
        accessories+=f'<path d="M168 147 223 9 285 36 335 151Z" fill="{hat}" stroke="#2b2730" stroke-width="4"/><ellipse cx="254" cy="153" rx="111" ry="20" fill="{hat}" stroke="url(#gold)" stroke-width="4"/><path d="m205 90 94 21" stroke="#b49766" stroke-width="10"/>'
        if id=='merlin':
            accessories+='<path d="m249 52 7-18 6 18 18 4-16 9 2 18-14-12-17 7 8-17-9-14Z" fill="url(#gold)"/>'
    if 'scarf' in features:
        accessories+=f'<path d="M203 304q54 35 104-1l-9 30q-23 17-42 16l-8 128-30 2 3-144-25-13Z" fill="{accent}" stroke="#33262b" stroke-width="3"/><path d="m219 370 31 0m-31 31 29 0m-28 33 28 0" stroke="url(#gold)" stroke-width="11"/>'
    if older:
        accessories+='<path d="m198 235 27 2m57-1 28-3m-101 20-8 8m101-9 8 8m-78-82 16-2m21 0 18 3" stroke="#98765c" stroke-width="2" fill="none" opacity=".75"/>'
    if 'scars' in features:
        accessories+='<path d="m200 180 11 13-7 12m84 42-12 15 7 9" stroke="#9b735f" stroke-width="3" fill="none"/>'
    if 'eye' in features:
        accessories+='<path d="M175 215 331 201" stroke="#655b4c" stroke-width="12"/><circle cx="294" cy="218" r="26" fill="#749ca6" stroke="#aaab98" stroke-width="7"/><circle cx="301" cy="218" r="10" fill="#c8edee"/>'
    if 'earring' in features:
        accessories+='<circle cx="179" cy="245" r="10" fill="none" stroke="url(#gold)" stroke-width="6"/>'
    # A wand is composed as an object, positioned consistently for all playable figures.
    accessory_prop='<path d="M338 449 428 282" stroke="#39271e" stroke-width="11" stroke-linecap="round"/><path d="m344 438 80-151" stroke="#b08b61" stroke-width="3"/><path d="M327 436q18-15 34 3l-6 36-26-1Z" fill="url(#skin)" stroke="#825f46" stroke-width="3"/>'
    if 'book' in features:
        accessory_prop+='<path d="m144 426 69-20 14 106-77 16Z" fill="#6a3c35" stroke="url(#gold)" stroke-width="5"/><path d="m159 433 38-10m-36 24 38-10" stroke="#cca777" stroke-width="3"/>'
    if 'case' in features:
        accessory_prop+='<path d="M121 443h83v99h-83Z" fill="#8b6945" stroke="#d1ae7b" stroke-width="5"/><path d="M144 443v-20h35v20" fill="none" stroke="#cba66c" stroke-width="7"/>'
    if 'plant' in features:
        accessory_prop+='<path d="m132 470 12 60h46l13-60Z" fill="#9f6a45" stroke="#603b31" stroke-width="4"/><path d="M169 473v-68m-1 39q-43-5-33-35 32-1 33 35m1 13q40-8 35-42-27-1-35 42" fill="#6d7b4c" stroke="#b2b87a" stroke-width="3"/>'
    if 'flask' in features:
        accessory_prop+='<path d="M155 416h23v39q44 58-11 63-54-6-12-63Z" fill="#8cb5a4" fill-opacity=".8" stroke="#dec895" stroke-width="4"/>'
    if 'radish' in features:
        accessories+='<path d="M178 244q-15 17 0 32 15-15 0-32" fill="#c78b9e"/><path d="m178 245 7-15-14 1Z" fill="#86a26f"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="512" height="640" viewBox="0 0 512 640">{defs}<g transform="translate(0 27)" filter="url(#paper)">{backhair}{body}{eyes}{hairfront}{accessories}{accessory_prop}</g></svg>'

ART.mkdir(parents=True,exist_ok=True)
index={}
for id, character in characters.items():
    if id not in CONFIG:
        raise ValueError('Character design required: '+id)
    path=ART/(id+'.svg')
    path.write_text(illustration(id))
    for kind in ['figure','portrait','thumbnail']:
        index['character.'+id+'.'+kind]={'path':'art/character/'+id+'.svg','width':512,'height':640,'alpha':True,'pivot':[.5,.95],'alt':{'es':'Ilustración de '+character['name']['es'],'en':'Illustration of '+character['name']['en']}}
(DESIGN/'character-assets-index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n')
(DESIGN/'portrait-provenance.json').write_text(json.dumps({'date':'2026-10-15','author':'Original local SVG authored by Codex, directed by Enric','tool':'tools/visual/diagon-portraits.py','type':'Editable vector illustrations, coherent provisional family','cashCost':0,'references':'Character traits from current approved thematic brief; no actors, photos or external art copied','status':'Private prototype illustrations; final painted finish is not claimed','license':'Repository source terms; Harry Potter franchise distribution permission not established','source':'tools/visual/diagon-portraits.py','files':[str(p.relative_to(ROOT)) for p in ART.glob('*.svg')]},ensure_ascii=False,indent=2)+'\n')
print('DIAGON_PORTRAITS',len(characters),'SVG character illustrations, 90 logical roles')
