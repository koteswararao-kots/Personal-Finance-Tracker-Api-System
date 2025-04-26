const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

exports.getBudgetVsActual = async (req, res) => {
  const userId = req.user._id;
  const {month } = req.params; // 'month' format: 'YYYY-MM'
  console.log(req.params)

  try {
    // Fetch the user's budget for the given month
    const budget = await Budget.findOne({ userId, month });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found for this month' });
    }

    // Fetch the actual expenses for the given month
    const expenses = await Expense.find({ userId, date: { $gte: new Date(`${month}-01`), 
    $lt: new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1) } });

    // Summarize actual expenses by category
    const actualExpenses = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    console.log("##actual expernses", actualExpenses)

    // Compare budgeted vs actual expenses for each category
    const summary = budget.categories.map((category) => {
      const actualAmount = actualExpenses[category.name] || 0;
      const budgetedAmount = category.limit;
      const difference = budgetedAmount - actualAmount;

      return {
        category: category.name,
        budgetedAmount,
        actualAmount,
        difference,
      };
    });

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
