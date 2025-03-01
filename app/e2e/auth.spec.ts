import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show validation errors with invalid credentials', async ({
    page,
  }) => {
    await page.goto('/auth/login');

    // Try to submit without any input
    await page.getByTestId('login-button').click();

    // Try with invalid email format
    await page.getByTestId('email-input').fill('invalid-email');
    await page.getByTestId('password-input').fill('short');
    await page.getByTestId('login-button').click();
    await expect(page.getByText('Invalid email')).toBeVisible();
  });

  test('should navigate to registration page and back', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByTestId('register-link').click();
    await expect(page).toHaveURL('/en/auth/register');

    await page.getByTestId('login-link').click();
    await expect(page).toHaveURL('/en/auth/login');
  });
});
