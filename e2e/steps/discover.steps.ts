import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

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

When('they open the {string} shelf', async ({ page }, title: string) => {
  await page
    .getByTestId('shelf')
    .filter({ hasText: new RegExp(`^${title}$`) })
    .click();
});

Then('a deck titled {string} is visible', async ({ page }, topic: string) => {
  // Real seeded deck, read via the categorySlug GSI — the guest deck read path.
  await expect(page.getByTestId('deck-card').filter({ hasText: new RegExp(topic) })).toBeVisible();
});

Then('that deck shows its card count', async ({ page }) => {
  await expect(
    page
      .getByTestId('deck-card')
      .first()
      .getByText(/\d+ cards/),
  ).toBeVisible();
});
