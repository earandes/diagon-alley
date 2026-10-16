---
license: apache-2.0
tags:
- mlx
- mflux
base_model: black-forest-labs/FLUX.2-klein-4B
pipeline_tag: text-to-image
---

# mlx-community/flux2-klein-4b-4bit

This repository contains the 4-bit quantized weights for `black-forest-labs/FLUX.2-klein-4B`, generated using the `mflux` framework.

**Quantized and Contributed by:** [@lpalbou](https://huggingface.co/lpalbou)

## Usage

You can run this model locally on Apple Silicon using `mflux`:

```bash
pip install mflux

mflux-generate-flux2 --model mlx-community/flux2-klein-4b-4bit --prompt "A beautiful pencil sketch of a landscape" --steps 4 --seed 42