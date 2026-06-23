const crypto = require('crypto');

const generateEmployeeId = async (Employee, departmentCode) => {
  const prefix = (departmentCode || 'EMP').substring(0, 3).toUpperCase();
  const count = await Employee.countDocuments();
  const num = String(count + 1).padStart(4, '0');
  return `${prefix}${num}`;
};

const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const expires = Date.now() + 3600000;
  return { token, hash, expires };
};

const paginate = (page = 1, limit = 10) => {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  return { page: p, limit: l, skip: (p - 1) * l };
};

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(amount || 0);
};

const getMonthName = (month) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1] || '';
};

const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim();
};

const getWorkingDaysInMonth = (year, month) => {
  const days = new Date(year, month, 0).getDate();
  let working = 0;
  for (let d = 1; d <= days; d++) {
    const day = new Date(year, month - 1, d).getDay();
    if (day !== 0 && day !== 6) working++;
  }
  return working;
};

module.exports = {
  generateEmployeeId,
  generateResetToken,
  paginate,
  formatCurrency,
  getMonthName,
  sanitizeInput,
  getWorkingDaysInMonth
};
