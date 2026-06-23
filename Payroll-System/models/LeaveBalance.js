const mongoose = require('mongoose');
const { LEAVE_TYPES } = require('./Leave');

const leaveBalanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  year: { type: Number, required: true },
  balances: {
    annual: { type: Number, default: 12 },
    sick: { type: Number, default: 10 },
    casual: { type: Number, default: 5 },
    maternity: { type: Number, default: 90 },
    paternity: { type: Number, default: 15 },
    unpaid: { type: Number, default: 0 },
    comp_off: { type: Number, default: 0 }
  },
  used: {
    annual: { type: Number, default: 0 },
    sick: { type: Number, default: 0 },
    casual: { type: Number, default: 0 },
    maternity: { type: Number, default: 0 },
    paternity: { type: Number, default: 0 },
    unpaid: { type: Number, default: 0 },
    comp_off: { type: Number, default: 0 }
  }
}, { timestamps: true });

leaveBalanceSchema.index({ employee: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);
