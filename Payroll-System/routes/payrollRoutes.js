const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { isAuthenticated, authorize } = require('../middleware/auth');
const { ADMIN_ROLES } = require('../config/roles');

router.use(isAuthenticated);

router.get('/', payrollController.index);
router.get('/:id/slip', payrollController.downloadSlip);
router.get('/:id', payrollController.show);
router.post('/generate', authorize(...ADMIN_ROLES), payrollController.generate);
router.post('/bulk-approve', authorize(...ADMIN_ROLES), payrollController.bulkApprove);
router.post('/:id/approve', authorize(...ADMIN_ROLES), payrollController.approve);

module.exports = router;
