const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const exportToExcel = (data, sheetName = 'Report') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

const exportToCSV = (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  return XLSX.utils.sheet_to_csv(ws);
};

const generateSalarySlipPDF = (payroll, employee, company) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const companyName = company?.name || process.env.COMPANY_NAME || 'Company';
    doc.fontSize(20).text(companyName, { align: 'center' });
    doc.fontSize(12).text('Salary Slip', { align: 'center' });
    doc.moveDown();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    doc.fontSize(10).text(`Period: ${monthNames[payroll.month - 1]} ${payroll.year}`);
    doc.text(`Employee: ${employee.firstName} ${employee.lastName}`);
    doc.text(`ID: ${employee.employeeId}`);
    doc.text(`Designation: ${employee.designation}`);
    doc.moveDown();

    doc.fontSize(11).text('EARNINGS', { underline: true });
    const e = payroll.earnings;
    doc.fontSize(10);
    doc.text(`Basic Salary: ${e.basic}`);
    doc.text(`HRA: ${e.hra}`);
    doc.text(`DA: ${e.da}`);
    doc.text(`Bonus: ${e.bonus}`);
    doc.text(`Incentives: ${e.incentives}`);
    doc.text(`Overtime: ${e.overtime}`);
    doc.text(`Gross Salary: ${payroll.grossSalary}`, { underline: true });
    doc.moveDown();

    doc.fontSize(11).text('DEDUCTIONS', { underline: true });
    const d = payroll.deductions;
    doc.fontSize(10);
    doc.text(`PF: ${d.pf}`);
    doc.text(`ESI: ${d.esi}`);
    doc.text(`Tax: ${d.tax}`);
    doc.text(`Other: ${d.other}`);
    doc.text(`Total Deductions: ${payroll.totalDeductions}`, { underline: true });
    doc.moveDown();

    doc.fontSize(14).text(`Net Salary: ${payroll.netSalary}`, { align: 'right' });
    doc.moveDown(2);
    doc.fontSize(9).text('This is a computer-generated document.', { align: 'center' });
    doc.text('Authorized Signatory', 400, doc.y, { align: 'right' });

    doc.end();
  });
};

const generateReportPDF = (title, headers, rows) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text(title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(10);
    headers.forEach((h, i) => {
      if (rows[0]) doc.text(`${h}: ${rows[0][Object.keys(rows[0])[i]] || ''}`, { continued: false });
    });
    rows.forEach((row, idx) => {
      if (idx > 0) {
        doc.text(Object.values(row).join(' | '));
      }
    });
    doc.end();
  });
};

module.exports = { exportToExcel, exportToCSV, generateSalarySlipPDF, generateReportPDF };
