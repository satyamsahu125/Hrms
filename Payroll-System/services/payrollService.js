const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const SalaryStructure = require('../models/SalaryStructure');
const Expense = require('../models/Expense');
const { calculatePayroll } = require('../utils/payrollCalculator');
const { getWorkingDaysInMonth } = require('../utils/helpers');
const { trackActivity } = require('../middleware/audit');

const generateMonthlyPayroll = async (month, year, userId) => {
  const employees = await Employee.find({ status: 'active' })
    .populate('salaryStructure');

  const results = { created: 0, skipped: 0, errors: [] };
  const workingDays = getWorkingDaysInMonth(year, month);

  for (const emp of employees) {
    try {
      const existing = await Payroll.findOne({ employee: emp._id, month, year });
      if (existing) {
        results.skipped++;
        continue;
      }

      let salary = emp.salaryStructure;
      if (!salary) {
        salary = await SalaryStructure.findOne({ employee: emp._id });
      }
      if (!salary) {
        results.errors.push({ employee: emp.employeeId, message: 'No salary structure' });
        continue;
      }

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const attendanceRecords = await Attendance.find({
        employee: emp._id,
        date: { $gte: startDate, $lte: endDate }
      });

      const presentDays = attendanceRecords.filter((a) =>
        ['present', 'late', 'half_day'].includes(a.status)
      ).length;

      const overtimeHours = attendanceRecords.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
      const overtimeRate = (salary.basicSalary / workingDays / 8) * 1.5;

      const calc = calculatePayroll(salary, {
        workingDays,
        presentDays: presentDays || workingDays
      }, {
        overtime: Math.round(overtimeHours * overtimeRate)
      });

      await Payroll.create({
        employee: emp._id,
        month,
        year,
        earnings: calc.earnings,
        deductions: calc.deductions,
        grossSalary: calc.grossSalary,
        totalDeductions: calc.totalDeductions,
        netSalary: calc.netSalary,
        workingDays: calc.workingDays,
        presentDays: calc.presentDays,
        status: 'pending_approval'
      });

      await Expense.create({
        category: 'payroll',
        description: `Payroll ${month}/${year} - ${emp.employeeId}`,
        amount: calc.netSalary,
        month,
        year,
        recordedBy: userId
      });

      results.created++;
    } catch (err) {
      results.errors.push({ employee: emp.employeeId, message: err.message });
    }
  }

  if (userId) {
    await trackActivity(userId, 'generate_payroll', 'payroll', { month, year, results });
  }

  return results;
};

module.exports = { generateMonthlyPayroll };
