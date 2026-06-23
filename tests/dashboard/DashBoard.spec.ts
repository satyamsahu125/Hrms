import { test, expect } from '@playwright/test';

import { LoginUtil } from '../../utils/LoginUtil';

import { LeavePage } from '../../pages/LeavePage';
import { DashboardPage } from '../../pages/DashboardPage';

test('validate Employee can login and navigate to dashboard', async ({ page }) => {

  const leavePage = new LeavePage(page);
  const dashboardPage = new DashboardPage(page);

  // Employee Login
  await LoginUtil.loginAsEmployee(page);

});