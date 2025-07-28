
import { test, expect } from "@playwright/test";

test("Add a new trip and verify it appears in the list", async ({ page }) => {
  await page.goto("http://localhost:5173/trips");
  await page.getByRole("button", { name: /add trip/i }).click();
  await page.getByLabel("Fleet Number").fill("29H - AGJ 3466");
  await page.getByLabel("Driver Name").fill("Phillimon Kwarire");
  await page.getByLabel("Origin").fill("Harare");
  await page.getByLabel("Destination").fill("Johannesburg");
  await page.getByRole("button", { name: /submit/i }).click();
  await expect(page.getByText("Phillimon Kwarire")).toBeVisible();
  await expect(page.getByText("29H - AGJ 3466")).toBeVisible();
});
