const { createTransporter } = require('../config/mail');

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[Email skipped] To: ${to}, Subject: ${subject}`);
    return { skipped: true };
  }
  return transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, '')
  });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  return sendEmail({
    to: user.email,
    subject: 'Password Reset - Payroll System',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password (valid for 1 hour):</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `
  });
};

const sendLeaveNotification = async (user, leave, status) => {
  return sendEmail({
    to: user.email,
    subject: `Leave ${status} - Payroll System`,
    html: `
      <h2>Leave Request ${status}</h2>
      <p>Your leave request from ${leave.startDate} to ${leave.endDate} has been ${status.toLowerCase()}.</p>
    `
  });
};

const sendPayrollNotification = async (user, payroll) => {
  return sendEmail({
    to: user.email,
    subject: 'Payroll Processed - Payroll System',
    html: `
      <h2>Payroll Notification</h2>
      <p>Your payroll for ${payroll.month}/${payroll.year} has been processed.</p>
      <p>Net Salary: ${payroll.netSalary}</p>
    `
  });
};

module.exports = { sendEmail, sendPasswordResetEmail, sendLeaveNotification, sendPayrollNotification };
