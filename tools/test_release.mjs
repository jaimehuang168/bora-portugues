/* Offline defensive regressions against the shipped scripts. No device or real learner records. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script src="([^"?]+)\?[^"]+"[^>]* defer><\/script>/g)].map(m=>m[1]);
assert.equal((html.match(/<script\b/g)||[]).length,scripts.length);
const policy=html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
for (const exact of ["default-src 'none'","script-src 'self'","script-src-attr 'none'","connect-src 'none'","object-src 'none'","base-uri 'none'","form-action 'none'","media-src 'self' blob:"]){assert.ok(policy.split(';').map(s=>s.trim()).includes(exact));}
assert.ok(!policy.includes('unsafe-eval'));
assert.equal(new Set(scripts).size,scripts.length);
assert.ok(!scripts.some(s=>/(expanded|c1|more|conversation)-audio\.js$/.test(s)));
execFileSync(process.execPath,['tools/check_entry_assets.mjs'],{stdio:'inherit'});
execFileSync(process.execPath,['tools/build_audio_catalog.mjs','--verify-audio'],{stdio:'inherit'});
const file=p=>fs.readFileSync(p,'utf8');
const DB=()=>({m:new Map(),blocked:false,writes:0,getItem(k){return this.m.get(k)??null;},setItem(k,v){if(this.blocked)throw Error('test quota');this.writes++;this.m.set(k,v);}});
const KEY='bora.ptbr.v2';
function tab(db){
  const handlers={},els={},renders=[],toasts=[],media=[];
  const get=(k)=>els[k]??=({classList:{add(){},remove(){},toggle(){}},textContent:'',innerHTML:'',focus(){}});
  const doc={hidden:false,body:{classList:{toggle(){},remove(){},add(){}}},
    querySelector(s){return ['#app','#toast','#save-status','#storage-notice','#record-button','#record-status','#record-result','#main'].includes(s)?get(s):null;},
    querySelectorAll(){return [];},addEventListener(k,fn){(handlers[k]??=[]).push(fn);}};
  let nextTimer=0,confirmYes=true;const timers=new Map();
  const ctx=vm.createContext({console,localStorage:db,location:{hash:'#home'},document:doc,
    navigator:{mediaDevices:{}},isSecureContext:true,URL,Blob,
    setTimeout:(f,n)=>{timers.set(++nextTimer,[f,n]);return nextTimer;},clearTimeout:i=>timers.delete(i),
    setInterval:()=>-1,clearInterval(){},confirm:()=>confirmYes,
    addEventListener:(k,fn)=>(handlers[k]??=[]).push(fn),scrollTo(){},
    Audio:class{constructor(){media.push(this);}setAttribute(){}pause(){}play(){return Promise.resolve();}}
  });
  vm.runInContext('this.window=this',ctx);
  for(const p of scripts){let s=file(p);
    if(p==='assets/app.js'){
      const marker="if('speechSynthesis' in window)";
      assert.ok(s.includes(marker));
      s=s.replace(marker,"window.unit={get:()=>state,render,save,replaceProgress,importProgress,defaults,validateState,toggleRecording,clearRecording,rec,speech,c1Drafts,markLearned,raw:()=>rawSaved,locked:()=>storageLocked,conversationNotes,board,setSpeak(){route='speak';speakTab='shadow';},deferSave};\n"+marker);
    }
    vm.runInContext(s,ctx,{filename:p,timeout:2000});
  }
  return {ctx,doc,unit:ctx.unit,els,media,timers,cancel(){confirmYes=false;},visit(h){ctx.location.hash='#'+h;ctx.unit.render();return get('#app').innerHTML;},fire(k,event={}){for(const fn of handlers[k]||[])fn(event);}};
}
const db=DB(),t=tab(db),u=t.unit;
for(const [r,what] of [['home','今日'],['courses/C1','六個情境案例'],['lesson/c1-chair','本課 3 個關鍵詞'],['cards/words/c1','C1 高階搭配'],['grammar/c1','C1'],['daily','自我檢查'],['plan','18 個月'],['conversation','六組'],['conversation/words','會話'],['speak','口說'],['progress','學習進度'],['settings','備份']])assert.ok(t.visit(r).includes(what),r);
assert.ok(!t.visit('conversation').includes('會話教材未載入'));
const name='Ana & Beto <equipe>';
const shape=u.defaults();shape.profile.name=name;shape.favorites=['hello-0'];shape.days['2026-02-31']={};
const accepted=u.validateState(shape);assert.ok(!accepted.days['2026-02-31']);
const backup=(p)=>({size:1000,text:async()=>JSON.stringify({app:'bora-ptbr',version:2,state:p})});
await u.importProgress(backup(shape));assert.equal(u.get().profile.name,name);
assert.ok(t.visit('home').includes('Ana &amp; Beto &lt;equipe&gt;'));assert.deepEqual(Array.from(u.get().favorites),['hello-0']);
const before=db.getItem(KEY);db.blocked=true;
const next=u.defaults();next.profile.name='Nova';await u.importProgress(backup(next));
assert.equal(db.getItem(KEY),before);assert.equal(u.get().profile.name,name);
assert.ok(t.els['#toast'].textContent.includes('失敗'));
assert.equal(u.replaceProgress(u.defaults()),false);assert.equal(db.getItem(KEY),before);
db.blocked=false;
const other=tab(db);other.unit.get().profile.name='Segundo';assert.equal(other.unit.save(),true);
const after=db.getItem(KEY);assert.equal(u.save(),false);assert.ok(u.locked());
t.fire('pagehide');assert.equal(db.getItem(KEY),after);assert.equal(u.replaceProgress(next),false);
const fresh=tab(db);fresh.cancel();await fresh.unit.importProgress(backup(next));assert.equal(db.getItem(KEY),after);
const corrupt=DB();corrupt.setItem(KEY,'invalid backup');const broken=tab(corrupt);assert.ok(broken.unit.locked());
broken.fire('pagehide');assert.equal(corrupt.getItem(KEY),'invalid backup');assert.equal(broken.unit.raw(),'invalid backup');
assert.equal(broken.unit.replaceProgress(broken.unit.defaults()),true);assert.doesNotThrow(()=>JSON.parse(corrupt.getItem(KEY)));
const legacy=DB();legacy.setItem('bora.ptbr.v1',JSON.stringify({...shape,version:1}));const migrated=tab(legacy);
assert.deepEqual(Array.from(migrated.unit.get().favorites),['hello-0']);migrated.unit.save();assert.ok(legacy.getItem('bora.ptbr.v1'));assert.ok(legacy.getItem(KEY));
// One intentional storage write for a burst of typing; synchronous pagehide flush.
const temp=DB(),tt=tab(temp);tt.unit.get().profile.name='Antes';tt.unit.deferSave();tt.unit.deferSave();
assert.equal([...tt.timers.values()].filter(x=>x[1]===350).length,1);tt.fire('pagehide');assert.equal(JSON.parse(temp.getItem(KEY)).profile.name,'Antes');
// No real microphone: permission arrives after hiding; released track never reaches a recorder.
const mic=tab(DB());mic.unit.setSpeak();let release,stops=0,starts=0;
mic.ctx.navigator.mediaDevices.getUserMedia=()=>new Promise(ok=>release=ok);
mic.ctx.MediaRecorder=class {static isTypeSupported(){return false;}constructor(){this.state='inactive';}start(){this.state='recording';starts++;}stop(){this.state='inactive';}};
const promise=mic.unit.toggleRecording();assert.ok(mic.unit.rec.pending);
mic.doc.hidden=true;mic.fire('visibilitychange');release({getTracks:()=>[{stop(){stops++;}}]});await promise;assert.equal(stops,1);assert.equal(starts,0);assert.equal(mic.unit.rec.pending,false);
mic.doc.hidden=false;mic.ctx.navigator.mediaDevices.getUserMedia=async()=>({getTracks:()=>[{stop(){stops++;}}]});
await mic.unit.toggleRecording();assert.equal(starts,1);const oldChunk=mic.unit.rec.recorder.ondataavailable;
mic.unit.clearRecording();oldChunk({data:new Blob(['older recording'])});assert.equal(mic.unit.rec.chunks.length,0);
// Fixed examples need neither an OS voice nor remote consent. Free text is local by default.
const play=mic.unit.speech;for(const speed of [1,.75]){await play.play('hipótese de trabalho',{engine:'builtin',rate:speed});assert.ok(mic.media[0].src.endsWith(speed===1?'-normal.mp3':'-slow.mp3'));assert.equal(mic.media[0].playbackRate,1);}
play.stop();assert.equal(play.hasClip('constructor'),false);
let consentCount=0,utterances=0;mic.ctx.confirm=()=>{consentCount++;return false;};
mic.ctx.speechSynthesis={getVoices:()=>[{voiceURI:'remote',lang:'pt-BR',localService:false}],speak(){utterances++;}};
assert.equal(await play.play('Uma frase de teste inédita.'),false);assert.equal(consentCount,0);
mic.unit.get().profile.localOnly=false;assert.equal(await play.play('Uma frase de teste inédita.'),false);assert.equal(consentCount,1);assert.equal(utterances,0);
console.log('Passed: 12 routes, escaped profile, legacy/current/corrupt backup, quota/cancel/reset, cross-tab conflict, save coalescing, microphone cancellation and both audio speeds/voice consent.');
