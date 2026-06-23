const AuditLog = require('../models/AuditLog');

const auditLog = (action, module) => async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = function (data) {
    if (res.statusCode < 400) {
      logAction(req, action, module, data).catch(console.error);
    }
    return originalJson(data);
  };

  const originalRender = res.render.bind(res);
  res.render = function (view, options, callback) {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && res.statusCode < 400) {
      logAction(req, action, module).catch(console.error);
    }
    return originalRender(view, options, callback);
  };

  next();
};

const logAction = async (req, action, module, data = {}) => {
  await AuditLog.create({
    user: req.session?.user?._id,
    action,
    module,
    resourceId: req.params?.id || data?.id,
    details: { method: req.method, path: req.path, body: sanitizeBodyForLog(req.body) },
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
};

const sanitizeBodyForLog = (body) => {
  if (!body) return {};
  const copy = { ...body };
  delete copy.password;
  delete copy.confirmPassword;
  return copy;
};

const trackActivity = async (userId, action, module, details = {}) => {
  await AuditLog.create({
    user: userId,
    action,
    module,
    details
  });
};

module.exports = { auditLog, trackActivity };
