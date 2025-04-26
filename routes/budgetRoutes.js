const express = require('express');
const router = express.Router();
const { createOrUpdateBudget, getBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const { getBudgetVsActual } = require('../controllers/summaryController');


router.post('/', protect, createOrUpdateBudget); // Protected route
router.get('/', protect, getBudget); // Protected route
router.get('/summary/:month', protect, getBudgetVsActual); // 'month' format: 'YYYY-MM'


module.exports = router;
