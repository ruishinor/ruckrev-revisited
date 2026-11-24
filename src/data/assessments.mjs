/* Rucking Revolution v2: editorial test catalogue.
   Source links are maintained per entry. A listed event is not the entire programme. */
export const categories = Object.freeze([
  {id:'all',label:'Overall Fitness',icon:'chart'},
  {id:'rucking',label:'Rucking / Loaded Endurance',icon:'ruck'},
  {id:'work',label:'Work / Role Fitness',icon:'shield'},
  {id:'selection',label:'Selection & Entry',icon:'chevrons'},
  {id:'strength',label:'Strength & Work Capacity',icon:'barbell'},
  {id:'running',label:'Running & Aerobic',icon:'run'},
  {id:'water',label:'Water & Swim',icon:'waves'},
]);
export const assessments = Object.freeze([
  {
    id:'ntoa-pfq',shortName:'PFQ',name:'Physical Fitness Qualification',
    subtitle:'NTOA physical fitness test',country:'United States',countryCode:'US',flag:'🇺🇸',domain:'Police',
    kind:'POLICE FITNESS TEST',category:['all','work','strength','running'],scoring:'Points',reproducibility:'Published instructions',status:'Official source',
    image:'pfq.webp',keywords:'PFQ NTOA US police physical fitness qualification',
    metric:{label:'800 m run',detail:'3:14 or faster earns 10 points',icon:'run'},
    tags:['Running','Strength','Work Capacity'],
    overview:'The National Tactical Officers Association (NTOA) has a five-part fitness test that mixes running and bodyweight exercises. It is more than one run, and each part contributes to the final score.',
    components:['800 m run','400 m run carrying weights','Burpees for 3 minutes','Squats for 2 minutes','Strict pull-ups for 1 minute'],
    notes:['The organisation describes this as a proposed fitness standard, not a universal requirement for every police department.','The full instructions explain how each part is scored and how much rest is allowed.'],
    source:{label:'NTOA — Physical Fitness Qualification',url:'https://www.ntoa.org/pfq/',publisher:'National Tactical Officers Association'}
  },
  {
    id:'rasp',shortName:'RASP',name:'Ranger Assessment and Selection Program',
    subtitle:'Ranger selection fitness',country:'United States',countryCode:'US',flag:'🇺🇸',domain:'Armed forces',
    kind:'SELECTION TEST',category:['all','rucking','work','selection','running','strength','water'],scoring:'Pass / fail',reproducibility:'Published overview',status:'Official source',
    image:'rasp.webp',keywords:'RASP army ranger rucking 12-mile loaded walk',
    metric:{label:'12-mile ruck',detail:'35 lb dry pack · no time listed on current overview',icon:'ruck'},
    tags:['Rucking','Running','Selection'],
    overview:'The U.S. Army lists a 12-mile walk with a weighted pack as part of RASP. It is one part of a longer selection process, alongside running, swimming and other activities.',
    components:['12-mile ruck with a 35 lb dry pack','Five-mile run under 40 minutes','15 m swim in uniform','Other entry and selection activities'],
    notes:['The current public overview lists the distance and pack weight but does not publish a time limit for this ruck.','This page is a quick introduction, not a complete entry guide.'],
    source:{label:'U.S. Army — Army Rangers',url:'https://www.goarmy.com/careers-and-jobs/specialty-careers/special-ops/army-rangers',publisher:'U.S. Army'}
  },
  {
    id:'norwegian-armed-forces',shortName:'Norwegian Armed Forces',name:'Norwegian Armed Forces fitness tests',
    subtitle:'Fysiske tester i Forsvaret',country:'Norway',countryCode:'NO',flag:'🇳🇴',domain:'Armed forces',
    kind:'FITNESS TEST',category:['all','work','selection','strength','running'],scoring:'Graded',reproducibility:'Published instructions',status:'Official source',
    image:'norway.webp',keywords:'Norway Forsvaret running 3000 meter Norwegian physical fitness',
    metric:{label:'3,000 m run',detail:'See the official table for your test',icon:'run'},
    tags:['Running','Strength','General Fitness'],
    overview:'Forsvaret has several fitness tests for different stages and roles. The 3,000 m run is one familiar part, but there is no single time that applies to everyone.',
    components:['3,000 m run','Pull-ups','Standing long jump','Medicine-ball throw'],
    notes:['The required result depends on which test is being taken and the relevant official criteria.','Check the tables on the Forsvaret website rather than relying on a single number.'],
    source:{label:'Forsvaret — Fysiske tester',url:'https://www.forsvaret.no/krav/fysiske-tester-i-forsvaret',publisher:'Forsvaret'}
  },
  {
    id:'artillerijaeger',shortName:'Artillerijeger',name:'Artillerijeger fitness requirements',
    subtitle:'Norwegian Artillerijeger entry fitness',country:'Norway',countryCode:'NO',flag:'🇳🇴',domain:'Armed forces',
    kind:'SELECTION TEST',category:['all','rucking','work','selection','strength','running','water'],scoring:'Pass / fail',reproducibility:'Published requirements',status:'Official source',
    image:'artillerijaeger.webp',keywords:'artillerijeger artillerijæger Norway selection pack running',
    metric:{label:'8 km pack run',detail:'22 kg pack · 52 minutes',icon:'ruck'},
    tags:['Rucking','Strength','Running'],
    overview:'The Norwegian Artillerijeger entry page lists an 8 km run with a 22 kg pack, alongside running, strength and swimming tests. This is a Norwegian programme, not a Danish one.',
    components:['8 km pack run with 22 kg in 52 minutes','3,000 m run in 12 minutes 30 seconds','30 push-ups and 6 pull-ups','Medicine-ball throw and standing long jump','400 m swim'],
    notes:['These figures come from the role’s published entry page. Other admission stages may use different distances and requirements.','Check the latest role page before making an application or setting a training target.'],
    source:{label:'Forsvaret — Artillerijeger',url:'https://www.forsvaret.no/utdanning/utdanninger/artillerijeger',publisher:'Forsvaret'}
  },
  {
    id:'nsw-pct',shortName:'NSW Police PCT',name:'NSW Police Physical Capacity Test',
    subtitle:'Police candidate fitness test',country:'Australia',countryCode:'AU',flag:'🇦🇺',domain:'Police',
    kind:'POLICE ENTRY TEST',category:['all','work','selection','strength','running'],scoring:'Pass / fail',reproducibility:'Published requirements',status:'Official source',
    image:'nsw-police.webp',keywords:'new south wales police pct NSW Australia beep test',
    metric:{label:'Multi-stage fitness test',detail:'Level 7.1 required',icon:'run'},
    tags:['Running','Bodyweight','Agility'],
    overview:'New South Wales Police uses six fitness activities for applicants. The requirements include a multi-stage fitness test (often called a beep test), not the 2.4 km run shown in the design draft.',
    components:['30 kg handgrip in each hand','90-second prone bridge','30 cm vertical jump','25 push-ups','Illinois agility in 20 seconds or less','Multi-stage fitness test: level 7.1'],
    notes:['The NSW Police website also lists how many attempts are allowed for each activity.','Use the official instructions for the current application process.'],
    source:{label:'NSW Police Recruitment — Fitness',url:'https://www.police.nsw.gov.au/recruitment/application_process/fitness',publisher:'NSW Police Force'}
  },
  {
    id:'danish-police',shortName:'Danish Police',name:'Danish Police fitness admission test',
    subtitle:'Fysisk prøve til politiuddannelsen',country:'Denmark',countryCode:'DK',flag:'🇩🇰',domain:'Police',
    kind:'POLICE ENTRY TEST',category:['all','work','selection','strength','running'],scoring:'Pass / fail',reproducibility:'Published instructions',status:'Official source',
    image:'danish-police.webp',keywords:'Denmark Danish police physical entry fitness test politi',
    metric:{label:'2,400 m run',detail:'Time depends on the applicant criteria',icon:'run'},
    tags:['Running','Strength','Agility'],
    overview:'Danish Police uses a six-part fitness test for admission. There is a 2,400 m run, not the 3,000 m run shown in the design draft. The running time and other targets depend on the published criteria.',
    components:['Warm-up routine','Speed test','Standing long jump','Pull-ups','Bench press','2,400 m run'],
    notes:['Applicants need to pass all six parts of the test.','Danish Police publishes separate guidance for men and women; use the page that applies to you.'],
    source:{label:'Danish Police — Physical admission test',url:'https://politi.dk/politiskolen/adgangskrav-ansoegning-og-proeveforloeb/fysisk-proeve-for-maend',publisher:'Danish Police'},
    otherSources:[{label:'Guidance for women',url:'https://politi.dk/politiskolen/adgangskrav-ansoegning-og-proeveforloeb/fysisk-proeve-for-kvinder'}]
  }
]);
export const byId = Object.freeze(Object.fromEntries(assessments.map(a=>[a.id,a])));
export const countries = [...new Set(assessments.map(a=>a.country))].sort();
export const domains = [...new Set(assessments.map(a=>a.domain))].sort();
