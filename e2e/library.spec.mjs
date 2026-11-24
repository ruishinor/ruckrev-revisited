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
 await page.setViewportSize({width:390,height:844});
 await page.goto('/testing-library/');
 await expect(page.locator('.test-card')).toHaveCount(8);
 await page.getByRole('button',{name:'Open menu'}).click();
 await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toBeVisible();
 await page.getByRole('button',{name:'Close menu'}).click();
 await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toBeHidden();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
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
 const filter='none';
 await expect(page.locator('.category-pill:not(.active) .icon-asset').first()).toHaveCSS('filter',filter);
 await expect(page.locator('.filter-control .icon-asset').first()).toHaveCSS('filter',filter);
 await expect(page.locator('.test-card .icon-asset').first()).toHaveCSS('filter',filter);
 await expect(page.locator('.category-pill.active svg.icon')).toHaveCSS('color','rgb(255, 255, 255)');
 await expect(page.locator('.filter-control > svg.icon').first()).toHaveCSS('color','rgb(139, 0, 0)');
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
 await page.goto('/training/workouts/');await expect(page.locator('.guide-card')).toHaveCount(22);
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
 await expect(icons.first()).toHaveCSS('color','rgb(139, 0, 0)');
 await expect(icons.first()).toHaveCSS('background-color','rgb(184, 193, 195)');
 await page.goto('/training/');
 expect(await page.locator('.resource-tile-icon [data-icon]').evaluateAll(els=>els.map(x=>x.dataset.icon))).toEqual(['plan','workout','target','barbell']);
 await expect(page.getByRole('button',{name:'Build the week'}).locator('svg.icon')).toHaveCSS('color','rgb(255, 255, 255)');
});
