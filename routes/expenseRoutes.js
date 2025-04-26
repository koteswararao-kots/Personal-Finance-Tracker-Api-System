const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, deleteExpense, updateExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createExpense); // Protected route
router.put('/:id', protect, updateExpense); // Protected route for updating
router.get('/', protect, getExpenses); // Protected route
router.delete('/:id', protect, deleteExpense); // Protected route

module.exports = router;
