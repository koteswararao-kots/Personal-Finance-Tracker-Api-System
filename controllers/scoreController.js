const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const UserScore = require('../models/UserScore');

exports.generateUserScore = async (req, res) => {
  const userId = req.user._id
  const { month } = req.params;

  try {
    // 1. Budget adherence
    const budget = await Budget.findOne({ userId, month });
    if (!budget) return res.status(404).json({ error: 'Budget not found for this month' });

    const expenses = await Expense.find({
      userId,
      date: { $gte: new Date(`${month}-01`), $lt: new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1) }
    });

    const actualExpensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    let budgetAdherence = 0;
    let totalBudgeted = 0;
    let totalActual = 0;
    
    budget.categories.forEach((category) => {
      const actualAmount = actualExpensesByCategory[category.name] || 0;
      const budgetedAmount = category.limit;
      const categoryAdherence = Math.min(100, (actualAmount / budgetedAmount) * 100);
      budgetAdherence += categoryAdherence;
      totalBudgeted += budgetedAmount;
      totalActual += actualAmount;
    });

    // Average budget adherence across all categories and scale to 30% max
    budgetAdherence = (budgetAdherence / budget.categories.length) * 0.3;

    // 2. Frequency of usage
    const activeDays = new Set(expenses.map((expense) => new Date(expense.date).getDate()));
    // const totalDaysInMonth = new Date(`${month}-01`).getDate();
    const totalDaysInMonth = new Date(`${month}-01`);
    totalDaysInMonth.setMonth(totalDaysInMonth.getMonth() + 1);
    totalDaysInMonth.setDate(0);
    const  days = totalDaysInMonth.getDate();
    const frequencyUsage = ((activeDays.size / days) * 100) * 0.3; // Scaled to 30% max

    // 3. Expense tracking discipline
    const totalExpenses = expenses.length;
    const trackedExpenses = expenses.filter(
      (expense) => expense.category && expense.tags && expense.tags.length > 0
    ).length;
    const expenseDiscipline = ((trackedExpenses / totalExpenses) * 100) * 0.4; // Scaled to 40% max

    // Calculate the final score, ensuring it doesn't exceed 100
    const finalScore = Math.min(100, budgetAdherence + frequencyUsage + expenseDiscipline);

    // Save the score to the UserScore model
    const userScore = new UserScore({
      userId,
      month,
      score: finalScore,
      breakdown: {
        budgetAdherence,
        frequencyUsage,
        expenseDiscipline,
      },
    });

    await userScore.save();

    res.json({ score: finalScore, breakdown: userScore.breakdown });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating user score', details: err.message });
  }
};
