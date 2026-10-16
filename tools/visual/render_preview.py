"""Render an existing project .blend to a local H264 preview, without cloud tools."""
import argparse
import bpy
import json
import sys
import time
from pathlib import Path

root = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser()
parser.add_argument('--source', default='design/production/m2-v1/callejon-m2.blend')
parser.add_argument('--output', default='design/production/m2-v1/walkthrough-preview.mp4')
parser.add_argument('--scale', type=int, default=50)
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
source, output = (root / args.source).resolve(), (root / args.output).resolve()
if not all(p.is_relative_to(root) for p in [source, output]):
    raise ValueError('Render source/output must remain in this project.')
if not 1 <= args.scale <= 100:
    raise ValueError('Scale must be 1..100.')
bpy.ops.wm.open_mainfile(filepath=str(source))
scene = bpy.context.scene
scene.render.resolution_percentage = args.scale
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.render.ffmpeg.constant_rate_factor = 'MEDIUM'
scene.render.filepath = str(output)
output.parent.mkdir(parents=True, exist_ok=True)
start = time.monotonic()
bpy.ops.render.render(animation=True)
receipt = {'blender': bpy.app.version_string, 'source': str(source.relative_to(root)),
           'output': str(output.relative_to(root)), 'cash_cost': 0,
           'frames': scene.frame_end-scene.frame_start+1, 'fps': scene.render.fps,
           'width': scene.render.resolution_x*args.scale//100,
           'height': scene.render.resolution_y*args.scale//100,
           'render_seconds': round(time.monotonic()-start, 2),
           'bytes': output.stat().st_size if output.exists() else None,
           'type': 'local preproduction animatic; not app or final approved art'}
output.with_suffix('.json').write_text(json.dumps(receipt, indent=2)+'\n')
print('LOCAL_VIDEO_RENDERED', receipt, flush=True)
