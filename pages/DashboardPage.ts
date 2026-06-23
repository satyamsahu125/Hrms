
import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  // Navigation

  private get dashboardMenu(): Locator {
  return this.page.locator(
    'a[href="/dashboard"]'
  );
  }

  // Dashboard Widgets

  private get totalEmployeesCard(): Locator {
    return this.page.getByText('Total Employees');
  }

  private get departmentsCard(): Locator {
    return this.page
      .getByRole('main')
      .getByText('Departments');
  }

  private get monthlyPayrollCard(): Locator {
    return this.page.getByText('Monthly Payroll');
  }

  private get presentTodayCard(): Locator {
    return this.page.getByText('Present Today');
  }

  private get leaveOverviewCard(): Locator {
    return this.page.getByText('Leave Overview');
  }

  private get recentActivitySection(): Locator {
    return this.page.getByText('Recent Activity');
  }

  private get quickStatsSection(): Locator {
    return this.page.getByText('Quick Stats');
  }

  private get loginActivity(): Locator {
    return this.page.getByText('login').first();
  }

  private get adminEmailActivity(): Locator {
    return this.page
      .getByText('admin@payroll.com')
      .nth(1);
  }

  // Profile Menu

  private get profileMenu(): Locator {
    return this.page.locator(
        'button[data-bs-toggle="dropdown"]'
    ).nth(1);
}


  private get logoutLink(): Locator {
  return this.page.locator(
    'a[href="/auth/logout"]'
  ).first();
}

  // Methods

  async openDashboard() {
    await this.dashboardMenu.click();
  }

  async logout() {
    await this.profileMenu.click();
    await this.logoutLink.click();
  }

  // Bug-005 Validation

  async isTotalEmployeesVisible() {
    return await this.totalEmployeesCard.isVisible();
  }

  async isDepartmentsVisible() {
    return await this.departmentsCard.isVisible();
  }

  async isMonthlyPayrollVisible() {
    return await this.monthlyPayrollCard.isVisible();
  }

  async isPresentTodayVisible() {
    return await this.presentTodayCard.isVisible();
  }

  async isRecentActivityVisible() {
    return await this.recentActivitySection.isVisible();
  }

  async isQuickStatsVisible() {
    return await this.quickStatsSection.isVisible();
  }

  async isAdminActivityVisible() {
    return await this.adminEmailActivity.isVisible();
  }
}