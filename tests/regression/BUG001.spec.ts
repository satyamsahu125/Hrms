import { test, expect } from '@playwright/test';
import { LoginUtil } from '../../utils/LoginUtil';
import { PayrollPage } from '../../pages/PayrollPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { PayrollCalculator } from '../../utils/PayrollCalulator';
test.describe('Payroll Module', () => {

    test('Verify payroll recalculates after tax update', async ({ page }) => {

        let pf: number = 15;
        let overtime: number = 2;
        let tax : number = 20;
        const settingsPage = new SettingsPage(page);
        const payrollPage = new PayrollPage(page);

        await LoginUtil.loginAsAdmin(page);

        await settingsPage.openSettings();
        await settingsPage.updatePayrollSettings(
            String(1),
            String(pf),
            String(overtime)
        );

        await settingsPage.updateTax(String(tax));

        await payrollPage.openPayrollPage();

        await payrollPage.generatePayroll('7');

        const gross = await payrollPage.getGrossSalary();

        const expectedNetSalary =
            PayrollCalculator.calculate(
                gross,
                pf, // PF %
                overtime,  // ESI %
                tax // Tax %
            );

        const actualNetSalary =
            await payrollPage.getNetSalary();

        expect(actualNetSalary)
            .toBeCloseTo(expectedNetSalary.netSalary, 0);
        



    });


    // test('Admin generates payroll and views payroll details', async ({ page }) => {

    //     const payrollPage = new PayrollPage(page);

    //     await LoginUtil.loginAsAdmin(page);

    //     await payrollPage.openPayrollPage();

    //     await payrollPage.generatePayroll('5');

    //     // Open first payroll record
    //     await payrollPage.openPayrollDetails(2);

    //     // Validate details page
    //     await expect(
    //         page.getByRole('link', {
    //             name: 'Back'
    //         })
    //     ).toBeVisible();

    //     await payrollPage.goBack();

    //     await expect(
    //         page.locator('table')
    //     ).toBeVisible();

    // });

});