import { Page } from '@playwright/test';

export class FlightSearchPage {
  static async FromSelection(page: Page, city: string, dropdownText: string) {
    await page.getByTestId('departure-airport-input-form-1').click();
    await page.getByTestId('departure-airport-input-form-1').fill(city);
    await page.locator(`div.cursor-pointer:has-text("${dropdownText}")`).click();
  }

  static async ToSelection(page: Page, city: string, dropdownText: string) {
    await page.getByTestId('destination-airport-input-form-1').click();
    await page.getByTestId('destination-airport-input-form-1').fill(city);
    await page.locator(`div.cursor-pointer:has-text("${dropdownText}")`).click();
  }

  static async DateoFDepartureSelection(page: Page, monthClicks: number, dayIndex: number) {
    await page.locator('button[data-testid="departure-date-input-form-1"]').click();
    await page.locator('.react-datepicker__month-container').first().waitFor();
    for (let i = 0; i < monthClicks; i++) {
      await page.locator('.react-datepicker__navigation--next').click();
      await page.waitForTimeout(200);
    }
    await page.locator('.react-datepicker__day').nth(dayIndex).click();
  }

  static async classAndTravellerSelection(page: Page, adults: number, travelClass: string) {
    await page.getByTestId('select-traveller-input').click();
    for (let i = 1; i < adults; i++) {
      await page.locator('[data-testid="adult-number-add-button"]').click();
    }
    await page.getByTestId(travelClass).click();
  }

  static async flightSearching(page: Page) {
    await page.getByTestId('search-flight-button').click();
    await page.waitForLoadState('domcontentloaded');
  }

  static async airLineFiltering(page: Page, airline: string) {
    await page.locator('div[data-testid="airline-filter-list"] p', { hasText: airline }).click();
    await page.waitForLoadState('networkidle');
  }

  static async waitForFlightsToLoad(page: Page) {
    await page.locator('[data-testid^="flight_card_"]').first().waitFor({ state: 'visible', timeout: 10000 });
  }

  static async PriceOfFlights(page: Page): Promise<number[]> {
    const cards = page.locator('[data-testid^="flight_card_"]');
    const prices: number[] = [];
    const cardCount = await cards.count();
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const priceText = await card.locator('.font-bold.text-brand-1').textContent();
      if (priceText) {
        const match = priceText.replace(/,/g, '').match(/(\d+)/);
        if (match) {
          prices.push(Number(match[1]));
        }
      }
    }
    return prices;
  }

  static async clickLastSelectButton(page: Page) {
    const lastCard = page.locator('[data-testid^="flight_card_"]').last();
    await lastCard.locator('[data-testid="select-button"]:visible').click();
  }
}