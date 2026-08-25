import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('DataTable E2E and A11y', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/playground/index.html');
    });

    test('should load the playground and verify DataTable renders', async ({ page }) => {
        // Check if table rendered and pagination is present
        await expect(page.locator('.of-datatable-wrapper')).toBeVisible();
        await expect(page.locator('.of-datatable-search input')).toBeVisible();
        
        // Verify default pagination (5 rows from the example file)
        const rows = page.locator('.of-datatable tbody tr');
        await expect(rows).toHaveCount(5);
    });

    test('should paginate correctly when clicking Next', async ({ page }) => {
        const nextBtn = page.getByRole('button', { name: 'Próxima' });
        await nextBtn.click();
        
        // Row count should still be 5
        const rows = page.locator('.of-datatable tbody tr');
        await expect(rows).toHaveCount(5);
        
        // Specific content for page 2 based on our sample data
        await expect(page.locator('.of-datatable tbody')).toContainText('Brielle Williamson');
    });

    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
        await page.waitForTimeout(500); // Wait for CSS animations (fade in) to finish
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
