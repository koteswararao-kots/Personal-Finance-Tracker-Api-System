const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User, AuditLog} = require('../models');

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    const audit = new AuditLog({ userId: user._id, action: 'signup' });
    await audit.save();


    const payload = {
      userId: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// User login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const payload = {
      userId: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const audit = new AuditLog({ userId: user._id, action: 'login' });
    await audit.save();

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.simulateOtp = (req, res) => {
  const { phoneOrEmail } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(`OTP for ${phoneOrEmail}: ${otp}`);
  res.json({ message: 'OTP sent (mocked)', otp });
};

