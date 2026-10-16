"""Install the zero-cash-cost local illustration toolchain inside this repo.

No global tools, account, payment, token lookup or hosted inference are used.
The separate inference script is never called here, so installation uses no GPU.
"""
import argparse
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
TOOLS=ROOT/'.tools/diagon-illustration'
EVIDENCE=ROOT/'design/diagon-alley/illustrated-v2/evidence'
MODEL_REVISION='860e87183ceb29e39627c0612ebd66d8ea66e68c'
parser=argparse.ArgumentParser()
parser.add_argument('--download-model',action='store_true')
args=parser.parse_args()
TOOLS.mkdir(parents=True,exist_ok=True)
EVIDENCE.mkdir(parents=True,exist_ok=True)
venv=TOOLS/'venv'
python=venv/'bin/python'
if not python.exists():
    subprocess.run([sys.executable,'-m','venv',str(venv)],check=True)
environment={**os.environ,'PIP_CACHE_DIR':str(TOOLS/'cache/pip'),
    'HF_HOME':str(TOOLS/'cache/huggingface'),'HF_HUB_DISABLE_TELEMETRY':'1',
    'HF_HUB_DISABLE_IMPLICIT_TOKEN':'1','HF_HUB_DOWNLOAD_TIMEOUT':'120',
    'REMBG_HOME':str(TOOLS/'models/segmentation'),'U2NET_HOME':str(TOOLS/'models/segmentation')}
lock=EVIDENCE/'python-requirements.lock.txt'
install=['-r',str(lock)] if lock.exists() else ['mflux==0.22.0']
subprocess.run([str(python),'-m','pip','install',*install],env=environment,check=True)
with lock.open('w') as output:
    subprocess.run([str(python),'-m','pip','freeze'],stdout=output,check=True)
if args.download_model:
    script='''from huggingface_hub import snapshot_download
from pathlib import Path
root=Path.cwd()
snapshot_download(repo_id="mlx-community/flux2-klein-4b-4bit",revision="'''+MODEL_REVISION+'''",local_dir=root/".tools/diagon-illustration/models/flux2-klein-4b-4bit",ignore_patterns=[".DS_Store",".gitattributes"],max_workers=3,token=False)
'''
    subprocess.run([str(python),'-c',script],cwd=ROOT,env=environment,check=True)
    subprocess.run([str(python),'-c','from rembg.sessions.u2net import U2netSession; U2netSession.download_models()'],cwd=ROOT,env=environment,check=True)
print('Local toolchain installed. GPU inference has not been started.')
