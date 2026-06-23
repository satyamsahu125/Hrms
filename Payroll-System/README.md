# PayrollPro — Enterprise Payroll Management System

A full-featured HRMS and payroll platform built with **Node.js**, **Express**, **MongoDB**, **EJS**, and **Bootstrap 5**. Designed as a modern SaaS-style admin dashboard for HR operations, payroll processing, attendance, and leave management.

## Features

- **Authentication** — Login, logout, forgot/reset password, session management, RBAC
- **Roles** — Super Admin, HR, Manager, Employee
- **Dashboard** — Analytics, charts (Chart.js), activity feed, notifications
- **Employee Management** — CRUD, profiles, photos, salary structure, bank details
- **Departments** — Organize teams and view department rosters
- **Attendance** — Check-in/out, overtime, calendar, manual corrections
- **Leave** — Apply, approve/reject, balance tracking, multiple leave types
- **Payroll** — Salary calculation (HRA, DA, PF, ESI, tax), generation, approval workflow
- **Salary Slips** — PDF generation (PDFKit)
- **Reports** — Export payroll, attendance, leave, employee data (Excel/CSV)
- **Notifications** — In-app alerts and email (Nodemailer)
- **Settings** — Company, payroll, tax, currency configuration
- **Security** — Helmet, CSRF, XSS sanitization, mongo-sanitize, rate limiting

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Node.js, Express, Mongoose |
| Frontend | EJS, Bootstrap 5, Bootstrap Icons, JavaScript |
| Database | MongoDB |
| Auth | express-session, bcryptjs, connect-mongo |
| Charts/Tables | Chart.js, DataTables, Axios |

## Project Structure

```
├── config/          # Database, session, mail, roles
├── controllers/     # MVC controllers
├── middleware/      # Auth, security, validation, audit
├── models/          # Mongoose schemas
├── routes/          # Express routes
├── services/        # Business logic
├── validations/     # express-validator rules
├── utils/           # Helpers, payroll calculator, exports
├── views/           # EJS templates
├── public/          # CSS, JS, images
├── seeders/         # Database seed script
├── uploads/         # Profile photos
└── server.js        # Application entry point
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+ (local or Atlas)

### Installation

```bash
# Clone or navigate to project
cd "Payroll System"

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# Seed the database
npm run seed

# Start development server
npm run dev
```

Open **http://localhost:5000**

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | rohitkashyap2418@gmail.com | Rohit@7088 |
| HR | sarah.j@acme.com | Employee@123 |
| Manager | james.c@acme.com | Employee@123 |
| Employee | emily.d@acme.com | Employee@123 |

## Docker Deployment

```bash
# Build and run with MongoDB
docker-compose up -d

# Seed database (first time)
docker-compose --profile seed run seed

# View logs
docker-compose logs -f app
```

App: http://localhost:5000  
MongoDB: localhost:27017

### Production Docker Notes

1. Set strong `SESSION_SECRET` in `.env` or compose environment
2. Use MongoDB Atlas or managed MongoDB for production
3. Configure SMTP for email notifications
4. Enable HTTPS behind a reverse proxy (nginx)
5. Set `NODE_ENV=production` and `cookie.secure: true`

## Environment Variables

See `.env.example` for all options:

- `MONGODB_URI` — MongoDB connection string
- `SESSION_SECRET` — Session encryption key
- `APP_URL` — Base URL for password reset links
- `SMTP_*` — Email configuration (optional)

## API-Ready Architecture

Routes are structured for future REST API expansion. Services layer separates business logic from controllers.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Production server |
| `npm run dev` | Development with nodemon |
| `npm run seed` | Populate sample data |

## Security

- Passwords hashed with bcrypt (12 rounds)
- CSRF protection on all authenticated forms
- Input sanitization (XSS + NoSQL injection)
- Helmet security headers
- Rate limiting on all routes
- Role-based route authorization

## License

MIT
