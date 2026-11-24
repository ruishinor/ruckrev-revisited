import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('CI uses immutable actions, Node 22 and a matching locked Playwright release',async()=>{
 const [ci,pkg,lock]=await Promise.all([read('.github/workflows/ci.yml'),read('package.json').then(JSON.parse),read('package-lock.json').then(JSON.parse)]);
 const uses=[...ci.matchAll(/^\s*- uses: (\S+)/gm)].map(m=>m[1]);
 assert.equal(uses.length,4);
 assert.ok(uses.every(s=>/^actions\/(checkout|setup-node)@[a-f0-9]{40}$/.test(s)));
 assert.equal(uses.filter(x=>x.startsWith('actions/checkout@')).length,2);
 assert.equal(uses.filter(x=>x.startsWith('actions/setup-node@')).length,2);
 assert.equal(new Set(uses).size,2);
 assert.equal((ci.match(/node-version: '22'/g)||[]).length,2);
 assert.equal((ci.match(/persist-credentials: false/g)||[]).length,2);
 assert.equal((ci.match(/package-manager-cache: false/g)||[]).length,2);
 const v=pkg.devDependencies['@playwright/test'];assert.match(v,/^\d+\.\d+\.\d+$/);
 assert.ok(ci.includes('playwright:v'+v+'-noble-amd64@sha256:'));
 assert.match(ci,/playwright:v[\d.]+-noble-amd64@sha256:[a-f0-9]{64}/);
 assert.ok(ci.includes('npm ci --include=dev --ignore-scripts --no-audit --no-fund'));
 assert.ok(ci.includes('Verify preinstalled Chromium'));
 assert.ok(ci.includes('await chromium.launch()'));
 assert.ok(ci.includes('npm test')&&ci.includes('node scripts/check-site.mjs')&&ci.includes('npx --no-install playwright test --config=playwright.config.mjs'));
 assert.equal((ci.match(/npm run build/g)||[]).length,2);
 assert.equal(lock.lockfileVersion,3);
 assert.equal(lock.packages[''].devDependencies['@playwright/test'],v);
 for(const name of ['@playwright/test','playwright','playwright-core'])assert.equal(lock.packages['node_modules/'+name]?.version,v);
 for(const [name,p] of Object.entries(lock.packages)){if(!name)continue;assert.ok(p.dev===true,name);assert.equal(new URL(p.resolved).origin,'https://registry.npmjs.org',name);assert.match(p.integrity,/^sha512-[A-Za-z0-9+/]+={0,2}$/,name);}
 assert.equal(pkg.scripts.verify,'npm test && npm run build && node scripts/check-site.mjs');
});
