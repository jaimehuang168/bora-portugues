"""Version-guarded v2.1 -> v2.1.1 mobile audio repair.
Only changes public static files. Never reads or migrates user progress.
Usage: python tools/fix_mobile_audio.py [site-directory]
"""
from pathlib import Path
import base64
import hashlib
import json
import re
import subprocess
import sys
import tempfile
ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
PATH = ROOT / 'index.html'
original = PATH.read_bytes()
html = original.decode('utf-8')
MARKER = '<meta name="bora-audio-fix" content="2.1.1">'
if MARKER in html:
    print('Mobile audio repair already applied; nothing changed.')
    sys.exit(0)
blob_sha = hashlib.sha1(b'blob ' + str(len(original)).encode() + b'\0' + original).hexdigest()
if blob_sha != '6d95654a5d6d3d9aa834e7aba0cede29ea8f8b7e':
    raise SystemExit('Source differs from reviewed v2.1; stopped without overwriting.')
changes = []
def replace(old: str, new: str, name: str, count: int = 1) -> None:
    global html
    actual = html.count(old)
    if actual != count:
        raise SystemExit(f'Patch {name}: expected {count} matches; found {actual}. No files written.')
    html = html.replace(old, new)
    changes.append(name)
replace('</head>', MARKER + '\n<style>\n'
        '.bora-native-wrap{border-top:1px solid #d7e2d5;margin-top:12px;padding-top:9px}'
        '.bora-native-wrap p{font-size:12px;line-height:1.6;color:#496453;margin:0 0 6px}'
        '.bora-native-wrap audio{display:block;width:100%;height:44px}'
        '.speech-dock{max-height:65dvh;overflow-y:auto;overscroll-behavior:contain}'
        '@media(max-width:650px){.pron-entry{flex-wrap:wrap}.pron-entry>.row.wrap{width:100%}.speech-dock-actions>.row{flex-wrap:wrap}.speech-dock{max-height:60vh}}'
        '</style>\n</head>', 'visible version marker and mobile transport layout')
replace('const audio = new Audio(); audio.preload = \'auto\';',
        "const audio = new Audio(); audio.preload = 'metadata';\n"
        "  audio.id='bora-native-audio'; audio.controls=true; audio.setAttribute('aria-label','葡語發音：手機原生播放器');\n"
        "  audio.setAttribute('playsinline',''); audio.setAttribute('webkit-playsinline','');\n"
        "  audio.muted=false; audio.volume=1;", 'persistent native audio controls')
replace('audio.onended=audio.onerror=audio.onplaying=null;\n    audio.pause(); audio.removeAttribute(\'src\'); audio.load();',
        "audio.onended=audio.onerror=audio.onplaying=audio.onpause=null;\n"
        "    // Keep the same media element and source between user gestures.\n"
        "    audio.pause();", 'retain media element and source on stop')
replace("if (utterance) { utterance.onend=utterance.onerror=utterance.onstart=null; utterance=null; }\n    try { global.speechSynthesis?.cancel(); } catch (_) {}",
        "if (utterance) {\n      utterance.onend=utterance.onerror=utterance.onstart=null; utterance=null;\n      try { global.speechSynthesis?.cancel(); } catch (_) {}\n    }", 'cancel system speech only when owned')
replace("settings={...config.profile?.()};", "settings={...config.profile?.()};\n    if(['auto','builtin','system'].includes(options.engine))settings.speechEngine=options.engine;\n    let needsGesture=false;", 'per-play engine override without mutating profile')
replace("await waitVoices(session);waitingForVoice=false;", "await waitVoices(session);waitingForVoice=false;needsGesture=true;", 'require fresh tap after asynchronous voice discovery')
replace("// Auto: local device voice > embedded clip > explicitly permitted online voice.\n      if(voice?.localService)return 'system';\n      if(item.clip)return 'builtin';",
        "// Fixed lessons use ready-to-play clips inside the user's tap.\n      if(item.clip)return 'builtin';\n      if(voice?.localService)return 'system';", 'auto prefers built-in clips for fixed lessons')
replace("if(!accepted){stop();return false;}consent=true;", "if(!accepted){stop();return false;}consent=true;needsGesture=true;", 'fresh tap after online-voice consent')
replace("index=0; startCurrent(session);return true;", "index=0;\n    if(needsGesture){source=queue[0].engine;setStatus('ready','語音已備妥，請點「繼續」開始；手機可能要求再次點擊。');return true;}\n    startCurrent(session);return true;", 'ready state rather than delayed unsolicited play')
replace("const failed=()=>{\n      if(!alive())return;", "const failed=(error)=>{\n      if(!alive())return;\n      if(error?.name==='NotAllowedError'||error?.error==='not-allowed'){\n        clearTimeout(watchdog);\n        setStatus('blocked','瀏覽器擋住播放。請點「繼續」，或直接點下方原生播放器的 ▶。');\n        config.onNotice?.(message);return;\n      }", 'explicit blocked-play recovery')
replace("audio.src=item.clip.src; audio.playbackRate=rate;", "audio.src=item.clip.src; audio.muted=false; audio.volume=1; audio.playbackRate=rate;", 'explicit audible media state')
replace("audio.preservesPitch=true; audio.onplaying=playing;audio.onended=completed;audio.onerror=failed;", "audio.preservesPitch=true; audio.onplaying=playing;audio.onended=completed;audio.onerror=failed;\n      audio.onpause=()=>{if(alive()&&!audio.ended&&status==='playing'){clearTimeout(watchdog);setStatus('paused','已暫停；可用下方原生播放器續播，或按繼續重播本句。');}};", 'native pause keeps transport synchronized')
replace("['paused','stopped','done','error'].includes(status)", "['paused','stopped','done','error','blocked','ready'].includes(status)", 'retry from ready and blocked states')
replace("paragraph.split(/(?<=[.!?])\\s+(?=[A-ZÀ-Ý])/).filter(Boolean)", "(paragraph.match(/[^.!?]+[.!?]+(?:[\"'”’]+)?|[^.!?]+$/g)||[paragraph]).map(t=>t.trim()).filter(Boolean)", 'sentence fallback without regex lookbehind')
replace("自動：本機語音優先，內建音檔備援", "自動：固定教材優先內建音，自訂稿用系統", "updated engine label")
replace("case 'pron-test':{const before=state.profile.speechEngine;state.profile.speechEngine='builtin';await speech.play('Oi, tudo bem?',{rate:1,label:'內建音檔測試'});state.profile.speechEngine=before;break;}", "case 'pron-test':{await speech.play('Oi, tudo bem?',{engine:'builtin',rate:1,label:'手機聲音測試 · v2.1.1'});break;}", 'test independent of stored system-voice preference')
replace("<b>現在，就聽一句巴西葡語。</b>", "<b>手機發音修正版 v2.1.1</b>", 'visible mobile repair badge')
replace("<button class=\"btn small\" data-action=\"pron-open\">開始發音練習${icon('arrow')}</button></section>", "<div class=\"row wrap gap8\"><button class=\"btn small\" data-action=\"pron-test\">${icon('volume')}測試手機聲音</button><button class=\"btn outline small\" data-action=\"pron-open\">開始發音練習${icon('arrow')}</button></div></section>", 'one-tap sound test on homepage')
replace("$('#speech-toggle').disabled=s.status==='error';", "$('#speech-toggle').disabled=false;\n const retry=['blocked','ready','error'].includes(s.status);\n if(retry)$('#speech-toggle').innerHTML=icon('play')+'點此播放';\n let nativeWrap=$('#bora-native-wrap');\n if(!nativeWrap){\n  nativeWrap=document.createElement('div');nativeWrap.id='bora-native-wrap';nativeWrap.className='bora-native-wrap';\n  const hint=document.createElement('p');hint.textContent='沒有聲音？直接點下方 ▶；播放時調高手機媒體音量，並確認藍牙輸出。';\n  nativeWrap.appendChild(hint);nativeWrap.appendChild(speech.audioElement);dock.appendChild(nativeWrap);\n }\n nativeWrap.hidden=s.source!=='builtin'||s.mask;", 'native manual playback and retry button')
replace("Bora! v2.1 · 18 個月招商葡文", "Bora! v2.1.1 · 手機發音修正 · 18 個月招商葡文", 'footer version')
scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', html, re.S | re.I)
with tempfile.TemporaryDirectory() as tmp:
    for i, js in enumerate(scripts):
        target = Path(tmp)/f'{i}.js';target.write_text(js,encoding='utf-8')
        subprocess.run(['node','--check',str(target)], check=True, capture_output=True)
match = re.search(r'window\.BORA_AUDIO\s*=\s*(\{.*?\});', html, re.S)
if not match:
    raise SystemExit('Embedded audio bank not found.')
bank = json.loads(match.group(1))
clip = bank['clips']['oi, tudo bem?']['src']
mp3 = base64.b64decode(clip.split(',',1)[1], validate=True)
if not mp3.startswith(b'ID3'):
    raise SystemExit('Unexpected test MP3 header.')
test_html = '''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bora! 手機聲音測試 v2.1.1</title><style>body{font:18px/1.8 system-ui,"Microsoft JhengHei",sans-serif;background:#f5f8f0;color:#20372f;margin:0;padding:24px}main{max-width:640px;margin:auto;background:white;border:1px solid #d7e2d5;padding:25px;border-radius:18px}h1{font-size:26px}audio{width:100%;margin:15px 0}a{color:#17694f}p{overflow-wrap:anywhere}</style></head><body><main><h1>手機聲音測試 · v2.1.1</h1><p>請直接點下方播放器的 <strong>▶</strong>，應聽到「Oi, tudo bem?」。這頁不需要系統葡語語音，也不需要 JavaScript。</p><audio controls preload="metadata" src="./audio-sample.mp3" aria-label="播放巴西葡語測試句"></audio><p><a href="./audio-sample.mp3">直接開啟 MP3 測試</a></p><p>播放時按音量增加鍵，確認調整的是媒體音量，並檢查聲音是否送到藍牙耳機或車機。</p><p>測試有聲音：回到 App 按「測試手機聲音」，固定教材選「自動」或「內建音檔」。測試也沒聲音：改用手機完整瀏覽器，例如 Safari 或 Chrome，而非聊天附件預覽器。</p><p><a href="./?audiofix=2.1.1#home">返回新版 Bora! 練習</a></p><p style="font-size:13px">eSpeak pt-BR 基礎合成音，非真人錄音。此頁不讀取或修改學習紀錄。</p></main></body></html>'''
new_file=PATH.with_suffix('.html.tmp');new_file.write_text(html,encoding='utf-8');new_file.replace(PATH)
(ROOT/'audio-sample.mp3').write_bytes(mp3)
(ROOT/'audio-test.html').write_text(test_html,encoding='utf-8')
report={'version':'2.1.1','original_git_blob':blob_sha,'index_sha256':hashlib.sha256(PATH.read_bytes()).hexdigest(),'audio_clips':len(bank['clips']),'patches':changes,'validation':'JS syntax and deterministic patch checks passed. Real mobile speakers not verified.','privacy':'No storage-key changes, no telemetry, no microphone or user-data upload.'}
(ROOT/'audio-fix-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
