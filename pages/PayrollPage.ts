import { Page, Locator } from '@playwright/test';

export class PayrollPage {
  constructor(private page: Page) { }

  // Navigation

  private get payrollMenu(): Locator {
    return this.page.getByRole('link', {
      name: ' Payroll'
    });
  }

  // Search / Filter

  private get yearInput(): Locator {
    return this.page.getByRole('spinbutton').first();
  }

  private get goButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Go'
    });
  }

  // Generate Payroll

  private get generatePayrollButton(): Locator {
    return this.page.getByRole('button', {
      name: ' Generate'
    });
  }

  private get generateMonthInput(): Locator {
    return this.page
      .locator('#generateModal')
      .getByRole('spinbutton');
  }

  private get confirmGenerateButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Generate',
      exact: true
    });
  }

  // Payroll Details

  private get backButton(): Locator {
    return this.page.getByRole('link', {
      name: 'Back'
    });
  }

//to get gross value
  async getGrossSalary(): Promise<number> {

    const salaryText = await this.page
        .locator('//tbody/tr/td[2]').first()
        .innerText();

    const salaryValue = Number(
        salaryText.replace(/[$,]/g, '')
    );

    return salaryValue;
  }
  // To get net value
  async getNetSalary(): Promise<number> {

    const salaryText = await this.page
        .locator('//tbody/tr/td[4]').first()
        .innerText();

    const salaryValue = Number(
        salaryText.replace(/[$,]/g, '')
    );

    return salaryValue;
  }

  // private get employeeName(): Locator {
  //       return this.page.locator('//tbody/tr[1]/td[1]');
  //   }

  //   async getEmployeeName(): Promise<string> {
  //       return await this.employeeName.innerText();
  //   }


  // Actions

  async getAllEmployeeNames(): Promise<string[]> {

    const names = await this.page
        .locator('//tbody/tr/td[1]')
        .allInnerTexts();

    return names;
}

  async openPayrollPage() {
    await this.payrollMenu.click();
  }

  async searchPayroll(year: string) {
    await this.yearInput.fill(year);
    await this.goButton.click();
  }

  async generatePayroll(month: string) {
    await this.generatePayrollButton.click();

    await this.generateMonthInput.fill(month);

    await this.confirmGenerateButton.click();
  }

  async openPayrollDetails(rowNumber: number) {
    await this.page
      .locator(
        `tr:nth-child(${rowNumber}) .btn.btn-sm.btn-outline-primary`
      )
      .click();
  }

  async goBack() {
    await this.backButton.click();
  }
}