const Employee = require('../models/Employee');
const Department = require('../models/Department');
const User = require('../models/User');
const SalaryStructure = require('../models/SalaryStructure');
const LeaveBalance = require('../models/LeaveBalance');
const { generateEmployeeId, paginate } = require('../utils/helpers');
const { trackActivity } = require('../middleware/audit');
const { ROLES } = require('../config/roles');

exports.list = async (req, res) => {
  const { page, limit, skip } = paginate(req.query.page, req.query.limit);
  const filter = {};
  if (req.query.department) filter.department = req.query.department;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { firstName: new RegExp(req.query.search, 'i') },
      { lastName: new RegExp(req.query.search, 'i') },
      { email: new RegExp(req.query.search, 'i') },
      { employeeId: new RegExp(req.query.search, 'i') }
    ];
  }

  const [employees, total, departments] = await Promise.all([
    Employee.find(filter)
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Employee.countDocuments(filter),
    Department.find({ isActive: true })
  ]);

  res.render('employees/index', {
    title: 'Employees',
    employees,
    departments,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    filters: req.query
  });
};

exports.show = async (req, res) => {
  const employee = await Employee.findById(req.params.id)
    .populate('department')
    .populate('salaryStructure')
    .populate('manager', 'firstName lastName employeeId');
  if (!employee) {
    req.session.error = 'Employee not found';
    return res.redirect('/employees');
  }
  const leaveBalance = await LeaveBalance.findOne({
    employee: employee._id,
    year: new Date().getFullYear()
  });
  res.render('employees/show', { title: 'Employee Profile', employee, leaveBalance });
};

exports.createForm = async (req, res) => {
  const departments = await Department.find({ isActive: true });
  const managers = await Employee.find({ status: 'active' }).select('firstName lastName employeeId');
  res.render('employees/create', { title: 'Add Employee', departments, managers });
};

exports.create = async (req, res) => {
  try {
    const dept = await Department.findById(req.body.department);
    const employeeId = await generateEmployeeId(Employee, dept?.code);

    const employee = await Employee.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      department: req.body.department,
      designation: req.body.designation,
      joiningDate: new Date(req.body.joiningDate),
      dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
      employeeId,
      employmentType: req.body.employmentType || 'full_time',
      status: 'active'
    });

    if (req.file) {
      employee.profilePhoto = `/uploads/profiles/${req.file.filename}`;
      await employee.save();
    }

    const salary = await SalaryStructure.create({
      employee: employee._id,
      basicSalary: parseFloat(req.body.basicSalary) || 0,
      hra: parseFloat(req.body.hra) || 0,
      da: parseFloat(req.body.da) || 0,
      conveyance: parseFloat(req.body.conveyance) || 0,
      medical: parseFloat(req.body.medical) || 0,
      specialAllowance: parseFloat(req.body.specialAllowance) || 0
    });
    employee.salaryStructure = salary._id;
    await employee.save();

    if (req.body.createUser === 'on') {
      const user = await User.create({
        email: req.body.email,
        password: req.body.password || 'Employee@123',
        role: req.body.userRole || ROLES.EMPLOYEE,
        employee: employee._id
      });
      employee.user = user._id;
      await employee.save();
    }

    await LeaveBalance.create({
      employee: employee._id,
      year: new Date().getFullYear()
    });

    await trackActivity(req.session.user._id, 'create', 'employee', { id: employee._id });
    req.session.success = 'Employee created successfully';
    res.redirect('/employees');
  } catch (err) {
    console.error(err);
    req.session.error = err.message || 'Failed to create employee';
    res.redirect('/employees/create');
  }
};

exports.editForm = async (req, res) => {
  const [employee, departments, managers] = await Promise.all([
    Employee.findById(req.params.id).populate('salaryStructure'),
    Department.find({ isActive: true }),
    Employee.find({ status: 'active', _id: { $ne: req.params.id } })
  ]);
  if (!employee) {
    req.session.error = 'Employee not found';
    return res.redirect('/employees');
  }
  res.render('employees/edit', { title: 'Edit Employee', employee, departments, managers });
};

exports.update = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      req.session.error = 'Employee not found';
      return res.redirect('/employees');
    }

    Object.assign(employee, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      department: req.body.department,
      designation: req.body.designation,
      status: req.body.status,
      employmentType: req.body.employmentType,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      manager: req.body.manager || undefined,
      bankDetails: {
        accountName: req.body.accountName,
        accountNumber: req.body.accountNumber,
        bankName: req.body.bankName,
        ifscCode: req.body.ifscCode,
        branch: req.body.branch
      },
      emergencyContact: {
        name: req.body.emergencyName,
        relationship: req.body.emergencyRelationship,
        phone: req.body.emergencyPhone
      }
    });

    if (req.file) {
      employee.profilePhoto = `/uploads/profiles/${req.file.filename}`;
    }

    await employee.save();

    if (req.body.basicSalary) {
      await SalaryStructure.findOneAndUpdate(
        { employee: employee._id },
        {
          basicSalary: parseFloat(req.body.basicSalary),
          hra: parseFloat(req.body.hra) || 0,
          da: parseFloat(req.body.da) || 0,
          conveyance: parseFloat(req.body.conveyance) || 0,
          medical: parseFloat(req.body.medical) || 0,
          specialAllowance: parseFloat(req.body.specialAllowance) || 0
        },
        { upsert: true }
      );
    }

    await trackActivity(req.session.user._id, 'update', 'employee', { id: employee._id });
    req.session.success = 'Employee updated successfully';
    res.redirect(`/employees/${employee._id}`);
  } catch (err) {
    req.session.error = 'Failed to update employee';
    res.redirect(`/employees/${req.params.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, { status: 'terminated' });
    await trackActivity(req.session.user._id, 'delete', 'employee', { id: req.params.id });
    req.session.success = 'Employee deactivated';
    res.redirect('/employees');
  } catch (err) {
    req.session.error = 'Failed to delete employee';
    res.redirect('/employees');
  }
};
