import { assessments, byId } from '../data/assessments.mjs';
export const FILTER_DEFAULTS = Object.freeze({q:'',category:'all',country:'all',domain:'all',scoring:'all',reproducibility:'all',status:'all',sort:'relevance',view:'grid'});
const allowed = Object.freeze({
  sort:['relevance','name','country'], view:['grid','list']
});
export function normalizeParams(params) {
  const result={...FILTER_DEFAULTS};
  for(const key of Object.keys(result)){
    const value=params.get(key);
    if(value!==null) result[key]=String(value).slice(0,120);
  }
  for(const [key,values] of Object.entries(allowed)) if(!values.includes(result[key]))result[key]=FILTER_DEFAULTS[key];
  return result;
}
export function filterAssessments(data=assessments, f=FILTER_DEFAULTS) {
  const query=(f.q??'').trim().toLocaleLowerCase('en');
  const result=data.filter(a=>{
    if(f.category!=='all'&&!a.category.includes(f.category)) return false;
    if(f.country!=='all'&&a.country!==f.country) return false;
    if(f.domain!=='all'&&a.domain!==f.domain) return false;
    if(f.scoring!=='all'&&a.scoring!==f.scoring) return false;
    if(f.reproducibility!=='all'&&a.reproducibility!==f.reproducibility) return false;
    if(f.status!=='all'&&a.status!==f.status) return false;
    if(!query)return true;
    return [a.shortName,a.name,a.subtitle,a.country,a.domain,a.keywords,a.metric.label,a.metric.detail,...a.tags,...a.components].join(' ').toLocaleLowerCase('en').includes(query);
  });
  if(f.sort==='name')result.sort((a,b)=>a.shortName.localeCompare(b.shortName,'en'));
  if(f.sort==='country')result.sort((a,b)=>a.country.localeCompare(b.country,'en')||a.shortName.localeCompare(b.shortName,'en'));
  return result;
}
export function validSelection(ids,max=3){return [...new Set(ids)].filter(id=>Boolean(byId[id])).slice(0,max);}
export function parseSelection(s){return validSelection((s??'').split(','));}
export function withParams(filters, selection, basePath='/testing-library/'){
  const url=new URL(basePath,'https://ruckrev.local');
  for(const [key,v] of Object.entries(filters)) if(v!==FILTER_DEFAULTS[key]&&v!==null&&v!=='') url.searchParams.set(key,v);
  if(selection?.length)url.searchParams.set('compare',selection.join(','));
  return url.pathname+url.search;
}
