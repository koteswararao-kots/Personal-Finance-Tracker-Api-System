const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  operation: { type: String, enum: ['create', 'update', 'delete'], required: true },
  expenseData: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Ledger = mongoose.model('Ledger', ledgerSchema);

module.exports = Ledger;