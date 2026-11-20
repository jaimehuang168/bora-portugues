/* Bora! pronunciation player 2.1. Original adapter; no third-party runtime.
   Fixed lessons use separate normal/slow Brazilian neural MP3s. No formant fallback.
   User text is never sent by this app; an OS online voice needs session consent.
   One session token owns all callbacks so stop/navigation cancels delayed speech. */
(function (global) {
'use strict';
const normalize = value => String(value ?? '').normalize('NFC').replace(/\s+/g, ' ').trim().toLocaleLowerCase('pt-BR');
let sentenceSegmenter;
function splitText(value, max = 230) {
  const text = String(value ?? '').normalize('NFC').trim();
  if (!text) return [];
  let sentences = [];
  for (const paragraph of text.split(/\n+/).filter(t => t.trim())) {
    if (typeof Intl.Segmenter === 'function') {
      const segmenter = sentenceSegmenter || (sentenceSegmenter = new Intl.Segmenter('pt-BR', {granularity: 'sentence'}));
      sentences.push(...Array.from(segmenter.segment(paragraph), s => s.segment.trim()).filter(Boolean));
    } else {
      sentences.push(...(paragraph.match(/[^.!?]+[.!?]+(?:["'”’]+)?|[^.!?]+$/g)||[paragraph]).map(t=>t.trim()).filter(Boolean));
    }
  }
  // Bound each utterance without silently discarding the rest of a long script.
  const chunks = [];
  for (const sentence of sentences) {
    let part = '';
    for (const word of sentence.split(/\s+/)) {
      if (part && part.length + word.length + 1 > max) { chunks.push(part); part = ''; }
      if (word.length > max) {
        if (part) { chunks.push(part); part = ''; }
        for (let i=0; i<word.length; i+=max) chunks.push(word.slice(i,i+max));
      } else part += (part ? ' ' : '') + word;
    }
    if (part) chunks.push(part);
  }
  return chunks;
}
function create(config) {
  const bank = global.BORA_AUDIO?.clips || Object.create(null);
  const audio = new Audio(); audio.preload = 'metadata';
  audio.id='bora-native-audio'; audio.controls=true; audio.setAttribute('aria-label','葡語發音：手機原生播放器');
  audio.setAttribute('playsinline',''); audio.setAttribute('webkit-playsinline','');
  audio.muted=false; audio.volume=1;
  let status='idle', queue=[], index=0, token=0, turn=0, timer=null, watchdog=null;
  let utterance=null, rate=1, gap=500, label='發音練習', mask=false;
  let source='', message='', consent=false, waitingForVoice=false;
  let started=false, settings={}, voices=[];
  const notify = () => config.onChange?.(snapshot());
  function listVoices() {
    try { voices = global.speechSynthesis?.getVoices().filter(v => String(v.lang).replace(/_/g,'-').toLowerCase()==='pt-br') || []; }
    catch (_) { voices=[]; }
    return voices;
  }
  function snapshot() {
    return {status, index, total:queue.length, text:mask?'聽力作答中：不顯示答案文字':queue[index]?.text || '', mask,
      label, rate, gap, source, message, voices:listVoices(),
      canDownload:!mask && source==='builtin' && !!queue[index]?.clip,
      download:(!mask && source==='builtin') ? clipSource(queue[index]?.clip) : null};
  }
  function clipSource(clip){return rate<=.8 && clip?.slowSrc ? clip.slowSrc : clip?.src;}
  function clipRate(clip){return rate<=.8 && clip?.slowSrc ? rate/.75 : rate;}
  function clipDuration(clip){return rate<=.8 && clip?.slowSrc ? clip.slowDuration : clip?.duration;}
  function setStatus(next, note='') { status=next; message=note; notify(); }
  function cleanup() {
    turn++; clearTimeout(timer); clearTimeout(watchdog); timer=watchdog=null;
    audio.onended=audio.onerror=audio.onplaying=audio.onpause=null;
    // Keep the same media element and source between user gestures.
    audio.pause();
    if (utterance) {
      utterance.onend=utterance.onerror=utterance.onstart=null; utterance=null;
      try { global.speechSynthesis?.cancel(); } catch (_) {}
    }
    started=false;
  }
  function stop(hide=true) {
    token++; waitingForVoice=false; cleanup();source='';
    if (hide) {queue=[];index=0;setStatus('idle');}
    else setStatus('stopped','已停止。重播可從本句重新開始。');
  }
  function voiceFor(profile) {
    const permitted=listVoices().filter(v=>!profile.localOnly || v.localService);
    const preferred=permitted.find(v=>v.voiceURI===profile.voice);
    if((profile.speechEngine||'auto')==='auto')return (preferred?.localService?preferred:null)||permitted.find(v=>v.localService)||preferred||permitted[0];
    return preferred || permitted.find(v=>v.localService) || permitted[0];
  }
  function waitVoices(session) {
    return new Promise(resolve=>{
      let count=0;
      const tick=()=>{
        if(session!==token) {resolve();return;}
        if(listVoices().length || count++>=10) {resolve();return;}
        setTimeout(tick,200);
      };tick();
    });
  }
  async function play(input, options={}) {
    if (config.isRecording?.()) {config.onNotice?.('請先停止錄音，再播放示範。');return false;}
    stop();
    const original = (Array.isArray(input) ? input : [input]).map(x=>String(x??'').trim()).filter(Boolean);
    if (!original.length) {config.onNotice?.('請先輸入或選取葡文。');return false;}
    if (original.join('\n').length>30000) {config.onNotice?.('文字超過 30,000 字元，請分段練習；沒有截斷或朗讀。');return false;}
    if (original.some(t=>/\[[^\]]*\]|[\u3400-\u9fff]/u.test(t))) {
      config.onNotice?.('請先補齊 [方括號]，並只選取葡文；不朗讀中文說明或待填欄位。');return false;
    }
    const session=token;
    settings={...config.profile?.()};
    if(['auto','builtin','system'].includes(options.engine))settings.speechEngine=options.engine;
    let needsGesture=false;
    rate=Math.max(.6,Math.min(1.2,Number(options.rate)||1));
    gap=Math.max(0,Math.min(10000,Number(options.gap) || 0));
    label=String(options.label||'發音練習'); mask=options.mask===true;
    const repeat=Math.max(1,Math.min(3,Math.floor(Number(options.repeat)||1)));
    const parts=original.flatMap(t=>bank[normalize(t)] ? [t] : splitText(t));
    queue=parts.flatMap(text=>Array.from({length:repeat},()=>({text,clip:bank[normalize(text)]||null,voice:null,engine:''})));
    if (queue.length>600) {stop();config.onNotice?.('分句太多，請選取較短段落。');return false;}
    const allBuiltin=queue.every(x=>x.clip);
    let voice=voiceFor(settings);
    const engine=settings.speechEngine||'auto';
    if(engine!=='builtin' && !voice && !allBuiltin && global.speechSynthesis) {
      waitingForVoice=true;setStatus('loading','正在偵測裝置的 pt-BR 語音…');
      await waitVoices(session);
      if(session!==token)return false;waitingForVoice=false;needsGesture=true;voice=voiceFor(settings);
    }
    const selectEngine=item=>{
      if(engine==='builtin')return item.clip?'builtin':'';
      if(engine==='system')return voice?'system':'';
      // Fixed lessons use ready-to-play clips inside the user's tap.
      if(item.clip)return 'builtin';
      if(voice?.localService)return 'system';
      return voice?'system':'';
    };
    for(const item of queue){item.engine=selectEngine(item);item.voice=voice;}
    if(queue.some(x=>!x.engine)){
      setStatus('error', engine==='builtin'
        ? '這句沒有內建音檔。請切換「自動」並在手機安裝 pt-BR 語音；先用下方音效測試確認手機能播 MP3。'
        : '這句沒有內建音檔，手機也沒有可用的 pt-BR 語音。先試頁面上方的 MP3；若能聽見，請在手機語音設定安裝巴西葡語並重新開啟瀏覽器。');
      config.onNotice?.(message);return false;
    }
    if(queue.some(x=>x.engine==='system'&&!x.voice.localService)&&!consent){
      const accepted=global.confirm('這段文字將由裝置的線上 pt-BR 語音服務合成，可能傳送給該供應商。請勿包含機密資料。App 不會傳送你的錄音。允許本次頁面工作階段使用嗎？');
      if(!accepted){stop();return false;}consent=true;needsGesture=true;
    }
    if(session!==token)return false;
    index=0;
    if(needsGesture){source=queue[0].engine;setStatus('ready','語音已備妥，請點「繼續」開始；手機可能要求再次點擊。');return true;}
    startCurrent(session);return true;
  }
  function fail(note){cleanup();setStatus('error',note);config.onNotice?.(note);}
  function startCurrent(session=token, forceBuiltin=false){
    if(session!==token || !queue.length)return;
    cleanup();const job=turn, item=queue[index];
    source=forceBuiltin?'builtin':item.engine; started=false;
    const alive=()=>session===token&&job===turn;
    const completed=()=>{
      if(!alive())return;clearTimeout(watchdog);utterance=null;
      if(index>=queue.length-1){setStatus('done','播放完成。可重播本句，或重新開始整組。');return;}
      setStatus('waiting',gap>=2000?`換你跟讀：留白 ${gap/1000} 秒`:'準備下一句…');
      timer=setTimeout(()=>{if(alive()){index++;startCurrent(session);}},gap);
    };
    const failed=(error)=>{
      if(!alive())return;
      if(error?.name==='NotAllowedError'||error?.error==='not-allowed'){
        clearTimeout(watchdog);
        setStatus('blocked','瀏覽器擋住播放。請點「繼續」，或直接點下方原生播放器的 ▶。');
        config.onNotice?.(message);return;
      }
      if(source==='system'&&item.clip&&(settings.speechEngine||'auto')==='auto'){
        config.onNotice?.('系統語音未成功，改用巴葡神經合成音。');startCurrent(session,true);
      } else fail(source==='builtin'?'音檔未能載入。請確認網路連線，並以 Safari／Chrome 開啟網站後再按重播；不會退回舊機械音。':'系統朗讀未完成。請檢查語音、網路與音量，再按重播；也可改用內建音檔。');
    };
    setStatus('loading','準備播放…');
    watchdog=setTimeout(failed,12000);
    const playing=()=>{
      if(!alive())return;started=true;clearTimeout(watchdog);
      setStatus('playing',source==='builtin'?`Dora · 巴西葡語神經語音 · ${rate<=.8?'慢速專用音檔':'正常音檔'} · 非真人錄音`:`${item.voice?.name||'系統語音'} · pt-BR · ${item.voice?.localService?'本機':'線上'}`);
      const expected=source==='builtin'?(clipDuration(item.clip)/clipRate(item.clip)+15)*1000:Math.max(20000,item.text.length*180/rate);
      watchdog=setTimeout(failed,Math.min(180000,expected));
    };
    if(source==='builtin'){
      audio.src=clipSource(item.clip); audio.muted=false; audio.volume=1; audio.playbackRate=clipRate(item.clip);
      audio.preservesPitch=true; audio.onplaying=playing;audio.onended=completed;audio.onerror=failed;
      audio.onpause=()=>{if(alive()&&!audio.ended&&status==='playing'){clearTimeout(watchdog);setStatus('paused','已暫停；可用下方原生播放器續播，或按繼續重播本句。');}};
      try{const promise=audio.play();promise?.catch(failed);}catch(_){failed();}
    }else{
      const u=new SpeechSynthesisUtterance(item.text);utterance=u;
      u.lang='pt-BR';u.voice=item.voice;u.rate=rate;u.pitch=1;u.volume=1;
      u.onstart=playing;u.onend=completed;u.onerror=failed;
      try{global.speechSynthesis.resume();global.speechSynthesis.speak(u);}catch(_){failed();}
    }
  }
  function pause(){if(['playing','waiting','loading'].includes(status)&&!waitingForVoice){cleanup();setStatus('paused','已暫停。繼續會從本句開頭播放。');}}
  function resume(){if(queue.length&&['paused','stopped','done','error','blocked','ready'].includes(status)&&queue[index].engine)startCurrent();}
  function replay(){if(queue[index]?.engine)startCurrent();}
  function restart(){if(queue[0]?.engine){index=0;startCurrent();}}
  function next(delta=1){if(!queue.length||!queue[index]?.engine)return;index=Math.max(0,Math.min(queue.length-1,index+delta));startCurrent();}
  return {play,stop,pause,resume,replay,restart,next,snapshot,voices:listVoices,
    revokeConsent(){consent=false;stop();},hasClip:text=>!!bank[normalize(text)],
    destroy(){stop();}, get audioElement(){return audio;}};
}
global.BoraSpeech={create,splitText,normalize};
})(window);
