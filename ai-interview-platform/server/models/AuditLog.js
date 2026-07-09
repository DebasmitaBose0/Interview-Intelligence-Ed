const mongoose = require('mongoose');
const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ipAddress: String,
  details: String,
  timestamp: { type: Date, default: Date.now }
});

auditLogSchema.index({ userId: 1, action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ ipAddress: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
