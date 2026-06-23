import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { EmployeePage } from '../../pages/EmployeePage';
import { NEW_EMPLOYEE } from '../../test-data/employees';
test('Admin can create employee', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const employeePage = new EmployeePage(page);

  await loginPage.goto();

  await loginPage.login(
    'admin@payroll.com',
    'Admin@123'
  );

  await employeePage.openEmployeesPage();

  
  // await employeePage.createEmployee({
  //   firstName: 'Test',
  //   lastName: 'User',
  //   email: `test${Date.now()}@mail.com`,
  //   phone: '9876543210',
  //   departmentId: 'Engineering',
  //   designation: 'QA Engineer',
  //   basicSalary: '50000',
  //   hra: '5000',
  //   da: '3000'
  // });
      await employeePage.createEmployee(NEW_EMPLOYEE);
});