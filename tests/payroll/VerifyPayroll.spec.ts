import { test, expect } from '@playwright/test';
import { LoginUtil } from '../../utils/LoginUtil';
import { PayrollPage } from '../../pages/PayrollPage';

    test('Verify Hr/Admin Can generate payroll ', async ({ page }) => {

        const payrollPage = new PayrollPage(page);

        await LoginUtil.loginAsAdmin(page);


        await payrollPage.openPayrollPage();

        await payrollPage.generatePayroll('7');

        await expect(
            page.locator('table')
        ).toBeVisible();


    });