import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {icon,paths,upstream} from '../src/lib/icons.mjs';
import {renderAssessmentDetails} from '../src/lib/assessment-details.mjs';
test('all 42 upstream icon definitions remain distinct; owner-selected silhouettes are rendered for ruck and run',()=>{
 assert.equal(Object.keys(paths).length,42);assert.deepEqual(Object.keys(paths),Object.keys(upstream));assert.equal(new Set(Object.values(paths)).size,42);
 for(const name of Object.keys(paths)){const html=icon(name,24);assert.match(html,/focusable="false"/);assert.match(html,/aria-hidden="true"/);assert.match(html,/stroke="currentColor"/);assert.match(html,/stroke-width="2"/);assert.match(paths[name],/^(<path d="[^"<>]+" \/>)+$/);}
 assert.equal(upstream.run,'run');assert.equal(upstream.ruck,'backpack');assert.equal(upstream.shuttle,'arrows-exchange');assert.equal(upstream.waves,'swimming');assert.match(icon('run'),/class="approved-glyph"/);assert.match(icon('ruck'),/class="approved-glyph"/);
 assert.equal(icon('" onclick="alert(1)'),icon('info'));assert.equal(icon('__proto__'),icon('info'));assert.equal(icon('run','" onclick="alert(1)'),icon('run'));
 const license=readFileSync(new URL('../public/licenses/tabler-icons.txt',import.meta.url),'utf8');assert.match(license,/MIT License/);assert.match(license,/Paweł Kuna/);
});
test('additional official score bands and training guidance are present',()=>{
 assert.match(renderAssessmentDetails('rasp'),/Pre-RASP march/);assert.match(renderAssessmentDetails('army-aft'),/five 50 m|Five 50 m/);assert.match(renderAssessmentDetails('ntoa-pfq'),/Full PFQ base score bands/);assert.match(renderAssessmentDetails('norwegian-armed-forces'),/Alternative 20 m shuttle/);assert.match(renderAssessmentDetails('norwegian-armed-forces'),/11:8/);
 for(const id of ['ntoa-pfq','rasp','norwegian-armed-forces','artillerijaeger','nsw-pct','danish-police','army-aft','uk-police-jrft'])assert.match(renderAssessmentDetails(id),/Putting it into a training week/);
});
