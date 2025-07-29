import { Page } from '@playwright/test';

/**
 * Extracts all elements of various types from a page
 * Enhanced with error handling and more robust selectors
 */
export async function getAllElements(page: Page): Promise<{
  buttons: string[];
  inputs: string[];
  links: string[];
  tables: string[];
  dropdowns: string[];
  visibleText: string[];
}> {
  // Wait for the page to be fully loaded
  await page.waitForLoadState('domcontentloaded');

  // Add a small delay to ensure dynamic content is loaded
  await page.waitForTimeout(1000);

  // Extract buttons with error handling
  let buttons: string[] = [];
  try {
    buttons = await page.$$eval('button, [role="button"], .btn, [type="button"]', (els: Element[]) =>
      els.map((el) => {
        const text = (el as HTMLButtonElement).innerText?.trim() || '';
        const ariaLabel = el.getAttribute('aria-label') || '';
        return text || ariaLabel || 'Unnamed Button';
      }).filter(Boolean)
    );
  } catch (error) {
    console.warn('Error extracting buttons:', error);
  }

  // Extract inputs with error handling
  let inputs: string[] = [];
  try {
    inputs = await page.$$eval('input, textarea, [role="textbox"]', (els: Element[]) =>
      els.map((el) => {
        const name = el.getAttribute('name') || '';
        const placeholder = el.getAttribute('placeholder') || '';
        const type = el.getAttribute('type') || '';
        return `${type} ${name} ${placeholder}`.trim();
      }).filter(Boolean)
    );
  } catch (error) {
    console.warn('Error extracting inputs:', error);
  }

  // Extract links with error handling
  let links: string[] = [];
  try {
    links = await page.$$eval('a, [role="link"]', (els: Element[]) =>
      els.map((el) => {
        const href = (el as HTMLAnchorElement).href || '';
        const text = el.textContent?.trim() || '';
        return href || text || 'Unnamed Link';
      }).filter(Boolean)
    );
  } catch (error) {
    console.warn('Error extracting links:', error);
  }

  // Extract tables with error handling
  let tables: string[] = [];
  try {
    tables = await page.$$eval('table, [role="table"]', (els: Element[]) =>
      els.map((el, index) => `Table ${index + 1}`).filter(Boolean)
    );
  } catch (error) {
    console.warn('Error extracting tables:', error);
  }

  // Extract dropdowns with error handling
  let dropdowns: string[] = [];
  try {
    dropdowns = await page.$$eval('select, [role="listbox"], [role="combobox"]', (els: Element[]) =>
      els.map((el, index) => {
        const name = el.getAttribute('name') || '';
        const id = el.getAttribute('id') || '';
        return name || id || `Dropdown ${index + 1}`;
      }).filter(Boolean)
    );
  } catch (error) {
    console.warn('Error extracting dropdowns:', error);
  }

  // Extract visible text with error handling
  let visibleText: string[] = [];
  try {
    visibleText = await page.$$eval(
      'h1, h2, h3, h4, h5, h6, p, span, div, label, button, a',
      (els: Element[]) =>
        els
          .filter((el) => {
            try {
              const style = window.getComputedStyle(el);
              const rect = el.getBoundingClientRect();
              return (
                style &&
                style.visibility !== 'hidden' &&
                style.display !== 'none' &&
                rect.width > 0 &&
                rect.height > 0 &&
                el.textContent?.trim()
              );
            } catch (e) {
              return false;
            }
          })
          .map((el) => el.textContent!.trim())
          .filter((text) => text.length > 0)
    );
  } catch (error) {
    console.warn('Error extracting visible text:', error);
  }

  return { buttons, inputs, links, tables, dropdowns, visibleText };
}
