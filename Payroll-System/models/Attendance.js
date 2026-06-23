const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: Date,
  checkOut: Date,
  status: {
    type: String,
    enum: ['present', 'absent', 'half_day', 'late', 'on_leave', 'holiday'],
    default: 'absent'
  },
  overtimeHours: { type: Number, default: 0, min: 0 },
  workHours: { type: Number, default: 0, min: 0 },
  notes: { type: String, trim: true },
  correctedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isManualCorrection: { type: Boolean, default: false }
}, { timestamps: true });

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
