const settingsService = require('../services/settings.service');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('SettingsController');

const getProfile = asyncHandler((req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const data = settingsService.getProfile(req.user);
  res.json({ success: true, data });
});

const updateProfile = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const user = await settingsService.updateProfile({ userId: req.user._id, body: req.body });
  res.json({ success: true, data: user });
});

const updateNotifications = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const data = await settingsService.updateNotifications({ userId: req.user._id, body: req.body });
  res.json({ success: true, data });
});

const getApiKey = asyncHandler((req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const data = settingsService.getApiKey(req.user);
  res.json({ success: true, data });
});

const regenerateApiKey = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const data = await settingsService.regenerateApiKey(req.user._id);
  res.json({ success: true, data });
});

module.exports = { getProfile, updateProfile, updateNotifications, getApiKey, regenerateApiKey };
