import {entries} from '../data/guides.mjs';
import {challenges} from '../data/challenges.mjs';
import {assessments} from '../data/assessments.mjs';
const kindOf=x=>x.trainingPlan?'programme':x.kind==='Challenge'||x.parent==='/resources/challenges/'?'challenge':x.parent==='/resources/events/'?'event':x.parent==='/training/workouts/'?'workout':x.parent==='/resources/articles/'?'article':null;
export function catalogue(){return [...Object.values(entries).flatMap(x=>{const kind=kindOf(x);return kind?[{kind,id:x.path,label:x.title,href:x.path,level:x.level}]:[];}),...challenges.map(c=>({kind:'challenge',id:c.path,label:c.title,href:c.path,level:c.level})),...assessments.map(x=>({kind:'assessment',id:x.id,label:x.shortName,href:'/testing-library/'+x.id+'/'})),{kind:'checklist',id:'ruck-preparation',label:'Ruck preparation checklist',href:'/resources/tools/#ruck-checklist'}];}
export function resolveReference(ref){return ref&&catalogue().find(x=>x.kind===ref.kind&&x.id===ref.id);}
export function referenceForPath(path){return catalogue().find(x=>x.href===path);}
export function referenceFrom(entry){return entry?{kind:entry.kind,id:entry.id,label:entry.label}:null;}
