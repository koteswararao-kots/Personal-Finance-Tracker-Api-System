const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  month: { type: String, required: true }, // Format: 'YYYY-MM'
  total: { type: Number, required: true },
  categories: [{ name: String, limit: Number }]
});

module.exports = mongoose.model('Budget', BudgetSchema);
