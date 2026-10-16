"""Original A59 SVG object family. Python stdlib only; no downloaded templates or runtime generation."""
from pathlib import Path
from hashlib import sha256
import json
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'src/arcana/presentation/content-packs/diagon-alley/art/nodes-a59'
OUT.mkdir(parents=True, exist_ok=True)
DEFS='''<defs>
 <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0b8"/><stop offset=".25" stop-color="#ac7437"/><stop offset=".52" stop-color="#e1bc6b"/><stop offset=".77" stop-color="#644021"/><stop offset="1" stop-color="#f1d38b"/></linearGradient>
 <linearGradient id="silver" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e4e5df"/><stop offset=".33" stop-color="#6c7c82"/><stop offset=".62" stop-color="#adbdba"/><stop offset="1" stop-color="#303b48"/></linearGradient>
 <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b37845"/><stop offset=".3" stop-color="#5f3425"/><stop offset=".6" stop-color="#9c6039"/><stop offset="1" stop-color="#2c1b1c"/></linearGradient>
 <linearGradient id="paper" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fff0c9"/><stop offset=".5" stop-color="#d8bf8b"/><stop offset="1" stop-color="#9c8057"/></linearGradient>
 <linearGradient id="emerald" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c3eaba"/><stop offset=".25" stop-color="#72b3a0"/><stop offset=".58" stop-color="#276759"/><stop offset="1" stop-color="#122f30"/></linearGradient>
 <linearGradient id="copper" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#f3c48e"/><stop offset=".3" stop-color="#b4744e"/><stop offset=".65" stop-color="#613e35"/><stop offset="1" stop-color="#2e252b"/></linearGradient>
 <linearGradient id="ink" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6c7682"/><stop offset=".3" stop-color="#2d3847"/><stop offset=".7" stop-color="#121a29"/><stop offset="1" stop-color="#52606a"/></linearGradient>
 <radialGradient id="spell"><stop stop-color="#ffffff"/><stop offset=".24" stop-color="#d3f8ff"/><stop offset=".6" stop-color="#60c5df" stop-opacity=".8"/><stop offset="1" stop-color="#60c5df" stop-opacity="0"/></radialGradient>
 <radialGradient id="aura"><stop stop-color="#d5d49d" stop-opacity=".2"/><stop offset="1" stop-color="#ded096" stop-opacity="0"/></radialGradient>
 </defs>'''
ART={
'duel': '''<ellipse cx="126" cy="218" rx="83" ry="12" fill="#0a111b" opacity=".38"/>
 <path d="M46 202 181 57 191 49 186 66 62 214Z" fill="url(#wood)" stroke="#201b22" stroke-width="5" stroke-linejoin="round"/>
 <path d="m51 200 16 12m-11-20 17 12m-10-21 16 13m-7-22 15 13" stroke="url(#brass)" stroke-width="5"/>
 <path d="m75 177 98-106" stroke="#d8b585" stroke-opacity=".62" stroke-width="3"/>
 <path d="m199 212-135-142-7-18 18 7 139 139Z" fill="url(#silver)" stroke="#17212b" stroke-width="5" stroke-linejoin="round"/>
 <path d="m191 193 14 13m-8-22 16 13m-8-22 15 13" stroke="#594a42" stroke-width="6"/>
 <path d="M187 181 85 74" stroke="#f1ecd9" stroke-width="3" opacity=".8"/>
 <path d="M51 116c26-58 85-76 137-44 41 25 21 67-20 59-27-5-9-34 19-26" fill="none" stroke="#c1e6df" stroke-width="5" stroke-linecap="round"/>
 <path d="M52 115c33-37 89-43 128-12" fill="none" stroke="#e2bd6e" stroke-width="2"/>
 <circle cx="128" cy="122" r="43" fill="url(#spell)"/>
 <path d="m127 95 5 18 20 7-19 5-5 20-6-19-20-5 20-6Z" fill="#f2fcff"/>
 <path d="m50 79 3 9 9 3-9 3-3 9-3-9-9-3 9-3Zm148 55 2 7 8 3-8 2-2 8-3-8-7-2 7-3Z" fill="#f8dfa1"/>
 <path d="m101 43 3 8m98 47 8-2m-163 52-8 4" stroke="#c5ded8" stroke-width="3" stroke-linecap="round"/>''',
'refuge': '''<ellipse cx="129" cy="221" rx="79" ry="12" fill="#0a111b" opacity=".4"/>
 <path d="M68 124c-27-27-50 3-22 25m151-25c27-27 47 4 22 25" fill="none" stroke="url(#brass)" stroke-width="12" stroke-linecap="round"/>
 <path d="m74 193-5 26 19-1 12-21m75-4 7 26-19-1-13-20" fill="url(#ink)" stroke="#1b2027" stroke-width="4"/>
 <path d="M62 117c-3 17-9 28-5 48 6 39 37 47 72 47s66-8 72-47c4-20-2-31-5-48Z" fill="url(#copper)" stroke="#30252b" stroke-width="5"/>
 <path d="M71 136c-2 32 6 48 27 58" fill="none" stroke="#e2a776" stroke-opacity=".65" stroke-width="7" stroke-linecap="round"/>
 <path d="M168 139c4 18 1 35-6 48" fill="none" stroke="#3d3136" stroke-width="9" opacity=".6"/>
 <ellipse cx="129" cy="117" rx="69" ry="20" fill="url(#brass)" stroke="#30252b" stroke-width="5"/>
 <ellipse cx="129" cy="115" rx="56" ry="12" fill="#173d35"/>
 <ellipse cx="128" cy="112" rx="50" ry="8" fill="#9ac792"/>
 <path d="M90 111c18-9 48-8 73 0" fill="none" stroke="#e9f5b9" stroke-width="3" opacity=".85"/>
 <path d="M100 87c-28-25 27-24 6-55m31 54c22-22-19-27-3-51m27 59c28-24-14-32 3-50" fill="none" stroke="#b2d2bf" stroke-opacity=".7" stroke-width="7" stroke-linecap="round"/>
 <path d="m115 150 12-8 14 9-2 18-12 8-13-9Z" fill="url(#brass)" stroke="#62412c" stroke-width="2"/>
 <path d="M121 159h13m-6-6v12" stroke="#eef1c0" stroke-width="4" stroke-linecap="round"/>
 <circle cx="78" cy="90" r="5" fill="#c5e2ac"/><circle cx="181" cy="83" r="4" fill="#c5e2ac"/>''',
'chest': '''<ellipse cx="130" cy="219" rx="91" ry="13" fill="#0a111b" opacity=".42"/>
 <path d="M43 111 184 94l31 42-143 21Z" fill="url(#wood)" stroke="#2f2324" stroke-width="5" stroke-linejoin="round"/>
 <path d="M44 116v72l31 29 137-22v-65l-140 20Z" fill="url(#wood)" stroke="#2f2324" stroke-width="5" stroke-linejoin="round"/>
 <path d="m75 154 1 58m129-78-131 19-26-30" fill="none" stroke="#d0a85d" stroke-width="5"/>
 <path d="m104 149 2 58m67-67 2 55M60 138v48" stroke="url(#brass)" stroke-width="13"/>
 <path d="m46 108 5-47 137-21 24 49-133 27Z" fill="url(#wood)" stroke="#2f2324" stroke-width="5" stroke-linejoin="round"/>
 <path d="m52 64 130-20 26 43-133 25Z" fill="none" stroke="url(#brass)" stroke-width="8"/>
 <path d="m99 58 11 43m60-52 13 41" stroke="url(#brass)" stroke-width="12"/>
 <path d="m72 118 122-18 12 26-131 20-24-25Z" fill="#161d22"/>
 <ellipse cx="119" cy="123" rx="19" ry="6" fill="#e9bc5b" stroke="#8a5c2a" stroke-width="2"/><ellipse cx="145" cy="116" rx="17" ry="6" fill="#f5d482" stroke="#8a5c2a" stroke-width="2"/>
 <path d="m157 106 19-12 14 15-13 22-20-7Z" fill="url(#emerald)" stroke="#b9d3ad" stroke-width="2"/>
 <path d="m143 154 20-3 1 26-20 4Z" fill="url(#brass)" stroke="#503c28" stroke-width="3"/><circle cx="153" cy="163" r="3" fill="#2d2926"/><path d="m153 165-2 8h4Z" fill="#2d2926"/>
 <path d="m88 180 13-2m11 16 29-5m40-12 17-3M59 82l24-4m39-10 33-5" stroke="#e1b77b" stroke-width="2" opacity=".45"/>
 <path d="m98 88 2-11m45 11 4-16m44 26 7-7" stroke="#ffdf91" stroke-width="3" stroke-linecap="round"/>''',
'pact': '''<ellipse cx="127" cy="222" rx="62" ry="12" fill="#0a111b" opacity=".36"/>
 <g transform="rotate(-9 128 128)">
 <path d="M62 34q65-12 129 0l-3 174q-64 13-128 0Z" fill="url(#paper)" stroke="#503d2a" stroke-width="5"/>
 <path d="m72 42 108-1-2 157-107 1Z" fill="none" stroke="url(#brass)" stroke-width="7"/>
 <path d="M80 55q44-21 90 0v111q-45 20-90 0Z" fill="url(#ink)" stroke="#78633d" stroke-width="3"/>
 <path d="M88 162c2-37 20-47 39-47 23 0 38 17 38 47-20 10-53 10-77 0Z" fill="url(#emerald)"/>
 <path d="m106 126 18 24 17-25-7-10h-20Z" fill="#d2b689"/>
 <path d="M104 88q0-30 23-30 22 0 22 29l-4 22-18 16-18-16Z" fill="url(#paper)"/>
 <path d="M103 90c-11-33 2-45 24-45 25 1 29 20 21 46l-4-25-17 9-18-5Z" fill="url(#wood)"/>
 <path d="m112 91 9-2m12 0 8 2m-18 19 11-1" stroke="#5c4235" stroke-width="3" stroke-linecap="round"/>
 <path d="M95 138q4 20 3 25m56-26-4 27" stroke="#b3d4b4" stroke-width="3" opacity=".5"/>
 <path d="m82 182 31-1m11-1 35-1" stroke="#876944" stroke-width="3" opacity=".65" stroke-linecap="round"/>
 <circle cx="127" cy="200" r="17" fill="url(#brass)" stroke="#5f472b" stroke-width="3"/><path d="m120 190 13 0-10 17h10m-13-17 13 17" fill="none" stroke="#4a503e" stroke-width="3" stroke-linecap="round"/>
 </g>
 <path d="M190 63c28-25 42 7 19 21" fill="none" stroke="#a3d8c6" stroke-width="3" opacity=".85"/>
 <path d="m210 42 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" fill="#e4eec0"/>''',
'encounter': '''<ellipse cx="124" cy="216" rx="83" ry="13" fill="#0a111b" opacity=".38"/>
 <g transform="rotate(7 128 132)">
 <path d="m39 83 99-40 86 55-11 108-169-5Z" fill="url(#paper)" stroke="#4d3b32" stroke-width="5" stroke-linejoin="round"/>
 <path d="m40 85 79 77 104-62" fill="#ad956e" stroke="#785a40" stroke-width="3"/>
 <path d="m46 196 71-63 94 69Z" fill="url(#paper)" stroke="#96744d" stroke-width="3"/>
 <path d="M42 86 126 150 222 98 137 45Z" fill="url(#paper)" stroke="#6b5139" stroke-width="4"/>
 <path d="m61 88 75-30 64 40-72 39Z" fill="none" stroke="#e6d5a8" stroke-width="3" opacity=".7"/>
 <path d="m118 138-3 44 17-10 10 14-1-43" fill="url(#emerald)" stroke="#183c37" stroke-width="3"/>
 <path d="m111 136 11-10 16 1 11 11-1 17-14 10-18-6-9-11Z" fill="#635275" stroke="url(#brass)" stroke-width="3"/>
 <path d="M126 135c-13 5-8 13 2 9 14-5 11 11-2 9" fill="none" stroke="#d4c5de" stroke-width="3" stroke-linecap="round"/>
 <path d="m54 183 38 1m80 3 25 1" stroke="#aa8b5f" stroke-width="2" opacity=".6"/>
 </g>
 <path d="M69 42c-8 12-6 24 2 28m105-45c13 7 17 18 12 29" fill="none" stroke="#a6c2ba" stroke-width="3" opacity=".7" stroke-linecap="round"/>
 <path d="m85 34 2 6 7 3-7 2-2 8-3-8-7-2 7-3Z" fill="#f3d58c"/>''',
'boss': '''<ellipse cx="128" cy="224" rx="73" ry="12" fill="#080d15" opacity=".5"/>
 <path d="M69 75q59-71 120 0l16 94-38 48-38 14-42-16-38-47Z" fill="url(#ink)" stroke="#0c1420" stroke-width="5"/>
 <path d="M80 67q49-39 98 1l11 76-20 50-40 22-40-24-18-47Z" fill="url(#silver)" stroke="#222d38" stroke-width="5"/>
 <path d="M128 53c-14 34-16 66-9 99l-12 17 22 10 20-9-12-18c7-38 2-73-9-99Z" fill="url(#ink)" stroke="#7e8b8d" stroke-width="2"/>
 <path d="M81 108q26-18 41 6l-7 20q-21 8-37-12Z" fill="#0b1520" stroke="#adbbb4" stroke-width="3"/>
 <path d="M135 114q18-25 43-6l4 15q-14 18-38 11Z" fill="#0b1520" stroke="#adbbb4" stroke-width="3"/>
 <path d="m88 118 20 2m39 0 23-2" stroke="#91ccb0" stroke-width="4" stroke-linecap="round"/>
 <path d="M112 187q16-10 33 0m-32 7 28 0" fill="none" stroke="#303e47" stroke-width="4"/>
 <path d="M84 82q13-13 22-8m47 0q12-4 20 9M82 144l19 24-4 14m78-38-19 24 3 14" fill="none" stroke="#e0dbbb" stroke-width="3" opacity=".6" stroke-linecap="round"/>
 <path d="M57 160c-31-25 2-38-3-66-5-22-21-19-18-44m164 118c33-24 3-39 12-66 8-25 22-20 17-44" fill="none" stroke="#699d8e" stroke-width="7" stroke-opacity=".6" stroke-linecap="round"/>
 <path d="M64 179c-26 11-27-8-18-17m146 22c27 7 27-11 18-20" fill="none" stroke="#aec5ad" stroke-width="3" opacity=".65"/>
 <path d="m126 35 5-10 4 12-5 10Z" fill="#bad8ba"/>''',
}
ALT={
'duel':{'es':'Duelo: varitas cruzadas y hechizo luminoso','en':'Duel: crossed wands and a bright spell'},
'refuge':{'es':'Refugio: caldero de cobre con poción reparadora','en':'Refuge: copper cauldron with a restorative potion'},
'chest':{'es':'Botín: baúl de madera con monedas y gema','en':'Loot: wooden trunk with coins and a gem'},
'pact':{'es':'Aliado temporal: carta encantada con retrato y reloj de arena','en':'Temporary ally: enchanted portrait card and hourglass'},
'encounter':{'es':'Encuentro: invitación sellada de contenido misterioso','en':'Encounter: sealed invitation with mysterious contents'},
'boss':{'es':'Jefe: máscara oscura entre humo verde','en':'Boss: dark mask amid green smoke'},
}
manifest=[]
for name,body in ART.items():
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">{DEFS}{body}</svg>\n'
    file=OUT/f'{name}.svg'; file.write_text(svg)
    manifest.append({'id':f'node.{name}','path':str(file.relative_to(ROOT)),'editableSource':str(Path(__file__).relative_to(ROOT)),'width':256,'height':256,'alpha':True,'pivot':[.5,.5],'alt':ALT[name],'sha256':sha256(file.read_bytes()).hexdigest(),'bytes':file.stat().st_size,'author':'Codex, original local vector authoring','tool':'Python stdlib, SVG gradients/paths','version':1,'costAdded':0,'externalResources':[],'permission':'Original project vectors. Franchise distribution permission remains unresolved. Private prototype only.','status':'local-original-vector-prototype'})
(ROOT/'design/diagon-alley/annotations-a59/manifest.json').write_text(json.dumps({'version':1,'date':'2026-10-15','target':'44–72 px nodes, six distinguishable silhouettes','assets':manifest},ensure_ascii=False,indent=2)+'\n')
# Documentation composition only: labels are outside the production asset files.
sheet=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 690"><rect width="1050" height="690" fill="#152232"/><text x="40" y="43" fill="#efd9aa" font-family="Georgia" font-size="26">A59 · Objetos del Callejón</text>']
for n,(name,body) in enumerate(ART.items()):
    x=45+(n%3)*340;y=72+(n//3)*300
    # Prefix IDs so gradients are independent inside this combined artboard.
    svg=(DEFS+body)
    for id in ['brass','silver','wood','paper','emerald','copper','ink','spell','aura']:
        svg=svg.replace(f'id="{id}"',f'id="{name}-{id}"').replace(f'url(#{id})',f'url(#{name}-{id})')
    sheet.append(f'<g transform="translate({x},{y})"><rect width="296" height="278" rx="16" fill="#101b2a" stroke="#665538"/><g transform="translate(18,0)">{svg}</g><text x="148" y="265" fill="#efd9aa" font-family="Georgia" font-size="15" text-anchor="middle">{name} · 256 / 72 / 44 px</text></g>')
sheet.append('</svg>');(ROOT/'design/diagon-alley/annotations-a59/composition.svg').write_text(''.join(sheet)+'\n')
# Actual thumbnail strip demonstrates the two target sizes without browser or GPU.
strip=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 190"><rect width="640" height="190" fill="#152232"/>']
for n,(name,body) in enumerate(ART.items()):
    svg=DEFS+body
    for id in ['brass','silver','wood','paper','emerald','copper','ink','spell','aura']:
        svg=svg.replace(f'id="{id}"',f'id="{name}-{id}"').replace(f'url(#{id})',f'url(#{name}-{id})')
    for size,y in [(72,14),(44,114)]:
        strip.append(f'<svg x="{18+n*104}" y="{y}" width="{size}" height="{size}" viewBox="0 0 256 256">{svg}</svg>')
strip.append('</svg>');(ROOT/'design/diagon-alley/annotations-a59/size-strip.svg').write_text(''.join(strip)+'\n')
print(f'Created {len(ART)} original SVG objects, manifest and compositions; no browser/GPU model used.')
