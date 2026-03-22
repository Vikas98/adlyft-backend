const Campaign = require('../models/Campaign');
const Activity = require('../models/Activity');
const AppError = require('../utils/AppError');
const createLogger = require('../utils/logger');
const notificationService = require('./notification.service');

const logger = createLogger('CampaignService');

const getCampaigns = async ({ userId, status, page = 1, limit = 10 }) => {
  logger.info('Fetching campaigns', { userId, status, page, limit });
  const filter = { advertiserId: userId };
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [campaigns, total] = await Promise.all([
    Campaign.find(filter)
      .populate('publisherId', 'name appName')
      .populate('slotId', 'name size type')
      .populate('adId', 'imageUrl clickUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Campaign.countDocuments(filter),
  ]);

  logger.debug('Campaigns fetched', { userId, count: campaigns.length, total });
  return {
    data: campaigns,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  };
};

const getCampaign = async ({ campaignId, userId }) => {
  logger.debug('Fetching campaign', { campaignId, userId });
  const campaign = await Campaign.findOne({ _id: campaignId, advertiserId: userId })
    .populate('publisherId')
    .populate('slotId')
    .populate('adId');
  if (!campaign) {
    logger.warn('Campaign not found', { campaignId, userId });
    throw new AppError('Campaign not found', 404);
  }
  return campaign;
};

const createCampaign = async ({ body, userId }) => {
  logger.info('Creating campaign', { userId, name: body.name });
  const { name, objective, publisherId, slotId, adId, startDate, endDate, dailyBudget } = body;
  const totalBudget = body.totalBudget ?? body.budget;
  const campaign = await Campaign.create({
    advertiserId: userId,
    name, objective, publisherId, slotId, adId, startDate, endDate,
    dailyBudget: dailyBudget || 0,
    totalBudget: totalBudget || 0,
    status: 'draft',
  });

  await Activity.create({
    userId,
    type: 'campaign_created',
    message: `Campaign "${name}" was created`,
    metadata: { campaignId: campaign._id },
  });

  await notificationService.createNotification({
    userId,
    type: 'campaign_created',
    title: 'Campaign Created',
    message: `Your campaign "${name}" has been created successfully.`,
    metadata: { campaignId: campaign._id },
  });

  logger.info('Campaign created successfully', { campaignId: campaign._id, userId });
  return campaign;
};

const updateCampaign = async ({ campaignId, userId, body }) => {
  logger.info('Updating campaign', { campaignId, userId });
  const { name, startDate, endDate, dailyBudget, totalBudget, status, publisherId, slotId, adId, objective } = body;
  const campaign = await Campaign.findOneAndUpdate(
    { _id: campaignId, advertiserId: userId },
    { name, startDate, endDate, dailyBudget, totalBudget, status, publisherId, slotId, adId, objective },
    { new: true, runValidators: true }
  );
  if (!campaign) {
    logger.warn('Campaign not found for update', { campaignId, userId });
    throw new AppError('Campaign not found', 404);
  }
  logger.info('Campaign updated successfully', { campaignId, userId });
  return campaign;
};

const updateCampaignStatus = async ({ campaignId, userId, status }) => {
  logger.info('Updating campaign status', { campaignId, userId, status });
  const allowed = ['draft', 'active', 'paused', 'completed'];
  if (!allowed.includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const campaign = await Campaign.findOneAndUpdate(
    { _id: campaignId, advertiserId: userId },
    { status },
    { new: true }
  );
  if (!campaign) {
    logger.warn('Campaign not found for status update', { campaignId, userId });
    throw new AppError('Campaign not found', 404);
  }

  let activityType = 'campaign_created';
  if (status === 'active') {
    activityType = 'campaign_launched';
  } else if (status === 'paused') {
    activityType = 'campaign_paused';
  }

  await Activity.create({
    userId,
    type: activityType,
    message: `Campaign "${campaign.name}" status changed to ${status}`,
    metadata: { campaignId: campaign._id, status },
  });

  let notificationTitle = 'Campaign Updated';
  let notificationType = activityType;
  if (status === 'active') {
    notificationTitle = 'Campaign Launched';
  } else if (status === 'paused') {
    notificationTitle = 'Campaign Paused';
  } else if (status === 'completed') {
    notificationType = 'campaign_completed';
    notificationTitle = 'Campaign Completed';
  }

  await notificationService.createNotification({
    userId,
    type: notificationType,
    title: notificationTitle,
    message: `Campaign "${campaign.name}" status changed to ${status}.`,
    metadata: { campaignId: campaign._id, status },
  });

  logger.info('Campaign status updated', { campaignId, status });
  return campaign;
};

const deleteCampaign = async ({ campaignId, userId }) => {
  logger.info('Deleting campaign', { campaignId, userId });
  const campaign = await Campaign.findOne({ _id: campaignId, advertiserId: userId });
  if (!campaign) {
    logger.warn('Campaign not found for deletion', { campaignId, userId });
    throw new AppError('Campaign not found', 404);
  }
  if (campaign.status !== 'draft') {
    logger.warn('Attempt to delete non-draft campaign', { campaignId, status: campaign.status });
    throw new AppError('Only draft campaigns can be deleted', 400);
  }
  await campaign.deleteOne();
  logger.info('Campaign deleted', { campaignId, userId });
};

module.exports = { getCampaigns, getCampaign, createCampaign, updateCampaign, updateCampaignStatus, deleteCampaign };
