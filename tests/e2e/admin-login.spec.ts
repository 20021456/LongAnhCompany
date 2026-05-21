import { expect, test } from '@playwright/test';

test.describe('Admin login', () => {
  test('renders the login form', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
  });

  test('the "Dùng" shortcut pre-fills the demo credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByRole('button', { name: 'Dùng' }).click();
    await expect(page.locator('#email')).toHaveValue('admin@longanhcorp.com');
    await expect(page.locator('#password')).toHaveValue('ChangeMe123!');
  });

  test('shows an error for invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.locator('#email').fill('nobody@example.com');
    await page.locator('#password').fill('wrong-password');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await expect(page.getByText('Email hoặc mật khẩu không đúng.')).toBeVisible();
  });

  test('a guest hitting /admin is redirected to the login page', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
