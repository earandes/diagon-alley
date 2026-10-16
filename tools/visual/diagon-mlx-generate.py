"""Project-local, offline portrait generation with a pinned FLUX.2 model.

Call through diagon-mlx.sh only after the coordinator releases the GPU.
Prompts and generated images are local files; this script makes no API call.
"""
import argparse
import hashlib
import importlib.metadata
import json
import time
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
DESIGN=ROOT/'design/diagon-alley/illustrated-v2'
MODEL=ROOT/'.tools/diagon-illustration/models/flux2-klein-4b-4bit'
parser=argparse.ArgumentParser()
parser.add_argument('--ids',nargs='+',default=['apprentice','circe','merlin'])
parser.add_argument('--gpu-coordination-confirmed',action='store_true')
parser.add_argument('--plan',default=str(DESIGN/'samples-plan.json'))
args=parser.parse_args()
if not args.gpu_coordination_confirmed:
    parser.error('GPU coordination must be explicitly confirmed before local Metal inference.')
plan=json.loads(Path(args.plan).read_text())
for id in args.ids:
    if id not in plan['samples']:
        parser.error('Unknown sample ID: '+id)
if not (MODEL/'transformer/0.safetensors').is_file():
    parser.error('Pinned local model has not finished downloading.')

# Deferred imports keep preparation/inspection from initializing Metal.
import mlx.core as mx
from mflux.models.common.config import ModelConfig
from mflux.models.flux2.variants import Flux2Klein

started=time.time()
print('MODEL_LOAD_START',time.strftime('%Y-%m-%dT%H:%M:%S%z'),flush=True)
model=Flux2Klein(model_config=ModelConfig.flux2_klein_4b(),model_path=str(MODEL))
load_seconds=time.time()-started
print('MODEL_LOAD_COMPLETE',round(load_seconds,2),'seconds',flush=True)
records=[]
for id in args.ids:
    sample=plan['samples'][id]
    # Make attempt identity explicit. MFLUX otherwise silently appends _1/_2.
    output=DESIGN/'samples'/(id+'--seed-'+str(sample['seed'])+'.png')
    if output.exists():
        raise FileExistsError('Attempt already exists; select/archive it or choose a new seed: '+str(output))
    start=time.time()
    print('GENERATE_START',id,sample['seed'],flush=True)
    image=model.generate_image(seed=sample['seed'],prompt=sample['prompt'],
          num_inference_steps=plan['steps'],width=plan['width'],height=plan['height'],guidance=plan['guidance'])
    image.save(path=str(output),export_json_metadata=True,overwrite=False)
    if not output.is_file():
        raise RuntimeError('Generator did not save the exact declared attempt path: '+str(output))
    elapsed=time.time()-start
    record={'id':id,'name':sample['name'],'master':str(output.relative_to(ROOT)),
        'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'seed':sample['seed'],
        'promptFile':'design/diagon-alley/illustrated-v2/prompts/'+id+'.txt',
        'model':plan['model'],'modelRevision':plan['revision'],'steps':plan['steps'],
        'guidance':plan['guidance'],'width':plan['width'],'height':plan['height'],
        'generationSeconds':round(elapsed,2),'loadSeconds':round(load_seconds,2),
        'tool':{'mflux':importlib.metadata.version('mflux'),'mlx':importlib.metadata.version('mlx')},
        'cashCost':0,'generationMode':'offline local Metal text-to-image',
        'gpuPeakMemoryBytes':int(mx.get_peak_memory()),'status':'sample awaiting coordinator visual review'}
    (DESIGN/'samples'/(id+'-manifest.json')).write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
    records.append(record)
    print('GENERATE_COMPLETE',id,round(elapsed,2),'seconds',record['gpuPeakMemoryBytes'],'peak bytes',flush=True)
    mx.clear_cache()
(DESIGN/'evidence/generation-run.json').write_text(json.dumps({'generated':records,'wallSeconds':round(time.time()-started,2),'cashCost':0},ensure_ascii=False,indent=2)+'\n')
print('SAMPLES_COMPLETE',len(records),flush=True)
