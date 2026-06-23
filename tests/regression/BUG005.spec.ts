import { test, expect } from '@playwright/test';
import { LoginUtil } from '../../utils/LoginUtil';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Dashboard Module', () => {

    test('validate originization based Data', async ({ page }) => {

        const dashboardPage = new DashboardPage(page);


        await LoginUtil.loginAsEmployee(page);

        await dashboardPage.openDashboard();

        await expect(
            page.locator("//div[normalize-space()='Total Employees']/following-sibling::h3")).toBeVisible();

        await expect(
            page.locator("//div[text()='Departments']/following-sibling::h3")).toBeVisible();

        await expect(
            page.locator("//small[text()='admin@payroll.com']").first()).not.toBeVisible();



    }
    );
});