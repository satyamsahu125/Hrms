const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: { type: String, trim: true },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

departmentSchema.index({ name: 'text', code: 'text' });

module.exports = mongoose.model('Department', departmentSchema);
