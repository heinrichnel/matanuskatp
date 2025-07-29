// tests/routes.spec.ts
import { test, expect } from '@playwright/test';

// static routes you want to validate based on AppRoutes.tsx
const routes = [
  '/dashboard',
  '/trips',
  '/trips/dashboard',
  '/trips/active',
  '/diesel',
  '/diesel/dashboard',
  '/drivers',
  '/drivers/dashboard',
  '/invoices',
  '/invoices/dashboard',
  '/workshop',
  '/workshop/operations',
  '/tyres',
  '/tyres/manage',
  '/customers',
  '/customers/dashboard',
  '/maps',
  '/maps/wialon',
  '/flags',
  '/costs/indirect',
  '/missed-loads',
];

test.describe('Basic route availability', () => {
  for (const path of routes) {
    test(`navigating to ${path} does not show the 404 page`, async ({ page }) => {
      // Navigate to the route with increased timeout and more reliable wait strategy
      await page.goto(`http://localhost:5173${path}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      // Wait for the page to stabilize
      await page.waitForTimeout(1000);

      // Check that the NotFound component text is not visible
      // Use a more specific selector to avoid false positives
      const notFoundText = page.locator('div:has-text("404 – Page not found")').filter({
        hasText: /404\s+–\s+Page not found/i,
        hasNotText: /dashboard|trips|diesel|drivers|invoices|workshop|tyres|customers|maps|flags|costs/i
      });

      await expect(notFoundText).toHaveCount(0);

      // Additional check: verify that some content loaded
      await expect(page.locator('body')).not.toBeEmpty();
    });
  }
});
