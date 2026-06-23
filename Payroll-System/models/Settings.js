const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  category: {
    type: String,
    enum: ['company', 'payroll', 'tax', 'currency', 'leave', 'attendance'],
    default: 'company'
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
