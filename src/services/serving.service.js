const Ad = require('../models/Ad');
const AdSlot = require('../models/AdSlot');
const Campaign = require('../models/Campaign');
const Impression = require('../models/Impression');
const Click = require('../models/Click');
const AppError = require('../utils/AppError');
const { getCache, setCache, incrementCounter } = require('../config/redis');
const createLogger = require('../utils/logger');

const logger = createLogger('ServingService');

const serveAd = async (slotId) => {
  logger.info('Serving ad for slot', { slotId });
  if (!slotId) {
    throw new AppError('slot_id is required', 400);
  }

  const cacheKey = `ad:slot:${slotId}`;
  let adData = await getCache(cacheKey);

  if (adData) {
    logger.debug('Ad served from cache', { slotId });
    return adData;
  }

  const slot = await AdSlot.findOne({ slotId });
  if (!slot) {
    logger.warn('Slot not found', { slotId });
    throw new AppError('Slot not found', 404);
  }

  const campaign = await Campaign.findOne({ slotId: slot._id, status: 'active' }).populate('adId');
  if (!campaign || !campaign.adId) {
    logger.warn('No active campaign found for ad serving', { slotId });
    throw new AppError('No active ad for this slot', 404);
  }

  const ad = campaign.adId;
  adData = {
    ad_id: ad._id,
    campaign_id: campaign._id,
    publisher_id: slot.publisherId,
    slot_id: slot._id,
    image_url: ad.imageUrl,
    click_url: `/api/serve/click/${ad._id}`,
    impression_url: `/api/serve/impression/${ad._id}`,
    alt_text: ad.altText,
    size: ad.size,
  };
  await setCache(cacheKey, adData, 60);
  logger.info('Ad served and cached', { slotId, adId: ad._id, campaignId: campaign._id });
  return adData;
};

const trackImpression = async (adId) => {
  logger.info('Tracking impression', { adId });
  const ad = await Ad.findById(adId);
  if (!ad) {
    logger.warn('Ad not found for impression tracking', { adId });
    throw new AppError('Ad not found', 404);
  }

  const campaign = await Campaign.findOne({ adId, status: 'active' });
  if (!campaign) {
    logger.warn('No active campaign for impression tracking', { adId });
    throw new AppError('No active campaign for this ad', 404);
  }

  await Impression.create({
    adId,
    campaignId: campaign._id,
    publisherId: campaign.publisherId,
    slotId: campaign.slotId,
  });

  await Campaign.findByIdAndUpdate(campaign._id, { $inc: { totalImpressions: 1 } });
  await incrementCounter(`impressions:${campaign._id}`);
  logger.info('Impression tracked', { adId, campaignId: campaign._id });
};

const trackClick = async (adId) => {
  logger.info('Tracking click', { adId });
  const ad = await Ad.findById(adId);
  if (!ad) {
    logger.warn('Ad not found for click tracking', { adId });
    throw new AppError('Ad not found', 404);
  }

  const campaign = await Campaign.findOne({ adId, status: 'active' });
  if (!campaign) {
    logger.debug('No active campaign for click — redirecting to ad URL', { adId });
    return { redirect: ad.clickUrl || '/' };
  }

  await Click.create({
    adId,
    campaignId: campaign._id,
    publisherId: campaign.publisherId,
    slotId: campaign.slotId,
  });

  await Campaign.findByIdAndUpdate(campaign._id, { $inc: { totalClicks: 1 } });
  await incrementCounter(`clicks:${campaign._id}`);
  logger.info('Click tracked', { adId, campaignId: campaign._id });
  return { redirect: ad.clickUrl || '/' };
};

module.exports = { serveAd, trackImpression, trackClick };
