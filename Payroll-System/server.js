require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const { applyCsrf } = require('./middleware/csrf');

const connectDB = require('./config/database');
const sessionConfig = require('./config/session');
const { sanitizeBody } = require('./middleware/security');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { flash } = require('./middleware/flash');

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https://cdn.jsdelivr.net']
    }
  }
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(sanitizeBody);

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

app.use(session(sessionConfig));
app.use(flash);

app.use((req, res, next) => {
  res.locals.appName = process.env.COMPANY_NAME || 'PayrollPro';
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(applyCsrf);

app.use((req, res, next) => {
  try {
    res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
  } catch {
    res.locals.csrfToken = '';
  }
  res.locals.currentPath = req.path;
  next();
});

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));
app.use('/employees', require('./routes/employeeRoutes'));
app.use('/departments', require('./routes/departmentRoutes'));
app.use('/attendance', require('./routes/attendanceRoutes'));
app.use('/leave', require('./routes/leaveRoutes'));
app.use('/payroll', require('./routes/payrollRoutes'));
app.use('/reports', require('./routes/reportRoutes'));
app.use('/settings', require('./routes/settingsRoutes'));
app.use('/notifications', require('./routes/notificationRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Payroll System running on http://localhost:${PORT}`);
});

module.exports = app;
