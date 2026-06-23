const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { isAuthenticated, authorize } = require('../middleware/auth');
const { MANAGEMENT_ROLES } = require('../config/roles');

router.use(isAuthenticated);

router.get('/', leaveController.index);
router.get('/apply', leaveController.applyForm);
router.post('/apply', leaveController.apply);
router.get('/balance', leaveController.balance);
router.post('/:id/action', authorize(...MANAGEMENT_ROLES), leaveController.approve);

module.exports = router;
