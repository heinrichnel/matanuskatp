import { Page } from '@playwright/test';

export async function getAllElements(page: Page): Promise<{
  buttons: string[];
  inputs: string[];
  links: string[];
  tables: string[];
  dropdowns: string[];
  visibleText: string[];
}> {
  const buttons = await page.$$eval('button', (els: Element[]) =>
    els.map((el) => (el as HTMLButtonElement).innerText.trim())
  );

  const inputs = await page.$$eval('input', (els: Element[]) =>
    els.map((el) => (el as HTMLInputElement).outerHTML)
  );

  const links = await page.$$eval('a', (els: Element[]) =>
    els.map((el) => (el as HTMLAnchorElement).href)
  );

  const tables = await page.$$eval('table', (els: Element[]) =>
    els.map((el) => (el as HTMLTableElement).outerHTML)
  );

  const dropdowns = await page.$$eval('select', (els: Element[]) =>
    els.map((el) => (el as HTMLSelectElement).outerHTML)
  );

  const visibleText = await page.$$eval('body *', (els: Element[]) =>
    els
      .filter((el) => {
        const style = window.getComputedStyle(el);
        return (
          style &&
          style.visibility !== 'hidden' &&
          style.display !== 'none' &&
          el.textContent?.trim()
        );
      })
      .map((el) => el.textContent!.trim())
  );

  return { buttons, inputs, links, tables, dropdowns, visibleText };
}
