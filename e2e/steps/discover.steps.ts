import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given('a visitor opens the app at the root', async ({ page }) => {
  await page.goto('/');
});

Then('they are taken to the Discover tab', async ({ page }) => {
  await expect(page).toHaveURL(/\/discover$/);
});

Then('a category shelf {string} is visible', async ({ page }, title: string) => {
  // Assert on a REAL seeded category title rendered in a shelf — not just that
  // the list exists. The seed creates these; this exercises the guest read.
  await expect(
    page.getByTestId('shelf').filter({ hasText: new RegExp(`^${title}$`) }),
  ).toBeVisible();
});
