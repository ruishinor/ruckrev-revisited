import {record,date,localDate,newId} from './training-data.mjs';
export const CREW_CATEGORIES=['Leadership','Communication','Decision making','Adaptability','Inclusion','Service'];
export function practiceProgress(drills,records){
 const practiced=new Set(records.filter(r=>r.kind==='crew-practice'&&['practised','adapted'].includes(r.outcome)).map(r=>r.drillId));
 return CREW_CATEGORIES.map(category=>{const all=drills.filter(d=>d.category===category);const foundation=all.filter(d=>d.level==='Foundation'),applied=all.filter(d=>d.level==='Applied');return {category,foundation:foundation.map(d=>({...d,reviewed:practiced.has(d.id)})),applied:applied.map(d=>({...d,reviewed:practiced.has(d.id)})),next:foundation.find(d=>!practiced.has(d.id))||applied.find(d=>!practiced.has(d.id))||null};});
}
export function makeOuting(input,{id=newId()}={}){
 const when=String(input.date||'');if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(when))throw Error('Choose a local outing date and time.');
 return record({id,kind:'crew-outing',date:when.slice(0,10),title:'Crew outing: '+String(input.meeting||'').slice(0,160),notes:'',ref:null,crewPlan:{time:when.slice(11),meeting:input.meeting,route:input.route,pace:input.pace,alternatives:input.alternatives,kit:input.kit},crewReview:null});
}
export function reviewOuting(outing,input,today=localDate()){
 if(!outing||outing.kind!=='crew-outing')throw Error('Choose a saved outing.');
 const reviewed=date(input.date);if(reviewed>today)throw Error('Review date cannot be in the future.');
 if(input.outcome!=='cancelled'&&reviewed<outing.date)throw Error('Review an outing on or after its planned date. For an early cancellation, choose cancelled.');
 return record({...outing,crewReview:{date:reviewed,outcome:input.outcome,actual:input.actual,worked:input.worked,change:input.change,followUpDate:input.followUpDate||null}});
}
export function makePractice(drills,records,input,{id=newId(),today=localDate()}={}){
 const drill=drills.find(d=>d.id===input.drillId);if(!drill)throw Error('Choose an existing exercise.');
 if(date(input.date)>today)throw Error('Practice date cannot be in the future.');
 const outingId=input.outingId||null,goalId=input.goalId||null;
 if(outingId&&!records.some(r=>r.id===outingId&&r.kind==='crew-outing'))throw Error('Choose a saved outing.');
 if(goalId&&!records.some(r=>r.id===goalId&&r.kind==='goal'&&r.status==='active'))throw Error('Choose an active goal.');
 return record({id,kind:'crew-practice',date:input.date,title:drill.title,notes:input.notes,ref:null,drillId:drill.id,outingId,goalId,outcome:input.outcome,nextStep:input.nextStep,followUpDate:input.followUpDate||null});
}
export function crewRecordLinks(r,records){return [['Outing',r.outingId,'crew-outing'],['Goal',r.goalId,'goal']].filter(x=>x[1]).map(([label,id,kind])=>{const linked=records.find(x=>x.id===id&&x.kind===kind);return label+': '+(linked?linked.title+' · '+linked.date:'no longer available (historical reference retained)');});}
