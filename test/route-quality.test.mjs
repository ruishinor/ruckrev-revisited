import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {analyseSegments,distanceM,projectRoute,parseGpx,renderRouteViewer,renderDownloadPack,MAX_POINTS} from '../src/lib/route-viewer.mjs';
const pt=(lat,lon,ele)=>({lat,lon,ele});
test('GPX distance and ascent respect track segments and incomplete elevation',()=>{
 const a=pt(59.9,10.7,10),b=pt(59.901,10.7,20),c=pt(59.95,10.8,100),d=pt(59.951,10.8,97);
 const v=analyseSegments([[a,b],[c,d]]);assert.ok(Math.abs(v.distance-222.39)<.5);assert.equal(v.ascent,10);assert.equal(v.descent,3);assert.equal(v.series[1][0].distance,v.series[0][1].distance);
 assert.equal(analyseSegments([[a,pt(59.901,10.7,null)]]).ascent,null);assert.ok(distanceM(pt(0,179.99),pt(0,-179.99))<2300);
});
test('GPX limits, invalid coordinates and unmeasurable tracks are rejected',()=>{
 assert.throws(()=>analyseSegments([[pt(91,0),pt(0,0)]]));assert.throws(()=>analyseSegments([[pt(0,0),pt(0,0)]]));assert.throws(()=>analyseSegments([[pt(0,0)],[pt(1,1)]]));assert.throws(()=>analyseSegments([Array.from({length:MAX_POINTS+1},()=>pt(0,0))]));assert.throws(()=>parseGpx('<!DOCTYPE gpx><gpx/>'),/Unsupported/);
});
test('local route projection stays within view and preserves separate segments',()=>{
 const lines=projectRoute(analyseSegments([[pt(59,10),pt(59.01,10.01)],[pt(59.02,10.03),pt(59.03,10.05)]]).series);assert.equal(lines.length,2);for(const [x,y] of lines.flat()){assert.ok(x>=39&&x<=601&&y>=39&&y<=321);}
 const dateline=projectRoute(analyseSegments([[pt(0,179.99),pt(0,-179.99)]]).series);assert.ok(dateline[0][1][0]>dateline[0][0][0]);assert.match(renderRouteViewer(),/Your file stays in this browser session/);
});
test('downloadable field worksheets exist and are local',async()=>{const html=renderDownloadPack();const links=[...html.matchAll(/href="(\/downloads\/[^\"]+)" download/g)];assert.equal(links.length,4);for(const [,link] of links){assert.ok((await stat(new URL('../public'+link,import.meta.url))).size>300);}});
test('deployment and local server restrict native form submission and sensitive permissions',async()=>{const cfg=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));const headers=Object.fromEntries(cfg.headers[0].headers.map(x=>[x.key.toLowerCase(),x.value]));assert.match(headers['content-security-policy'],/form-action 'none'/);assert.equal(headers['referrer-policy'],'no-referrer');assert.match(headers['permissions-policy'],/geolocation=\(\)/);const dev=await readFile(new URL('../scripts/dev.mjs',import.meta.url),'utf8');assert.ok(dev.includes(headers['content-security-policy']));});
