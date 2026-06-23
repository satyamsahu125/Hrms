import { test, expect } from '@playwright/test';
import { LoginUtil } from '../../utils/LoginUtil';
import { PayrollPage } from '../../pages/PayrollPage';
import { EmployeePage } from '../../pages/EmployeePage';
test('validate new eployee payroll Generation for old date ', async ({ page }) => {

    const employeePage = new EmployeePage(page);
    const payrollPage = new PayrollPage(page);

    await LoginUtil.loginAsAdmin(page);

    await employeePage.openEmployeesPage();

    await employeePage.createEmployee({
        firstName: 'QA',
        lastName: 'Tester',
        email: `qa${Date.now()}@mail.com`,
        phone: '9999999999',
        departmentId: 'Engineering',
        designation: 'Tester',
        basicSalary: '30000',
        hra: '5000',
        da: '2000'
    });

    await payrollPage.openPayrollPage();

    await payrollPage.generatePayroll('9');
    const employeeNames = await payrollPage.getAllEmployeeNames();

    console.log(employeeNames);
    expect(
        employeeNames.some(name => name.includes('QA Tester'))
    ).toBeTruthy();

});