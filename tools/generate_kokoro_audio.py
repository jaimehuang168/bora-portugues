"""Generate original public lessons locally with Kokoro, not a cloud speech API."""
import hashlib
import json
import re
import subprocess
import tempfile
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = 'e8cb9850a544e78dd60836bf7bf068f978b47314167a0468b7ea74762d112efd'
VOICE = 'pf_dora'
BASE = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/'


def main():
    source = (ROOT / 'index.html').read_bytes()
    if hashlib.sha256(source).hexdigest() != EXPECTED:
        raise RuntimeError('Unexpected live source; stop without modifying the site')
    original = json.loads(re.search(r'window\.BORA_AUDIO = (\{.*?\});\s*</script>', source.decode(), re.S)[1])['clips']
    if len(original) != 222:
        raise RuntimeError('Unexpected public curriculum size')
    out = ROOT / 'audio/natural-v1'
    out.mkdir(parents=True, exist_ok=True)
    results = {}
    count = 0
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        for name in ['kokoro-v1.0.onnx', 'voices-v1.0.bin']:
            print('Downloading public model asset: ' + name, flush=True)
            urllib.request.urlretrieve(BASE + name, tmp / name)
        model_hash = hashlib.sha256((tmp / 'kokoro-v1.0.onnx').read_bytes()).hexdigest()
        kokoro = Kokoro(str(tmp / 'kokoro-v1.0.onnx'), str(tmp / 'voices-v1.0.bin'))
        for key, item in original.items():
            text = item['text']
            record = {'text': text}
            for variant, speed in [('normal', 1.0), ('slow', 0.75)]:
                samples, sr = kokoro.create(text, voice=VOICE, speed=speed, lang='pt-br')
                samples = np.asarray(samples, dtype=np.float32)
                if sr != 24000 or not np.isfinite(samples).all() or len(samples) < sr * .2 or len(samples) > sr * 120:
                    raise ValueError('Invalid synthesized waveform')
                peak = float(np.abs(samples).max())
                rms = float(np.sqrt(np.mean(samples ** 2)))
                if peak < .005 or rms < .0005:
                    raise ValueError('Silent or near-silent output')
                # Peak-normalize, leave headroom, and add small leading/trailing pads.
                samples *= .89 / peak
                samples = np.concatenate([np.zeros(int(.12 * sr)), samples, np.zeros(int(.18 * sr))])
                wav = tmp / 'clip.wav'
                sf.write(wav, samples, sr, subtype='PCM_16')
                path = out / (hashlib.sha256(text.encode()).hexdigest()[:20] + '-' + variant + '.mp3')
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(wav), '-codec:a', 'libmp3lame', '-b:a', '96k', '-ar', '24000', str(path)], check=True)
                info = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_name,sample_rate', '-of', 'json', str(path)], text=True))
                duration = round(float(info['format']['duration']), 3)
                if not 0.2 <= duration <= 120 or path.stat().st_size < 1500:
                    raise ValueError('Invalid MP3 file')
                subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'null', '-'], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
                fields = ('src', 'duration', 'sha256') if variant == 'normal' else ('slowSrc', 'slowDuration', 'slowSha256')
                record.update(zip(fields, [path.relative_to(ROOT).as_posix(), duration, hashlib.sha256(path.read_bytes()).hexdigest()]))
                count += 1
                if count <= 2 or count % 20 == 0 or count == 444:
                    print(f'Validated {count}/444 neural MP3 files', flush=True)
            results[key] = record
    if len(results) != 222 or count != 444:
        raise RuntimeError('Incomplete pack; do not publish')
    manifest = {'meta': {'version': '2.2.0', 'voice': 'Kokoro pf_dora', 'language': 'pt-BR', 'type': 'neural-synthesis', 'humanRecording': False, 'count': 222, 'files': 444, 'built': datetime.now(timezone.utc).isoformat(), 'normalRate': 1.0, 'slowRate': 0.75, 'sampleRate': 24000, 'bitRate': 96000, 'model_sha256': model_hash, 'description': 'Dora 巴西葡語神經合成音；正常與慢速分別生成，非真人錄音。'}, 'clips': results}
    (ROOT / 'audio/natural-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    report = {'voice': 'Kokoro pf_dora', 'phrases': 222, 'validated_mp3_files': count, 'source_sha256': EXPECTED, 'validation': 'All waveforms finite and non-silent; all 444 MP3s passed duration, size and full decoding checks. Not a native-speaker review or physical-phone test.', 'privacy': 'Neural synthesis ran locally on the build runner using only existing public lesson text. No private learner data was accessed. No cloud speech API was used for this pack.'}
    (ROOT / 'audio/natural-generation-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report), flush=True)


if __name__ == '__main__':
    main()
