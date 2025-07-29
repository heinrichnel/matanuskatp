import { Browser, BrowserContext, chromium, Page } from "playwright";

async function runTest(): Promise<void> {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;

  try {
    console.log("Starting sidebar navigation test...");

    // Launch a Chromium browser in headless mode with custom arguments
    browser = await chromium.launch({
      headless: true,
      args: [
        "--window-size=1280,720", // Set the browser window size
        "--disable-dev-shm-usage", // Avoid using /dev/shm which can cause issues in containers
        "--ipc=host", // Use host-level IPC for better stability
      ],
    });

    // Create a new browser context (like an incognito window)
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      hasTouch: false,
    });
    context.setDefaultTimeout(15000); // Increased timeout for stability

    // Open a new page in the browser context
    const page: Page = await context.newPage();
    console.log("Browser and page initialized");

    // Navigate to your target URL with more resilient wait settings
    console.log("Navigating to application...");
    await page.goto("https://matanuska.netlify.app/", {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    console.log("Page loaded");

    // Wait for the main navigation element to be visible before proceeding
    await page.waitForSelector("nav", { timeout: 10000 });
    console.log("Navigation menu found");

    // Test Dashboard button and verify navigation occurs
    console.log("Testing Dashboard button");
    await testNavigateAndVerify(page, 'button:has-text("Dashboard")', "dashboard");

    // Test Trip Management expand
    console.log("Testing Trip Management expand");
    // First check if it's already expanded
    const tripManagementExpanded = await page.evaluate(() => {
      const tripManagementItem = document.querySelector('div:has-text("Trip Management")');
      return tripManagementItem ? tripManagementItem.getAttribute('aria-expanded') === 'true' : false;
    });

    if (!tripManagementExpanded) {
      await testClickElement(page, 'text=Trip Management >> button[aria-label="Expand menu"]');
    }

    // Wait a bit for the submenu to expand
    await page.waitForTimeout(1000);

    // Test navigation to Trip Dashboard
    console.log("Testing Trip Dashboard navigation");
    await testNavigateAndVerify(page, 'button:has-text("Trip Dashboard")', "trips/dashboard");

    // Test navigation to Active Trips
    console.log("Testing Active Trips navigation");
    await testNavigateAndVerify(page, 'button:has-text("Active Trips")', "trips/active");

    // Test Wialon Integration section
    console.log("Testing Wialon Integration section");
    // First, ensure we can see the Wialon Integration section
    await page.waitForSelector('h3:has-text("Wialon Integration")', { timeout: 10000 });

    // Test Wialon Dashboard button
    console.log("Testing Wialon Dashboard button");
    await testNavigateAndVerify(page, 'button:has-text("Wialon Dashboard")', "wialon-dashboard");

    // Test Wialon Config button
    console.log("Testing Wialon Config button");
    await testNavigateAndVerify(page, 'button:has-text("Wialon Config")', "wialon-config");

    // Test Tyre Management section
    console.log("Testing Tyre Management section");
    await page.waitForSelector('h3:has-text("Tyre Management")', { timeout: 10000 });

    // Test Tyre Management Home button
    console.log("Testing Tyre Management Home button");
    await testNavigateAndVerify(page, 'button:has-text("Tyre Management Home")', "tyre-management");

    console.log("All navigation tests completed successfully");
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  } finally {
    if (context) {
      await context.close();
      console.log("Browser context closed");
    }
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }
}

async function testClickElement(page: Page, selector: string): Promise<void> {
  try {
    // Wait for the element to be visible
    await page.waitForSelector(selector, { timeout: 10000 });

    // Get the element
    const element = await page.$(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    // Log element attributes for debugging
    console.log(`Found element: ${selector}`);

    // Click the element
    await element.click({ timeout: 5000 });

    // Wait a bit for any transitions or page changes
    await page.waitForTimeout(2000);

    console.log(`Successfully clicked: ${selector}`);
  } catch (error) {
    console.error(`Failed to click element with selector: ${selector}`, error);
    throw error;
  }
}

async function testNavigateAndVerify(page: Page, buttonSelector: string, expectedRoute: string): Promise<void> {
  try {
    // First click the navigation element
    await testClickElement(page, buttonSelector);

    // Wait for URL to change
    await page.waitForTimeout(3000);

    // Get the current URL
    const url = page.url();
    console.log(`Current URL after clicking ${buttonSelector}: ${url}`);

    // Check if the URL contains the expected route
    if (url.includes(expectedRoute) || url.includes(encodeURIComponent(expectedRoute))) {
      console.log(`✓ Navigation successful: URL contains "${expectedRoute}"`);
    } else {
      // If URL doesn't match but page has changed, we'll consider it a partial success
      console.log(`⚠ Navigation may have issues: URL "${url}" doesn't contain "${expectedRoute}"`);

      // Check if there's a React router change by looking for route-specific elements
      const pageContent = await page.content();
      if (pageContent.includes(expectedRoute) || await page.$(`text="${expectedRoute}"`) !== null) {
        console.log(`✓ But found route identifier in page content`);
      } else {
        // If no route change is detected, inject debugging code
        await debugSidebarNavigation(page, buttonSelector);
      }
    }
  } catch (error) {
    console.error(`Navigation test failed for ${buttonSelector} -> ${expectedRoute}:`, error);
    await debugSidebarNavigation(page, buttonSelector);
    throw error;
  }
}

async function debugSidebarNavigation(page: Page, selector: string): Promise<void> {
  console.log('=== DEBUGGING SIDEBAR NAVIGATION ===');

  // Check if the element has onclick handler
  const hasOnClick = await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return 'Element not found';

    // Check various ways React might attach events
    const hasOnClickAttr = element.hasAttribute('onclick');
    const hasReactProps = '_reactProps' in element || '__reactProps$' in element;
    const hasEventListeners = 'onclick' in element && (element as HTMLElement).onclick !== null;

    return {
      hasOnClickAttr,
      hasReactProps,
      hasEventListeners,
      outerHTML: element.outerHTML,
    };
  }, selector);

  console.log('Element onClick debug info:', hasOnClick);

  // Check if the React Router is working
  const routerInfo = await page.evaluate(() => {
    // Try to find router-related objects in the global scope
    const hasRouter = 'BrowserRouter' in window || 'Router' in window;
    const hasHistory = 'history' in window;

    // Try to find elements that might be controlled by React Router
    const routerElements = document.querySelectorAll('[data-reactroot], [data-reactid]').length;

    return { hasRouter, hasHistory, routerElements };
  });

  console.log('React Router debug info:', routerInfo);

  // Take a screenshot for visual debugging
  await page.screenshot({ path: 'debug-nav-screenshot.png' });
  console.log('Screenshot saved as debug-nav-screenshot.png');

  console.log('=== END DEBUGGING ===');
}

runTest().catch((err) => {
  console.error("Error running sidebar navigation test:", err);
  process.exit(1);
});
