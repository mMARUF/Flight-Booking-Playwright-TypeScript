import { test, expect, Page } from '@playwright/test';

test.describe('Flight Search and Price Comparison on Firsttrip', () => {
  let page: Page;
  let usBanglaFlightPrices: string[] = [];

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://firsttrip.com/flight');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Search, filter, capture prices, modify, and compare flight prices', async () => {
 
 
    await page.getByTestId('departure-airport-input-form-1').click();
    await page.getByTestId('departure-airport-input-form-1').fill('Chattogram');
    await page.locator('div.cursor-pointer:has-text("Chattogram, Bangladesh")').click();// Select Chittagong from dropdown
    await page.waitForTimeout(3000);

 
    await page.getByTestId('destination-airport-input-form-1').click();
    await page.getByTestId('destination-airport-input-form-1').fill('Dhaka');
    await page.locator('div.cursor-pointer:has-text("Dhaka, Bangladesh")').click(); // Select Dhaka from dropdown
    await page.waitForTimeout(3000);

 
        await page.waitForTimeout(3000);
    await page.locator('button[data-testid="departure-date-input-form-1"]').click();
        await page.waitForTimeout(3000);
    await page.locator('.react-datepicker__month-container').first().waitFor(); // Wait for calendar to be visible


    for (let i = 0; i < 3; i++) {
        await page.locator('.react-datepicker__navigation--next').click();
        await page.waitForTimeout(200);  
    }

     await page.locator('.react-datepicker__day').nth(23).click(); 
    
    
     // Travelers: 2 Adults
    await page.getByTestId('select-traveller-input').click();
    await page.locator('[data-testid="adult-number-add-button"]').click();
 
    await page.getByTestId('Economy-class').click();


    // 3. Click Search
    await page.getByTestId('search-flight-button').click();
    await page.waitForLoadState('domcontentloaded');

    

    await page.locator('div[data-testid="airline-filter-list"] p', { hasText: 'US Bangla Airlines' }).click();
    await page.waitForLoadState('networkidle'); // Wait for filters to apply


 // Wait for at least one card to be present
await page.waitForSelector('[data-testid^="flight_card_"]');

// Find all cards
const cards = page.locator('[data-testid^="flight_card_"]');

// Click the "Select" button inside the last card
const lastCard = page.locator('[data-testid^="flight_card_"]').last();
// await lastCard.locator('[data-testid="select-button"]:visible').click();


// Wait for the new tab to open
const [newPage] = await Promise.all([
  page.context().waitForEvent('page'),
  lastCard.locator('[data-testid="select-button"]:visible').click(),
]);

await newPage.waitForLoadState();

// Use newPage for further actions
await newPage.waitForSelector('.text-2xl.font-extrabold.text-brand-8', { state: 'visible' });
const signInTitle = await newPage.locator('.text-2xl.font-extrabold.text-brand-8').textContent();
expect(signInTitle).toContain('Sign In');

 
  });
});
