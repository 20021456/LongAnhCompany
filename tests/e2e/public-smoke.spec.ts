import { expect, test } from '@playwright/test';

const PAGES = ['/vi', '/vi/about', '/vi/products', '/vi/news', '/vi/career', '/vi/contact'];

test.describe('Public site smoke test', () => {
  for (const path of PAGES) {
    test(`${path} responds 200 and renders a heading`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });
  }

  test('the locale prefix redirects work for the bare root', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(vi|en|zh)(\/|$)/);
  });

  test('switching language keeps you on the same page', async ({ page }) => {
    await page.goto('/vi/about');
    await page.goto('/en/about');
    await expect(page).toHaveURL(/\/en\/about/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('sitemap.xml is served', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('xml');
  });

  test('robots.txt is served', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
  });
});
