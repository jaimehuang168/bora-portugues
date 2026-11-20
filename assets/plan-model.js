/* Pure plan model. No DOM, network, analytics or credentials. */
(() => {
'use strict';
const P=window.BORA_PLAN;
const obj=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const text=(v,n=2000)=>typeof v==='string'?v.slice(0,n):'';
const num=(v,a,b,d=0)=>typeof v==='number'&&Number.isFinite(v)?Math.min(b,Math.max(a,Math.floor(v))):d;
const key=d=>`${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
function date(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return null;const d=new Date(s+'T12:00:00Z');return Number.isFinite(+d)&&key(d)===s&&d.getUTCFullYear()>=1900&&d.getUTCFullYear()<=2200?d:null;}
function addMonths(s,n){const d=date(s);if(!d)return '';const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+n);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));return key(d);}
function shift(s,n){const d=date(s);if(!d)return '';d.setUTCDate(d.getUTCDate()+n);return key(d);}
function schedule(start,today){if(!date(start)||!date(today))return {month:1,phase:1,started:false,finished:false,planned:false};if(today<start)return {month:1,phase:1,started:false,finished:false,planned:true};if(today>=addMonths(start,18))return {month:18,phase:3,started:true,finished:true,planned:true};let m=1;while(m<18&&today>=addMonths(start,m))m++;return {month:m,phase:m<=3?1:m<=9?2:3,started:true,finished:false,planned:true};}
function week(s){const d=date(s);if(!d)return ['', ''];const wd=d.getUTCDay();const from=shift(s,-((wd+6)%7));return [from,shift(from,6)];}
function defaults(){return {startDate:'',teacher:{name:'',contact:'',mode:'線上或面對面',notes:''},milestones:{},logs:[],visits:[],works:[]};}
function list(v,max){if(v===undefined)return [];if(!Array.isArray(v)||v.length>max)throw Error('計畫紀錄格式或筆數超出上限。');return v;}
function cleanId(v){return typeof v==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(v)?v:'';}
function unique(items){const seen=new Set();for(const x of items){if(!x.id||seen.has(x.id))throw Error('計畫紀錄有無效或重複的識別碼。');seen.add(x.id);}return items;}
function validate(raw){
 const d=defaults();if(raw===undefined)return d;if(!obj(raw))throw Error('18 個月計畫資料格式錯誤。');
 d.startDate=date(raw.startDate)?raw.startDate:'';
 if(obj(raw.teacher))d.teacher={name:text(raw.teacher.name,100),contact:text(raw.teacher.contact,200),mode:['線上或面對面','面對面','線上'].includes(raw.teacher.mode)?raw.teacher.mode:'線上或面對面',notes:text(raw.teacher.notes,1500)};
 if(obj(raw.milestones))for(const m of P.months){const r=raw.milestones[m.n];if(!obj(r))continue;const checks=m.tasks.map((_,i)=>r.checks?.[i]===true),evidence=text(r.evidence,3000),reviewer=text(r.reviewer,100);let status=['working','self','teacher'].includes(r.status)?r.status:'working';if(!checks.every(Boolean)||!evidence.trim())status='working';if(status==='teacher'&&!reviewer.trim())status='self';d.milestones[m.n]={checks,evidence,reviewer,status,at:date(r.at)?r.at:''};}
 d.logs=unique(list(raw.logs,2500).map(r=>{if(!obj(r)||!date(r.date)||!['listen','teacher','reading','writing','rehearsal'].includes(r.kind))throw Error('學習紀錄欄位無效。');return {id:cleanId(r.id),date:r.date,kind:r.kind,minutes:num(r.minutes,1,480,1),title:text(r.title,200),url:safeURL(r.url),words:text(r.words,500),notes:text(r.notes,3000)};}));
 d.visits=unique(list(raw.visits,120).map(r=>{if(!obj(r)||!date(r.date)||!P.industries.some(i=>i.id===r.industry)||!Array.isArray(r.lines)||r.lines.length!==10)throw Error('訪客十句資料不完整。');return {id:cleanId(r.id),company:text(r.company,150),date:r.date,industry:r.industry,purpose:text(r.purpose,1500),lines:r.lines.map(x=>({pt:text(x?.pt,800),zh:text(x?.zh,800),practiced:x?.practiced===true})),unknown:text(r.unknown,3000),correction:text(r.correction,3000),next:text(r.next,1500)};}));
 d.works=unique(list(raw.works,120).map(r=>{if(!obj(r)||!P.templates.some(t=>t.id===r.type))throw Error('專業作品格式無效。');return {id:cleanId(r.id),type:r.type,title:text(r.title,160),text:text(r.text,18000),revised:text(r.revised,18000),notes:text(r.notes,3000),reviewer:text(r.reviewer,100),status:['draft','review','revised','rehearsed'].includes(r.status)?r.status:'draft',updated:date(r.updated)?r.updated:'',reps:num(r.reps,0,10000)};}));
 return d;
}
function safeURL(s){try{const u=new URL(text(s,2000));return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u.href:'';}catch{return '';}}
function uid(){return 'r_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);}
window.BoraPlanModel={date,key,shift,addMonths,schedule,week,defaults,validate,safeURL,uid};
})();
