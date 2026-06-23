import { Page, Locator } from '@playwright/test';

export interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  designation: string;
  basicSalary: string;
  hra: string;
  da: string;
}

export class EmployeePage {
  constructor(private page: Page) {}

  // =========================
  // Navigation
  // =========================

  private get employeesMenu(): Locator {
    return this.page.getByRole('link', {
      name: 'Employees'
    });
  }

  private get addEmployeeLink(): Locator {
    return this.page.getByRole('link', {
      name: 'Add Employee'
    });
  }

  private get editEmployeeLink(): Locator {
    return this.page
      .getByRole('link')
      .filter({ hasText: /^$/ })
      .nth(1);
  }

  private get cancelButton(): Locator {
    return this.page.getByRole('link', {
      name: 'Cancel'
    });
  }

  // =========================
  // Form Fields
  // =========================

  private get firstNameInput(): Locator {
    return this.page.locator(
      'input[name="firstName"]'
    );
  }

  private get lastNameInput(): Locator {
    return this.page.locator(
      'input[name="lastName"]'
    );
  }

  private get emailInput(): Locator {
    return this.page.locator(
      'input[name="email"]'
    );
  }

  private get phoneInput(): Locator {
    return this.page.locator(
      'input[name="phone"]'
    );
  }

  private get departmentDropdown(): Locator {
    return this.page.getByRole('combobox');
  }

  private get designationInput(): Locator {
    return this.page.locator(
      'input[name="designation"]'
    );
  }

  private get basicSalaryInput(): Locator {
    return this.page.locator(
      'input[name="basicSalary"]'
    );
  }

  private get hraInput(): Locator {
    return this.page.locator(
      'input[name="hra"]'
    );
  }

  private get daInput(): Locator {
    return this.page.locator(
      'input[name="da"]'
    );
  }

  private get statusDropdown(): Locator {
    return this.page.locator(
      'select[name="status"]'
    );
  }

  private get createLoginCheckbox(): Locator {
    return this.page.getByRole('checkbox', {
      name: 'Create login account'
    });
  }

  // =========================
  // Buttons
  // =========================

  private get createEmployeeButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Create Employee'
    });
  }

  private get updateButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Update'
    });
  }

  // =========================
  // Navigation Methods
  // =========================

  async openEmployeesPage() {
    await this.employeesMenu.click();
  }

  async clickAddEmployee() {
    await this.addEmployeeLink.click();
  }

  async openEmployeeForEdit() {
    await this.editEmployeeLink.click();
  }

  // =========================
  // Create Employee
  // =========================

  async fillEmployeeForm(
    data: EmployeeData
  ) {
    await this.firstNameInput.fill(
      data.firstName
    );

    await this.lastNameInput.fill(
      data.lastName
    );

    await this.emailInput.fill(
      data.email
    );

    await this.phoneInput.fill(
      data.phone
    );

    await this.departmentDropdown.selectOption(
      data.departmentId
    );

    await this.designationInput.fill(
      data.designation
    );

    await this.basicSalaryInput.fill(
      data.basicSalary
    );

    await this.hraInput.fill(
      data.hra
    );

    await this.daInput.fill(
      data.da
    );
  }

  async enableLoginAccount() {
    await this.createLoginCheckbox.check();
  }

  async disableLoginAccount() {
    await this.createLoginCheckbox.uncheck();
  }

  async submitEmployee() {
    await this.createEmployeeButton.click();
  }

  async cancelEmployeeCreation() {
    await this.cancelButton.click();
  }

  async createEmployee(
    data: EmployeeData,
    createLogin = true
  ) {
    await this.clickAddEmployee();

    const options = await this.departmentDropdown.locator('option').allTextContents();

console.log(options);
    await this.fillEmployeeForm(data);

    
    if (createLogin) {
      await this.enableLoginAccount();
    }

    await this.submitEmployee();
  }

  // =========================
  // Edit Employee
  // =========================

  async updateStatus(
    status: 'active' | 'inactive'
  ) {
    await this.statusDropdown.selectOption(
      status
    );
  }

  async updateEmployee(
    data: Partial<EmployeeData>,
    status?: 'active' | 'inactive'
  ) {
    if (data.firstName) {
      await this.firstNameInput.fill(
        data.firstName
      );
    }

    if (data.lastName) {
      await this.lastNameInput.fill(
        data.lastName
      );
    }

    if (data.email) {
      await this.emailInput.fill(
        data.email
      );
    }

    if (data.phone) {
      await this.phoneInput.fill(
        data.phone
      );
    }

    if (data.designation) {
      await this.designationInput.fill(
        data.designation
      );
    }

    if (data.basicSalary) {
      await this.basicSalaryInput.fill(
        data.basicSalary
      );
    }

    if (data.hra) {
      await this.hraInput.fill(
        data.hra
      );
    }

    if (data.da) {
      await this.daInput.fill(
        data.da
      );
    }

    if (status) {
      await this.updateStatus(status);
    }

    await this.updateButton.click();
  }
}