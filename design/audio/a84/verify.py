"""Numerical asset QA, not a claim of human listening or device loudness."""
import array
import hashlib
import json
import math
import sys
import wave
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
manifest=json.loads((ROOT/'design/audio/a84/manifest.json').read_text())
results=[]
for asset in manifest['assets']:
    path=ROOT/asset['file']
    assert hashlib.sha256(path.read_bytes()).hexdigest()==asset['sha256']
    with wave.open(str(path),'rb') as audio:
        assert audio.getnchannels()==1 and audio.getsampwidth()==2 and audio.getframerate()==24000
        data=array.array('h',audio.readframes(audio.getnframes()))
    if sys.byteorder!='little': data.byteswap()
    values=[x/32768 for x in data]
    peak=max(abs(x) for x in values)
    rms=math.sqrt(sum(x*x for x in values)/len(values))
    dc=sum(values)/len(values)
    seam=abs(values[-1]-values[0])
    assert 0.001<rms<.15 and peak<.3 and abs(dc)<.002
    assert seam<.006, (asset['id'],seam)
    if asset['id']!='ambient': assert abs(values[0])<.001 and abs(values[-1])<.001
    results.append({'id':asset['id'],'peakDbFS':20*math.log10(peak),'rmsDbFS':20*math.log10(rms),
                    'dcOffset':dc,'boundaryStep':seam,'durationSeconds':len(data)/24000,'bytes':path.stat().st_size})
assert sum(a['bytes'] for a in results)<1_300_000
result={'method':'PCM numerical checks only; no physical output or perceptual acceptance claimed',
        'totalBytes':sum(a['bytes'] for a in results),'maximumDecodedMonoFloatBytesAtSourceRate':sum(round(a['durationSeconds']*24000)*4 for a in results),
        'assets':results}
target=ROOT/'docs/arcana/audio-increment-2026-10-18/ASSET-QA.json'
target.write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
