const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, deleteExpense, updateExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

//for expense crud operation
router.post('/', protect, createExpense); 
router.get('/', protect, getExpenses); 
router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense); 

module.exports = router;
