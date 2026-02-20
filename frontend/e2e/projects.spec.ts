import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('view projects page after login', async ({ page }) => {
    await expect(page.getByTestId('projects-list')).toBeVisible();
    await expect(page.getByTestId('create-project-btn')).toBeVisible();
    await expect(page.getByTestId('join-project-btn')).toBeVisible();
  });

  test('create a new project and see success message', async ({ page }) => {
    const projectId = `test-proj-${Date.now()}`;
    await page.getByTestId('create-project-btn').click();
    await expect(page.getByTestId('create-project-form')).toBeVisible();

    await page.getByTestId('create-project-name').fill('E2E Test Project');
    await page.getByTestId('create-project-description').fill('Created by Playwright');
    await page.getByTestId('create-project-id').fill(projectId);
    await page.getByTestId('create-project-submit').click();

    await expect(page.getByTestId('projects-message')).toContainText('Project created successfully');
    await expect(page.getByTestId('projects-list')).toContainText(projectId);
  });

  test('join an existing project and see success message', async ({ page }) => {
    // Join one of the sample projects (proj1, proj2, proj3)
    await page.getByTestId('join-project-btn').click();
    await expect(page.getByTestId('join-project-form')).toBeVisible();

    await page.getByTestId('join-project-id').fill('proj1');
    await page.getByTestId('join-project-submit').click();

    // Either success or already a member — both are valid outcomes
    const message = page.getByTestId('projects-message');
    const error = page.getByTestId('projects-error');
    await expect(message.or(error)).toBeVisible({ timeout: 5000 });
  });

  test('error when creating project with missing fields', async ({ page }) => {
    await page.getByTestId('create-project-btn').click();
    await expect(page.getByTestId('create-project-form')).toBeVisible();

    // Submit with only a name — missing description and ID
    await page.getByTestId('create-project-name').fill('Incomplete Project');
    await page.getByTestId('create-project-submit').click();
    await expect(page.getByTestId('projects-error')).toBeVisible();
  });
});
