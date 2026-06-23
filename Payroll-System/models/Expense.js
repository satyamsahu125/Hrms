const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['payroll', 'bonus', 'overtime', 'benefits', 'training', 'recruitment', 'other'],
    required: true
  },
  description: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  month: { type: Number, min: 1, max: 12 },
  year: { type: Number },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

expenseSchema.index({ year: 1, month: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
