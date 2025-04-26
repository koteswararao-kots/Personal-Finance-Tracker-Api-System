const { Expense, Budget, User } = require('../models'); 
const { sendMockNotification } = require('../utils/notificationSender'); 


exports.triggerNotifications = async () => {
  try {
    const users = await User.find(); // Get all uavailable users
    for (const user of users) { //for each user
      const expenses = await Expense.find({ userId: user._id }); // Find all expenses for the user
      const budgets = await Budget.find({ userId: user._id }); 
      
      // console.log(expenses)
     
      const now = new Date();
      // Set the time for today to midnight (00:00:00.000)
      now.setHours(0, 0, 0, 0);
      // Create the date 5 days ago and set the time to midnight as well
      const fiveDaysAgo = new Date(now);
      fiveDaysAgo.setDate(now.getDate() - 5);

      const recentExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date);
        expenseDate.setHours(0, 0, 0, 0);
        // console.log("##expenseData", expenseDate.getTime(), "fiveDaysAgo", fiveDaysAgo.getTime())
        return expenseDate.getTime() >= fiveDaysAgo.getTime();
      });

      if (recentExpenses.length === 0) {
        // console.log("##recentExpenses", recentExpenses)
        console.log(`[NOTIFY] User ${user._id} has not logged any expenses for the last 5+ days.`);

        //call mock api 
        await sendMockNotification(
          user._id,
          'inactive',
          'You haven’t logged any expenses in over 5 days.'
        );
      } 
      
      // Check for overspending in categories
      if (budgets && budgets.length > 0) {
        budgets.forEach(budget => {
          // For each budget, check if expenses have exceeded the category limits
          budget.categories.forEach(async (category) => {
            const categoryExpenses = expenses.filter(e => e.category === category.name);
            const totalSpent = categoryExpenses.reduce((total, expense) => total + expense.amount, 0);

            if (totalSpent > category.limit) {
              console.log(`[NOTIFY] User ${user._id} overspent in category "${category.name}". Spent: ${totalSpent}, Limit: ${category.limit}`);
              //call mock api 
              await sendMockNotification(
                user._id,
                'overspend',
                `Overspent in ${category.name}. Limit: ${category.limit}, Spent: ${totalSpent}`,
              );
            }
          });
        });
      }
    }
  } catch (err) {
    console.error('Error in notification job:', err);
  }
};
