import { test, expect } from '@playwright/test';
import { LoginUtil } from '../../utils/LoginUtil';
import { PayrollPage } from '../../pages/PayrollPage';
import { LeavePage } from '../../pages/LeavePage';
import { DashboardPage } from '../../pages/DashboardPage';
import { PayrollCalculator } from '../../utils/PayrollCalulator';
    test('Validate approved leave impacts payroll calculation', async ({ page }) => {

        let pf: number = 15;
        let overtime: number = 2;
        let tax : number = 20;
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