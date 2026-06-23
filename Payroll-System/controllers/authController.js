const User = require('../models/User');
const crypto = require('crypto');
const { generateResetToken } = require('../utils/helpers');
const { sendPasswordResetEmail } = require('../services/emailService');
const { trackActivity } = require('../middleware/audit');

exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Login', layout: 'layouts/auth' });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true })
      .populate('employee', 'firstName lastName employeeId profilePhoto');

    if (!user || !(await user.comparePassword(password))) {
      req.session.error = 'Invalid email or password';
      return res.redirect('/auth/login');
    }

    user.lastLogin = new Date();
    await user.save();

    req.session.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      employee: user.employee
    };

    await trackActivity(user._id, 'login', 'auth');
    res.redirect('/dashboard');
  } catch (err) {
    req.session.error = 'Login failed. Please try again.';
    res.redirect('/auth/login');
  }
};

exports.logout = async (req, res) => {
  if (req.session.user) {
    await trackActivity(req.session.user._id, 'logout', 'auth');
  }
  req.session.destroy(() => res.redirect('/auth/login'));
};

exports.showForgotPassword = (req, res) => {
  res.render('auth/forgot-password', { title: 'Forgot Password', layout: 'layouts/auth' });
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
      req.session.info = 'If that email exists, a reset link has been sent.';
      return res.redirect('/auth/forgot-password');
    }

    const { token, hash, expires } = generateResetToken();
    user.resetPasswordToken = hash;
    user.resetPasswordExpires = new Date(expires);
    await user.save();

    const resetUrl = `${process.env.APP_URL}/auth/reset-password/${token}`;
    await sendPasswordResetEmail(user, resetUrl);

    req.session.success = 'Password reset link sent to your email.';
    res.redirect('/auth/login');
  } catch (err) {
    req.session.error = 'Unable to process request.';
    res.redirect('/auth/forgot-password');
  }
};

exports.showResetPassword = async (req, res) => {
  const hash = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hash,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.session.error = 'Invalid or expired reset token';
    return res.redirect('/auth/forgot-password');
  }

  res.render('auth/reset-password', {
    title: 'Reset Password',
    layout: 'layouts/auth',
    token: req.params.token
  });
};

exports.resetPassword = async (req, res) => {
  try {
    const hash = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.session.error = 'Invalid or expired reset token';
      return res.redirect('/auth/forgot-password');
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.session.success = 'Password updated successfully. Please login.';
    res.redirect('/auth/login');
  } catch (err) {
    req.session.error = 'Unable to reset password.';
    res.redirect(`/auth/reset-password/${req.params.token}`);
  }
};
