import { test, expect } from '@playwright/test';

import { LoginUtil } from '../../utils/LoginUtil';

import { LeavePage } from '../../pages/LeavePage';
import { DashboardPage } from '../../pages/DashboardPage';

test('Employee applies leave and admin approves successfully', async ({ page }) => {

  const leavePage = new LeavePage(page);
  const dashboardPage = new DashboardPage(page);

  // Employee Login
  await LoginUtil.loginAsEmployee(page);

  await leavePage.openLeavePage();

  await leavePage.applyLeave(
    'Medical Leave'
  );

  await expect(
    page.getByText(/pending/).first()
  ).toBeVisible();

  await dashboardPage.logout();

  // Admin Login
  await LoginUtil.loginAsAdmin(page);

  await leavePage.openLeavePage();

  await leavePage.approveFirstLeave();

  await expect(
    page.getByText(/approved/i).first()
  ).toBeVisible();
});