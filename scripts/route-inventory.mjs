import { sections } from '../src/data/content.mjs';
import { entries } from '../src/data/guides.mjs';
import { assessments } from '../src/data/assessments.mjs';
import { challengeRoutes } from '../src/data/challenges.mjs';

export function makeRouteInventory({sectionPaths,entryPaths,assessmentIds,challengePaths}) {
 const strip = path => {
  if (typeof path !== 'string' || !/^\/(?:[a-z0-9-]+\/)+$/.test(path)) throw Error(`Invalid route path: ${path}`);
  return path.slice(1,-1);
 };
 const base = ['', 'training', 'resources', 'about', 'testing-library', 'testing-library/compare', ...assessmentIds.map(id=>{if(typeof id!=='string'||!/^[-a-z0-9]+$/.test(id))throw Error(`Invalid route assessment ID: ${id}`);return strip(`/testing-library/${id}/`);})];
 const extra = [...sectionPaths.map(strip), ...entryPaths.map(strip), 'references','privacy','terms','learn','lead','learn/first-three-rucks','my-training', ...challengePaths.map(strip)];
 const routes = [...base.map(path=>({path,template:path?`${path}/index.html`:'index.html'})), ...extra.map(path=>({path,template:'index.html'}))];
 const seen = new Set();
 for (const route of routes) { if (seen.has(route.path)) throw Error(`Duplicate route: /${route.path}`); seen.add(route.path); }
 return Object.freeze(routes.map(Object.freeze));
}
export const routeInventory = makeRouteInventory({sectionPaths:Object.keys(sections),entryPaths:Object.keys(entries),assessmentIds:assessments.map(a=>a.id),challengePaths:challengeRoutes});
