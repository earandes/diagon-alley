"""A87 original finite cues. Python standard library; offline, no sampled media.
Run: python3 design/creatures-a87/audio/compose.py
Exports only into this design folder; runtime installation is a separate reviewed step.
"""
from pathlib import Path
import array, hashlib, json, math, random, sys, wave
ROOT = Path(__file__).resolve().parent
RATE = 24000
TAU = math.tau

def compose(name, duration):
    rng = random.Random(8700 + sum(map(ord,name)))
    samples = array.array('h'); noise = 0.
    for index in range(round(RATE*duration)):
        t=index/RATE; x=t/duration
        noise=.68*noise+.32*rng.uniform(-1,1)
        envelope=math.sin(math.pi*x)**2
        if name=='cast-order':
            value=.16*math.sin(TAU*523.25*t)+.10*math.sin(TAU*659.25*t)+.06*math.sin(TAU*783.99*t)
        elif name=='cast-death':
            value=.15*math.sin(TAU*(260*t-130*t*t))+.08*math.sin(TAU*391*t)+.12*noise
        elif name=='cast-creatures':
            value=(.15*math.sin(TAU*190*t)+.22*noise)*(1+.15*math.sin(TAU*22*t))
        elif name=='cast-phoenix':
            value=.19*math.sin(TAU*(620*t+420*t*t))+.08*math.sin(TAU*(930*t+630*t*t))+.05*noise
        elif name=='cast-hippogriff':
            value=.27*noise*(.65+.35*math.sin(TAU*27*t))+.12*math.sin(TAU*(320*t-220*t*t))
        elif name=='cast-unicorn':
            value=.17*math.sin(TAU*660*t)+.11*math.sin(TAU*990*t)+.05*math.sin(TAU*1320*t)
        else:
            value=.24*noise+.14*math.sin(TAU*(180*t+140*t*t))+.06*math.sin(TAU*360*t)
        # Both edges are exactly silent; no discontinuous activation/pop.
        samples.append(round(max(-.75,min(.75,value*envelope))*32767))
    normalized=[x/32768 for x in samples]
    if sys.byteorder!='little':samples.byteswap()
    path=ROOT/(name+'.wav')
    with wave.open(str(path),'wb') as out:
        out.setnchannels(1);out.setsampwidth(2);out.setframerate(RATE);out.writeframes(samples.tobytes())
    return dict(id=name,file=path.name,durationSeconds=duration,sampleRate=RATE,channels=1,
                format='PCM16 WAV',bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
                peak=max(map(abs,normalized)),rms=math.sqrt(sum(v*v for v in normalized)/len(normalized)),dc=sum(normalized)/len(normalized))

assets=[compose(n,d) for n,d in [('cast-order',.28),('cast-death',.24),('cast-creatures',.22),('cast-phoenix',.32),('cast-hippogriff',.26),('cast-unicorn',.34),('cast-dragon',.30)]]
manifest=dict(version=1,author='Original A87 offline synthesis for this project',editableSource='compose.py',
              provenance='Deterministic additive/noise synthesis; no film recording, third-party sample or score quotation',
              rights='Project-original cues; no franchise audio license claimed',
              status='Design exports; runtime consumption and browser opt-in checks pending',assets=assets)
(ROOT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
assert all(a['peak']<.75 and abs(a['dc'])<.003 and a['rms']>.03 for a in assets)
print(f'{len(assets)} original cues, {sum(a["bytes"] for a in assets)} bytes; no runtime files modified')
