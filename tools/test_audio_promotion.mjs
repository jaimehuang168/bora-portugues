import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const exe=(...arg)=>execFileSync(process.execPath,['tools/promote_audio.mjs',...arg],{encoding:'utf8'});
for(const pack of ['expanded','more','c1']){
  const need=exe('needed',pack).trim();assert.ok(['true','false'].includes(need));
  if(need==='true'){console.log(pack+': curriculum changed; awaiting a new build');continue;}
  const dir=mkdtempSync(join(tmpdir(),'bora-audio-check-'));
  try{
    exe('stage',pack,dir);exe('check',pack,dir);
    writeFileSync(join(dir,'extra-note.txt'),'not part of the release');
    assert.notEqual(spawnSync(process.execPath,['tools/promote_audio.mjs','check',pack,dir],{stdio:'ignore'}).status,0);
    console.log(pack+': data-only promotion and unexpected-file rejection verified');
  }finally{rmSync(dir,{recursive:true,force:true});}
}
