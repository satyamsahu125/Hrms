import { test, expect } from '@playwright/test';

import { LoginUtil } from '../../utils/LoginUtil';

import { EmployeePage } from '../../pages/EmployeePage';

import { DashboardPage } from '../../pages/DashboardPage';


test.describe('Employee Module', () => {

    test('validate inactive employee Login', async ({ page }) => {


        const ePage = new EmployeePage(page);
        const dPage = new DashboardPage(page);

        await LoginUtil.loginAsAdmin(page);

        await ePage.openEmployeesPage();

        await ePage.openEmployeeForEdit();

        await ePage.updateStatus('inactive');


        await dPage.logout();


        await LoginUtil.loginAs(
            page, 'emily.d@acme.com', 'Employee@123'
        );


        await expect(page.url()).not.toContain('dashboard');




    });
});

