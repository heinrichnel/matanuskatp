import { test, expect } from '@playwright/test';

test('Get all visible text elements on the homepage', async ({ page }) => {
  await page.goto('/');

  const elements = await page.$$('h1, h2, h3, h4, h5, h6, p, span, div');
  let visibleTextCount = 0;

  for (const el of elements) {
    const isVisible = await el.isVisible();
    if (isVisible) {
      const text = (await el.innerText()).trim();
      if (text) {
        visibleTextCount++;
        console.log(`Visible Text: ${text}`);
      }
    }
  }

  expect(visibleTextCount).toBeGreaterThan(0);
});
