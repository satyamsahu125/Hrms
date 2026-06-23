const mongoose = require('mongoose');

const LEAVE_TYPES = ['annual', 'sick', 'casual', 'maternity', 'paternity', 'unpaid', 'comp_off'];
const LEAVE_STATUS = ['pending', 'approved', 'rejected', 'cancelled'];

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  leaveType: {
    type: String,
    enum: LEAVE_TYPES,
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true, min: 0.5 },
  reason: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: LEAVE_STATUS,
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: { type: String, trim: true }
}, { timestamps: true });

leaveSchema.index({ employee: 1, status: 1 });
leaveSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Leave', leaveSchema);
module.exports.LEAVE_TYPES = LEAVE_TYPES;
module.exports.LEAVE_STATUS = LEAVE_STATUS;
