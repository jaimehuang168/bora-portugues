"""Generate only the existing public curriculum; never read learner data or secrets.
Does not alter the live app. Every clip must succeed before committing the pack.
"""
import asyncio
import hashlib
import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parents[1]
SOURCE_SHA256 = 'e8cb9850a544e78dd60836bf7bf068f978b47314167a0468b7ea74762d112efd'
VOICE = 'pt-BR-FranciscaNeural'
OUT = ROOT / 'audio' / 'natural-v1'


def probe(path):
    if path.stat().st_size < 1500:
        raise ValueError('Audio file too small: ' + str(path))
    raw = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_name,sample_rate', '-of', 'json', str(path)], text=True)
    info = json.loads(raw)
    seconds = float(info['format']['duration'])
    if not 0.2 <= seconds <= 120:
        raise ValueError('Invalid audio duration')
    if not any(s.get('codec_name') == 'mp3' and int(s.get('sample_rate', 0)) >= 24000 for s in info['streams']):
        raise ValueError('Expected MP3 at 24 kHz or above')
    subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'null', '-'], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    return round(seconds, 3)


async def main():
    source = (ROOT / 'index.html').read_bytes()
    if hashlib.sha256(source).hexdigest() != SOURCE_SHA256:
        raise RuntimeError('Unexpected live source; review before generating')
    match = re.search(r'window\.BORA_AUDIO = (\{.*?\});\s*</script>', source.decode(), re.S)
    if not match:
        raise RuntimeError('Original audio bank not found')
    original = json.loads(match[1])['clips']
    if len(original) != 222:
        raise RuntimeError('Unexpected curriculum size')
    OUT.mkdir(parents=True, exist_ok=True)
    semaphore = asyncio.Semaphore(2)
    results = {}
    count = 0

    async def one(key, item, variant, rate):
        nonlocal count
        text = item['text']
        name = hashlib.sha256(text.encode()).hexdigest()[:20] + '-' + variant + '.mp3'
        path = OUT / name
        async with semaphore:
            if not path.exists():
                for attempt in range(3):
                    try:
                        await asyncio.wait_for(edge_tts.Communicate(text, VOICE, rate=rate).save(str(path)), timeout=65)
                        break
                    except Exception as exc:
                        path.unlink(missing_ok=True)
                        if getattr(exc, 'status', None) in (401, 403) or attempt == 2:
                            raise
                        await asyncio.sleep(3 * (attempt + 1))
            duration = await asyncio.to_thread(probe, path)
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            record = results.setdefault(key, {'text': text})
            if variant == 'normal':
                record.update(src=path.relative_to(ROOT).as_posix(), duration=duration, sha256=digest)
            else:
                record.update(slowSrc=path.relative_to(ROOT).as_posix(), slowDuration=duration, slowSha256=digest)
            count += 1
            if count % 20 == 0 or count == 444:
                print(f'Validated {count}/444 MP3 files', flush=True)
            await asyncio.sleep(0.12)

    # Fail early on the first public sample rather than launching a large failing queue.
    first_key = next(iter(original))
    await one(first_key, original[first_key], 'normal', '+0%')
    await one(first_key, original[first_key], 'slow', '-25%')
    print('Normal and slow voice probes passed', flush=True)
    await asyncio.gather(*(one(k, item, variant, rate) for k, item in original.items() for variant, rate in [('normal', '+0%'), ('slow', '-25%')] if not (k == first_key)))
    if len(results) != 222 or any(not x.get('src') or not x.get('slowSrc') for x in results.values()):
        raise RuntimeError('Incomplete audio pack; do not publish')
    manifest = {'meta': {'version': '2.2.0', 'voice': VOICE, 'language': 'pt-BR', 'type': 'neural-synthesis', 'humanRecording': False, 'count': 222, 'files': 444, 'built': datetime.now(timezone.utc).isoformat(), 'normalRate': '+0%', 'slowRate': '-25%', 'sampleRate': 24000, 'description': '巴西葡語神經合成音；正常與慢速分別生成，非真人錄音。'}, 'clips': results}
    (ROOT / 'audio' / 'natural-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    report = {'voice': VOICE, 'phrases': len(results), 'validated_mp3_files': count, 'source_sha256': SOURCE_SHA256, 'validation': 'All files decoded by ffmpeg; duration and codec checked. Not a native-speaker pronunciation review or physical-phone speaker test.', 'privacy': 'Only public fixed curriculum was submitted for synthesis; no learner notes, recordings, visitors or private scripts were accessed.'}
    (ROOT / 'audio' / 'natural-generation-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    asyncio.run(main())
