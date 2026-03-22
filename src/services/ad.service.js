const Ad = require('../models/Ad');
const Activity = require('../models/Activity');
const AppError = require('../utils/AppError');
const path = require('path');
const createLogger = require('../utils/logger');
const notificationService = require('./notification.service');

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

  await notificationService.createNotification({
    userId,
    type: 'ad_uploaded',
    title: 'Ad Uploaded',
    message: 'Your ad creative has been uploaded and is pending review.',
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

const getAds = async ({ userId }) => {
  logger.debug('Fetching ads for user', { userId });
  const ads = await Ad.find({ advertiserId: userId }).sort({ createdAt: -1 });
  return { data: ads, total: ads.length };
};

const updateAd = async ({ adId, userId, body }) => {
  logger.info('Updating ad', { adId, userId });
  const ad = await Ad.findOneAndUpdate(
    { _id: adId, advertiserId: userId },
    body,
    { new: true, runValidators: true }
  );
  if (!ad) {
    logger.warn('Ad not found for update', { adId, userId });
    throw new AppError('Ad not found', 404);
  }
  return ad;
};

const deleteAd = async ({ adId, userId }) => {
  logger.info('Deleting ad', { adId, userId });
  const ad = await Ad.findOneAndDelete({ _id: adId, advertiserId: userId });
  if (!ad) {
    logger.warn('Ad not found for deletion', { adId, userId });
    throw new AppError('Ad not found', 404);
  }
  return ad;
};

module.exports = { uploadAd, getAd, getAds, updateAd, deleteAd };
