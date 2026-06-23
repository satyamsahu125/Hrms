const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { isAuthenticated, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/roles');

router.use(isAuthenticated);
router.use(authorize(ROLES.SUPER_ADMIN, ROLES.HR));

router.get('/', settingsController.index);
router.post('/company', settingsController.updateCompany);
router.post('/payroll', settingsController.updatePayroll);
router.post('/tax', settingsController.updateTax);
router.post('/currency', settingsController.updateCurrency);

module.exports = router;
