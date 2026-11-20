/* Only the authored public pt-BR strings reachable through a C1 play button. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
export function loadC1() {
  const context=vm.createContext({window:{}});
  vm.runInContext(fs.readFileSync(new URL('../assets/c1-content.js',import.meta.url),'utf8'),context,{timeout:1000});
  return context.window.BORA_C1;
}
export const keyFor=s=>s.normalize('NFC').trim().replace(/\s+/g,' ').toLocaleLowerCase('pt-BR');
export function inventory(c=loadC1()) {
  const texts=[...c.lessons.flatMap(l=>[...l.sources.map(s=>s[1]),...l.phrases.map(p=>p[0])]),
    ...c.words.flatMap(w=>[w[1],w[4]]),...c.grammar.flatMap(g=>g.examples.map(e=>e[0]))];
  assert.equal(c.lessons.length,6); assert.equal(c.words.length,18); assert.equal(c.grammar.length,6);
  assert.ok(c.lessons.every(l=>l.level==='C1'&&l.phrases.length===6&&l.sources.length===2&&l.checks.length>=2));
  assert.ok(texts.every(t=>t.trim()&&!/[\u3400-\u9fff\[\]]/u.test(t)));
  return [...new Map(texts.map(t=>[keyFor(t),t])).values()];
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)
  console.log(JSON.stringify(inventory()));
