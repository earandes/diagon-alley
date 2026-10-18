"""A81: editable illustrated access symbols. Python stdlib only, no remote generation.

Produces the bounded three-object sample in the two existing presentation finishes.
Existing art is referenced for material/line vocabulary, never overwritten.
"""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'design/production/account-symbols-v1'
PACKS = ROOT / 'src/arcana/presentation/content-packs'


def defs(pack):
    coat = ('#6d3778', '#392047', '#1b1428') if pack == 'diagon-alley' else ('#477969', '#244b42', '#102d27')
    return f'''<defs>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff1ae"/><stop offset=".25" stop-color="#e9be64"/><stop offset=".65" stop-color="#986023"/><stop offset="1" stop-color="#f0ce7b"/></linearGradient>
<linearGradient id="coat" x2=".8" y2="1"><stop stop-color="{coat[0]}"/><stop offset=".55" stop-color="{coat[1]}"/><stop offset="1" stop-color="{coat[2]}"/></linearGradient>
<linearGradient id="paper" x2=".65" y2="1"><stop stop-color="#fff4d7"/><stop offset=".6" stop-color="#e5c995"/><stop offset="1" stop-color="#b68c53"/></linearGradient>
<linearGradient id="steel" x2=".6" y2="1"><stop stop-color="#f4ead0"/><stop offset=".55" stop-color="#9aaba9"/><stop offset="1" stop-color="#384f59"/></linearGradient>
<linearGradient id="night" x2="0" y2="1"><stop stop-color="#28445b"/><stop offset="1" stop-color="#0b1929"/></linearGradient>
<filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="9" stdDeviation="6" flood-color="#020510" flood-opacity=".45"/></filter>
</defs>'''


def star(x, y, radius=22, fill='url(#gold)'):
    return f'<path d="M{x} {y-radius}Q{x+4} {y-4} {x+radius} {y}Q{x+4} {y+4} {x} {y+radius}Q{x-4} {y+4} {x-radius} {y}Q{x-4} {y-4} {x} {y-radius}Z" fill="{fill}"/>'


def emblem():
    return '''<g filter="url(#shadow)">
<path d="M92 431V236Q92 118 256 52 420 118 420 236V431Z" fill="url(#coat)" stroke="#5a4129" stroke-width="10"/>
<path d="M112 427V237Q112 135 256 75 400 135 400 237V427" fill="none" stroke="url(#gold)" stroke-width="12"/>
<path d="M151 418V239Q151 166 256 115 361 166 361 239V418" fill="url(#night)" stroke="#b58c4f" stroke-width="5"/>
<path d="M162 408V240Q162 174 256 129 350 174 350 240V408" fill="none" stroke="#e9ce91" stroke-width="2"/>
<path d="M94 257h54m-54 77h54m216-77h54m-54 77h54M183 112l22 39m126-39-22 39" stroke="#cfa65d" stroke-width="4"/>
<path d="M75 420h362l15 23H60Z" fill="url(#gold)" stroke="#67472a" stroke-width="5"/>
<path d="M82 445h348v15H82Z" fill="#b58a4d" stroke="#e0bf7d" stroke-width="3"/>
<g transform="rotate(-8 256 289)"><path d="M197 205h118v173H197Z" fill="url(#paper)" stroke="url(#gold)" stroke-width="9"/>
<path d="M212 220h88v142h-88Z" fill="url(#coat)" stroke="#e7cc8d" stroke-width="3"/>
''' + star(256, 280, 34) + '''<path d="M232 337h48" stroke="#d8b67b" stroke-width="4" stroke-linecap="round"/></g>
<path d="M236 87h40l-20 25Z" fill="url(#gold)"/>
</g>'''


def credential():
    return '''<g transform="rotate(-7 234 288)">
<path d="M119 158h213l22 30v227H119Z" fill="url(#coat)" stroke="#5a4129" stroke-width="7"/>
<path d="M135 173h181l22 20v205H135Z" fill="url(#paper)" stroke="url(#gold)" stroke-width="5"/>
<path d="M316 173v29h22" fill="#c5a46b" stroke="#967145" stroke-width="3"/>
<path d="M154 215v154m159-154v154" stroke="#a57a43" stroke-width="2"/>
<path d="M182 231h97v103h-97Z" fill="url(#coat)" stroke="#bf934e" stroke-width="4"/>
''' + star(230, 281, 28) + '''<path d="M190 358h85" stroke="#906c3f" stroke-width="4" stroke-linecap="round"/>
</g>'''


def login():
    return '<g filter="url(#shadow)">' + credential() + '''
<g transform="rotate(34 329 265)">
<path d="M316 184h27v191h22v27h-22v23h-27Z" fill="url(#steel)" stroke="#384f59" stroke-width="5" stroke-linejoin="round"/>
<path d="M329 199v177" fill="none" stroke="#fff0b6" stroke-width="4"/>
<path d="M330 63Q356 63 364 88 391 94 391 122 391 150 365 158 357 184 330 184 303 184 295 158 269 150 269 122 269 94 296 88 304 63 330 63Z" fill="url(#steel)" stroke="#384f59" stroke-width="6"/>
<path d="M330 87Q341 87 346 105 365 109 365 122 365 135 346 139 341 158 330 158 319 158 314 139 295 135 295 122 295 109 314 105 319 87 330 87Z" fill="url(#coat)" stroke="#f4ead0" stroke-width="3"/>
<path d="M290 111q-9 17 5 29M319 76q13-6 24 4" fill="none" stroke="#f4ead0" stroke-width="3" stroke-linecap="round"/>
</g></g>'''


def register():
    return '<g filter="url(#shadow)">' + credential() + '''
<path d="M236 402Q271 309 324 235L343 224Q285 316 248 407Z" fill="url(#gold)" stroke="#74502b" stroke-width="4"/>
<path d="M249 389q-17 26-20 47l21-25Z" fill="url(#steel)" stroke="#3e4e53" stroke-width="3"/>
<path d="M267 321Q244 236 291 161 331 95 431 62 428 150 391 217 350 287 267 321Z" fill="url(#paper)" stroke="#9c733f" stroke-width="5"/>
<path d="M267 321Q318 211 419 79" fill="none" stroke="#8a6038" stroke-width="5"/>
<path d="m283 286-15-49m31 16-13-56m29 25-7-56m25 27 4-61m-37 122 55-10m-39-20 60-13m-42-16 59-21m-45-8 58-31" fill="none" stroke="#b58a52" stroke-width="3" stroke-linecap="round"/>
<path d="M283 286q39-28 72-79" fill="none" stroke="#fff9e7" stroke-width="4"/>
<path d="M330 305h41l14 21v47q-25 16-69 0v-47Z" fill="url(#coat)" stroke="url(#gold)" stroke-width="5"/>
<path d="M329 305q20-8 40 0v14h-40Z" fill="#0b1929" stroke="#e0bf7d" stroke-width="3"/>
</g>'''


ASSETS = {
    'brand.emblem': ('emblem', emblem, 'Emblema del juego: umbral y cromo', 'Game emblem: gateway and card'),
    'account.login': ('sign-in', login, 'Llave plateada y credencial de acceso', 'Silver key and access credential'),
    'account.register': ('register', register, 'Pluma y folio para crear cuenta', 'Quill and folio to create an account'),
}


def main():
    manifest = {'version': 1, 'tool': 'Python 3 stdlib + authored SVG paths',
                'source': 'tools/visual/account-symbols.py', 'author': 'Codex, SVG paths authored for this increment',
                'references': ['tools/visual/diagon-art-kit.py material vocabulary', 'A80 correspondence composition'],
                'provenance': 'New vector compositions authored for this project. No external artwork, fonts, logos or network generation.',
                'permission': 'Private project use. No claim of franchise authorization or official branding; distribution rights remain unresolved.',
                'cashCost': 0, 'status': 'bounded visual sample; not final brand approval', 'assets': []}
    for pack in ['diagon-alley', 'arcana']:
        folder = SOURCE / pack
        folder.mkdir(parents=True, exist_ok=True)
        runtime = PACKS / pack / 'art/account'
        runtime.mkdir(parents=True, exist_ok=True)
        metadata = json.loads((PACKS / pack / 'assets.json').read_text())
        for key, (name, draw, es, en) in ASSETS.items():
            svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">{defs(pack)}{draw()}</svg>\n'
            source = folder / (name + '.svg')
            source.write_text(svg)
            target = runtime / source.name
            target.write_text(svg)
            entry = {'path': 'art/account/' + source.name, 'width': 512, 'height': 512, 'alpha': True,
                     'pivot': [.5, .5], 'alt': {'es': es, 'en': en}}
            metadata[key] = entry
            manifest['assets'].append({'id': key, 'pack': pack, **entry,
                'sourceEditable': str(source.relative_to(ROOT)), 'runtime': str(target.relative_to(ROOT)),
                'sha256': hashlib.sha256(target.read_bytes()).hexdigest(), 'bytes': target.stat().st_size,
                'consumer': ('App welcome header + AccountAccess manage' if key == 'brand.emblem' else 'App welcome action + AccountAccess ' + ('login' if key == 'account.login' else 'register')),
                'fallback': 'Native labels and title remain; no operation depends on image load'})
        (PACKS / pack / 'assets.json').write_text(json.dumps(metadata, indent=2, ensure_ascii=False) + '\n')
    (SOURCE / 'manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
