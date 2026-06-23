const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg
    }));
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(400).json({ success: false, errors: formatted });
    }
    return res.status(400).render('errors/400', {
      title: 'Validation Error',
      layout: 'layouts/error',
      errors: formatted,
      message: formatted.map((e) => e.message).join(', ')
    });
  }
  next();
};

module.exports = validate;
