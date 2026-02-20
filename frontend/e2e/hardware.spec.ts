import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Hardware Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    // Ensure user is a member of proj1 by joining it
    await page.getByTestId('join-project-btn').click();
    await page.getByTestId('join-project-id').fill('proj1');
    await page.getByTestId('join-project-submit').click();
    // Wait for join response (success or already a member)
    const message = page.getByTestId('projects-message');
    const error = page.getByTestId('projects-error');
    await expect(message.or(error)).toBeVisible({ timeout: 5000 });

    await page.getByTestId('nav-hardware').click();
    await expect(page).toHaveURL(/\/hardware/);
    // Wait for hardware data to load
    await expect(page.getByTestId('hardware-table')).toContainText('HW Set 1', { timeout: 10000 });
  });

  test('view hardware page with table showing HW sets', async ({ page }) => {
    await expect(page.getByTestId('hardware-table')).toBeVisible();
    await expect(page.getByTestId('hardware-table')).toContainText('HW Set 1');
    await expect(page.getByTestId('hardware-table')).toContainText('HW Set 2');
    await expect(page.getByTestId('hardware-project-id')).toBeVisible();
  });

  test('request hardware and see success message', async ({ page }) => {
    await page.getByTestId('hardware-project-id').fill('proj1');
    await page.getByTestId('request-set1').fill('1');
    await page.getByTestId('hardware-submit-request').click();

    await expect(page.getByTestId('hardware-message')).toContainText('Hardware requested successfully');
  });

  test('open return form, submit return, and see success message', async ({ page }) => {
    // First request some hardware so we have something to return
    await page.getByTestId('hardware-project-id').fill('proj1');
    await page.getByTestId('request-set1').fill('1');
    await page.getByTestId('hardware-submit-request').click();
    await expect(page.getByTestId('hardware-message')).toContainText('Hardware requested successfully');

    // Now return the hardware
    await page.getByTestId('hardware-return-btn').click();
    await expect(page.getByTestId('hardware-return-form')).toBeVisible();
    await expect(page.getByTestId('hardware-return-table')).toBeVisible();

    await page.getByTestId('return-set1').fill('1');
    await page.getByTestId('hardware-return-submit').click();

    await expect(page.getByTestId('hardware-message')).toContainText('Hardware returned successfully');
  });
});
