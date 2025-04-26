const express = require('express');
const router = express.Router();
const { createOrUpdateBudget, getBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const { getBudgetVsActual } = require('../controllers/summaryController');


router.post('/', protect, createOrUpdateBudget); 
router.get('/', protect, getBudget); 

//Summaries with budget vs actual breakdown.
router.get('/summary/:month', protect, getBudgetVsActual); // 'month' format: 'YYYY-MM'

module.exports = router;
