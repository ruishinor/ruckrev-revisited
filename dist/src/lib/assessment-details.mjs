// Official protocols and independent Rucking Revolution training guidance are separate.
// Reviewed against the publishers' public pages on 2026-11-24.
export const reviewedOn='2026-11-24';
export const assessmentDetails=Object.freeze({
 'ntoa-pfq':{
  format:'Five consecutive events, with three minutes between efforts and a judge for each participant. This is a proposed SWAT fitness benchmark, not a universal hiring standard.',
  columns:['Event','2-point threshold','10-point threshold','Setup'],
  rows:[['800 m run','4:29 or faster','3:14 or faster','Training uniform and boots; no added load'],['400 m loaded run','3:44 or faster','2:44 or faster','25 lb per hand, 20 lb vest; official mask protocol'],['Burpees (3 min)','38','50','Chest and hips touch floor; jump to full extension'],['Squats (2 min)','64','75','20 lb vest; official mask protocol'],['Strict pull-ups (1 min)','12','20','First five continuous; no kipping']],
  scoring:'Base event scores are 0, 2, 4, 6, 8 or 10. At least 30 total and no zero-score event are required. Extra points are available above the top thresholds; consult the full scorecard for intermediate bands and bonuses.',
  training:['Build comfortable continuous running and a separate interval session; use repeatable 400 m efforts before combining events.','Train carries, squat endurance and strict pulling in separate blocks. Introduce event duration and load only once movement remains controlled.','Rehearse event order and three-minute recovery at submaximal effort; log valid repetitions rather than total attempts.'],
  mistakes:['Treating a fast first run as a substitute for balanced capacity across all five events.','Using partial repetitions or unfamiliar load. Do not improvise restricted-breathing or mask drills for home practice.'],
  log:'Record both run times, valid repetitions for each timed event, load, rest intervals and any invalid movements.',
  extra:[['Full PFQ scoring instructions','https://www.ntoa.org/pfq/']]
 },
 rasp:{
  format:'RASP and the pre-RASP entry assessment are distinct stages. The public Army overview lists the following activities; it does not provide a complete administration manual.',
  columns:['Stage / event','Published requirement','Practice context'],
  rows:[['Pre-RASP push-ups','41 hand-release repetitions','Use the official movement standard'],['Pre-RASP plank','2:35','Hold a stable position'],['Pre-RASP run','2 miles','Confirm the applicable time with recruiting staff'],['Pre-RASP pull-ups','6 repetitions','Use controlled full-range repetitions'],['RASP run','5 miles in under 40 min','Approx. 8.05 km; under 8 min/mile'],['RASP march','12 miles, 35 lb ruck','Approx. 19.3 km, 15.9 kg; time not stated on this overview'],['RASP swim','15 m in uniform','Only practise under appropriate supervision']],
  scoring:'Do not substitute Ranger School standards, unofficial pack-weight definitions or internet time limits for current RASP instructions. Confirm the current selection instructions and packing list.',
  training:['Build unloaded running fitness and maintain a separate easy loaded walk. Increase distance, pace or load separately rather than all together.','Use longer steady walks on varied but familiar terrain. Record actual pack weight and practise foot care, pack adjustment and hydration.','Practise hand-release push-ups, pulling and trunk endurance with consistent technique. Use supervised pool practice for swimming.'],
  mistakes:['Running every loaded session; making heavy test-weight marches the default workout.','Confusing the entry assessment with the selection course or practising uniform swimming alone.'],
  log:'Track unloaded running times, pack weight, route distance, elapsed time, foot discomfort and recovery the next day.'
 },
 'norwegian-armed-forces':{
  format:'General soldier tests comprise running and three strength/power assessments. Selection-day and annual employee protocols may differ; the applicable role determines the required grade.',
  columns:['Event','Grade 5 men','Grade 5 women','Protocol'],
  rows:[['3,000 m','14:00','15:00','Measured road, path or track'],['Medicine-ball throw','4.4 m','3.3 m','10 kg ball; best of three'],['Standing long jump','2.20 m','1.90 m','Measure to the rearmost landing point'],['Pull-ups','4 hanging','8 horizontal','Horizontal variant only where applicable']],
  scoring:'These are examples from the general grading table, not a universal pass standard. The horizontal and hanging pull-up variants are not directly interchangeable. Use the current role-specific table.',
  training:['Alternate easy running with controlled intervals, then use a measured 3,000 m route to calibrate pacing.','Develop explosive strength with low-volume jumps and throws, with full recovery between repetitions.','Build pulling strength using strict repetitions, controlled lowering and appropriate horizontal variations.'],
  mistakes:['Using GPS distance alone on a short assessment route or comparing different pull-up variants as identical.','Repeated maximal throws and jumps when fatigued; overlooking the specific protocol used at selection.'],
  log:'Record run time, ball mass, best throw, best jump and pull-up variant plus valid repetition count.',
  extra:[['Selection-day fitness test','https://www.forsvaret.no/sesjon/fysisk-test-pa-sesjon'],['Annual employee fitness test','https://www.forsvaret.no/krav/arlig-fysisk-test']]
 },
 artillerijaeger:{
  format:'These minimums apply to the published Artillerijeger education route requiring completed initial service. The initial-service route has separate requirements.',
  columns:['Event','Published minimum','Practice context'],
  rows:[['8 km pack run','52:00 with 22 kg','Average 6:30 per km'],['3,000 m road run','12:30','Average 4:10 per km'],['Push-ups','30','Count approved repetitions'],['Pull-ups','6','Use the published technique'],['Medicine-ball throw','4.6 m','Confirm the prescribed setup'],['Standing long jump','2.25 m','Measure from the start line'],['400 m swim','Pass','No numeric time published here']],
  scoring:'The education page identifies these as minimum physical requirements and warns that later training-stage tests differ. Do not treat the thresholds as a complete selection prediction.',
  training:['Build running speed without a pack. Keep loaded endurance sessions predominantly controlled and build gradually from a manageable load.','Use measured routes to monitor pace; introduce varied terrain and reliable pack fit after building a base.','Maintain pulling, pushing, jumping and throwing work; schedule supervised swim practice separately.'],
  mistakes:['Starting with a 22 kg pack because it is the test weight.','Confusing the education route with initial-service selection, or treating a single minimum result as readiness.'],
  log:'Record actual pack mass, distance, terrain, elapsed time, unloaded 3,000 m result and recovery.',
  extra:[['Separate initial-service route','https://www.forsvaret.no/forstegangstjeneste/tjenesteguiden/sokbare-forstegangstjenester/artillerijeger']]
 },
 'nsw-pct':{
  format:'Six activities for general NSW Police recruitment. The professional mobility and cadet programmes use different criteria.',
  columns:['Event','Minimum','Attempts'],
  rows:[['Grip strength','30 kg each hand','2'],['Prone bridge','90 s','1'],['Vertical jump','30 cm','2'],['Push-ups','25','1'],['Illinois agility','20 s or faster','2'],['20 m shuttle run','Level 7.1','1']],
  scoring:'Each activity has its own minimum. For the 20 m shuttle, reach the line with a foot and pivot; the official protocol allows one warning for incorrect turns or line contact before stopping the participant on the second occurrence.',
  training:['Mark a measured 20 m lane and practise controlled turns with the correct audio; use short blocks initially, not repeated maximal tests.','Train grip, strict push-ups and trunk endurance two or more non-consecutive days as tolerated; practise vertical jumps with adequate recovery.','Learn the official agility layout and practise acceleration and deceleration at increasing speed. Rehearse the six events as a battery only when familiar.'],
  mistakes:['Using the 15 m UK police audio or an unmeasured lane.','Rounding the corners in a shuttle, counting invalid repetitions, or training only the beep test.'],
  log:'Track both handgrip results, bridge time, jump height, valid push-ups, agility time and level/shuttle.',
  extra:[['20 m shuttle test instructions','https://www.police.nsw.gov.au/recruitment/application_process/fitness/multi-stage_fitness'],['Recruitment pathway information','https://www.police.nsw.gov.au/recruitment/application_process']]
 },
 'danish-police':{
  format:'Six mandatory parts in a roughly three-hour assessment including feedback. The prescribed warm-up is itself a test and lasts approximately 15 minutes.',
  columns:['Event','Men','Women'],
  rows:[['Prescribed warm-up','Complete programme','Complete programme'],['Figure-eight speed test','17.5 s or faster','18.7 s or faster'],['Standing long jump','210 cm','160 cm'],['Approved body pulls','4','5'],['Bench press','10 reps at 50 kg','10 reps at 30 kg'],['2,400 m run','12:00 or faster','13:30 or faster']],
  scoring:'All six parts must be passed. Speed course uses two cones 13.4 m apart and 2¼ circuits; jump results round down to 5 cm. The published body-pull instructions differ by category: use the official demonstration rather than assuming identical pull-ups. Bench load includes the bar. Body pulls and bench each allow two attempts.',
  training:['Practise the prescribed warm-up as a sequence, then learn the figure-eight course at low speed before adding timed efforts.','Use controlled bench press with a spotter or safeties. Train the appropriate body-pull variant and standing jump separately.','On a measured 400 m track, 12:00 over 2,400 m corresponds to six 2:00 laps; 13:30 corresponds to six 2:15 laps. Build pacing with easy running and shorter intervals.'],
  mistakes:['Treating the warm-up as optional; using the wrong body-pull technique or excluding the bar from bench weight.','Testing a fresh 2,400 m run but never practising the sequence at a controlled effort.'],
  log:'Record applicant category, approved reps and total bar weight, jump distance, course time and six lap splits.',
  extra:[['Men: official instructions','https://politi.dk/om-politiet/politiskolen/fysisk-proeve-for-maend'],['Women: official instructions','https://politi.dk/om-politiet/politiskolen/fysisk-proeve-for-kvinder']]
 },
 'army-aft':{
  format:'The five-event Army Fitness Test replaced the ACFT in June 2025. Use the current AFT score scale, not the former six-event test.',
  columns:['Event','Result recorded','Practice focus'],
  rows:[['3-repetition maximum deadlift','Load','Controlled hinge and bracing'],['Hand-release push-up','Valid repetitions','Full official arm-extension sequence'],['Sprint-drag-carry','Elapsed time','Acceleration, deceleration and controlled transitions'],['Plank','Hold duration','Stable trunk position'],['Two-mile run','Elapsed time','Pacing over approximately 3.22 km']],
  scoring:'Army guidance sets a 60-point minimum per event and 300 total for combat-enabling specialties; designated combat specialties require 350 total with at least 60 per event. Use the current applicable age/category tables and check any later policy or exemptions. The Combat Field Test is separate.',
  training:['Build foundational strength before heavy triples. Use coaching and suitable equipment; avoid frequent maximal attempts.','Practise hand-release push-up form and controlled plank intervals. Learn sprint-drag-carry movements separately before timing a full sequence.','Combine easy runs and one paced interval session as tolerated. Rehearse event order below maximum effort before a formal assessment.'],
  mistakes:['Using legacy ACFT scoring or adding the discontinued power throw.','Practising only the two-mile run, or letting fatigue compromise deadlift technique.'],
  log:'Record category, lifted load, valid repetitions, sprint-drag-carry time, plank duration and run time.',
  extra:[['Official AFT scoring tables and instructions','https://www.army.mil/aft/']]
 },
 'uk-police-jrft':{
  format:'The College of Policing job-related fitness test in England and Wales uses the 15 m multi-stage shuttle protocol. General personal safety training uses level 5.4; specialist roles may have higher standards.',
  columns:['Parameter','Published standard'],
  rows:[['Lane length','15 m'],['General personal safety training','Level 5, shuttle 4'],['Specialist roles','Check the role-specific table']],
  scoring:'One length of the 15 m course is one shuttle. Level 5.4 is level five, shuttle four, not a decimal speed or a result on the 20 m test.',
  training:['Measure the lane and use the correct 15 m audio. Practise reaching the line and turning smoothly without sprinting the early levels.','Build aerobic capacity with easy runs or brisk walks and gradually add brief shuttle intervals.','Retest with the same surface, audio and footwear after adequate recovery; stop at the applicable standard or according to assessor instructions.'],
  mistakes:['Using a 20 m beep-test recording.','Starting too fast, turning early, or treating the general standard as sufficient for every specialist role.'],
  log:'Record protocol length, final level and shuttle, surface and whether the required standard was reached.'
 }
});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const items=xs=>`<ul class="detail-list">${xs.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
export function renderAssessmentDetails(id){
 const d=Object.hasOwn(assessmentDetails,id)?assessmentDetails[id]:null;if(!d)return '';
 const headings=d.columns.map(c=>`<th scope="col">${esc(c)}</th>`).join('');
 const rows=d.rows.map(r=>`<tr>${r.map((v,i)=>i===0?`<th scope="row">${esc(v)}</th>`:`<td>${esc(v)}</td>`).join('')}</tr>`).join('');
 const links=(d.extra||[]).filter(([,url])=>/^https:\/\//.test(url)).map(([label,url])=>`<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a></li>`).join('');
 return `<section class="content-panel assessment-protocol" aria-labelledby="assessment-protocol-title"><h2 id="assessment-protocol-title">Test protocol and standards</h2><p>${esc(d.format)}</p><p class="footnote">Official information checked ${reviewedOn}. Confirm current requirements with the test publisher.</p><div class="table-scroll assessment-table" tabindex="0" role="region" aria-label="Published assessment standards"><table><thead><tr>${headings}</tr></thead><tbody>${rows}</tbody></table></div><h3>Scoring and scope</h3><p>${esc(d.scoring)}</p>${links?`<ul class="simple-list">${links}</ul>`:''}</section><section class="content-panel assessment-preparation" aria-labelledby="assessment-preparation-title"><h2 id="assessment-preparation-title">How to prepare</h2><p class="footnote">Independent training guidance, not official test instructions. Scale sessions to your current capacity and recover between demanding efforts.</p>${items(d.training)}<h3>Common mistakes</h3>${items(d.mistakes)}<h3>What to log</h3><p>${esc(d.log)}</p><p class="footnote">Avoid repeated maximal tests and sudden load increases. Stop if pain, dizziness or unusual symptoms occur; use qualified supervision where appropriate.</p></section>`;
}
