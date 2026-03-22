const servingService = require('../services/serving.service');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('ServingController');

const serveAd = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { slotId: req.query.slot_id });
  const data = await servingService.serveAd(req.query.slot_id);
  res.json({ success: true, data });
});

const trackImpression = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { adId: req.params.adId });
  await servingService.trackImpression(req.params.adId);
  res.json({ success: true, message: 'Impression tracked' });
});

const trackClick = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { adId: req.params.adId });
  const result = await servingService.trackClick(req.params.adId);
  res.redirect(result.redirect);
});

module.exports = { serveAd, trackImpression, trackClick };
