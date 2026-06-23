const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Payroll = require('../models/Payroll');
const Expense = require('../models/Expense');
const AuditLog = require('../models/AuditLog');

const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

  const [
    employeeCount,
    departmentCount,
    presentToday,
    pendingLeaves,
    monthlyPayroll,
    recentActivities
  ] = await Promise.all([
    Employee.countDocuments({ status: 'active' }),
    Department.countDocuments({ isActive: true }),
    Attendance.countDocuments({ date: { $gte: today }, status: { $in: ['present', 'late'] } }),
    Leave.countDocuments({ status: 'pending' }),
    Payroll.aggregate([
      {
        $match: {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          status: { $in: ['approved', 'paid'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$netSalary' } } }
    ]),
    AuditLog.find().sort({ createdAt: -1 }).limit(8).populate('user', 'email role')
  ]);

  const payrollExpenses = monthlyPayroll[0]?.total || 0;

  const leaveStats = await Leave.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      }
    },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const attendanceSummary = await Attendance.aggregate([
    {
      $match: { date: { $gte: startOfMonth, $lte: endOfMonth } }
    },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const salaryChart = await Payroll.aggregate([
    {
      $match: {
        year: today.getFullYear(),
        status: { $in: ['approved', 'paid'] }
      }
    },
    {
      $group: {
        _id: '$month',
        total: { $sum: '$netSalary' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return {
    employeeCount,
    departmentCount,
    payrollExpenses,
    presentToday,
    pendingLeaves,
    leaveStats,
    attendanceSummary,
    salaryChart,
    recentActivities
  };
};

module.exports = { getDashboardStats };
