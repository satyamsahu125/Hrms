const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { isAuthenticated, authorize } = require('../middleware/auth');
const { ADMIN_ROLES } = require('../config/roles');

router.use(isAuthenticated);

router.get('/', attendanceController.index);
router.get('/calendar', attendanceController.calendar);
router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.post('/correct', authorize(...ADMIN_ROLES), attendanceController.correct);
router.post('/mark', authorize(...ADMIN_ROLES), attendanceController.markManual);

module.exports = router;
