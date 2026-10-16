---
name: local-magic-art
description: Produce editable Colección Mágica scenes, articulated visual studies and local renders with this project's portable Blender. Use for Callejón/Weasley assets and animation; does not implement accounts, prizes or app logic.
---

# Arte local de Colección Mágica

Work from this repository's PRD and DECISIONS. A11/A12 retain the detailed theatrical illustrated direction; experimental geometry is not an approved replacement of that finish. Callejón, Weasley first, ES/EN UI separate from images, and provisional provenance remain required.

## Local tools and cost

- Use `tools/visual/blender.sh` for every Blender invocation. It runs `.tools/blender/Blender.app` and isolates user settings/scripts/temp inside the checkout. Do not install into `/Applications`, change global Codex/MCP settings or add paid services.
- If missing, run `python3 tools/visual/install_blender.py`: official pinned macOS-arm64 bundle, SHA256 checked before execution, code signature verified. Other platforms need a recorded official build/checksum; do not use this bundle there.
- Render/model through Blender's native `bpy` in background mode. No MCP server is required for this workflow; do not invent an active connector or add a remote-execution addon merely to access the API.
- Financial limit is zero: no billed API, purchased credits, trial requiring payment or paid export. Local geometry, materials, rigs and rendering are the default. Electricity, existing hardware and current Codex usage are not newly purchased services; don't promise that production has no time/resource cost.

## Authoring and evidence

Use scripts under `tools/visual/` and outputs under `design/production/`; retain editable `.blend` and reproducible source, poster/clip and manifest. Whole raster cutouts aren't rigs: document actual articulation, meshes/parents/bones, poses and limits. A camera moving through geometry is different from scaling a background. Record that difference.

For new samples, author only the needed callejón stretch, Weasley destination and environmental subjects. Keep other shop fronts decorative/unavailable. No rewards, hidden inventory or authentic sign-in in a visual study. Scripted reveal outputs are labelled and absent from game statistics.

Prefer low-resolution previews before long render sequences. Inspect representative beginning/middle/end frames, then verify render/export files, duration and reference paths. Record commands, Blender version, engine, resolution, fps, cash cost and what wasn't tested. Preserve prior sources. Read the manifest/sample scripts before extending them.

Static/reduced-motion and equivalent DOM navigation stay separate from Blender output. Animation must remain omittable in integration; the domain decides prizes before motion. Do not embed ES/EN functional text into renders.

Detailed installation/choice/evidence lives in `docs/preparacion-i1/ZERO_COST_PIPELINE.md`. Run the sample with `tools/visual/blender.sh --background --factory-startup --python tools/visual/create_scene_sample.py -- --output design/production/m2-v1` when that source exists; it creates a provisional sample, not the application.
