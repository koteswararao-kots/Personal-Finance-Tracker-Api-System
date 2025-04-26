const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  tags: [String],
  notes: String,
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
