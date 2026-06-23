# Test Strategy

## 1. Top 5 Critical Flows (Ranked by Business Impact)

### 1. Attendance → Overtime → Payroll → Payslip

**Who gets hurt:** Employee

**Worst case:** Employee is paid less than earned and loses trust in the company.

---

### 2. Employee Onboarding → Payroll Eligibility

**Who gets hurt:** New Employee

**Worst case:** Employee is missing from payroll and does not receive salary.

---

### 3. Salary / Tax Configuration → Payroll Generation

**Who gets hurt:** Employee, Finance Team

**Worst case:** Incorrect deductions or salary calculations affecting multiple employees.

---

### 4. Leave Request → Approval → Payroll

**Who gets hurt:** Employee, HR Team

**Worst case:** Wrong leave deductions result in incorrect salary payment.

---

### 5. Authentication & Authorization

**Who gets hurt:** Employees, Company

**Worst case:** Unauthorized user accesses payroll and employee information.

---

## 2. Automation vs Manual Testing

| Area                | Automation | Manual |
| ------------------- | ---------- | ------ |
| Login               | ✓          |        |
| Employee CRUD       | ✓          |        |
| Attendance          | ✓          |        |
| Payroll             | ✓          |        |
| Leave Workflow      | ✓          |        |
| Reports             |            | ✓      |
| UI Layout           |            | ✓      |
| Exploratory Testing |            | ✓      |

### Why?

I automate repetitive business-critical workflows that run on every release.

I keep manual testing for visual checks, exploratory testing, and areas where automation provides low value.

To keep CI fast, only critical regression tests run on every commit. Longer exploratory and extended validations remain manual.

---

## 3. What I Will Not Test

### Email Delivery

Handled by third-party services and outside assignment scope.

### Performance Testing

Requires dedicated environment and workload simulation.

### Security Penetration Testing

Requires specialized tools and security assessment.

### Cross Browser Testing

Focus of this assignment is business workflow validation rather than browser compatibility.

---

## 4. Quality Philosophy

I prioritize testing based on business impact, not feature count.

A dashboard issue may inconvenience a user.

A payroll issue can affect employee salary.

An authorization issue can expose sensitive employee data.

For that reason Payroll, Attendance, and Authorization receive the highest testing priority in this HRMS system.
