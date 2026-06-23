const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { isAuthenticated, authorize } = require('../middleware/auth');
const { ADMIN_ROLES, MANAGEMENT_ROLES } = require('../config/roles');

router.use(isAuthenticated);
router.use(authorize(...MANAGEMENT_ROLES));

router.get('/', reportController.index);
router.get('/payroll', reportController.payrollReport);
router.get('/attendance', reportController.attendanceReport);
router.get('/leave', reportController.leaveReport);
router.get('/employees', reportController.employeeReport);

module.exports = router;
