// utils/LoginUtil.ts

import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export class LoginUtil {
  static async loginAs(
    page: Page,
    email: string,
    password: string
  ) {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(email, password);
  }

  static async loginAsAdmin(page: Page) {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      'admin@payroll.com',
      'Admin@123'
    );
  }

  static async loginAsEmployee(page: Page) {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      'emily.d@acme.com',
      'Employee@123'
    );
  }
}