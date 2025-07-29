import { test, expect } from '@playwright/test';

test.describe('Dashboard QR Scan Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://matanuska.netlify.app/', { waitUntil: 'domcontentloaded' });
  });

  test('Click sidebar toggle button', async ({ page }) => {
    // Wait for the sidebar to be visible
    await page.waitForSelector('aside', { state: 'visible', timeout: 10000 });

    // Use a more reliable selector
    const sidebarToggle = page.locator('aside nav button').first();
    await expect(sidebarToggle).toBeVisible();
    await sidebarToggle.click({ timeout: 5000 });
  });

  test('Click Scan QR on Dashboard', async ({ page }) => {
    // Wait for the dashboard to load
    await page.waitForSelector('main', { state: 'visible', timeout: 10000 });

    // Look for a button with text "Scan QR"
    const scanQR = page.locator('button:has-text("Scan QR")').first();
    await expect(scanQR).toBeVisible();
    await scanQR.scrollIntoViewIfNeeded();
    await scanQR.click({ timeout: 5000 });
  });

  test('Click QR Menu in Sidebar', async ({ page }) => {
    // Wait for the sidebar to be visible
    await page.waitForSelector('aside', { state: 'visible', timeout: 10000 });

    // Look for QR Scanner in the sidebar
    const qrSidebar = page.locator('aside button:has-text("QR Scanner")').first();
    if (await qrSidebar.count() === 0) {
      // Try alternative text
      const altQrSidebar = page.locator('aside button:has-text("QR")').first();
      await expect(altQrSidebar).toBeVisible();
      await altQrSidebar.scrollIntoViewIfNeeded();
      await altQrSidebar.click({ timeout: 5000 });
    } else {
      await expect(qrSidebar).toBeVisible();
      await qrSidebar.scrollIntoViewIfNeeded();
      await qrSidebar.click({ timeout: 5000 });
    }
  });

  test('Click QR Scan Button in Grid', async ({ page }) => {
    // Wait for the main content to load
    await page.waitForSelector('main', { state: 'visible', timeout: 10000 });

    // Look for a button with QR scan text in the main content
    const qrGridButton = page.locator('main button:has-text("QR Scan")').first();
    if (await qrGridButton.count() === 0) {
      // Try alternative text
      const altQrGridButton = page.locator('main button:has-text("Scan")').first();
      await expect(altQrGridButton).toBeVisible();
      await altQrGridButton.scrollIntoViewIfNeeded();
      await altQrGridButton.click({ timeout: 5000 });
    } else {
      await expect(qrGridButton).toBeVisible();
      await qrGridButton.scrollIntoViewIfNeeded();
      await qrGridButton.click({ timeout: 5000 });
    }
  });
});
