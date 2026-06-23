const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { isAuthenticated, authorize } = require('../middleware/auth');
const { uploadProfile } = require('../middleware/upload');
const validate = require('../middleware/validate');
const { employeeValidation } = require('../validations/employeeValidation');
const { ADMIN_ROLES } = require('../config/roles');
const { csrfProtection } = require('../middleware/csrf');

router.use(isAuthenticated);

router.get('/', employeeController.list);
router.get('/create', authorize(...ADMIN_ROLES), employeeController.createForm);
router.post('/create', authorize(...ADMIN_ROLES), uploadProfile.single('profilePhoto'),
  csrfProtection, employeeValidation, validate, employeeController.create);
router.get('/:id', employeeController.show);
router.get('/:id/edit', authorize(...ADMIN_ROLES), employeeController.editForm);
router.put('/:id', authorize(...ADMIN_ROLES), uploadProfile.single('profilePhoto'),
  csrfProtection, employeeController.update);
router.delete('/:id', authorize(...ADMIN_ROLES), employeeController.delete);

module.exports = router;
