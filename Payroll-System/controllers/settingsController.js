const Settings = require('../models/Settings');
const { trackActivity } = require('../middleware/audit');

const getSettingsMap = async () => {
  const settings = await Settings.find();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
};

exports.index = async (req, res) => {
  const settings = await getSettingsMap();
  res.render('settings/index', {
    title: 'Settings',
    settings,
    company: settings.company || {},
    payroll: settings.payroll || {},
    tax: settings.tax || {},
    currency: settings.currency || { code: 'USD', symbol: '$' }
  });
};

exports.updateCompany = async (req, res) => {
  const { name, email, phone, address } = req.body;
  await Settings.findOneAndUpdate(
    { key: 'company' },
    { key: 'company', value: { name, email, phone, address }, category: 'company' },
    { upsert: true }
  );
  await trackActivity(req.session.user._id, 'update', 'settings', { section: 'company' });
  req.session.success = 'Company settings updated';
  res.redirect('/settings');
};

exports.updatePayroll = async (req, res) => {
  const { payDay, defaultPf, overtimeMultiplier } = req.body;
  await Settings.findOneAndUpdate(
    { key: 'payroll' },
    { key: 'payroll', value: { payDay, defaultPf, overtimeMultiplier }, category: 'payroll' },
    { upsert: true }
  );
  req.session.success = 'Payroll settings updated';
  res.redirect('/settings');
};

exports.updateTax = async (req, res) => {
  const { defaultTax } = req.body;
  await Settings.findOneAndUpdate(
    { key: 'tax' },
    { key: 'tax', value: { defaultTax }, category: 'tax' },
    { upsert: true }
  );
  req.session.success = 'Tax settings updated';
  res.redirect('/settings');
};

exports.updateCurrency = async (req, res) => {
  const { code, symbol } = req.body;
  await Settings.findOneAndUpdate(
    { key: 'currency' },
    { key: 'currency', value: { code, symbol }, category: 'currency' },
    { upsert: true }
  );
  req.session.success = 'Currency settings updated';
  res.redirect('/settings');
};
