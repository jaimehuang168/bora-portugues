"""Build the v2.3 public conversation curriculum and neural MP3s.
Packed inputs are data only, decoded into readable JSON; never eval/exec them.
This script never reads learner data and does not modify index.html.
"""
import base64
import gzip
import hashlib
import json
import re
import subprocess
import tempfile
import unicodedata
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_SHA = 'e48d5be8e60edf3dd7ea8a98c9a101801fd61bfe0db41699fe13589be6bda810'
BASE = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/'

def normalized(s):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', s)).strip().lower()

def main():
    parts = ['conversation_content.b64'] + [f'conversation_content.part{i}.b64' for i in range(2, 5)]
    encoded = ''.join((ROOT / 'tools' / name).read_text().strip() for name in parts)
    raw = gzip.decompress(base64.b64decode(encoded, validate=True))
    if hashlib.sha256(raw).hexdigest() != DATA_SHA:
        raise ValueError('Curriculum payload checksum mismatch')
    data = json.loads(raw)
    assert data['locale'] == 'pt-BR' and len(data['rounds']) == 18 and len(data['words']) == 54
    for item in data['rounds']:
        assert len(item['examples']) == 2 and len(item['words']) == 3
        assert all(w in data['words'] for w in item['words'])
    assets = ROOT / 'assets'
    assets.mkdir(exist_ok=True)
    (assets / 'conversation-content.json').write_bytes(raw)
    (assets / 'conversation-content.js').write_text('window.BORA_DIALOG_CONTENT = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c') + ';\n')
    old = json.loads((ROOT / 'audio/natural-manifest.json').read_text())
    texts = [e['pt'] for row in data['rounds'] for e in row['examples']]
    for word in data['words'].values():
        texts += [word['term']] + [v['pt'] for v in word['related'] + word['associated']]
    needed = {normalized(t): t for t in texts if normalized(t) not in old['clips']}
    assert len(needed) == 197
    print(f'Curriculum verified: 18 rounds / 36 examples / 54 keywords / {len(needed)} new audio texts', flush=True)
    import numpy as np
    import soundfile as sf
    from kokoro_onnx import Kokoro
    out = ROOT / 'audio/conversation-v1'
    out.mkdir(parents=True, exist_ok=True)
    results = {}
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        for name in ['kokoro-v1.0.onnx', 'voices-v1.0.bin']:
            urllib.request.urlretrieve(BASE + name, tmp / name)
        model_hash = hashlib.sha256((tmp / 'kokoro-v1.0.onnx').read_bytes()).hexdigest()
        if model_hash != old['meta']['model_sha256']:
            raise ValueError('Model changed; review before synthesis')
        kokoro = Kokoro(str(tmp / 'kokoro-v1.0.onnx'), str(tmp / 'voices-v1.0.bin'))
        count = 0
        for key, text in needed.items():
            record = {'text': text}
            for variant, speed in [('normal', 1.0), ('slow', .75)]:
                spoken = text if text[-1] in '.?!' else text + '.'
                wave, sr = kokoro.create(spoken, voice='pf_dora', speed=speed, lang='pt-br')
                wave = np.asarray(wave, dtype=np.float32)
                if sr != 24000 or len(wave) < sr * .12 or len(wave) > sr * 120 or not np.isfinite(wave).all():
                    raise ValueError('Invalid waveform: ' + text)
                peak = float(np.abs(wave).max())
                if peak < .005 or float(np.sqrt(np.mean(wave ** 2))) < .0005:
                    raise ValueError('Silent waveform: ' + text)
                wave *= .89 / peak
                wave = np.concatenate([np.zeros(int(.12*sr)), wave, np.zeros(int(.18*sr))])
                wav = tmp / 'clip.wav'
                sf.write(wav, wave, sr, subtype='PCM_16')
                path = out / (hashlib.sha256(text.encode()).hexdigest()[:20] + '-' + variant + '.mp3')
                subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','96k','-ar','24000',str(path)], check=True)
                info = json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(path)], text=True))
                duration = round(float(info['format']['duration']), 3)
                if not .2 <= duration <= 120 or path.stat().st_size < 1500:
                    raise ValueError('Invalid MP3: ' + text)
                subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','null','-'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
                fields = ('src','duration','sha256') if variant == 'normal' else ('slowSrc','slowDuration','slowSha256')
                record.update(zip(fields,[path.relative_to(ROOT).as_posix(),duration,hashlib.sha256(path.read_bytes()).hexdigest()]))
                count += 1
                if count % 20 == 0 or count == len(needed)*2:
                    print(f'Validated {count}/{len(needed)*2} MP3 files',flush=True)
            results[key] = record
    bank = {'meta':{'version':'2.3.0','voice':'Kokoro pf_dora','language':'pt-BR','type':'neural-synthesis','count':len(results),'files':len(results)*2,'model_sha256':model_hash,'normalRate':1,'slowRate':.75},'clips':results}
    (ROOT/'audio/conversation-manifest.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
    js = 'window.BORA_CONVERSATION_AUDIO = '+json.dumps(bank,ensure_ascii=False,separators=(',',':'))+';\n'
    js += 'Object.assign(window.BORA_AUDIO.clips,window.BORA_CONVERSATION_AUDIO.clips);\n'
    js += 'window.BORA_AUDIO.meta.count=Object.keys(window.BORA_AUDIO.clips).length;\nwindow.BORA_AUDIO.meta.files=window.BORA_AUDIO.meta.count*2;\n'
    (assets/'conversation-audio.js').write_text(js)
    report = {'version':'2.3.0','rounds':18,'examples':36,'keywords':54,'new_texts':len(results),'new_mp3_files':len(results)*2,'total_texts':len(old['clips'])+len(results),'curriculum_sha256':DATA_SHA,'validation':'Every new MP3 passed full decoding, duration, finite/non-silent waveform and checksum checks. Not native-speaker review or physical-phone listening.','privacy':'Only original public curriculum was synthesized locally on the runner; no learner data or cloud TTS API.'}
    (ROOT/'conversation-generation-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False),flush=True)

if __name__ == '__main__':
    main()
