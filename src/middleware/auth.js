const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/env');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Not authorized, no token provided', 401));
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return next(new AppError('User not found', 401));
    }
    next();
  } catch (error) {
    // JsonWebTokenError and TokenExpiredError are handled by the global error handler
    next(error);
  }
};

module.exports = { protect };
