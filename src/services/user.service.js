const User = require('../models/User');
const AppError = require('../utils/AppError');
const createLogger = require('../utils/logger');

const logger = createLogger('UserService');

const getUsers = async (query) => {
  const { page = 1, limit = 20, role } = query;
  const filter = {};
  if (role) filter.role = role;
  logger.debug('Fetching users', { filter, page, limit });
  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);
  return { data: users, total, page: Number(page), pages: Math.ceil(total / limit) };
};

const getUser = async (userId) => {
  logger.debug('Fetching user', { userId });
  const user = await User.findById(userId).select('-password');
  if (!user) {
    logger.warn('User not found', { userId });
    throw new AppError('User not found', 404);
  }
  return user;
};

const updateUser = async (userId, body) => {
  logger.info('Updating user', { userId });
  delete body.password;
  const user = await User.findByIdAndUpdate(userId, body, { new: true, runValidators: true }).select('-password');
  if (!user) {
    logger.warn('User not found for update', { userId });
    throw new AppError('User not found', 404);
  }
  return user;
};

const deleteUser = async (userId) => {
  logger.info('Deleting user', { userId });
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    logger.warn('User not found for deletion', { userId });
    throw new AppError('User not found', 404);
  }
  return user;
};

module.exports = { getUsers, getUser, updateUser, deleteUser };
