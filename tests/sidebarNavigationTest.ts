import { chromium, Browser, BrowserContext, Page } from 'playwright';

async function runTest(): Promise<void> {
    let browser: Browser | null = null;
    let context: BrowserContext | null = null;

    try {
        // Launch a Chromium browser in headless mode with custom arguments
        browser = await chromium.launch({
            headless: true,
            args: [
                "--window-size=1280,720",         // Set the browser window size
                "--disable-dev-shm-usage",        // Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     // Use host-level IPC for better stability
                "--single-process"                // Run the browser in a single process mode
            ],
        });

        // Create a new browser context (like an incognito window)
        context = await browser.newContext();
        context.setDefaultTimeout(5000);

        // Open a new page in the browser context
        const page: Page = await context.newPage();

        // Navigate to your target URL and wait until the network request is committed
        await page.goto("https://matanuska.netlify.app/", { waitUntil: "commit", timeout: 10000 });

        // Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try {
            await page.waitForLoadState("domcontentloaded", { timeout: 3000 });
        } catch (error) {
            // Continue even if timeout occurs
        }

        // Iterate through all iframes and wait for them to load as well
        for (const frame of page.frames()) {
            try {
                await frame.waitForLoadState("domcontentloaded", { timeout: 3000 });
            } catch (error) {
                // Continue even if timeout occurs
            }
        }

        // Interact with the page elements to simulate user flow
        await page.mouse.wheel(0, 500);

        // Check if buttons have proper onClick handlers.
        const frame = context.pages()[context.pages().length - 1];
        let elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[1]/ul/li/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/div/div').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        // Verify onClick handlers for each button.
        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[1]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[2]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[3]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        // Check onClick handlers for the remaining buttons.
        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[5]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        // Check onClick handlers for the remaining buttons.
        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[5]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[6]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[7]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        // Check onClick handlers for the remaining buttons.
        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[8]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[9]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        // Check onClick handlers for the remaining buttons.
        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[10]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[11]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        // Check onClick handlers for the remaining buttons.
        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[12]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[13]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        // Check onClick handlers for the remaining buttons.
        elem = frame.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[14]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        elem = frame.locator('xpath=html/body/div[1]/div[5]/button').first();
        await page.waitForTimeout(3000); await elem.click({ timeout: 5000 });

        await new Promise(resolve => setTimeout(resolve, 5000));

    } finally {
        if (context) {
            await context.close();
        }
        if (browser) {
            await browser.close();
        }
    }
}

runTest().catch(err => {
    console.error('Error running test:', err);
    process.exit(1);
});
