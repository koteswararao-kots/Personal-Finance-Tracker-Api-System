const Expense = require('../models/Expense');

const reverseLastTransaction = async (req, res) => {
  const userId = req.user._id;

  try {
    const lastLog = await TransactionLog.findOne({ userId }).sort({ timestamp: -1 });

    if (!lastLog) return res.status(404).json({ message: 'No operations to reverse.' });

    const { operation, expenseData } = lastLog;

    if (operation === 'create') {
      await Expense.findByIdAndDelete(expenseData._id);
    } else if (operation === 'update') {
      await Expense.findByIdAndUpdate(expenseData._id, expenseData);
    } else if (operation === 'delete') {
      await Expense.create(expenseData);
    }

    // Optional: Archive this reversal separately or delete the last log
    res.status(200).json({ message: `Reversed ${operation} operation.` });
  } catch (error) {
    console.error('Reversal error:', error);
    res.status(500).json({ error: 'Could not reverse operation.' });
  }
};

module.exports = { reverseLastTransaction };

