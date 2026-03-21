const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const createLogger = require('../utils/logger');

const logger = createLogger('SettingsService');

const maskApiKey = (key) => {
  if (!key) return '****';
  return key.length > 8 ? key.slice(0, 4) + '****' + key.slice(-4) : '****';
};

const getProfile = (user) => {
  logger.debug('Getting user profile', { userId: user._id });
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    company: user.company,
    phone: user.phone,
    address: user.address,
    role: user.role,
    notificationPrefs: user.notificationPrefs,
  };
};

const updateProfile = async ({ userId, body }) => {
  logger.info('Updating user profile', { userId });
  const { name, company, phone, address } = body;
  const user = await User.findByIdAndUpdate(
    userId,
    { name, company, phone, address },
    { new: true, runValidators: true }
  ).select('-password');
  logger.info('User profile updated', { userId });
  return user;
};

const updateNotifications = async ({ userId, body }) => {
  logger.info('Updating notification preferences', { userId });
  const { emailAlerts, weeklyReports } = body;
  const user = await User.findByIdAndUpdate(
    userId,
    { 'notificationPrefs.emailAlerts': emailAlerts, 'notificationPrefs.weeklyReports': weeklyReports },
    { new: true }
  ).select('-password');
  logger.info('Notification preferences updated', { userId });
  return { notificationPrefs: user.notificationPrefs };
};

const getApiKey = (user) => {
  logger.debug('Getting API key (masked)', { userId: user._id });
  return { apiKey: maskApiKey(user.apiKey) };
};

const regenerateApiKey = async (userId) => {
  logger.info('Regenerating API key', { userId });
  const newKey = uuidv4();
  await User.findByIdAndUpdate(userId, { apiKey: newKey });
  logger.info('API key regenerated', { userId });
  return { apiKey: maskApiKey(newKey) };
};

module.exports = { getProfile, updateProfile, updateNotifications, getApiKey, regenerateApiKey };
