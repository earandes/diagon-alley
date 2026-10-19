#!/usr/bin/env python3
"""Read-only game-source inventory; writes audit JSON only. No browser, renderer or decode."""
from pathlib import Path
import json,struct,xml.etree.ElementTree as ET,wave,re,hashlib
REPO=Path(__file__).resolve().parents[4]
OUT=Path(__file__).resolve().parent.parent
PACKS=REPO/'src/arcana/presentation/content-packs'
def dimensions(p):
 b=p.read_bytes(); suffix=p.suffix
 if suffix=='.png':return {'width':int.from_bytes(b[16:20],'big'),'height':int.from_bytes(b[20:24],'big'),'alphaHeader':b[25] in [4,6]}
 if suffix=='.svg':
  root=ET.fromstring(b); v=root.get('viewBox'); parts=v.split() if v else []
  return {'viewBox':v,'widthAttribute':root.get('width'),'heightAttribute':root.get('height'),'vector':True,'embeddedRaster':'data:image' in b.decode()}
 if suffix=='.webp':
  kind=b[12:16]
  if kind==b'VP8X':return {'width':1+int.from_bytes(b[24:27],'little'),'height':1+int.from_bytes(b[27:30],'little'),'alphaHeader':bool(b[20]&16)}
  if kind==b'VP8 ' and b[23:26]==b'\x9d\x01\x2a':return {'width':int.from_bytes(b[26:28],'little')&16383,'height':int.from_bytes(b[28:30],'little')&16383,'alphaHeader':False}
  if kind==b'VP8L':
   n=int.from_bytes(b[21:25],'little');return {'width':(n&16383)+1,'height':((n>>14)&16383)+1,'alphaHeader':bool((n>>28)&1)}
 return {'dimensionsNotAssessed':True}
assets=[]; referenced=set(); summaries=[]
for pack in ['diagon-alley','arcana']:
 registry=json.loads((PACKS/pack/'assets.json').read_text()); paths=set()
 for key,v in registry.items():
  p=PACKS/v.get('sourcePack',pack)/v['path']; exists=p.is_file(); rel=str(p.relative_to(REPO)); referenced.add(rel);paths.add(rel)
  assets.append({'pack':pack,'id':key,'path':rel,'exists':exists,'bytes':p.stat().st_size if exists else None,'declared':{k:v[k] for k in ['width','height','alpha','pivot']},'actualHeader':dimensions(p) if exists else None,'alt':v['alt'],'sha256':hashlib.sha256(p.read_bytes()).hexdigest() if exists else None})
 summaries.append({'pack':pack,'registryEntries':len(registry),'uniqueReferencedPaths':len(paths),'referencedBytes':sum((REPO/p).stat().st_size for p in paths if (REPO/p).exists())})
importable=sorted(p for p in PACKS.glob('*/art/**/*') if p.is_file() and p.suffix in ['.png','.svg','.webp'])
notregistered=[{'path':str(p.relative_to(REPO)),'bytes':p.stat().st_size} for p in importable if str(p.relative_to(REPO)) not in referenced]
(OUT/'assets-inventory.json').write_text(json.dumps({'method':'Resolve sourcePack overrides exactly as art.ts; measure headers/bytes, no renderer. Registry-bound is not proof every key is currently visible. Not registry-referenced is not proof unused: CSS, direct URLs and PWA consumers remain to check.','packs':summaries,'entries':assets,'missing':[a for a in assets if not a['exists']],'allImportMetaGlobPaths':len(importable),'allImportableBytes':sum(p.stat().st_size for p in importable),'notRegistryReferenced':notregistered},ensure_ascii=False,indent=2)+'\n')
audio=[]
for p in sorted((REPO/'src/arcana/presentation/audio/assets').glob('*.wav')):
 with wave.open(str(p)) as w:
  audio.append({'path':str(p.relative_to(REPO)),'bytes':p.stat().st_size,'channels':w.getnchannels(),'sampleRate':w.getframerate(),'bits':w.getsampwidth()*8,'frames':w.getnframes(),'seconds':w.getnframes()/w.getframerate(),'compression':w.getcomptype(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(OUT/'audio-inventory.json').write_text(json.dumps({'method':'wave header only; no playback, psychoacoustic evaluation or physical device','entries':audio,'totalBytes':sum(a['bytes'] for a in audio)},indent=2)+'\n')
source=[]
for p in sorted((REPO/'src/arcana/presentation').glob('**/*.tsx')):
 s=p.read_text();source.append({'path':str(p.relative_to(REPO)),'lines':len(s.splitlines()),'staticButtonTags':len(re.findall(r'<button\b',s)),'summaryTags':len(re.findall(r'<summary\b',s)),'dialogTags':len(re.findall(r'<dialog\b',s)),'inputTags':len(re.findall(r'<input\b',s)),'literalAssetKeys':sorted(set(re.findall(r'asset="([^"]+)"',s))),'sha256':hashlib.sha256(s.encode()).hexdigest()})
(OUT/'control-source-inventory.json').write_text(json.dumps({'method':'Lexical source occurrences, including conditional branches/loops. NOT simultaneous visible controls, click counts, rendered size or accessibility pass.','entries':source},indent=2)+'\n')
print(json.dumps({'packs':summaries,'registryRecords':len(assets),'uniqueReferenced':len(referenced),'missing':sum(not a['exists'] for a in assets),'importable':len(importable),'notRegistryReferenced':len(notregistered),'importableBytes':sum(p.stat().st_size for p in importable),'audioFiles':len(audio),'audioBytes':sum(a['bytes'] for a in audio),'tsxFiles':len(source)},indent=2))
