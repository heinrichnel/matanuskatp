import { test, expect } from '@playwright/test';

test('Open Tyre Fleet Map Page', async ({ page }) => {
  await page.goto('https://matanuska.netlify.app/');
  const button = page.getByRole('button', { name: 'Tyre Fleet Map Page' });
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.locator('text=Fleet Tyre Overview')).toBeVisible(); // adjust if needed
});
