import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {routeInventory,makeRouteInventory} from '../scripts/route-inventory.mjs';
import {securityHeaders,sharedHeaders} from '../scripts/security-headers.mjs';
import {sections} from '../src/data/content.mjs';
import {entries} from '../src/data/guides.mjs';
import {assessments} from '../src/data/assessments.mjs';
import {challengeRoutes} from '../src/data/challenges.mjs';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('shared inventory retains every original route and template; rejects duplicates and unsafe paths',async()=>{
 const base=['','training','resources','about','testing-library','testing-library/compare',...assessments.map(a=>'testing-library/'+a.id)];
 const extra=[...Object.keys(sections).map(x=>x.slice(1,-1)),...Object.keys(entries).map(x=>x.slice(1,-1)),'references','privacy','terms','learn','lead','learn/first-three-rucks','my-training',...challengeRoutes.map(x=>x.slice(1,-1))];
 assert.deepEqual(routeInventory.map(x=>x.path),[...base,...extra]);
 const preserved=JSON.parse(await read('test/fixtures/preserved-route-paths.json'));const current=new Set(routeInventory.map(x=>x.path));for(const path of preserved)assert.ok(current.has(path),`Existing public route removed without reviewed migration: ${path}`);
 for(const x of routeInventory){assert.equal(x.template,base.includes(x.path)&&x.path?x.path+'/index.html':'index.html');assert.ok((await stat(new URL('../'+x.template,import.meta.url))).isFile());}
 const fixture={sectionPaths:[],entryPaths:[],assessmentIds:[],challengePaths:[]};
 assert.throws(()=>makeRouteInventory({...fixture,sectionPaths:['/training/']}),/Duplicate route/);
 assert.throws(()=>makeRouteInventory({...fixture,entryPaths:['/../outside/']}),/Invalid route/);
 assert.throws(()=>makeRouteInventory({...fixture,assessmentIds:['../outside']}),/Invalid route/);
});
test('shared response policy retains all deployment security headers and rejects drift-prone structures',async()=>{
 const config=JSON.parse(await read('vercel.json'));
 assert.deepEqual({...securityHeaders},Object.fromEntries(config.headers[0].headers.map(x=>[x.key.toLowerCase(),x.value])));
 for(const key of ['content-security-policy','referrer-policy','x-content-type-options','x-frame-options','permissions-policy'])assert.ok(securityHeaders[key]);
 assert.throws(()=>sharedHeaders({...config,headers:[...config.headers,...config.headers]}),/global Vercel/);
 assert.throws(()=>sharedHeaders({headers:[{source:'/(.*)',headers:[{key:'x-test',value:'a'},{key:'X-Test',value:'b'}]}]}),/duplicate/);
 assert.throws(()=>sharedHeaders({headers:[{source:'/(.*)',headers:[{key:'x-test',value:'a\nb'}]}]}),/Invalid/);
 assert.match(await read('.gitignore'),/^\/dist\/$/m);
 assert.match(await read('.github/workflows/ci.yml'),/git ls-files -- dist\//);
});
