import { test, expect } from '@playwright/test';
import { LoginUtil } from '../../utils/LoginUtil';
import { PayrollPage } from '../../pages/PayrollPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { EmployeePage } from '../../pages/EmployeePage';
import { LeavePage } from '../../pages/LeavePage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Payroll Module', () => {

    test('Verify payroll recalculates after tax update', async ({ page }) => {

        const settingsPage = new SettingsPage(page);
        const payrollPage = new PayrollPage(page);

        await LoginUtil.loginAsAdmin(page);

        await settingsPage.openSettings();

        await settingsPage.updateTax('20');

        await payrollPage.openPayrollPage();

        await payrollPage.generatePayroll('7');

        await expect(
            page.locator('table')
        ).toBeVisible();

        

    });
    test('Verify payroll generate', async ({ page }) => {

        const payrollPage = new PayrollPage(page);

        await LoginUtil.loginAsAdmin(page);


        await payrollPage.openPayrollPage();

        await payrollPage.generatePayroll('7');

        await expect(
            page.locator('table')
        ).toBeVisible();
        

    });

    test('validate new eployee payroll Generation for old date ', async ({ page }) => {

        const employeePage = new EmployeePage(page);
        const payrollPage = new PayrollPage(page);

        await LoginUtil.loginAsAdmin(page);

        await employeePage.openEmployeesPage();

        await employeePage.createEmployee({
            firstName: 'QA',
            lastName: 'Tester',
            email: `qa${Date.now()}@mail.com`,
            phone: '9999999999',
            departmentId: '6a377789629cb6364f099318',
            designation: 'Tester',
            basicSalary: '30000',
            hra: '5000',
            da: '2000'
        });

        await payrollPage.openPayrollPage();

        await payrollPage.generatePayroll('5');

        await expect(
            page.locator('table')
        ).toBeVisible();

    });

    test('Validate approved leave impacts payroll calculation', async ({ page }) => {

        const leavePage = new LeavePage(page);
        const payrollPage = new PayrollPage(page);
        const dashboardPage = new DashboardPage(page);

        await LoginUtil.loginAsEmployee(page);

        await leavePage.openLeavePage();

        await leavePage.applyLeave(
            'Medical Leave'
        );

        await dashboardPage.logout();

        await LoginUtil.loginAsAdmin(page);

        await leavePage.openLeavePage();

        await leavePage.approveFirstLeave();

        await payrollPage.openPayrollPage();

        await payrollPage.generatePayroll('5');

        await expect(
            page.locator('table')
        ).toBeVisible();

    });
    test('Admin generates payroll and views payroll details', async ({ page }) => {

        const payrollPage = new PayrollPage(page);

        await LoginUtil.loginAsAdmin(page);

        await payrollPage.openPayrollPage();

        await payrollPage.generatePayroll('5');

        // Open first payroll record
        await payrollPage.openPayrollDetails(2);

        // Validate details page
        await expect(
            page.getByRole('link', {
                name: 'Back'
            })
        ).toBeVisible();

        await payrollPage.goBack();

        await expect(
            page.locator('table')
        ).toBeVisible();

    });

});