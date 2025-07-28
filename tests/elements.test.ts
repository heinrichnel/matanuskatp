import { test, expect } from '@playwright/test';
import { getAllElements } from '../src/utils/getAllElements';

test('should extract all elements on homepage', async ({ page }) => {
  await page.goto('/');

  // ✅ WAG vir iets spesifieks op die bladsy
  await page.waitForSelector('button'); // verander dit na iets wat verseker bestaan

  const elements = await getAllElements(page);

  console.log('Buttons:', elements.buttons);
  console.log('Inputs:', elements.inputs);
  console.log('Links:', elements.links);

  expect(elements.buttons.length).toBeGreaterThan(0);
});
