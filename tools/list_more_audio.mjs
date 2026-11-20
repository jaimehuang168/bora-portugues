/* Public authored teaching text only; no learner text or microphone data. */
import fs from 'node:fs';
import vm from 'node:vm';

const context=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync('assets/more-content.js','utf8'),context,{timeout:1000});
const more=context.window.BORA_MORE;
const texts=[
  ...more.lessons.flatMap(l=>l.phrases.map(p=>p[0])),
  ...more.words.flatMap(w=>[w[1],w[4]]),
  ...more.grammar.flatMap(g=>g.examples.map(e=>e[0]))
].filter(Boolean).map(s=>String(s).normalize('NFC').trim());
const unique=[...new Map(texts.map(s=>[s.toLocaleLowerCase('pt-BR').replace(/\s+/g,' '),s])).values()];
if(more.lessons.length!==12||more.lessons.some(l=>l.phrases.length!==6)||more.words.length!==36||more.grammar.length!==12||unique.length<100)
  throw new Error('Unexpected curriculum inventory');
process.stdout.write(JSON.stringify({texts:unique,lessons:more.lessons.length,phrases:72,words:more.words.length,grammar:more.grammar.length})+'\n');
