import { type Page } from '@playwright/test';

export async function login(page: Page, email = 'alice@example.com', password = 'alice123') {
  await page.goto('/login');
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
  await page.waitForURL('**/projects');
}
