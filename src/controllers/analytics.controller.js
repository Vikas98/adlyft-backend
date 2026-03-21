const analyticsService = require('../services/analytics.service');
const createLogger = require('../utils/logger');

const logger = createLogger('AnalyticsController');

const getOverview = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
    const data = await analyticsService.getOverview(req.user._id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getTimeSeries = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
    const data = await analyticsService.getTimeSeries({ userId: req.user._id, range: req.query.range });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getPublisherAnalytics = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
    const data = await analyticsService.getPublisherAnalytics(req.user._id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getCampaignAnalytics = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
    const data = await analyticsService.getCampaignAnalytics(req.user._id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview, getTimeSeries, getPublisherAnalytics, getCampaignAnalytics };
