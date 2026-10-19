"""Additional read-only source inventories; not computed-style or runtime validation."""
from pathlib import Path
import hashlib,json,re
ROOT=Path(__file__).resolve().parents[4]
OUT=Path(__file__).resolve().parents[1]
PRESENTATION=ROOT/'src/arcana/presentation'
styles=[]
for f in sorted(PRESENTATION.rglob('*.css')):
    s=f.read_text()
    styles.append({'path':str(f.relative_to(ROOT)), 'lines':len(s.splitlines()),
        'keyframes':re.findall(r'@keyframes\s+([\w-]+)',s),
        'animationDeclarations':re.findall(r'\banimation(?:-[\w-]+)?\s*:[^;{}]+',s),
        'hasSystemReducedSelector':'prefers-reduced-motion' in s,
        'hasOwnReducedSelector':'arcana-reduced-motion' in s,
        'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
(OUT/'styles-motion-inventory.json').write_text(json.dumps({'method':'CSS source declarations only; cascade/import/use and effective timing require runtime. Loops remain loops even when node count is bounded.','entries':styles},ensure_ascii=False,indent=2)+'\n')
controls=[]
for f in sorted(PRESENTATION.rglob('*.tsx')):
    s=f.read_text()
    for m in re.finditer(r'<(button|summary|input|dialog|meter|progress)\b',s):
        sample=s[m.start():m.start()+550]
        controls.append({'path':str(f.relative_to(ROOT)), 'line':s.count('\n',0,m.start())+1,
          'element':m.group(1),'sourceExcerpt':sample,
          'note':'Lexical anchor, not an element parser; JSX expressions may continue outside excerpt; conditional/loop occurrences are not rendered counts.'})
(OUT/'control-occurrences.json').write_text(json.dumps(controls,ensure_ascii=False,indent=2)+'\n')
base=json.loads((PRESENTATION/'content-packs/arcana/messages.json').read_text())
other=json.loads((PRESENTATION/'content-packs/diagon-alley/messages.json').read_text())
locale=[]
for pack,msg in [('arcana',base),('diagon-alley',{**base,**other})]:
    problems=[]; lengths=[]
    for key,val in msg.items():
        if not isinstance(val,dict): problems.append({'key':key,'problem':'not bilingual object'});continue
        for lang in ['es','en']:
            if not isinstance(val.get(lang),str) or not val[lang].strip():problems.append({'key':key,'problem':'missing/empty '+lang})
        es=set(re.findall(r'\{([^{}]+)\}',val.get('es',''))); en=set(re.findall(r'\{([^{}]+)\}',val.get('en','')))
        if es!=en:problems.append({'key':key,'problem':'parameter mismatch','es':sorted(es),'en':sorted(en)})
        lengths.append({'key':key,'es':val.get('es'),'en':val.get('en'),'characters':{l:len(val.get(l,'')) for l in ['es','en']}})
    locale.append({'pack':pack,'effectiveMessageKeys':len(msg),'problems':problems,'entries':lengths})
(OUT/'localization-inventory.json').write_text(json.dumps({'method':'Effective pack JSON messages, merging Diagon overrides as active.ts. Not all TS-local message modules, dynamic prose, grammar validation or visible word counts. Longest string does not imply UI overload.','packs':locale},ensure_ascii=False,indent=2)+'\n')
summary={'cssFiles':len(styles),'declaredKeyframes':sum(len(x['keyframes']) for x in styles),'controlSourceAnchors':len(controls),'packMessageKeys':{x['pack']:x['effectiveMessageKeys'] for x in locale},'packMessageParameterOrMissingIssues':sum(len(x['problems']) for x in locale)}
print(json.dumps(summary,ensure_ascii=False,indent=2))
lines=['# Controles, iconos y estilos: trazabilidad','', 'Inventario lexical de todos los TSX/CSS bajo presentation, no una estimación de botones simultáneos. Las instancias se multiplican por datos y muchas ramas se excluyen. La evaluación contextual se encuentra en SCREENS y DESIGN-SYSTEM. Cada ocurrencia de control tiene ruta/línea/extracto en control-occurrences.json.','', '## Componentes','', '| Componente | Botones/summary/dialog/input en fuente | Claves de arte literales |','| --- | --- | --- |']
source=json.loads((OUT/'control-source-inventory.json').read_text())['entries']
for x in source:
    lines.append(f"|`{x['path'].removeprefix('src/arcana/presentation/')}`|{x['staticButtonTags']}/{x['summaryTags']}/{x['dialogTags']}/{x['inputTags']}|{', '.join(x['literalAssetKeys']) or 'Dinámico, heredado o sin Artwork literal; no ausencia demostrada de arte'}|")
lines+=['','## Hojas de estilo y movimiento declarado','', '| Archivo | Keyframes locales | Selectores de reducido propios/sistema |','| --- | --- | --- |']
for x in styles:
    lines.append(f"|`{x['path'].removeprefix('src/arcana/presentation/')}`|{', '.join(x['keyframes']) or 'Ninguno local; puede consumir otros'}|{x['hasOwnReducedSelector']}/{x['hasSystemReducedSelector']}|")
lines+=['','Un CSS sin selector reducido local no demuestra incumplimiento: puede heredar regla o no animar. Un keyframe declarado no demuestra consumidor visible. Ver styles-motion-inventory.json para declaraciones exactas; resolver cascada/tiempos efectivos en Linux al implementar.','', '## Localización','', f"JSON efectivos por pack: {len(base)} claves ARCANA; {len({**base,**other})} Diagon después del merge explícito. Problemas de campo vacío/parámetros: {summary['packMessageParameterOrMissingIssues']}. No es una aprobación lingüística ni cubre todos los módulos TS de cuenta/temporada/recuperación. Esos consumidores se revisan por sus fichas y COPY. El inventario conserva texto exacto ES/EN para edición posterior.",'', '## Reglas de revisión de cada control','', 'Acción pagada: coste+estado busy+recuperación. Selección: marca+aria-pressed+preview sin gasto. Consulta: foco/toque/hover+retorno sin escritura. Sistema: símbolo visible sin arte y nombre localizado. Nombre accesible no basta para una persona que toca un botón vacío. Número de botones no mide claridad: valorar la jerarquía y consecuencias del episodio.']
(OUT/'CONTROLS-STYLES.md').write_text('\n'.join(lines)+'\n')
