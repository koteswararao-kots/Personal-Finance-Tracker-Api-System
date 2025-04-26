
const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    action: String,
    timestamp: { type: Date, default: Date.now }
  });
  

  const AuditLog =  mongoose.model('AuditLog', AuditLogSchema);
  module.exports = AuditLog;