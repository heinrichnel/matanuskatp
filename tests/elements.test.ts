import { test, expect } from '@playwright/test';
import { getAllElements } from '../src/utils/getAllElements';

test('should extract all elements on homepage', async ({ page }) => {
  // Navigate to the homepage with more reliable wait strategy
  await page.goto('/', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Wait for the page to be fully loaded
  await page.waitForSelector('body', { state: 'visible', timeout: 10000 });

  // Wait for at least one button to be visible
  await page.waitForSelector('button, [role="button"]', {
    state: 'visible',
    timeout: 10000
  });

  // Extract all elements
  const elements = await getAllElements(page);

  // Log the elements for debugging
  console.log('Buttons:', elements.buttons);
  console.log('Inputs:', elements.inputs);
  console.log('Links:', elements.links);
  console.log('Tables:', elements.tables);
  console.log('Dropdowns:', elements.dropdowns);
  console.log('Visible Text Sample:', elements.visibleText.slice(0, 10));

  // Verify that elements were extracted
  expect(elements.buttons.length).toBeGreaterThan(0);
  expect(elements.visibleText.length).toBeGreaterThan(0);

  // Take a screenshot for reference
  await page.screenshot({ path: 'homepage-elements.png' });
});

test('should handle empty pages gracefully', async ({ page }) => {
  // Create a simple empty page
  await page.setContent('<html><body></body></html>');

  // Extract elements from the empty page
  const elements = await getAllElements(page);

  // Verify that no elements were found but the function didn't crash
  expect(elements.buttons.length).toBe(0);
  expect(elements.inputs.length).toBe(0);
  expect(elements.links.length).toBe(0);
  expect(elements.tables.length).toBe(0);
  expect(elements.dropdowns.length).toBe(0);
  expect(elements.visibleText.length).toBe(0);
});
