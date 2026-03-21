const servingService = require('../services/serving.service');
const createLogger = require('../utils/logger');

const logger = createLogger('ServingController');

const serveAd = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { slotId: req.query.slot_id });
    const data = await servingService.serveAd(req.query.slot_id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const trackImpression = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { adId: req.params.adId });
    await servingService.trackImpression(req.params.adId);
    res.json({ success: true, message: 'Impression tracked' });
  } catch (error) {
    next(error);
  }
};

const trackClick = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { adId: req.params.adId });
    const result = await servingService.trackClick(req.params.adId);
    res.redirect(result.redirect);
  } catch (error) {
    next(error);
  }
};

module.exports = { serveAd, trackImpression, trackClick };
