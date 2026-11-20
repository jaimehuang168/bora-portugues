// Refresh immutable URLs and Subresource Integrity from the trusted checkout.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const path='index.html',raw=fs.readFileSync(path,'utf8');
const tags=/<(?:script src|link rel="stylesheet" href)="(assets\/[a-z0-9-]+\.(?:js|css))(?:\?[^"]*)?"[^>]*>/g;
let count=0;
const html=raw.replace(tags,(tag,p)=>{
  count++;const file=fs.readFileSync(p);
  const rev=createHash('sha256').update(file).digest('hex').slice(0,12);
  const integrity='sha384-'+createHash('sha384').update(file).digest('base64');
  return (p.endsWith('.js')?'<script src="':'<link rel="stylesheet" href="')+p+'?v='+rev+'" integrity="'+integrity+'"'+(p.endsWith('.js')?' defer':'')+'>';
});
assert.ok(count>10);
if(process.argv.includes('--write'))fs.writeFileSync(path,html);
else assert.equal(raw,html,'Assets changed: run node tools/check_entry_assets.mjs --write');
console.log(count+' static entry assets pinned by content digest and SRI.');
