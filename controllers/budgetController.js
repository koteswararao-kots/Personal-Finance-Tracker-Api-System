const Budget = require('../models/Budget');

exports.createOrUpdateBudget = async (req, res) => {
  const { month, total, categories } = req.body;
  const userId = req.user._id;

  try {
    const updated = await Budget.findOneAndUpdate(
      { userId, month },
      { total, categories },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Get user's budget details
exports.getBudget = async (req, res) => {
  const userId = req.user._id;
  try {
    const budget = await Budget.find({ userId });
    if (!budget) return res.status(404).json({ error: 'Budget not found' });

    res.json({ budget });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching budget', details: err.message });
  }
};
