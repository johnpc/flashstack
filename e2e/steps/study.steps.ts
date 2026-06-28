import { expect, test } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

const USERNAME = process.env.TEST_USERNAME;
const PASSWORD = process.env.TEST_PASSWORD;

Given('the study test user signs in', async ({ page }) => {
  if (!USERNAME || !PASSWORD) test.skip(true, 'TEST_USERNAME / TEST_PASSWORD not set');
  await page.goto('/signin');
  await page.locator('input[type="email"]').fill(USERNAME as string);
  await page.locator('input[type="password"]').fill(PASSWORD as string);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForFunction(
    () =>
      Object.keys(window.localStorage).some(
        (k) => k.includes('CognitoIdentityServiceProvider') && k.endsWith('.accessToken'),
      ),
    undefined,
    { timeout: 15_000 },
  );
});

When('the user starts studying the {string} deck', async ({ page }, topic: string) => {
  await page.goto('/discover/languages');
  await page
    .getByTestId('deck-card')
    .filter({ hasText: new RegExp(topic) })
    .click();
  await expect(page.getByTestId('deck-title')).toContainText(topic);
  await page.getByTestId('study-link').click();
});

Then('the study session shows progress {string}', async ({ page }, prefix: string) => {
  await expect(page.getByTestId('study-progress')).toContainText(prefix, { timeout: 15_000 });
});

When('the user reveals the answer', async ({ page }) => {
  await page.getByRole('button', { name: 'Show answer' }).click();
});

Then('the card answer is shown', async ({ page }) => {
  await expect(page.getByTestId('study-answer')).toBeVisible();
});

When('the user grades the card {string}', async ({ page }, label: string) => {
  await page.getByRole('button', { name: label }).click();
});

Then('the study session advances past the first card', async ({ page }) => {
  // Either the next card (progress "2 /") or the all-caught-up state for a
  // 1-card session — both prove the grade persisted and the queue advanced.
  await expect
    .poll(
      async () => {
        if (await page.getByTestId('study-done').isVisible()) return true;
        return (await page.getByTestId('study-progress').textContent())?.includes('2 /') ?? false;
      },
      { timeout: 15_000 },
    )
    .toBe(true);
});
