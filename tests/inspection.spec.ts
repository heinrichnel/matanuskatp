
import { test, expect } from "@playwright/test";

test("Open Inspection Details Modal and view content", async ({ page }) => {
  await page.goto("http://localhost:5173/inspections");
  await page.getByRole("button", { name: /view details/i }).first().click();
  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect(modal.getByText(/inspection report/i)).toBeVisible();
});
