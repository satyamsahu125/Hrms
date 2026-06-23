const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { isAuthenticated, authorize } = require('../middleware/auth');
const { ADMIN_ROLES } = require('../config/roles');

router.use(isAuthenticated);

router.get('/', departmentController.list);
router.get('/:id', departmentController.show);
router.post('/', authorize(...ADMIN_ROLES), departmentController.create);
router.put('/:id', authorize(...ADMIN_ROLES), departmentController.update);
router.delete('/:id', authorize(...ADMIN_ROLES), departmentController.delete);

module.exports = router;
