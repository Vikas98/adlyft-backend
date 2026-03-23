const User = require('../../models/User');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

const blockUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: 'blocked' }, { new: true }).select('-password');
  if (!user) return next(new AppError('User not found', 404));
  res.json({ success: true, data: user, message: 'User blocked' });
});

const unblockUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true }).select('-password');
  if (!user) return next(new AppError('User not found', 404));
  res.json({ success: true, data: user, message: 'User unblocked' });
});

module.exports = { listUsers, blockUser, unblockUser };
