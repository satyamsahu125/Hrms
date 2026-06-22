import { Page, Locator } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  private get emailInput(): Locator {
    return this.page.locator('input[type="email"]');
  }

  private get passwordInput(): Locator {
    return this.page.locator('input[type="password"]');
  }

  private get rememberMeCheckbox(): Locator {
    return this.page.locator('#rememberMe');
  }

  private get loginButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickRememberMe() {
    await this.rememberMeCheckbox.check();
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async loginWithRememberMe(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickRememberMe();
    await this.clickLogin();
  }
}