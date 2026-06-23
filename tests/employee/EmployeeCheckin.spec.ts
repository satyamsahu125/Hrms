import { test, expect } from '@playwright/test';

import { LoginUtil } from '../../utils/LoginUtil';

import { LeavePage } from '../../pages/LeavePage';
import { DashboardPage } from '../../pages/DashboardPage';

test('validate Employee can Check In and Check Out', async ({ page }) => {

    const leavePage = new LeavePage(page);
    const dashboardPage = new DashboardPage(page);

    // Employee Login
    await LoginUtil.loginAsEmployee(page);

    await page.getByRole('link', {
        name: 'Attendance'
    }).click();

    await page.locator('button[type="submit"]', {
    }).getByText('Check In').click();


    const alertText = await page.getByRole('alert').innerText();

    expect(
        alertText.includes('Checked in successfully') ||
        alertText.includes('Already checked in today')
    ).toBeTruthy();

    await page.locator('button[type="submit"]', {
    }).getByText('Check Out').click();


    
    await page.getByRole('button', { name: 'Checkout' }).click();

    const alert = page.getByRole('alert');

    if (await alert.count() === 0) {

        await test.info().attach('Bug Details', {
            body: 'Checkout completed but no success/error feedback message displayed',
            contentType: 'text/plain'
        });

        expect(false, 'No checkout feedback message displayed').toBeTruthy();

    } else {

        const alertText = await alert.innerText();

        expect(
            alertText.includes('Checked out successfully') ||
            alertText.includes('Already checked out')
        ).toBeTruthy();
    }


});