const checked='2026-11-24';
const crew=(id,name,country,location,type,status,format,access,url,source=url)=>({id,name,country,location,type,status,format,access,url,source,checked});
// Active means a public organiser page advertises ongoing activity, not that a particular session has been confirmed.
export const crewDirectory=[
 crew('polaris','Polaris Rucking Crew','Norway','Oslo','Rucking','Active','Recurring weekly social rucks.','All experience levels; loaner equipment and free attendance advertised. Confirm route and access needs with organiser.','https://polarisruckingcrew.com/'),
 crew('munich','Munich Rucking Crew','Germany','Munich area','Rucking','Unconfirmed','Shared marches, training and endurance challenges.','Current schedule, joining and access details should be confirmed with crew.','https://munichruckingcrew.de/'),
 crew('ruck-city','Ruck City','United Kingdom','London','Rucking','Active','Fortnightly social rucks, as listed by YOMP.','Beginners welcome according to the network listing; confirm with organisers.','https://www.yomp.store/pages/find-your-local-rucking-club'),
 crew('ruck-republic','Ruck Republic','Singapore','Singapore','Rucking','Active','Community rucks with shared themes and causes.','No military background or high fitness requirement advertised. Check the session details.','https://theruckrepublic.com/'),
 crew('ruck-club-au','Ruck Club Australia','Australia','Perth area','Rucking','Active','Local social rucks with optional carried weight.','Free to join; no gear purchase or fitness test advertised. Check next date and access.','https://www.eyestar.com.au/ruck-club-australia'),
 crew('ruckthat','RuckThat','Canada','Toronto','Rucking','Unconfirmed','Urban hiking and rucking.','Public club site available; confirm next outing, pace, cost and access.','https://ruckthat.ca/'),
 crew('junto','Junto Ruck Club: South Denver Men','United States','South Denver area','Rucking','Active','Weekly Sunday ruck and social gathering; public November 2026 activity.','Group explicitly addresses men; check current joining requirements.','https://www.meetup.com/junto-ruck-club-south-denver-men/'),
 crew('outdoor-cape','Outdoor Cape Town','South Africa','Cape Town area','Walking and hiking','Active','Group hikes in the Western Cape and beyond.','Visitors welcome per organiser; membership, terrain and individual outing requirements vary.','https://outdoor.capetown/'),
 crew('meridian','Meridian Hiking Club','South Africa','Cape Town area','Walking and hiking','Active','Regular group hikes and outdoor outings.','Check joining process and outing difficulty directly.','https://www.meridian-hiking.org.za/'),
 crew('dnt-oslo','DNT Oslo og Omegn','Norway','Oslo region','Walking and hiking','Active','Organised outdoor trips and volunteer-led activities.','Check each trip for difficulty, registration, membership and access.','https://www.dnt.no/dnt-der-du-er/dnt-oslo-og-omegn/aktiviteter/vare-turledere/'),
 crew('ramblers-nd','Nottingham and Derby Walking Group','United Kingdom','Nottingham and Derby area','Walking and hiking','Active','Organised group walks with published walk-leader guidance.','Check current walk listing for length, joining and access.','https://ndwg.org.uk/walks/guidance_for_walk_leaders/'),
 crew('cape-province','Cape Province Mountain Club','South Africa','Cape Town area','Walking and hiking','Active','Small community mountain club with hiking and other outdoor activities.','Public membership invitation; check suitability, costs and access with club.','https://capeprovincemountainclub.com/')
];
export const directoryStatuses=['Active','Unconfirmed','Historical'];
export function directoryMatch(record,{query='',country='all',type='all',status='all'}={}){
 const terms=String(query).toLowerCase().trim().split(/\s+/).filter(Boolean);
 const haystack=[record.name,record.country,record.location,record.type,record.format,record.access].join(' ').toLowerCase();
 return terms.every(t=>haystack.includes(t))&&(country==='all'||country===record.country)&&(type==='all'||type===record.type)&&(status==='all'||status===record.status);
}
