// Event dates are organiser-published START dates, never inferred availability.
export function isIsoDate(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(value+'T00:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value;}
export function eventDateMatch(date,{from='',to='',dateStatus='all'}={}){
 const dated=isIsoDate(date);
 if(!['all','dated','undated'].includes(dateStatus)||from&&!isIsoDate(from)||to&&!isIsoDate(to)||from&&to&&from>to)return false;
 if(dateStatus==='dated'&&!dated||dateStatus==='undated'&&dated)return false;
 if(!dated)return !from&&!to;
 return (!from||date>=from)&&(!to||date<=to);
}
export function renderEventDateFilters(){return '<label>Date information <select id="event-date-status"><option value="all">All events</option><option value="dated">Published start date</option><option value="undated">Date to be confirmed</option></select></label><label>Starts on or after <input type="date" id="event-date-from"/></label><label>Starts on or before <input type="date" id="event-date-to"/></label><button class="button button-secondary" type="button" id="event-reset">Reset event filters</button>';}
export const eventDateExplanation='<p class="guide-meta">Date filters use published start dates, not the end of a multi-day event. Events without dates are excluded when a date range is set. Check the organiser before booking.</p><p id="event-filter-message" role="status" hidden></p>';
