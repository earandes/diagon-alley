"""Read-only A88 audit: run from any cwd; emits JSON, never changes runtime assets."""
from pathlib import Path
import hashlib
import json
import re
import wave

ROOT = Path(__file__).resolve().parents[3]
source = (ROOT / 'src/arcana/presentation/audio/assets.ts').read_text()
references = re.findall(r"new URL\('./assets/([^']+)'", source)
manifest = {}
for relative in ['design/audio/a84/manifest.json', 'design/creatures-a87/audio/manifest.json']:
    for entry in json.loads((ROOT / relative).read_text())['assets']:
        filename = Path(entry['file']).name
        if filename in manifest:
            raise ValueError('Duplicate manifest asset: ' + filename)
        manifest[filename] = entry
rows = []
for filename in references:
    path = ROOT / 'src/arcana/presentation/audio/assets' / filename
    with wave.open(str(path)) as audio:
        row = {
            'file': str(path.relative_to(ROOT)), 'bytes': path.stat().st_size,
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'channels': audio.getnchannels(), 'sampleRate': audio.getframerate(),
            'sampleBytes': audio.getsampwidth(),
            'durationSeconds': audio.getnframes() / audio.getframerate(),
        }
    for field in ['bytes', 'sha256', 'channels', 'sampleRate', 'durationSeconds']:
        if row[field] != manifest[filename][field]:
            raise ValueError(f'{filename}: manifest mismatch for {field}')
    if row['sampleBytes'] != 2:
        raise ValueError(filename + ': expected declared PCM16')
    rows.append(row)
if len(set(references)) != len(references) or set(references) != set(manifest):
    raise ValueError('Active imports and source manifests differ')
print(json.dumps({
    'activeWavs': len(rows), 'totalBytes': sum(row['bytes'] for row in rows),
    'source': 'assets.ts imports matched against A84/A87 manifests',
    'formatAndManifest': 'PASS', 'newQualityOrLoudnessClaims': False, 'rows': rows,
}, indent=2))
