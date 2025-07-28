// tests/e2e/trip-completion.spec.ts
import { test, expect } from '@playwright/test';

test('Complete a trip and verify invoice generation trigger', async ({ page }) => {
  await page.goto('/trips');

  // Filter or select a trip
  await page.click('text=Active Trips');
  await page.click('button:has-text("Mark as Completed")');

  // Confirm dialog (if any)
  await page.click('button:has-text("Confirm")');

  // Wait for success toast or change
  await expect(page.locator('text=Trip marked as completed')).toBeVisible();

  // Navigate to invoice
  await page.goto('/invoices');
  await expect(page.locator('text=Trip ID')).toBeVisible(); // Or similar identifier
});

test("Trip Creation Form – Submit button triggers submission", async ({ page }) => {
  await page.goto("/trips/create");

  // ✅ Wait for the form to be ready
  const fleetNumberInput = page.locator('input[name="fleetNumber"]');
  await fleetNumberInput.waitFor(); // <-- Ensures input is visible before interaction
  await fleetNumberInput.fill("34H");

  await page.fill('input[name="route"]', "Harare to Johannesburg");

  const submitBtn = page.locator('button:has-text("Submit")');
  await expect(submitBtn).toBeVisible();
  await submitBtn.click();

  // ✅ Confirmation
  await expect(page.locator("text=Trip successfully created")).toBeVisible();

  await page.screenshot({ path: "trip-created.png", fullPage: true });
});











