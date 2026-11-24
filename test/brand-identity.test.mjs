import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
test('original RR hex appears in header, footer and favicon references',async()=>{
 const app=await readFile(join(root,'src/app.mjs'),'utf8');
 assert.equal((app.match(/<img src="\/assets\/brand-mark\.png"/g)||[]).length,2);
 const html=await readFile(join(root,'index.html'),'utf8');
 for(const path of ['/favicon.svg','/favicon.png','/apple-touch-icon.png']) assert.ok(html.includes(path),path);
 const svg=await readFile(join(root,'public/favicon.svg'),'utf8');
 assert.match(svg,/Rucking Revolution hexagonal RR mark/);
 assert.match(svg,/data:image\/png;base64,/);
 for(const path of ['public/assets/brand-mark.png','public/favicon.png','public/favicon.ico','public/apple-touch-icon.png'])assert.ok((await stat(join(root,path))).size>1000,path);
});
test('all fourteen pictograms are distinct transparent PNGs in deep RR red',async()=>{
 const glyphs=['ruck','run','compare','layers','globe','shield','chevrons','barbell','waves','search','grid','filter','sort','close'];
 const seen=new Set();
 for(const key of glyphs){
  const bytes=await readFile(join(root,'public/assets/glyph-'+key+'.png'));
  assert.equal(bytes.toString('hex',0,8),'89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16),128);assert.equal(bytes.readUInt32BE(20),128);
  assert.ok(bytes.length>500);
  seen.add(bytes.toString('base64'));
 }
 assert.equal(seen.size,14);
 const css=await readFile(join(root,'public/site.css'),'utf8');
 assert.match(css,/#8B0000/);
 assert.match(css,/\.button-primary \.icon-asset/);
});
test('test catalogue and country flags remain unchanged',async()=>{
 const assessments=await readFile(join(root,'src/data/assessments.mjs'),'utf8');
 assert.match(assessments,/id:'ntoa-pfq'/);assert.match(assessments,/id:'rasp'/);
 for(const flag of ['au','dk','no','us']) assert.ok((await stat(join(root,'public/assets/flags',flag+'.svg'))).size>100);
});
