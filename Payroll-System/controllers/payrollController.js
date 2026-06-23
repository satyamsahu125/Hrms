const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { generateMonthlyPayroll } = require('../services/payrollService');
const { generateSalarySlipPDF } = require('../utils/exportHelpers');
const Settings = require('../models/Settings');
const { createNotification } = require('../services/notificationService');
const { sendPayrollNotification } = require('../services/emailService');
const User = require('../models/User');
const { paginate, getMonthName } = require('../utils/helpers');
const { trackActivity } = require('../middleware/audit');
const { ADMIN_ROLES } = require('../config/roles');

exports.index = async (req, res) => {
  const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();
  const filter = { month, year };

  if (!ADMIN_ROLES.includes(req.session.user.role)) {
    const empId = req.session.user.employee?._id || req.session.user.employee;
    filter.employee = empId;
  }

  const payrolls = await Payroll.find(filter)
    .populate('employee', 'firstName lastName employeeId department')
    .populate('approvedBy', 'email')
    .sort({ 'employee.lastName': 1 });

  const summary = await Payroll.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$netSalary' }
      }
    }
  ]);

  res.render('payroll/index', {
    title: 'Payroll',
    payrolls,
    month,
    year,
    monthName: getMonthName(month),
    summary
  });
};

exports.generate = async (req, res) => {
  try {
    const month = parseInt(req.body.month, 10);
    const year = parseInt(req.body.year, 10);
    const results = await generateMonthlyPayroll(month, year, req.session.user._id);
    req.session.success = `Payroll generated: ${results.created} created, ${results.skipped} skipped`;
    res.redirect(`/payroll?month=${month}&year=${year}`);
  } catch (err) {
    req.session.error = 'Payroll generation failed';
    res.redirect('/payroll');
  }
};

exports.approve = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate('employee');
    if (!payroll) {
      req.session.error = 'Payroll not found';
      return res.redirect('/payroll');
    }

    payroll.status = req.body.action === 'approve' ? 'approved' : 'rejected';
    payroll.approvedBy = req.session.user._id;
    payroll.approvedAt = new Date();
    if (payroll.status === 'approved') payroll.paidAt = new Date();
    await payroll.save();

    const empUser = await User.findOne({ employee: payroll.employee._id });
    if (empUser) {
      await createNotification(empUser._id, 'Payroll Approved',
        `Payroll for ${payroll.month}/${payroll.year} approved`, 'payroll');
      await sendPayrollNotification(empUser, payroll);
    }

    await trackActivity(req.session.user._id, payroll.status, 'payroll', { id: payroll._id });
    req.session.success = `Payroll ${payroll.status}`;
    res.redirect('/payroll');
  } catch (err) {
    req.session.error = 'Approval failed';
    res.redirect('/payroll');
  }
};

exports.show = async (req, res) => {
  const payroll = await Payroll.findById(req.params.id)
    .populate('employee')
    .populate('approvedBy', 'email');
  if (!payroll) {
    req.session.error = 'Payroll not found';
    return res.redirect('/payroll');
  }
  res.render('payroll/show', { title: 'Payroll Details', payroll, monthName: getMonthName(payroll.month) });
};

exports.downloadSlip = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate('employee');
    if (!payroll) return res.status(404).send('Not found');

    const companySetting = await Settings.findOne({ key: 'company' });
    const company = companySetting?.value || { name: process.env.COMPANY_NAME };

    const pdf = await generateSalarySlipPDF(payroll, payroll.employee, company);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=slip-${payroll.employee.employeeId}-${payroll.month}-${payroll.year}.pdf`);
    res.send(pdf);
  } catch (err) {
    req.session.error = 'Failed to generate slip';
    res.redirect('/payroll');
  }
};

exports.bulkApprove = async (req, res) => {
  const { month, year } = req.body;
  await Payroll.updateMany(
    { month: parseInt(month), year: parseInt(year), status: 'pending_approval' },
    { status: 'approved', approvedBy: req.session.user._id, approvedAt: new Date() }
  );
  req.session.success = 'All pending payrolls approved';
  res.redirect(`/payroll?month=${month}&year=${year}`);
};
