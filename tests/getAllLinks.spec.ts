import { test, expect } from '@playwright/test';

test('Get all anchor links on the homepage', async ({ page }) => {
  await page.goto('/');

  // Wait for at least one known element that signals full render
  await page.waitForSelector('body', { state: 'visible' });

  const links = await page.$$('a');

  console.log(`Found ${links.length} anchor links`);
  for (const link of links) {
    const href = await link.getAttribute('href');
    const text = await link.innerText();
    console.log(`Link - text: "${text}", href: ${href}`);
  }

  expect(links.length).toBeGreaterThan(0); // <-- comment out if debugging
});
