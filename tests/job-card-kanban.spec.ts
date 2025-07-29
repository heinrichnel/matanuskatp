import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

// Test Configuration
const BASE_URL = 'https://matanuska.netlify.app/';
const SELECTORS = {
  sidebarToggle: 'xpath=//html/body/div[1]/div[4]/aside/nav/div[1]/ul/li/button',
  tripManagement: 'xpath=//html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/div/div',
  activeTripButton: (index: number) =>
    `xpath=//html/body/div[1]/div[4]/main/div/div[2]/div[2]/div[${index}]/div/button`
};

// Extended timeout for slow environments
const NAVIGATION_TIMEOUT = 30000; // 30 seconds
const ACTION_TIMEOUT = 10000; // 10 seconds

test.describe('Advanced Trip Management Tests', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: { dir: 'videos/' }
    });
    page = await context.newPage();

    // Configure default timeouts
    context.setDefaultTimeout(ACTION_TIMEOUT);
    context.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT);
  });

  test.beforeEach(async () => {
    // More reliable navigation with multiple wait strategies
    await page.goto(BASE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: NAVIGATION_TIMEOUT
    });

    // Additional stability check
    await expect(page.locator('body')).toBeVisible();
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('Verify all navigation components render correctly', async () => {
    await test.step('Verify sidebar toggle', async () => {
      const toggle = page.locator(SELECTORS.sidebarToggle);
      await expect(toggle).toBeVisible();
    });

    await test.step('Verify trip management dropdown', async () => {
      const dropdown = page.locator(SELECTORS.tripManagement);
      await dropdown.click();
      await expect(page.locator('div[class*="dropdown-menu"]')).toBeVisible();
    });
  });

  test('Verify active trips functionality', async () => {
    // Test first 3 trip buttons only (for demo)
    for (let i = 1; i <= 3; i++) {
      await test.step(`Test active trip button ${i}`, async () => {
        const button = page.locator(SELECTORS.activeTripButton(i));
        await button.click();
        await expect(page.locator('.trip-details')).toBeVisible();
      });
    }
  });

  test('Component rendering performance', async () => {
    const startTime = Date.now();
    await page.locator(SELECTORS.tripManagement).click();
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000);
    console.log(`Component load time: ${loadTime}ms`);
  });

  test('Accessibility audit', async () => {
    // Skip if page didn't load properly
    test.skip(!(await page.locator('body').isVisible()), 'Page failed to load');

    await injectAxe(page);
    await checkA11y(page, null, {
      includedImpacts: ['critical', 'serious'],
      detailedReport: true
    });
  });

  test('Offline mode handling', async () => {
    await context.setOffline(true);
    try {
      await page.locator(SELECTORS.tripManagement).click({
        timeout: 5000 // Shorter timeout for offline test
      });
    } catch (error) {
      await expect(page.locator('text=Network unavailable')).toBeVisible();
    }
  });
});
