const express = require('express');
const router = express.Router();
const { registerUser, loginUser, simulateOtp } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/otp', simulateOtp);

module.exports = router;
