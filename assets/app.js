/* Bora! 2.1 — 無框架、無後端。所有進度在本機，錄音不會由本 App 上傳。
   教材與使用者字串一律轉義；JSON 匯入採白名單驗證；不執行匯入內容。
*/
(() => {
'use strict';
const C = window.BORA_CONTENT;
const EXTRA = window.BORA_EXPANDED;
const MORE = window.BORA_MORE;
const C1 = window.BORA_C1 || {lessons:[],words:[],grammar:[]};
const LEVELS = ['A1','A2','B1','B2','C1'];
C.lessons.push(...MORE.lessons.map(l=>({...l,tip:l.tip+' 實作任務：'+l.task})));
C.lessons.push(...C1.lessons);
EXTRA.words.push(...MORE.words,...C1.words);
C.grammar.push(...EXTRA.grammar,...MORE.grammar,...C1.grammar);
C.grammar.sort((a,b)=>LEVELS.indexOf(a.level)-LEVELS.indexOf(b.level));
const DAY = 86400000, KEY = 'bora.ptbr.v2', LEGACY_KEY = 'bora.ptbr.v1', VERSION = 2;
const PM = window.BoraPlanModel;
const $ = (q,root=document) => root.querySelector(q);
const esc = (v) => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (n,min,max) => Math.min(max,Math.max(min,n));
const number = (v,min,max,def=0) => typeof v==='number'&&Number.isFinite(v)?clamp(v,min,max):def;
const obj = v => !!v && typeof v==='object' && !Array.isArray(v);
const paths = {
 home:'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',sun:'M12 3V1m0 22v-2M3 12H1m22 0h-2M4.2 4.2 5.6 5.6m12.8 12.8 1.4 1.4m0-15.6-1.4 1.4M5.6 18.4l-1.4 1.4M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
 book:'M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1m0-15c3-2 7-2 10-1v15c-3-1-7-1-10 1V5',cards:'M7 6h14v15H7zM3 17V2h14',mic:'M9 4a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0V4m-3 7v1a6 6 0 0 0 12 0v-1m-6 7v4m-4 0h8',
 chart:'M3 3v18h19M7 17v-5m5 5V7m5 10V3',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M10 2h4l1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1 1-3',
 arrow:'M4 12h16m-6-6 6 6-6 6',chevron:'m9 5 7 7-7 7',back:'M20 12H4m6-6-6 6 6 6',check:'m4 12 5 5L20 6',x:'m6 6 12 12M6 18 18 6',
 volume:'M11 3 6 7H2v10h4l5 4V3m4 5a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',play:'m7 3 14 9-14 9V3',pause:'M7 3v18M17 3v18',stop:'M5 5h14v14H5z',
 flame:'M12 2c2 6-4 6-2 11 2-1 3-3 4-5 5 4 8 13-2 14C2 22 2 14 6 9c0 3 2 4 2 4-1-5 4-8 4-11',star:'m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1 3-6',
 coffee:'M3 8h13v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8m13 0h2a4 4 0 0 1 0 8h-2M5 2v3m5-3v3m5-3v3',user:'M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 22v-3a8 8 0 0 1 16 0v3',
 users:'M13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0M1 22v-3a8 8 0 0 1 16 0v3m0-20a4 4 0 0 1 0 8m2 4a6 6 0 0 1 4 6v2',bag:'M4 7h16l1 15H3L4 7m4 1V5a4 4 0 0 1 8 0v3',
 map:'m9 4-7-2v18l7 2 6-3 7 2V3l-7-2-6 3m0 0v18m6-21v18',calendar:'M3 5h18v17H3V5m4-4v7m10-7v7M3 11h18M7 15h2m4 0h2m-8 4h2',
 home:'M3 11 12 3l9 8v10H3V11m6 10v-7h6v7',heart:'M12 21 3 12a5 5 0 0 1 7-7l2 2 2-2a5 5 0 0 1 7 7l-9 9',plane:'M2 16l20-8-20-3 2 5 9 1-9 1-2 4',
 chat:'M3 3h18v14H9l-6 5V3m4 5h10M7 12h7',briefcase:'M3 7h18v15H3V7m5 0V3h8v4M3 13c6 3 12 3 18 0m-9-1v5',building:'M5 22V2h14v20M1 22h22M9 6h1m4 0h1M9 10h1m4 0h1M9 14h1m4 0h1M10 22v-4h4v4',
 document:'M5 2h9l5 5v15H5V2m9 0v6h5M8 12h8m-8 4h8',send:'m22 2-7 20-4-9-9-4L22 2m0 0L11 13',handshake:'m2 8 4-4 5 1 3-1 8 4-4 10-6 4-7-4L2 8m8-3-3 5 3 2 4-4 6 5m-9 3 4 4m-7-1 4 3',
 mail:'M2 4h20v16H2V4m0 0 10 9L22 4',search:'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0m-2 4 7 7',clock:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M12 6v6l4 2',
 shield:'m12 2 9 4v6c0 5-4 8-9 10-5-2-9-5-9-10V6l9-4m-5 10 3 3 7-7',headphones:'M3 14v-3a9 9 0 0 1 18 0v3M3 12h4v9H3v-9m14 0h4v9h-4v-9',spark:'m12 1 3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8',
 download:'M12 2v13m-5-5 5 5 5-5M3 16v6h18v-6',upload:'M12 16V3m-5 5 5-5 5 5M3 16v6h18v-6',refresh:'M21 7v6h-6M3 17v-6h6m11-4A9 9 0 0 0 5 5l-2 6m18 2-2 6a9 9 0 0 1-15-2',
 trophy:'M7 2h10v8a5 5 0 0 1-10 0V2m0 3H2v3a5 5 0 0 0 5 5m10-8h5v3a5 5 0 0 1-5 5m-5 2v7m-5 0h10',globe:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M2 12h20M12 2c5 5 5 15 0 20-5-5-5-15 0-20',
 eye:'M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12m15 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0',keyboard:'M2 5h20v14H2V5m3 4h1m3 0h1m3 0h1m3 0h1M5 13h1m3 0h1m3 0h1m3 0h1m-10 3h8',
 leaf:'M20 2C8 2 2 6 2 14a8 8 0 0 0 8 8c8 0 12-8 10-20M5 19l10-10',info:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M12 10v7m0-11v1'
};
function icon(name,cls=''){return `<svg class="icon ${esc(cls)}" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.book}"/></svg>`;}
const LESSONS = C.lessons;
const PHRASES = LESSONS.flatMap(l=>l.phrases.map((p,i)=>({id:`${l.id}-${i}`,lesson:l.id,level:l.level,track:l.track,pt:p[0],zh:p[1],es:p[2],note:p[3]})));
const phraseMap = new Map(PHRASES.map(p=>[p.id,p]));
const lessonMap = new Map(LESSONS.map(l=>[l.id,l]));
const phrase = id=>phraseMap.get(id);
const phrasesByLesson = new Map(LESSONS.map(l=>[l.id, []]));
for(const p of PHRASES)phrasesByLesson.get(p.lesson).push(p);
const lphrases = id=>phrasesByLesson.get(id)||[];
const fmtNum = n=>Math.floor(n).toLocaleString('zh-TW');
function dateKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function dayOffset(n){const d=new Date();d.setDate(d.getDate()+n);return dateKey(d);}
function defaults(){return {version:VERSION,profile:{name:'Jaime',dailyMinutes:15,spanish:true,large:false,voice:'',localOnly:true,speechEngine:'auto',speechRate:1,speechRepeat:1,speechGap:4},learned:{},favorites:[],srs:{},lessonQuiz:{},grammarDone:[],mistakes:[],dialogsDone:[],days:{},history:[],plan:PM.defaults()};}
const validIds = (v,set,max=500)=>Array.isArray(v)?[...new Set(v.filter(x=>typeof x==='string'&&set.has(x)))].slice(0,max):[];
function validateState(raw){
 if(!obj(raw)||![1,VERSION].includes(raw.version)||!obj(raw.profile)||!obj(raw.learned)||!obj(raw.days)) throw new Error('這不是可識別的 Bora! v1／v2 進度檔。');
 const d=defaults(),p=raw.profile;
 d.profile.name=typeof p.name==='string'?p.name.trim().slice(0,32)||'學習者':'學習者';
 d.profile.dailyMinutes=[5,10,15,20,30].includes(p.dailyMinutes)?p.dailyMinutes:15;
 d.profile.spanish=p.spanish!==false;d.profile.large=p.large===true;d.profile.localOnly=p.localOnly!==false;d.profile.voice=typeof p.voice==='string'?p.voice.slice(0,300):'';
 d.profile.speechEngine=['auto','builtin','system'].includes(p.speechEngine)?p.speechEngine:'auto';d.profile.speechRate=[.6,.75,1,1.2].includes(p.speechRate)?p.speechRate:1;d.profile.speechRepeat=[1,2,3].includes(p.speechRepeat)?p.speechRepeat:1;d.profile.speechGap=[2,4,6,8].includes(p.speechGap)?p.speechGap:4;
 for(const [id,v] of Object.entries(raw.learned)) if(phraseMap.has(id)&&typeof v==='number'&&v>0&&Number.isFinite(v)) d.learned[id]=v;
 d.favorites=validIds(raw.favorites,phraseMap);d.mistakes=validIds(raw.mistakes,phraseMap);
 d.grammarDone=validIds(raw.grammarDone,new Set(C.grammar.map(g=>g.id)));d.dialogsDone=validIds(raw.dialogsDone,new Set(C.dialogs.map(g=>g.id)));
 if(obj(raw.srs)) for(const [id,v] of Object.entries(raw.srs)) if(phraseMap.has(id)&&obj(v)) d.srs[id]={step:Math.floor(number(v.step,0,6)),due:number(v.due,0,8.64e15,Date.now()),reps:Math.floor(number(v.reps,0,1e6)),lapses:Math.floor(number(v.lapses,0,1e6))};
 if(obj(raw.lessonQuiz)) for(const [id,v] of Object.entries(raw.lessonQuiz)) if(lessonMap.has(id)) d.lessonQuiz[id]=number(v,0,100);
 for(const key of Object.keys(raw.days).filter(k=>PM.date(k)).sort().slice(-5000)){
  const v=raw.days[key];if(!/^\d{4}-\d{2}-\d{2}$/.test(key)||!obj(v))continue;
  d.days[key]={seconds:Math.floor(number(v.seconds,0,86400)),practiced:validIds(v.practiced,phraseMap),reviews:Math.floor(number(v.reviews,0,10000)),spoken:validIds(v.spoken,phraseMap),quizzes:Math.floor(number(v.quizzes,0,1000)),xp:Math.floor(number(v.xp,0,100000)),awards:Array.isArray(v.awards)?v.awards.filter(x=>typeof x==='string'&&x.length<100).slice(0,1000):[]};
 }
 if(Array.isArray(raw.history))d.history=raw.history.filter(x=>obj(x)&&['reading','listening','dictation'].includes(x.mode)).slice(-100).map(x=>{const total=Math.floor(number(x.total,1,100,1));return {at:number(x.at,0,8.64e15),mode:x.mode,correct:Math.floor(number(x.correct,0,total)),total};});
 d.plan=PM.validate(raw.plan);
 return d;
}
let storageOK=true,storageLocked=false,storageConflict=false,rawSaved=null,storageMessage='',saveTimer=null;
const ledger=window.BoraProgressStore(()=>window.localStorage,KEY);
let state=defaults();
try{rawSaved=ledger.read();if(rawSaved===null)rawSaved=localStorage.getItem(LEGACY_KEY);if(rawSaved!==null){try{state=validateState(JSON.parse(rawSaved));}catch{storageLocked=true;storageMessage='原本的進度格式無法讀取；已暫停覆寫。可先下載原始備份，再決定是否匯入或重設。';}}}
catch{storageOK=false;storageMessage='目前瀏覽器無法使用本機儲存。你仍可練習，但關閉頁面前請匯出進度。';}
function persistence(result){
 if(result==='ok'||result==='unchanged'){storageOK=true;storageMessage='';updateSaveStatus();return true;}
 const message=result==='conflict'?'另一個分頁已變更進度。為保留兩邊資料，此頁已暫停儲存；請先匯出這一頁，再重新整理讀取最新版本。':'本機儲存失敗；未寫入進度。請先匯出備份，並檢查可用儲存空間。';
 const changed=message!==storageMessage;
 if(result==='conflict'){storageConflict=true;storageLocked=true;}
 storageOK=false;storageMessage=message;updateSaveStatus();if(changed)toast(message);return false;
}
function save(){
 clearTimeout(saveTimer);saveTimer=null;if(storageLocked)return false;
 return persistence(ledger.write(JSON.stringify(state)));
}
function deferSave(){clearTimeout(saveTimer);saveTimer=setTimeout(save,350);}
function replaceProgress(next){
 if(storageConflict){toast(storageMessage);return false;}
 const result=ledger.write(JSON.stringify(next));
 if(result!=='ok'&&result!=='unchanged'){persistence(result);toast(storageMessage);return false;}
 clearTimeout(saveTimer);saveTimer=null;clearRecording();speech.revokeConsent();
 state=next;storageLocked=false;storageConflict=false;rawSaved=null;review=null;quiz=null;dialog=null;grammarAnswer={};c1Drafts.clear();pronDraft=DEFAULT_PRON_DRAFT;
 persistence(result);render();return true;
}
function today(){const k=dateKey();return state.days[k]||(state.days[k]={seconds:0,practiced:[],reviews:0,spoken:[],quizzes:0,xp:0,awards:[]});}
function award(key,xp){const d=today();if(d.awards.includes(key))return false;d.awards.push(key);d.xp+=xp;return true;}
function isActiveDay(k){const d=state.days[k];return !!d&&(d.practiced.length>0||d.reviews>0||d.spoken.length>0||d.quizzes>0||d.xp>0||d.seconds>=60);}
function streak(){let offset=isActiveDay(dayOffset(0))?0:-1,n=0;while(n<5000&&isActiveDay(dayOffset(offset-n)))n++;return n;}
function minutes(){return Math.floor(today().seconds/60);}
function totalXP(){return Object.values(state.days).reduce((s,d)=>s+d.xp,0);}
function dueCards(){return PHRASES.filter(p=>state.srs[p.id]&&state.srs[p.id].due<=Date.now()).sort((a,b)=>state.srs[a.id].due-state.srs[b.id].due);}
function lessonProgress(id){return lphrases(id).filter(p=>state.learned[p.id]).length;}
function completeLesson(id){return lessonProgress(id)===6&&(state.lessonQuiz[id]||0)>=80;}
function nextLesson(){return LESSONS.find(l=>!completeLesson(l.id))||LESSONS[0];}
function spanish(text,extra=''){return state.profile.spanish?`<p class="es ${extra}" lang="es">${esc(text)}</p>`:'';}
function pill(level){return `<span class="pill ${level==='C1'||level==='B2'?'purple':level==='B1'?'gold':''}">${esc(level)}</span>`;}
function speakBtn(p,slow=false){return `<button class="btn ${slow?'outline':'secondary'} small" data-action="speak" data-text="${esc(p)}" data-slow="${slow?'1':'0'}">${icon(slow?'clock':'volume')}${slow?'慢速聽':'聽發音'}</button>`;}
function bookmark(id){return `<button class="icon-btn ${state.favorites.includes(id)?'active':''}" data-action="favorite" data-id="${id}" aria-label="${state.favorites.includes(id)?'取消收藏':'收藏句型'}" aria-pressed="${state.favorites.includes(id)}">${icon('star')}</button>`;}
function progressLine(v,total){return `<div class="progress-line" role="progressbar" aria-label="練習進度" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${v}"><span style="width:${clamp(v/total*100,0,100)}%"></span></div>`;}
const conversationNotes = window.BoraDialogLearning && window.BORA_DIALOG_CONTENT && window.BORA_AUDIO?.clips ? window.BoraDialogLearning.create({esc,icon,speakBtn,dialogs:C.dialogs}) : {panel:()=>'<p class="note">會話教材未載入，請連線後重新整理；原有會話仍可練習。</p>',page:()=>'<section class="panel"><h1>會話教材未載入</h1><p>請確認網路後重新整理；不必清除學習紀錄。</p><a href="#speak">返回口說練習</a></section>'};
let route='',toastTimer=null;
let courseFilter={level:'all',track:'all',query:''};
let libraryFilter={type:'all',query:''};
let learning={lesson:'hello',index:0};
let review=null,quiz=null,dialog=null,grammarAnswer={};
const c1Drafts=new Map();
const c1WordCount=t=>t.trim()?t.trim().split(/\s+/u).length:0;
let speakId=PHRASES[0].id,speakTab='shadow',cardsTab='words',grammarTab='grammar',expandedWordQuery='';
let installPrompt=null,offlineReady=false,remoteVoiceAllowed=false;
let voiceList=[];
let rec={token:0,recorder:null,stream:null,chunks:[],url:'',mime:'',timer:null,pending:false,started:0};
let lastInteraction=Date.now(),lastTick=Date.now();
const speech = window.BoraSpeech.create({profile:()=>state.profile,isRecording:()=>rec.pending||rec.recorder?.state==='recording',onNotice:toast,onChange:updateSpeechDock});
const DEFAULT_PRON_DRAFT='Oi, tudo bem?\nPode falar mais devagar?\nVocê pode repetir, por favor?';
let pronLesson='hello',pronDraft=DEFAULT_PRON_DRAFT;

function toast(message){const t=$('#toast');t.textContent=message;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.hidden=true,4700);}
function go(path){if(location.hash.slice(1)===path){render();window.scrollTo(0,0);}else location.hash=path;}
function navData(){return [['home','home','今日學習','今天'],['daily','calendar','每日短練習','日課'],['plan','map','18 個月計畫','18月'],['courses','book','課程路線','課程'],['cards','cards','單字與複習','單字'],['speak','mic','聽力與口說','口說'],['grammar','document','文法與易混字','文法'],['progress','chart','學習進度','進度'],['settings','settings','偏好與備份','設定']];}
function section(){const root=route.split('/')[0];if(root==='conversation')return 'speak';if(root==='lesson'||root==='quiz')return 'courses';return navData().some(n=>n[0]===root)?root:'home';}
function heading(title,sub,extra=''){return `<div class="page-heading"><div><h1>${title}</h1><p>${sub}</p></div>${extra}</div>`;}
function shell(content){
 const sec=section(),nav=navData();
 return `<aside class="sidebar"><a class="brand" href="#home" aria-label="Bora 首頁"><div class="brandmark">b.</div><div><div class="brand-name">Bora!</div><div class="brand-sub">巴西葡語練習室</div></div></a><div class="nav-section">YOUR LEARNING SPACE</div><nav aria-label="主要選單">${nav.slice(0,-1).map(n=>`<button class="nav-link ${sec===n[0]?'active':''}" data-action="go" data-route="${n[0]}" ${sec===n[0]?'aria-current="page"':''}>${icon(n[1])}${n[2]}${n[0]==='cards'&&dueCards().length?`<span class="badge">${dueCards().length}</span>`:''}</button>`).join('')}</nav><div class="sidebar-bottom"><div class="coach-card">${icon('leaf')}<h3>一點一滴，也是在前進。</h3><p>App 內每天 ${state.profile.dailyMinutes} 分鐘；外部聽力另計 30 分鐘。</p></div><button class="nav-link ${sec==='settings'?'active':''}" data-action="go" data-route="settings">${icon('settings')}偏好與備份</button><div class="local-profile"><div class="avatar">${esc(state.profile.name.slice(0,1).toUpperCase())}</div><div><div class="profile-name">${esc(state.profile.name)}</div><div class="profile-sub">本機個人學習空間</div></div></div></div></aside>
 <div class="shell"><header class="topbar"><div class="breadcrumbs"><span>學習空間</span>${icon('chevron')}<b>${nav.find(n=>n[0]===sec)?.[2]||'今日學習'}</b></div><div class="top-info"><div class="top-language"><span class="flag-br" aria-label="巴西"></span><span>Português do Brasil</span></div><span class="saved" id="save-status"><i class="dot"></i>${storageOK&&!storageLocked?'本機儲存':'暫存模式'}</span><button class="icon-btn" data-action="pron-open" aria-label="開啟發音練習">${icon('volume')}</button><button class="icon-btn" data-action="go" data-route="settings" aria-label="開啟偏好與語音設定">${icon('settings')}</button></div></header><div id="storage-notice" class="notice-banner" role="status" ${storageMessage?'':'hidden'}>${esc(storageMessage)}</div><main id="main" class="main" tabindex="-1">${content}<div class="footer-note">${icon('shield')}Bora! v2.9.1 · A1–C1 商務、生活、旅行 · 正常／慢速音檔 · 每日短練習 · 18 個月招商葡文 · 本機進度 · 非語言能力認證</div></main></div><nav class="mobile-nav" aria-label="行動版選單">${nav.map(n=>`<button class="${sec===n[0]?'active':''}" data-action="go" data-route="${n[0]}" ${sec===n[0]?'aria-current="page"':''}>${icon(n[1])}<span>${n[3]}</span></button>`).join('')}</nav>`;
}
function render(){
 route=location.hash.slice(1)||'home';document.body.classList.toggle('large-type',state.profile.large);
 const [root,arg]=route.split('/');let html='';
 if(root==='home')html=homePage();else if(root==='daily')html=dailyPage();else if(root==='plan')html=board.page(arg);else if(root==='courses'){courseFilter.level=LEVELS.includes(arg)?arg:'all';html=coursesPage();}else if(root==='lesson')html=lessonPage(arg);else if(root==='cards'){if(arg==='words')cardsTab='words';html=cardsPage();}else if(root==='conversation')html=conversationNotes.page(arg,route.split('/')[2]);else if(root==='speak')html=speakPage();else if(root==='grammar'){if(arg==='patterns')grammarTab='patterns';else if(arg==='c1')grammarTab='grammar';html=grammarPage();}else if(root==='progress')html=progressPage();else if(root==='settings')html=settingsPage();else if(root==='quiz')html=quizPage();else html=homePage();
 $('#app').innerHTML=shell(html);updateVoiceUI();updateSaveStatus();updateSpeechDock(speech.snapshot());
 if(root==='speak'&&rec.url)showRecording();
}
function homePage(){
 const d=today(),next=nextLesson(),mins=minutes(),tasks=[d.practiced.length>=6,d.reviews>=5,d.spoken.length>=1],taskTotal=tasks.filter(Boolean).length;
 const recLessons=[next,...LESSONS.filter(l=>l.id!==next.id&&['cafe','expo','intro'].includes(l.id))].slice(0,3);
 const date=new Intl.DateTimeFormat('zh-TW',{month:'long',day:'numeric',weekday:'long'}).format(new Date());
 return pronunciationEntry()+conversationEntry()+board.banner()+`<div class="page-heading"><div><div class="eyebrow">${icon('sun')}Olá, ${esc(state.profile.name)}!</div><h1>今天，也離巴西更近一點。</h1><p>從生活到商務，把每一句葡語變成你的日常。</p></div><div class="date-label">${date}</div></div>
 <div class="home-grid"><div><section class="hero"><div class="hero-copy"><div class="kicker">PEQUENOS PASSOS. GRANDES CONVERSAS.</div><h2>把葡語，<br>說進生活裡。</h2><p>一杯咖啡、一段問候、一場商務對話。<br>從今天 App 內的 ${state.profile.dailyMinutes} 分鐘開始。</p><button class="btn white" data-action="open-lesson" data-id="${next.id}">${icon('play')}開始今日課程${icon('arrow')}</button></div><div class="hero-art" aria-hidden="true"><div class="art-orbit"></div><div class="art-sun"></div><div class="art-leaf"></div><div class="art-badge">${icon('volume')}</div><div class="speech-card"><div class="pt">Oi, tudo bem?</div><small>嗨，你好嗎？</small><div class="wave">${'<i></i>'.repeat(21)}</div></div></div></section>
 <div class="stats-strip">${statCard('flame',streak(),'天','連續學習')}${statCard('book',Object.keys(state.learned).length,'句','已學句型')}${statCard('cards',dueCards().length,'張','到期複習')}</div>
 <section><div class="section-heading"><div><h2>你的學習路線</h2><p>選一個今天用得上的情境，或進入 <a href="#courses/C1">C1 高階選修課</a>。</p></div><button class="text-btn" data-action="go" data-route="courses">全部課程${icon('chevron')}</button></div>${recLessons.map((l,i)=>lessonMini(l,i)).join('')}</section>
 <section class="mt24"><div class="section-heading"><h2>換個方式，練一練</h2><span class="kicker">PRACTICE</span></div><div class="practice-grid"><button class="practice-tile" data-action="speak-tab" data-tab="dialogs">${icon('chat')}<div><strong>走進一段巴西對話</strong><p>點餐、訪園、投資跟催</p></div></button><button class="practice-tile" data-action="grammar-tab" data-tab="traps">${icon('spark')}<div><strong>西文很像，意思不同</strong><p>避開葡語與西語的易混字</p></div></button></div></section></div>
 <aside class="home-side"><section class="panel daily-panel"><div class="row between daily-head"><h2>App 內練習目標</h2><span class="pill neutral">${taskTotal} / 3 完成</span></div><div class="ring-area"><div class="ring" style="--progress:${clamp(mins/state.profile.dailyMinutes*360,0,360)}deg"><div class="ring-inner"><span class="tiny">DAILY GOAL</span><b id="home-minutes">${mins}</b><small>/ ${state.profile.dailyMinutes} 分鐘</small></div></div></div><div class="daily-tasks">${taskRow('book','句型練習','讀懂 6 句實用葡語',Math.min(d.practiced.length,6),6)}${taskRow('cards','單字複習','回想 5 張記憶卡',Math.min(d.reviews,5),5)}${taskRow('mic','開口說一句','跟讀並完成自我檢核',Math.min(d.spoken.length,1),1)}</div><button class="btn block" data-action="daily-next">${taskTotal===3?'今日任務已完成，繼續練習':'繼續今日任務'}${icon('arrow')}</button></section>
 <section class="tip-card"><h3>${icon('spark')}西語使用者的小提醒</h3><div class="pt">escritório ≠ escritorio</div><p>葡語 <b>escritório</b> 是「辦公室」。<br>西語的 <b>escritorio</b> 常指「書桌」。</p><button class="text-btn" data-action="grammar-tab" data-tab="traps">看看容易混淆的字${icon('chevron')}</button></section><div class="note small">先聽、再說、最後回想。<br>時間只在練習頁面有近期操作時累計，不計算閒置的首頁。</div></aside></div>`;
}
function statCard(ic,value,unit,label){return `<div class="stat-card"><div class="stat-icon">${icon(ic)}</div><div><div class="stat-value">${fmtNum(value)}<span>${unit}</span></div><div class="stat-label">${label}</div></div></div>`;}
function taskRow(ic,title,sub,value,max){return `<div class="task-item"><div class="task-icon">${icon(value>=max?'check':ic)}</div><div class="task-text"><b>${title}</b><small>${sub}</small></div><div class="task-status">${value}/${max}</div></div>`;}
function lessonMini(l,i){const done=lessonProgress(l.id);return `<article class="lesson-mini"><div class="lesson-icon ${i===1?'gold':i===2?'blue':''}">${icon(l.icon)}</div><div class="lesson-mini-copy"><div class="row gap8">${pill(l.level)}<span class="tiny muted">${esc(l.tag)}</span></div><h3>${esc(l.title)}</h3><p>6 句型 · 中／葡${state.profile.spanish?'／西':''}對照</p></div><div class="lesson-mini-end"><div><small>${done}/6 已學</small><div class="mini-progress"><span style="width:${done/6*100}%"></span></div></div><button class="icon-btn" data-action="open-lesson" data-id="${l.id}" aria-label="學習：${esc(l.title)}">${icon(completeLesson(l.id)?'check':'chevron')}</button></div></article>`;}
function coursesPage(){return heading('找到你的下一句葡語。',`${LESSONS.length} 個主題 · ${PHRASES.length} 個句型 · A1–C1 為教材參考標籤，不是能力認證。`,`<button class="btn outline small" data-action="quiz-setup">${icon('trophy')}綜合測驗</button>`)+`<div class="filters">${['all',...LEVELS].map(l=>`<button class="chip ${courseFilter.level===l?'active':''}" aria-pressed="${courseFilter.level===l}" data-action="course-level" data-value="${l}">${l==='all'?'全部程度':l}</button>`).join('')}<div class="divider-v"></div>${[['all','全部情境'],['life','日常生活'],['travel','旅行交通'],['business','商務招商']].map(([v,t])=>`<button class="chip ${courseFilter.track===v?'active':''}" data-action="course-track" data-value="${v}">${t}</button>`).join('')}<label class="search-box">${icon('search')}<input type="search" id="course-search" placeholder="搜尋課程或句型" aria-label="搜尋課程" value="${esc(courseFilter.query)}"></label></div>${courseFilter.level==='C1'?`<section class="note mb16"><strong>C1 選修 · 六個情境案例</strong><p>每課用 5–10 分鐘對讀或聆聽兩方說法，再口述或寫下自己的判斷。可自由選課，不會更動 18 個月日課。</p>${c1Links()}</section>`:''}<div id="course-grid" class="course-grid">${courseCards()}</div><div class="note mt24">可從 A1 日常採買、交通，進入 A2 生活與旅行應對，再練 B1–B2 商務；C1 則練調整語氣、讀懂言外之意與整合資訊。每課六句，可跟讀及測驗；標記完成只是自評，不是 CEFR 或 Celpe-Bras 認證。園區條件及旅行時刻需另行查核。</div>`;}
function normalized(text,loose=false){let s=String(text).normalize('NFC').toLocaleLowerCase('pt-BR').replace(/[\p{P}\p{S}]/gu,' ').replace(/\s+/g,' ').trim();return loose?s.normalize('NFD').replace(/\p{M}/gu,''):s;}
function matchQuery(text,query){return normalized(text,true).includes(normalized(query,true));}
function courseCards(){const list=LESSONS.filter(l=>(courseFilter.level==='all'||l.level===courseFilter.level)&&(courseFilter.track==='all'||l.track===courseFilter.track)&&matchQuery([l.title,l.subtitle,l.tag,...l.phrases.flat()].join(' '),courseFilter.query));return list.length?list.map((l,i)=>`<article class="panel course-card"><div class="row between"><div class="lesson-icon ${l.track==='business'?'gold':''}">${icon(l.icon)}</div>${pill(l.level)}</div><h3>${esc(l.title)}</h3><p>${esc(l.subtitle)}</p>${progressLine(lessonProgress(l.id),6)}<footer><small class="muted">${completeLesson(l.id)?'✓ 課程完成':`${lessonProgress(l.id)}/6 句型 · 測驗 ${state.lessonQuiz[l.id]||0}%`}</small><button class="btn small ${completeLesson(l.id)?'secondary':''}" data-action="open-lesson" data-id="${l.id}">${lessonProgress(l.id)?'繼續':'開始'}${icon('arrow')}</button></footer></article>`).join(''):`<div class="panel empty"><h2>沒有符合的課程</h2><p>試試其他關鍵字，或切換回全部程度。</p></div>`;}
function openLesson(id){if(!lessonMap.has(id))return;learning.lesson=id;learning.index=Math.max(0,lphrases(id).findIndex(p=>!state.learned[p.id]));go('lesson/'+id);}
function c1Case(l){
 if(l.level!=='C1'||!l.sources)return '';
 const sampleTexts=new Set(l.phrases.map(p=>p[0]));
 const words=C1.words.filter(w=>sampleTexts.has(w[4]));
 const g=C1.grammar.find(x=>x.id===l.id+'-rule');
 const draft=c1Drafts.get(l.id)||'';
 return `<section class="panel c1-case" aria-label="C1 情境任務"><h2>今天的任務 · 5–10 分鐘</h2>
 <p>${esc(l.task)}</p><p class="small muted">先聽兩方說法，再用下方六句組織自己的回應。以下為虛構情境，非園區承諾、廠商報價或業者規定。</p>
 <div class="c1-sources">${l.sources.map(([speaker,pt,zh],i)=>`<article class="c1-source"><h3>${i+1} · ${esc(speaker)}</h3>
 <p class="pt" lang="pt-BR">${esc(pt)}</p><div class="row wrap">${dailyAudioButton(pt)}${dailyAudioButton(pt,true)}</div>
 <details><summary>看繁中意思</summary><p>${esc(zh)}</p></details></article>`).join('')}</div>
 <details><summary>本課 3 個關鍵詞與發音</summary>${words.map(w=>`<div class="grammar-example"><b lang="pt-BR">${esc(w[1])}</b> · ${esc(w[2])}<p>${esc(w[3])}</p><div class="row wrap">${dailyAudioButton(w[1])}${dailyAudioButton(w[1],true)}</div></div>`).join('')}</details>
 ${g?`<details><summary>本課文法、兩個例句與檢核</summary>${grammarCard(g)}</details>`:''}
 <details><summary>我的作答草稿（選用）</summary><label for="c1-draft">寫下葡語回應，或先記下口說要點：</label>
 <textarea class="c1-draft" id="c1-draft" data-case="${esc(l.id)}" rows="4" maxlength="3000" lang="pt-BR" spellcheck="false" aria-describedby="c1-draft-note">${esc(draft)}</textarea>
 <small id="c1-draft-note"><span id="c1-count">${c1WordCount(draft)}</span> 詞 · 僅暫存在這個分頁；重新整理即清除，不上傳或自動評分。</small></details>
 <details><summary>做完再看：解讀線索與自我檢查</summary><p>${esc(l.insight)}</p><ol>${l.checks.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></details></section>`;
}
function c1Links(){
 return '<div class="c1-tools"><a href="#courses/C1">C1 情境課</a> · <a href="#cards/words/c1">C1 單字與搭配</a> · <a href="#grammar/c1">C1 文法與例句</a></div>';
}
function patternBank(){
 const daily=window.BoraDaily;
 const core=[[daily.phase1,'A1'],[daily.phase2,'A2'],[daily.phase3,'B1']].flatMap(([items,level])=>items.map(x=>({...x,level})));
 return [...core,...C1.grammar.map(g=>({title:g.title,level:g.level,pt:g.examples[0][0],zh:g.examples[0][1],grammar:g.summary,swap:g.examples[1]}))];
}
function lessonPage(id){
 const l=lessonMap.get(id)||LESSONS[0];if(learning.lesson!==l.id){learning.lesson=l.id;learning.index=0;}learning.index=clamp(learning.index,0,5);
 const list=lphrases(l.id),p=list[learning.index],done=!!state.learned[p.id];
 return `<div class="back-line"><button class="text-btn" data-action="go" data-route="${l.level==='C1'?'courses/C1':'courses'}">${icon('back')}返回課程路線</button></div>${heading(esc(l.title),esc(l.subtitle),pill(l.level))}${c1Case(l)}<div class="lesson-layout"><div class="stack"><section class="panel study-card"><div class="phrase-top"><div class="row gap8"><span class="pill neutral">句型 ${learning.index+1} / 6</span><span class="tiny muted">${done?'✓ 已學習':'先聽，再試著說出來'}</span></div>${bookmark(p.id)}</div><p class="kicker">PORTUGUÊS DO BRASIL</p><h2 class="phrase-large pt" lang="pt-BR">${esc(p.pt)}</h2><p class="phrase-zh">${esc(p.zh)}</p>${spanish(p.es,'phrase-es')}<div class="phrase-actions">${l.level==='C1'?dailyAudioButton(p.pt)+dailyAudioButton(p.pt,true):speakBtn(p.pt)+speakBtn(p.pt,true)}<button class="btn outline small" data-action="pron-repeat" data-text="${esc(p.pt)}">${icon('refresh')}跟讀 3 次</button><button class="btn outline small" data-action="practice-phrase" data-id="${p.id}">${icon('mic')}跟讀錄音</button></div><div class="tiny muted voice-status"></div><div class="phrase-note">${icon('spark')} ${esc(p.note)}</div><div class="study-footer"><button class="btn outline small" data-action="lesson-prev" ${learning.index===0?'disabled':''}>${icon('back')}上一句</button><div class="dots">${list.map((x,i)=>`<button class="lesson-dot ${i===learning.index?'active':''} ${state.learned[x.id]?'done':''}" data-action="lesson-index" data-value="${i}" aria-label="前往第 ${i+1} 句" ${i===learning.index?'aria-current="step"':''}></button>`).join('')}</div><button class="btn" data-action="learn-next" data-id="${p.id}">${learning.index===5?'學完，進入測驗':done?'複習完成，下一句':'學會了，下一句'}${icon('arrow')}</button></div></section><div class="note">${esc(l.tip)}</div></div><aside class="lesson-aside stack"><section class="panel"><div class="row between mb16"><h3>這一課的 6 句話</h3><small class="muted">${lessonProgress(l.id)}/6</small></div><div class="sentence-list">${list.map((x,i)=>`<button class="sentence-row ${i===learning.index?'active':''}" data-action="lesson-index" data-value="${i}"><span class="n">${String(i+1).padStart(2,'0')}</span><p>${esc(x.zh)}</p>${state.learned[x.id]?icon('check'):''}</button>`).join('')}</div><button class="btn outline block mt16 small" data-action="pron-lesson-play" data-id="${l.id}">${icon('volume')}全課逐句發音</button><button class="btn secondary block mt16 small" data-action="lesson-quiz" data-id="${l.id}">${icon('trophy')}測驗這一課</button><button class="text-btn" data-action="start-listening" data-id="${l.id}">${icon('headphones')}只聽聲音挑戰</button></section></aside></div>`;
}
function markLearned(id){if(!phrase(id))return;const d=today();if(!state.learned[id])state.learned[id]=Date.now();if(!d.practiced.includes(id))d.practiced.push(id);if(!state.srs[id])state.srs[id]={step:0,due:Date.now()+DAY,reps:0,lapses:0};award('learn:'+id,5);save();}
function shuffled(list){const arr=[...list];for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
function startQuiz(mode='reading',lessonId=null,pool='all'){
 let list=lessonId?lphrases(lessonId):pool==='c1'?PHRASES.filter(p=>p.level==='C1'):pool==='wrong'?state.mistakes.map(phrase).filter(Boolean):pool==='learned'?PHRASES.filter(p=>state.learned[p.id]):PHRASES;
 if(!list.length){toast(pool==='wrong'?'目前沒有錯題，先做一次測驗。':'目前沒有已學句型，請先學一課。');return;}
 const items=shuffled(list).slice(0,lessonId?6:10).map(p=>{const distractors=shuffled((lessonId||pool==='c1'?list:PHRASES).filter(o=>o.id!==p.id&&o.zh!==p.zh)).slice(0,3);const choices=shuffled([p,...distractors]);return {id:p.id,choices:choices.map(x=>x.zh),answer:choices.findIndex(x=>x.id===p.id)};});
 quiz={mode,lessonId,pool,items,index:0,answers:[],answered:false,selected:null,draft:'',final:false,saved:false};go('quiz/run');
}
function quizPage(){
 if(!quiz||route==='quiz/setup')return heading('用一個小測驗，看看記住多少。','閱讀選義、聽力選義或逐句聽寫；成績只反映本題組表現。')+`<div class="quiz-wrap"><section class="panel"><div class="form-field"><label for="quiz-pool">選擇題庫</label><select id="quiz-pool"><option value="all">全部 ${PHRASES.length} 句（隨機最多 10 題）</option><option value="c1" ${courseFilter.level==='C1'?'selected':''}>C1 情境句（${PHRASES.filter(p=>p.level==='C1').length} 句）</option><option value="learned">只考已學句型（${Object.keys(state.learned).length} 句）</option><option value="wrong">重練錯題（${state.mistakes.length} 句）</option></select></div><div class="form-field"><label for="quiz-mode">練習方式</label><select id="quiz-mode"><option value="reading">閱讀理解：看葡語，選中文</option><option value="listening">聽力理解：聽葡語，選中文</option><option value="dictation">聽寫：聽葡語，輸入原句</option></select></div><div class="note">固定題庫已有巴葡神經合成音，也可選系統 pt-BR 語音。播放器不顯示未作答的答案，不會自動用歐洲葡語替代。聽寫只比對本題示範文字，忽略大小寫與標點，但保留重音符號差異。</div><div class="tiny muted voice-status mt12"></div><button class="btn mt24" data-action="begin-quiz">${icon('play')}開始測驗</button></section></div>`;
 if(quiz.final)return quizResults();
 const q=quiz.items[quiz.index],p=phrase(q.id),ans=quiz.answers[quiz.index];
 return `${heading(quiz.lessonId?esc(lessonMap.get(quiz.lessonId).title)+' · 小測驗':{'reading':'閱讀理解','listening':'聽力理解','dictation':'逐句聽寫'}[quiz.mode],`第 ${quiz.index+1} / ${quiz.items.length} 題 · 答完後即時訂正`)}<div class="quiz-wrap"><section class="panel study-card"><div class="row between mb16"><span class="pill">${quiz.mode==='reading'?'看句子，選出意思':quiz.mode==='listening'?'聽聲音，選出意思':'聽聲音，寫出原句'}</span><button class="text-btn" data-action="quit-quiz">結束練習</button></div>${progressLine(quiz.index,quiz.items.length)}${quiz.mode==='reading'?`<h2 class="question pt" lang="pt-BR">${esc(p.pt)}</h2>`:`<div class="speech-controls">${speakBtn(p.pt)}${speakBtn(p.pt,true)}</div><p class="tiny muted voice-status center"></p><button class="text-btn" data-action="quiz-to-reading">沒有語音？改為閱讀測驗</button>`}
 ${quiz.mode==='dictation'?`<div class="form-field mt16"><label for="dictation">輸入聽到的葡語（可重播）</label><textarea id="dictation" class="dictation-input" lang="pt-BR" spellcheck="false" autocomplete="off" ${quiz.answered?'disabled':''}>${esc(quiz.draft)}</textarea><div class="char-keys">${'ãõáéíóúâêôç'.split('').map(c=>`<button class="char-key" data-action="insert-char" data-char="${c}" ${quiz.answered?'disabled':''}>${c}</button>`).join('')}</div></div>${!quiz.answered?`<button class="btn" data-action="dictation-check">${icon('check')}檢查聽寫</button>`:''}`:`<div class="options mt24">${q.choices.map((text,i)=>`<button class="option ${quiz.answered&&i===q.answer?'correct':quiz.answered&&i===quiz.selected?'wrong':''}" data-action="quiz-answer" data-value="${i}" ${quiz.answered?'disabled':''}><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${esc(text)}</span></button>`).join('')}</div>`}
 ${quiz.answered?`<div class="feedback ${ans.correct?'':'error'}" role="status"><strong>${ans.correct?'答對了！':ans.accentOnly?'字詞相符，請再注意重音符號。':'這題再記一下。'}</strong><p class="pt mt8" lang="pt-BR">${esc(p.pt)}</p><p>${esc(p.zh)}</p>${spanish(p.es)}<p class="small mt8">${esc(p.note)}</p><button class="btn small" data-action="quiz-next">${quiz.index===quiz.items.length-1?'查看結果':'下一題'}${icon('arrow')}</button></div>`:''}</section></div>`;
}
function answerQuiz(value,draft=''){
 if(!quiz||quiz.answered||quiz.final)return;const q=quiz.items[quiz.index],p=phrase(q.id);let correct,accentOnly=false;
 if(quiz.mode==='dictation'){if(!draft.trim()){toast('先輸入你聽到的句子。');return;}correct=normalized(draft)===normalized(p.pt);accentOnly=!correct&&normalized(draft,true)===normalized(p.pt,true);quiz.draft=draft;}else correct=value===q.answer;
 quiz.selected=value;quiz.answered=true;quiz.answers.push({id:p.id,correct,accentOnly,draft,selected:value});
 if(!correct&&!state.mistakes.includes(p.id))state.mistakes.push(p.id);if(correct)state.mistakes=state.mistakes.filter(x=>x!==p.id);award('answer:'+quiz.mode+':'+p.id,correct?3:1);save();render();
}
function finishQuiz(){
 if(!quiz||quiz.saved)return;quiz.final=true;quiz.saved=true;const correct=quiz.answers.filter(a=>a.correct).length,score=Math.round(correct/quiz.items.length*100);
 if(quiz.lessonId&&quiz.mode==='reading')state.lessonQuiz[quiz.lessonId]=Math.max(state.lessonQuiz[quiz.lessonId]||0,score);
 today().quizzes++;state.history.push({at:Date.now(),mode:quiz.mode,correct,total:quiz.items.length});state.history=state.history.slice(-100);save();
}
function quizResults(){const correct=quiz.answers.filter(a=>a.correct).length,score=Math.round(correct/quiz.items.length*100),wrong=quiz.answers.filter(a=>!a.correct);return `<div class="quiz-wrap"><section class="panel center"><span class="kicker">PRACTICE COMPLETE</span><div class="result-circle">${score}%</div><h1 class="result-title">${score>=80?'做得好，再把句子說一次。':'練習完成，訂正也是進步。'}</h1><p class="muted">本次 ${quiz.items.length} 題，答對 ${correct} 題。</p>${quiz.lessonId&&quiz.mode==='reading'?`<p class="small mt12">${completeLesson(quiz.lessonId)?'✓ 這一課已完成。':score>=80?'測驗已通過；把這課 6 句都標記學習後即可完成課程。':'這課閱讀測驗需至少 80% 才標記通過。'}</p>`:''}<div class="row wrap mt24" style="justify-content:center"><button class="btn" data-action="quiz-retry">${icon('refresh')}再練一次</button><button class="btn secondary" data-action="go" data-route="${quiz.lessonId?'lesson/'+quiz.lessonId:'progress'}">${quiz.lessonId?'回到課程':'查看進度'}</button></div>${wrong.length?`<div class="result-list">${wrong.map(a=>{const p=phrase(a.id);return `<div class="result-item"><div class="pt" lang="pt-BR">${esc(p.pt)}</div><p>${esc(p.zh)}</p>${a.draft?`<p class="small muted">你的聽寫：${esc(a.draft)}</p>`:''}<div class="mt8">${speakBtn(p.pt)}</div></div>`;}).join('')}</div>`:''}<div class="note mt24">這是題組回饋，不是 CEFR 等級測試，也不是發音評分。錯題會保留在「單字與複習 → 句型庫 → 錯題」。</div></section></div>`;}
function cardsPage(){return heading('單字與複習。','初級到高階的商務、生活及旅行詞彙；原有間隔複習進度仍保留。')+`<div class="tabbar"><button class="tab ${cardsTab==='words'?'active':''}" data-action="cards-tab" data-tab="words">${icon('book')} 主題單字 · ${EXTRA.words.length}</button><button class="tab ${cardsTab==='review'?'active':''}" data-action="cards-tab" data-tab="review">${icon('refresh')} 間隔複習</button><button class="tab ${cardsTab==='library'?'active':''}" data-action="cards-tab" data-tab="library">${icon('book')} 句型庫 · ${PHRASES.length}</button></div>${cardsTab==='words'?expandedWordsPage():cardsTab==='review'?reviewPage():libraryPage()}`;}
function expandedWordsPage(){return audioHelpPanel()+`<div class="note mb16">${route==='cards/words/c1'?`C1 高階搭配 · ${C1.words.length} 個詞條`:`${EXTRA.words.length} 個主題詞條，從入門到 C1`}。可搜尋工作、生活及旅行用語。詞與例句各有獨立正常／慢速 MP3，不依賴手機系統語音。這些詞卡尚未加入舊版的間隔複習排程。</div><nav class="c1-tools" aria-label="單字範圍"><a href="#cards/words">全部詞條</a> · <a href="#cards/words/c1">只看 C1</a></nav><div class="filters"><label class="search-box">${icon('search')}<input type="search" id="expanded-word-search" aria-label="搜尋新增單字" placeholder="搜尋葡文、中文或相關字" value="${esc(expandedWordQuery)}"></label></div><div class="grammar-grid" id="expanded-word-grid">${expandedWordCards()}</div>`;}
function expandedWordCards(){const list=EXTRA.words.filter(w=>(route!=='cards/words/c1'||w[0]==='C1')&&matchQuery(w.join(' '),expandedWordQuery));return list.length?list.map(([level,pt,zh,form,example,translation,related])=>`<article class="panel grammar-card"><div class="row between">${pill(level)}<span class="tiny muted">新詞彙</span></div><h3 class="pt" lang="pt-BR">${esc(pt)}</h3><p>${esc(zh)}</p><p class="small muted mt8">形式／用法：${esc(form)}</p><div class="row wrap mt12">${dailyAudioButton(pt)}${dailyAudioButton(pt,true)}</div><div class="grammar-example mt16"><div class="pt" lang="pt-BR">${esc(example)}</div><div class="zh">${esc(translation)}</div><div class="row wrap mt8">${dailyAudioButton(example)}${dailyAudioButton(example,true)}</div></div><p class="small mt12">相關字：${esc(related)}</p></article>`).join(''):`<section class="panel empty"><h2>沒有符合的單字</h2><p>試試葡語原形或中文關鍵字。</p></section>`;}
function reviewPage(){
 if(!review){const due=dueCards(),fresh=PHRASES.filter(p=>!state.srs[p.id]);return `<section class="panel empty"><div>${icon('cards')}</div><span class="pill">${due.length} 張到期 · ${fresh.length} 張未加入</span><h2 class="mt16">${due.length?'今天，先把這幾句找回來。':'現在沒有到期卡片。'}</h2><p>${due.length?'先看中文，在心裡或大聲說出葡語，再翻卡核對。':'可以先練 10 張新卡，或到課程中學習句型。已學句型會自動加入明天的複習。'}</p><div class="row wrap" style="justify-content:center">${due.length?`<button class="btn" data-action="start-review" data-mode="due">複習到期卡片${icon('arrow')}</button>`:''}${fresh.length?`<button class="btn ${due.length?'secondary':''}" data-action="start-review" data-mode="new">練習 ${Math.min(10,fresh.length)} 張新卡</button>`:''}${Object.keys(state.srs).length?`<button class="btn outline" data-action="start-review" data-mode="practice">自由回想（不更動排程）</button>`:''}<button class="btn outline" data-action="cards-tab" data-tab="library">查看全部句型</button></div><div class="note mt24" style="max-width:620px;margin-left:auto;margin-right:auto">再來一次：10 分鐘後；有點難：1 天後；記住了／很熟悉：依卡片階段安排 1、3、7、14、30、60 天。熟悉度由你自行判斷。</div></section>`;}
 if(review.index>=review.ids.length)return `<section class="panel empty"><div>${icon('trophy')}</div><h2>這輪複習完成。</h2><p>你已回想 ${review.ids.length} 張卡片。${review.practice?'本輪是自由回想，沒有改變原先的複習日期。':'新的日期已依你的自評排入本機進度。'}</p><button class="btn" data-action="end-review">回到複習首頁</button></section>`;
 const p=phrase(review.ids[review.index]),s=state.srs[p.id]||{step:0};return `<div class="review-meta row between"><span>第 ${review.index+1} / ${review.ids.length} 張 · ${esc(lessonMap.get(p.lesson).title)}</span><button class="text-btn" data-action="end-review">結束這輪</button></div><section class="review-card"><div class="row between" style="width:100%">${pill(p.level)}${bookmark(p.id)}</div>${review.revealed?`<p class="kicker mt16">ANSWER · 試著再說一次</p><h2 class="phrase-large pt" lang="pt-BR">${esc(p.pt)}</h2><p class="phrase-zh">${esc(p.zh)}</p>${spanish(p.es)}<div class="mt16">${speakBtn(p.pt)} ${speakBtn(p.pt,true)}</div><p class="small muted mt16">${esc(p.note)}</p>`:`<p class="kicker mt24">怎麼用葡語說？</p><h2 class="review-front">${esc(p.zh)}</h2><button class="btn secondary" data-action="reveal-card">${icon('eye')}翻開答案</button><p class="tiny muted mt12">電腦可按空白鍵翻卡</p>`}</section>${review.revealed?`<div class="review-controls">${[['again','再來一次','10 分鐘後','danger'],['hard','有點難','1 天後','outline'],['good','記住了',reviewDays(s.step,'good')+' 天後','secondary'],['easy','很熟悉',reviewDays(s.step,'easy')+' 天後','']].map(([v,t,sub,cls],i)=>`<button class="btn ${cls}" data-action="rate-card" data-value="${v}">${t}<small>${review.practice?'不更動排程':sub} · 按 ${i+1}</small></button>`).join('')}</div>`:''}`;
}
const INTERVALS=[1,3,7,14,30,60];
function reviewDays(step,rating){const next=clamp(step+(rating==='easy'?2:1),1,6);return INTERVALS[next-1];}
function startReview(mode){const list=mode==='due'?dueCards():mode==='practice'?shuffled(PHRASES.filter(p=>state.srs[p.id])).slice(0,10):PHRASES.filter(p=>!state.srs[p.id]).slice(0,10);if(!list.length){toast('目前沒有這一類卡片。');return;}review={ids:list.map(p=>p.id),index:0,revealed:false,practice:mode==='practice'};cardsTab='review';go('cards');}
function rateCard(rating){
 if(!review||!review.revealed||review.index>=review.ids.length||!['again','hard','good','easy'].includes(rating))return;
 const id=review.ids[review.index],s=state.srs[id]||{step:0,reps:0,lapses:0,due:Date.now()};
 if(review.practice){today().reviews++;award('review:'+id,3);review.index++;review.revealed=false;save();render();return;}
 if(rating==='again'){s.step=0;s.due=Date.now()+600000;s.lapses++;}else if(rating==='hard'){s.step=Math.max(0,s.step-1);s.due=Date.now()+DAY;}else{s.due=Date.now()+reviewDays(s.step,rating)*DAY;s.step=clamp(s.step+(rating==='easy'?2:1),1,6);if(!state.learned[id])state.learned[id]=Date.now();}
 s.reps++;state.srs[id]=s;today().reviews++;award('review:'+id,3);review.index++;review.revealed=false;save();render();
}
function libraryPage(){return `<div class="filters">${[['all','全部句型'],['favorite',`已收藏 ${state.favorites.length}`],['learned','已學習'],['wrong',`錯題 ${state.mistakes.length}`]].map(([v,t])=>`<button class="chip ${libraryFilter.type===v?'active':''}" data-action="library-type" data-value="${v}">${t}</button>`).join('')}<label class="search-box">${icon('search')}<input type="search" id="library-search" aria-label="搜尋句型" placeholder="搜尋葡語、中文或西文" value="${esc(libraryFilter.query)}"></label></div><div class="library-grid" id="library-grid">${libraryCards()}</div>`;}
function libraryCards(){const list=PHRASES.filter(p=>(libraryFilter.type==='all'||libraryFilter.type==='favorite'&&state.favorites.includes(p.id)||libraryFilter.type==='learned'&&state.learned[p.id]||libraryFilter.type==='wrong'&&state.mistakes.includes(p.id))&&matchQuery(p.pt+' '+p.zh+' '+p.es,libraryFilter.query));return list.length?list.map(p=>`<article class="panel phrase-card"><div class="row between"><div class="row gap8">${pill(p.level)}<span class="tiny muted">${esc(lessonMap.get(p.lesson).tag)}</span></div>${bookmark(p.id)}</div><h3 class="pt" lang="pt-BR">${esc(p.pt)}</h3><p class="zh">${esc(p.zh)}</p>${spanish(p.es)}<div class="row wrap mt16">${speakBtn(p.pt)}<button class="btn outline small" data-action="practice-phrase" data-id="${p.id}">${icon('mic')}跟讀</button></div>${state.srs[p.id]?`<p class="tiny muted mt12">下次複習：${state.srs[p.id].due<=Date.now()?'現在':new Date(state.srs[p.id].due).toLocaleDateString('zh-TW')}</p>`:''}</article>`).join(''):`<section class="panel empty"><h2>這裡還沒有句型</h2><p>可切換回全部句型，或在課程中按星星收藏。</p></section>`;}
function speakPage(){return heading('先聽一句，再說一句。','巴西葡語示範、跟讀錄音、情境回應。這一版不提供 AI 對話或發音評分。')+`<div class="tabbar">${[['pronunciation','發音播放器'],['shadow','跟讀與錄音'],['dialogs','情境會話'],['sounds','發音重點']].map(([v,t])=>`<button class="tab ${speakTab===v?'active':''}" data-action="speak-tab" data-tab="${v}">${t}</button>`).join('')}<a class="tab" href="#conversation">會話解析與單字</a></div>${speakTab==='pronunciation'?pronunciationPage():speakTab==='shadow'?shadowPage():speakTab==='sounds'?soundsPage():dialogsPage()}`;}
function shadowPage(){const p=phrase(speakId)||PHRASES[0];return `<div class="quiz-wrap"><section class="panel"><div class="form-field"><label for="speak-phrase">選一句今天要說的話</label><select id="speak-phrase">${LESSONS.map(l=>`<optgroup label="${esc(l.level+' · '+l.title)}">${lphrases(l.id).map(x=>`<option value="${x.id}" ${p.id===x.id?'selected':''}>${esc(x.pt)}</option>`).join('')}</optgroup>`).join('')}</select></div><div class="speech-stage"><span class="pill">${p.level} · ${esc(lessonMap.get(p.lesson).tag)}</span><h2 class="phrase-large pt" lang="pt-BR">${esc(p.pt)}</h2><p class="phrase-zh">${esc(p.zh)}</p>${spanish(p.es)}<div class="speech-controls">${speakBtn(p.pt)}${speakBtn(p.pt,true)}<button class="btn record-btn ${rec.recorder?.state==='recording'?'recording':''}" id="record-button" data-action="record">${icon(rec.recorder?.state==='recording'?'stop':'mic')}${rec.recorder?.state==='recording'?'停止錄音':'錄下我的聲音'}</button></div><div class="record-status" id="record-status" role="status">${rec.pending?'正在等候麥克風權限…':'每段最長 45 秒；按下錄音才要求麥克風權限。'}</div><div class="tiny muted voice-status"></div></div><div id="record-result" class="audio-result"></div><div class="note mt16">錄音只保留在本次頁面記憶體，不會由 App 上傳。切換頁面或重新錄音會清除前一段；可以先下載錄音。可用裝置 pt-BR 語音或巴葡神經合成音；線上語音另需同意。</div><h3 class="mt24">回聽後，自己檢查三件事</h3><ul class="checklist"><li>詞和詞之間，是否接得自然？</li><li>重要單字是否清楚，而不是搶快？</li><li>再聽一次示範，找一個可以修正的小地方。</li></ul><button class="btn secondary" data-action="mark-speaking" data-id="${p.id}">${icon('check')}${today().spoken.includes(p.id)?'今日已完成這句自我檢核':'我已跟讀並完成自我檢核'}</button><p class="tiny muted mt12">此按鈕記錄你的自評完成；不會自動判斷有沒有出聲，也不產生發音分數。</p></section></div>`;}
function soundsPage(){return `<div class="note">巴西有多種口音。以下是入門提醒，不把某一種發音當作全巴西唯一標準；可選 pt-BR 系統語音或巴葡神經合成音；合成示範不能取代老師對口型、地方口音與自然韻律的指導。</div><div class="sounds-grid">${C.sounds.map(s=>`<article class="panel sound-card"><h3>${esc(s.title)}</h3><div class="pt" lang="pt-BR">${esc(s.sample)}</div><p>${esc(s.note)}</p><div class="mt16">${speakBtn(s.sample)} ${speakBtn(s.sample,true)}</div></article>`).join('')}</div><div class="note mt24"><span class="voice-status"></span> 前往「偏好與備份」可選擇可用語音。</div>`;}
function dialogsPage(){
 if(!dialog)return `<div class="note mb16"><a href="#conversation">會話解析與單字庫 →</a><br>腳本情境練習：讀／聽對方說的話，再選擇符合任務的回答。這不是自由聊天，也沒有連接 AI 服務。</div><div class="dialog-grid">${C.dialogs.map(d=>`<article class="panel dialog-card"><div class="row between"><div class="lesson-icon">${icon(d.icon)}</div>${pill(d.level)}</div><h3>${esc(d.title)}</h3><p>${esc(d.context)}</p><button class="btn ${state.dialogsDone.includes(d.id)?'secondary':''} small" data-action="start-dialog" data-id="${d.id}">${state.dialogsDone.includes(d.id)?'再練一次':'開始對話'}${icon('arrow')}</button><a class="text-btn mt8" href="#conversation/${esc(d.id)}/0">文法・例句・單字解析 ${icon('chevron')}</a></article>`).join('')}</div>`;
 const d=C.dialogs.find(x=>x.id===dialog.id);
 if(dialog.index>=d.steps.length)return `<div class="quiz-wrap"><section class="panel empty"><div>${icon('chat')}</div><h2>你完成了一段對話。</h2><p>${esc(d.context)}<br>已完成 ${d.steps.length} 個回應任務。這是腳本情境練習，不代表真實口語能力評估。</p><button class="btn" data-action="end-dialog">回到情境列表</button> <a class="btn secondary" href="#conversation/${esc(d.id)}/0">複習本情境文法與單字</a></section></div>`;
 const q=d.steps[dialog.index];return `<div class="quiz-wrap"><section class="panel"><div class="row between"><div><h2>${esc(d.title)}</h2><p class="small muted">角色：${esc(d.role)} · 第 ${dialog.index+1}/${d.steps.length} 輪</p></div><button class="text-btn" data-action="end-dialog">離開</button></div><div class="chat-log">${d.steps.slice(0,dialog.index+1).map((s,i)=>`<div class="bubble"><small>${esc(d.role)}</small><div class="pt" lang="pt-BR">${esc(s.pt)}</div><p class="zh">${esc(s.zh)}</p>${spanish(s.es)}<div class="row wrap mt8">${speakBtn(s.pt)}${speakBtn(s.pt,true)}</div></div>${i<dialog.index?`<div class="bubble me"><small>你的回應</small><div class="pt" lang="pt-BR">${esc(s.options[s.answer])}</div></div>`:''}`).join('')}</div><h3 class="mb16">選擇最符合這個任務的回應</h3><div class="options">${q.options.map((t,i)=>`<button class="option ${dialog.selected===i?(i===q.answer?'correct':'wrong'):''}" data-action="dialog-answer" data-value="${i}" ${dialog.correct?'disabled':''}><span class="option-letter">${String.fromCharCode(65+i)}</span><span lang="pt-BR">${esc(t)}</span></button>`).join('')}</div>${dialog.selected!==null?`<div class="feedback ${dialog.correct?'':'error'}" role="status"><strong>${dialog.correct?'這個回應符合任務。':'這句不符合目前任務，請再選一次。'}</strong>${dialog.correct?`<p class="mt8">${esc(q.note)}</p><div class="mt12">${speakBtn(q.options[q.answer])}${speakBtn(q.options[q.answer],true)}</div><button class="btn small" data-action="dialog-next">${dialog.index===d.steps.length-1?'完成對話':'繼續對話'}${icon('arrow')}</button>`:''}</div>`:''}${conversationNotes.panel(d.id,dialog.index,{open:dialog.correct})}${dialog.correct?`<button class="btn small" data-action="dialog-next">${dialog.index===d.steps.length-1?'完成對話':'繼續對話'}${icon('arrow')}</button>`:''}</section></div>`;
}
function grammarPage(){return heading('看懂句子的規則。','從 A1 到 C1：文法、可套用句型與西葡易混字。')+audioHelpPanel()+`<div class="tabbar"><button class="tab ${grammarTab==='grammar'?'active':''}" data-action="grammar-tab" data-tab="grammar">文法重點 · ${C.grammar.length}</button><button class="tab ${grammarTab==='patterns'?'active':''}" data-action="grammar-tab" data-tab="patterns">句型拓展 · ${patternBank().length}</button><button class="tab ${grammarTab==='traps'?'active':''}" data-action="grammar-tab" data-tab="traps">葡西易混字 · ${C.traps.length}</button></div>${grammarTab==='traps'?`<section class="panel"><h2 class="mb16">長得很像，不代表意思一樣。</h2><div class="table-scroll"><table class="traps-table"><thead><tr><th>巴西葡語</th><th>中文意思</th><th>西語對照</th><th>容易混淆的地方</th></tr></thead><tbody>${C.traps.map(t=>`<tr><td><span lang="pt-BR">${esc(t[0])}</span><br><button class="text-btn" data-action="speak" data-text="${esc(t[0])}">${icon('volume')}聽發音</button></td><td>${esc(t[1])}</td><td lang="es">${esc(t[2])}</td><td>${esc(t[3])}</td></tr>`).join('')}</tbody></table></div></section>`:grammarTab==='patterns'?expandedPatterns():`<nav class="c1-tools" aria-label="文法範圍"><a href="#grammar" data-action="grammar-tab" data-tab="grammar">全部文法</a> · <a href="#grammar/c1">只看 C1（${C1.grammar.length}）</a></nav><div class="grammar-grid">${(route==='grammar/c1'?C1.grammar:C.grammar).map(g=>grammarCard(g)).join('')}</div>`}`;}
function expandedPatterns(){const bank=patternBank();return `<div class="note mb16">${bank.length} 組可替換的句型，包括原有每日教材和 ${C1.grammar.length} 組 C1 進階表達。每張有示範、文法說明及替換句；不表示園區條件已獲確認。</div><div class="grammar-grid">${bank.map((l,i)=>`<article class="panel grammar-card"><div class="row between">${pill(l.level)}<span class="tiny muted">句型 ${i+1}/${bank.length}</span></div><h3>${esc(l.title)}</h3><div class="grammar-example"><div class="pt" lang="pt-BR">${esc(l.pt)}</div><div class="zh">${esc(l.zh)}</div><div class="row wrap mt8">${dailyAudioButton(l.pt)}${dailyAudioButton(l.pt,true)}</div></div><p class="mt12">${esc(l.grammar)}</p><div class="grammar-example mt12"><div class="pt" lang="pt-BR">${esc(l.swap?.[0]||'')}</div><div class="zh">${esc(l.swap?.[1]||'')}</div>${l.swap?.[0]?`<div class="row wrap mt8">${dailyAudioButton(l.swap[0])}${dailyAudioButton(l.swap[0],true)}</div>`:''}</div></article>`).join('')}</div>`;}
function grammarCard(g){const a=grammarAnswer[g.id],has=a!==undefined,correct=a===g.answer;return `<article class="panel grammar-card" id="grammar-${g.id}"><div class="row between">${pill(g.level)}<span class="tiny muted">${state.grammarDone.includes(g.id)?'✓ 已答對檢核':''}</span></div><h3>${esc(g.title)}</h3><p>${esc(g.summary)}</p><div class="grammar-examples">${g.examples.map(x=>`<div class="grammar-example"><div class="pt" lang="pt-BR">${esc(x[0])}</div><div class="zh">${esc(x[1])}</div>${spanish(x[2])}<div class="row wrap mt8">${dailyAudioButton(x[0])}${dailyAudioButton(x[0],true)}</div></div>`).join('')}</div><h4 class="small mb16">${esc(g.question)}</h4><div class="options">${g.options.map((t,i)=>`<button class="option ${has&&i===a?(correct?'correct':'wrong'):''}" data-action="grammar-answer" data-id="${g.id}" data-value="${i}" ${correct?'disabled':''}><span class="option-letter">${String.fromCharCode(65+i)}</span><span lang="pt-BR">${esc(t)}</span></button>`).join('')}</div>${has?`<div class="feedback ${correct?'':'error'}" role="status"><strong>${correct?'答對了。':'再想一下。'}</strong> ${esc(g.explain)}</div>`:''}</article>`;}
function progressPage(){const learned=Object.keys(state.learned).length,totalSeconds=Object.values(state.days).reduce((s,d)=>s+d.seconds,0),hist=state.history.slice(-10).reverse(),last7=Array.from({length:7},(_,i)=>{const k=dayOffset(i-6);return {key:k,min:Math.floor((state.days[k]?.seconds||0)/60)};}),max=Math.max(state.profile.dailyMinutes,...last7.map(d=>d.min),1);return heading('每一次練習，都算數。','以下皆來自本機的實際操作紀錄；未以示範數據填入成績。')+`<div class="stats-strip">${statCard('flame',streak(),'天','連續學習')}${statCard('clock',Math.floor(totalSeconds/60),'分鐘','累計有效練習時間')}${statCard('spark',totalXP(),'XP','練習累積點數')}</div><div class="progress-grid"><section class="panel chart-panel"><div class="row between"><h3>最近 7 天的練習</h3><span class="tiny muted">分鐘 · 本機時區</span></div><div class="week-chart" role="img" aria-label="${last7.map(d=>d.key+'：'+d.min+'分鐘').join('；')}">${last7.map((d,i)=>`<div class="bar-col ${i===6?'today':''}"><span class="bar-value">${d.min}</span><div class="bar-track"><div class="bar" style="height:${d.min/max*100}%"></div></div><span class="bar-label">${i===6?'今天':d.key.slice(5).replace('-','/')}</span></div>`).join('')}</div><p class="tiny muted mt24">在練習頁面且近 60 秒內有操作才累計時間；切換背景不計時。這是活動時間估計，不是專注力測量。</p></section><section class="panel"><h3>教材覆蓋進度</h3>${LEVELS.map(l=>{const list=PHRASES.filter(p=>p.level===l),n=list.filter(p=>state.learned[p.id]).length;return `<div class="level-row"><div class="row between"><b>${l} ${l==='A1'?'生活短句':l==='A2'?'情境溝通':l==='B1'?'商務練習':l==='C1'?'高階情境':'進階示範'}</b><small>${n}/${list.length} 句型</small></div>${progressLine(n,list.length)}</div>`;}).join('')}<p class="tiny muted">這是教材完成度，不是 CEFR 能力等級。</p></section></div><section class="panel mt24"><div class="row between mb16"><h2>練習里程碑</h2><span class="pill">${LESSONS.filter(l=>completeLesson(l.id)).length}/${LESSONS.length} 課程完成</span></div><div class="row wrap"><span class="pill neutral">${learned}/${PHRASES.length} 已學句型</span><span class="pill neutral">${state.grammarDone.length}/${C.grammar.length} 文法檢核</span><span class="pill neutral">${state.dialogsDone.length}/6 情境會話</span><span class="pill gold">${state.mistakes.length} 句待訂正</span></div><div class="row wrap mt16"><button class="btn secondary small" data-action="quiz-wrong">${icon('refresh')}練習錯題</button><button class="btn outline small" data-action="export">${icon('download')}備份進度</button></div></section><section class="panel mt24"><h2 class="mb16">最近測驗</h2>${hist.length?`<div class="table-scroll"><table class="traps-table"><thead><tr><th>日期</th><th>方式</th><th>本題組結果</th></tr></thead><tbody>${hist.map(h=>`<tr><td style="font-size:13px;font-weight:400">${new Date(h.at).toLocaleString('zh-TW')}</td><td>${{reading:'閱讀理解',listening:'聽力選義',dictation:'逐句聽寫'}[h.mode]}</td><td>${h.correct}/${h.total} · ${Math.round(h.correct/h.total*100)}%</td></tr>`).join('')}</tbody></table></div>`:`<p class="muted small">尚未完成測驗。完成一課後，可以用 6 題小測驗檢查理解。</p>`}</section>`;}
function settingsPage(){return heading('把練習空間，調成你的樣子。','不需要登入，進度保存在此瀏覽器。備份 JSON 是明文；與此站共用網域的網頁也可能讀取本機資料，請勿填入機密的訪客或招商資訊。')+`<div class="settings-layout"><div class="stack"><section class="panel"><h2>學習偏好</h2><div class="form-field"><label for="profile-name">如何稱呼你</label><input id="profile-name" maxlength="32" value="${esc(state.profile.name)}" autocomplete="off"></div><div class="form-field"><label for="daily-minutes">每日 App 內練習目標（另計聽力 30 分鐘）</label><select id="daily-minutes">${[5,10,15,20,30].map(n=>`<option value="${n}" ${state.profile.dailyMinutes===n?'selected':''}>${n} 分鐘</option>`).join('')}</select></div><label class="switch-row" for="show-spanish"><span>顯示西班牙文輔助對照</span><input type="checkbox" id="show-spanish" ${state.profile.spanish?'checked':''}></label><label class="switch-row" for="large-text"><span>大字練習模式</span><input type="checkbox" id="large-text" ${state.profile.large?'checked':''}></label><button class="btn" data-action="save-profile">${icon('check')}儲存偏好</button></section><section class="panel"><h2>巴西葡語語音</h2><div class="form-field"><label for="voice-engine">聲音來源</label><select id="voice-engine">${engineOptions()}</select><small>內建音檔不依賴系統語音；系統語音可朗讀你新增的文字。</small></div><div class="form-field"><label for="voice-select">可用的 pt-BR 語音</label><select id="voice-select"></select><small>只列出語言標籤為 pt-BR 的語音；不會拿 pt-PT 冒充。</small></div><label class="switch-row" for="local-only"><span>只使用裝置本機語音</span><input type="checkbox" id="local-only" ${state.profile.localOnly?'checked':''}></label><p class="small muted voice-status"></p><div class="row wrap mt16"><button class="btn secondary small" data-action="save-voice">儲存語音設定</button>${speakBtn('Olá! Vamos aprender português do Brasil?')}<button class="btn outline small" data-action="pron-test">試聽清晰發音</button><button class="text-btn" data-action="pron-voices">重新偵測</button></div><div class="note mt16">固定教材採 Dora 巴西葡語神經合成音（非真人）。正常與慢速為分開生成的音檔；不再播放舊 eSpeak 音色。自訂文字找不到語音時：先在作業系統的語音／朗讀功能中加入巴西葡萄牙文，再重新開啟瀏覽器。若裝置只提供線上語音，可關閉「只使用裝置本機語音」，但首次播放前需同意文字可能傳送給語音供應商。聲音品質與可用性因裝置而異。</div></section></div><div class="stack"><section class="panel"><h2>進度備份與搬家</h2><p class="small muted">進度分別儲存在這個瀏覽器、裝置與網址下。換電腦或換網址前，先匯出 JSON，再到新的地方匯入。</p><div class="row wrap mt16"><button class="btn secondary" data-action="export">${icon('download')}匯出進度</button><button class="btn outline" data-action="import">${icon('upload')}匯入進度</button><input type="file" id="import-file" accept=".json,application/json" hidden></div>${storageLocked?`<button class="btn danger mt16" data-action="export-raw">下載無法讀取的原始備份</button>`:''}<div class="note mt16">匯入會先驗證格式，再要求確認覆蓋。v2 備份包含原有進度、18 個月計畫、聽力紀錄、老師資料、訪客卡與作品，不含錄音。可匯入 v1 或 v2 備份；匯入是取代，不是合併。v1 資料會保留在舊儲存區，但不會雙向同步。清除瀏覽器資料也會清除本機進度。</div></section><section class="panel"><h2>執行狀態與隱私</h2><div class="state-line">${icon('shield')} ${storageOK&&!storageLocked?'本機儲存可用':'目前使用記憶體暫存'}</div><div class="state-line">${icon('mic')} ${window.isSecureContext&&navigator.mediaDevices?.getUserMedia&&window.MediaRecorder?'本環境提供錄音介面（仍須授權）':'錄音介面不可用，請以 HTTPS 或 localhost 開啟'}</div><div class="state-line">${icon('globe')} <span id="offline-state">${offlineReady?'離線教材快取已就緒':location.protocol==='file:'?'下載模式：請確認音檔已包含在檔案中；網站版音檔需連線':navigator.serviceWorker?'離線教材快取尚未確認':'此瀏覽器未提供 Service Worker'}</span></div><p class="small muted mt16">App 不載入追蹤碼、外部字型或廣告；不連接 AI 後端。錄音不由 App 上傳；只有選用線上朗讀語音時，示範文字可能交由系統語音服務處理。</p><button class="btn outline small mt16" data-action="install">${icon('download')}安裝到桌面／主畫面</button><div class="install-callout">PWA 功能需使用完整專案，以 localhost 或 HTTPS 開啟。單一 HTML 檔用於快速使用，不保證所有瀏覽器在 file:// 下會持久保存進度。</div></section><section class="panel"><h2>重設學習資料</h2><p class="small muted">只清除此 App 的進度，不清除瀏覽器中的其他資料。先匯出備份再操作。</p><button class="btn danger small mt16" data-action="reset">重設本機進度</button></section></div></div>`;}
// ----- Pronunciation: embedded pt-BR fallback + system voice, one cancellable queue. -----
function loadVoices(){voiceList=speech.voices();updateVoiceUI();}
function voiceStatus(){const local=voiceList.filter(v=>v.localService).length,remote=voiceList.length-local;return `${window.BORA_AUDIO.meta.count} 句 Dora 巴葡神經語音，正常＋慢速共 ${window.BORA_AUDIO.meta.files} 檔（非真人）；系統 pt-BR：本機 ${local}、線上 ${remote}。`;}
function updateVoiceUI(){document.querySelectorAll('.voice-status').forEach(x=>x.textContent=voiceStatus());const select=$('#voice-select');if(select){const value=document.activeElement===select?select.value:state.profile.voice;select.innerHTML='<option value="">自動選擇可用的巴西葡語語音</option>'+voiceList.map(v=>`<option value="${esc(v.voiceURI)}" ${value===v.voiceURI?'selected':''}>${esc(v.name)} · ${v.localService?'本機':'線上'}</option>`).join('');}}
function speechOptions(overrides={}){return {rate:state.profile.speechRate,repeat:1,gap:500,label:'發音練習',mask:route.startsWith('quiz/')&&quiz&&quiz.mode!=='reading'&&!quiz.answered,...overrides};}
async function speak(text,slow=false){loadVoices();return speech.play(text,speechOptions({rate:slow?.75:state.profile.speechRate}));}
async function speakPlaylist(texts,options={}){loadVoices();return speech.play(texts,speechOptions(options));}
function stopSpeech(){speech.stop();}
function conversationEntry(){return `<section class="cg-entry"><div class="row between wrap"><div><b>會話文法與詞彙</b><p>18 輪解析 · 每輪 2 個例句 · 單字、相關字與情境搭配</p></div><a class="btn small" href="#conversation">會話解析與單字 ${icon('arrow')}</a></div></section>`;}
function pronunciationEntry(){return dailyEntry()+`<section class="pron-entry"><div class="row"><span class="pron-entry-icon">${icon('volume')}</span><div><b>巴西葡語發音練習室</b><p>Dora 巴西葡語 · 正常／慢速獨立音檔 · 非真人錄音。</p></div></div><div class="row wrap gap8"><button class="btn small" data-action="pron-test">${icon('volume')}試聽清晰發音</button><button class="btn outline small" data-action="pron-open">開始發音練習${icon('arrow')}</button></div></section>`;}
function engineOptions(){return [['auto','推薦：固定教材用神經語音，自訂稿用系統'],['builtin','Dora 巴葡神經語音：固定教材'],['system','系統 pt-BR：可朗讀自訂講稿']].map(([v,t])=>`<option value="${v}" ${state.profile.speechEngine===v?'selected':''}>${t}</option>`).join('');}
function dailyEntry(){const l=window.BoraDaily.lesson();return `<section class="pron-entry"><div class="row"><span class="pron-entry-icon">${icon('calendar')}</span><div><b>今日 5–10 分鐘 · 第 ${l.number} 天</b><p>${esc(l.title)} · ${l.special?'字幕分段教學':'循序練習'} · 詞彙、句型與文法</p></div></div><button class="btn small" data-action="go" data-route="daily">開啟今日短練習</button></section>`;}
function audioHelpPanel(){const sample=window.BORA_AUDIO.clips['oi, tudo bem?'];return `<details class="note mb16"><summary>手機聽不到聲音？先按這裡測試</summary><p class="small mt12">先按下方原生播放器 ▶ 試聽「Oi, tudo bem?」。這是現成 MP3，不需要手機安裝葡語語音；播放時調高<strong>媒體音量</strong>，並檢查藍牙耳機／車機輸出。</p><audio controls playsinline preload="none" src="${esc(sample.src)}" aria-label="測試手機 MP3 發音" style="display:block;width:100%;margin:12px 0"></audio><p class="small">若這裡有聲、教材單字或句子卻無聲，請重新整理並確認頁尾版本為 v2.7.0；也可用<a href="audio-test.html">獨立音效測試頁</a>排查。若測試音也無聲，請以 Safari／Chrome 正式瀏覽器開啟網站，檢查媒體音量、靜音及藍牙輸出。自訂文字則仍需要手機的 pt-BR 系統語音。測試不會修改學習進度。</p></details>`;}
function dailyAudioButton(pt,slow=false){return `<button type="button" class="btn ${slow?'outline':'secondary'} small" data-action="daily-speak" data-text="${esc(pt)}" data-slow="${slow?'1':'0'}" aria-label="${slow?'慢速':'正常速度'}朗讀 ${esc(pt)}">${icon(slow?'clock':'volume')}${slow?'慢速':'正常速度'}</button>`;}
function dailyPage(){
 const l=window.BoraDaily.lesson(),done=!!state.days[l.date]?.awards?.includes('daily-'+l.date);
 const words=l.words.map(([pt,zh])=>`<article class="daily-word"><div class="pt" lang="pt-BR">${esc(pt)}</div><p>${esc(zh)}</p><div class="daily-audio">${dailyAudioButton(pt)}${dailyAudioButton(pt,true)}</div></article>`).join('');
 const subtitle=l.special?(l.caption?`<section class="panel daily-card"><h2>字幕第 ${l.caption.n} 段 · ${esc(l.caption.time)}</h2><p class="small muted">宣傳字幕原文（不代表現況）${l.review?' · 情境複習':''}</p><div class="daily-caption" lang="pt-BR">${esc(l.caption.text)}</div><p class="small">下方為安全的練習改寫句；設施、價格、企業或法規敘述須另查核。字幕檔不含原影片聲音，無法對照旁白。</p></section>`:`<section class="note warning">字幕暫不可用：僅複習此主題的安全練習句。</section>`):'';
 return heading('今日巴西葡語短練習',`第 ${l.number} 天 · ${l.date} · 第 ${l.phase} 階段 · ${l.special?'影片字幕分段教學':'工作情境'}`)+audioHelpPanel()+
 `<section class="daily-hero"><span class="pill">${l.special?'SUBTITLE PRACTICE':'DAILY PRACTICE'}</span><h2 class="mt12">${esc(l.title)}</h2><p>唯一任務：用 5–10 分鐘聽、說並改寫這一句。</p></section>`+subtitle+
 `<section class="panel daily-card"><h2>三個關鍵詞／片語</h2><div class="daily-words">${words}</div></section>
 <section class="panel daily-card"><h2>${l.special?'練習改寫句':'今日示範句'}</h2><p class="daily-sentence" lang="pt-BR">${esc(l.pt)}</p><p class="daily-sentence-zh">${esc(l.zh)}</p><div class="daily-audio">${dailyAudioButton(l.pt)}${dailyAudioButton(l.pt,true)}</div><p class="small muted mt12">固定教材採正常與慢速獨立 MP3，不需手機安裝 pt-BR 語音；這是合成發音，不是字幕原旁白。若播放無聲，請使用上方音效測試。</p></section>
 <section class="panel daily-card"><h2>發音、文法與句型</h2><p><b>發音：</b>${esc(l.tip)}</p><p class="mt12"><b>文法：</b>${esc(l.grammar)}</p><div class="daily-pattern"><div class="pt" lang="pt-BR">${esc(l.swap[0])}</div><p>${esc(l.swap[1])}</p></div><p class="small muted mt12">第二個例句：指出替換後的單字或詞形如何改變。</p></section>
 <section class="panel daily-card"><h2>實作步驟</h2><ol class="daily-list"><li>逐一聽三個詞／片語的正常與慢速示範，各跟讀兩次。</li><li>完整句正常、慢速各聽一次，留意發音提示。</li><li><b>慢速分段跟讀（自行放慢）：</b>${l.chunks.map(x=>`<span lang="pt-BR">${esc(x)}</span>`).join(' ／ ')}。每段自行慢唸、停約 2 秒，再連成完整句；分段不等於降低音訊速度。</li><li>不看中文說主句，再換成第二個例句。</li></ol><h3 class="mt16">自我檢查</h3><ul class="daily-list"><li>能說出三個詞／片語的意思嗎？</li><li>能用文法提示正確換句且讀清重音嗎？</li><li>${l.special?'能區分字幕原文與安全改寫嗎？':'能在接待或招商情境自然說出這句嗎？'}</li></ul><button class="btn daily-complete" data-action="daily-done" ${done?'disabled':''}>${icon('check')}${done?'今日已自評完成':'標記今日自評完成'}</button></section>
 <section class="note warning">靜態教材不會自動查核園區、稅務、法律或租賃資訊。任何對外條件都須依最新書面來源確認；完成標記只是個人練習紀錄。</section>`;
}
function pronunciationPage(){
 const list=lphrases(pronLesson),selected=lessonMap.get(pronLesson)||LESSONS[0];
 return `<div class="pron-hero"><div><div class="kicker">OUÇA. REPITA. CONVERSE.</div><h2>先聽清楚，再說自然。</h2><p>一句一句來。正常聽、慢速聽，留一點時間給自己開口。</p><div class="row wrap mt16"><span class="pill">pt-BR 巴西葡語</span><span class="pill gold">${window.BORA_AUDIO.meta.count} 句 × 正常／慢速</span></div></div><div class="pron-wave" aria-hidden="true">${Array.from({length:23},(_,i)=>`<i style="height:${22+((i*37)%69)}px"></i>`).join('')}</div></div>
 <div class="pron-layout"><section class="panel"><div class="section-heading"><div><span class="kicker">01 · PHRASE PRACTICE</span><h2>選一課，聽六句。</h2></div>${icon('headphones')}</div><div class="form-field"><label for="pron-lesson">今天練習的情境</label><select id="pron-lesson">${LESSONS.map(l=>`<option value="${l.id}" ${l.id===pronLesson?'selected':''}>${l.level} · ${esc(l.title)}</option>`).join('')}</select></div><div class="row wrap mb16"><button class="btn small" data-action="pron-lesson-play" data-id="${selected.id}">${icon('play')}全課逐句讀</button><button class="btn outline small" data-action="pron-lesson-shadow" data-id="${selected.id}">${icon('mic')}全課留白跟讀</button></div><div class="pron-sentences">${list.map((p,i)=>`<article class="pron-sentence"><span class="pron-number">${String(i+1).padStart(2,'0')}</span><div><h3 class="pt" lang="pt-BR">${esc(p.pt)}</h3><p>${esc(p.zh)}</p><div class="row wrap gap8 mt8">${speakBtn(p.pt)}${speakBtn(p.pt,true)}<button class="text-btn" data-action="pron-repeat" data-text="${esc(p.pt)}">${icon('refresh')}跟讀 3 次</button></div></div></article>`).join('')}</div></section>
 <div class="stack"><section class="panel"><span class="kicker">02 · LISTEN YOUR WAY</span><h2 class="mt8">發音設定</h2><div class="form-field mt16"><label for="voice-engine">聲音來源</label><select id="voice-engine">${engineOptions()}</select><small>自訂講稿須有系統 pt-BR 語音；未取得同意，不使用線上語音。</small></div><div class="pron-controls"><div class="form-field"><label for="pron-rate">一般播放語速</label><select id="pron-rate">${[[.6,'0.6 × 很慢'],[.75,'0.75 × 慢速'],[1,'1.0 × 正常'],[1.2,'1.2 × 稍快']].map(([v,t])=>`<option value="${v}" ${v===state.profile.speechRate?'selected':''}>${t}</option>`).join('')}</select></div><div class="form-field"><label for="pron-repeat-count">批次每句重複</label><select id="pron-repeat-count">${[1,2,3].map(n=>`<option value="${n}" ${n===state.profile.speechRepeat?'selected':''}>${n} 次</option>`).join('')}</select></div><div class="form-field"><label for="pron-gap">跟讀留白</label><select id="pron-gap">${[2,4,6,8].map(n=>`<option value="${n}" ${n===state.profile.speechGap?'selected':''}>${n} 秒</option>`).join('')}</select></div></div><div class="row wrap"><button class="btn secondary small" data-action="pron-test">${icon('volume')}試聽清晰發音</button><button class="text-btn" data-action="pron-voices">重新偵測語音</button></div><p class="tiny muted voice-status mt12"></p><details class="pron-help mt16"><summary>沒有聲音？</summary><p>先點「試聽清晰發音」，確認音量、輸出裝置及分頁沒有靜音。請以 Safari／Chrome 開啟 HTTPS 網站，不在聊天附件預覽器操作。網站音檔按需載入，需網路連線。</p><p>內建音能播，但自訂稿件不能播：到偏好與備份設定 pt-BR 系統語音。Mac 可在系統輔助使用的朗讀設定下載語音；下載後重新開啟瀏覽器。線上語音需另外同意。</p><p>慢速按鈕播放專用慢速音檔，不把正常音檔直接拉慢；0.6× 與 1.2× 仍為額外調速。神經合成音不是母語教師審音，請搭配老師練習。</p><button class="text-btn" data-action="go" data-route="settings">開啟完整語音設定${icon('arrow')}</button></details></section>
 <section class="panel"><span class="kicker">03 · YOUR OWN WORDS</span><h2 class="mt8">朗讀自己的葡文</h2><p class="small muted mt8">可貼入已完成的葡文介紹或講稿。自動分句；不只讀前 1,000 字元。</p><div class="form-field mt16"><label for="pron-text">葡文文字（此欄僅暫存當頁工作階段）</label><textarea id="pron-text" lang="pt-BR" rows="6" maxlength="18000">${esc(pronDraft)}</textarea></div><div class="row wrap"><button class="btn small" data-action="pron-text-play">${icon('volume')}全文逐句讀</button><button class="btn outline small" data-action="pron-text-shadow">${icon('mic')}留白跟讀</button></div><p class="tiny muted mt12">先補齊 [方括號]。內建音只涵蓋固定教材；新增文字需系統語音。這不是 AI 發音評分。</p></section></div></div>`;
}
function updateSpeechDock(s){
 const dock=$('#speech-dock');if(!dock)return;
 const visible=s.status!=='idle';dock.hidden=!visible;document.body.classList.toggle('has-speech',visible);if(!visible)return;
 if(!$('#speech-now'))dock.innerHTML=`<div class="speech-dock-top"><div class="speech-dock-copy"><div id="speech-meta" class="tiny muted"></div><p id="speech-now" class="pt" lang="pt-BR"></p><div id="speech-feedback" class="tiny muted" role="status" aria-live="polite"></div></div><button class="icon-btn" data-action="speech-close" aria-label="停止播放並關閉播放器">${icon('x')}</button></div><div class="speech-dock-actions"><div class="row gap8"><button class="icon-btn" data-action="speech-prev" aria-label="上一句">${icon('back')}</button><button id="speech-toggle" class="btn small" data-action="speech-toggle"></button><button class="icon-btn" data-action="speech-next" aria-label="下一句">${icon('arrow')}</button><button class="btn outline small" data-action="speech-repeat">${icon('refresh')}重播本句</button><button class="btn outline small" data-action="speech-restart">從頭播放</button></div><a id="speech-download" class="text-btn" download="Bora-pronunciation.mp3">${icon('download')}下載本句 MP3</a></div>`;
 const playing=['playing','waiting','loading'].includes(s.status);
 $('#speech-meta').textContent=`${s.label} · ${Math.min(s.index+1,s.total)} / ${s.total} 段 · ${s.rate} ×`;
 $('#speech-now').textContent=s.text;$('#speech-feedback').textContent=s.message;
 $('#speech-toggle').innerHTML=icon(playing?'pause':'play')+(playing?'暫停':'繼續');
 $('#speech-toggle').disabled=s.status==='error'&&!s.source;
 const retry=['blocked','ready','error'].includes(s.status);
 if(retry)$('#speech-toggle').innerHTML=icon('play')+'點此播放';
 if(s.status==='error'&&!s.source)$('#speech-toggle').innerHTML='此句無可用語音';
 let nativeWrap=$('#bora-native-wrap');
 if(!nativeWrap){
  nativeWrap=document.createElement('div');nativeWrap.id='bora-native-wrap';nativeWrap.className='bora-native-wrap';
  const hint=document.createElement('p');hint.textContent='沒有聲音？直接點下方 ▶；播放時調高手機媒體音量，並確認藍牙輸出。';
  nativeWrap.appendChild(hint);nativeWrap.appendChild(speech.audioElement);dock.appendChild(nativeWrap);
 }
 nativeWrap.hidden=s.source!=='builtin'||s.mask;
 $('#speech-now').setAttribute('lang',s.mask?'zh-Hant':'pt-BR');
 const a=$('#speech-download');a.hidden=!s.canDownload;if(s.canDownload)a.href=s.download;else a.removeAttribute('href');
 dock.querySelector('[data-action="speech-prev"]').disabled=s.index<=0;
 dock.querySelector('[data-action="speech-next"]').disabled=s.index>=s.total-1;
}
// ----- Microphone recording: transient Blob only, never sent to a server. -----
function clearRecording(){rec.token++;clearInterval(rec.timer);rec.timer=null;rec.pending=false;if(rec.recorder){rec.recorder.onstop=rec.recorder.ondataavailable=rec.recorder.onerror=null;if(rec.recorder.state!=='inactive')try{rec.recorder.stop();}catch{}}if(rec.stream)rec.stream.getTracks().forEach(t=>t.stop());rec.recorder=null;rec.stream=null;rec.chunks=[];if(rec.url)URL.revokeObjectURL(rec.url);rec.url='';}
function stopRecording(){if(rec.recorder?.state==='recording'){clearInterval(rec.timer);rec.recorder.stop();rec.stream?.getTracks().forEach(t=>t.stop());}}
async function toggleRecording(){
 if(rec.recorder?.state==='recording'){stopRecording();return;}if(rec.pending)return;
 if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast('本環境無法錄音。請以完整專案的 localhost，或 HTTPS 網站開啟。');return;}
 clearRecording();stopSpeech();const token=rec.token;rec.pending=true;const b=$('#record-button');if(b)b.disabled=true;const status=$('#record-status');if(status)status.textContent='正在等待麥克風權限；你可以拒絕或離開這一頁。';
 try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:false});
  if(token!==rec.token||document.hidden||section()!=='speak'||speakTab!=='shadow'){stream.getTracks().forEach(t=>t.stop());if(token===rec.token){clearRecording();if(b)b.disabled=false;}return;}
  rec.stream=stream;rec.pending=false;rec.chunks=[];const mime=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus'].find(m=>MediaRecorder.isTypeSupported(m));
  rec.recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);rec.mime=rec.recorder.mimeType;
  rec.recorder.ondataavailable=e=>{if(token===rec.token&&e.data.size)rec.chunks.push(e.data);};
  rec.recorder.onstop=()=>{
   stream.getTracks().forEach(t=>t.stop());if(token!==rec.token)return;clearInterval(rec.timer);rec.timer=null;
   if(rec.chunks.length){rec.url=URL.createObjectURL(new Blob(rec.chunks,{type:rec.mime||'audio/webm'}));showRecording();}
   const button=$('#record-button');if(button){button.disabled=false;button.classList.remove('recording');button.innerHTML=icon('mic')+'重新錄音';}
   const st=$('#record-status');if(st)st.textContent='錄音已停止。請回放，與示範比較；錄音未由 App 上傳。';
  };
  rec.recorder.onerror=()=>{if(token!==rec.token)return;clearRecording();render();toast('錄音發生錯誤，已關閉麥克風。');};
  rec.recorder.start();rec.started=Date.now();if(b){b.disabled=false;b.classList.add('recording');b.innerHTML=icon('stop')+'停止錄音';}
  const old=$('#record-result');if(old)old.innerHTML='';
  function tick(){if(token!==rec.token)return;const seconds=Math.floor((Date.now()-rec.started)/1000);const s=$('#record-status');if(s)s.textContent=`錄音中 ${seconds} / 45 秒 · 按停止即可回放`;if(seconds>=45)stopRecording();}
  tick();rec.timer=setInterval(tick,500);
 }catch(e){if(token!==rec.token)return;clearRecording();const button=$('#record-button');if(button)button.disabled=false;const st=$('#record-status');if(st)st.textContent='未啟用錄音。你仍可聽示範並自行跟讀。';toast(e.name==='NotAllowedError'?'麥克風未獲允許。請在瀏覽器權限設定中檢查。':e.name==='NotFoundError'?'沒有找到可用的麥克風。':'無法開始錄音，請檢查裝置及瀏覽器權限。');}
}
function showRecording(){const out=$('#record-result');if(!out||!rec.url)return;const ext=rec.mime.includes('mp4')?'m4a':rec.mime.includes('ogg')?'ogg':'webm';out.innerHTML=`<h3>回聽自己的聲音</h3><audio controls src="${rec.url}" aria-label="我的跟讀錄音"></audio><a class="btn outline small" href="${rec.url}" download="bora-${speakId}-${dateKey()}.${ext}">${icon('download')}下載這段錄音</a><button class="text-btn" data-action="delete-recording">刪除錄音</button>`;}
// ----- Export/import: strict schema; explicit replacement confirmation. -----
function downloadFile(name,data,type='application/json'){const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);}
function exportProgress(){downloadFile(`bora-progress-${dateKey()}.json`,JSON.stringify({app:'bora-ptbr',version:VERSION,exportedAt:new Date().toISOString(),state},null,2));toast('已產生進度備份；請確認瀏覽器的下載項目。');}
async function importProgress(file){
 if(!file)return;if(file.size>32*1024*1024){toast('檔案過大，請選擇 Bora! 匯出的 JSON（最多 32 MB）。');return;}
 try{const parsed=JSON.parse(await file.text());if(parsed.app!=='bora-ptbr'||![1,VERSION].includes(parsed.version))throw new Error('不是 Bora! v1／v2 的備份檔。');const validated=validateState(parsed.state);if(!confirm(`將匯入「${validated.profile.name}」的進度，並覆蓋目前這個瀏覽器中的 Bora! 進度。請先確認已有舊進度備份。繼續嗎？`))return;if(replaceProgress(validated))toast('進度已匯入並儲存。');}catch(e){toast('匯入失敗：'+(e.message||'檔案格式無法識別。'));}
}
function updateSaveStatus(){const el=$('#save-status');if(el){el.textContent=storageOK&&!storageLocked?'本機儲存':'暫存模式';el.title=storageMessage;}const banner=$('#storage-notice');if(banner){banner.hidden=!storageMessage;banner.textContent=storageMessage;}}
async function installApp(){if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;return;}toast(location.protocol==='file:'?'單檔模式不能安裝 PWA。請使用完整專案，以 localhost 或 HTTPS 開啟。':'請使用瀏覽器的「安裝應用程式」或「加入主畫面」。選項是否出現取決於裝置、瀏覽器及網站環境。');}
const board = window.BoraPlanUI.create({getState:()=>state,save,deferSave,esc,icon,dateKey,heading,lessons:LESSONS,speakBtn,speak,speakPlaylist,downloadFile,toast,go,render});
document.addEventListener('submit',event=>board.submit(event));
document.addEventListener('input',({target})=>{
 if(target.id!=='c1-draft'||!C1.lessons.some(l=>l.id===target.dataset.case))return;
 c1Drafts.set(target.dataset.case,target.value);
 const count=$('#c1-count');if(count)count.textContent=c1WordCount(target.value);
});

// ----- UI events -----
document.addEventListener('click',async event=>{
 const b=event.target.closest('[data-action]');if(!b||b.disabled)return;lastInteraction=Date.now();const action=b.dataset.action,id=b.dataset.id,value=b.dataset.value;
 if(action.startsWith('plan-')){await board.action(b);return;}
 switch(action){
  case 'pron-open':clearRecording();stopSpeech();speakTab='pronunciation';go('speak');break;
  case 'pron-voices':loadVoices();toast(voiceStatus());break;
  case 'pron-test':{await speech.play('Oi, tudo bem?',{engine:'builtin',rate:1,label:'Dora 巴葡聲音試聽'});break;}
  case 'pron-repeat':await speakPlaylist([b.dataset.text],{rate:.75,repeat:3,gap:state.profile.speechGap*1000,label:'慢速跟讀 3 次'});break;
  case 'pron-lesson-play':case 'pron-lesson-shadow':await speakPlaylist(lphrases(id||pronLesson).map(p=>p.pt),{repeat:state.profile.speechRepeat,gap:action.endsWith('shadow')?state.profile.speechGap*1000:500,label:lessonMap.get(id||pronLesson)?.title||'課程逐句發音'});break;
  case 'pron-text-play':case 'pron-text-shadow':pronDraft=$('#pron-text')?.value||pronDraft;await speakPlaylist(pronDraft,{repeat:state.profile.speechRepeat,gap:action.endsWith('shadow')?state.profile.speechGap*1000:500,label:'自訂葡文 · 逐句朗讀'});break;
  case 'speech-close':stopSpeech();break;
  case 'speech-toggle':if(['playing','loading','waiting'].includes(speech.snapshot().status))speech.pause();else speech.resume();break;
  case 'speech-repeat':speech.replay();break;
  case 'speech-restart':speech.restart();break;
  case 'speech-prev':speech.next(-1);break;
  case 'speech-next':speech.next(1);break;

  case 'skip-main':event.preventDefault();$('#main')?.focus({preventScroll:true});$('#main')?.scrollIntoView({block:'start'});break;
  case 'go':go(b.dataset.route);break;
  case 'daily-speak':await speech.play(b.dataset.text,{engine:'auto',rate:b.dataset.slow==='1'?0.75:1,label:'巴西葡語示範 · 有音檔時優先播放音檔'});break;
  case 'daily-done':{const l=window.BoraDaily.lesson(),k='daily-'+l.date;const d=state.days[l.date]||(state.days[l.date]={seconds:0,practiced:[],reviews:0,spoken:[],quizzes:0,xp:0,awards:[]});if(!d.awards.includes(k)){d.awards.push(k);d.xp+=10;save();render();toast('已記錄今日自評完成；不代表語言能力認證。');}break;}
  case 'open-lesson':openLesson(id);break;
  case 'daily-next':{const d=today();if(d.practiced.length<6)openLesson(nextLesson().id);else if(d.reviews<5)startReview(dueCards().length?'due':PHRASES.some(p=>!state.srs[p.id])?'new':'practice');else if(!d.spoken.length){speakId=d.practiced[0]||PHRASES[0].id;speakTab='shadow';go('speak');}else go('courses');break;}
  case 'course-level':go(LEVELS.includes(value)?'courses/'+value:'courses');break;
  case 'course-track':courseFilter.track=value;render();break;
  case 'lesson-prev':stopSpeech();learning.index=Math.max(0,learning.index-1);render();break;
  case 'lesson-index':stopSpeech();learning.index=clamp(Number(value),0,5);render();break;
  case 'learn-next':stopSpeech();markLearned(id);if(learning.index===5)startQuiz('reading',learning.lesson);else{learning.index++;render();}break;
  case 'lesson-quiz':startQuiz('reading',id);break;
  case 'start-listening':startQuiz('listening',id);break;
  case 'favorite':if(!phrase(id))break;state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];save();b.classList.toggle('active',state.favorites.includes(id));b.setAttribute('aria-pressed',String(state.favorites.includes(id)));b.setAttribute('aria-label',state.favorites.includes(id)?'取消收藏':'收藏句型');if(cardsTab==='library'&&section()==='cards'&&libraryFilter.type==='favorite')render();break;
  case 'speak':await speak(b.dataset.text,b.dataset.slow==='1');break;
  case 'practice-phrase':clearRecording();speakId=id;speakTab='shadow';go('speak');break;
  case 'quiz-setup':quiz=null;go('quiz/setup');break;
  case 'begin-quiz':startQuiz($('#quiz-mode').value,null,$('#quiz-pool').value);break;
  case 'quiz-answer':answerQuiz(Number(value));break;
  case 'dictation-check':answerQuiz(null,$('#dictation')?.value||'');break;
  case 'insert-char':{const t=$('#dictation');if(t&&!t.disabled){const start=t.selectionStart,end=t.selectionEnd;t.value=t.value.slice(0,start)+b.dataset.char+t.value.slice(end);t.focus();t.selectionStart=t.selectionEnd=start+1;quiz.draft=t.value;}break;}
  case 'quiz-next':if(!quiz?.answered)break;if(quiz.index===quiz.items.length-1)finishQuiz();else{quiz.index++;quiz.answered=false;quiz.selected=null;quiz.draft='';}stopSpeech();render();window.scrollTo(0,0);break;
  case 'quit-quiz':if(confirm('離開本次測驗？已答題的練習與錯題會保留，但未完成題組不計入測驗紀錄。')){const dest=quiz?.lessonId?'lesson/'+quiz.lessonId:'courses';quiz=null;go(dest);}break;
  case 'quiz-retry':if(quiz)startQuiz(quiz.mode,quiz.lessonId,quiz.pool);break;
  case 'quiz-to-reading':if(quiz){stopSpeech();startQuiz('reading',quiz.lessonId,quiz.pool);toast('已重新開始閱讀題組，不混用聽力或聽寫成績。');}break;
  case 'quiz-wrong':startQuiz('reading',null,'wrong');break;
  case 'cards-tab':cardsTab=b.dataset.tab;go(cardsTab==='words'?'cards/words':'cards');break;
  case 'library-type':libraryFilter.type=value;render();break;
  case 'start-review':startReview(b.dataset.mode);break;
  case 'reveal-card':if(review){review.revealed=true;render();}break;
  case 'rate-card':rateCard(value);break;
  case 'end-review':review=null;render();break;
  case 'speak-tab':if(speakTab!==b.dataset.tab){clearRecording();stopSpeech();}speakTab=b.dataset.tab;go('speak');break;
  case 'record':await toggleRecording();break;
  case 'delete-recording':clearRecording();render();toast('本次錄音已刪除。');break;
  case 'mark-speaking':{const d=today();if(!d.spoken.includes(id))d.spoken.push(id);award('spoken:'+id,8);save();b.innerHTML=icon('check')+'今日已完成這句自我檢核';toast('已記錄你的自我檢核；不是自動發音評分。');break;}
  case 'conversation-practice':if(!C.dialogs.some(d=>d.id===id))break;clearRecording();stopSpeech();speakTab='dialogs';dialog={id,index:0,selected:null,correct:false};go('speak');break;
  case 'start-dialog':dialog={id,index:0,selected:null,correct:false};render();break;
  case 'dialog-answer':{if(!dialog||dialog.correct)break;const d=C.dialogs.find(x=>x.id===dialog.id),q=d.steps[dialog.index];dialog.selected=Number(value);dialog.correct=dialog.selected===q.answer;render();break;}
  case 'dialog-next':if(dialog?.correct){const d=C.dialogs.find(x=>x.id===dialog.id);dialog.index++;dialog.selected=null;dialog.correct=false;if(dialog.index>=d.steps.length){if(!state.dialogsDone.includes(d.id))state.dialogsDone.push(d.id);award('dialog:'+d.id,15);save();}stopSpeech();render();window.scrollTo(0,0);}break;
  case 'end-dialog':dialog=null;stopSpeech();render();break;
  case 'grammar-tab':grammarTab=b.dataset.tab;go(grammarTab==='patterns'?'grammar/patterns':'grammar');break;
  case 'grammar-answer':{const g=C.grammar.find(x=>x.id===id);if(!g)break;grammarAnswer[id]=Number(value);if(Number(value)===g.answer){if(!state.grammarDone.includes(id))state.grammarDone.push(id);award('grammar:'+id,8);save();}const target=$('#grammar-'+id);if(target)target.outerHTML=grammarCard(g);break;}
  case 'save-profile':state.profile.name=$('#profile-name').value.trim().slice(0,32)||'學習者';state.profile.dailyMinutes=Number($('#daily-minutes').value);state.profile.spanish=$('#show-spanish').checked;state.profile.large=$('#large-text').checked;{const ok=save();render();toast(ok?'學習偏好已儲存。':storageMessage);}break;
  case 'save-voice':stopSpeech();state.profile.speechEngine=$('#voice-engine').value;state.profile.voice=$('#voice-select').value;state.profile.localOnly=$('#local-only').checked;remoteVoiceAllowed=false;speech.revokeConsent();{const ok=save();updateVoiceUI();toast(ok?'語音設定已儲存。':storageMessage);}break;
  case 'export':exportProgress();break;
  case 'export-raw':downloadFile(`bora-original-${dateKey()}.json`,rawSaved||'');break;
  case 'import':$('#import-file').click();break;
  case 'install':await installApp();break;
  case 'reset':if(prompt('請先備份。輸入 RESET 才會清除這個瀏覽器中的 Bora! v2 學習進度與計畫（v1 舊資料不刪除）。')==='RESET'){if(replaceProgress(defaults()))toast('已重設 Bora! 本機學習進度。');}break;
 }
});
document.addEventListener('input',event=>{board.input(event);lastInteraction=Date.now();const el=event.target;if(el.id==='pron-text')pronDraft=el.value;else if(el.id==='course-search'){courseFilter.query=el.value;$('#course-grid').innerHTML=courseCards();}else if(el.id==='library-search'){libraryFilter.query=el.value;$('#library-grid').innerHTML=libraryCards();}else if(el.id==='expanded-word-search'){expandedWordQuery=el.value;$('#expanded-word-grid').innerHTML=expandedWordCards();}else if(el.id==='dictation'&&quiz)quiz.draft=el.value;});
document.addEventListener('change',async event=>{const el=event.target;
 if(el.id==='pron-lesson'){stopSpeech();pronLesson=el.value;render();}
 else if(el.id==='voice-engine'){state.profile.speechEngine=el.value;save();stopSpeech();loadVoices();}
 else if(['pron-rate','pron-repeat-count','pron-gap'].includes(el.id)){const key={'pron-rate':'speechRate','pron-repeat-count':'speechRepeat','pron-gap':'speechGap'}[el.id];state.profile[key]=Number(el.value);save();stopSpeech();}
 else if(el.id==='speak-phrase'){clearRecording();stopSpeech();speakId=el.value;render();}else if(el.id==='import-file'){await importProgress(el.files?.[0]);el.value='';}});
document.addEventListener('keydown',event=>{lastInteraction=Date.now();if(['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(event.target.tagName)||event.ctrlKey||event.metaKey||event.altKey)return;if(section()==='cards'&&cardsTab==='review'&&review&&review.index<review.ids.length){if(event.code==='Space'&&!review.revealed){event.preventDefault();review.revealed=true;render();}else if(review.revealed&&['1','2','3','4'].includes(event.key)){event.preventDefault();rateCard(['again','hard','good','easy'][Number(event.key)-1]);}}});
document.addEventListener('pointerdown',()=>lastInteraction=Date.now(),{passive:true});
document.addEventListener('scroll',()=>lastInteraction=Date.now(),{passive:true});
window.addEventListener('hashchange',()=>{lastTick=Date.now();clearRecording();stopSpeech();render();window.scrollTo(0,0);$('#main')?.focus({preventScroll:true});});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(rec.pending){clearRecording();const b=$('#record-button');if(b)b.disabled=false;const st=$('#record-status');if(st)st.textContent='已取消等待麥克風授權；請重新點錄音。';}else stopRecording();stopSpeech();}lastTick=Date.now();save();});
window.addEventListener('storage',event=>{if((event.key===KEY||event.key===null)&&ledger.changed())persistence('conflict');});
window.addEventListener('pagehide',()=>{clearRecording();stopSpeech();save();});
// Cap each tick and suspend idle/background tracking; dates use device local calendar.
setInterval(()=>{const now=Date.now(),elapsed=Math.min(15,Math.floor((now-lastTick)/1000));lastTick=now;const root=route.split('/')[0];if(!document.hidden&&now-lastInteraction<60000&&['daily','lesson','cards','speak','grammar','quiz','conversation'].includes(root)&&elapsed>0){today().seconds=Math.min(86400,today().seconds+elapsed);save();}},15000);
if('speechSynthesis' in window){speechSynthesis.addEventListener('voiceschanged',loadVoices);loadVoices();}
render();
// Enabled only when the full project contains sw.js. The portable build removes this block.

})();
