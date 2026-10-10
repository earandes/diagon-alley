"""Encode existing, unchanged pixels for runtime. No crop/retouch/generation.
Run with the bundled Python/Pillow recorded in docs/visual-i1-v2/REPORT.md.
"""
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parents[2]
SOURCES = {
    'interior': 'design/concepts/weasley-flow-v1/01-weasley-interior-es.png',
    'closed': 'design/concepts/weasley-flow-v1/02-chocolate-frog-closed-es.png',
    'revealed': 'design/concepts/weasley-flow-v1/03-wizard-card-revealed-es.png',
    'alley': 'design/assets/preparation-v1/callejon-background-v1.png',
    'frog': 'design/assets/preparation-v1/chocolate-frog-v1.png',
}
for name, source in SOURCES.items():
    target = ROOT / 'public/art' / f'{name}-v1.webp'
    with Image.open(ROOT / source) as image:
        image.save(target, 'WEBP', quality=85, method=6)
        print(name, image.size, target.stat().st_size)
