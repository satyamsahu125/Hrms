const { body } = require('express-validator');

const employeeValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('department').notEmpty().withMessage('Department is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  body('joiningDate').isISO8601().withMessage('Valid joining date is required'),
  body('basicSalary').optional().isFloat({ min: 0 }).withMessage('Basic salary must be positive')
];

module.exports = { employeeValidation };
