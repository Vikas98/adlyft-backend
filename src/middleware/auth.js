const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/env');
const AppError = require('../utils/AppError');

// Verify JWT and attach user to req.user
const authenticate = async (req, res, next) => {
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
    next(error);
  }
};

// Check user role
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('Access denied: insufficient role', 403));
  }
  next();
};

// Check publisher is approved
const requireApproved = (req, res, next) => {
  if (req.user.status !== 'approved') {
    return next(new AppError('Your account is pending approval by admin', 403));
  }
  next();
};

// Keep protect as alias for authenticate for backward compat
const protect = authenticate;

// Keep adminOnly for backward compat
const adminOnly = requireRole('admin');

module.exports = { authenticate, requireRole, requireApproved, protect, adminOnly };
