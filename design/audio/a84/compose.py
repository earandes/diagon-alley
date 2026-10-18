"""Original A84 audio, deterministic offline additive/FM synthesis. Python stdlib only.
No film recordings, sampled instruments, external model or runtime generation.
Run from repository root: python3 design/audio/a84/compose.py
"""
import array
import hashlib
import json
import math
import random
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUTPUT = ROOT / 'src/arcana/presentation/audio/assets'
RATE = 24000
TAU = math.tau

def sine(frequency, t):
    return math.sin(TAU * frequency * t)

def ambient(t):
    # 24s circular harmony: Am(add9), Fmaj7, Dm(add9), Em7. Sparse glass/wood bells.
    chords = ((45,52,59,64), (41,48,52,57), (38,45,52,53), (40,47,50,55))
    pad = 0.
    for c, chord in enumerate(chords):
        distance = ((t - (3 + 6*c) + 12) % 24) - 12
        weight = math.cos(math.pi * distance / 7.6)**2 if abs(distance) < 3.8 else 0.
        if not weight:
            continue
        for note in chord:
            frequency = round((440 * 2**((note-69)/12))*24)/24
            pad += weight * (.018*sine(frequency,t) + .004*sine(frequency*2,t))
    bell = 0.
    for onset, note in ((.7,76),(3.4,83),(7.1,81),(10.4,76),(13.3,77),(17.4,84),(19.5,79),(22.1,74)):
        dt = (t - onset) % 24
        f = 440*2**((note-69)/12)
        envelope = (1-math.exp(-dt/.016))*math.exp(-dt/1.15)
        bell += .042*envelope*(sine(f,dt)+.18*math.exp(-dt/.3)*sine(f*2.76,dt))
    return 1.6*(pad + bell + .008*sine(110,t)*(1+.2*sine(1/24,t)))

def effect(name, t, duration, noise):
    x=t/duration
    envelope=math.sin(math.pi*x)**2
    if name=='cast-fire':
        return envelope*(.2*noise+.15*math.sin(TAU*(900*t-1600*t*t)))
    if name=='cast-alchemy':
        return envelope*(.19*math.sin(TAU*(270*t+900*t*t))+.045*sine(1250,t))
    if name=='cast-shadows':
        return envelope*(.12*noise+.13*math.sin(TAU*(220*t-140*t*t)))
    if name=='cast-neutral':
        return envelope*(.16*sine(680,t)+.06*sine(1017,t))
    if name=='impact':
        return 2.5*envelope*math.exp(-x*4)*(.40*noise+.22*sine(170,t))
    if name=='miss':
        return envelope*(.17*noise+.025*sine(1420,t))
    if name=='burn':
        return 2.5*envelope*(.17*noise+.05*sine(430,t))*math.exp(-x*2)
    return envelope*(.10*sine(660,t)+.08*sine(825,t)+.055*sine(990,t))

def write(name, duration):
    rng=random.Random(8400+sum(map(ord,name)))
    samples=array.array('h')
    noise=0.
    for index in range(round(duration*RATE)):
        t=index/RATE
        noise=.7*noise+.3*rng.uniform(-1,1)
        value=ambient(t) if name=='ambient' else effect(name,t,duration,noise)
        samples.append(round(max(-.95,min(.95,value))*32767))
    if sys.byteorder!='little':
        samples.byteswap()
    target=OUTPUT/f'{name}.wav'
    with wave.open(str(target),'wb') as file:
        file.setnchannels(1); file.setsampwidth(2); file.setframerate(RATE)
        file.writeframes(samples.tobytes())
    return {'id':name,'file':str(target.relative_to(ROOT)), 'durationSeconds':duration,
            'sampleRate':RATE,'channels':1,'format':'PCM16 WAV', 'bytes':target.stat().st_size,
            'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}

OUTPUT.mkdir(parents=True,exist_ok=True)
assets=[write('ambient',24.)]
for name,duration in (('cast-fire',.24),('cast-alchemy',.26),('cast-shadows',.24),('cast-neutral',.22),('impact',.16),('miss',.20),('heal',.36),('burn',.18)):
    assets.append(write(name,duration))
manifest={'version':1,'author':'Original procedural composition for Diagon Alley / ARCANA, A84',
          'tool':'Python stdlib additive/FM synthesis, offline', 'editableSource':'design/audio/a84/compose.py',
          'provenance':'Original generated waveforms; no sampled media, score quotation or third-party recordings',
          'rights':'Project-original composition and source; no franchise audio licence claimed',
          'consumers':'Shared presentation audio for both content packs; no economic/domain effects',
          'assets':assets}
(ROOT/'design/audio/a84/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f'{len(assets)} original assets, {sum(a["bytes"] for a in assets)} bytes')
