const flash = (req, res, next) => {
  if (!req.session) return next();
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  res.locals.info = req.session.info || null;
  delete req.session.success;
  delete req.session.error;
  delete req.session.info;
  next();
};

const setFlash = (req, type, message) => {
  req.session[type] = message;
};

module.exports = { flash, setFlash };
