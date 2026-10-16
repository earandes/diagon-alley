"""Serial native local FLUX.2 image-conditioned edits; inputs never leave disk."""
import argparse
import hashlib
import importlib.metadata
import json
import time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
DESIGN=ROOT/'design/diagon-alley/illustrated-v2'
parser=argparse.ArgumentParser()
parser.add_argument('--plan',default=str(DESIGN/'image-edits-plan.json'))
parser.add_argument('--gpu-coordination-confirmed',action='store_true')
args=parser.parse_args()
if not args.gpu_coordination_confirmed:parser.error('Coordinator must release the GPU first.')
plan=json.loads(Path(args.plan).read_text())
import mlx.core as mx
from mflux.models.common.config import ModelConfig
from mflux.models.flux2.variants import Flux2KleinEdit
start=time.time()
model=Flux2KleinEdit(model_config=ModelConfig.flux2_klein_4b(),model_path=str(ROOT/'.tools/diagon-illustration/models/flux2-klein-4b-4bit'))
print('EDIT_MODEL_READY',flush=True)
records=[]
for id,sample in plan['samples'].items():
    begun=time.time()
    print('EDIT_START',id,flush=True)
    output=DESIGN/'samples'/(id+'--edit-seed-'+str(sample['seed'])+'.png')
    if output.exists():
        raise FileExistsError('Edit attempt already exists: '+str(output))
    image=model.generate_image(seed=sample['seed'],prompt=sample['prompt'],
      image_paths=[str(ROOT/path) for path in sample['imagePaths']],
      width=plan['width'],height=plan['height'],num_inference_steps=plan['steps'],guidance=plan['guidance'])
    image.save(path=str(output),export_json_metadata=True,overwrite=False)
    if not output.is_file():raise RuntimeError('Exact edit output path not saved: '+str(output))
    record={'id':id,'name':sample['name'],'master':str(output.relative_to(ROOT)),
      'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'seed':sample['seed'],
      'promptFile':'design/diagon-alley/illustrated-v2/prompts/'+id+'-edit.txt',
      'model':plan['model'],'modelRevision':plan['revision'],'steps':plan['steps'],'guidance':plan['guidance'],
      'width':plan['width'],'height':plan['height'],'generationSeconds':round(time.time()-begun,2),
      'generationMode':'offline local Metal image-conditioned edit','references':sample['imagePaths'],
      'tool':{'mflux':importlib.metadata.version('mflux'),'mlx':importlib.metadata.version('mlx')},
      'gpuPeakMemoryBytes':int(mx.get_peak_memory()),'cashCost':0,'status':'edited sample pending individual visual review'}
    (DESIGN/'samples'/(id+'-manifest.json')).write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
    records.append(record)
    print('EDIT_COMPLETE',id,record['generationSeconds'],record['gpuPeakMemoryBytes'],flush=True)
    mx.clear_cache()
(DESIGN/'evidence/image-edits-run.json').write_text(json.dumps({'edits':records,'wallSeconds':round(time.time()-start,2),'cashCost':0},ensure_ascii=False,indent=2)+'\n')
print('EDITS_COMPLETE',len(records),flush=True)
