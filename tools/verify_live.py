"""Read-only byte verification of this exact checkout on the known public Pages origin."""
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import time
from urllib.request import Request, urlopen

BASE = 'https://jaimehuang168.github.io/bora-portugues/'

class Entry(HTMLParser):
    def __init__(self):
        super().__init__()
        self.assets = {}
        self.version = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta' and a.get('name') == 'bora-version':
            self.version = a['content']
        url = a.get('src') if tag == 'script' else a.get('href') if tag == 'link' and a.get('rel') == 'stylesheet' else None
        if url is not None:
            m = re.fullmatch(r'(assets/[a-z0-9-]+\.(?:js|css))\?v=[a-f0-9]{12}', url)
            if not m:
                raise ValueError('Unexpected entry asset URL')
            self.assets[url] = m[1]

def compare(pair):
    url, local = pair
    req = Request(BASE + url, headers={'User-Agent':'Bora-release-check/2.9.1'})
    with urlopen(req,timeout=15) as res:
        if res.status != 200 or not res.geturl().startswith(BASE):
            raise ValueError('Unexpected response for ' + local)
        data = res.read(5_000_001)
    if len(data)>5_000_000 or sha256(data).digest() != sha256(Path(local).read_bytes()).digest():
        raise ValueError('Revision not yet visible: ' + local)

def main():
    parser=Entry()
    parser.feed(Path('index.html').read_text())
    assert parser.version and len(parser.assets)>=10
    marker=os.environ.get('GITHUB_RUN_ID','manual')
    for attempt in range(14):
        try:
            compare(('index.html?release='+marker+'-'+str(attempt),'index.html'))
            with ThreadPoolExecutor(max_workers=4) as pool:
                list(pool.map(compare,parser.assets.items()))
            break
        except (OSError,ValueError) as err:
            print(str(err),flush=True)
            if attempt==13: raise
            time.sleep(12)
    samples=[]
    for name in ('natural','conversation','expanded','more','c1'):
        clips=list(json.loads(Path('audio/'+name+'-manifest.json').read_text())['clips'].values())
        for clip in (clips[0],clips[len(clips)//2],clips[-1]):
            for field in ('src','slowSrc'):
                samples.append((clip[field],clip[field]))
    extra=[(p,p) for p in ('audio-sample.mp3','audio-sample-slow.mp3','audio-test.html')]
    with ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(compare,samples+extra))
    report={'version':parser.version,'site':BASE,'entry_assets':len(parser.assets),'sampled_lesson_mp3':len(samples),'two_diagnostics_and_test_page':True,'limits':'HTTP comparison, not an acoustic test on a physical phone.'}
    Path('live-verification.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report),flush=True)
if __name__=='__main__':
    main()
