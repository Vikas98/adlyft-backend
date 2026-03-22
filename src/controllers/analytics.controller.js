const analyticsService = require('../services/analytics.service');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('AnalyticsController');

const getOverview = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const data = await analyticsService.getOverview(req.user._id);
  res.json({ success: true, data });
});

const getTimeSeries = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const data = await analyticsService.getTimeSeries({ userId: req.user._id, range: req.query.range });
  res.json({ success: true, data });
});

const getPublisherAnalytics = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const data = await analyticsService.getPublisherAnalytics(req.user._id);
  res.json({ success: true, data });
});

const getCampaignAnalytics = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const data = await analyticsService.getCampaignAnalytics(req.user._id);
  res.json({ success: true, data });
});

module.exports = { getOverview, getTimeSeries, getPublisherAnalytics, getCampaignAnalytics };
