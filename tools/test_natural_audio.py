"""Chromium tests using real generated assets and native localStorage, no mocks."""
import functools
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
checks = []


def check(label, passed):
    if not passed:
        raise AssertionError(label)
    checks.append(label)


def main():
    handler = functools.partial(SimpleHTTPRequestHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    url = f'http://127.0.0.1:{server.server_port}/'
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        page = ctx.new_page()
        errors = []
        page.on('pageerror', lambda err: errors.append(str(err)))
        page.goto(url)
        page.wait_for_selector('[data-action="pron-test"]')
        check('Home shows v2.2.0', '清晰巴葡發音版 v2.2.0' in page.locator('body').inner_text())
        check('Neural bank loaded', page.evaluate('BORA_AUDIO.meta.type') == 'neural-synthesis')
        check('All 222 normal and slow entries present', page.evaluate('Object.values(BORA_AUDIO.clips).every(c=>c.src&&c.slowSrc) && Object.keys(BORA_AUDIO.clips).length===222'))
        page.locator('[data-action="pron-test"]').first.click()
        page.wait_for_function("document.querySelector('#bora-native-audio')?.currentTime > .05")
        audio = page.locator('#bora-native-audio')
        normal = audio.get_attribute('src')
        check('Normal selects normal MP3', normal.endswith('-normal.mp3'))
        check('Normal native playback rate is 1', audio.evaluate('(a)=>a.playbackRate') == 1)
        check('Real neural MP3 playback advances', audio.evaluate('(a)=>a.currentTime') > 0)
        check('Source labelled Dora', 'Dora' in page.locator('#speech-feedback').inner_text())
        page.locator('[data-action="pron-open"]').first.click()
        page.wait_for_selector('.pron-sentence')
        page.locator('.pron-sentence').first.locator('[data-slow="1"]').click()
        page.wait_for_function("document.querySelector('#bora-native-audio')?.src.endsWith('-slow.mp3')")
        page.wait_for_function("document.querySelector('#bora-native-audio')?.currentTime > .05")
        check('Slow uses a distinct asset', audio.get_attribute('src') != normal)
        check('Slow is not time-stretched', audio.evaluate('(a)=>a.playbackRate') == 1)
        check('Slow download is correct variant', page.locator('#speech-download').get_attribute('href').endswith('-slow.mp3'))
        check('Native player is visible', audio.is_visible())
        page.locator('#speech-toggle').click()
        check('Pause stops audio', audio.evaluate('(a)=>a.paused'))
        page.locator('#speech-toggle').click()
        page.wait_for_function("!document.querySelector('#bora-native-audio')?.paused")
        check('Resume plays', not audio.evaluate('(a)=>a.paused'))
        page.locator('[data-action="pron-lesson-play"]').click()
        check('Playlist has six sentences', '/ 6 段' in page.locator('#speech-meta').inner_text())
        page.locator('[data-action="speech-next"]').click()
        check('Next advances sentence', '2 / 6' in page.locator('#speech-meta').inner_text())
        page.locator('[data-action="speech-close"]').click()
        check('Stop hides player', not page.locator('#speech-dock').is_visible())
        check('Mobile has no horizontal overflow', page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'))
        page.goto(url + '#settings')
        page.wait_for_selector('#profile-name')
        page.locator('#profile-name').fill('保存測試')
        page.locator('[data-action="save-profile"]').click()
        before = page.evaluate("JSON.parse(localStorage.getItem('bora.ptbr.v2'))")
        page.reload()
        page.wait_for_selector('#profile-name')
        check('Native storage persists reload', page.locator('#profile-name').input_value() == '保存測試')
        check('Plan data retained', page.evaluate("JSON.parse(localStorage.getItem('bora.ptbr.v2')).plan") == before['plan'])
        for route in ['home', 'courses', 'cards', 'speak', 'grammar', 'progress', 'plan']:
            page.goto(url + '#' + route)
            page.wait_for_timeout(80)
            check('Route renders: ' + route, len(page.locator('#main').inner_text()) > 20)
        check('No JavaScript errors', not errors)
        page.goto(url + '#pronunciation')
        page.wait_for_selector('.pron-sentence')
        export = ROOT / '.build'
        export.mkdir(exist_ok=True)
        page.screenshot(path=str(export / 'Bora-v2.2-Mobile.png'), full_page=True)
        browser.close()
    server.shutdown()
    report = {'checks_passed': len(checks), 'checks': checks, 'scope': 'Real generated MP3 playback and native localStorage in Chromium mobile viewport. No physical iPhone/Android speaker test, Safari test, native-speaker review or pronunciation accuracy score.'}
    (ROOT / 'audio-browser-tests.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report), flush=True)


if __name__ == '__main__':
    main()
