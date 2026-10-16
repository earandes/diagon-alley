#!/bin/sh
set -eu
task_root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
task_binary="$task_root/.tools/blender/Blender.app/Contents/MacOS/Blender"
if [ ! -x "$task_binary" ]; then
  printf '%s\n' 'Project Blender missing. Run python3 tools/visual/install_blender.py.' >&2
  exit 1
fi
export BLENDER_USER_CONFIG="$task_root/.tools/blender-user/config"
export BLENDER_USER_SCRIPTS="$task_root/.tools/blender-user/scripts"
export BLENDER_USER_DATAFILES="$task_root/.tools/blender-user/datafiles"
export BLENDER_USER_EXTENSIONS="$task_root/.tools/blender-user/extensions"
export TMPDIR="$task_root/.tools/tmp"
mkdir -p "$BLENDER_USER_CONFIG" "$BLENDER_USER_SCRIPTS" "$BLENDER_USER_DATAFILES" "$BLENDER_USER_EXTENSIONS" "$TMPDIR"
exec "$task_binary" "$@"
