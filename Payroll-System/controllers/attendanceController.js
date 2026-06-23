const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { paginate } = require('../utils/helpers');
const { trackActivity } = require('../middleware/audit');
const { ROLES, ADMIN_ROLES } = require('../config/roles');

const getEmployeeFilter = (req) => {
  if (ADMIN_ROLES.includes(req.session.user.role)) return {};
  if (req.session.user.employee) {
    return { employee: req.session.user.employee._id || req.session.user.employee };
  }
  return { employee: null };
};

exports.index = async (req, res) => {
  const { month, year } = req.query;
  const m = parseInt(month, 10) || new Date().getMonth() + 1;
  const y = parseInt(year, 10) || new Date().getFullYear();
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0, 23, 59, 59);

  const filter = { date: { $gte: start, $lte: end }, ...getEmployeeFilter(req) };
  if (req.query.employee && ADMIN_ROLES.includes(req.session.user.role)) {
    filter.employee = req.query.employee;
  }

  const [records, employees] = await Promise.all([
    Attendance.find(filter)
      .populate('employee', 'firstName lastName employeeId')
      .sort({ date: -1 }),
    Employee.find({ status: 'active' }).select('firstName lastName employeeId')
  ]);

  res.render('attendance/index', {
    title: 'Attendance',
    records,
    employees,
    month: m,
    year: y,
    filters: req.query
  });
};

exports.checkIn = async (req, res) => {
  try {
    const empId = req.session.user.employee?._id || req.session.user.employee;
    if (!empId) {
      req.session.error = 'No employee profile linked';
      return res.redirect('/attendance');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let record = await Attendance.findOne({ employee: empId, date: today });
    if (record && record.checkIn) {
      req.session.error = 'Already checked in today';
      return res.redirect('/attendance');
    }

    const now = new Date();
    const status = now.getHours() > 9 ? 'late' : 'present';

    if (record) {
      record.checkIn = now;
      record.status = status;
      await record.save();
    } else {
      record = await Attendance.create({
        employee: empId,
        date: today,
        checkIn: now,
        status
      });
    }

    req.session.success = 'Checked in successfully';
    res.redirect('/attendance');
  } catch (err) {
    req.session.error = 'Check-in failed';
    res.redirect('/attendance');
  }
};

exports.checkOut = async (req, res) => {
  try {
    const empId = req.session.user.employee?._id || req.session.user.employee;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await Attendance.findOne({ employee: empId, date: today });
    if (!record || !record.checkIn) {
      req.session.error = 'Please check in first';
      return res.redirect('/attendance');
    }
    if (record.checkOut) {
      req.session.error = 'Already checked out';
      return res.redirect('/attendance');
    }

    record.checkOut = new Date();
    const hours = (record.checkOut - record.checkIn) / (1000 * 60 * 60);
    record.workHours = Math.round(hours * 100) / 100;
    if (hours > 8) record.overtimeHours = Math.round((hours - 8) * 100) / 100;
    await record.save();

    req.session.success = 'Checked out successfully';
    res.redirect('/attendance');
  } catch (err) {
    req.session.error = 'Check-out failed';
    res.redirect('/attendance');
  }
};

exports.correct = async (req, res) => {
  try {
    const { id, status, checkIn, checkOut, notes } = req.body;
    const record = await Attendance.findById(id);
    if (!record) {
      req.session.error = 'Record not found';
      return res.redirect('/attendance');
    }

    if (status) record.status = status;
    if (checkIn) record.checkIn = new Date(checkIn);
    if (checkOut) record.checkOut = new Date(checkOut);
    if (notes) record.notes = notes;
    record.isManualCorrection = true;
    record.correctedBy = req.session.user._id;
    await record.save();

    await trackActivity(req.session.user._id, 'correct', 'attendance', { id });
    req.session.success = 'Attendance corrected';
    res.redirect('/attendance');
  } catch (err) {
    req.session.error = 'Correction failed';
    res.redirect('/attendance');
  }
};

exports.calendar = async (req, res) => {
  const empId = req.query.employee || req.session.user.employee?._id;
  const m = parseInt(req.query.month, 10) || new Date().getMonth() + 1;
  const y = parseInt(req.query.year, 10) || new Date().getFullYear();
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);

  const records = await Attendance.find({
    employee: empId,
    date: { $gte: start, $lte: end }
  });

  const employees = await Employee.find({ status: 'active' }).select('firstName lastName employeeId');
  res.render('attendance/calendar', {
    title: 'Attendance Calendar',
    records,
    employees,
    month: m,
    year: y,
    selectedEmployee: empId
  });
};

exports.markManual = async (req, res) => {
  try {
    const { employee, date, status } = req.body;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    await Attendance.findOneAndUpdate(
      { employee, date: d },
      {
        employee,
        date: d,
        status,
        isManualCorrection: true,
        correctedBy: req.session.user._id
      },
      { upsert: true, new: true }
    );

    req.session.success = 'Attendance marked';
    res.redirect('/attendance');
  } catch (err) {
    req.session.error = 'Failed to mark attendance';
    res.redirect('/attendance');
  }
};
