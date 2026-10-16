#!/usr/bin/env python3
"""Install the pinned official Blender bundle inside this checkout on Apple Silicon."""
from pathlib import Path
import hashlib
import json
import platform
import subprocess

ROOT = Path(__file__).resolve().parents[2]
VERSION = '4.5.9'
NAME = f'blender-{VERSION}-macos-arm64.dmg'
URL = f'https://download.blender.org/release/Blender4.5/{NAME}'
SHA256 = 'e3a3d7aac381fb4e4d05197f99cd8899484d7e8bc4497c134066e6733f372238'
TOOLS = ROOT / '.tools'
APP = TOOLS / 'blender' / 'Blender.app'
BINARY = APP / 'Contents' / 'MacOS' / 'Blender'

def run(*args):
    subprocess.run(args, check=True)

def main():
    if platform.system() != 'Darwin' or platform.machine() != 'arm64':
        raise SystemExit('This pinned installer targets macOS Apple Silicon; select an official build for other hosts.')
    if BINARY.exists():
        run(str(ROOT / 'tools' / 'visual' / 'blender.sh'), '--version')
        print('Existing project installation retained. Use tools/visual/blender.sh for isolated preferences.')
        return
    downloads = TOOLS / 'downloads'
    downloads.mkdir(parents=True, exist_ok=True)
    dmg = downloads / NAME
    run('curl', '--fail', '--location', '--retry', '3', '--continue-at', '-', '--output', str(dmg), URL)
    with dmg.open('rb') as source:
        actual = hashlib.file_digest(source, 'sha256').hexdigest()
    if actual != SHA256:
        raise SystemExit(f'Checksum mismatch: {actual}. Bundle was not mounted or executed.')
    mount = downloads / 'blender-volume'
    mount.mkdir(exist_ok=True)
    run('hdiutil', 'attach', '-readonly', '-nobrowse', '-mountpoint', str(mount), str(dmg))
    try:
        APP.parent.mkdir(exist_ok=True)
        run('ditto', str(mount / 'Blender.app'), str(APP))
    finally:
        run('hdiutil', 'detach', str(mount))
    run('codesign', '--verify', '--deep', '--strict', str(APP))
    run(str(ROOT / 'tools' / 'visual' / 'blender.sh'), '--version')
    receipt = dict(version=VERSION, source=URL, source_sha256=SHA256,
                   app_path=str(APP.relative_to(ROOT)), installed_for='this checkout only',
                   global_configuration_changed=False, license='GPL', paid_services_used=False)
    (TOOLS / 'blender' / 'installation.json').write_text(json.dumps(receipt, indent=2) + '\n')
    print('Verified official bundle installed only inside the project.')

if __name__ == '__main__':
    main()
