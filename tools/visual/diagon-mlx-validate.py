"""Validate local painted production exports without claiming game acceptance."""
import hashlib
import json
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
DESIGN=ROOT/'design/diagon-alley/illustrated-v2'
plan=json.loads((DESIGN/'production-plan.json').read_text())
index=json.loads((DESIGN/'exports-index.json').read_text())
reviews=json.loads((DESIGN/'art-review.json').read_text())['characters']
selections=json.loads((DESIGN/'selected-attempts.json').read_text())
records=[]
assert len(plan['samples'])==30,'Thirty authoritative identities required'
assert len(index)==90,'Three role exports per identity required'
for id in plan['samples']:
    selected=selections[id]
    original=ROOT/selected['sourcePath']
    master=DESIGN/'masters'/(id+'.png')
    assert hashlib.sha256(original.read_bytes()).hexdigest()==selected['sha256'],id+' selected source changed'
    with Image.open(master) as image:
        assert image.size==(768,1024),(id,'master dimensions')
    assert id in reviews,(id,'individual visual review missing')
    for role in ['portrait','figure','thumbnail']:
        key='character.'+id+'.'+role
        asset=index[key]
        path=ROOT/asset['productionFile']
        with Image.open(path) as image:
            assert image.size==(asset['width'],asset['height']),(key,'dimensions')
            if asset['alpha']:
                assert image.mode=='RGBA' and image.getchannel('A').getextrema()==(0,255),(key,'alpha')
            else:
                assert image.mode=='RGB' or image.getchannel('A').getextrema()==(255,255),(key,'painted background')
            if role=='figure':
                assert image.getpixel((0,0))[-1]==0,(key,'top-left matte leak')
        assert asset['pivot']==[.5,.95],(key,'pivot')
        assert set(asset['alt'])=={'es','en'},(key,'localization')
        records.append({'id':key,'path':str(path.relative_to(ROOT)),'bytes':path.stat().st_size,
          'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'width':asset['width'],
          'height':asset['height'],'alpha':asset['alpha'],'status':'pass'})
report={'date':'2026-10-15','result':'pass','masters':30,'roles':90,
    'cashCost':0,'runtimeBytes':sum(record['bytes'] for record in records),'exports':records,
    'checks':['Original generator SHA256 intact','30 masters 768x1024','90 exact dimensions and files',
      'Alpha declarations match pixels','Matte top-left clean','Stable role IDs, pivots and es/en labels',
      'Individual visual review record exists'],
    'limits':'Asset production validation. Not gameplay, persistence, mobile physical evidence or a human retention test.'}
(DESIGN/'evidence/production-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('PAINTED_PRODUCTION_PASS',30,'masters',90,'roles',report['runtimeBytes'],'bytes')
