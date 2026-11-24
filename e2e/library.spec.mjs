import { test, expect } from '@playwright/test';
test('library loads, search and clear filters work',async({page})=>{
 await page.goto('/testing-library/');
 await expect(page.getByRole('heading',{name:'TESTING LIBRARY'})).toBeVisible();
 await expect(page.locator('.test-card')).toHaveCount(6);
 await page.getByRole('searchbox',{name:'Search tests, countries or activities'}).fill('beep');
 await expect(page.locator('.test-card')).toHaveCount(1);
 await expect(page.getByRole('heading',{name:'NSW Police PCT'})).toBeVisible();
 await page.getByRole('button',{name:'Clear filters'}).click();
 await expect(page.locator('.test-card')).toHaveCount(6);
});
test('categories, grid/list and comparison work',async({page})=>{
 await page.goto('/testing-library/');
 await page.getByRole('button',{name:'Running & Aerobic'}).click();
 await expect(page.locator('.test-card')).toHaveCount(6);
 await page.getByRole('button',{name:'List'}).click();
 await expect(page.locator('#card-grid')).toHaveClass(/list-view/);
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
 await expect(page.locator('.test-card')).toHaveCount(6);
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
 await expect(page.locator('.bibliography-item')).toHaveCount(6);
 await page.goto('/resources/');
 await page.getByRole('link',{name:/Rucking routes/}).first().click();
 await expect(page.getByRole('heading',{name:'Rucking routes'})).toBeVisible();
 const img=await page.request.get('/assets/glyph-ruck.png');
 expect(img.ok()).toBe(true);
 const flag=await page.request.get('/assets/flags/no.svg');
 expect(flag.ok()).toBe(true);
});
