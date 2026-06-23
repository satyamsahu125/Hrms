const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isGuest } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require('../validations/authValidation');

router.get('/login', isGuest, authController.showLogin);
router.post('/login', isGuest, loginValidation, validate, authController.login);
router.get('/logout', authController.logout);
router.get('/forgot-password', isGuest, authController.showForgotPassword);
router.post('/forgot-password', isGuest, forgotPasswordValidation, validate, authController.forgotPassword);
router.get('/reset-password/:token', isGuest, authController.showResetPassword);
router.post('/reset-password/:token', isGuest, resetPasswordValidation, validate, authController.resetPassword);

module.exports = router;
