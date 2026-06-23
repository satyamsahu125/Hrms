const { ROLE_HIERARCHY } = require('../config/roles');

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
    return next();
  }
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  req.flash = req.flash || (() => ({}));
  return res.redirect('/auth/login');
};

const isGuest = (req, res, next) => {
  if (!req.session || !req.session.user) return next();
  return res.redirect('/dashboard');
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.session?.user) {
    return res.redirect('/auth/login');
  }
  if (roles.length === 0 || roles.includes(req.session.user.role)) {
    return next();
  }
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  return res.status(403).render('errors/403', {
    title: 'Access Denied',
    layout: 'layouts/error',
    message: 'You do not have permission to access this resource.'
  });
};

const authorizeMinLevel = (minRole) => (req, res, next) => {
  const userLevel = ROLE_HIERARCHY[req.session?.user?.role] || 0;
  const requiredLevel = ROLE_HIERARCHY[minRole] || 0;
  if (userLevel >= requiredLevel) return next();
  return res.status(403).render('errors/403', {
    title: 'Access Denied',
    layout: 'layouts/error'
  });
};

module.exports = { isAuthenticated, isGuest, authorize, authorizeMinLevel };
