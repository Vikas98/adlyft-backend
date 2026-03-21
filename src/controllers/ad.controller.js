const adService = require('../services/ad.service');
const createLogger = require('../utils/logger');

const logger = createLogger('AdController');

const uploadAd = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
    const ad = await adService.uploadAd({ file: req.file, body: req.body, userId: req.user._id });
    logger.info('Responding 201 — ad uploaded', { adId: ad._id });
    res.status(201).json({ success: true, data: ad });
  } catch (error) {
    next(error);
  }
};

const getAd = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { adId: req.params.id });
    const ad = await adService.getAd({ adId: req.params.id, userId: req.user._id });
    res.json({ success: true, data: ad });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadAd, getAd };
