/* Enumerate only authored, public pt-BR teaching text that has a play button. */
import fs from 'node:fs';
import vm from 'node:vm';

const context = vm.createContext({window: {}});
const html = fs.readFileSync('index.html', 'utf8');
const contentScript = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map(x => x[1]).find(x => x.includes('window.BORA_CONTENT ='));
if (!contentScript) throw new Error('Original grammar catalog missing');
for (const source of [contentScript, fs.readFileSync('assets/daily-learning.js', 'utf8'), fs.readFileSync('assets/expanded-learning.js', 'utf8')]) {
  vm.runInContext(source, context, {timeout: 1000});
}
const daily = context.window.BoraDaily;
const expanded = context.window.BORA_EXPANDED;
const base = context.window.BORA_CONTENT;
const lessons = [...daily.phase1, ...daily.phase2, ...daily.phase3, ...daily.audioSpecials];
const texts = [
  ...lessons.flatMap(l => [l.pt, l.swap?.[0], ...l.words.map(w => w[0])]),
  ...expanded.words.flatMap(w => [w[1], w[4]]),
  ...[...base.grammar, ...expanded.grammar].flatMap(g => g.examples.map(e => e[0]))
].filter(Boolean).map(x => String(x).normalize('NFC').trim());
const unique = [...new Map(texts.map(text => [text.toLocaleLowerCase('pt-BR').replace(/\s+/g, ' '), text])).values()];
if (lessons.length < 50 || expanded.words.length !== 36 || unique.length < 150) throw new Error('Audio inventory unexpectedly small');
process.stdout.write(JSON.stringify({texts: unique, lessonCount: lessons.length, wordCount: expanded.words.length}) + '\n');
