# Test Strategy

## Overview

This HRMS and Payroll Management System is used to manage employee information, attendance, leave requests, payroll processing, and payslip generation.

The main goal of this system is to make sure employees are paid correctly and on time. Because of that, testing is focused more on business impact than UI appearance. A payroll issue can directly affect employee salary, while a small UI issue usually has less impact on the business.

---

# Top 5 Critical Flows

## 1. Attendance + Leave + Overtime → Payroll Calculation → Payslip Generation

### Why This Flow Is Critical

This is the most important flow in the application. Payroll calculations depend on many modules working together.

The payroll calculation uses:

- Employee information
- Attendance records
- Approved leave records
- Overtime records
- Salary details
- Tax settings
- Employee status

If any of this information is incorrect, the final payroll can also become incorrect.

### Business Impact

If this flow fails:

- Employees may receive less salary than they earned.
- Employees may receive extra salary by mistake.
- Payroll calculations become unreliable.
- HR and payroll teams must spend time fixing mistakes manually.
- Employee trust in the company can be affected.

### Users Affected

- Employees
- HR Team
- Payroll Team

---

## 2. Employee Creation → Payroll Processing

# flow:
(HR Dashboard → Employees Module → Add Employee Form → Employee Record → Payroll Module)

### Why This Flow Is Critical

Every employee must exist in the system before attendance, leave, and payroll can work correctly.

If employee information is missing or incorrect, payroll processing may fail.

### Business Impact

If this flow fails:

- Employees may not appear in payroll.
- Attendance records cannot be tracked correctly.
- Leave management may not work properly.
- New employees may miss their salary payment.

### Users Affected

- HR Team
- Employees

---

## 3. Salary or Tax Update → Future Payroll Generation

# flow: 
(Admin Profile → Tax Percentage Update → Payroll Generation)

### Why This Flow Is Critical

When HR or Admin updates salary or tax information, the next payroll should use the latest values.

The system should not continue using old salary or tax values.

### Business Impact

If this flow fails:

- Employees receive incorrect salary.
- Tax deductions become incorrect.
- Payroll disputes increase.
- Payroll staff need to make manual corrections.

### Users Affected

- Employees
- Payroll Team
- Finance Team

---

## 4. Leave Request → HR Approval → Payroll Impact
# flow: 
(Employee Dashboard → Leave Request → HR Approval → Payroll Calculation)

### Why This Flow Is Critical

Approved leave should affect attendance records and payroll calculations correctly.

If leave information is not handled correctly, payroll results can become inaccurate.

### Business Impact

If this flow fails:

- Leave balances may become incorrect.
- Payroll calculations may be wrong.
- Employees may be paid for days they were absent.
- Leave deductions may not be applied correctly.

### Users Affected

- Employees
- HR Team
- Payroll Team

---

## 5. Payroll Approval → Payslip Download


### Why This Flow Is Critical

After payroll is generated, employees should be able to view and download their payslips.

Employees use payslips to verify salary details and deductions.

### Business Impact

If this flow fails:

- Employees cannot verify salary information.
- Payroll transparency is reduced.
- HR receives additional support requests.
- Employees may lose confidence in payroll accuracy.

### Users Affected

- Employees
- Payroll Team

---

# Automation Testing Scope

The following areas will be automated because they are high-risk business flows and are used frequently.

## E2E Automation

- Login
- Employee onboarding
- Employee profile update
- Attendance management
- Leave workflow
- Payroll generation
- Payslip verification

## API Automation

- Authentication APIs
- Employee APIs
- Attendance APIs
- Leave APIs
- Payroll APIs
- Validation and error handling scenarios

---

# Automation Priority

## Priority 1 (Highest Business Risk)

- Attendance to Payroll flow
- Leave impact on Payroll
- Overtime impact on Payroll
- Payroll generation
- Payslip generation
- Salary and Tax update validation

## Priority 2

- Employee onboarding
- Employee profile updates
- Leave approval workflow
- Employee status changes

## Priority 3

- Reports
- Notifications
- Dashboard statistics

---

# Manual Testing Scope

The following areas will mainly be tested manually:

- UI appearance
- Responsive design
- Exploratory testing
- Accessibility checks
- PDF payslip layout verification

### Reason

These areas require more visual verification and usually provide lower automation value compared to payroll-related business flows.

---

# Out of Scope

The following areas are not included in this assignment:

- Email delivery reliability
- Browser compatibility testing
- Performance and load testing
- Security penetration testing

### Reason

These areas require separate tools, environments, and additional time. The focus of this assignment is payroll and employee management quality.

---

# Test Data Strategy

Test data will be managed using fixtures and seed scripts.

Each automated test should:

- Create its own data
- Not depend on previous test execution
- Clean up created records whenever possible

This helps keep tests stable and suitable for CI execution.

---

# Risk Assessment

## Highest Risk Flow

Attendance + Leave + Overtime + Salary Configuration + Tax Settings

↓

Payroll Calculation

↓

Payslip Generation

### Why It Is Highest Risk

This is the most important business flow in the application.

Payroll depends on information coming from several modules. If any one of those modules contains incorrect data, the final salary calculation may be wrong.

### Business Impact

If this flow fails:

- Employees may be underpaid or overpaid.
- Payroll disputes increase.
- Manual payroll corrections become necessary.
- Financial reporting becomes inaccurate.
- Employee trust in the system decreases.

Therefore, this flow receives the highest automation priority.

---

# Application Modules Covered

Based on analysis of the selected HRMS, the following modules were reviewed:

- Authentication & Authorization
- Employee Management
- Attendance Management
- Leave Management
- Payroll Management
- Payslip Generation
- Department Management
- Notifications
- Reports

---

# Critical Business Risks Identified

1. Incorrect payroll calculation causing employee underpayment or overpayment.
2. Unauthorized access to payroll information.
3. Payroll generation for inactive or terminated employees.
4. Leave records not correctly affecting payroll calculations.
5. Attendance records not correctly contributing to payroll calculations.

---

# Known Risk Areas Found During Exploratory Testing

During initial testing, the following issues were identified:

- Payroll can be generated before employee joining date.
- Tax percentage updates are not reflected in generated payroll.
- Terminated employees can still log in.
- Overtime is not included in payroll calculations.
- Approved leave still generates payroll incorrectly.
- Leave requests allow unrealistic date ranges.
- End date can be selected before start date.
- Employees may access payroll records belonging to other employees.

These areas will receive additional exploratory, negative, and regression testing.