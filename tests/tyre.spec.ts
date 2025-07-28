
import { test, expect } from "@playwright/test";

test("Delete a tyre from the list", async ({ page }) => {
  await page.goto("http://localhost:5173/tyres");
  await page.getByRole("button", { name: /delete/i }).first().click();
  await page.getByRole("dialog").getByRole("button", { name: /confirm/i }).click();
  await expect(page.getByText("FM66")).not.toBeVisible();
});
