import { test } from "@playwright/test";

test("List all input fields", async ({ page }) => {
  await page.goto("/");
  const inputs = await page.locator("input").allTextContents();
  console.log("Inputs found:", inputs);
});
