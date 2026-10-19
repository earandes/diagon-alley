"""Read-only numeric mix bound for installed PCM assets; no playback or authoring.
Assumptions checked against A84 GameAudio: master .7, effects bus .75 at max,
up to four simultaneous finite SFX and one ambient source at full music volume.
"""
import array, json, sys, wave
from pathlib import Path
root=Path(__file__).resolve().parents[3]
folder=root/'src/arcana/presentation/audio/assets'
peaks={}
for path in sorted(folder.glob('*.wav')):
    with wave.open(str(path)) as sound:
        assert sound.getsampwidth()==2
        values=array.array('h',sound.readframes(sound.getnframes()))
        if sys.byteorder!='little': values.byteswap()
        peaks[path.stem]=max(map(abs,values))/32768
bound=max(v for k,v in peaks.items() if k!='ambient')*4*.75*.7+peaks['ambient']*.7
assert bound<1
report=dict(peaks=peaks,masterGain=.7,maxEffectsBus=.75,maxVoices=4,maxMusicBus=1,conservativeAbsolutePeakBound=bound,
    limits='PCM absolute-peak sum bound under current gain/voice assumptions. Not perceived loudness, hearing safety, speaker output or human listening.',browserValidation='pending')
Path(__file__).with_name('mix-validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'conservativeAbsolutePeakBound':bound,'assets':len(peaks)}))
