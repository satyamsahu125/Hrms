import { Page, Locator } from '@playwright/test';

export class SettingsPage {
  constructor(private page: Page) {}

  // Navigation

  private get settingsMenu(): Locator {
    return this.page.getByRole('link', {
      name: 'Settings'
    });
  }

  // Company Settings

  private get companyNameInput(): Locator {
    return this.page.locator('input[name="name"]');
  }

  private get companyEmailInput(): Locator {
    return this.page.locator('input[name="email"]');
  }

  private get companyPhoneInput(): Locator {
    return this.page.locator('input[name="phone"]');
  }

  private get saveCompanyButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Save Company'
    });
  }

  // Payroll Settings

  private get payDayInput(): Locator {
    return this.page.locator('input[name="payDay"]');
  }

  private get defaultPfInput(): Locator {
    return this.page.locator('input[name="defaultPf"]');
  }

  private get overtimeMultiplierInput(): Locator {
    return this.page.locator(
      'input[name="overtimeMultiplier"]'
    );
  }

  private get savePayrollButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Save Payroll'
    });
  }

  // Tax Settings

  private get defaultTaxInput(): Locator {
    return this.page.locator(
      'input[name="defaultTax"]'
    );
  }

  private get saveTaxButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Save Tax'
    });
  }

  // Currency Settings

  private get currencyCodeInput(): Locator {
    return this.page.locator(
      'input[name="code"]'
    );
  }

  private get currencySymbolInput(): Locator {
    return this.page.locator(
      'input[name="symbol"]'
    );
  }

  private get saveCurrencyButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Save Currency'
    });
  }

  // Actions

  async openSettings() {
    await this.settingsMenu.click();
  }

  async updateCompany(
    name: string,
    email: string,
    phone: string
  ) {
    await this.companyNameInput.fill(name);
    await this.companyEmailInput.fill(email);
    await this.companyPhoneInput.fill(phone);

    await this.saveCompanyButton.click();
  }

  async updatePayrollSettings(
    payDay: string,
    defaultPf: string,
    overtimeMultiplier: string
  ) {
    await this.payDayInput.fill(payDay);
    await this.defaultPfInput.fill(defaultPf);
    await this.overtimeMultiplierInput.fill(
      overtimeMultiplier
    );

    await this.savePayrollButton.click();
  }

  async updateTax(tax: string) {
    await this.defaultTaxInput.clear();
    await this.defaultTaxInput.fill(tax);

    await this.saveTaxButton.click();
  }

  async updateCurrency(
    code: string,
    symbol: string
  ) {
    await this.currencyCodeInput.fill(code);
    await this.currencySymbolInput.fill(symbol);

    await this.saveCurrencyButton.click();
  }
}