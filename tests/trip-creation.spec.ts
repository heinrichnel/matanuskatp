import { test, expect } from "@playwright/test";

test("Trip Creation Form – Submit button triggers submission", async ({ page }) => {
  // ✅ 1. Gaan na die trip creation route (pas aan volgens jou routing)
  await page.goto("/trips/create");

  // ✅ 2. Vul basiese vorm-velde in (pas selectors aan volgens jou vorm)
  await page.fill('input[name="fleetNumber"]', "34H");
  await page.fill('input[name="route"]', "Harare to Johannesburg");

  // ✅ 3. Klik op Submit-knoppie
  const submitBtn = await page.locator('button:has-text("Submit")');
  await expect(submitBtn).toBeVisible();
  await submitBtn.click();

  // ✅ 4. Wag op 'n bevestiging/toast/success-nav
  // Jy kan hierdie aanpas vir hoe jou app bevestig
  await page.waitForSelector("text=Trip successfully created");

  // ✅ 5. Opsionele screenshot (debug)
  await page.screenshot({ path: "trip-created.png", fullPage: true });
});
