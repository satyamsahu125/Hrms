const Department = require('../models/Department');
const Employee = require('../models/Employee');
const { trackActivity } = require('../middleware/audit');

exports.list = async (req, res) => {
  const departments = await Department.find()
    .populate('head', 'firstName lastName employeeId')
    .sort({ name: 1 });

  const counts = await Employee.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: '$department', count: { $sum: 1 } } }
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));

  res.render('departments/index', {
    title: 'Departments',
    departments,
    countMap
  });
};

exports.show = async (req, res) => {
  const department = await Department.findById(req.params.id).populate('head');
  if (!department) {
    req.session.error = 'Department not found';
    return res.redirect('/departments');
  }
  const employees = await Employee.find({ department: department._id, status: 'active' })
    .populate('department');
  res.render('departments/show', { title: department.name, department, employees });
};

exports.create = async (req, res) => {
  try {
    await Department.create(req.body);
    await trackActivity(req.session.user._id, 'create', 'department');
    req.session.success = 'Department created';
    res.redirect('/departments');
  } catch (err) {
    req.session.error = err.message;
    res.redirect('/departments');
  }
};

exports.update = async (req, res) => {
  try {
    await Department.findByIdAndUpdate(req.params.id, req.body);
    await trackActivity(req.session.user._id, 'update', 'department', { id: req.params.id });
    req.session.success = 'Department updated';
    res.redirect('/departments');
  } catch (err) {
    req.session.error = 'Update failed';
    res.redirect('/departments');
  }
};

exports.delete = async (req, res) => {
  const count = await Employee.countDocuments({ department: req.params.id, status: 'active' });
  if (count > 0) {
    req.session.error = 'Cannot delete department with active employees';
    return res.redirect('/departments');
  }
  await Department.findByIdAndUpdate(req.params.id, { isActive: false });
  req.session.success = 'Department deactivated';
  res.redirect('/departments');
};
