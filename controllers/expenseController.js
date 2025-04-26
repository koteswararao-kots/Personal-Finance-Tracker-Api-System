const Expense = require('../models/Expense');
const Ledger = require('../models/Ledger');


const categorizeExpense = (notes) => {
  // Define a list of categories and keywords for each category
  const categories = {
    Food: ['restaurant', 'groceries', 'meal', 'food', 'snack'],
    Travel: ['flight', 'hotel', 'taxi', 'travel', 'trip'],
    Entertainment: ['movie', 'concert', 'event', 'show', 'game'],
    Bills: ['electricity', 'water', 'internet', 'phone', 'utilities'],
    Shopping: ['clothes', 'shoes', 'electronics', 'gadget', 'shopping']
  };

  // Normalize the notes to lowercase for comparison
  const notesLower = notes.toLowerCase();

  // Check for keywords in notes and assign category
  for (let category in categories) {
    for (let keyword of categories[category]) {
      if (notesLower.includes(keyword)) {
        console.log("##categorized expense...", category)
        return category; 
      }
    }
  }

  return 'Miscellaneous'; // Default category if no match found
};

// Create a new expense
exports.createExpense = async (req, res) => {
  const { amount, category, date, tags, notes } = req.body;
  const userId = req.user._id;
 
  //auto-categorization of expenses based on input patterns
  const derivedCategory = category || categorizeExpense(notes); 
  try {
    const expense = new Expense({
      userId,
      amount,
      category: derivedCategory,
      date,
      tags,
      notes,
    });

    await expense.save();

    //record ledger log for create operation
    await Ledger.create({
      userId,
      operation: 'create',
      expenseData: expense.toObject(),
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { amount, category, date, tags, notes } = req.body;

  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      { amount, category, date, tags, notes },
      { new: true, runValidators: true }
    );
  
    //record ledger log for update operation
    // console.log("##expense", expense)
    await Ledger.create({
      userId,
      operation: 'update',
      expenseData: expense.toObject(),
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Get all expenses for the authenticated user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    const userId = req.user._id;
    
    //record ledger log for delete operation
    // console.log("###expense", expense)
    await Ledger.create({
      userId,
      operation: 'delete',
      expenseData: expense.toObject(),
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
