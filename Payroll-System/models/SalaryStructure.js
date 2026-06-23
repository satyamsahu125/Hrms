const mongoose = require('mongoose');

const salaryStructureSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    unique: true
  },
  basicSalary: { type: Number, required: true, min: 0 },
  hra: { type: Number, default: 0, min: 0 },
  da: { type: Number, default: 0, min: 0 },
  conveyance: { type: Number, default: 0, min: 0 },
  medical: { type: Number, default: 0, min: 0 },
  specialAllowance: { type: Number, default: 0, min: 0 },
  pfPercent: { type: Number, default: 12, min: 0, max: 100 },
  esiPercent: { type: Number, default: 0.75, min: 0, max: 100 },
  taxPercent: { type: Number, default: 10, min: 0, max: 100 },
  effectiveFrom: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

salaryStructureSchema.virtual('grossSalary').get(function () {
  return this.basicSalary + this.hra + this.da + this.conveyance + this.medical + this.specialAllowance;
});

salaryStructureSchema.set('toJSON', { virtuals: true });
salaryStructureSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('SalaryStructure', salaryStructureSchema);
