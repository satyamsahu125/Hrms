const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 'EBADCSRFTOKEN') {
    if (req.session) {
      req.session.error = 'Session expired or invalid form. Please try again.';
    }
    const referer = req.get('Referer');
    if (referer && referer.includes(req.headers.host)) {
      return res.redirect(referer);
    }
    return res.status(403).render('errors/403', {
      title: 'Invalid Request',
      layout: 'layouts/error',
      message: 'Invalid CSRF token. Please refresh and try again.',
      appName: process.env.COMPANY_NAME || 'PayrollPro'
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(400).json({ success: false, errors: messages });
    }
    return res.status(400).render('errors/400', {
      title: 'Validation Error',
      layout: 'layouts/error',
      message: messages.join(', ')
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    const message = `${field} already exists`;
    if (req.xhr) return res.status(400).json({ success: false, message });
    return res.status(400).render('errors/400', {
      title: 'Duplicate Entry',
      layout: 'layouts/error',
      message
    });
  }

  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong'
    : err.message;

  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(status).json({ success: false, message });
  }

  res.status(status).render('errors/500', {
    title: 'Server Error',
    layout: 'layouts/error',
    message
  });
};

const notFound = (req, res) => {
  res.status(404).render('errors/404', {
    title: 'Page Not Found',
    layout: 'layouts/error',
    message: 'The page you are looking for does not exist.',
    appName: process.env.COMPANY_NAME || 'PayrollPro'
  });
};

module.exports = { errorHandler, notFound };
