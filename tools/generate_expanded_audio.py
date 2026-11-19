"""Synthesize authored fixed-lesson Brazilian Portuguese words and sentences.

No learner data, microphone audio, or online speech API is read. Generated files
are published only after every normal/slow MP3 passes validation.
"""
import hashlib
import json
import os
import re
import subprocess
import tempfile
import unicodedata
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/'


def normalized(text):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', text)).strip().lower()


def main():
    inventory = json.loads(subprocess.check_output(
        ['node', 'tools/list_expanded_audio.mjs'], cwd=ROOT, text=True))
    old = json.loads((ROOT / 'audio/natural-manifest.json').read_text())
    conversation = json.loads((ROOT / 'audio/conversation-manifest.json').read_text())
    existing = set(old['clips']) | set(conversation['clips'])
    needed = {normalized(text): text for text in inventory['texts']
              if normalized(text) not in existing}
    if not 250 <= len(needed) <= 400:
        raise ValueError(f'Unexpected missing-audio count: {len(needed)}')
    print(f'Public teaching text: {len(inventory["texts"])} targets; '
          f'{len(needed)} need new normal/slow clips.', flush=True)

    import numpy as np
    import soundfile as sf
    from kokoro_onnx import Kokoro

    output = ROOT / 'audio/expanded-v1'
    output.mkdir(parents=True, exist_ok=True)
    clips = {}
    with tempfile.TemporaryDirectory() as directory:
        temp = Path(directory)
        for name in ['kokoro-v1.0.onnx', 'voices-v1.0.bin']:
            urllib.request.urlretrieve(BASE + name, temp / name)
        model_hash = hashlib.sha256((temp / 'kokoro-v1.0.onnx').read_bytes()).hexdigest()
        if model_hash != old['meta']['model_sha256']:
            raise ValueError('Model digest changed; review before generating.')
        synth = Kokoro(str(temp / 'kokoro-v1.0.onnx'), str(temp / 'voices-v1.0.bin'))
        for index, (key, text) in enumerate(needed.items(), 1):
            record = {'text': text}
            for variant, speed in [('normal', 1.0), ('slow', .75)]:
                spoken = text if text[-1] in '.?!' else text + '.'
                wave, sr = synth.create(spoken, voice='pf_dora', speed=speed, lang='pt-br')
                wave = np.asarray(wave, dtype=np.float32)
                if sr != 24000 or not sr*.12 <= len(wave) <= sr*120 or not np.isfinite(wave).all():
                    raise ValueError('Invalid waveform for ' + text)
                peak = float(np.abs(wave).max())
                rms = float(np.sqrt(np.mean(wave ** 2)))
                if peak < .005 or rms < .0005:
                    raise ValueError('Silent waveform for ' + text)
                wave *= .89 / peak
                wave = np.concatenate([np.zeros(int(.12*sr)), wave, np.zeros(int(.18*sr))])
                wav = temp / 'clip.wav'
                sf.write(wav, wave, sr, subtype='PCM_16')
                path = output / (hashlib.sha256(text.encode()).hexdigest()[:20] + '-' + variant + '.mp3')
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(wav),
                                '-codec:a', 'libmp3lame', '-b:a', '96k', '-ar', '24000', str(path)],
                               check=True)
                details = json.loads(subprocess.check_output([
                    'ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', str(path)], text=True))
                duration = round(float(details['format']['duration']), 3)
                if not .2 <= duration <= 120 or path.stat().st_size < 1500:
                    raise ValueError('Invalid MP3 for ' + text)
                subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'null', '-'],
                               check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
                keys = ('src', 'duration', 'sha256') if variant == 'normal' else ('slowSrc', 'slowDuration', 'slowSha256')
                record.update(zip(keys, [path.relative_to(ROOT).as_posix(), duration,
                                         hashlib.sha256(path.read_bytes()).hexdigest()]))
            clips[key] = record
            if index % 20 == 0 or index == len(needed):
                print(f'Validated {index}/{len(needed)} normal/slow pairs.', flush=True)

    manifest = {'meta': {'version': '2.7.0', 'language': 'pt-BR',
                         'voice': 'Kokoro pf_dora', 'type': 'neural-synthesis',
                         'count': len(clips), 'files': len(clips)*2,
                         'normalRate': 1, 'slowRate': .75,
                         'model_sha256': model_hash}, 'clips': clips}
    (ROOT / 'audio/expanded-manifest.json').write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    script = 'window.BORA_EXPANDED_AUDIO = ' + json.dumps(manifest, ensure_ascii=False, separators=(',', ':')) + ';\n'
    script += 'Object.assign(window.BORA_AUDIO.clips, window.BORA_EXPANDED_AUDIO.clips);\n'
    script += 'window.BORA_AUDIO.meta.count=Object.keys(window.BORA_AUDIO.clips).length;\n'
    script += 'window.BORA_AUDIO.meta.files=window.BORA_AUDIO.meta.count*2;\n'
    (ROOT / 'assets/expanded-audio.js').write_text(script)
    report = {'version': '2.7.0', 'targets': len(inventory['texts']),
              'existing_clips_reused': len(inventory['texts'])-len(clips),
              'new_clips': len(clips), 'new_mp3_files': len(clips)*2,
              'validation': 'All new MP3s decoded and passed duration, non-silence and SHA-256 checks. Not physical-phone listening.',
              'privacy': 'Synthesized public teaching text only; no learner or microphone data.'}
    (ROOT / 'expanded-audio-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    main()
