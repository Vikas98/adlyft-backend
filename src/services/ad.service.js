const Ad = require('../models/Ad');
const Activity = require('../models/Activity');
const AppError = require('../utils/AppError');
const path = require('path');
const createLogger = require('../utils/logger');

const logger = createLogger('AdService');

const uploadAd = async ({ file, body, userId }) => {
  logger.info('Uploading new ad creative', { userId });
  if (!file) {
    throw new AppError('No image file uploaded', 400);
  }

  const { campaignId, clickUrl, altText, size } = body;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const format = ['jpg', 'jpeg', 'png', 'gif'].includes(ext) ? (ext === 'jpeg' ? 'jpg' : ext) : 'jpg';

  const ad = await Ad.create({
    advertiserId: userId,
    campaignId: campaignId || null,
    imageUrl: `/uploads/${file.filename}`,
    clickUrl: clickUrl || '',
    altText: altText || '',
    size: size || '320x50',
    format,
    status: 'pending_review',
  });

  await Activity.create({
    userId,
    type: 'ad_uploaded',
    message: `New ad creative uploaded`,
    metadata: { adId: ad._id },
  });

  logger.info('Ad creative uploaded successfully', { adId: ad._id, userId });
  return ad;
};

const getAd = async ({ adId, userId }) => {
  logger.debug('Fetching ad', { adId, userId });
  const ad = await Ad.findOne({ _id: adId, advertiserId: userId });
  if (!ad) {
    logger.warn('Ad not found', { adId, userId });
    throw new AppError('Ad not found', 404);
  }
  return ad;
};

module.exports = { uploadAd, getAd };
