/* Bora 2.3: read-only curriculum UI. No network, storage, analytics or user-data access. */
(function(global){
'use strict';
function create({esc,icon,speakBtn,dialogs}){
 const data=global.BORA_DIALOG_CONTENT;
 if(!data||!Array.isArray(data.rounds))throw new Error('Conversation curriculum missing');
 const map=new Map(dialogs.map(d=>[d.id,d]));
 let query='';
 const audio=(text)=>`<div class="cg-audio">${speakBtn(text)}${speakBtn(text,true)}</div>`;
 const link=(route,label,active=false)=>`<a class="chip ${active?'active':''}" href="#conversation${route?'/' + route:''}">${esc(label)}</a>`;
 function row(id,index){return data.rounds.find(r=>r.dialog===id&&r.step===Number(index));}
 function sourceLinks(keys){return keys?.length?`<details class="cg-references"><summary>文法查核參考</summary>${keys.map(k=>data.references[k]).filter(Boolean).map(r=>`<p><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.label)} ↗</a></p>`).join('')}<p>解說與例句為本 App 原創；引用來源核對部分規則，不代表母語教師逐條審稿。</p></details>`:'';}
 function wordCard(key){const w=data.words[key];if(!w)return '';
  const relations=(arr,label)=>`<div class="cg-relations"><h5>${label}</h5>${arr.map(t=>`<div class="cg-related"><span class="pill neutral">${esc(t.type)}</span><strong lang="pt-BR">${esc(t.pt)}</strong><span>${esc(t.zh)}</span>${audio(t.pt)}</div>`).join('')}</div>`;
  return `<article class="cg-word" data-term="${esc(key)}"><div class="row between wrap"><h4 lang="pt-BR">${esc(w.term)}</h4><span class="pill">${esc(w.pos)}</span></div><p class="cg-word-meaning">${esc(w.meaning)}</p>${audio(w.term)}<p class="cg-forms"><b>形式／變化：</b><span lang="pt-BR">${esc(w.forms)}</span></p><p class="cg-word-note">${esc(w.note)}</p>${relations(w.related,'相關字｜同字族・近義・對照')}${relations(w.associated,'關聯字｜情境搭配')}</article>`;
 }
 function panel(id,index,{open=false,standalone=false}={}){
  const r=row(id,index),d=map.get(id),q=d?.steps[index];if(!r||!q)return '<p class="note">這一輪尚未提供解析。</p>';
  const inner=`<div class="cg-panel-content"><div class="cg-section-label">01 / 句子怎麼組成</div><h3>${esc(r.title)}</h3><p class="cg-pattern">${esc(r.pattern)}</p><p>${esc(r.explain)}</p><div class="cg-breakdown"><b>對方這句：</b><p>${esc(r.promptNote)}</p></div><div class="cg-reply"><span class="cg-section-label">建議回應</span><p lang="pt-BR" class="cg-pt">${esc(q.options[q.answer])}</p><p>${esc(r.replyZh)}</p>${audio(q.options[q.answer])}</div><aside class="cg-caution"><b>容易弄錯：</b>${esc(r.pitfall)}</aside><div class="cg-section-label mt24">02 / 兩個延伸例句</div><div class="cg-examples">${r.examples.map((e,i)=>`<article class="cg-example"><span class="cg-number">${String(i+1).padStart(2,'0')}</span><div><p lang="pt-BR" class="cg-pt">${esc(e.pt)}</p><p>${esc(e.zh)}</p>${audio(e.pt)}</div></article>`).join('')}</div><div class="cg-section-label mt24">03 / 單字與詞彙連結</div><p class="cg-help">相關字有明確關係標籤；關聯字是常見搭配，不表示意思相同。</p><div class="cg-word-grid">${r.words.map(wordCard).join('')}</div><div class="cg-practice"><b>換你說：</b>${esc(r.practice)}</div>${sourceLinks(r.refs)}<p class="cg-disclaimer">正常／慢速均為 Dora 巴西葡語合成示範；不是人工審音或發音評分。工作例句不構成園區條件承諾。</p></div>`;
  return standalone?`<section class="cg-panel cg-standalone" aria-label="會話文法與單字解析">${inner}</section>`:`<details class="cg-panel" ${open?'open':''}><summary><span>${icon('book')} 本輪文法・2 個例句・3 個單字</span><small>${open?'點擊可收合':'展開解析（會顯示建議回應）'}</small></summary>${inner}</details>`;
 }
 function wordResults(){const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const q=norm(query.trim());const words=Object.keys(data.words).filter(k=>norm(JSON.stringify(data.words[k])).includes(q));return `<p class="cg-help" role="status">${words.length} / 54 個重點單字</p><div class="cg-word-grid cg-library-grid">${words.map(wordCard).join('')}</div>${words.length?'':'<p class="note">沒有符合的單字，請換個中文或葡文關鍵字。</p>'}`;}
 function page(id,index){
  const hero=`<section class="cg-hero"><div><div class="cg-eyebrow">CONVERSAR & COMPREENDER · v2.3.0</div><h1>不只會回答，<br>也知道為什麼。</h1><p>從會話看懂文法，用例句與單字連結，說出自己的下一句。</p></div><div class="cg-stat-grid"><span><b>6</b>會話情境</span><span><b>18</b>逐輪解析</span><span><b>36</b>延伸例句</span><span><b>54</b>重點單字</span></div></section><nav class="cg-tabs" aria-label="會話學習頁面">${link('','六組會話',!id)}${link('words','單字與關聯字',id==='words')}<button class="chip" data-action="speak-tab" data-tab="dialogs">開始會話測驗</button></nav>`;
  if(id==='words')return hero+`<section class="panel"><h2>把單字串成能用的句子。</h2><p class="cg-help">可搜尋葡文、中文、詞性、相關字與搭配。每個詞條均附正常與慢速。</p><label class="search-box mt16" for="conversation-search">${icon('search')}<input id="conversation-search" type="search" maxlength="100" value="${esc(query)}" placeholder="例如：報價、prazo、動詞" aria-label="搜尋會話單字與關聯字"></label><div id="conversation-word-results" class="mt16">${wordResults()}</div></section>`;
  const d=map.get(id);
  if(!d)return hero+`<div class="cg-overview">${dialogs.map((d,i)=>`<article class="panel cg-scenario"><div class="row between"><span class="cg-section-label">${String(i+1).padStart(2,'0')} / ${esc(d.level)}</span><span class="lesson-icon">${icon(d.icon)}</span></div><h2>${esc(d.title)}</h2><p>${esc(d.context)}</p><div class="cg-topics">${data.rounds.filter(r=>r.dialog===d.id).map(r=>`<span>${esc(r.title)}</span>`).join('')}</div><div class="row wrap mt16"><a class="btn small" href="#conversation/${esc(d.id)}/0">讀會話解析 ${icon('arrow')}</a><button class="btn outline small" data-action="conversation-practice" data-id="${esc(d.id)}">練習對話</button></div></article>`).join('')}</div><p class="note mt24">閱讀解析不會自動標記完成會話。需在會話測驗答對並按「繼續對話」，才沿用原有的完成紀錄。</p>`;
  let n=Number(index);if(!Number.isInteger(n)||n<0||n>=d.steps.length)n=0;
  const q=d.steps[n];
  const nav=`<nav class="cg-round-nav" aria-label="切換會話輪次">${d.steps.map((_,i)=>link(d.id+'/'+i,'第 '+(i+1)+' 輪',i===n)).join('')}</nav>`;
  return hero+`<section class="panel cg-round-header"><div class="row between wrap"><div><span class="pill">${esc(d.level)} · ${n+1} / ${d.steps.length}</span><h2 class="mt8">${esc(d.title)}</h2></div><a class="text-btn" href="#conversation">返回六組會話</a></div>${nav}<div class="cg-prompt"><span class="cg-section-label">${esc(d.role)}說</span><p class="cg-pt" lang="pt-BR">${esc(q.pt)}</p><p>${esc(q.zh)}</p>${audio(q.pt)}</div></section>`+panel(d.id,n,{standalone:true})+`<div class="cg-bottom-nav">${n>0?link(d.id+'/'+(n-1),'← 上一輪'):link('','返回會話列表')}<button class="btn outline small" data-action="conversation-practice" data-id="${esc(d.id)}">從第 1 輪練習對話</button>${n<d.steps.length-1?link(d.id+'/'+(n+1),'下一輪 →'):link('','完成閱讀・回到列表')}</div>`;
 }
 document.addEventListener('input',event=>{if(event.target.id!=='conversation-search')return;query=event.target.value.slice(0,100);const target=document.getElementById('conversation-word-results');if(target)target.innerHTML=wordResults();});
 return {page,panel,wordCard};
}
global.BoraDialogLearning={create};
})(window);
