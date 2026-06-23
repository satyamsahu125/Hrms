const calculatePayroll = (salaryStructure, attendance = {}, extras = {}) => {
  const {
    basicSalary = 0,
    hra = 0,
    da = 0,
    conveyance = 0,
    medical = 0,
    specialAllowance = 0,
    pfPercent = 12,
    esiPercent = 0.75,
    taxPercent = 10
  } = salaryStructure;

  const workingDays = attendance.workingDays || 22;
  const presentDays = attendance.presentDays || workingDays;
  const attendanceRatio = workingDays > 0 ? presentDays / workingDays : 1;

  const basic = Math.round(basicSalary * attendanceRatio);
  const hraAmt = Math.round(hra * attendanceRatio);
  const daAmt = Math.round(da * attendanceRatio);
  const conveyanceAmt = Math.round(conveyance * attendanceRatio);
  const medicalAmt = Math.round(medical * attendanceRatio);
  const specialAmt = Math.round(specialAllowance * attendanceRatio);
  const bonus = extras.bonus || 0;
  const incentives = extras.incentives || 0;
  const overtime = extras.overtime || 0;

  const grossSalary = basic + hraAmt + daAmt + conveyanceAmt + medicalAmt +
    specialAmt + bonus + incentives + overtime;

  const pf = Math.round((basic * pfPercent) / 100);
  const esi = Math.round((grossSalary * esiPercent) / 100);
  const tax = Math.round((grossSalary * taxPercent) / 100);
  const other = extras.otherDeductions || 0;

  const totalDeductions = pf + esi + tax + other;
  const netSalary = grossSalary - totalDeductions;

  return {
    earnings: {
      basic,
      hra: hraAmt,
      da: daAmt,
      conveyance: conveyanceAmt,
      medical: medicalAmt,
      specialAllowance: specialAmt,
      bonus,
      incentives,
      overtime
    },
    deductions: { pf, esi, tax, other },
    grossSalary,
    totalDeductions,
    netSalary,
    workingDays,
    presentDays
  };
};

module.exports = { calculatePayroll };
