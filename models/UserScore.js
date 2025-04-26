const mongoose = require('mongoose');

const UserScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  month: { type: String, required: true }, // Format: 'YYYY-MM'
  score: { type: Number, required: true },
  breakdown: {
    budgetAdherence: { type: Number },
    frequencyUsage: { type: Number },
    expenseDiscipline: { type: Number },
  }
});

module.exports = mongoose.model('UserScore', UserScoreSchema);
