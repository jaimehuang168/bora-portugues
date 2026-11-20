import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const content=fs.readFileSync('assets/core-content.js','utf8');
assert.ok(content,'Base lesson catalog');
const context=vm.createContext({window:{}});
for(const source of [content,fs.readFileSync('assets/expanded-learning.js','utf8'),fs.readFileSync('assets/more-content.js','utf8')])
  vm.runInContext(source,context,{timeout:1000});
const base=context.window.BORA_CONTENT,extra=context.window.BORA_EXPANDED,more=context.window.BORA_MORE;
assert.equal(base.lessons.length,16);
assert.equal(more.lessons.length,12);
assert.equal(more.words.length,36);
assert.equal(more.grammar.length,12);
const unique=(xs,label)=>assert.equal(new Set(xs).size,xs.length,`${label} unique`);
unique([...base.lessons,...more.lessons].map(l=>l.id),'lesson IDs');
unique([...base.grammar,...extra.grammar,...more.grammar].map(g=>g.id),'grammar IDs');
unique([...extra.words,...more.words].map(w=>w[1]),'word headwords');
for(const l of more.lessons){
  assert.ok(['A1','A2','B1'].includes(l.level));
  assert.ok(['life','travel','business'].includes(l.track));
  assert.equal(l.phrases.length,6);
  assert.ok(l.task&&l.tip&&l.title&&l.subtitle);
  for(const p of l.phrases)assert.ok(p.length===4&&p.every(x=>typeof x==='string'&&x.trim()));
}
for(const w of more.words)assert.ok(w.length===7&&w.every(x=>typeof x==='string'&&x.trim()));
for(const g of more.grammar){
  assert.equal(g.examples.length,2);
  assert.ok(g.examples.every(e=>e.length===3&&e.every(Boolean)));
  assert.equal(g.options.length,3);
  assert.ok(g.answer>=0&&g.answer<3);
}
if(fs.existsSync('audio/more-manifest.json')){
  const manifests=['natural','conversation','expanded','more'].map(x=>JSON.parse(fs.readFileSync(`audio/${x}-manifest.json`,'utf8')));
  const clips=Object.assign({},...manifests.map(m=>m.clips));
  const inventory=JSON.parse((await import('node:child_process')).execFileSync('node',['tools/list_more_audio.mjs'],{encoding:'utf8'}));
  for(const text of inventory.texts){
    const key=text.normalize('NFC').replace(/\s+/g,' ').trim().toLocaleLowerCase('pt-BR');
    const clip=clips[key];assert.ok(clip,`Missing audio: ${text}`);
    for(const path of [clip.src,clip.slowSrc])assert.ok(path&&fs.existsSync(path),`Missing MP3: ${path}`);
  }
  console.log(`Audio coverage: ${inventory.texts.length}/${inventory.texts.length} fixed teaching targets`);
}
console.log('12 lessons, 72 phrases, 36 words, 12 grammar units validated');
