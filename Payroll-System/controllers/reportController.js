const Payroll = require('../models/Payroll');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const { exportToExcel, exportToCSV } = require('../utils/exportHelpers');
const { getMonthName } = require('../utils/helpers');

exports.index = (req, res) => {
  res.render('reports/index', { title: 'Reports' });
};

exports.payrollReport = async (req, res) => {
  const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();

  const payrolls = await Payroll.find({ month, year, status: { $in: ['approved', 'paid'] } })
    .populate('employee', 'firstName lastName employeeId department')
    .lean();

  const data = payrolls.map((p) => ({
    EmployeeID: p.employee?.employeeId,
    Name: `${p.employee?.firstName} ${p.employee?.lastName}`,
    Month: month,
    Year: year,
    Gross: p.grossSalary,
    Deductions: p.totalDeductions,
    Net: p.netSalary,
    Status: p.status
  }));

  if (req.query.format === 'excel') {
    const buffer = exportToExcel(data, 'Payroll Report');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=payroll-${month}-${year}.xlsx`);
    return res.send(buffer);
  }
  if (req.query.format === 'csv') {
    const csv = exportToCSV(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=payroll-${month}-${year}.csv`);
    return res.send(csv);
  }

  res.render('reports/payroll', {
    title: 'Payroll Report',
    data,
    month,
    year,
    monthName: getMonthName(month)
  });
};

exports.attendanceReport = async (req, res) => {
  const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const records = await Attendance.find({ date: { $gte: start, $lte: end } })
    .populate('employee', 'firstName lastName employeeId')
    .lean();

  const data = records.map((r) => ({
    EmployeeID: r.employee?.employeeId,
    Name: `${r.employee?.firstName} ${r.employee?.lastName}`,
    Date: r.date.toISOString().split('T')[0],
    Status: r.status,
    CheckIn: r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '',
    CheckOut: r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '',
    Hours: r.workHours,
    Overtime: r.overtimeHours
  }));

  if (req.query.format === 'excel') {
    const buffer = exportToExcel(data, 'Attendance');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=attendance-${month}-${year}.xlsx`);
    return res.send(buffer);
  }
  if (req.query.format === 'csv') {
    return res.send(exportToCSV(data));
  }

  res.render('reports/attendance', { title: 'Attendance Report', data, month, year });
};

exports.leaveReport = async (req, res) => {
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();
  const leaves = await Leave.find({
    startDate: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) }
  }).populate('employee', 'firstName lastName employeeId').lean();

  const data = leaves.map((l) => ({
    EmployeeID: l.employee?.employeeId,
    Name: `${l.employee?.firstName} ${l.employee?.lastName}`,
    Type: l.leaveType,
    Start: l.startDate.toISOString().split('T')[0],
    End: l.endDate.toISOString().split('T')[0],
    Days: l.totalDays,
    Status: l.status
  }));

  if (req.query.format === 'excel') {
    const buffer = exportToExcel(data, 'Leave Report');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=leave-${year}.xlsx`);
    return res.send(buffer);
  }

  res.render('reports/leave', { title: 'Leave Report', data, year });
};

exports.employeeReport = async (req, res) => {
  const employees = await Employee.find()
    .populate('department', 'name code')
    .lean();

  const data = employees.map((e) => ({
    EmployeeID: e.employeeId,
    Name: `${e.firstName} ${e.lastName}`,
    Email: e.email,
    Department: e.department?.name,
    Designation: e.designation,
    Status: e.status,
    JoiningDate: e.joiningDate ? new Date(e.joiningDate).toISOString().split('T')[0] : ''
  }));

  if (req.query.format === 'excel') {
    const buffer = exportToExcel(data, 'Employees');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=employees.xlsx');
    return res.send(buffer);
  }
  if (req.query.format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
    return res.send(exportToCSV(data));
  }

  res.render('reports/employees', { title: 'Employee Report', data });
};
