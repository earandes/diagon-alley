#!/bin/sh
# Project-local MLX inference; no paid service or user-wide model cache.
set -eu
project_root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
visual_root="$project_root/.tools/diagon-illustration"
export HF_HOME="$visual_root/cache/huggingface"
export HF_HUB_DISABLE_TELEMETRY=1
export HF_HUB_DISABLE_IMPLICIT_TOKEN=1
export HF_HUB_DISABLE_XET=1
export HF_HUB_OFFLINE=1
export TRANSFORMERS_OFFLINE=1
export MPLCONFIGDIR="$visual_root/cache/matplotlib"
export XDG_CACHE_HOME="$visual_root/cache"
export TORCH_HOME="$visual_root/cache/torch"
export REMBG_HOME="$visual_root/models/segmentation"
export U2NET_HOME="$visual_root/models/segmentation"
export TMPDIR="$project_root/.tools/tmp"
mkdir -p "$MPLCONFIGDIR" "$TORCH_HOME" "$TMPDIR"
exec "$visual_root/venv/bin/python" "$@"
