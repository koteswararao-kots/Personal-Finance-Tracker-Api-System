const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  // console.log(req.headers)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Get token from Authorization header
  }

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId); // Attach user info to request object
    // console.log("protect user", req.user)
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};
