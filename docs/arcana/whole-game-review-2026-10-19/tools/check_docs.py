"""Validate this documentation package only; never launch app/browser/services."""
from pathlib import Path
import hashlib
import json
import re
import subprocess

HERE = Path(__file__).resolve().parents[1]
ROOT = HERE.parents[2]
errors = []
links = 0
for path in HERE.glob('*.md'):
    for target in re.findall(r'\]\(([^)]+)\)', path.read_text()):
        if target.startswith(('https://', 'http://', '#')):
            continue
        target = target.split('#', 1)[0].strip('<>')
        if not target:
            continue
        links += 1
        if not (path.parent / target).exists():
            errors.append(f'{path.name}: missing link {target}')

screens = json.loads((HERE / 'screens.json').read_text())
findings = json.loads((HERE / 'findings.json').read_text())
assert len(screens) == 68 and len({s['id'] for s in screens}) == 68
assert len(findings) == 18 and len({f['id'] for f in findings}) == 18
components = set()
for screen in screens:
    for component in screen['componentFiles']:
        components.add(component)
        if not (ROOT / 'src/arcana/presentation' / component).exists():
            errors.append(f"{screen['id']}: missing component {component}")
assets = json.loads((HERE / 'assets-inventory.json').read_text())
for entry in assets['entries']:
    source = ROOT / entry['path']
    if not source.exists() or hashlib.sha256(source.read_bytes()).hexdigest() != entry['sha256']:
        errors.append(f"Asset stale or absent: {entry['pack']} {entry['id']}")
provenance = json.loads((HERE / 'evidence/provenance.json').read_text())
for row in provenance:
    source = ROOT / row['path']
    if not source.exists() or hashlib.sha256(source.read_bytes()).hexdigest() != row['sha256']:
        errors.append(f"Evidence hash mismatch {row['id']}")

def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, text=True).strip()

tracked_changes = git('diff', '--name-only', 'HEAD')
if tracked_changes:
    errors.append('Tracked files changed: ' + tracked_changes)
result = {
    'scope': 'Documentation coherence, local headers and hashes only; no runtime tests',
    'screens': len(screens), 'findings': len(findings),
    'priorities': {level: sum(f['severity'] == level for f in findings) for level in ['P0','P1','P2','P3']},
    'componentPathsChecked': len(components), 'relativeLinksChecked': links,
    'assetReferencesChecked': len(assets['entries']), 'imageEvidenceHashesChecked': len(provenance),
    'trackedChangesAgainstHead': tracked_changes.splitlines(),
    'head': git('rev-parse', 'HEAD'), 'headTree': git('rev-parse', 'HEAD^{tree}'),
    'fetchedOriginMain': git('rev-parse', 'origin/main'),
    'mainTree': git('rev-parse', 'origin/main^{tree}'),
    'newBrowserOrTestExecution': False,
    'errors': errors,
}
(HERE / 'documentation-check.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(result, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
