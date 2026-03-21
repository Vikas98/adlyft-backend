const Ad = require('../models/Ad');
const Activity = require('../models/Activity');
const path = require('path');
const createLogger = require('../utils/logger');

const logger = createLogger('AdService');

const uploadAd = async ({ file, body, userId }) => {
  logger.info('Uploading new ad creative', { userId });
  if (!file) {
    const err = new Error('No image file uploaded');
    err.statusCode = 400;
    throw err;
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
    const err = new Error('Ad not found');
    err.statusCode = 404;
    throw err;
  }
  return ad;
};

module.exports = { uploadAd, getAd };
