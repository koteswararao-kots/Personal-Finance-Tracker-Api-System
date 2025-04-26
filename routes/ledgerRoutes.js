const express = require('express');
const router = express.Router();
const { reverseLastTransaction } = require('../controllers/ledgerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/expenses/reverse-last', protect, reverseLastTransaction);

module.exports = router;
