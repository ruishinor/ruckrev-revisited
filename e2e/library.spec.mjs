import { test, expect } from '@playwright/test';
test('library loads, search and clear filters work',async({page})=>{
 await page.goto('/testing-library/');
 await expect(page.getByRole('heading',{name:'TESTING LIBRARY'})).toBeVisible();
 await expect(page.locator('.test-card')).toHaveCount(16);
 await page.getByRole('searchbox',{name:'Search tests, countries or activities'}).fill('beep');
 await expect(page.locator('.test-card')).toHaveCount(2);
 await expect(page.getByRole('heading',{name:'NSW Police PCT'})).toBeVisible();
 await page.getByRole('button',{name:'Clear filters'}).click();
 await expect(page.locator('.test-card')).toHaveCount(16);
});
test('categories, grid/list and comparison work',async({page})=>{
 await page.goto('/testing-library/');
 await page.getByRole('button',{name:'Running & Aerobic'}).click();
 await expect(page.locator('.test-card')).toHaveCount(16);
 await page.getByRole('button',{name:'List'}).click();
 await expect(page.locator('#card-grid')).toHaveClass(/list-view/);
 await expect(page.locator('#compare-tray')).toContainText('0 tests selected');
 for(const name of ['PFQ','RASP','Artillerijeger'])await page.getByRole('checkbox',{name:`Compare ${name}`,exact:true}).check();
 await page.getByRole('link',{name:/Compare 3 tests/}).click();
 await expect(page.getByRole('heading',{name:'Compare fitness tests'})).toBeVisible();
 await expect(page.locator('thead th')).toHaveCount(4);
});
test('source detail shows correct country and linked source',async({page})=>{
 await page.goto('/testing-library/artillerijaeger/');
 await expect(page.getByRole('heading',{name:'Artillerijeger'})).toBeVisible();
 await expect(page.locator('.activity-highlight').getByText('8 km pack run',{exact:true})).toBeVisible();
 await expect(page.getByRole('link',{name:'Visit Norwegian Armed Forces',exact:true})).toHaveAttribute('href','https://www.forsvaret.no/utdanning/utdanninger/artillerijeger');
});
test('mobile navigation, filters, cards and comparison are usable',async({page})=>{
 test.setTimeout(60000);
 const assertFits=async(label)=>{
  const dims=await page.evaluate(()=>{
   const panel=document.querySelector('.filters-panel');
   return {viewport:innerWidth,document:document.documentElement.scrollWidth,filterContent:panel?.scrollWidth??0,filterWidth:panel?.clientWidth??0};
  });
  expect(dims.document,`${label}: document width ${JSON.stringify(dims)}`).toBeLessThanOrEqual(dims.viewport);
  expect(dims.filterContent,`${label}: filter panel width ${JSON.stringify(dims)}`).toBeLessThanOrEqual(dims.filterWidth+1);
 };
 for(const width of [320,390,414,690]){
  await page.setViewportSize({width,height:844});
  await page.goto('/testing-library/');
  await expect(page.locator('.test-card')).toHaveCount(16);
  await page.getByRole('button',{name:'Open menu'}).click();
  await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toBeVisible();
  await page.getByRole('button',{name:'Close menu'}).click();
  await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toBeHidden();
  await assertFits(`${width}px initial`);
  for(const name of ['PFQ','RASP','Artillerijeger'])await page.getByRole('checkbox',{name:`Compare ${name}`,exact:true}).check();
  await expect(page.locator('.tray-item')).toHaveCount(3);
  await assertFits(`${width}px selected grid`);
  await page.getByRole('button',{name:'List',exact:true}).click();
  await assertFits(`${width}px selected list`);
  await page.getByRole('link',{name:'Compare 3 tests',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Compare fitness tests'})).toBeVisible();
  await expect(page.locator('thead th')).toHaveCount(4);
  await assertFits(`${width}px comparison page`);
 }
});
test('training hub has a working goal-based week builder and useful next steps',async({page})=>{
 await page.goto('/training/');
 await expect(page.getByRole('heading',{name:'Training',exact:true,level:1})).toBeVisible();
 await page.locator('#week-goal').selectOption('selection');
 await page.locator('#week-level').selectOption('regular');
 await page.getByRole('button',{name:/Build the week/}).click();
 await expect(page.locator('#week-result li')).toHaveCount(3);
 await expect(page.locator('#week-result')).toContainText('benchmark practice');
 await page.getByRole('link',{name:/Assessment prep/}).first().click();
 await expect(page.getByRole('heading',{name:'Assessment preparation'})).toBeVisible();
});
test('expanded sources, footer pages and upgraded image assets resolve',async({page})=>{
 await page.goto('/testing-library/ntoa-pfq/');
 await expect(page.locator('.apa-reference')).toContainText('National Tactical Officers Association');
 await page.getByRole('link',{name:'References',exact:true}).click();
 await expect(page.getByRole('heading',{name:'References'})).toBeVisible();
 await expect(page.locator('.bibliography-item')).toHaveCount(16);
 await page.goto('/resources/');
 await page.getByRole('link',{name:/Rucking routes/}).first().click();
 await expect(page.getByRole('heading',{name:'Rucking routes'})).toBeVisible();
 const img=await page.request.get('/assets/glyph-ruck.png');
 expect(img.ok()).toBe(true);
 const flag=await page.request.get('/assets/flags/no.svg');
 expect(flag.ok()).toBe(true);
});

test('library pictograms have consistent contrast treatment across controls',async({page})=>{
 await page.goto('/testing-library/');
 for(const selector of ['.category-pill:not(.active) svg.icon','.filter-control svg.icon','.test-card svg.icon']){const glyph=page.locator(selector).first();await expect(glyph).toHaveCSS('color','rgb(203, 96, 96)');await expect(glyph).toHaveCSS('background-color','rgba(0, 0, 0, 0)');await expect(glyph).toHaveAttribute('fill','none');}
 await expect(page.locator('.category-pill.active svg.icon')).toHaveCSS('color','rgb(255, 255, 255)');
 await expect(page.locator('.filter-control > svg.icon').first()).toHaveCSS('color','rgb(203, 96, 96)');
 await expect(page.locator('.tray-submit svg.icon')).toHaveCSS('color','rgb(255, 255, 255)');
});

test('selection starts empty, preserves keyboard focus and does not cover footer',async({page})=>{
 await page.goto('/testing-library/');
 await expect(page.locator('#compare-tray')).toContainText('0 tests selected');
 await expect(page.getByRole('button',{name:'Compare tests',exact:true})).toBeDisabled();
 const cat=page.getByRole('button',{name:'Running & Aerobic'});await cat.focus();await page.keyboard.press('Enter');await expect(cat).toBeFocused();
 for(const name of ['PFQ','RASP','Artillerijeger'])await page.getByRole('checkbox',{name:`Compare ${name}`,exact:true}).check();
 const fourth=page.getByRole('checkbox',{name:'Compare Danish Police',exact:true});await fourth.click();await expect(fourth).not.toBeChecked();
 await expect(page.locator('#notice-live')).toContainText('up to three');
 await expect(page.locator('#compare-tray')).toHaveCSS('position','relative');
 const positions=await page.evaluate(()=>({tray:document.querySelector('#compare-tray').getBoundingClientRect().bottom,footer:document.querySelector('footer').getBoundingClientRect().top}));expect(positions.tray).toBeLessThan(positions.footer);
 await expect(page.locator('.metric-row small').first()).toHaveCSS('white-space','normal');
 await page.getByRole('button',{name:'Remove PFQ'}).click();await expect(page.getByRole('checkbox',{name:'Compare PFQ',exact:true})).toBeFocused();
 await expect(page.getByRole('link',{name:'Compare 2 tests'})).toBeVisible();
});
test('catalogues, plan, pace and assessment gap tools work',async({page})=>{
 await page.goto('/training/workouts/');await expect(page.locator('.guide-card')).toHaveCount(45);
 await page.locator('#guide-search').fill('hill repeats');await expect(page.locator('.guide-card:visible h3')).toHaveText(['Hill repeats','Controlled uphill repeats']);
 await page.getByRole('link',{name:'Open workout: Hill repeats',exact:true}).click();await expect(page.getByRole('heading',{name:'Hill repeats',level:1})).toBeVisible();
 await page.goto('/resources/tools/');await page.locator('#pace-distance').fill('10');await page.locator('#pace-minutes').fill('90');await page.getByRole('button',{name:'Calculate pace'}).click();await expect(page.locator('#pace-output')).toContainText('9:00 min/km');
 await page.locator('#ruck-checklist input').first().check();await expect(page.locator('#check-result')).toContainText('1 of 5');
 await page.goto('/training/assessment-prep/');await page.locator('#gap-test').selectOption('army-aft');await expect(page.locator('#gap-source')).toHaveAttribute('href','/testing-library/army-aft/');
 await page.locator('#gap-unit').fill('seconds');await page.locator('#gap-actual').fill('600');await page.locator('#gap-target').fill('540');await page.getByRole('button',{name:'Compare results'}).click();await expect(page.locator('#gap-output')).toContainText('60 seconds');
 await page.goto('/training/ruck-plans/');await page.locator('#plan-days').selectOption('4');await page.getByRole('button',{name:'Build my week'}).click();await expect(page.locator('#plan-output li')).toHaveCount(4);
});
test('static pages expose content without JavaScript',async({browser})=>{
 const ctx=await browser.newContext({javaScriptEnabled:false});const page=await ctx.newPage();await page.goto('/resources/articles/why-shared-adversity-builds-teams/');await expect(page.getByRole('heading',{name:'Why shared adversity builds teams',level:1})).toBeVisible();await ctx.close();
});

test('training and resources use meaningful distinct glyphs and accessible exact brand red',async({page})=>{
 await page.goto('/resources/');
 const icons=page.locator('.resource-tile-icon [data-icon]');
 await expect(icons).toHaveCount(7);
 expect(await icons.evaluateAll(els=>els.map(x=>x.dataset.icon))).toEqual(['article','journal','route','calendar','book','people','toolbox']);
 await expect(icons.first()).toHaveCSS('color','rgb(203, 96, 96)');
 await expect(icons.first()).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
 await expect(icons.first()).toHaveAttribute('fill','none');
 await page.goto('/training/');
 expect(await page.locator('.resource-tile-icon [data-icon]').evaluateAll(els=>els.map(x=>x.dataset.icon))).toEqual(['plan','workout','target','barbell']);
 await expect(page.getByRole('button',{name:'Build the week'}).locator('svg.icon')).toHaveCSS('color','rgb(255, 255, 255)');
});


test('home uses the brand title, plain red hero, and actual Learn Train Lead destinations',async({page})=>{
 await page.goto('/');await expect(page).toHaveTitle('Rucking Revolution');
 const purpose=page.locator('.home-hero h1 em');await expect(purpose).toHaveCSS('color','rgb(139, 0, 0)');await expect(purpose).toHaveCSS('background-color','rgba(0, 0, 0, 0)');await expect(purpose).toHaveCSS('-webkit-text-stroke-width','0px');await expect(purpose).toHaveCSS('text-shadow','none');
 await expect(page.locator('.hero-fact')).toHaveCount(0);await expect(page.getByRole('heading',{name:'What is rucking?'})).toBeVisible();
 for(const [name,href] of [['Explore learn','/learn/'],['Explore train','/training/'],['Explore lead','/lead/']])await expect(page.getByRole('link',{name,exact:true})).toHaveAttribute('href',href);
 await expect(page.getByRole('link',{name:'Free guide: the first three rucks'})).toHaveAttribute('href','/learn/first-three-rucks/');
});
test('mobile home and core hubs fit narrow viewports; branded header remains visible while scrolling',async({page})=>{
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});
  for(const path of ['/','/learn/','/training/','/lead/','/resources/','/privacy/']){
   await page.goto(path);await expect(page.locator('main h1')).toBeVisible();
   const dims=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));expect(dims.document).toBeLessThanOrEqual(dims.viewport);
   await page.evaluate(()=>window.scrollTo(0,Math.min(600,document.body.scrollHeight-innerHeight)));await expect.poll(()=>page.locator('.site-header').evaluate(el=>Math.round(el.getBoundingClientRect().top))).toBe(0);await expect(page.getByRole('link',{name:'Rucking Revolution home'})).toBeVisible();
  }
 }
});
test('target-date progression and assessment-specific preparation work',async({page})=>{
 await page.goto('/training/ruck-plans/');const date=new Date();date.setDate(date.getDate()+42);const target=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
 await page.locator('#block-date').fill(target);await page.getByRole('button',{name:'Build training block'}).click();await expect(page.locator('#block-output')).toContainText('6 full weeks');await expect(page.locator('#block-output .progression-weeks section')).toHaveCount(6);
 await page.goto('/training/assessment-prep/');await page.locator('#prep-test').selectOption('artillerijaeger');await expect(page.locator('#prep-output')).toContainText('22 kg');await expect(page.locator('#prep-output a')).toHaveAttribute('href','/testing-library/artillerijaeger/');
});
test('published route profiles and legal rights pages expose their actual sources',async({page})=>{
 await page.goto('/resources/routes/sognsvann-loop/');await expect(page.getByRole('heading',{name:'Sognsvann lakeside loop',level:1})).toBeVisible();await expect(page.getByRole('link',{name:'Published route, map and elevation profile'})).toHaveAttribute('href','https://ut.no/turforslag/115076');
 await page.goto('/privacy/');await expect(page.locator('#privacy-rights')).toContainText('Request erasure');await expect(page.locator('#article-17')).toContainText('does not remove browser history');
 await page.locator('#privacy-link').fill(new URL('/testing-library/?country=Norway&compare=rasp',page.url()).href);const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download browser choices'}).click();expect((await download).suggestedFilename()).toBe('rucking-revolution-browser-choices.json');
});

test('workout filters combine purpose, equipment and estimated duration',async({page})=>{await page.goto('/training/workouts/');await page.locator('#guide-purpose').selectOption('Strength');await page.locator('#guide-equipment').selectOption('Sandbag');await page.locator('#guide-duration').selectOption('30');const items=page.locator('.guide-card:visible');expect(await items.count()).toBeGreaterThan(0);for(const item of await items.all()){await expect(item).toHaveAttribute('data-purpose','Strength');expect((await item.getAttribute('data-equipment')).split('|')).toContain('Sandbag');expect(Number(await item.getAttribute('data-minutes'))).toBeLessThanOrEqual(30);} });

 test('assessment photos are distinct and comparisons do not repeat them',async({page})=>{await page.goto('/testing-library/');const photos=await page.locator('.card-photo').evaluateAll(els=>els.map(el=>getComputedStyle(el).getPropertyValue('--card-photo').trim()).filter(Boolean));expect(photos.length).toBe(4);expect(new Set(photos).size).toBe(photos.length);await page.goto('/testing-library/compare/?ids=ntoa-pfq,rasp,army-aft');await expect(page.locator('.compare-table thead img:not(.flag)')).toHaveCount(0);await page.goto('/training/workouts/hill-repeats/');await expect(page.locator('.guide-entry-image')).toHaveAttribute('src','/assets/workout-hill-repeats.webp');});

test('field notes distinguish original accounts from practice cases and export a local review',async({page})=>{
 await page.goto('/resources/field-notes/');await page.locator('#field-type').selectOption('report');await expect(page.locator('.guide-card:visible')).toHaveCount(3);await page.locator('#field-type').selectOption('case');await expect(page.locator('.guide-card:visible')).toHaveCount(8);
 await page.locator('#field-type').selectOption('all');for(const el of await page.locator('#field-review-form textarea').all())await el.fill('Review test');const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download field review'}).click();expect((await download).suggestedFilename()).toBe('ruck-field-review.txt');
 await page.goto('/resources/field-notes/dublin-heavy-2015/');await expect(page.locator('.field-narrative')).toContainText('Check your ego');await expect(page.getByRole('heading',{name:'Practical takeaways'})).toBeVisible();
});
test('navigation hover, transparent visible icons and darker primary buttons',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/');const nav=page.locator('.nav-desktop .nav-link').first();await nav.hover();await expect(nav).toHaveCSS('color','rgb(225, 132, 132)');const cta=page.locator('.home-hero .button-primary');await expect(cta).toHaveCSS('background-color','rgb(111, 0, 0)');await cta.hover();await expect(cta).toHaveCSS('background-color','rgb(139, 0, 0)');await expect(cta.locator('svg.icon')).toHaveCSS('color','rgb(255, 255, 255)');
 await page.goto('/training/strength/squat/');await expect(page.locator('.guide-entry-image')).toHaveAttribute('src','/assets/exercise-squat.webp');await expect(page.locator('.guide-entry-image')).toHaveAttribute('alt',/squat/);
 await page.goto('/training/strength/pull-up/');await expect(page.locator('.guide-entry-image')).toHaveCount(0);
});

test('crew leadership practice filters and exports a distinct plan',async({page})=>{
 await page.goto('/resources/ruck-clubs/');await expect(page.locator('.guide-card')).toHaveCount(5);
 await page.locator('#drill-focus').selectOption('Communication');await page.locator('#drill-level').selectOption('Foundation');await page.locator('#drill-count').selectOption('3');
 await expect(page.locator('#drill-download')).toBeDisabled();await page.getByRole('button',{name:'Draw exercises'}).click();await expect(page.locator('#drill-output h3')).toHaveCount(2);await expect(page.locator('#drill-output')).toContainText('all matching exercises');
 const dl=page.waitForEvent('download');await page.getByRole('button',{name:'Download practice plan'}).click();expect((await dl).suggestedFilename()).toBe('ruck-crew-practice.txt');
 await page.goto('/resources/ruck-clubs/start-a-crew/');await expect(page.getByRole('heading',{name:'From first ruck to regular crew',level:1})).toBeVisible();
});

test('events are directly navigable and filter by country and format',async({page})=>{await page.setViewportSize({width:1440,height:900});await page.goto('/');await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Events',exact:true}).click();await expect(page).toHaveURL(/\/resources\/events\/$/);await page.locator('#event-country').selectOption('United Kingdom');await expect(page.locator('.guide-card:visible')).toHaveCount(6);await page.locator('#event-type').selectOption('Distance challenge');await expect(page.locator('.guide-card:visible')).toHaveCount(2);await expect(page.locator('.guide-card:visible').first().getByRole('link',{name:'Official organiser'})).toBeVisible();});
test('mobile menu Escape restores focus without navigation',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto('/');const toggle=page.locator('.mobile-toggle');await toggle.click();await expect(page.locator('#mobile-nav')).toBeVisible();await page.locator('#mobile-nav a').first().focus();await page.keyboard.press('Escape');await expect(page.locator('#mobile-nav')).toBeHidden();await expect(toggle).toBeFocused();});

test('route discovery distinguishes mapped profiles from templates',async({page})=>{await page.goto('/resources/routes/');await page.locator('#route-type').selectOption('Route profile');await expect(page.locator('.guide-card:visible')).toHaveCount(6);await expect(page.locator('.guide-card:visible').first().getByRole('link',{name:'Published map and elevation'})).toBeVisible();await page.locator('#route-type').selectOption('Route template');await expect(page.locator('.guide-card:visible')).toHaveCount(6);});

test('local GPX viewer preserves segments, rejects malformed input and clears the route',async({page})=>{
 await page.goto('/resources/routes/');
 const input=page.locator('#gpx-file');
 const fixture='<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1"><trk><trkseg><trkpt lat="59.9" lon="10.7"><ele>10</ele></trkpt><trkpt lat="59.901" lon="10.7"><ele>20</ele></trkpt></trkseg><trkseg><trkpt lat="59.95" lon="10.8"><ele>100</ele></trkpt><trkpt lat="59.951" lon="10.8"><ele>97</ele></trkpt></trkseg></trk></gpx>';
 await input.setInputFiles({name:'test.gpx',mimeType:'application/gpx+xml',buffer:Buffer.from(fixture)});
 await expect(page.locator('#gpx-status')).toContainText('0.22 km');await expect(page.locator('#gpx-map polyline')).toHaveCount(2);await expect(page.locator('#gpx-elevation-note')).toContainText('ascent 10 m');
 await page.getByRole('button',{name:'Zoom in',exact:true}).click();await expect(page.locator('#gpx-map')).not.toHaveAttribute('viewBox','0 0 640 360');await page.getByRole('button',{name:'Fit route'}).click();await expect(page.locator('#gpx-map')).toHaveAttribute('viewBox','0 0 640 360');
 await page.getByRole('button',{name:'Clear file'}).click();await expect(page.locator('#gpx-results')).toBeHidden();await expect(input).toBeFocused();
 await input.setInputFiles({name:'bad.gpx',mimeType:'application/gpx+xml',buffer:Buffer.from('<gpx><trk>')});await expect(page.locator('#gpx-status')).toContainText('Invalid GPX document');await expect(page.locator('#gpx-results')).toBeHidden();
});
test('local native form submissions are blocked without JavaScript and worksheet downloads work',async({browser,page})=>{
 const response=await page.goto('/resources/tools/');expect(response.headers()['content-security-policy']).toContain("form-action 'none'");expect(response.headers()['referrer-policy']).toBe('no-referrer');
 const download=page.waitForEvent('download');await page.getByRole('link',{name:'Route brief (.txt)',exact:true}).click();expect((await download).suggestedFilename()).toBe('route-brief.txt');
 const ctx=await browser.newContext({javaScriptEnabled:false});try{const nojs=await ctx.newPage();await nojs.goto(new URL('/resources/tools/',page.url()).href);const initial=nojs.url();let submissions=0;nojs.on('request',r=>{if(r.isNavigationRequest())submissions++;});await nojs.locator('#log-form input[name=date]').fill('2026-11-24');await nojs.locator('#log-form input[name=distance]').fill('5');await nojs.locator('#log-form input[name=load]').fill('10');await nojs.locator('#log-form input[name=minutes]').fill('60');await nojs.locator('#log-form textarea[name=notes]').fill('private-test-input');await nojs.getByRole('button',{name:'Download session CSV'}).click({noWaitAfter:true});await nojs.waitForTimeout(250);expect(nojs.url()).toBe(initial);expect(submissions).toBe(0);}finally{await ctx.close();}
});

// Deliberately hold the entry module while the visitor uses the exported HTML.
test('early event filter input survives delayed application startup',async({page})=>{
 let release;const gate=new Promise(resolve=>{release=resolve;});
 await page.route('**/src/app.mjs',async route=>{await gate;await route.continue();});
 try{
  await page.goto('/resources/events/',{waitUntil:'commit'});
  const country=page.locator('#event-country');
  await country.selectOption('United Kingdom');
  await expect(country).toHaveValue('United Kingdom');
  release();
  await expect(page.locator('#guide-count')).toHaveText('6 results');
  await expect(country).toHaveValue('United Kingdom');
  await page.locator('#event-type').selectOption('Distance challenge');
  await expect(page.locator('.guide-card:visible')).toHaveCount(2);
  await expect(page.locator('.guide-card:visible h3')).toHaveText(['Jurassic Coast Ultra Challenge','London to Brighton Ultra Challenge']);
 }finally{release();}
});

test('early library controls survive startup and clearing cannot restore a stale query',async({page})=>{
 let release;const gate=new Promise(resolve=>{release=resolve;});
 await page.route('**/src/app.mjs',async route=>{await gate;await route.continue();});
 try{
  await page.goto('/testing-library/?sort=name#library-search',{waitUntil:'commit'});
  await page.locator('#test-search').fill('beep');
  await page.locator('#filter-country').selectOption('Australia');
  await page.getByRole('checkbox',{name:'Compare RASP',exact:true}).check();
  release();
  await expect(page.locator('#result-count')).toHaveText('1 test');
  await expect(page.locator('#test-search')).toHaveValue('beep');
  await expect(page.locator('#filter-country')).toHaveValue('Australia');
  await expect(page.locator('#filter-sort')).toHaveValue('name');
  await expect(page.locator('#compare-tray')).toContainText('RASP');
  await expect(page).toHaveURL(/#library-search$/);
  await page.locator('#test-search').fill('nonexistent');
  await page.getByRole('button',{name:'Clear filters',exact:true}).click();
  await expect(page.locator('#test-search')).toHaveValue('');
  await expect(page.locator('.test-card')).toHaveCount(16);
  await page.waitForTimeout(250);
  await expect(page.locator('.test-card')).toHaveCount(16);
  await expect(page.locator('#compare-tray')).toContainText('1 test selected');
 }finally{release();}
});

test('comparison link clipboard success and denial are reported accessibly',async({page})=>{
 await page.addInitScript(()=>{
  window.__copied='';window.__denyCopy=false;
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{async writeText(value){await Promise.resolve();if(window.__denyCopy)throw Error('Denied');window.__copied=value;}}});
 });
 await page.goto('/testing-library/compare/?ids=rasp,ntoa-pfq');
 const button=page.getByRole('button',{name:'Copy a link',exact:true});
 await button.click();await expect(page.locator('#copy-compare-status')).toHaveText('Link copied');
 expect(await page.evaluate(()=>window.__copied)).toBe(page.url());
 await page.evaluate(()=>{window.__denyCopy=true;});
 await button.click();await expect(page.locator('#copy-compare-status')).toHaveText('Copy the address from your browser.');
 await expect(button).toBeFocused();
});

 test('assessment standards and consistent metric vectors are visible',async({page})=>{
 await page.goto('/testing-library/');
 await expect(page.locator('.test-card[data-id="danish-police"] .metric-row')).toContainText('12:00');
 await expect(page.locator('.test-card[data-id="nsw-pct"] .metric-row svg[data-icon="shuttle"]')).toBeVisible();
 await expect(page.locator('.test-card[data-id="uk-police-jrft"] .metric-row svg[data-icon="shuttle"]')).toBeVisible();
 for(const id of ['ntoa-pfq','rasp','norwegian-armed-forces','artillerijaeger','nsw-pct','danish-police','army-aft','uk-police-jrft']){
  await page.goto('/testing-library/'+id+'/');
  await expect(page.getByRole('heading',{name:'Test protocol and standards'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'How to prepare'})).toBeVisible();
  await expect(page.locator('.assessment-table tbody tr').first()).toBeVisible();
 }
 });

test('Tabler icon geometry, palette and accessibility are consistent',async({page})=>{
 await page.goto('/testing-library/');
 const run=page.locator('.test-card[data-id="danish-police"] .metric-row svg[data-icon="run"]');
 await expect(run).toBeVisible();
 await expect(run).toHaveAttribute('focusable','false');
 await expect(run).toHaveAttribute('aria-hidden','true');
 await expect(run.locator('path')).toHaveCount(4);
 await expect(run.locator('path').first()).toHaveAttribute('d','M12 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0');
 await expect(run).toHaveCSS('color','rgb(203, 96, 96)');
 await expect(run).toHaveCSS('stroke-width','2px');
 await page.goto('/testing-library/artillerijaeger/');
 await expect(page.locator('.activity-highlight svg[data-icon="ruck"]')).toHaveCSS('color','rgb(203, 96, 96)');
});

test('event discovery uses inclusive start-date ranges, unknown dates and reset',async({page})=>{
 await page.goto('/resources/events/');
 await page.locator('#event-date-from').fill('2027-05-01');await page.locator('#event-date-to').fill('2027-05-31');
 await expect(page.locator('.guide-card:visible')).toHaveCount(4);
 await page.locator('#event-country').selectOption('United Kingdom');await expect(page.locator('.guide-card:visible')).toHaveCount(2);
 await page.locator('#event-date-to').fill('2027-04-30');await expect(page.locator('.guide-card:visible')).toHaveCount(0);await expect(page.locator('#event-filter-message')).toContainText('Start date');
 await page.getByRole('button',{name:'Reset event filters'}).click();await expect(page.locator('.guide-card:visible')).toHaveCount(37);
 await page.locator('#event-date-status').selectOption('undated');await expect(page.locator('.guide-card:visible')).toHaveCount(17);await expect(page.locator('.guide-card:visible').filter({hasText:'Fan Dance'})).toHaveCount(1);
});
test('GPX route navigation works with native buttons and does not send the file or request external resources',async({page})=>{
 const external=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:')&&!r.url().startsWith('http://localhost:')&&!r.url().startsWith('data:'))external.push(r.url());});
 await page.goto('/resources/routes/');
 const input=page.locator('#gpx-file');const fixture='<gpx><trk><trkseg><trkpt lat="59.9" lon="10.7"/><trkpt lat="59.901" lon="10.71"/></trkseg></trk></gpx>';
 await input.setInputFiles({name:'private-test.gpx',mimeType:'application/gpx+xml',buffer:Buffer.from(fixture)});
 const map=page.locator('#gpx-map'),east=page.getByRole('button',{name:'Pan east'});
 await expect(map).toBeVisible();await expect(east).toBeDisabled();await expect(map.locator('circle.gpx-start')).toHaveCount(1);await expect(map.locator('rect.gpx-finish')).toHaveCount(1);
 await page.getByRole('button',{name:'Zoom in',exact:true}).click();await expect(east).toBeEnabled();const before=await map.getAttribute('viewBox');
 await east.focus();await page.keyboard.press('Enter');await expect(map).not.toHaveAttribute('viewBox',before);await expect(east).toBeFocused();
 await page.getByRole('button',{name:'Fit route'}).click();await expect(map).toHaveAttribute('viewBox','0 0 640 360');await expect(east).toBeDisabled();
 await page.getByRole('button',{name:'Clear file'}).click();await expect(input).toBeFocused();await expect(map).toBeHidden();expect(external).toEqual([]);
});

test('NSW activity instructions are keyboard accessible and specific to the test',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto('/testing-library/nsw-pct/');const summary=page.locator('.component-protocol summary').filter({hasText:'Illinois agility course'});await expect(summary).toHaveCount(1);await summary.focus();await page.keyboard.press('Enter');await expect(page.locator('.component-protocol[open]').getByText('Setup',{exact:true})).toBeVisible();await expect(page.locator('.component-protocol[open]')).toContainText('9.14 m long × 4.6 m wide');await page.keyboard.press('Space');await expect(page.locator('.component-protocol[open]')).toHaveCount(0);});
test('international events can be discovered by country',async({page})=>{await page.goto('/resources/events/');await page.locator('#event-country').selectOption('Japan');await expect(page.locator('.guide-card:visible')).toHaveCount(1);await expect(page.locator('.guide-card:visible')).toContainText('Kyushu');await page.locator('#event-country').selectOption('South Korea');await expect(page.locator('.guide-card:visible')).toHaveCount(1);});

test('international assessment diagrams have accessible names and fit mobile width',async({page})=>{await page.setViewportSize({width:320,height:844});await page.goto('/testing-library/foreign-legion/');const diagram=page.getByRole('img',{name:/Luc Léger/});await expect(diagram).toBeVisible();await expect(page.getByRole('heading',{name:'How to run the beep test'})).toBeVisible();await expect(page.locator('.course-diagram')).toContainText('20 metres');const dimensions=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth}));expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport);await page.goto('/testing-library/nsw-pct/');await page.locator('.component-protocol summary').filter({hasText:'Illinois agility course'}).click();await expect(page.getByRole('img',{name:'NSW Police Illinois agility test'})).toBeVisible();});
test('adventure directory separates unconfirmed leads and includes archive references',async({page})=>{await page.goto('/resources/events/');await expect(page.getByRole('heading',{name:'Unconfirmed adventures and event leads'})).toBeVisible();await expect(page.locator('.guide-card').filter({hasText:'Odesa 100 km'})).toHaveCount(0);await page.locator('#event-country').selectOption('Denmark');await expect(page.locator('.guide-card:visible').filter({hasText:'Road to Valhalla'})).toHaveCount(1);await page.goto('/resources/events/road-to-valhalla/');await expect(page.getByRole('heading',{name:'Reference and archive'})).toBeVisible();await expect(page.getByRole('link',{name:'Search Wayback Machine captures'})).toHaveAttribute('href','https://web.archive.org/web/*/https://mjoelnertrail.dk/');await expect(page.getByText('capture availability has not been verified.',{exact:false})).toBeVisible();});


test('adventure facets match a single option and reset without affecting archive sections',async({page})=>{await page.goto('/resources/events/');await page.locator('#event-country').selectOption('New Zealand');await page.locator('#event-facet-participation').selectOption('team');await page.locator('#event-facet-days').selectOption('one');await expect(page.locator('.guide-card:visible')).toHaveCount(0);await page.locator('#event-facet-days').selectOption('few');await expect(page.locator('.guide-card:visible')).toHaveCount(1);await expect(page.locator('.guide-card:visible')).toContainText('Coast to Coast');await page.getByRole('button',{name:'Reset event filters'}).click();await expect(page.locator('.guide-card:visible')).toHaveCount(37);await expect(page.locator('#event-facet-participation')).toHaveValue('all');await page.goto('/resources/events/mds-legendary/');await expect(page.getByRole('heading',{name:'Participant experiences and discussions'})).toBeVisible();await expect(page.locator('a[href="https://web.archive.org/web/*/https://www.reddit.com/r/ultrarunning/comments/13y1huf/"]')).toBeVisible();});


test('resource totals and original training plans are visible',async({page})=>{await page.goto('/resources/');await expect(page.getByRole('link',{name:/Events & challenges \(37\)/})).toBeVisible();await page.goto('/training/ruck-plans/');await expect(page.getByRole('heading',{name:'Training plans (4)'})).toBeVisible();await page.getByRole('link',{name:'Your first 12 weeks of rucking'}).click();await expect(page.getByRole('heading',{name:'Week by week'})).toBeVisible();await page.goto('/resources/events/');await expect(page.locator('#guide-count')).toHaveText('37 results');await expect(page.getByText('(37 total)',{exact:true})).toBeVisible();await page.locator('#event-country').selectOption('United Kingdom');await expect(page.locator('#guide-count')).toHaveText('6 results');await expect(page.getByText('(37 total)',{exact:true})).toBeVisible();await page.goto('/testing-library/');await expect(page.getByText('(16 total)',{exact:true})).toBeVisible();});
