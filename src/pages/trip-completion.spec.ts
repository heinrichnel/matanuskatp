import { test, expect } from "@playwright/test";

test.describe("Trip Completion → Invoice Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@matanuska.com");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button:has-text("Login")');
    await page.waitForURL("/dashboard");
  });

  test("Create trip → Complete trip → Verify invoice", async ({ page }) => {
    // Step 1: Navigate to trip creation
    await page.goto("/trips/create");
    await page.fill('input[name="origin"]', "Matanuska Depot");
    await page.fill('input[name="destination"]', "Johannesburg Market");
    await page.selectOption('select[name="driverId"]', { label: "Driver 1" });
    await page.fill('input[name="fleetNumber"]', "29H AGJ 3466");

    // Submit trip
    await page.click('button:has-text("Submit")');
    await expect(page.locator("text=Trip created successfully")).toBeVisible();

    // Step 2: Navigate to Active Trips
    await page.goto("/trips/active");
    const tripRow = page.locator("tr", { hasText: "29H AGJ 3466" });
    await expect(tripRow).toBeVisible();

    // Step 3: Complete the trip
    await tripRow.locator('button:has-text("Complete")').click();
    await page.locator('input[name="actualKm"]').fill("1200");
    await page.locator('input[name="actualDeliveryDate"]').fill("2025-07-28");
    await page.click('button:has-text("Submit Completion")');
    await expect(page.locator("text=Trip marked as completed")).toBeVisible();

    // Step 4: Check invoice is generated
    await page.goto("/invoices");
    const invoiceRow = page.locator("tr", { hasText: "29H AGJ 3466" });
    await expect(invoiceRow).toContainText("Generated");
  });
});
