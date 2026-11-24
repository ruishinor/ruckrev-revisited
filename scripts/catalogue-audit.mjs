import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const day = 86400000;
const enums = {
  load: ['fixed', 'kit', 'none'], participation: ['solo', 'team'],
  support: ['organiser', 'self', 'unsupported', 'crew'],
  terrain: ['mountain', 'desert', 'coastal', 'wilderness', 'polar', 'mixed', 'obstacles', 'urban'],
  qualification: ['required', 'none']
};
const nonempty = x => typeof x === 'string' && x.trim().length > 0;
const isoDate = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) && Number.isFinite(Date.parse(x)) && new Date(x).toISOString().slice(0,10) === x;
const publicHttps = x => {
  try { const u = new URL(x); return u.protocol === 'https:' && !u.username && !u.password && u.port === '' && u.hostname.includes('.') && !/^\d+(?:\.\d+){3}$|^\[|\.localhost$|\.local$|\.internal$/.test(u.hostname); } catch { return false; }
};
const dateOnly = x => {
  if (isoDate(x)) return x;
  if (!nonempty(x) || !/^\d{1,2} [A-Za-z]+ \d{4}$/.test(x)) return null;
  const t = Date.parse(x + ' UTC');
  return Number.isFinite(t) ? new Date(t).toISOString().slice(0,10) : null;
};

export function auditCatalogue({events, assessments, details, entries, reviewedOn, today = new Date().toISOString().slice(0,10)}) {
  if (!isoDate(today)) throw new Error('Invalid audit date');
  const errors = [], warnings = [], sources = new Map();
  const add = (list, id, code, message) => list.push({id, code, message});
  const err = (id, code, message) => add(errors, id, code, message);
  const warn = (id, code, message) => add(warnings, id, code, message);
  const link = (id, url) => {
    if (!publicHttps(url)) { err(id, 'source-url', 'Expected public HTTPS source without credentials: ' + String(url)); return; }
    const u = new URL(url); u.hash = '';
    const key = u.href; const refs = sources.get(key) ?? new Set(); refs.add(id); sources.set(key, refs);
  };
  function review(id, value, maxDays) {
    const d = dateOnly(value);
    if (!d) { warn(id, 'review-date-missing', 'No usable human review date'); return; }
    const age = (Date.parse(today) - Date.parse(d)) / day;
    if (age < 0) warn(id, 'review-date-future', 'Review date is in the future');
    if (age > maxDays) warn(id, 'review-due', `Last review ${d}; review interval ${maxDays} days`);
  }
  function unique(records, key, label) {
    const seen = new Set();
    for (const record of records) {
      const id = record[key];
      if (!nonempty(id)) err(label, 'missing-id', 'Missing ' + key);
      else if (seen.has(id)) err(id, 'duplicate-id', 'Duplicate ' + label + ' ' + key);
      seen.add(id);
    }
  }
  unique(events, 'slug', 'event'); unique(assessments, 'id', 'assessment');
  const titles = new Map();
  for (const e of events) {
    const id = 'event:' + e.slug;
    if (!nonempty(e.title) || !nonempty(e.eventCountry) || !nonempty(e.eventType)) err(id,'event-metadata','Missing title, country or event type');
    const title = String(e.title).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
    if (titles.has(title)) warn(id,'possible-duplicate','Same normalised title as ' + titles.get(title));
    titles.set(title,id);
    if (e.eventDate != null && !isoDate(e.eventDate)) err(id,'event-date','Invalid ISO calendar date');
    if (isoDate(e.eventDate) && e.eventDate < today) warn(id,'past-edition','Edition date has passed; preserve history and review future dates');
    review(id,e.checked,e.eventDate && e.eventDate >= today ? 30 : 180);
    if (!nonempty(e.citation?.author) || !nonempty(e.citation?.title)) err(id,'citation','Missing citation author or title');
    link(id,e.citation?.url);
    if (!Array.isArray(e.links) || !e.links.length) err(id,'missing-links','No source links');
    else for (const pair of e.links) { if (!Array.isArray(pair) || !nonempty(pair[0])) err(id,'link-label','Missing source link label'); else link(id,pair[1]); }
    if (e.path !== `/resources/events/${e.slug}/` || entries[e.path]?.slug !== e.slug) err(id,'event-route','Missing or inconsistent event route');
    if (!Array.isArray(e.variants) || !e.variants.length) { err(id,'variants','Missing variant list'); continue; }
    unique(e.variants,'label',id+' variant');
    for (const v of e.variants) {
      if (v.distanceKm !== null && !(Number.isFinite(v.distanceKm) && v.distanceKm > 0)) err(id,'variant-distance',v.label + ': invalid distance');
      if (v.days !== null && !(Number.isInteger(v.days) && v.days > 0)) err(id,'variant-days',v.label + ': invalid days');
      for (const [key, allowed] of Object.entries(enums)) if (v[key] !== null && !allowed.includes(v[key])) err(id,'variant-enum',v.label + ': invalid '+key+' (unknown must be null)');
    }
  }
  for (const a of assessments) {
    const id = 'assessment:' + a.id;
    if (!nonempty(a.name) || !nonempty(a.country) || !nonempty(a.source?.publisher)) err(id,'assessment-metadata','Missing name, country or publisher');
    link(id,a.source?.url); review(id,a.source?.checked ?? reviewedOn,180);
    if (!a.source?.checked) warn(id,'shared-review-date','Assessment uses catalogue-wide review date; verify each source individually');
    const d = Object.hasOwn(details,a.id) ? details[a.id] : null;
    if (!d || !Array.isArray(d.columns) || !Array.isArray(d.rows) || !d.rows.length || d.rows.some(r=>!Array.isArray(r)||r.length!==d.columns.length)) err(id,'assessment-protocol','Missing or inconsistent protocol table');
    for (const pair of d?.extra ?? []) if (Array.isArray(pair)) link(id,pair[1]);
    if (a.image) warn(id,'image-rights-review','Existing image requires individual creator/licence/permission review: '+a.image);
  }
  for (const id of Object.keys(details)) if (!assessments.some(a=>a.id===id)) err(id,'orphan-protocol','Protocol has no assessment record');
  for (const e of Object.values(entries)) if (e.image) warn(e.path,'image-rights-review','Existing image requires individual creator/licence/permission review: '+e.image);
  return {today,counts:{events:events.length,assessments:assessments.length,sources:sources.size},errors,warnings,sources:[...sources].map(([url,refs])=>({url,refs:[...refs]}))};
}

// Manual, opt-in link check. HEAD only; never follows redirects, sends credentials,
// downloads response bodies or interprets network errors as catalogue corrections.
export async function probeSources(sources,{fetcher=fetch,delayMs=1000,limit=50}={}) {
  if (!Number.isInteger(limit)||limit<1||limit>100||!Number.isFinite(delayMs)||delayMs<1000) throw new Error('Unsafe probe configuration');
  const results=[];
  for(const s of sources.slice(0,limit)) {
    if (!publicHttps(s.url)) { results.push({...s,status:'invalid-url'}); continue; }
    try {
      const r=await fetcher(s.url,{method:'HEAD',redirect:'manual',credentials:'omit',signal:AbortSignal.timeout(8000),headers:{'User-Agent':'RuckingRevolution-source-review/1.0'}});
      results.push({...s,httpStatus:r.status,status:r.status>=300&&r.status<400?'redirect-review':r.ok?'reachable':'manual-review',location:r.headers.get('location')??null});
    } catch { results.push({...s,status:'network-unconfirmed'}); }
    if(results.length<Math.min(sources.length,limit)) await new Promise(r=>setTimeout(r,delayMs));
  }
  return results;
}

async function main(){
  const [{collections,entries},{assessments},{assessmentDetails,reviewedOn}]=await Promise.all([import('../src/data/guides.mjs'),import('../src/data/assessments.mjs'),import('../src/lib/assessment-details.mjs')]);
  const result=auditCatalogue({events:collections['/resources/events/'],assessments,details:assessmentDetails,entries,reviewedOn});
  if(process.argv.includes('--links')) result.linkObservations=await probeSources(result.sources);
  console.log(JSON.stringify(result,null,2));
  if(result.errors.length) process.exitCode=1;
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) await main();
