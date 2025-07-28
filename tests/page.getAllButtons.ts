import { Page } from '@playwright/test';

/**
 * Gee 'n lys van alle knoppies op die bladsy – met teks, class name, en visibility.
 */
export async function getAllButtons(page: Page) {
  const buttons = page.locator('button');
  const count = await buttons.count();

  const allButtons = [];

  for (let i = 0; i < count; i++) {
    const button = buttons.nth(i);
    const text = await button.innerText();
    const className = await button.getAttribute('class');
    const visible = await button.isVisible();

    allButtons.push({
      index: i,
      text,
      className,
      visible,
    });
  }

  return allButtons;
}
