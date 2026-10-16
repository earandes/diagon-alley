"""Author one local, text-free gold coin; patch presentation registries only."""
from pathlib import Path
import hashlib
import json
from xml.etree import ElementTree

ROOT=Path(__file__).resolve().parents[2]
PACK=ROOT/'src/arcana/presentation/content-packs/diagon-alley'
DESIGN=ROOT/'design/diagon-alley'
relative='art/currency/galleon.svg'
target=PACK/relative
target.parent.mkdir(parents=True,exist_ok=True)
source='''<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
<defs>
<linearGradient id="edge" x1=".1" y1="0" x2=".8" y2="1"><stop stop-color="#fff1a5"/><stop offset=".3" stop-color="#e6b84e"/><stop offset=".65" stop-color="#8c531d"/><stop offset="1" stop-color="#d6a13e"/></linearGradient>
<radialGradient id="face" cx=".34" cy=".25" r=".8"><stop stop-color="#ffe09a"/><stop offset=".55" stop-color="#dca444"/><stop offset="1" stop-color="#a96723"/></radialGradient>
<linearGradient id="relief" x1="0" y1="0" x2=".6" y2="1"><stop stop-color="#ffeca4"/><stop offset="1" stop-color="#9a5b1b"/></linearGradient>
</defs>
<circle cx="128" cy="132" r="116" fill="#4d2c16"/>
<circle cx="128" cy="124" r="116" fill="url(#edge)" stroke="#724718" stroke-width="3"/>
<circle cx="128" cy="124" r="105" fill="none" stroke="#ffe79b" stroke-width="4"/>
<circle cx="128" cy="124" r="96" fill="url(#face)" stroke="#945c20" stroke-width="3"/>
<circle cx="128" cy="124" r="87" fill="none" stroke="#8a521d" stroke-width="2" stroke-dasharray="1 10" stroke-linecap="round"/>
<path d="M87 162q-24-29-5-61l-24-6 39-31 3 41 26-47 12 48 43-42-5 42 24 18-35 1q-1 25-19 33-27 16-11 26 17 11 32-8-2 29-29 30-38 1-39-26-15 7-26-2l17-4 11-18 6-24-20 19Z" fill="#8d551e" stroke="#9c6120" stroke-width="5" stroke-linejoin="round"/>
<path d="M84 158q-23-28-5-61l-24-6 39-31 3 41 26-47 12 48 43-42-5 42 24 18-35 1q-1 25-19 33-27 16-11 26 17 11 32-8-2 29-29 30-38 1-39-26-15 7-26-2l17-4 11-18 6-24-20 19Z" fill="url(#relief)" stroke="#ffe6a0" stroke-width="2" stroke-linejoin="round"/>
<path d="m94 72-6 36m35-39 0 43m48-38-19 41m-55 41 18-20" fill="none" stroke="#ad7329" stroke-width="4" stroke-linecap="round"/>
<circle cx="166" cy="110" r="4" fill="#65401b"/>
<path d="m182 129 15 3-11 5" fill="none" stroke="#89531b" stroke-width="3" stroke-linecap="round"/>
<path d="M64 181q59 43 119-1" fill="none" stroke="#fff0ae" stroke-width="3" opacity=".8"/>
<path d="m48 78 3-10m139 115 7-8" stroke="#ffedac" stroke-width="5" stroke-linecap="round"/>
</svg>'''
target.write_text(source)
asset={'path':relative,'width':256,'height':256,'alpha':True,'pivot':[.5,.5],
       'alt':{'es':'Galeones','en':'Galleons'}}
for file in [PACK/'assets.json',DESIGN/'assets-index.json']:
    data=json.loads(file.read_text())
    data['currency.crowns']=asset
    file.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
record={'id':'currency.crowns',**asset,'bytes':target.stat().st_size,
        'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),
        'source':'tools/visual/diagon-galleon.py','tool':'Locally authored editable SVG',
        'permission':'Private project use; franchise distribution permission unresolved.',
        'status':'local-production-private-prototype','version':1,
        'motif':'Original embossed winged creature; no functional text, external art or traced logo.'}
manifest_path=DESIGN/'manifest.json'
manifest=json.loads(manifest_path.read_text())
manifest['assets']=[entry for entry in manifest['assets'] if entry['id']!='currency.crowns']+[record]
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
assert ElementTree.fromstring(source).tag.endswith('svg')
assert not ElementTree.fromstring(source).findall('.//{http://www.w3.org/2000/svg}text')
(DESIGN/'galleon-validation.json').write_text(json.dumps({'result':'pass','asset':record,
    'checks':['XML parsed','No embedded functional text','Presentation-only currency.crowns mapping','ARCANA art untouched'],
    'limits':'No new browser capture or game test; root owns integration QA.'},ensure_ascii=False,indent=2)+'\n')
print('DIAGON_GALLEON',relative,'256x256 alpha; presentation registries updated.')
