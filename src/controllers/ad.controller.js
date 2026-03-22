const adService = require('../services/ad.service');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('AdController');

const uploadAd = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  // Support both upload.single('image') and upload.fields([{name:'file'},{name:'image'}])
  const file = req.file || (req.files && (req.files['file']?.[0] || req.files['image']?.[0]));
  const ad = await adService.uploadAd({ file, body: req.body, userId: req.user._id });
  logger.info('Responding 201 — ad uploaded', { adId: ad._id });
  res.status(201).json({ success: true, data: ad });
});

const getAd = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { adId: req.params.id });
  const ad = await adService.getAd({ adId: req.params.id, userId: req.user._id });
  res.json({ success: true, data: ad });
});

module.exports = { uploadAd, getAd };
