const Leave = require('../models/Leave');
const LeaveBalance = require('../models/LeaveBalance');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { LEAVE_TYPES } = require('../models/Leave');
const { createNotification } = require('../services/notificationService');
const { sendLeaveNotification } = require('../services/emailService');
const { trackActivity } = require('../middleware/audit');
const { ADMIN_ROLES, MANAGEMENT_ROLES } = require('../config/roles');

exports.index = async (req, res) => {
  const filter = {};
  if (!ADMIN_ROLES.includes(req.session.user.role)) {
    const empId = req.session.user.employee?._id || req.session.user.employee;
    filter.employee = empId;
  }
  if (req.query.status) filter.status = req.query.status;

  const leaves = await Leave.find(filter)
    .populate('employee', 'firstName lastName employeeId')
    .populate('approvedBy', 'email')
    .sort({ createdAt: -1 });

  res.render('leave/index', { title: 'Leave Management', leaves, leaveTypes: LEAVE_TYPES });
};

exports.applyForm = async (req, res) => {
  const empId = req.session.user.employee?._id || req.session.user.employee;
  const balance = await LeaveBalance.findOne({
    employee: empId,
    year: new Date().getFullYear()
  });
  res.render('leave/apply', { title: 'Apply Leave', leaveTypes: LEAVE_TYPES, balance });
};

exports.apply = async (req, res) => {
  try {
    const empId = req.session.user.employee?._id || req.session.user.employee;
    const start = new Date(req.body.startDate);
    const end = new Date(req.body.endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const leave = await Leave.create({
      employee: empId,
      leaveType: req.body.leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason: req.body.reason
    });

    const hrUsers = await User.find({ role: { $in: ['hr', 'super_admin', 'manager'] } });
    for (const u of hrUsers) {
      await createNotification(u._id, 'New Leave Request',
        `Leave request pending approval`, 'leave', '/leave');
    }

    await trackActivity(req.session.user._id, 'apply', 'leave', { id: leave._id });
    req.session.success = 'Leave application submitted';
    res.redirect('/leave');
  } catch (err) {
    req.session.error = 'Failed to apply leave';
    res.redirect('/leave/apply');
  }
};

exports.approve = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate('employee');
    if (!leave) {
      req.session.error = 'Leave not found';
      return res.redirect('/leave');
    }

    leave.status = req.body.action === 'approve' ? 'approved' : 'rejected';
    leave.approvedBy = req.session.user._id;
    leave.approvedAt = new Date();
    if (leave.status === 'rejected') leave.rejectionReason = req.body.reason;
    await leave.save();

    if (leave.status === 'approved') {
      const balance = await LeaveBalance.findOne({
        employee: leave.employee._id,
        year: new Date().getFullYear()
      });
      if (balance && balance.used[leave.leaveType] !== undefined) {
        balance.used[leave.leaveType] += leave.totalDays;
        await balance.save();
      }
    }

    const empUser = await User.findOne({ employee: leave.employee._id });
    if (empUser) {
      await createNotification(empUser._id, `Leave ${leave.status}`,
        `Your leave request has been ${leave.status}`, 'leave');
      await sendLeaveNotification(empUser, leave, leave.status);
    }

    req.session.success = `Leave ${leave.status}`;
    res.redirect('/leave');
  } catch (err) {
    req.session.error = 'Action failed';
    res.redirect('/leave');
  }
};

exports.balance = async (req, res) => {
  const empId = req.query.employee || req.session.user.employee?._id;
  const balance = await LeaveBalance.findOne({
    employee: empId,
    year: new Date().getFullYear()
  }).populate('employee', 'firstName lastName employeeId');

  res.render('leave/balance', { title: 'Leave Balance', balance });
};
