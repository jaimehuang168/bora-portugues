"""Real Chromium/HTTP/media/localStorage tests; no speech or storage mocks."""
import functools
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
checks=[]
def check(name,ok):
    if not ok:
        raise AssertionError(name)
    checks.append(name)
    print('PASS '+name,flush=True)

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self,*args):
        pass

def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}/'
    out=ROOT/'.build';out.mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
        page=context.new_page();errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        def route(path,selector):
            page.goto(base+'#'+path)
            page.wait_for_selector(selector)
        try:
            route('home','.cg-entry')
            check('Home has v2.3 marker and conversation link','會話文法與詞彙版 v2.3.0' in page.locator('body').inner_text())
            check('Merged neural bank has 419 texts and 838 MP3 variants',page.evaluate('Object.keys(BORA_AUDIO.clips).length===419 && BORA_AUDIO.meta.files===838'))
            route('settings','#profile-name')
            page.locator('#profile-name').fill('升級保存測試')
            page.locator('[data-action="save-profile"]').click()
            before=page.evaluate("JSON.parse(localStorage.getItem('bora.ptbr.v2'))")
            route('conversation','.cg-scenario')
            check('Six scenario cards',page.locator('.cg-scenario').count()==6)
            page.screenshot(path=str(out/'Bora-v2.3-Mobile-Overview.png'),full_page=True)
            rounds=page.evaluate('BORA_DIALOG_CONTENT.rounds.map(r=>({id:r.dialog,step:r.step}))')
            for row in rounds:
                label=f"{row['id']}:{row['step']}"
                route(f"conversation/{row['id']}/{row['step']}",'.cg-example')
                check('Two examples and three keywords '+label,page.locator('.cg-example').count()==2 and page.locator('.cg-word').count()==3)
                check('Both relation types for every keyword '+label,page.locator('.cg-word .cg-relations').count()==6)
                check('Every displayed audio button has both neural assets '+label,page.evaluate("Array.from(document.querySelectorAll('.cg-panel [data-action=speak],.cg-prompt [data-action=speak]')).every(b=>{const k=b.dataset.text.normalize('NFC').replace(/\\s+/g,' ').trim().toLocaleLowerCase('pt-BR');const c=BORA_AUDIO.clips[k];return c&&c.src&&c.slowSrc;})"))
                check('No mobile horizontal overflow '+label,page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
            check('Reading does not mark conversations completed',page.evaluate("JSON.parse(localStorage.getItem('bora.ptbr.v2')).dialogsDone") == before['dialogsDone'])
            route('conversation/coffee-talk/0','.cg-example')
            page.screenshot(path=str(out/'Bora-v2.3-Mobile-Lesson.png'),full_page=True)
            page.locator('.cg-example').first.locator('[data-slow="0"]').click()
            page.wait_for_function("document.querySelector('#bora-native-audio')?.currentTime>.05")
            normal=page.locator('#bora-native-audio').get_attribute('src')
            check('New example plays actual normal MP3','conversation-v1/' in normal and normal.endswith('-normal.mp3'))
            page.locator('[data-action="speech-close"]').click()
            page.locator('.cg-example').first.locator('[data-slow="1"]').click()
            page.wait_for_function("document.querySelector('#bora-native-audio')?.src.endsWith('-slow.mp3') && document.querySelector('#bora-native-audio').currentTime>.05")
            check('Slow selects separate MP3 at native rate 1',page.locator('#bora-native-audio').evaluate('(a)=>a.playbackRate')==1 and page.locator('#bora-native-audio').get_attribute('src')!=normal)
            check('Slow download points at slow MP3',page.locator('#speech-download').get_attribute('href').endswith('-slow.mp3'))
            page.locator('#speech-toggle').click()
            check('Pause stops actual audio',page.locator('#bora-native-audio').evaluate('(a)=>a.paused'))
            page.locator('#speech-toggle').click()
            page.wait_for_function("!document.querySelector('#bora-native-audio').paused")
            page.locator('[data-action="speech-close"]').click()
            page.locator('.cg-word').first.locator('[data-slow="0"]').first.click()
            page.wait_for_function("document.querySelector('#bora-native-audio')?.currentTime>.05")
            check('Keyword has working audio',page.locator('#bora-native-audio').evaluate('(a)=>a.currentTime')>0)
            page.locator('[data-action="speech-close"]').click()
            page.locator('.cg-related').first.locator('[data-slow="1"]').click()
            page.wait_for_function("document.querySelector('#bora-native-audio')?.src.endsWith('-slow.mp3') && document.querySelector('#bora-native-audio').currentTime>.05")
            check('Related word slow audio works',page.locator('#bora-native-audio').evaluate('(a)=>a.currentTime')>0)
            page.locator('[data-action="speech-close"]').click()
            route('conversation/words','#conversation-search')
            check('Vocabulary library has 54 entries',page.locator('.cg-word').count()==54)
            for text in ['報價','cafe','prazo','fazer um pedido']:
                page.locator('#conversation-search').fill(text)
                check('Search finds '+text,page.locator('.cg-word').count()>0)
            page.locator('#conversation-search').fill('<img src=x onerror=alert(1)>')
            check('Search text is not interpreted as HTML',page.locator('#conversation-word-results img').count()==0 and page.locator('.cg-word').count()==0)
            page.locator('#conversation-search').fill('')
            route('conversation/coffee-talk/invalid','.cg-example')
            check('Invalid round index safely defaults to first','gostaria de' in page.locator('.cg-panel h3').inner_text())
            scenarios=page.evaluate('BORA_CONTENT.dialogs.map(d=>({id:d.id,answers:d.steps.map(s=>s.answer)}))')
            for d in scenarios:
                route('conversation/'+d['id']+'/2','.cg-example')
                page.locator('[data-action="conversation-practice"]').click()
                page.wait_for_selector('[data-action="dialog-answer"]')
                check('Practice starts at round one '+d['id'],'第 1/3 輪' in page.locator('.quiz-wrap').inner_text())
                for i,answer in enumerate(d['answers']):
                    check(f'Helper initially collapsed {d["id"]}:{i}',page.locator('details.cg-panel').get_attribute('open') is None)
                    if i==0:
                        page.locator(f'[data-action="dialog-answer"][data-value="{(answer+1)%3}"]').click()
                        check('Wrong answer does not auto-open solution '+d['id'],page.locator('details.cg-panel').get_attribute('open') is None)
                        page.locator('.cg-panel>summary').focus();page.keyboard.press('Enter')
                        check('Keyboard can open helper '+d['id'],page.locator('details.cg-panel').get_attribute('open') is not None)
                    page.locator(f'[data-action="dialog-answer"][data-value="{answer}"]').click()
                    check(f'Correct answer opens matching two examples {d["id"]}:{i}',page.locator('details.cg-panel').get_attribute('open') is not None and page.locator('.cg-example').count()==2)
                    page.locator('[data-action="dialog-next"]').last.click()
                check('Original completion flow retained '+d['id'],'你完成了一段對話' in page.locator('.quiz-wrap').inner_text())
            route('settings','#profile-name');page.reload();page.wait_for_selector('#profile-name')
            check('Native storage persists after reload',page.locator('#profile-name').input_value()=='升級保存測試')
            after=page.evaluate("JSON.parse(localStorage.getItem('bora.ptbr.v2'))")
            check('Original plan data preserved',after['plan']==before['plan'])
            check('All six conversation completions recorded',len(after['dialogsDone'])==6)
            page.locator('#large-text').check();page.locator('[data-action="save-profile"]').click()
            route('conversation/coffee-talk/0','.cg-example')
            check('Large type mobile has no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
            for size in [{'width':375,'height':812},{'width':820,'height':1180},{'width':1440,'height':1000}]:
                page.set_viewport_size(size)
                check('Responsive width '+str(size['width']),page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
            page.screenshot(path=str(out/'Bora-v2.3-Desktop-Lesson.png'),full_page=True)
            for name,selector in [('home','.cg-entry'),('courses','.course-card'),('cards','#main'),('speak','.tabbar'),('grammar','.tabbar'),('progress','#main'),('plan','#main')]:
                route(name,selector)
                check('Existing route renders '+name,len(page.locator('#main').inner_text())>20)
            route('home','[data-action="pron-test"]');page.locator('[data-action="pron-test"]').first.click()
            page.wait_for_function("document.querySelector('#bora-native-audio')?.currentTime>.05")
            check('Old Dora lesson audio retained','natural-v1/' in page.locator('#bora-native-audio').get_attribute('src'))
            check('No JavaScript runtime errors',not errors)
        finally:
            if errors: print('JS errors: '+str(errors),flush=True)
            page.screenshot(path=str(out/'Bora-v2.3-Test-Final.png'),full_page=True)
            browser.close();server.shutdown()
    report={'version':'2.3.0','checks_passed':len(checks),'checks':checks,'scope':'Real generated normal/slow MP3 playback and native localStorage on Chromium with mobile/tablet/desktop sizes. No mocked audio or storage. Not physical iPhone/Android speakers, Safari device or native-speaker linguistic review.'}
    (ROOT/'conversation-browser-tests.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report),flush=True)

if __name__=='__main__':
    main()
