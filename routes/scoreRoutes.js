const express = require('express');
const router = express.Router();
const { generateUserScore } = require('../controllers/scoreController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:month', protect, generateUserScore); 

module.exports = router;
