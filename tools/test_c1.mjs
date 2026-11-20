/* Offline catalog, upgrade and media integrity checks. No live learner data. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {inventory,keyFor} from './list_c1_audio.mjs';
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
const dataOnly=process.argv.includes('--content-only');
const ctx=vm.createContext({console});
vm.runInContext('this.window=this',ctx);
const oldIds=[];
let main='';
for(const [,attrs,body] of scripts){
  const path=attrs.match(/\bsrc="([^"?]+)/)?.[1];
  if(path==='assets/c1-audio.js'&&dataOnly&&!fs.existsSync(path))continue;
  const source=path?fs.readFileSync(path,'utf8'):body;
  const prog=new vm.Script(source,{filename:path||'index-inline'});
  if(source.includes('const C = window.BORA_CONTENT;')){main=source;continue;}
  prog.runInContext(ctx,{timeout:2400});
}
assert.ok(main);
for(const l of [...ctx.BORA_CONTENT.lessons,...ctx.BORA_MORE.lessons])
  l.phrases.forEach((p,i)=>oldIds.push([l.id+'-'+i,p[0]]));
// Execute the actual catalog assembly and profile validation, stopping before
// storage access and browser-only initialisation.
vm.runInContext(main.slice(main.indexOf('const C = window.BORA_CONTENT;'),main.indexOf('let storageOK=')),ctx,{timeout:2400});
const snap=vm.runInContext('({LEVELS,LESSONS,PHRASES,defaults,validateState,KEY,C1})',ctx);
const {C1,LESSONS,PHRASES}=snap;
const unique=(a,label)=>assert.equal(new Set(a).size,a.length,label);
const strings=a=>assert.ok(a.every(v=>typeof v==='string'&&v.trim().length>0));
unique(LESSONS.map(l=>l.id),'Unique lesson IDs across releases');
unique(ctx.BORA_CONTENT.grammar.map(g=>g.id),'Unique grammar IDs');
unique(ctx.BORA_EXPANDED.words.map(w=>keyFor(w[1])),'Unique headwords');
const map=new Map(PHRASES.map(p=>[p.id,p.pt]));
for(const [key,text] of oldIds)assert.equal(map.get(key),text,'Prior phrase ID/content changed: '+key);
assert.equal(oldIds.length,168);assert.equal(LESSONS.length,34);assert.equal(PHRASES.length,204);
assert.equal(ctx.BORA_CONTENT.grammar.length,38);assert.equal(ctx.BORA_EXPANDED.words.length,90);
assert.ok(ctx.BORA_CONTENT.grammar.slice(-6).every(g=>g.level==='C1'));
assert.deepEqual([...snap.LEVELS],['A1','A2','B1','B2','C1']);
assert.deepEqual([...new Set(C1.lessons.map(l=>l.track))].sort(),['business','life','travel']);
for(const l of C1.lessons){
  strings([l.tip,l.task,l.insight,...l.checks]);
  for(const source of l.sources){assert.equal(source.length,3);strings(source);}
  for(const p of l.phrases){assert.equal(p.length,4);strings(p);}
  assert.equal(C1.words.filter(w=>l.phrases.some(p=>p[0]===w[4])).length,3);
  const g=C1.grammar.find(g=>g.id===l.id+'-rule');assert.ok(g);
  assert.equal(g.examples.length,2);assert.notEqual(g.examples[0][0],g.examples[1][0]);
  assert.ok(g.examples.every(ex=>ex.length===3&&ex.every(Boolean)));
  assert.equal(g.options.length,3);unique(g.options,'distinct answers');assert.ok(Number.isInteger(g.answer)&&g.answer>=0&&g.answer<3);
  strings([g.title,g.summary,g.question,g.explain,...g.options]);
}
for(const w of C1.words){assert.equal(w.length,7);strings(w);}
assert.equal(snap.KEY,'bora.ptbr.v2');
const profile=snap.defaults();const ids=[oldIds[0][0],oldIds.at(-1)[0],'c1-chair-0'];
Object.assign(profile,{learned:Object.fromEntries(ids.map(id=>[id,123])),favorites:ids,
  grammarDone:['ser-estar','more-desde','c1-chair-rule'],lessonQuiz:{'social-more':87,'c1-chair':90}});
const upgraded=snap.validateState(profile);
assert.deepEqual(Object.keys(upgraded.learned),ids);
assert.deepEqual([...upgraded.favorites],ids);
assert.deepEqual([...upgraded.grammarDone],profile.grammarDone);
assert.deepEqual({...upgraded.lessonQuiz},profile.lessonQuiz);
const texts=inventory(C1);
// Pure rendering checks, without pretending to play audio or touch a browser.
for(const name of ['icon','heading','pill','spanish','dailyAudioButton','grammarCard','normalized','matchQuery','progressLine','lessonProgress','completeLesson','courseCards','coursesPage','expandedWordCards']){
  const line=main.split('\n').find(l=>l.startsWith('function '+name+'('));
  if(line)vm.runInContext(line,ctx);
}
vm.runInContext(main.slice(main.indexOf('function c1Case('),main.indexOf('function lessonPage(')),ctx);
vm.runInContext("let state=defaults(), grammarAnswer={}, courseFilter={level:'C1',track:'all',query:''}, route='cards/words/c1', expandedWordQuery=''; const c1Drafts=new Map(); const c1WordCount=t=>t.trim()?t.trim().split(/\\s+/u).length:0;",ctx);
assert.equal(vm.runInContext("courseCards().split('data-action=\"open-lesson\"').length-1",ctx),6);
assert.equal(vm.runInContext("courseFilter.track='travel';courseCards().split('data-action=\"open-lesson\"').length-1",ctx),1);
assert.equal(vm.runInContext("expandedWordCards().split('新詞彙').length-1",ctx),18);
assert.equal(vm.runInContext("patternBank().filter(x=>x.level==='C1').length",ctx),6);
assert.ok(vm.runInContext("coursesPage().includes('#grammar/c1')&&coursesPage().includes('#cards/words/c1')",ctx));
for(const l of C1.lessons){
  const markup=vm.runInContext('c1Case(C1.lessons.find(l=>l.id==='+JSON.stringify(l.id)+'))',ctx);
  assert.ok(markup.includes(l.task)&&markup.includes(l.insight)&&markup.includes('c1-draft'));
  const buttons=[...markup.matchAll(/data-action="daily-speak" data-text="([^"]+)" data-slow="([01])"/g)];
  assert.equal(buttons.length,14,'2 sources, 3 keywords, 2 grammar examples, each at two speeds');
  for(const [,pt] of l.sources){
    assert.ok(buttons.some(b=>b[1]===pt&&b[2]==='0')&&buttons.some(b=>b[1]===pt&&b[2]==='1'));
  }
}
if(!dataOnly){
  const manifest=JSON.parse(fs.readFileSync('audio/c1-manifest.json','utf8'));
  assert.equal(manifest.meta.language,'pt-BR');assert.equal(manifest.meta.slowRate,.75);
  assert.equal(manifest.meta.count,Object.keys(manifest.clips).length);
  for(const t of texts){
    const key=keyFor(t);
    const c=ctx.BORA_AUDIO.clips[key];assert.ok(c,'Missing runtime audio for '+t);
    if(manifest.clips[key])assert.equal(JSON.stringify(c),JSON.stringify(manifest.clips[key]));
    assert.notEqual(c.src,c.slowSrc);assert.notEqual(c.sha256,c.slowSha256);
    assert.ok(c.duration>0&&c.slowDuration>c.duration,'Slow must be slower: '+t);
    for(const [p,h] of [[c.src,c.sha256],[c.slowSrc,c.slowSha256]]){
      assert.match(p,/^audio\/[a-z0-9-]+\/[a-zA-Z0-9._-]+\.mp3$/);
      assert.equal(createHash('sha256').update(fs.readFileSync(p)).digest('hex'),h);
    }
  }
  console.log('Runtime audio and SHA-256 verified:',texts.length,'normal/slow pairs');
}
console.log('Passed: 6 C1 cases, 12 input passages, 36 phrases, 18 vocabulary entries, 6 grammar units and legacy progress.');
