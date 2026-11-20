// The publisher accepts course text + media, never scripts, filenames or commands from an artifact.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const [mode,pack,stage]=process.argv.slice(2);
const packs=['natural','conversation','expanded','more','c1'];
assert.ok(['expanded','more','c1'].includes(pack));
assert.ok(['needed','stage','check','apply'].includes(mode));
const manifestFile=p=>'audio/'+p+'-manifest.json';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const norm=t=>t.normalize('NFC').trim().replace(/\s+/gu,' ').toLocaleLowerCase('pt-BR');
const prior=new Set(packs.slice(0,packs.indexOf(pack)).flatMap(p=>Object.keys(read(manifestFile(p)).clips)));
const inv=JSON.parse(execFileSync(process.execPath,['tools/list_'+pack+'_audio.mjs'],{encoding:'utf8'}));
const wanted=new Map((Array.isArray(inv)?inv:inv.texts).map(t=>[norm(t),t]).filter(([k])=>!prior.has(k)));
const old=read(manifestFile(pack));assert.ok(wanted.size&&wanted.size<=2000);
const list=(p)=>fs.readdirSync(p).sort();
function regular(p,max){const s=fs.lstatSync(p);assert.ok(s.isFile()&&!s.isSymbolicLink()&&s.size>0&&s.size<=max,'Invalid artifact entry');return fs.readFileSync(p);}
const input=mode==='apply'||mode==='check';
if(mode==='needed'){
  // Verify the current manifest against trusted curriculum; preflight integrity runs separately.
  const equal=wanted.size===Object.keys(old.clips).length&&[...wanted].every(([k,t])=>old.clips[k]?.text===t);
  console.log(equal?'false':'true');process.exit(0);
}
assert.ok(stage&&path.isAbsolute(stage),'Use a private absolute staging directory');
if(!input)fs.mkdirSync(stage,{recursive:true});
assert.ok(fs.lstatSync(stage).isDirectory()&&!fs.lstatSync(stage).isSymbolicLink());
const rows=input?JSON.parse(regular(path.join(stage,'manifest.json'),3e6)).clips:old.clips;
assert.equal(Object.keys(rows).length,wanted.size);
const planned=[], records=Object.create(null),expected=['manifest.json'];
for(const [k,t] of wanted){
  assert.ok(Object.hasOwn(rows,k));
  const c=rows[k];assert.equal(c.text,t);
  const stem=sha(t).slice(0,20);const row={text:t};records[k]=row;
  for(const [v,p,h,d] of [['normal','src','sha256','duration'],['slow','slowSrc','slowSha256','slowDuration']]){
    const file=stem+'-'+v+'.mp3';const dest='audio/'+pack+'-v1/'+file;assert.equal(c[p],dest);
    assert.match(c[h],/^[a-f0-9]{64}$/);assert.ok(Number.isFinite(c[d])&&c[d]>.1&&c[d]<120);
    const incoming=path.join(stage,file),source=input?incoming:dest,output=input?dest:incoming;
    const b=regular(source,2000000);assert.equal(sha(b),c[h]);assert.ok(b.length>=1024);
    assert.ok(b.subarray(0,3).toString()==='ID3'||(b[0]===255&&(b[1]&224)===224),'Not MP3 media');
    expected.push(file);planned.push([source,output]);row[p]=dest;row[d]=c[d];row[h]=c[h];
  }
  assert.notEqual(c.sha256,c.slowSha256);
}
if(input)assert.deepEqual(list(stage),expected.sort());
if(mode!=='check'){
  for(const [from,to] of planned)fs.copyFileSync(from,to);
  const m={meta:{...old.meta,count:wanted.size,files:2*wanted.size},clips:records};
  fs.writeFileSync(input?manifestFile(pack):path.join(stage,'manifest.json'),JSON.stringify(m,null,2)+'\n');
}
console.log(pack+': '+wanted.size+' trusted texts, '+planned.length+' allowlisted MP3s');
