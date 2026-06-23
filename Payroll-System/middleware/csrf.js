const csrf = require('csurf');

const csrfProtection = csrf({ cookie: false });

/** Multipart employee forms must run multer before CSRF (csurf requirement). */
const skipGlobalCsrf = (req) => {
  if (req.path.startsWith('/auth')) return true;
  if (req.path === '/employees/create' && req.method === 'POST') return true;
  if (req.method === 'PUT' && /^\/employees\/[^/]+$/.test(req.path)) return true;
  return false;
};

const applyCsrf = (req, res, next) => {
  if (skipGlobalCsrf(req)) return next();
  csrfProtection(req, res, next);
};

module.exports = { csrfProtection, applyCsrf };
