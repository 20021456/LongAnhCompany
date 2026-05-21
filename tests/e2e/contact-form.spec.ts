import { expect, test } from '@playwright/test';

test.describe('Contact form', () => {
  test('renders the quote-request form', async ({ page }) => {
    await page.goto('/vi/contact');
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('a valid submission shows the success message', async ({ page }) => {
    // Stub the API so the test does not depend on a live mailer / DB write.
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
    );

    await page.goto('/vi/contact');
    await page.locator('input[name="fullName"]').fill('Nguyễn Văn A');
    await page.locator('input[name="email"]').fill('a.nguyen@example.com');
    await page.locator('input[name="phone"]').fill('0901234567');
    await page.locator('textarea[name="message"]').fill('Cần báo giá 200 tấn CaCO3 siêu mịn.');
    await page.getByRole('button', { name: /Gửi yêu cầu báo giá/ }).click();

    await expect(page.getByText('Đã gửi! Chúng tôi sẽ phản hồi trong 24h.')).toBeVisible();
  });

  test('surfaces a server error without losing the form', async ({ page }) => {
    await page.route('**/api/contact', (route) => route.fulfill({ status: 500, body: '{}' }));

    await page.goto('/vi/contact');
    await page.locator('input[name="fullName"]').fill('Trần Thị B');
    await page.locator('input[name="email"]').fill('b.tran@example.com');
    await page.locator('textarea[name="message"]').fill('Test lỗi máy chủ.');
    await page.getByRole('button', { name: /Gửi yêu cầu báo giá/ }).click();

    await expect(page.getByText('Có lỗi xảy ra. Vui lòng thử lại.')).toBeVisible();
  });
});
