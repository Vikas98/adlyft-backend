const settingsService = require('../services/settings.service');
const createLogger = require('../utils/logger');

const logger = createLogger('SettingsController');

const getProfile = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const data = settingsService.getProfile(req.user);
  res.json({ success: true, data });
};

const updateProfile = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
    const user = await settingsService.updateProfile({ userId: req.user._id, body: req.body });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateNotifications = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
    const data = await settingsService.updateNotifications({ userId: req.user._id, body: req.body });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getApiKey = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const data = settingsService.getApiKey(req.user);
  res.json({ success: true, data });
};

const regenerateApiKey = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
    const data = await settingsService.regenerateApiKey(req.user._id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, updateNotifications, getApiKey, regenerateApiKey };
