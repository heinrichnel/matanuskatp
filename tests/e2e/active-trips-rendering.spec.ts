// tests/e2e/active-trips-rendering.spec.ts
import { test, expect } from '@playwright/test';

test.describe("TransportMat UI Navigation → Active Trips Rendering", () => {
  test("Should load dashboard and render Active Trips widgets", async ({ page }) => {
    await page.goto("https://matanuska.netlify.app/");

    // Wait for page to load
    await page.waitForLoadState("domcontentloaded");

    // Simuleer die navigasie deur die sidebar
    await page.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[1]/ul/li/button').click(); // Expand root nav
    await page.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/div/div').click(); // Expand trip management
    await page.locator('xpath=html/body/div[1]/div[4]/aside/nav/div[2]/ul/li[1]/ul/li[13]/button').click(); // Click "Active Trips"

    // Kontroleer of al 6 active trip widgets bestaan
    for (let i = 1; i <= 6; i++) {
      const cardButton = page.locator(`xpath=html/body/div[1]/div[4]/main/div/div[2]/div[2]/div[${i}]/div/button`);
      await expect(cardButton).toBeVisible();
      await cardButton.click(); // Jy kan ook `.hover()` gebruik indien dit opsioneel is
    }

    // Jy kan addisionele verwagtinge byvoeg as jy spesifieke gedrag verwag
    await page.waitForTimeout(1000);
  });
});
