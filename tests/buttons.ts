import { test, expect } from '@playwright/test';

test('List all buttons on the page', async ({ page }) => {
  await page.goto('http://localhost:5173'); // Pas die URL aan

  const buttons = page.locator('button');
  const count = await buttons.count();

  console.log(`Found ${count} button(s):`);

  for (let i = 0; i < count; i++) {
    const text = await buttons.nth(i).innerText();
    console.log(`- Button ${i + 1}: "${text}"`);
  }

  expect(count).toBeGreaterThan(0); // Jy verwag dat daar ten minste een button is
});
