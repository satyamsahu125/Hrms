export class PayrollCalculator {
  static calculate(
    gross: number,
    pfPercent: number,
    esiPercent: number,
    taxPercent: number
  ) {
    const pf = gross * pfPercent / 100;
    const esi = gross * esiPercent / 100;
    const tax = gross * taxPercent / 100;

    return {
      
      netSalary: gross - pf - esi - tax
    };
  }
}