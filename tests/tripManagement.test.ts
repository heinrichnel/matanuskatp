import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';

// Test Configuration
const BASE_URL = 'https://matanuska.netlify.app/';
const SELECTORS = {
  tripManagement: 'xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/div/div',
  activeTrips: 'xpath=html/body/div[1]/div[4]/main/div/div[2]/div[2]/div[1]/div/button',
  markCompleted: 'button:has-text("Mark as Completed")',
  confirmButton: 'button:has-text("Confirm")',
  successToast: 'text=Trip marked as completed',
  invoicePage: 'text=Trip ID',
  createTripButton: 'button:has-text("Add Trip")',
  fleetNumberInput: 'input[name="fleetNumber"]',
  routeInput: 'input[name="route"]',
  submitButton: 'button:has-text("Submit")',
  driverNameInput: 'input[name="driverName"]',
  originInput: 'input[name="origin"]',
  destinationInput: 'input[name="destination"]'
};

test.describe('Trip Management E2E Tests', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: { dir: 'videos/' }
    });
    page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  });

  test.afterAll(async () => {
    await context.close();
  });

  // --- Core Test Cases ---
  test('Complete a trip and verify invoice generation', async () => {
    // Navigate to Trip Management
    await page.locator(SELECTORS.tripManagement).click();
    await page.locator(SELECTORS.activeTrips).click();

    // Mock API response for completion
    await page.route('**/api/trips/*/complete', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    }));

    // Complete trip
    await page.locator(SELECTORS.markCompleted).first().click();
    await page.locator(SELECTORS.confirmButton).click();

    // Verify completion
    await expect(page.locator(SELECTORS.successToast)).toBeVisible();

    // Verify invoice generation (navigation + content check)
    await page.goto(`${BASE_URL}invoices`);
    await expect(page.locator(SELECTORS.invoicePage)).toBeVisible();
  });

  test('Trip creation form submission', async () => {
    await page.goto(`${BASE_URL}trips/create`);

    // Form interaction with validation
    const testData = {
      fleetNumber: '34H',
      driverName: 'Phillimon Kwarire',
      route: 'Harare to Johannesburg',
      origin: 'Harare',
      destination: 'Johannesburg'
    };

    await page.locator(SELECTORS.fleetNumberInput).fill(testData.fleetNumber);
    await page.locator(SELECTORS.driverNameInput).fill(testData.driverName);
    await page.locator(SELECTORS.routeInput).fill(testData.route);
    await page.locator(SELECTORS.originInput).fill(testData.origin);
    await page.locator(SELECTORS.destinationInput).fill(testData.destination);

    // Mock successful submission
    await page.route('**/api/trips', route => route.fulfill({
      status: 201,
      body: JSON.stringify({ id: 'trip-123' })
    }));

    await page.locator(SELECTORS.submitButton).click();
    await expect(page.locator('text=Trip successfully created')).toBeVisible();

    // Visual regression
    await expect(page).toHaveScreenshot('trip-created.png', { fullPage: true });
  });

  test('Verify new trip appears in list', async () => {
    await page.goto(`${BASE_URL}trips`);

    // Test data from previous test
    const testData = {
      fleetNumber: '29H - AGJ 3466',
      driverName: 'Phillimon Kwarire'
    };

    // Verify list updates (with retry logic for async updates)
    await expect(async () => {
      await page.reload();
      await expect(page.getByText(testData.driverName)).toBeVisible();
      await expect(page.getByText(testData.fleetNumber)).toBeVisible();
    }).toPass({ timeout: 10000 });
  });

  // --- Advanced Scenarios ---
  test('Form validation - Required fields', async () => {
    await page.goto(`${BASE_URL}trips/create`);
    await page.locator(SELECTORS.submitButton).click();

    await expect(page.locator('text=Fleet number is required')).toBeVisible();
    await expect(page.locator('text=Route is required')).toBeVisible();
  });

  test('Network offline handling', async () => {
    await page.goto(`${BASE_URL}trips/create`);
    await page.context().setOffline(true);
    await page.locator(SELECTORS.submitButton).click();
    await expect(page.locator('text=Network unavailable')).toBeVisible();
  });
});
