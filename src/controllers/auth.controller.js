const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const createLogger = require('../utils/logger');

const logger = createLogger('AuthController');

// POST /api/auth/register
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, companyName, website, websiteCategory } = req.body;

  if (role === 'admin') {
    return next(new AppError('Admin registration is not allowed', 403));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 400));
  }

  const userData = {
    name,
    email,
    password,
    role,
    status: role === 'publisher' ? 'pending' : 'approved',
  };
  if (role === 'advertiser' && companyName) userData.companyName = companyName;
  if (role === 'publisher') {
    if (website) userData.website = website;
    if (websiteCategory) userData.websiteCategory = websiteCategory;
  }

  const user = await User.create(userData);
  const token = generateToken(user._id);

  logger.info(`User registered: ${email} as ${role}`);
  res.status(201).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (user.status === 'blocked') {
    return next(new AppError('Your account has been blocked. Contact support.', 403));
  }

  const token = generateToken(user._id);
  logger.info(`User logged in: ${email}`);
  res.json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ success: true, data: user });
});

// PUT /api/auth/me
const updateMe = asyncHandler(async (req, res) => {
  const { name, companyName, website, websiteCategory, phone, avatar } = req.body;
  const update = {};
  if (name) update.name = name;
  if (companyName !== undefined) update.companyName = companyName;
  if (website !== undefined) update.website = website;
  if (websiteCategory !== undefined) update.websiteCategory = websiteCategory;
  if (phone !== undefined) update.phone = phone;
  if (avatar !== undefined) update.avatar = avatar;

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true }).select('-password');
  res.json({ success: true, data: user });
});

// PUT /api/auth/me/password
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!(await user.matchPassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 400));
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = { register, login, logout, getMe, updateMe, changePassword };
