require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');

const User = require('../models/User');
const Department = require('../models/Department');
const Employee = require('../models/Employee');
const SalaryStructure = require('../models/SalaryStructure');
const LeaveBalance = require('../models/LeaveBalance');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Payroll = require('../models/Payroll');
const Settings = require('../models/Settings');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const Expense = require('../models/Expense');
const { ROLES } = require('../config/roles');
const { calculatePayroll } = require('../utils/payrollCalculator');

const seed = async () => {
  await connectDB();
  console.log('Clearing database...');
  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Employee.deleteMany({}),
    SalaryStructure.deleteMany({}),
    LeaveBalance.deleteMany({}),
    Attendance.deleteMany({}),
    Leave.deleteMany({}),
    Payroll.deleteMany({}),
    Settings.deleteMany({}),
    Notification.deleteMany({}),
    AuditLog.deleteMany({}),
    Expense.deleteMany({})
  ]);

  const departments = await Department.insertMany([
    { name: 'Human Resources', code: 'HR', description: 'HR operations' },
    { name: 'Engineering', code: 'ENG', description: 'Software development' },
    { name: 'Finance', code: 'FIN', description: 'Financial operations' },
    { name: 'Sales', code: 'SAL', description: 'Sales and marketing' }
  ]);

  const salaryData = [
    { basic: 80000, hra: 20000, da: 5000 },
    { basic: 95000, hra: 24000, da: 6000 },
    { basic: 70000, hra: 18000, da: 4000 },
    { basic: 65000, hra: 15000, da: 3500 },
    { basic: 55000, hra: 12000, da: 3000 },
    { basic: 60000, hra: 14000, da: 3200 }
  ];

  const empDefs = [
    { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@acme.com', dept: 0, designation: 'HR Director', id: 'HR0001', role: ROLES.HR },
    { firstName: 'James', lastName: 'Chen', email: 'james.c@acme.com', dept: 1, designation: 'Engineering Manager', id: 'ENG0001', role: ROLES.MANAGER },
    { firstName: 'Emily', lastName: 'Davis', email: 'emily.d@acme.com', dept: 1, designation: 'Senior Developer', id: 'ENG0002', role: ROLES.EMPLOYEE },
    { firstName: 'Michael', lastName: 'Brown', email: 'michael.b@acme.com', dept: 2, designation: 'Financial Analyst', id: 'FIN0001', role: ROLES.EMPLOYEE },
    { firstName: 'Lisa', lastName: 'Wilson', email: 'lisa.w@acme.com', dept: 3, designation: 'Sales Executive', id: 'SAL0001', role: ROLES.EMPLOYEE },
    { firstName: 'David', lastName: 'Martinez', email: 'david.m@acme.com', dept: 1, designation: 'Junior Developer', id: 'ENG0003', role: ROLES.EMPLOYEE }
  ];

  const employees = [];
  for (let i = 0; i < empDefs.length; i++) {
    const def = empDefs[i];
    const sal = salaryData[i];
    const emp = await Employee.create({
      employeeId: def.id,
      firstName: def.firstName,
      lastName: def.lastName,
      email: def.email,
      phone: `+1-555-010${i}`,
      department: departments[def.dept]._id,
      designation: def.designation,
      joiningDate: new Date(2022, i, 15),
      status: 'active',
      profilePhoto: '/images/default-avatar.svg'
    });

    const structure = await SalaryStructure.create({
      employee: emp._id,
      basicSalary: sal.basic,
      hra: sal.hra,
      da: sal.da,
      conveyance: 2000,
      medical: 1500,
      specialAllowance: 3000
    });
    emp.salaryStructure = structure._id;
    await emp.save();

    await LeaveBalance.create({ employee: emp._id, year: new Date().getFullYear() });
    employees.push({ emp, role: def.role, email: def.email });
  }

  departments[0].head = employees[0].emp._id;
  departments[1].head = employees[1].emp._id;
  await departments[0].save();
  await departments[1].save();

  const adminUser = await User.create({
    email: 'admin@payroll.com',
    password: 'Admin@123',
    role: ROLES.SUPER_ADMIN
  });

  for (const { emp, role, email } of employees) {
    const user = await User.create({
      email,
      password: 'Employee@123',
      role,
      employee: emp._id
    });
    emp.user = user._id;
    await emp.save();
  }

  const today = new Date();
  for (const { emp } of employees) {
    for (let d = 1; d <= 20; d++) {
      const date = new Date(today.getFullYear(), today.getMonth(), d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      const checkIn = new Date(date);
      checkIn.setHours(9, Math.floor(Math.random() * 30), 0);
      const checkOut = new Date(date);
      checkOut.setHours(17 + Math.floor(Math.random() * 2), 0, 0);
      await Attendance.create({
        employee: emp._id,
        date,
        checkIn,
        checkOut,
        status: checkIn.getHours() > 9 ? 'late' : 'present',
        workHours: 8,
        overtimeHours: Math.random() > 0.8 ? 2 : 0
      });
    }
  }

  await Leave.create({
    employee: employees[2].emp._id,
    leaveType: 'annual',
    startDate: new Date(today.getFullYear(), today.getMonth(), 25),
    endDate: new Date(today.getFullYear(), today.getMonth(), 27),
    totalDays: 3,
    reason: 'Family vacation',
    status: 'pending'
  });

  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  for (const { emp } of employees) {
    const structure = await SalaryStructure.findOne({ employee: emp._id });
    const calc = calculatePayroll(structure, { workingDays: 22, presentDays: 20 });
    await Payroll.create({
      employee: emp._id,
      month,
      year,
      earnings: calc.earnings,
      deductions: calc.deductions,
      grossSalary: calc.grossSalary,
      totalDeductions: calc.totalDeductions,
      netSalary: calc.netSalary,
      workingDays: 22,
      presentDays: 20,
      status: 'approved',
      approvedBy: adminUser._id,
      approvedAt: new Date()
    });
  }

  await Settings.insertMany([
    {
      key: 'company',
      category: 'company',
      value: {
        name: 'Acme Corporation',
        email: 'hr@acme.com',
        phone: '+1-800-555-0100',
        address: '123 Business Park, Suite 100, New York, NY 10001'
      }
    },
    {
      key: 'payroll',
      category: 'payroll',
      value: { payDay: 1, defaultPf: 12, overtimeMultiplier: 1.5 }
    },
    { key: 'tax', category: 'tax', value: { defaultTax: 10 } },
    { key: 'currency', category: 'currency', value: { code: 'USD', symbol: '$' } }
  ]);

  await Notification.create({
    user: adminUser._id,
    title: 'Welcome to PayrollPro',
    message: 'Your enterprise payroll system is ready. Explore the dashboard!',
    type: 'system',
    link: '/dashboard'
  });

  console.log('\n✅ Seed completed!\n');
  console.log('Login credentials:');
  console.log('  Super Admin: admin@payroll.com / Admin@123');
  console.log('  HR:          sarah.j@acme.com / Employee@123');
  console.log('  Manager:     james.c@acme.com / Employee@123');
  console.log('  Employee:    emily.d@acme.com / Employee@123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
