import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';

// Test Configuration
const BASE_URL = 'https://matanuska.netlify.app/';
const SELECTORS = {
  // Navigation
  sidebarToggle: 'xpath=html/body/div[1]/div[4]/aside/nav/div[1]/ul/li/button',
  tripManagement: 'xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/div/div',
  loadPlanning: 'xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[13]/button',

  // Active Trips Section
  activeTrips: {
    container: 'xpath=html/body/div[1]/div[4]/main/div/div[2]/div[2]',
    buttons: [
      'div[1]/div/button',  // Trip 1
      'div[2]/div/button',  // Trip 2
      'div[3]/div/button',  // Trip 3
      'div[4]/div/button',  // Trip 4
      'div[5]/div/button',  // Trip 5
      'div[6]/div/button'   // Trip 6
    ]
  }
};

test.describe('Advanced Trip Management Tests', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: { dir: 'videos/' },
      permissions: ['geolocation'] // Example additional context
    });
    page = await context.newPage();
  });

  test.beforeEach(async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    await context.close();
  });

  // --- Core Test Cases ---
  test('Verify all navigation components render correctly', async () => {
    // Test sidebar toggle
    await test.step('Toggle sidebar', async () => {
      await page.locator(SELECTORS.sidebarToggle).click();
      await expect(page.locator('xpath=html/body/div[1]/div[4]/aside')).toHaveClass(/collapsed/);
    });

    // Test trip management dropdown
    await test.step('Open trip management', async () => {
      await page.locator(SELECTORS.tripManagement).click();
      await expect(page.locator(SELECTORS.loadPlanning)).toBeVisible();
    });

    // Test load planning component
    await test.step('Verify load planning', async () => {
      await page.locator(SELECTORS.loadPlanning).click();
      await expect(page.locator('text=Load Planning Dashboard')).toBeVisible({ timeout: 8000 });
    });
  });

  test('Verify active trips functionality', async () => {
    await page.locator(SELECTORS.tripManagement).click();

    // Test each trip button
    for (const [index, buttonPath] of SELECTORS.activeTrips.buttons.entries()) {
      await test.step(`Test trip button ${index + 1}`, async () => {
        const fullPath = `${SELECTORS.activeTrips.container}/${buttonPath}`;
        const button = page.locator(`xpath=${fullPath}`);

        // Visual validation before click
        await expect(button).toHaveScreenshot(`trip-button-${index+1}.png`);

        // Mock API response if needed
        await page.route('**/api/trips/*', route => route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: `trip-${index}` })
        }));

        await button.click();

        // Verify trip details appear
        await expect(page.locator('.trip-details-panel')).toBeVisible();
      });
    }
  });

  // --- Advanced Scenarios ---
  test('Component rendering performance', async () => {
    const startTime = Date.now();
    await page.locator(SELECTORS.tripManagement).click();
    await page.locator(SELECTORS.loadPlanning).click();
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000); // Should load in under 2s
    console.log(`Component load time: ${loadTime}ms`);
  });

  test('Accessibility audit', async () => {
    const { injectAxe, checkA11y } = require('axe-playwright');
    await injectAxe(page);
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });

  test('Offline mode handling', async () => {
    await context.setOffline(true);
    await page.locator(SELECTORS.tripManagement).click();
    await expect(page.locator('text=Network unavailable')).toBeVisible();
  });
});
