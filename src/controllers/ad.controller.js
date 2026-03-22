const adService = require('../services/ad.service');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('AdController');

const uploadAd = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const ad = await adService.uploadAd({ file: req.file, body: req.body, userId: req.user._id });
  logger.info('Responding 201 — ad uploaded', { adId: ad._id });
  res.status(201).json({ success: true, data: ad });
});

const getAd = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { adId: req.params.id });
  const ad = await adService.getAd({ adId: req.params.id, userId: req.user._id });
  res.json({ success: true, data: ad });
});

const getAds = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const result = await adService.getAds({ userId: req.user._id, ...req.query });
  res.json({ success: true, ...result });
});

const updateAd = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { adId: req.params.id });
  const ad = await adService.updateAd({ adId: req.params.id, userId: req.user._id, body: req.body });
  res.json({ success: true, data: ad });
});

const deleteAd = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { adId: req.params.id });
  await adService.deleteAd({ adId: req.params.id, userId: req.user._id });
  res.json({ success: true, message: 'Ad deleted' });
});

module.exports = { uploadAd, getAd, getAds, updateAd, deleteAd };
