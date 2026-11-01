"""Source-guarded v2.3 integration. Never modifies learner storage or old audio."""
import hashlib
import json
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = '1de049b78305dfd9b8452832b4400a63a98700026ac497f803bc2295db206c26'


def transform(text):
    if hashlib.sha256(text.encode()).hexdigest() != EXPECTED:
        raise ValueError('Unknown index.html; review instead of overwriting')
    def replace(a,b):
        nonlocal text
        if a not in text:
            raise ValueError('Missing source: '+a[:100])
        text=text.replace(a,b)
    replace('</head>','<link rel="stylesheet" href="assets/conversation-learning.css?v=2.3.0">\n</head>')
    marker='<script>\n/* Bora! 2.1'
    replace(marker,'<script src="assets/conversation-content.js?v=2.3.0"></script>\n<script src="assets/conversation-audio.js?v=2.3.0"></script>\n<script src="assets/conversation-learning.js?v=2.3.0"></script>\n'+marker)
    replace("let route='',toastTimer=null;", "const conversationNotes = window.BoraDialogLearning && window.BORA_DIALOG_CONTENT && window.BORA_CONVERSATION_AUDIO ? window.BoraDialogLearning.create({esc,icon,speakBtn,dialogs:C.dialogs}) : {panel:()=>'<p class=\"note\">會話教材未載入，請連線後重新整理；原有會話仍可練習。</p>',page:()=>'<section class=\"panel\"><h1>會話教材未載入</h1><p>請確認網路後重新整理；不必清除學習紀錄。</p><a href=\"#speak\">返回口說練習</a></section>'};\nlet route='',toastTimer=null;")
    replace("if(root==='lesson'||root==='quiz')return 'courses';", "if(root==='conversation')return 'speak';if(root==='lesson'||root==='quiz')return 'courses';")
    replace("else if(root==='speak')html=speakPage();", "else if(root==='conversation')html=conversationNotes.page(arg,route.split('/')[2]);else if(root==='speak')html=speakPage();")
    replace('return pronunciationEntry()+board.banner()', 'return pronunciationEntry()+conversationEntry()+board.banner()')
    replace('function pronunciationEntry(){', '''function conversationEntry(){return `<section class="cg-entry"><div class="row between wrap"><div><b>新增：會話文法與詞彙 v2.3.0</b><p>18 輪解析 · 每輪 2 個例句 · 單字、相關字與情境搭配</p></div><a class="btn small" href="#conversation">會話解析與單字 ${icon('arrow')}</a></div></section>`;}
function pronunciationEntry(){''')
    start=text.index('function speakPage(){');end=text.index('function shadowPage(){',start)
    part=text[start:end]
    old=".join('')}</div>"
    assert old in part
    text=text[:start]+part.replace(old,".join('')}<a class=\"tab\" href=\"#conversation\">會話解析與單字</a></div>")+text[end:]
    start=text.index('function dialogsPage(){');end=text.index('function grammarPage(){',start)
    part=text[start:end]
    part=part.replace('<div class="note mb16">腳本情境練習：','<div class="note mb16"><a href="#conversation">會話解析與單字庫 →</a><br>腳本情境練習：')
    part=part.replace("</button></article>`).join('')", "</button><a class=\"text-btn mt8\" href=\"#conversation/${esc(d.id)}/0\">文法・例句・單字解析 ${icon('chevron')}</a></article>`).join('')")
    part=part.replace('<button class="btn" data-action="end-dialog">回到情境列表</button>', '<button class="btn" data-action="end-dialog">回到情境列表</button> <a class="btn secondary" href="#conversation/${esc(d.id)}/0">複習本情境文法與單字</a>')
    part=part.replace('<button class="text-btn" data-action="speak" data-text="${esc(s.pt)}">${icon(\'volume\')}聽這句</button>', '<div class="row wrap mt8">${speakBtn(s.pt)}${speakBtn(s.pt,true)}</div>')
    part=part.replace('${speakBtn(q.options[q.answer])}</div>', '${speakBtn(q.options[q.answer])}${speakBtn(q.options[q.answer],true)}</div>')
    suffix="</div>`:''}</section></div>`;"
    assert suffix in part
    part=part.replace(suffix,"</div>`:''}${conversationNotes.panel(d.id,dialog.index,{open:dialog.correct})}${dialog.correct?`<button class=\"btn small\" data-action=\"dialog-next\">${dialog.index===d.steps.length-1?'完成對話':'繼續對話'}${icon('arrow')}</button>`:''}</section></div>`;")
    text=text[:start]+part+text[end:]
    replace("case 'start-dialog':", "case 'conversation-practice':if(!C.dialogs.some(d=>d.id===id))break;clearRecording();stopSpeech();speakTab='dialogs';dialog={id,index:0,selected:null,correct:false};go('speak');break;\n  case 'start-dialog':")
    replace("['lesson','cards','speak','grammar','quiz'].includes(root)", "['lesson','cards','speak','grammar','quiz','conversation'].includes(root)")
    replace('正常＋慢速共 444 檔','正常＋慢速共 ${window.BORA_AUDIO.meta.files} 檔')
    replace('Bora! v2.2.0 · 清晰巴葡神經語音','Bora! v2.3.0 · 會話文法與詞彙')
    replace('清晰巴葡發音版 v2.2.0','會話文法與詞彙版 v2.3.0')
    replace('content="2.2.0"','content="2.3.0"')
    replace('Dora 巴葡聲音試聽 · v2.2.0','Dora 巴葡聲音試聽 · v2.3.0')
    assert "KEY = 'bora.ptbr.v2'" in text and "VERSION = 2" in text
    return text


def main():
    old=(ROOT/'index.html').read_text()
    content=json.loads((ROOT/'assets/conversation-content.json').read_text())
    bank=json.loads((ROOT/'audio/conversation-manifest.json').read_text())
    assert len(content['rounds'])==18 and len(content['words'])==54 and len(bank['clips'])==197
    for item in bank['clips'].values():
        for key,hkey in [('src','sha256'),('slowSrc','slowSha256')]:
            path=item[key]
            assert re.fullmatch(r'audio/conversation-v1/[a-f0-9]{20}-(normal|slow)\.mp3',path)
            assert hashlib.sha256((ROOT/path).read_bytes()).hexdigest()==item[hkey],path
    text=transform(old)
    with tempfile.TemporaryDirectory() as tmp:
        for i,script in enumerate(re.findall(r'<script[^>]*>(.*?)</script>',text,re.S)):
            path=Path(tmp)/f'{i}.js';path.write_text(script)
            subprocess.run(['node','--check',str(path)],check=True)
    for name in ['conversation-learning.js','conversation-content.js','conversation-audio.js']:
        subprocess.run(['node','--check',str(ROOT/'assets'/name)],check=True)
    (ROOT/'index.html').write_text(text)
    files=['index.html','assets/conversation-learning.js','assets/conversation-learning.css','assets/conversation-content.js','assets/conversation-content.json','assets/conversation-audio.js','audio/conversation-manifest.json']
    report={'version':'2.3.0','source_index_sha256':EXPECTED,'index_sha256':hashlib.sha256(text.encode()).hexdigest(),'files':{f:hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in files},'dialogs':6,'rounds':18,'examples':36,'keywords':54,'new_audio_texts':197,'new_mp3_files':394,'total_audio_texts':419,'total_mp3_files':838,'storage_key_changed':False,'limits':'Original educational material, not native-speaker review or language certification. Browser tests are reported separately.'}
    (ROOT/'conversation-release-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report),flush=True)

if __name__=='__main__':
    main()
