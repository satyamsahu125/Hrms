const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: { type: String, required: true },
  module: { type: String, required: true },
  resourceId: String,
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ user: 1, module: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
