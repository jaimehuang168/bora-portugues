"""Apply v2.2 only to the reviewed source and a complete verified neural pack."""
import base64
import hashlib
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

EXPECTED = 'e8cb9850a544e78dd60836bf7bf068f978b47314167a0468b7ea74762d112efd'
BANK_RE = re.compile(r'window\.BORA_AUDIO = (\{.*?\});\s*</script>', re.S)


def transform(source, bank):
    if hashlib.sha256(source.encode()).hexdigest() != EXPECTED:
        raise ValueError('Unknown source; review before upgrading')
    if bank['meta']['type'] != 'neural-synthesis' or len(bank['clips']) != 222:
        raise ValueError('Incomplete neural bank')
    text = BANK_RE.sub(lambda _: 'window.BORA_AUDIO = ' + json.dumps(bank, ensure_ascii=False, separators=(',', ':')) + ';\n</script>', source, count=1)
    def replace(old, new):
        nonlocal text
        if old not in text:
            raise ValueError('Patch source missing: ' + old[:100])
        text = text.replace(old, new)
    replace("download:(!mask && source==='builtin') ? queue[index]?.clip?.src : null", "download:(!mask && source==='builtin') ? clipSource(queue[index]?.clip) : null")
    replace("  function setStatus(next, note='')", "  function clipSource(clip){return rate<=.8 && clip?.slowSrc ? clip.slowSrc : clip?.src;}\n  function clipRate(clip){return rate<=.8 && clip?.slowSrc ? rate/.75 : rate;}\n  function clipDuration(clip){return rate<=.8 && clip?.slowSrc ? clip.slowDuration : clip?.duration;}\n  function setStatus(next, note='')")
    replace('audio.src=item.clip.src; audio.muted=false; audio.volume=1; audio.playbackRate=rate;', 'audio.src=clipSource(item.clip); audio.muted=false; audio.volume=1; audio.playbackRate=clipRate(item.clip);')
    replace('(item.clip.duration/rate+15)*1000', '(clipDuration(item.clip)/clipRate(item.clip)+15)*1000')
    replace("'內建基礎合成音 · eSpeak pt-BR · 非真人'", "`Dora · 巴西葡語神經語音 · ${rate<=.8?'慢速專用音檔':'正常音檔'} · 非真人錄音`")
    replace('音檔未能播放。請以完整瀏覽器開啟下載的 HTML，並檢查音量與媒體權限。', '音檔未能載入。請確認網路連線，並以 Safari／Chrome 開啟網站後再按重播；不會退回舊機械音。')
    replacements = [
        ('手機發音修正版 v2.1.1', '清晰巴葡發音版 v2.2.0'),
        ('Bora! v2.1.1 · 手機發音修正', 'Bora! v2.2.0 · 清晰巴葡神經語音'),
        ('手機聲音測試 · v2.1.1', 'Dora 巴葡聲音試聽 · v2.2.0'),
        ('content="2.1.1"', 'content="2.2.0"'),
        ('固定教材內建合成音；也可選裝置的 pt-BR 語音。', 'Dora 巴西葡語 · 正常／慢速獨立音檔 · 非真人錄音。'),
        ('測試手機聲音', '試聽清晰發音'),
        ('測試內建聲音', '試聽清晰發音'),
        ('自動：固定教材優先內建音，自訂稿用系統', '推薦：固定教材用神經語音，自訂稿用系統'),
        ('內建音檔：離線基礎合成音（較機械）', 'Dora 巴葡神經語音：固定教材'),
        ('固定教材另有內建 eSpeak pt-BR 基礎音檔（非真人，音色較機械）。', '固定教材採 Dora 巴西葡語神經合成音（非真人）。正常與慢速為分開生成的音檔；不再播放舊 eSpeak 音色。'),
        ('內建 ${window.BORA_AUDIO.meta.count} 段基礎合成音已就緒（非真人）', '${window.BORA_AUDIO.meta.count} 句 Dora 巴葡神經語音，正常＋慢速共 444 檔（非真人）'),
        ('${window.BORA_AUDIO.meta.count} 段內建合成音', '${window.BORA_AUDIO.meta.count} 句 × 正常／慢速'),
        ('內建基礎合成音', '巴葡神經合成音'),
        ('內建音較機械，細部口型、音色與自然韻律請老師示範。', '合成示範不能取代老師對口型、地方口音與自然韻律的指導。'),
        ('基礎合成音較機械，不能作為精細發音與自然韻律的唯一示範；請和老師的示範對照。', '慢速按鈕播放專用慢速音檔，不把正常音檔直接拉慢；0.6× 與 1.2× 仍為額外調速。神經合成音不是母語教師審音，請搭配老師練習。'),
        ('單檔模式：文字與內建音檔可離線使用；未啟用 PWA', '下載模式：請確認音檔已包含在檔案中；網站版音檔需連線'),
        ('請在瀏覽器開啟下載的 HTML，不在聊天附件預覽器操作。', '請以 Safari／Chrome 開啟 HTTPS 網站，不在聊天附件預覽器操作。網站音檔按需載入，需網路連線。'),
        ('Fixed original lesson text; eSpeak pt-BR synthesized, not human recordings.', 'Fixed public curriculum; Brazilian neural synthesis, not human recordings.'),
        ('Fixed lessons have embedded eSpeak pt-BR fallback clips (clearly labelled).', 'Fixed lessons use separate normal/slow Brazilian neural MP3s. No formant fallback.'),
    ]
    for old, new in replacements:
        replace(old, new)
    keys = re.findall(r"\bKEY\s*=\s*['\"][^'\"]+['\"]", source)
    assert keys and all(k in text for k in keys)
    return text


def main():
    root = Path(__file__).resolve().parents[1]
    bank = json.loads((root / 'audio/natural-manifest.json').read_text())
    for clip in bank['clips'].values():
        for path_key, hash_key in [('src', 'sha256'), ('slowSrc', 'slowSha256')]:
            relative = clip[path_key]
            if not re.fullmatch(r'audio/natural-v1/[0-9a-f]{20}-(normal|slow)\.mp3', relative):
                raise ValueError('Unexpected audio path')
            if hashlib.sha256((root / relative).read_bytes()).hexdigest() != clip[hash_key]:
                raise ValueError('Audio checksum mismatch: ' + relative)
    text = transform((root / 'index.html').read_text(), bank)
    with tempfile.TemporaryDirectory() as tmp:
        for i, script in enumerate(re.findall(r'<script[^>]*>(.*?)</script>', text, re.S)):
            path = Path(tmp) / f'{i}.js'
            path.write_text(script)
            subprocess.run(['node', '--check', str(path)], check=True)
    (root / 'index.html').write_text(text)
    sample = bank['clips']['oi, tudo bem?']
    shutil.copyfile(root / sample['src'], root / 'audio-sample.mp3')
    shutil.copyfile(root / sample['slowSrc'], root / 'audio-sample-slow.mp3')
    (root / 'audio-test.html').write_text('''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bora! 清晰巴葡發音試聽</title><style>body{max-width:650px;margin:36px auto;padding:20px;font:18px/1.8 system-ui;background:#f5f8f2;color:#20372f}article{background:white;padding:24px;border-radius:18px;margin:20px 0}audio{width:100%}a{color:#17694f}</style></head><body><h1>清晰巴葡發音 v2.2.0</h1><p>Dora · pt-BR 神經合成音，非真人錄音。按播放鍵比較正常與慢速。</p><article><h2 lang="pt-BR">Oi, tudo bem?</h2><p>嗨，你好嗎？</p><p>正常語速</p><audio controls preload="metadata" src="audio-sample.mp3?v=2.2.0"></audio><p>慢速專用音檔（重新合成，非播放器拉慢）</p><audio controls preload="metadata" src="audio-sample-slow.mp3?v=2.2.0"></audio></article><p>播放時請調整媒體音量，並確認藍牙輸出。首次載入需要網路。</p><p><a href="./?voice=2.2.0#pronunciation">返回 Bora! 練習</a></p><p>本頁不讀取學習紀錄，也不要求麥克風權限。</p></body></html>''')
    (root / 'AUDIO_CREDITS.md').write_text('''# Bora! v2.2.0 — Brazilian Portuguese neural audio

Voice: Kokoro-82M `pf_dora`, Brazilian Portuguese neural synthesis, not a human recording or a cloned user voice.

The existing 222 original public curriculum phrases were regenerated into 444 MP3 files: normal speed 1.0 and a separately synthesized slow speed 0.75. Output: mono 24 kHz, 96 kbps MP3, with peak normalization and short silence padding.

Generation: Kokoro v1.0 full-precision ONNX with kokoro-onnx 0.6.1. Kokoro model: Apache-2.0; kokoro-onnx: MIT. espeak-ng is used only for grapheme-to-phoneme conversion, not to render the voice. No old eSpeak formant audio is used by the current app. Model files are not distributed in the site; upstream hashes are recorded in the manifest.

The website serves static MP3s. It does not call a TTS API or expose a key. Audio was generated locally on the build runner from public lesson text. Learner records, visitor cards, microphone recordings and private scripts were not accessed. Custom script system voices retain their existing permission flow.

All waveforms were checked for finite values and non-silence; all 444 MP3s were decoded and checked for duration. These checks are not native-speaker pronunciation review or a physical-phone speaker test. Non-English and very short utterances remain model limitations; practice with a teacher.

References:
- https://huggingface.co/hexgrad/Kokoro-82M
- https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md
- https://github.com/thewh1teagle/kokoro-onnx
''')
    report = {'version': '2.2.0', 'voice': bank['meta']['voice'], 'phrases': 222, 'mp3_files': 444, 'normal_rate': 1.0, 'slow_rate': 0.75, 'separate_slow_recordings': True, 'legacy_formant_fallback': False, 'storage_key_changed': False, 'index_sha256': hashlib.sha256(text.encode()).hexdigest(), 'validation': '444 asset SHA-256 checks and all inline JavaScript syntax checks passed; browser transport tests recorded separately. Physical mobile speakers and native-speaker review not verified.'}
    (root / 'audio-quality-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    standalone = json.loads(json.dumps(bank))
    for clip in standalone['clips'].values():
        for key in ['src', 'slowSrc']:
            clip[key] = 'data:audio/mpeg;base64,' + base64.b64encode((root / clip[key]).read_bytes()).decode()
    offline = BANK_RE.sub(lambda _: 'window.BORA_AUDIO = ' + json.dumps(standalone, ensure_ascii=False, separators=(',', ':')) + ';\n</script>', text, count=1)
    export = root / '.build'
    export.mkdir(exist_ok=True)
    (export / 'Bora-v2.2-Clear-Voice.html').write_text(offline)
    print(json.dumps(report), flush=True)


if __name__ == '__main__':
    main()
