import { test, expect } from '@playwright/test';
test('library loads, search and clear filters work',async({page})=>{
 await page.goto('/testing-library/');
 await expect(page.getByRole('heading',{name:'TESTING LIBRARY'})).toBeVisible();
 await expect(page.locator('.test-card')).toHaveCount(8);
 await page.getByRole('searchbox',{name:'Search tests, countries or activities'}).fill('beep');
 await expect(page.locator('.test-card')).toHaveCount(1);
 await expect(page.getByRole('heading',{name:'NSW Police PCT'})).toBeVisible();
 await page.getByRole('button',{name:'Clear filters'}).click();
 await expect(page.locator('.test-card')).toHaveCount(8);
});
test('categories, grid/list and comparison work',async({page})=>{
 await page.goto('/testing-library/');
 await page.getByRole('button',{name:'Running & Aerobic'}).click();
 await expect(page.locator('.test-card')).toHaveCount(8);
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
 await expect(page.getByText('8 km pack run',{exact:true})).toBeVisible();
 await expect(page.getByRole('link',{name:/Visit Forsvaret/})).toHaveAttribute('href',/forsvaret\.no/);
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
  await expect(page.locator('.test-card')).toHaveCount(8);
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
 await expect(page.locator('.bibliography-item')).toHaveCount(8);
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
 await page.goto('/training/workouts/');await expect(page.locator('.guide-card')).toHaveCount(41);
 await page.locator('#guide-search').fill('hill repeats');await expect(page.locator('.guide-card:visible')).toHaveCount(1);
 await page.getByRole('link',{name:'Open workout: Hill repeats'}).click();await expect(page.getByRole('heading',{name:'Hill repeats',level:1})).toBeVisible();
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

test('events are directly navigable and filter by country and format',async({page})=>{await page.setViewportSize({width:1440,height:900});await page.goto('/');await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Events',exact:true}).click();await expect(page).toHaveURL(/\/resources\/events\/$/);await page.locator('#event-country').selectOption('United Kingdom');await page.locator('#event-type').selectOption('Distance challenge');await expect(page.locator('.guide-card:visible')).toHaveCount(2);await expect(page.locator('.guide-card:visible').first().getByRole('link',{name:'Official organiser'})).toBeVisible();});
test('mobile menu Escape restores focus without navigation',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto('/');const toggle=page.locator('.mobile-toggle');await toggle.click();await expect(page.locator('#mobile-nav')).toBeVisible();await page.locator('#mobile-nav a').first().focus();await page.keyboard.press('Escape');await expect(page.locator('#mobile-nav')).toBeHidden();await expect(toggle).toBeFocused();});

test('route discovery distinguishes mapped profiles from templates',async({page})=>{await page.goto('/resources/routes/');await page.locator('#route-type').selectOption('Route profile');await expect(page.locator('.guide-card:visible')).toHaveCount(4);await expect(page.locator('.guide-card:visible').first().getByRole('link',{name:'Published map and elevation'})).toBeVisible();await page.locator('#route-type').selectOption('Route template');await expect(page.locator('.guide-card:visible')).toHaveCount(6);});
