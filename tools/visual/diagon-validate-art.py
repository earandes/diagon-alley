"""Validate generated export contracts, sources and transparent bounds."""
import json
from pathlib import Path
from xml.etree import ElementTree
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
DESIGN=ROOT/'design/diagon-alley'
ART=ROOT/'src/arcana/presentation/content-packs/diagon-alley'
results=[]
for index_name in ['assets-index.json','character-assets-index.json']:
    for key, asset in json.loads((DESIGN/index_name).read_text()).items():
        path=ART/asset['path']
        assert path.is_file(), (key,'missing')
        if path.suffix=='.svg':
            tree=ElementTree.parse(path)
            svg=tree.getroot()
            size=(int(svg.attrib['width']),int(svg.attrib['height']))
            assert not tree.findall('.//{http://www.w3.org/2000/svg}text'),(key,'text embedded')
        else:
            with Image.open(path) as im:
                size=im.size
                if asset['alpha']:
                    assert im.mode=='RGBA',(key,'alpha declared but absent')
                    assert im.getchannel('A').getextrema()[0]<255,(key,'alpha opaque')
                if key.startswith('character.') and key.endswith('portrait'):
                    assert im.getpixel((0,0))[-1]==0,(key,'background alpha leaked')
        assert size==(asset['width'],asset['height']),(key,'size mismatch',size)
        assert set(asset['alt'])=={'es','en'},(key,'localization missing')
        assert len(asset['pivot'])==2 and all(0<=x<=1 for x in asset['pivot']),(key,'pivot invalid')
        results.append({'key':key,'path':asset['path'],'dimensions':list(size),'status':'pass'})
captures=json.loads((DESIGN/'compositions/capture-check.json').read_text())
for capture in captures:
    assert all(i['loaded'] for i in capture['images']),capture
    assert not capture['errors'],capture
(DESIGN/'asset-validation.json').write_text(json.dumps({'date':'2026-10-15','checks':len(results),'result':'pass','exports':results,'compositionCaptures':len(captures),'limits':'Asset contract and image loads only. No user playtest, persistence or physical-device evidence.'},ensure_ascii=False,indent=2)+'\n')
print('DIAGON_ART_VALIDATION',len(results),'asset roles;',len(captures),'composition captures; PASS')
