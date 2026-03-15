import { expect, test } from '@playwright/test';

test.describe('app browser smoke test', () => {
  test('renders the main page and about panel', async ({ page }) => {
    await page.goto('./');

    await expect(page).toHaveTitle(/Trail Through the Barangay/i);
    await expect(page.locator('#start-screen')).toBeVisible();
    await expect(page.locator('#start-title')).toHaveText('Trail Through the Barangay');
    await expect(page.locator('#start-button')).toHaveText('Start journey');
    await expect(page.locator('#start-about-button')).toHaveText('About');

    const aboutPanel = page.locator('#about-panel');
    await expect(aboutPanel).toBeHidden();

    await page.locator('#start-about-button').click();

    await expect(aboutPanel).toBeVisible();
    await expect(page.locator('#about-title')).toContainText(/\S+/);
    await expect(page.locator('#about-body')).toContainText(/\S+/);
    await expect(page.locator('#close-about')).toContainText(/\S+/);

    await page.locator('#close-about').click();
    await expect(aboutPanel).toBeHidden();
  });
});
