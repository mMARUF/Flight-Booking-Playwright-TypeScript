# Flight Booking Playwright TypeScript Automation

This project automates airline flight booking and price comparison scenarios on [firsttrip.com](https://firsttrip.com/flight) using [Playwright](https://playwright.dev/) with TypeScript.

## Features

- Automated flight search and booking flows
- Airline filtering and price extraction
- Price comparison between airlines (e.g., US-Bangla Airlines vs. Novo Air)
- Page Object Model for reusable selectors and actions
- CI-ready with GitHub Actions workflow
- Screenshots and video capture on test failures

## Project Structure

```
.
├── .github/workflows/node.js.yml      # GitHub Actions workflow for CI
├── package.json                       # Project dependencies
├── playwright.config.ts               # Playwright configuration (baseURL, reporter, etc.)
├── tests/
│   ├── pages/
│   │   └── flight-search-page.ts      # Page Object Model for flight search page
│   └── airlinePriceTest.spec.ts                   # Main Playwright test using the page object
```

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/mMARUF/Flight-Booking-Playwright-TypeScript.git
```

### 2. Run Tests Locally

```sh
npm install 
npm playwright install
```

### 3. Run Tests Locally

```sh
npx playwright test
```

- Tests run in headed mode by default (see `playwright.config.ts`).
- Videos and screenshots are saved on failure.

### 4. Run a Specific Test

```sh
npx playwright test tests/airlinePriceTest.spec.ts
```

### 5. View Test Reports

After running tests, open the HTML report:

```sh
npx playwright show-report
```

### 6. Continuous Integration

- Tests run automatically on push and pull request to the `main` branch via GitHub Actions.
- See `.github/workflows/node.js.yml` for details.

## Configuration

- **Base URL:** Set in `playwright.config.ts` as `https://firsttrip.com/flight`.
- **Browsers:** Chromium is enabled by default; others can be enabled in the config.
- **Artifacts:** Screenshots and videos are captured on test failures.

## Page Object Model

All reusable selectors and actions for the flight search page are defined in:

```
tests/pages/flight-search-page.ts
```

Use these methods in your tests for clean and maintainable code.


## License

[MIT](LICENSE)