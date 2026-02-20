import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Authentication', () => {
  test('splash page loads with logo', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-logo')).toBeVisible();
  });

  test('navigate to login page from header', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-logout-btn').click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('login with valid credentials', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.getByTestId('user-email')).toHaveText('alice@example.com');
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('wrong@example.com');
    await page.getByTestId('login-password').fill('wrongpassword');
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
  });

  test('register a new user and redirect to projects', async ({ page }) => {
    const uniqueEmail = `testuser-${Date.now()}@example.com`;
    await page.goto('/register');
    await page.getByTestId('register-email').fill(uniqueEmail);
    await page.getByTestId('register-password').fill('password123');
    await page.getByTestId('register-confirm-password').fill('password123');
    await page.getByTestId('register-submit').click();
    await expect(page).toHaveURL(/\/projects/, { timeout: 10000 });
  });

  test('logout flow', async ({ page }) => {
    await login(page);
    await expect(page.getByTestId('user-email')).toBeVisible();
    await page.getByTestId('login-logout-btn').click();
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('login-logout-btn')).toContainText('LOGIN');
  });

  test('protected route redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveURL(/\/login/);
  });
});
