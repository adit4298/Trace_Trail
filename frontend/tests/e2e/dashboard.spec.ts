import { test, expect } from '@playwright/test';

test.describe('TraceTrail dashboard', () => {
  test('loads KPIs and trend insights', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByLabel('Key performance indicators')).toBeVisible();
    await expect(page.getByText('Risk Score')).toBeVisible();
    await expect(page.getByText('Anomaly Volume')).toBeVisible();

    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await themeToggle.click();
    await expect(themeToggle).toBeVisible();
  });
});

