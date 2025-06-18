import { test, expect, Page } from '@playwright/test';
import { FlightSearchPage } from './pages/flight-search-page';

test.describe('Flight Booking Testing', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Comparing prices between 2 airlines', async () => {
    await FlightSearchPage.FromSelection(page, 'Chattogram', 'Chattogram, Bangladesh');
    await FlightSearchPage.ToSelection(page, 'Dhaka', 'Dhaka, Bangladesh');
    await FlightSearchPage.DateoFDepartureSelection(page, 3, 23);
    await FlightSearchPage.classAndTravellerSelection(page, 2, 'Economy-class');
    await FlightSearchPage.flightSearching(page);

    await FlightSearchPage.airLineFiltering(page, 'US Bangla Airlines');
    await FlightSearchPage.waitForFlightsToLoad(page);

    // Visiting new tab where the Sign In button will be visible
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      FlightSearchPage.clickLastSelectButton(page),
    ]);
    await newPage.waitForLoadState();
    await newPage.waitForSelector('.text-2xl.font-extrabold.text-brand-8', { state: 'visible' });
    const signInTitle = await newPage.locator('.text-2xl.font-extrabold.text-brand-8').textContent();
    expect(signInTitle).toContain('Sign In');
    await newPage.close();
    await page.bringToFront();

    // Save all the prices of US Bangla Airlines Flights
    await FlightSearchPage.waitForFlightsToLoad(page);
    const usBanglaPrices = await FlightSearchPage.PriceOfFlights(page);
    console.log('US-Bangla Airlines Flight Prices are->>>:', usBanglaPrices);

    // Unmark US-Bangla and select Novo Air
    await FlightSearchPage.airLineFiltering(page, 'US Bangla Airlines');
    await FlightSearchPage.airLineFiltering(page, 'Novo Air');
    await FlightSearchPage.waitForFlightsToLoad(page);

    // Save all the prices of Novo Airlines Flights
    const novoPrices = await FlightSearchPage.PriceOfFlights(page);
    console.log('Novo Air Flight Prices are ->>>:', novoPrices);

// Ticket price difference
const minLength = Math.min(usBanglaPrices.length, novoPrices.length);
let foundDifference = false;

for (let i = 0; i < minLength; i++) {
  const usBangla = usBanglaPrices[i];
  const novoAir = novoPrices[i];

  if (usBangla !== novoAir) {
    foundDifference = true;
    const difference = Math.abs(usBangla - novoAir);
    console.log(
      `Difference at flight ${i}: US Bangla Airlines  = ${usBangla}, Novo Airlines = ${novoAir} (price difference: ${difference})`
    );
    expect(usBangla).not.toBe(novoAir);
  } else {
    console.log(
      `No difference for this flight ${i}: both prices are ${usBangla}`
    );
  }
}

if (usBanglaPrices.length !== novoPrices.length) {
  console.log('Both ailines do not have same number of lights so cannot compare prices');
}

expect(foundDifference).toBe(true);
  });
});